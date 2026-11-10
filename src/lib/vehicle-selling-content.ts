import type { SellingVehicle } from "./vehicle-selling-links";

export type SellingContent = {
  title: string;
  description: string;
  heading: string;
  intro: string;
  kicker: string;
  imageAlt: string;
  booking: string;
  cta: string;
  bookingHint: string;
  overview: { title: string; text: string };
  factorsTitle: string;
  factors: { title: string; text: string }[];
  preparationTitle: string;
  preparation: string[];
  documents: { title: string; text: string };
  local: { title: string; text: string };
  steps: { title: string; text: string }[];
  faqs: { question: string; answer: string }[];
};

export const vehicleSellingContent: Record<SellingVehicle, SellingContent> = {
  toys: {
    title: "Sell Used Kids Toys in Bangalore | Zapiboo",
    description: "Sell pre-loved kids toys in Bangalore. List action figures, board games, building blocks and more on Zapiboo — the trusted kids marketplace.",
    heading: "Sell Pre-Loved Kids Toys",
    intro: "Give your children's outgrown toys a second life. List them on Zapiboo and connect with parents looking for quality toys at great prices.",
    kicker: "Toys & Games · Bangalore",
    imageAlt: "Pre-loved kids toys for sale on Zapiboo",
    booking: "toys",
    cta: "List your toys for free",
    bookingHint: "Free listing. No commission on your first items. Doorstep pickup available.",
    overview: {
      title: "Why sell toys on Zapiboo?",
      text: "Kids grow out of toys quickly, but those toys still have plenty of play left in them. Zapiboo connects you with local parents who are looking for quality, pre-loved toys at affordable prices. List in seconds, set your own price, and we handle the rest.",
    },
    factorsTitle: "What affects the resale value of kids toys?",
    factors: [
      { title: "Condition & completeness", text: "Toys in good condition with all pieces and original packaging command higher prices. Clean, well-maintained items sell faster." },
      { title: "Brand & popularity", text: "Popular brands like Lego, Hot Wheels, Barbie and Fisher-Price tend to hold their value better. Limited edition items can fetch premium prices." },
      { title: "Age appropriateness", text: "Toys suitable for the 2-6 age group are in highest demand as kids outgrow them quickly. Educational toys and STEM kits also sell well." },
      { title: "Safety & quality", text: "Items that meet safety standards and show no wear or damage are preferred by parents. Include any safety certifications or age recommendations." },
    ],
    preparationTitle: "Get your toys ready to sell",
    preparation: [
      "Clean all toys thoroughly — wipe surfaces, wash fabric items",
      "Check that all pieces, batteries and accessories are included",
      "Take clear, well-lit photos from multiple angles",
      "Note any missing parts or wear in your listing description",
      "Keep original packaging if available — it adds value",
    ],
    documents: {
      title: "What to include in your listing",
      text: "Add the toy name, brand, age recommendation, condition details and any missing parts. Include clear photos. For electronic toys, mention if batteries are included and whether everything works.",
    },
    local: {
      title: "Selling kids toys in Bangalore",
      text: "Zapiboo serves parents across Bangalore — from Whitefield and HSR Layout to Koramangala, Indiranagar and beyond. List your toys and reach thousands of local parents looking for great deals on quality items.",
    },
    steps: [
      { title: "List your toy", text: "Snap a photo, add a description and set your price. Your listing goes live after a quick review." },
      { title: "Connect with buyers", text: "Interested parents can message you through the platform. Agree on the deal with secure in-app payments." },
      { title: "Doorstep pickup", text: "Our partner picks up the item from your home and delivers it to the buyer. Safe, easy and contactless." },
    ],
    faqs: [
      { question: "Is it free to list toys on Zapiboo?", answer: "Yes, listing is completely free. We may charge a small service fee on completed transactions to cover pickup and delivery costs." },
      { question: "What condition should the toys be in?", answer: "Toys should be clean, safe and in working condition. Minor cosmetic wear is fine — just mention it in your listing." },
      { question: "How do I get paid?", answer: "Payments are processed securely through the platform. Once the buyer confirms receipt, the payment is transferred to your bank account." },
      { question: "Do you pick up from my home?", answer: "Yes! We offer doorstep pickup across 40+ Bangalore areas. Schedule a convenient time and our partner will collect the items." },
    ],
  },
  books: {
    title: "Sell Used Kids Books in Bangalore | Zapiboo",
    description: "Sell pre-loved kids books in Bangalore. List picture books, story books, educational books and more on Zapiboo.",
    heading: "Sell Pre-Loved Kids Books",
    intro: "Pass on the joy of reading. Sell your children's outgrown books to families who will love them just as much.",
    kicker: "Kids Books · Bangalore",
    imageAlt: "Pre-loved kids books for sale on Zapiboo",
    booking: "books",
    cta: "List your books for free",
    bookingHint: "Free listing. Books are always in demand — most sell within days.",
    overview: {
      title: "Why sell kids books on Zapiboo?",
      text: "Children's books are read, loved and outgrown quickly. Zapiboo helps you find new readers for books your kids have finished. From picture books to chapter books, educational to activity — every book deserves a second reader.",
    },
    factorsTitle: "What affects the resale value of kids books?",
    factors: [
      { title: "Condition", text: "Books in good condition with intact pages and spines sell best. Minor creases are fine but water damage or torn pages reduce value." },
      { title: "Author & series", text: "Popular authors and well-known series (Roald Dahl, Harry Potter, Diary of a Wimpy Kid) command better prices." },
      { title: "Age group", text: "Board books for toddlers and picture books for preschoolers are always in demand. Activity books should be unused." },
      { title: "Bundle deals", text: "Selling books in sets or bundles often attracts more buyers and allows for better per-book pricing." },
    ],
    preparationTitle: "Prepare your books for listing",
    preparation: [
      "Check all pages are intact and readable",
      "Wipe covers clean and remove any stickers",
      "Photograph the front cover and any notable wear",
      "Group books by age range or series for bundle deals",
      "Note if any pages have been written on or coloured in",
    ],
    documents: {
      title: "What to include in your listing",
      text: "Add the book title, author, publisher, condition and recommended age group. For bundles, list all titles. Mention if it is a hardcover or paperback.",
    },
    local: {
      title: "Selling kids books in Bangalore",
      text: "Bangalore parents love reading! List your pre-loved books on Zapiboo and connect with book-loving families in HSR, Koramangala, Whitefield, Indiranagar and all major areas.",
    },
    steps: [
      { title: "List your books", text: "Photograph the covers, add titles and set your price. Bundle deals are easy to create." },
      { title: "Find a reader", text: "Parents browse by age group and genre. Accept offers and confirm through secure payments." },
      { title: "Doorstep handover", text: "We pick up the books from your home and deliver them to the buyer — no trips needed." },
    ],
    faqs: [
      { question: "Can I sell activity books that have been partially used?", answer: "Only if most pages are unused. Please mention the percentage of completed pages in your listing." },
      { question: "Is there a minimum number of books to list?", answer: "No minimum — you can list a single book or a bundle of fifty. Bundles tend to sell faster." },
      { question: "How quickly do books sell?", answer: "Kids books are among our fastest-selling categories. Most listings receive interest within 24-48 hours." },
      { question: "Do you offer doorstep pickup?", answer: "Yes, across 40+ Bangalore areas. Schedule a pickup at your convenience." },
    ],
  },
  clothing: {
    title: "Sell Used Kids Clothing in Bangalore | Zapiboo",
    description: "Sell pre-loved kids clothing, shoes and accessories in Bangalore on Zapiboo — the trusted kids marketplace.",
    heading: "Sell Pre-Loved Kids Clothing",
    intro: "Kids grow fast but their clothes still have life. Sell gently used children's clothing, shoes and accessories to families who need them.",
    kicker: "Kids Clothing · Bangalore",
    imageAlt: "Pre-loved kids clothing for sale on Zapiboo",
    booking: "clothing",
    cta: "List your clothing for free",
    bookingHint: "Free listing. Gently used kids clothing is always in demand.",
    overview: {
      title: "Why sell kids clothing on Zapiboo?",
      text: "Children outgrow clothes before they wear them out. Zapiboo makes it easy to sell gently used clothing, shoes and accessories to local parents. Good for your wallet, great for the planet.",
    },
    factorsTitle: "What affects resale value of kids clothing?",
    factors: [
      { title: "Condition & quality", text: "Stain-free, well-maintained clothing in good condition sells best. Premium brands and designer items command higher prices." },
      { title: "Brand recognition", text: "Well-known kids brands fetch better prices. Include the brand name in your listing for better visibility." },
      { title: "Size & season", text: "Common sizes (2-8 years) sell fastest. Seasonal items sell best when listed at the right time." },
      { title: "Bundling", text: "Clothing sold in curated bundles (by size, season or type) attracts more buyers than individual items." },
    ],
    preparationTitle: "Prepare clothing for sale",
    preparation: [
      "Wash and iron all items before listing",
      "Check for stains, tears or missing buttons",
      "Photograph items clearly — flat-lay or on hangers",
      "Group by size and type for bundle deals",
      "Include size labels in photos for buyer confidence",
    ],
    documents: {
      title: "What to include in your listing",
      text: "Add the brand, size, age range, material and condition. For bundles, list the number and types of items included. Note any wear or imperfections.",
    },
    local: {
      title: "Selling kids clothing in Bangalore",
      text: "Bangalore's growing community of conscious parents actively shops for pre-loved kids clothing. List on Zapiboo and reach families across the city.",
    },
    steps: [
      { title: "List your items", text: "Photo, description, price — that is all it takes. Create bundles for faster sales." },
      { title: "Connect with buyers", text: "Parents filter by size, brand and age. Secure payments through the platform." },
      { title: "Easy handover", text: "Doorstep pickup from your home. We handle the logistics." },
    ],
    faqs: [
      { question: "What condition should clothes be in?", answer: "Clean, stain-free and in wearable condition. Minor pilling is fine but significant wear or damage should be disclosed." },
      { question: "Can I sell shoes and accessories too?", answer: "Absolutely! Kids shoes, hats, bags and accessories are all welcome on Zapiboo." },
      { question: "Is doorstep pickup available?", answer: "Yes, across 40+ Bangalore areas." },
    ],
  },
  gear: {
    title: "Sell Used Baby Gear in Bangalore | Zapiboo",
    description: "Sell pre-loved baby gear — strollers, car seats, high chairs, cribs and more — in Bangalore on Zapiboo.",
    heading: "Sell Pre-Loved Baby Gear",
    intro: "Strollers, car seats, high chairs and cribs are expensive new. Help other parents save by selling your gently used baby gear on Zapiboo.",
    kicker: "Baby Gear · Bangalore",
    imageAlt: "Pre-loved baby gear for sale on Zapiboo",
    booking: "gear",
    cta: "List your gear for free",
    bookingHint: "Free listing. Baby gear sells fast — most items get interest within 24 hours.",
    overview: {
      title: "Why sell baby gear on Zapiboo?",
      text: "Baby gear is used for a short period and then sits in storage. Zapiboo connects you with new parents who need quality gear at affordable prices. Sell your stroller, crib or car seat and make space at home.",
    },
    factorsTitle: "What affects the resale value of baby gear?",
    factors: [
      { title: "Brand & model", text: "Premium brands like Chicco, Graco, Joie and Babyhug hold their value well. Popular models sell faster." },
      { title: "Age & condition", text: "Gear that is less than 3 years old and in excellent condition commands the best prices. Include the purchase date." },
      { title: "Safety standards", text: "Items that meet current safety standards are preferred. Mention certifications and safety features in your listing." },
      { title: "Completeness", text: "Include all original accessories, manuals and packaging for the best resale value." },
    ],
    preparationTitle: "Prepare your gear for sale",
    preparation: [
      "Clean thoroughly — wipe all surfaces, wash fabric covers",
      "Check all mechanisms, locks and safety features work properly",
      "Gather all accessories, manuals and original parts",
      "Take photos from multiple angles showing condition",
      "Note the brand, model, purchase date and original price",
    ],
    documents: {
      title: "What to include in your listing",
      text: "Add the brand, model, age of the item, condition, original purchase price and any accessories included. For safety items like car seats, include the manufacture date and expiry date if applicable.",
    },
    local: {
      title: "Selling baby gear in Bangalore",
      text: "New parents in Bangalore are always looking for quality baby gear at reasonable prices. List on Zapiboo and reach families across Whitefield, HSR, Koramangala, Indiranagar and all major areas.",
    },
    steps: [
      { title: "List your gear", text: "Add photos, details and your price. Highlight brand, model and condition." },
      { title: "Connect with parents", text: "New parents browse gear by category. Secure payments protect both buyer and seller." },
      { title: "Doorstep pickup", text: "We arrange pickup from your home. Large items are handled with care." },
    ],
    faqs: [
      { question: "Can I sell large items like cribs?", answer: "Yes! We handle large item pickup. Our partners are equipped to safely transport cribs, strollers and other bulky items." },
      { question: "Are there any safety restrictions?", answer: "We do not accept car seats that are older than 6 years or have been in accidents. All items must meet basic safety standards." },
      { question: "Do you offer doorstep pickup for large items?", answer: "Yes, doorstep pickup is available across 40+ Bangalore areas, including for large and bulky items." },
    ],
  },
  cycles: {
    title: "Sell Used Kids Cycles & Ride-ons in Bangalore | Zapiboo",
    description: "Sell pre-loved kids cycles, tricycles, scooters and ride-on toys in Bangalore on Zapiboo.",
    heading: "Sell Pre-Loved Kids Cycles & Ride-ons",
    intro: "Outgrown the training wheels? Sell your kids' bicycles, tricycles, scooters and ride-on toys to families who will love them.",
    kicker: "Cycles & Ride-ons · Bangalore",
    imageAlt: "Pre-loved kids cycles and ride-on toys on Zapiboo",
    booking: "cycles",
    cta: "List your cycle for free",
    bookingHint: "Free listing. Kids cycles are among our most popular categories.",
    overview: {
      title: "Why sell kids cycles on Zapiboo?",
      text: "Kids cycles, scooters and ride-on toys are expensive new and quickly outgrown. Zapiboo helps you sell them to the next family while they are still in great shape. Easy listing, secure payments and doorstep pickup.",
    },
    factorsTitle: "What affects resale value?",
    factors: [
      { title: "Size & age suitability", text: "Cycles for ages 3-8 are in highest demand. Make sure to mention the wheel size and recommended age range." },
      { title: "Condition", text: "Working brakes, inflated tyres and no rust command better prices. A quick service before listing helps." },
      { title: "Brand", text: "Recognised brands like Hero, BSA, Firefox and Decathlon hold value better than unbranded options." },
      { title: "Accessories", text: "Training wheels, helmets and knee guards sold together increase the perceived value." },
    ],
    preparationTitle: "Prepare your cycle for listing",
    preparation: [
      "Clean the cycle thoroughly — remove dirt and dust",
      "Check brakes, tyres and chain are in working order",
      "Tighten any loose bolts or screws",
      "Take photos in good lighting — show all angles",
      "Include any accessories like training wheels or helmets",
    ],
    documents: {
      title: "What to include in your listing",
      text: "Add the brand, wheel size, suitable age range, condition and any accessories included. Mention if it needs any repairs.",
    },
    local: {
      title: "Selling kids cycles in Bangalore",
      text: "With Bangalore's growing cycling-friendly infrastructure, kids cycles are always in demand. List on Zapiboo and connect with active families across the city.",
    },
    steps: [
      { title: "List your cycle", text: "Photos, details and price — your listing is live in under a minute." },
      { title: "Find a buyer", text: "Parents search by size and brand. Secure payments through the platform." },
      { title: "Doorstep pickup", text: "We pick up the cycle from your doorstep and deliver it to the buyer." },
    ],
    faqs: [
      { question: "Can I sell battery-powered ride-on toys?", answer: "Yes! Battery-powered cars, bikes and ride-ons are welcome. Mention battery condition and charging details." },
      { question: "Do cycles need to be in perfect condition?", answer: "No, but they should be safe and rideable. Disclose any issues in your listing and price accordingly." },
      { question: "How are large items like cycles picked up?", answer: "Our partners are equipped for large item pickup. We arrange a convenient slot for collection from your home." },
      { question: "What sizes sell best?", answer: "12-inch and 16-inch wheels (ages 3-7) are the fastest sellers as kids outgrow them quickly." },
    ],
  },
};
