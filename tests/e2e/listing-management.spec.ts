import { test, expect, type Page } from '@playwright/test';
const user = { id:'11111111-1111-4111-8111-111111111111',aud:'authenticated',role:'authenticated',email:'owner@example.com',app_metadata:{provider:'email'},user_metadata:{full_name:'Vehicle Owner'},created_at:new Date().toISOString() };
const vehicle = {
 id:'22222222-2222-4222-8222-222222222222',user_id:user.id,category:'used-cars',title:'2021 Maruti Suzuki Swift',brand:'Maruti Suzuki',model:'Swift',year:2021,mileage:35000,price:525000,fuel:'Petrol',transmission:'Manual',owners:'1st owner',location:'Indiranagar',seller_name:'Vehicle Owner',negotiable:true,description:'A well maintained car with full service history. Available for inspection in Indiranagar.',photos:['/vehicles/used-cars-cutout.webp'],status:'active',created_at:new Date().toISOString(),updated_at:new Date().toISOString(),
};
async function signIn(page:Page) {
 await page.route('**/auth/v1/token**',route=>route.fulfill({json:{access_token:'test-token',refresh_token:'test-refresh',token_type:'bearer',expires_in:3600,user}}));
 await page.route('**/auth/v1/user',route=>route.fulfill({json:user}));
 await page.goto('/auth?redirectTo=%2Fmarketplace%2Fmy-listings');
 await page.getByLabel('Email',{exact:true}).fill(user.email);
 await page.getByLabel('Password',{exact:true}).fill('test-password');
 await page.getByRole('button',{name:'Sign in',exact:true}).click();
 await expect(page.getByRole('heading',{name:'My Listings',exact:true})).toBeVisible();
}
test('sidebar has My Listings and Saved, with a dedicated saved page',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.route('**/api/marketplace*',route=>route.fulfill({json:{available:true,listings:[vehicle]}}));
 await signIn(page);
 await page.getByRole('button',{name:'Open menu'}).click();
 await expect(page.getByRole('link',{name:'My Listings',exact:true}).last()).toHaveAttribute('href','/marketplace/my-listings');
 await expect(page.getByRole('link',{name:'My orders',exact:true})).toHaveCount(0);
 await page.getByRole('link',{name:'Saved',exact:true}).last().click();
 await expect(page).toHaveURL(/marketplace\/saved/);
 await expect(page.getByRole('heading',{name:'Saved vehicles',exact:true})).toBeVisible();
});
test('seller can edit, submit for review, archive, relist, mark sold and delete',async({page})=>{
 let listing={...vehicle};
 let deleted=false;
 await page.route('**/api/chats',route=>route.fulfill({json:{conversations:[]}}));
 await page.route('**/api/marketplace?mine=true',route=>route.fulfill({json:{available:true,listings:deleted?[]:[listing]}}));
 await page.route(`**/api/marketplace/${vehicle.id}`,async route=>{
  const request=route.request();
  if(request.method()==='PUT') {
   expect(request.postData()).toContain('Swift updated listing');
   expect(request.postData()).toContain('photoOrder');
   listing={...listing,title:'Swift updated listing',status:'pending'};
   return route.fulfill({json:{listing}});
  }
  if(request.method()==='PATCH') {
   listing={...listing,status:request.postDataJSON().status};
   return route.fulfill({json:{listing}});
  }
  if(request.method()==='DELETE'){deleted=true;return route.fulfill({json:{deleted:true}});}
  return route.fulfill({json:{listing}});
 });
 await signIn(page);
 await expect.poll(()=>page.locator('.mp-managed-photo img').evaluate((img:HTMLImageElement)=>img.naturalWidth)).toBeGreaterThan(0);
 await page.setViewportSize({width:1440,height:1000});
 await page.screenshot({path:'test-results/my-listings-desktop.png',fullPage:true,animations:'disabled'});
 await page.setViewportSize({width:390,height:844});
 await page.screenshot({path:'test-results/my-listings-mobile.png',fullPage:true,animations:'disabled'});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
 await page.getByRole('button',{name:'Mark as sold',exact:true}).click();
 await expect(page.locator('.mp-status-pill')).toHaveText('Sold');
 await page.getByRole('button',{name:'Relist for approval',exact:true}).click();
 await expect(page.locator('.mp-status-pill')).toHaveText('Awaiting approval');
 await page.getByRole('button',{name:'Edit listing',exact:true}).click();
 const dialog=page.getByRole('dialog');
 await expect(dialog.getByLabel('Listing title',{exact:true})).toHaveValue(vehicle.title);
 await dialog.getByLabel('Listing title',{exact:true}).fill('Swift updated listing');
 await dialog.getByRole('button',{name:'Save & submit for approval'}).click();
 await expect(dialog).toHaveCount(0);
 await expect(page.getByRole('heading',{name:'Swift updated listing'})).toBeVisible();
 await expect(page.getByText('Your listing is waiting for admin approval and is hidden from buyers.')).toBeVisible();
 await page.getByRole('button',{name:'Archive',exact:true}).click();
 await expect(page.locator('.mp-status-pill')).toHaveText('Archived');
 page.on('dialog',dialog=>dialog.accept());
 await page.getByRole('button',{name:'Delete',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Your first listing starts here.'})).toBeVisible();
});
test('admin review endpoints and owner mutations reject anonymous and cross-origin requests',async({request,baseURL})=>{
 const origin=new URL(baseURL!).origin;
 expect((await request.get('/api/admin/listings')).status()).toBe(401);
 expect((await request.patch('/api/admin/listings',{headers:{Origin:'https://unrelated.example'},data:{}})).status()).toBe(403);
 for(const method of ['patch','put','delete'] as const){
  const forbidden=await request[method](`/api/marketplace/${vehicle.id}`,{headers:{Origin:'https://unrelated.example'},data:{}});
  expect(forbidden.status()).toBe(403);
  const anonymous=await request[method](`/api/marketplace/${vehicle.id}`,{headers:{Origin:origin},data:{}});
  expect(anonymous.status()).toBe(401);
 }
});
