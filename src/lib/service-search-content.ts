import type { FamilyService } from "./family-service-catalog";

export type SearchContent = {
  title: string;
  description: string;
  intro: string;
  options: readonly string[];
  faqs: readonly { question: string; answer: string }[];
};

export const serviceHeadings: Record<FamilyService["id"], { lead: string; accent: string }> = {
  "preschool-daycare": { lead: "Kids’ preschool", accent: "& daycare." },
  "classes-activities": { lead: "Kids’ classes", accent: "& activities." },
  "play-entertainment": { lead: "Kids’ play", accent: "& entertainment." },
  "birthday-events": { lead: "Kids’ birthdays", accent: "& celebrations." },
  "babysitting-nannies": { lead: "Care for kids.", accent: "Nannies & sitters." },
  "health-development": { lead: "Children’s health", accent: "& development." },
};

export const homepageSearch = {
  title: "Preschool, Daycare & Kids Activities in Bangalore | Zapiboo",
  description:
    "Explore preschool, daycare, kids classes, play areas, birthday venues, babysitting and child development support in Bangalore. Enquire with Zapiboo.",
};

export const serviceSearchContent: Record<FamilyService["id"], SearchContent> = {
  "preschool-daycare": {
    title: "Preschools & Daycare in Bangalore | Zapiboo",
    description:
      "Explore preschool, Montessori, nursery and daycare options in Bangalore. Ask about age groups, admissions, timings, fees and after-school care.",
    intro:
      "Looking for a preschool or daycare in Bangalore? Explore playgroups, nursery, Montessori and kindergarten programmes alongside half-day, full-day and after-school care. Start with your child's age and the routine your family needs.",
    options: [
      "Ask about entry age, settling-in support, play-based learning and the daily routine before choosing a playgroup or nursery.",
      "Discuss the learning approach, classroom age groups, teacher interaction and transition to school when exploring Montessori or kindergarten.",
      "Compare operating hours, meals, nap arrangements, holiday closures and late pickup policies for half-day or full-day daycare.",
      "Ask about school pickup arrangements, homework time, snacks and supervised activities for after-school care.",
    ],
    faqs: [
      {
        question: "How do I choose a preschool or daycare near me?",
        answer:
          "Start with your neighbourhood, child's age and required hours. Visit the centre, ask about staff-to-child ratios and supervision, and review the routine, communication and total fees.",
      },
      {
        question: "What should I ask about preschool admissions and daycare fees?",
        answer:
          "Ask about available age groups, admission dates, registration fees, monthly or term fees, meals, transport, deposits and cancellation terms. Fees and availability must be confirmed with the centre.",
      },
      {
        question: "Can I enquire about full-day and after-school care?",
        answer:
          "Yes. Include your child's age, area, required days and earliest drop-off and latest pickup times. Your enquiry helps explain what you need; it does not reserve a place.",
      },
    ],
  },
  "classes-activities": {
    title: "Kids Classes & Activities in Bangalore | Zapiboo",
    description:
      "Explore art, dance, music, sports, swimming and coding classes for kids in Bangalore. Ask about age groups, trial classes, schedules and fees.",
    intro:
      "Find a starting point for kids classes and after-school activities in Bangalore, from art, music and dance to sports, swimming and coding. Choose around your child's interests, experience and weekly schedule.",
    options: [
      "Explore drawing, painting, craft and creative workshops. Ask about suitable age groups, materials and beginner sessions.",
      "Ask about dance styles, instruments, class levels and whether a trial can help your child find the right fit.",
      "Discuss coaching experience, group sizes, equipment and supervision when considering sports or swimming classes.",
      "Explore coding, robotics and school-holiday camps. Confirm the age group, learning goals, programme length and equipment needed.",
    ],
    faqs: [
      {
        question: "Which activity classes are suitable for my child?",
        answer:
          "Start with an interest your child already enjoys and a manageable schedule. Ask the instructor about beginner groups, age suitability and trial sessions before committing to a course.",
      },
      {
        question: "Can I ask about weekend classes or holiday camps?",
        answer:
          "Yes. Include preferred weekdays or weekends, dates, your neighbourhood and your child's age. Camp schedules and class availability depend on the organiser.",
      },
      {
        question: "What should I compare before paying for a class?",
        answer:
          "Compare session length, group size, teaching experience, included materials, travel time, missed-class policies and the complete term or monthly cost.",
      },
    ],
  },
  "play-entertainment": {
    title: "Kids Play Areas & Indoor Play in Bangalore | Zapiboo",
    description:
      "Explore kids play areas, indoor play zones, toddler activities and family workshops in Bangalore. Ask about age limits, entry fees and sessions.",
    intro:
      "Planning a day out with children in Bangalore? Explore indoor play areas, toddler play sessions, outdoor activities and family workshops. Ask about age suitability, supervision and session timings before visiting.",
    options: [
      "Ask about toddler zones, soft play, accompanying-adult rules, socks requirements and session-based entry fees.",
      "Discuss age and height guidance, weather arrangements, supervision and any equipment required for outdoor activities.",
      "Explore shared play and parent-child activities. Check whether a parent must stay throughout the session.",
      "Ask about workshop themes, show timings, age recommendations, ticket inclusions and cancellation policies.",
    ],
    faqs: [
      {
        question: "How do I find an indoor play area for toddlers?",
        answer:
          "Share your area and child's age. Ask venues about separate toddler spaces, supervision, session length and whether an accompanying adult needs a ticket.",
      },
      {
        question: "What should I check before visiting a kids play zone?",
        answer:
          "Confirm opening hours, entry fees, age or height restrictions, hygiene rules, food policies and whether advance booking is required.",
      },
      {
        question: "Are weekend play sessions and family workshops available?",
        answer:
          "Schedules vary by organiser. Mention your preferred date, number of children and their ages when you enquire, then confirm the arrangements before travelling.",
      },
    ],
  },
  "birthday-events": {
    title: "Kids Birthday Party Venues & Events in Bangalore | Zapiboo",
    description:
      "Explore kids birthday party venues, decorations, entertainers and event services in Bangalore. Enquire with your date, guest count and budget.",
    intro:
      "Plan a kids birthday party in Bangalore around your child's interests and your guest list. Explore birthday venues, themed decorations, party entertainers, cakes, catering and photography, with the package details agreed before booking.",
    options: [
      "Compare party spaces, play-area access, guest capacity, session duration and arrangements for accompanying adults.",
      "Share the theme, venue and setup time. Ask what is included in decorations, installation and pack-up.",
      "Explore games, activity hosts and entertainers. Check age suitability, programme length and space requirements.",
      "Discuss food preferences, allergies, cake requirements and photography coverage. Ask for an itemised quote and clear package inclusions.",
    ],
    faqs: [
      {
        question: "What details do I need for a birthday party enquiry?",
        answer:
          "Share the date, preferred area, child's age, number of children and adults, theme and budget. Mention whether you need a venue, decorations, entertainment or a complete package.",
      },
      {
        question: "What should a kids birthday party package include?",
        answer:
          "Packages vary. Ask about venue time, play access, decorations, food, cake, entertainment, photography, taxes and extra-guest charges rather than assuming these are included.",
      },
      {
        question: "Can I enquire about a party at home?",
        answer:
          "Yes. Specify that it is a home celebration and share the available space, guest count and services needed. Confirm access, setup and cleanup arrangements with each provider.",
      },
    ],
  },
  "babysitting-nannies": {
    title: "Babysitting & Nanny Services in Bangalore | Zapiboo",
    description:
      "Explore babysitting, nanny and after-school childcare support in Bangalore. Discuss experience, references, duties, hours and fees before choosing.",
    intro:
      "Looking for babysitting or nanny services in Bangalore? Explore occasional childcare, regular nanny support, after-school supervision and infant care enquiries. Describe the care you need and meet the caregiver before agreeing arrangements.",
    options: [
      "Share the date, required hours, child's age and routine for occasional babysitting. Discuss responsibilities and emergency contacts.",
      "Discuss working days, hours, experience, duties, leave arrangements and references when considering a regular nanny.",
      "Explain school timings, pickup needs, meals and the supervision required until a parent or guardian returns.",
      "Ask about relevant infant-care experience, feeding and sleep routines, first-aid training and how the caregiver communicates with you.",
    ],
    faqs: [
      {
        question: "What is the difference between a babysitter and a nanny?",
        answer:
          "Babysitting usually covers occasional or time-specific care, while a nanny often follows an ongoing routine. Agree the actual hours, responsibilities and expectations rather than relying on the job title alone.",
      },
      {
        question: "What should I check before choosing a caregiver?",
        answer:
          "Meet the caregiver, check identity and references, discuss relevant experience and first-aid training, and agree duties, communication, emergency contacts and payment terms.",
      },
      {
        question: "Can I enquire about part-time childcare?",
        answer:
          "Yes. Share your neighbourhood, child's age, required days, hours and start date. Availability and fees depend on the caregiver and the responsibilities involved.",
      },
    ],
  },
  "health-development": {
    title: "Child Development & Therapy Enquiries in Bangalore | Zapiboo",
    description:
      "Explore child development, speech therapy, occupational therapy and paediatric consultation enquiries in Bangalore. Confirm professional qualifications.",
    intro:
      "Explore child development support in Bangalore, including paediatric consultation, speech and language support, occupational therapy and parenting guidance. Discuss your questions with an appropriately qualified professional; this website does not provide assessment or medical advice.",
    options: [
      "Ask about the clinician's qualifications, appointment format, fees and what information to bring to a paediatric consultation.",
      "Enquire about speech and language assessment with a qualified professional. Ask about their approach and how parents are involved.",
      "Discuss occupational therapy enquiries directly with the professional, including assessment arrangements, goals, session format and fees.",
      "Ask about developmental consultations and parenting support. Share sensitive health records directly with the chosen professional through an appropriate channel.",
    ],
    faqs: [
      {
        question: "Can I enquire about speech therapy or occupational therapy?",
        answer:
          "Yes. Mention the type of professional support you are looking for, your area and appointment preferences. Confirm the professional's qualifications, availability and assessment process directly.",
      },
      {
        question: "Does Zapiboo diagnose or recommend treatment?",
        answer:
          "No. This website introduces service categories and accepts enquiries. Assessment, diagnosis and treatment decisions belong with appropriately qualified healthcare professionals.",
      },
      {
        question: "Should I upload my child's health records to the enquiry form?",
        answer:
          "No. Keep the general enquiry brief and avoid sensitive medical details. Ask your chosen professional how to share records securely when arranging an appointment.",
      },
    ],
  },
};

