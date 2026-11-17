export const familyServices = [
  {
    id: "preschool-daycare",
    name: "Preschool & Daycare",
    tagline: "A happy start to learning",
    description:
      "Preschool, nursery, Montessori and daycare options for your child’s first learning and care routine.",
    image_url: "/services/preschool-daycare.webp",
    accent_color: "#fff0cf",
    types: [
      "Playgroups & nursery",
      "Montessori & kindergarten",
      "Full-day & half-day daycare",
      "After-school care",
    ],
    preparation:
      "Ask about age groups, staff-to-child ratios, settling-in visits, meals, pickup policies and the full fee breakdown.",
  },
  {
    id: "classes-activities",
    name: "Classes & Activities",
    tagline: "Find their next favourite thing",
    description:
      "Art, dance, music, sports, swimming and coding classes for curious kids and growing interests.",
    image_url: "/services/classes-activities-art.webp",
    accent_color: "#e3efff",
    types: ["Art & craft", "Music & dance", "Sports & swimming", "STEM, coding & holiday camps"],
    preparation:
      "Share your child's age, interests and preferred schedule. Ask about trial sessions, group sizes, equipment and term fees.",
  },
  {
    id: "play-entertainment",
    name: "Play & Entertainment",
    tagline: "Little adventures, big smiles",
    description:
      "Indoor play areas, toddler activities, family workshops and weekend outings for time together.",
    image_url: "/services/play-entertainment.webp",
    accent_color: "#ffe7ed",
    types: [
      "Indoor play zones",
      "Outdoor adventures",
      "Parent-child sessions",
      "Family workshops & shows",
    ],
    preparation:
      "Check age and height guidance, supervision, accessibility, session length and entry terms before visiting.",
  },
  {
    id: "birthday-events",
    name: "Birthday & Events",
    tagline: "Make their day feel special",
    description:
      "Kids birthday venues, party decorations, entertainers and celebration services for their special day.",
    image_url: "/services/birthday-events.webp",
    accent_color: "#e9e8ff",
    types: [
      "Party venues",
      "Themes & decorations",
      "Entertainers & party activities",
      "Cakes, catering & photography",
    ],
    preparation:
      "Share the date, area, guest count and budget. Confirm package inclusions, setup times, food requirements and cancellation terms.",
  },
  {
    id: "babysitting-nannies",
    name: "Babysitting & Nannies",
    tagline: "Care that fits your routine",
    description:
      "Babysitting, regular nanny support and after-school childcare to fit your family’s routine.",
    image_url: "/services/babysitting-nannies.webp",
    accent_color: "#e3f4ff",
    types: [
      "Occasional babysitting",
      "Regular nanny support",
      "After-school supervision",
      "Infant care support",
    ],
    preparation:
      "Discuss experience, references, identity checks, first-aid training, duties and hours. Meet the caregiver and agree arrangements before starting.",
  },
  {
    id: "health-development",
    name: "Health & Development",
    tagline: "Support for every milestone",
    description:
      "Child development, speech and language support, occupational therapy and paediatric consultation enquiries.",
    image_url: "/services/health-development.webp",
    accent_color: "#fff0cf",
    types: [
      "Paediatric consultations",
      "Speech & language support",
      "Occupational therapy",
      "Developmental & parenting support",
    ],
    preparation:
      "Confirm the professional's qualifications, approach, fees and appointment availability directly. Share sensitive health information only with the chosen professional.",
  },
] as const;

export type FamilyService = (typeof familyServices)[number];
export const serviceEnquiryHref = (id: string, area?: string) =>
  `/contact?${new URLSearchParams({ service: id, ...(area ? { area } : {}) })}`;
export const familySteps = [
  {
    title: "Choose what your family needs",
    text: "Explore six service categories, from early learning and play to childcare and development.",
  },
  {
    title: "Share your preferences",
    text: "Tell us your area, child's age, preferred timing and budget through a service enquiry.",
  },
  {
    title: "Confirm the right fit",
    text: "Discuss availability, fees and arrangements with the provider before making a commitment.",
  },
];
export const familyFaqs = [
  [
    "What can I explore on Zapiboo?",
    "Preschool and daycare, classes and activities, play and entertainment, birthdays and events, babysitting and nannies, and health and development support in Bangalore.",
  ],
  [
    "How do I enquire about a service?",
    "Choose a category and send an enquiry with your area, child's age, preferred dates and budget. Our team can clarify the next steps; submitting an enquiry does not confirm a booking.",
  ],
  [
    "How do I know a service is right for my child?",
    "Ask about age suitability, experience, qualifications, supervision and fees. Arrange a visit, introductory conversation or trial where available, and check references for childcare.",
  ],
  [
    "Are prices and availability guaranteed?",
    "Availability, fees and service terms depend on the provider and your requirements. Confirm these directly before booking or paying. Health services are provided by the relevant professionals.",
  ],
] as const;
