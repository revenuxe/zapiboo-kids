import type { SellingCategoryId } from './selling-categories';

export type SellerGuide = {
  title: string; description: string; intro: string;
  checks: { title: string; text: string }[];
  bundle: { title: string; text: string; example: string };
  photos: string; questions: { question: string; answer: string }[];
};
export const sellerGuides: Record<SellingCategoryId, SellerGuide> = {
  toys: {
    title: 'Sell Used Toys & Games in Bangalore | Zapiboo',
    description: 'Sell pre-loved toys, puzzles, building blocks and games in Bangalore. Explore accepted types, bundle tips, condition checks and pickup next steps.',
    intro: 'From a toy box full of building blocks to a board game your child has mastered, useful toys can have plenty of playtime left. Share individual toys or a related collection, describe the condition and let our team review the next steps.',
    checks: [
      { title: 'Count the pieces', text: 'Check puzzle pieces, game counters and building sets. Mention anything missing rather than describing an incomplete set as complete.' },
      { title: 'Check how it plays', text: 'Try buttons, wheels and moving parts. For electronic toys, mention whether batteries are included and whether the toy works.' },
      { title: 'Keep sets together', text: 'Group instructions, figures and accessories with the right toy. Clean surfaces and note cracks, loose parts or visible wear.' },
    ],
    bundle: { title: 'Make a playtime bundle', text: 'Keep similar toys or complete sets together. Describe how many toys are included, their condition and whether original packaging or instructions remain.', example: 'Example description: Building blocks and two wooden puzzles. All puzzle pieces included; storage box has wear.' },
    photos: 'Show the whole toy or collection in one clear photo. Lay out accessories so our team can see what is included, and describe any wear that the photo does not show.',
    questions: [
      { question: 'Can I sell used toys without the original box?', answer: 'You can share the toy for review without its original box. Mention whether instructions, storage cases or accessories are missing.' },
      { question: 'Can I sell puzzles or games with missing pieces?', answer: 'Describe exactly what is missing. Our team reviews whether the item is suitable; submitting it does not guarantee acceptance.' },
      { question: 'Can I sell a mixed toy bundle?', answer: 'Yes. Choose Toys & games and use the notes to list the main items and their condition. Keep unrelated personal belongings out of the bundle.' },
    ],
  },
  books: {
    title: 'Sell Used Kids Books in Bangalore | Zapiboo',
    description: 'Sell picture books, story books, early readers and kids book bundles in Bangalore. Check book condition, bundle ideas and pickup details.',
    intro: 'Finished picture books, early readers and chapter-book collections can make room for a new reading stage. Tell us the titles or type of books, whether the collection is complete and how much wear the books have.',
    checks: [
      { title: 'Look through the pages', text: 'Check for torn or missing pages, writing, stickers and water damage. Describe these clearly, including writing in activity books.' },
      { title: 'Check covers & bindings', text: 'Mention loose pages, damaged spines or detached covers. Keep any removable inserts with the correct book.' },
      { title: 'Group useful collections', text: 'Keep a series together where possible, or group books by reading stage. Include a title list in your notes if you have a larger collection.' },
    ],
    bundle: { title: 'Build a little bookshelf bundle', text: 'A set of board books, a complete series or a collection of early readers is easier to describe together. Tell us the number of books and any differences in condition.', example: 'Example description: Eight picture books and four early readers. One cover is creased; no missing pages.' },
    photos: 'Arrange books so their covers or spines can be seen. Include a note about writing, loose pages or other condition details that are hidden inside.',
    questions: [
      { question: 'Can I sell a whole collection of kids books?', answer: 'Yes. Choose Kids books, describe the approximate number and types of books, and mention whether any sets are incomplete.' },
      { question: 'Do you review books with writing inside?', answer: 'Mention names, notes, completed activities and other markings. Our team considers the condition before confirming eligibility.' },
      { question: 'Can I include school reading books?', answer: 'School reading books are a category example you can submit for review. Include the titles, edition where relevant and whether pages are marked or missing.' },
    ],
  },
  clothing: {
    title: 'Sell Used Kids Clothes & Shoes in Bangalore | Zapiboo',
    description: 'Sell outgrown baby clothes, kids clothing, shoes and clothing bundles in Bangalore. See condition tips, size details and pickup next steps.',
    intro: 'Outgrown outfits do not always mean worn-out clothes. Share baby clothing, everyday outfits, occasion wear or shoes with clear size and condition notes, so our team can understand the collection before handover.',
    checks: [
      { title: 'Wash & dry first', text: 'Prepare clean, dry clothes and shoes. Describe stains, fading, pilling or odours rather than hiding signs of use.' },
      { title: 'Check the details', text: 'Look at zips, buttons, seams and shoe soles. Mention repairs, missing fasteners and any items that need attention.' },
      { title: 'Include the sizes', text: 'List the label sizes and approximate number of pieces. Group matching outfits or similar sizes together so the bundle is clear.' },
    ],
    bundle: { title: 'Sort a wardrobe bundle', text: 'Group clothes by size or type, and explain what is included. Shoes and accessories can be mentioned separately so the condition of each is clear.', example: 'Example description: Ten tops and four shorts, mostly size 3-4 years. Two tops have light fading; all fasteners work.' },
    photos: 'Lay items flat in good light with labels visible where practical. Keep personal documents out of the photo and mention any stains or wear in the notes.',
    questions: [
      { question: 'Can I sell baby clothes as a bundle?', answer: 'Yes. Choose Kids clothing, list the approximate number of pieces and label sizes, and describe any differences in condition.' },
      { question: 'Can I include kids shoes and accessories?', answer: 'Yes, these are examples in the clothing category. Describe sizes, sole wear, missing pairs or damaged fasteners for review.' },
      { question: 'What if the clothes have stains or repairs?', answer: 'Mention the affected items clearly. Eligibility is reviewed before collection; a request is not a promise to accept every piece.' },
    ],
  },
  gear: {
    title: 'Sell Used Baby Gear & Strollers in Bangalore | Zapiboo',
    description: 'Share pre-loved strollers, high chairs, cots and baby gear in Bangalore. See the details to include, accessory checks and pickup preparation.',
    intro: 'A stroller, high chair or cot can take up a lot of room after your family moves to the next stage. Share the item details, included accessories and condition so our team can review larger baby gear before discussing collection.',
    checks: [
      { title: 'Identify the item', text: 'Include the brand or model if known, approximate age and any labels or instructions you still have. Mention missing accessories.' },
      { title: 'Describe wear & history', text: 'Mention damage, repairs, known recalls and any concerns about straps, locks or moving parts. For car seats, include expiry and accident history for review.' },
      { title: 'Plan the handover', text: 'Explain whether the item folds or comes apart and whether there are stairs, a lift or building-access requirements. Do not dismantle it until arrangements are confirmed.' },
    ],
    bundle: { title: 'Keep the right accessories together', text: 'Group the manual, trays, covers or other original accessories with the gear they belong to. Describe each separate item if you are sharing more than one piece of equipment.', example: 'Example description: Foldable stroller with rain cover and manual. Fabric has light wear; please review the attached condition photo.' },
    photos: 'Show the complete item with the accessories included. Add written details about damage or missing parts; a photo alone does not establish whether equipment is suitable for reuse.',
    questions: [
      { question: 'Can I sell a used stroller or high chair?', answer: 'You can submit strollers and high chairs for review. Include condition, model if known, included accessories and any damage or missing parts.' },
      { question: 'Can I share a cot or other large baby item?', answer: 'Yes. Mention the item size, assembly status and access at your address. Pickup arrangements depend on review and availability.' },
      { question: 'Are all baby items automatically accepted?', answer: 'No. Item condition, safety history and eligibility must be reviewed. Do not submit recalled, expired or unsafe equipment.' },
    ],
  },
  cycles: {
    title: 'Sell Used Kids Cycles & Ride-ons in Bangalore | Zapiboo',
    description: 'Sell outgrown kids bicycles, balance bikes, tricycles and ride-ons in Bangalore. Share condition, size, accessories and pickup details.',
    intro: 'When the next growth spurt calls for a bigger bike, an outgrown cycle or ride-on may be ready for another adventure. Include the type, wheel size if known and an honest description of how it works.',
    checks: [
      { title: 'Describe the working condition', text: 'Mention brake, steering, pedal or wheel issues and any repair needs. Include visible frame damage, rust or worn tyres in the notes.' },
      { title: 'List what comes with it', text: 'Include training wheels, baskets, keys, chargers and other accessories where relevant. Say if any original part is missing.' },
      { title: 'Add size & power details', text: 'For bicycles, include wheel size if known. For battery-powered ride-ons, describe whether the battery holds charge and whether a charger is included.' },
    ],
    bundle: { title: 'Pair the cycle with its accessories', text: 'Keep the correct training wheels, charger or spare parts together. If you have several ride-ons, list each separately in your notes and mention differences in condition.', example: 'Example description: 16-inch kids bicycle with training wheels and a basket. Tyres show wear; the bell is missing.' },
    photos: 'Show the full bike or ride-on from the side, with accessories nearby. Explain wheel, brake or battery issues in writing even if they are not visible in the image.',
    questions: [
      { question: 'Can I sell a balance bike or tricycle?', answer: 'Yes. These are examples in Cycles & ride-ons. Add the condition, size if known and any missing or worn parts.' },
      { question: 'Can I share a battery-powered ride-on?', answer: 'You can submit it for review. Include battery condition, whether it powers on, and whether the charger, remote or keys are available.' },
      { question: 'Can I sell a kids cycle that needs repairs?', answer: 'Describe the repairs needed before submitting. Our team decides eligibility after review; acceptance is not guaranteed.' },
    ],
  },
  electronics: {
    title: 'Sell Used Kids Electronics & STEM Kits in Bangalore | Zapiboo',
    description: 'Share learning tablets, kids laptops, electronic toys and STEM kits in Bangalore. Check working condition, accessories and personal-data preparation.',
    intro: 'Learning tablets, coding kits and electronic toys can be useful beyond one stage of childhood. Tell us what the device does, whether it works and which cables, parts or instructions are included.',
    checks: [
      { title: 'Try the main functions', text: 'Check power, screen, sound and buttons where relevant. Describe charging problems, battery wear or functions that do not work.' },
      { title: 'Gather parts & chargers', text: 'Keep compatible chargers, cables and instructions together. For STEM and robotics kits, mention missing components or used consumables.' },
      { title: 'Remove personal information', text: 'Sign out of accounts and remove stored personal information before handover. Mention if a device remains locked or needs an account to function.' },
    ],
    bundle: { title: 'Make the learning kit clear', text: 'Group the device with its correct accessories and list each included component. For multiple devices, explain the working condition of each rather than giving one condition for the whole set.', example: 'Example description: Learning tablet with charging cable and a coding kit. Tablet works; two small kit components are missing.' },
    photos: 'Show the device and included accessories. Avoid screens containing account details, children\'s information or other private data; explain functional issues in the notes.',
    questions: [
      { question: 'Can I sell an electronic learning toy?', answer: 'You can share electronic learning toys, kids learning devices and STEM kits for review. Include working condition and the accessories available.' },
      { question: 'Do I need to include the charger?', answer: 'Mention whether a compatible charger or cable is included. Missing accessories should be disclosed so our team can review the request accurately.' },
      { question: 'What if the STEM kit has missing pieces?', answer: 'List the missing components and whether the remaining kit can be used. Our team reviews suitability before confirming collection.' },
    ],
  },
};