export function areaSearchContent(area: {
  name: string;
  pincode: string;
  nearby: readonly string[];
}) {
  const nearby = area.nearby.length
    ? area.nearby.join(", ")
    : "another neighbourhood convenient for your family";
  return {
    title: `Preschool, Daycare & Kids Activities in ${area.name} | Zapiboo`,
    description: `Explore preschool, daycare, kids classes, play areas and childcare in ${area.name}, Bangalore. Share your age group, schedule and budget with Zapiboo.`,
    intro: `Looking for preschool, daycare or kids activities in ${area.name}, Bangalore? Explore six family service categories, from early learning and after-school classes to play areas, birthdays, babysitting and child development support.`,
    guidance: [
      {
        title: `Start with your ${area.name} routine`,
        text: "For preschool, daycare and classes, include your child's age, the days you need and your drop-off or pickup window. Ask about visits or trial sessions before committing.",
      },
      {
        title: "Give a precise starting point",
        text: `The locality directory lists ${area.pincode} as a reference PIN for ${area.name}. Confirm your exact address and how far you can travel; a shared PIN does not guarantee service availability.`,
      },
      {
        title: "Include nearby options",
        text: `If you can travel beyond ${area.name}, mention ${nearby}. For home childcare or a birthday event, specify where the service is needed instead.`,
      },
    ],
    faqs: [
      {
        question: `How do I enquire about preschool or daycare in ${area.name}?`,
        answer: `Choose Preschool & Daycare and include ${area.name}, your child's age, the care hours you need and a preferred start date. Ask the centre about admissions, fees, supervision and a visit.`,
      },
      {
        question: `Can I look for kids classes and play areas near ${area.name}?`,
        answer: `Yes. Include your child's interests and age, your preferred days and whether you can travel to ${nearby}. Confirm class levels, entry terms, fees and timings with the organiser.`,
      },
      {
        question: `Does this page confirm available providers in ${area.name}?`,
        answer:
          "No. It helps you explain your local requirements and explore service categories. Provider availability, qualifications, fees and booking terms must be confirmed before proceeding.",
      },
    ],
  };
}
