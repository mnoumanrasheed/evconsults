const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Seed Admin User
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@evconsults.pk';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@EVConsults123';

  console.log(`Creating admin user: ${adminEmail}`);
  const hashedPassword = await bcrypt.hash(adminPassword, 10);
  
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: hashedPassword,
      role: 'ADMIN',
    },
    create: {
      email: adminEmail,
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  // 2. Seed Pages and Sections
  console.log('Seeding page content & sections...');

  // --- HOME PAGE ---
  await prisma.page.upsert({
    where: { slug: 'home' },
    update: {},
    create: {
      slug: 'home',
      title: 'Home',
      seoTitle: 'EV Charging Station Consultant Pakistan | EVConsults',
      seoDesc: 'EVConsults is Pakistan\'s leading EV charging station consultancy. We provide feasibility studies, NEPRA licensing support, technical design, DISCO coordination, financial modelling, charger selection, and commissioning.',
    },
  });
  const homePage = await prisma.page.findUnique({ where: { slug: 'home' } });

  await prisma.section.upsert({
    where: { pageId_key: { pageId: homePage.id, key: 'hero_slides' } },
    update: {},
    create: {
      pageId: homePage.id,
      key: 'hero_slides',
      order: 1,
      content: [
        { bg: "/ev_charging_hero.png", tag: "Pakistan's #1 EV Consultancy", headline: "Start Your EV Charging\nStation Business", sub: "End-to-end consultancy from feasibility to commissioning — designed for Pakistan." },
        { bg: "/ev_charging_business.png", tag: "Licensing & Regulatory", headline: "Licensing\nWith Confidence", sub: "We handle every NEPRA document, approval, and coordination so you can focus on growth." },
        { bg: "/clean_energy_city.png", tag: "Financial Modelling", headline: "Data-Driven\nEV Investment", sub: "ROI analysis, CAPEX/OPEX modelling, and payback period forecasts tailored for Pakistan." }
      ]
    }
  });

  await prisma.section.upsert({
    where: { pageId_key: { pageId: homePage.id, key: 'problems' } },
    update: {},
    create: {
      pageId: homePage.id,
      key: 'problems',
      order: 2,
      content: {
        tag: "The Challenge",
        title: "Setting Up an EV Station Is Not Just About Buying a Charger",
        description: "Launching in Pakistan requires site assessment, load evaluation, regulatory approvals, utility coordination, safety compliance, and a commercially viable model.",
        items: [
          { title: "Unclear Licensing", text: "Many investors are unsure which approvals and documents are required from NEPRA & DISCOs.", iconName: "FileText", color: "#EF4444" },
          { title: "Grid & Load Issues", text: "A charging station needs proper load assessment and coordination with the relevant utility.", iconName: "Zap", color: "#F59E0B" },
          { title: "Wrong Charger Choice", text: "Selecting AC or DC chargers without demand analysis leads to poor ROI.", iconName: "AlertTriangle", color: "#8B5CF6" },
          { title: "Weak Business Model", text: "Location, tariff, utilization, CAPEX, OPEX, and payback must be properly evaluated.", iconName: "LineChart", color: "#00AEEF" },
          { title: "Safety Compliance", text: "Electrical safety, earthing, protection systems, and commissioning must be addressed.", iconName: "ShieldCheck", color: "#39D353" }
        ]
      }
    }
  });

  await prisma.section.upsert({
    where: { pageId_key: { pageId: homePage.id, key: 'services' } },
    update: {},
    create: {
      pageId: homePage.id,
      key: 'services',
      order: 3,
      content: {
        tag: "Our Expertise",
        title: "Complete EV Charging Advisory Services",
        description: "We guide clients from concept to commissioning — technical, regulatory, commercial, and project development.",
        items: ["Feasibility Study","NEPRA Licensing Support","Technical Design Review","DISCO / Utility Coordination","Financial Model & ROI Analysis","Charger & Vendor Selection","Site Assessment","Commissioning Support"]
      }
    }
  });

  await prisma.section.upsert({
    where: { pageId_key: { pageId: homePage.id, key: 'who_we_serve' } },
    update: {},
    create: {
      pageId: homePage.id,
      key: 'who_we_serve',
      order: 4,
      content: {
        tag: "Who We Serve",
        title: "Who Can Benefit from EV Charging Stations?",
        items: [
          { title: "Petrol Pumps", text: "Add EV charging as a revenue stream.", iconName: "Fuel", color: "#00AEEF" },
          { title: "Shopping Malls", text: "Attract premium customers.", iconName: "ShoppingBag", color: "#39D353" },
          { title: "Housing Societies", text: "Offer charging to residents.", iconName: "HomeIcon", color: "#8B5CF6" },
          { title: "Hotels & Restaurants", text: "Destination charging for guests.", iconName: "Hotel", color: "#F59E0B" },
          { title: "Fleet Operators", text: "Charging for electric fleets.", iconName: "Truck", color: "#10B981" },
          { title: "Commercial Buildings", text: "Workplace and visitor charging.", iconName: "Building", color: "#EF4444" },
          { title: "Investors", text: "EV charging as infrastructure.", iconName: "User", color: "#0EA5E9" },
          { title: "Highway Rest Areas", text: "Fast-charging for intercity travel.", iconName: "MapPin", color: "#D946EF" }
        ]
      }
    }
  });

  await prisma.section.upsert({
    where: { pageId_key: { pageId: homePage.id, key: 'why_choose_us' } },
    update: {},
    create: {
      pageId: homePage.id,
      key: 'why_choose_us',
      order: 5,
      content: {
        tag: "Why EVConsults",
        title: "Why Choose EVConsults?",
        description: "We help you build a legally compliant, technically sound, and commercially viable EV charging business in Pakistan.",
        image: "/ev_charging_business.png",
        points: ["Pakistan-focused EV charging advisory","Technical and commercial feasibility","End-to-end documentation guidance","Business model & investment analysis","Vendor-neutral equipment advice","Practical implementation guidance"]
      }
    }
  });

  await prisma.section.upsert({
    where: { pageId_key: { pageId: homePage.id, key: 'cta' } },
    update: {},
    create: {
      pageId: homePage.id,
      key: 'cta',
      order: 6,
      content: {
        tag: "Get Started Today",
        title: "Planning to Set Up an EV Charging Station?",
        description: "Speak with EVConsults and get professional guidance before making your investment decision."
      }
    }
  });


  // --- ABOUT PAGE ---
  await prisma.page.upsert({
    where: { slug: 'about' },
    update: {},
    create: {
      slug: 'about',
      title: 'About',
      seoTitle: 'About Us | EVConsults Pakistan',
      seoDesc: 'Learn more about EVConsults, Pakistan\'s trusted advisory platform for EV charging infrastructure planning, licensing, design, and implementation.',
    },
  });
  const aboutPage = await prisma.page.findUnique({ where: { slug: 'about' } });

  await prisma.section.upsert({
    where: { pageId_key: { pageId: aboutPage.id, key: 'header' } },
    update: {},
    create: {
      pageId: aboutPage.id,
      key: 'header',
      order: 1,
      content: {
        title: "About EVConsults",
        subtitle: "Pakistan's trusted advisory platform for EV charging infrastructure development."
      }
    }
  });

  await prisma.section.upsert({
    where: { pageId_key: { pageId: aboutPage.id, key: 'who_we_are' } },
    update: {},
    create: {
      pageId: aboutPage.id,
      key: 'who_we_are',
      order: 2,
      content: {
        title: "Who We Are",
        paragraphs: [
          "EVConsults is a Pakistan-focused consultancy platform created to support the development of electric vehicle charging infrastructure. We help investors, businesses, property owners, petrol pumps, housing societies, and fleet operators understand the technical, regulatory, financial, and operational requirements for setting up EV charging stations.",
          "Our objective is to make EV charging station development easier, safer, legally compliant, and commercially viable."
        ],
        image: "/ev_charging_hero.png"
      }
    }
  });

  await prisma.section.upsert({
    where: { pageId_key: { pageId: aboutPage.id, key: 'mission_vision' } },
    update: {},
    create: {
      pageId: aboutPage.id,
      key: 'mission_vision',
      order: 3,
      content: {
        mission: "To accelerate Pakistan's transition toward clean mobility by providing professional consultancy.",
        vision: "To become Pakistan's trusted advisory platform for EV charging station planning and implementation."
      }
    }
  });

  await prisma.section.upsert({
    where: { pageId_key: { pageId: aboutPage.id, key: 'values' } },
    update: {},
    create: {
      pageId: aboutPage.id,
      key: 'values',
      order: 4,
      content: {
        title: "Our Core Values",
        subtitle: "The principles that guide our consultancy and ensure your EV project's success.",
        items: ["Professionalism", "Transparency", "Technical accuracy", "Regulatory compliance", "Commercial practicality", "Sustainability"]
      }
    }
  });

  await prisma.section.upsert({
    where: { pageId_key: { pageId: aboutPage.id, key: 'cta' } },
    update: {},
    create: {
      pageId: aboutPage.id,
      key: 'cta',
      order: 5,
      content: {
        title: "Ready to Power the Future?",
        description: "Join Pakistan's EV revolution. Get end-to-end guidance on setting up a profitable, compliant, and state-of-the-art charging infrastructure."
      }
    }
  });


  // --- SERVICES PAGE ---
  await prisma.page.upsert({
    where: { slug: 'services' },
    update: {},
    create: {
      slug: 'services',
      title: 'Services',
      seoTitle: 'Our Services | EVConsults Pakistan',
      seoDesc: 'Discover our end-to-end EV charging consultancy services in Pakistan, including feasibility studies, licensing support, DISCO coordination, design, vendor selection, and commissioning.',
    },
  });
  const servicesPage = await prisma.page.findUnique({ where: { slug: 'services' } });

  await prisma.section.upsert({
    where: { pageId_key: { pageId: servicesPage.id, key: 'header' } },
    update: {},
    create: {
      pageId: servicesPage.id,
      key: 'header',
      order: 1,
      content: {
        title: "EV Charging Station Consultancy Services in Pakistan",
        subtitle: "EVConsults provides professional consultancy services for individuals, companies, petrol pumps, housing societies, malls, fleet operators, and investors planning to establish EV charging stations in Pakistan."
      }
    }
  });

  await prisma.section.upsert({
    where: { pageId_key: { pageId: servicesPage.id, key: 'services_list' } },
    update: {},
    create: {
      pageId: servicesPage.id,
      key: 'services_list',
      order: 2,
      content: [
        {
          title: "EV Charging Feasibility Study",
          desc: "We assess whether your proposed EV charging station is technically and commercially viable.",
          iconName: "BarChart",
          points: ["Location assessment", "Customer demand analysis", "Charger type recommendation", "Power/load requirement", "CAPEX and OPEX estimate", "Revenue model", "Payback period", "Risk analysis", "Implementation roadmap"]
        },
        {
          title: "Licensing & Regulatory Support",
          desc: "We help clients understand and prepare the required documentation for EV charging station registration, licensing, and regulatory compliance in Pakistan.",
          iconName: "FileText",
          points: ["Regulatory requirement review", "Documentation checklist", "Application support", "Coordination guidance", "Compliance review", "Follow-up support"]
        },
        {
          title: "DISCO / Utility Coordination",
          desc: "EV charging stations require reliable electricity supply. We help assess and coordinate electricity load requirements with the relevant utility.",
          iconName: "Zap",
          points: ["Load estimation", "Transformer requirement review", "Grid connection assessment", "Utility documentation support", "Electrical infrastructure review"]
        },
        {
          title: "Technical Design Advisory",
          desc: "We provide technical guidance for safe and efficient EV charging station setup.",
          iconName: "Settings",
          points: ["AC/DC charger selection", "Charger capacity recommendation", "Cable and protection system review", "Earthing and safety advisory", "Layout planning", "Parking bay design", "Fire and electrical safety considerations"]
        },
        {
          title: "Vendor & Equipment Selection",
          desc: "We help clients compare EV charger suppliers and select suitable equipment based on cost, reliability, warranty, software, payment systems, and after-sales support.",
          iconName: "ShieldCheck",
          points: ["Vendor comparison", "Charger specification review", "Warranty review", "OCPP/software compatibility", "Payment system options", "Maintenance support review"]
        },
        {
          title: "Financial Model & ROI Analysis",
          desc: "We prepare financial models to help investors understand project viability.",
          iconName: "LineChart",
          points: ["CAPEX estimate", "OPEX estimate", "Electricity cost assumptions", "Utilization scenarios", "Revenue projections", "Payback period", "IRR / ROI estimate", "Sensitivity analysis"]
        },
        {
          title: "Installation & Commissioning Support",
          desc: "We support clients during installation and commissioning to ensure the project is implemented properly.",
          iconName: "Wrench",
          points: ["Installation planning", "Contractor coordination", "Technical checklist", "Testing support", "Commissioning documentation", "Launch readiness review"]
        }
      ]
    }
  });

  await prisma.section.upsert({
    where: { pageId_key: { pageId: servicesPage.id, key: 'cta' } },
    update: {},
    create: {
      pageId: servicesPage.id,
      key: 'cta',
      order: 3,
      content: {
        title: "Ready to Start Your EV Charging Project?",
        subtitle: "Get in touch with our experts to discuss your specific requirements."
      }
    }
  });


  // --- LICENSING PAGE ---
  await prisma.page.upsert({
    where: { slug: 'licensing' },
    update: {},
    create: {
      slug: 'licensing',
      title: 'Licensing',
      seoTitle: 'EV Charging Station NEPRA License Pakistan | EVConsults',
      seoDesc: 'Complete guide and advisory on NEPRA licensing, registration, utility connection, and electrical safety compliance for EV charging stations in Pakistan.',
    },
  });
  const licensingPage = await prisma.page.findUnique({ where: { slug: 'licensing' } });

  await prisma.section.upsert({
    where: { pageId_key: { pageId: licensingPage.id, key: 'header' } },
    update: {},
    create: {
      pageId: licensingPage.id,
      key: 'header',
      order: 1,
      content: {
        tag: "Licensing & Regulatory",
        title: "EV Charging Station Licensing & Registration in Pakistan",
        subtitle: "Investors must consider regulatory requirements, electricity connection, technical standards, site safety, and documentation compliance before launching."
      }
    }
  });

  await prisma.section.upsert({
    where: { pageId_key: { pageId: licensingPage.id, key: 'requirements' } },
    update: {},
    create: {
      pageId: licensingPage.id,
      key: 'requirements',
      order: 2,
      content: {
        tag: "Key Requirements",
        title: "Important Areas to Consider",
        description: "A structured overview of every critical area you need to address before going live.",
        items: [
          { title: "Business Registration", desc: "Proper business registration, tax registration, and legal entity documentation (SECP/CNIC/NTN).", iconName: "Building2", color: "#00AEEF" },
          { title: "Site Ownership / Lease", desc: "Clear ownership, lease, or written authorization for installation of EV charging infrastructure at the site.", iconName: "Map", color: "#39D353" },
          { title: "Electricity Load Assessment", desc: "Available electricity load must be assessed to confirm whether the site can support AC or DC charging requirements.", iconName: "Zap", color: "#F59E0B" },
          { title: "Utility / DISCO Coordination", desc: "Coordination with the relevant DISCO for load enhancement, metering, connection approval, or tariff matters.", iconName: "Settings", color: "#8B5CF6" },
          { title: "Technical Compliance", desc: "Safe electrical design, protection systems, earthing, cabling, fire safety, and equipment standards compliance.", iconName: "ShieldAlert", color: "#EF4444" },
          { title: "EV Charger Specifications", desc: "Chargers selected on AC/DC type, power rating, connector type, software, payment system, warranty, and maintenance.", iconName: "Cpu", color: "#10B981" },
          { title: "Registration / Approval Documentation", desc: "Company profile, CNIC/NTN/SECP docs, site documents, load assessment, charger specs, layout plan, safety docs, and utility papers.", iconName: "FileText", color: "#D946EF" }
        ]
      }
    }
  });

  await prisma.section.upsert({
    where: { pageId_key: { pageId: licensingPage.id, key: 'why_choose_us' } },
    update: {},
    create: {
      pageId: licensingPage.id,
      key: 'why_choose_us',
      order: 3,
      content: {
        title: "Why Choose EVConsults?",
        image: "/ev_charging_business.png",
        items: [
          "Pakistan-specific NEPRA licensing guidance",
          "Complete documentation checklist & support",
          "DISCO coordination & load application assistance",
          "Technical compliance verification",
          "Vendor-neutral charger specification advice",
          "End-to-end project documentation"
        ]
      }
    }
  });

  await prisma.section.upsert({
    where: { pageId_key: { pageId: licensingPage.id, key: 'cta' } },
    update: {},
    create: {
      pageId: licensingPage.id,
      key: 'cta',
      order: 4,
      content: {
        title: "Need Licensing Support?",
        description: "Get professional documentation and regulatory guidance from Pakistan's leading EV consultants."
      }
    }
  });


  // --- INDUSTRIES PAGE ---
  await prisma.page.upsert({
    where: { slug: 'industries' },
    update: {},
    create: {
      slug: 'industries',
      title: 'Industries',
      seoTitle: 'EV Charging Solutions for Business Segments | EVConsults',
      seoDesc: 'Tailored EV charging infrastructure solutions for petrol pumps, shopping malls, housing societies, hotels, restaurants, fleets, commercial properties, and investors in Pakistan.',
    },
  });
  const industriesPage = await prisma.page.findUnique({ where: { slug: 'industries' } });

  await prisma.section.upsert({
    where: { pageId_key: { pageId: industriesPage.id, key: 'header' } },
    update: {},
    create: {
      pageId: industriesPage.id,
      key: 'header',
      order: 1,
      content: {
        tag: "Industries We Serve",
        title: "EV Charging Solutions for Every Business Segment",
        subtitle: "Whether adding an amenity, attracting customers, or building a dedicated EV business — EVConsults delivers the right solution."
      }
    }
  });

  await prisma.section.upsert({
    where: { pageId_key: { pageId: industriesPage.id, key: 'industries_list' } },
    update: {},
    create: {
      pageId: industriesPage.id,
      key: 'industries_list',
      order: 2,
      content: {
        tag: "Who We Help",
        title: "Industries We Work With",
        description: "From petrol pump owners to highway developers — we guide every investor through the full EV setup process.",
        items: [
          { title: "Petrol Pumps", desc: "Already serve vehicle users with road visibility — ideal for EV integration.", iconName: "Fuel", color: "#00AEEF" },
          { title: "Shopping Malls", desc: "Attract premium customers and increase parking value and dwell time.", iconName: "ShoppingBag", color: "#39D353" },
          { title: "Housing Societies", desc: "Provide EV charging as a premium resident facility in gated communities.", iconName: "Home", color: "#8B5CF6" },
          { title: "Hotels", desc: "Offer overnight and destination charging for guests and business travelers.", iconName: "Hotel", color: "#F59E0B" },
          { title: "Restaurants", desc: "Attract EV drivers who want to charge their vehicle while they dine.", iconName: "Utensils", color: "#EF4444" },
          { title: "Fleet Operators", desc: "Reduce fuel dependency with dedicated depot or on-route EV charging.", iconName: "Truck", color: "#10B981" },
          { title: "Commercial Buildings", desc: "Offer charging to employees and visitors — enhancing corporate sustainability.", iconName: "Building", color: "#D946EF" },
          { title: "Investors", desc: "Develop EV charging stations as a standalone long-term infrastructure business.", iconName: "User", color: "#0EA5E9" },
          { title: "Highway Rest Areas", desc: "Fast-charging points for intercity travel — solving range anxiety on key routes.", iconName: "MapPin", color: "#F97316" }
        ]
      }
    }
  });

  await prisma.section.upsert({
    where: { pageId_key: { pageId: industriesPage.id, key: 'cta' } },
    update: {},
    create: {
      pageId: industriesPage.id,
      key: 'cta',
      order: 3,
      content: {
        title: "Ready to Launch Your EV Charging Station?",
        description: "Book a free consultation and we'll guide you through every step — from feasibility to commissioning."
      }
    }
  });


  // 3. Seed Global Settings
  console.log('Seeding global settings...');
  
  const defaultSettings = [
    {
      key: 'contact',
      value: {
        email: 'alviaatif@hotmail.com',
        phone1: '0322 5131504',
        phone2: '0332 8271005',
        whatsapp1: '923225131504',
        whatsapp2: '923328271005',
        person1: 'Aatif Alvi',
        person2: 'Naveed Ahmed',
        address: 'Pakistan',
      }
    },
    {
      key: 'social',
      value: {
        facebook: '',
        twitter: '',
        linkedin: '',
        instagram: '',
        youtube: '',
      }
    },
    {
      key: 'seo',
      value: {
        siteTitle: 'EV Charging Station Consultant Pakistan | EVConsults',
        siteDescription: "EVConsults is Pakistan's leading EV charging station consultancy.",
        baseUrl: 'https://www.evconsults.pk',
      }
    },
    {
      key: 'footer',
      value: {
        tagline: 'The leading advisory platform for electric vehicle infrastructure in Pakistan. We provide end-to-end consultancy for feasibility, licensing, and implementation.',
        copyright: 'EVConsults',
      }
    }
  ];

  for (const setting of defaultSettings) {
    await prisma.globalSetting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }


  // 4. Seed Blog Posts
  console.log('Seeding blog posts...');
  
  const posts = [
    {
      title: "How to Start an EV Charging Station Business in Pakistan",
      slug: "start-ev-business-pakistan",
      excerpt: "A step-by-step breakdown of everything you need to launch a profitable EV charging station — from site selection to NEPRA compliance.",
      accent: "#00AEEF",
      image: "/ev_charging_business.png",
      category: "Business Guide",
      readTime: "7 min read",
      publishedAt: new Date("2026-04-28"),
      status: "PUBLISHED",
      body: `### Introduction to EV Charging Stations in Pakistan

The electric vehicle (EV) revolution is rapidly expanding in Pakistan, driven by government incentives, rising fuel costs, and environmental considerations. Starting an EV charging station business presents a highly lucrative early-mover opportunity.

#### Step 1: Market Research and Feasibility Study
Before investing capital, a comprehensive feasibility study is critical. You must evaluate:
- **Location Traffic Analysis:** Choose corridors or transit hubs with premium customer segments.
- **Power Capacity:** Verify if local utility grid (e.g., K-Electric, LESCO, IESCO) has available load capacity.
- **CAPEX and OPEX Modeling:** Calculate the cost of charger purchasing, installation, civil works, and operating costs.

#### Step 2: Selecting the Charger Type (AC vs. DC)
- **AC Chargers (Slow/Medium):** Best suited for shopping malls, apartments, and hotels where vehicles park for 2 to 8 hours.
- **DC Fast Chargers:** Essential for highways and main arterial roads where quick turnaround is required (30-60 minutes).

#### Step 3: Licensing and Approvals
You need to comply with NEPRA (National Electric Power Regulatory Authority) guidelines and submit appropriate applications for electricity load enhancements with DISCOs.

EVConsults provides complete consultancy to navigate these regulatory landscapes seamlessly. Contact us for a specialized feasibility review.`
    },
    {
      title: "EV Charging Station License Requirements in Pakistan",
      slug: "ev-license-requirements",
      excerpt: "Understand the full regulatory framework, NEPRA licensing process, and documentation required to legally operate an EV charging station.",
      accent: "#39D353",
      image: "/clean_energy_city.png",
      category: "Regulatory",
      readTime: "5 min read",
      publishedAt: new Date("2026-04-25"),
      status: "PUBLISHED",
      body: `### Navigating NEPRA Regulations for EV Charging

Under the Pakistan National Electric Vehicle Policy, the government has set clear guidelines for commercial charging service providers.

#### Key Documentation Requirements:
1. **Business Entity Registration:** SECP incorporation certificate, NTN, and tax registration documents.
2. **Site Ownership / Lease Agreement:** Proof of ownership or a notarized lease agreement.
3. **DISCO NOC / Load Assessment:** Technical authorization from the relevant utility company (K-Electric, LESCO, FESCO, etc.) for load connections.
4. **Safety & Technical Compliance:** Electrical design drawings showing protection relay settings, earthing resistance, and layout designs.

To ensure your licensing process proceeds smoothly without delays, consult EVConsults to prepare the compliance checklist.`
    },
    {
      title: "Cost of Setting Up an EV Charging Station in Pakistan",
      slug: "cost-setup-ev-charging",
      excerpt: "A detailed cost analysis covering equipment, civil works, grid connection fees, and ongoing operational expenses for different station types.",
      accent: "#8B5CF6",
      image: "/blog_financial.png",
      category: "Financial",
      readTime: "6 min read",
      publishedAt: new Date("2026-04-20"),
      status: "PUBLISHED",
      body: `### Financial Model for EV Charging Stations

A typical EV charging station investment in Pakistan comprises several key cost items.

#### 1. Charger Procurement Cost
- **AC Chargers (7kW - 22kW):** Typically cost PKR 100,000 to PKR 350,000.
- **DC Fast Chargers (30kW - 120kW):** Range from PKR 1.5 Million to over PKR 6.0 Million depending on capacity and brand.

#### 2. Civil & Electrical Works
- Earthing systems (specialized chemical earthing).
- Cables, distribution boards, circuit breakers, and protection relays.
- Canopies, concrete foundations, and signage.

#### 3. Utility Grid Connection
If your site requires a dedicated transformer or load enhancement, the DISCO demand notice costs can range from PKR 500,000 to PKR 2,000,000+.

Partner with EVConsults for detailed financial modeling and payback estimations.`
    },
    {
      title: "AC vs DC EV Chargers: Which One Is Right for Pakistan?",
      slug: "ac-vs-dc-chargers",
      excerpt: "Compare AC and DC fast-charging technologies side by side — cost, speed, grid compatibility, and use cases specific to the Pakistani market.",
      accent: "#EF4444",
      image: "/blog_ac_vs_dc.png",
      category: "Technical",
      readTime: "8 min read",
      publishedAt: new Date("2026-04-15"),
      status: "PUBLISHED",
      body: `### AC vs DC Charging Systems: A Quick Guide

Understanding the technical difference between Alternating Current (AC) and Direct Current (DC) charging is essential for any EV investor.

#### Alternating Current (AC) Charging
AC charging supplies power to the EV's onboard charger, which converts it to DC to charge the battery.
- **Speed:** Typically slow to medium (3.7kW to 22kW).
- **Cost:** Low capital cost.
- **Best Suited for:** Residential parking, workplace offices, overnight hotels.

#### Direct Current (DC) Charging
DC charging feeds power directly to the EV battery, bypassing the onboard converter.
- **Speed:** Very fast (30kW to 360kW+).
- **Cost:** Highly expensive.
- **Best Suited for:** Highway service areas, commercial fleet hubs, urban quick-charge stations.`
    },
    {
      title: "Best Locations for EV Charging Stations in Pakistan",
      slug: "best-locations-ev-charging",
      excerpt: "Data-driven guidance on high-traffic corridors, commercial zones, and residential hotspots ideal for maximising EV charging station ROI.",
      accent: "#F59E0B",
      image: "/blog_locations.png",
      category: "Business Strategy",
      readTime: "5 min read",
      publishedAt: new Date("2026-04-10"),
      status: "PUBLISHED",
      body: `### Location Strategy for Maximum EV Charging ROI

In the real estate business of EV charging, location is everything. The correct site selection directly dictates your utilization rate.

#### Premium Location Segments:
1. **Petrol Forecourts:** Existing petrol pumps on high-traffic urban avenues.
2. **Motorway & Highway Rest Stops:** Crucial for resolving intercity range anxiety.
3. **Retail Parking Complexes:** Shopping malls and food streets where drivers spend at least 1-2 hours.

Our team at EVConsults utilizes demographic and traffic modeling to analyze your potential site.`
    },
    {
      title: "EV Charging Business Model for Petrol Pump Owners",
      slug: "ev-business-model-petrol-pumps",
      excerpt: "How existing petrol pump operators can diversify revenue and future-proof their forecourts by integrating EV charging infrastructure.",
      accent: "#10B981",
      image: "/blog_petrol_pump.png",
      category: "Industry Solutions",
      readTime: "6 min read",
      publishedAt: new Date("2026-04-05"),
      status: "PUBLISHED",
      body: `### Future-proofing Petrol Stations in Pakistan

Petrol pump owners have an inherent advantage: they already possess prime roadside real estate, existing utility infrastructure, and constant vehicular traffic.

#### Benefits of Adding EV Charging:
- **Attracting High-Value EV Owners:** Premium customers who spend on ancillary retail or cafes while waiting.
- **Second Revenue Stream:** Selling electricity at tariff markups allowed under NEPRA regulations.
- **Green Brand Equity:** Showing environmental compliance.

Contact EVConsults today to evaluate how to integrate DC fast chargers into your existing petrol forecourt.`
    },
    {
      title: "EV Charging Stations for Housing Societies",
      slug: "ev-charging-housing-societies",
      excerpt: "A practical guide for housing society management committees on deploying shared EV charging infrastructure safely and cost-effectively.",
      accent: "#3B82F6",
      image: "/ev_charging_hero.png",
      category: "Residential",
      readTime: "4 min read",
      publishedAt: new Date("2026-03-30"),
      status: "PUBLISHED",
      body: `### Residential EV Charging Solutions

Modern gated housing societies in Pakistan are beginning to adopt EV charging stations as an essential community amenity.

#### Implementation Considerations:
- **Shared Public Charging:** Placing chargers in society commercial hubs or parks.
- **Smart Metering:** Ensuring proper energy allocation and payment tracking.
- **Load Safety:** Preventing local transformer overloads during peak hours.

EVConsults designs tailored power management frameworks for residential complexes.`
    },
    {
      title: "EV Infrastructure: The Investor's Opportunity in Pakistan",
      slug: "ev-opportunity-investors",
      excerpt: "Why EV charging infrastructure is one of the most compelling early-mover investment opportunities emerging in Pakistan's energy sector.",
      accent: "#D946EF",
      image: "/clean_energy_city.png",
      category: "Investment",
      readTime: "7 min read",
      publishedAt: new Date("2026-03-25"),
      status: "PUBLISHED",
      body: `### Why Invest in EV Infrastructure Now?

Early-movers in technology shifts capture the highest market share and brand visibility.

- **Market Growth:** Electric vehicle import volumes and local assembly are rising.
- **Regulatory Support:** Favorable tariff structures and low tax rates for importing chargers.
- **Competitive Advantage:** Establishing charging networks along key highways early secures long-term site exclusivity.

Explore detailed capital requirements with EVConsults' financial advisory desk.`
    },
    {
      title: "Technical Requirements for EV Charging Stations",
      slug: "technical-requirements-ev",
      excerpt: "A comprehensive technical reference covering load calculations, earthing systems, switchgear, and safety standards for EV installations.",
      accent: "#EF4444",
      image: "/blog_ac_vs_dc.png",
      category: "Technical",
      readTime: "9 min read",
      publishedAt: new Date("2026-03-20"),
      status: "PUBLISHED",
      body: `### Technical Design Checklist for EV Charging

Building a charging station requires rigorous compliance with electrical engineering standards.

#### Key Electrical Components:
- **Dedicated Transformer:** Required if total station capacity exceeds 50-100 kW.
- **Earthing System:** Neutral-earth voltage must be strictly under 1-2V to prevent damage to EV chargers and car onboard electronics.
- **Protective Switchgear:** Surge protection devices, over-current, under-voltage, and residual current devices (RCD Type B).

Get professional engineering and safety reviews with EVConsults.`
    },
    {
      title: "EV Charging Station Feasibility Study: What It Includes",
      slug: "ev-feasibility-study",
      excerpt: "Learn what a professional feasibility report covers — demand analysis, financial modelling, risk assessment, and go/no-go recommendations.",
      accent: "#0EA5E9",
      image: "/blog_financial.png",
      category: "Feasibility",
      readTime: "6 min read",
      publishedAt: new Date("2026-03-15"),
      status: "PUBLISHED",
      body: `### The Elements of a Professional EV Feasibility Study

A feasibility report is the blueprint of a successful charging infrastructure project.

#### What EVConsults Includes:
1. **Technical Feasibility:** Site power verification, structural accessibility, and cabling routing.
2. **Financial Modeling:** IRR, NPV, paybacks, and multi-scenario utilization analyses.
3. **Regulatory Audit:** Checking local DISCO regulations and NEPRA compliance requirements.
4. **Risk Matrix:** Assessing power outage risks, equipment failures, and demand shifts.

Avoid investment mistakes by initiating your project with an EVConsults Feasibility Study.`
    }
  ];

  for (const post of posts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {},
      create: post,
    });
  }

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
