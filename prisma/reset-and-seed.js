// prisma/reset-and-seed.js
// Wipes all Funddoo CMS tables then seeds fresh data.
//
// Run with DATABASE_URL set:
//   DATABASE_URL="mysql://..." node prisma/reset-and-seed.js
//
// Or with a .env file in the project root:
//   node prisma/reset-and-seed.js

import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'
dotenv.config()

const prisma = new PrismaClient()

// ── helpers ─────────────────────────────────────────────────────────────────

function ok(msg)   { console.log(`   ✔  ${msg}`) }
function head(msg) { console.log(`\n${msg}`) }
function done(msg) { console.log(`\n✅  ${msg}\n`) }

// ── CLEAR ───────────────────────────────────────────────────────────────────

async function clearAll() {
  head('🗑️   Clearing all tables…')
  // Children first — respect FK constraints
  const steps = [
    ['content_blocks', () => prisma.contentBlock.deleteMany({})],
    ['sections',       () => prisma.section.deleteMany({})],
    ['metadata',       () => prisma.metadata.deleteMany({})],
    ['pages',          () => prisma.page.deleteMany({})],
    ['navigation',     () => prisma.navigation.deleteMany({})],
    ['footer_links',   () => prisma.footerLink.deleteMany({})],
    ['footer_columns', () => prisma.footerColumn.deleteMany({})],
    ['footer_socials', () => prisma.footerSocial.deleteMany({})],
    ['footer_meta',    () => prisma.footerMeta.deleteMany({})],
    ['campaigns',      () => prisma.campaign.deleteMany({})],
    ['categories',     () => prisma.category.deleteMany({})],
    ['testimonials',   () => prisma.testimonial.deleteMany({})],
    ['faqs',           () => prisma.faq.deleteMany({})],
    ['settings',       () => prisma.setting.deleteMany({})],
  ]
  for (const [label, fn] of steps) {
    const r = await fn()
    ok(`${label} cleared (${r.count} rows removed)`)
  }
}

// ── SEED ────────────────────────────────────────────────────────────────────

async function seedAll() {
  head('🌱  Seeding Funddoo data…')

  // ── Settings ──────────────────────────────────────────────────────────────
  await prisma.setting.createMany({
    data: [
      { settingGroup:'general',   settingKey:'site_name',          settingValue:'Funddoo',                 settingType:'string',  description:'Site brand name' },
      { settingGroup:'general',   settingKey:'site_tagline',       settingValue:'Together we save lives.', settingType:'string'  },
      { settingGroup:'general',   settingKey:'site_url',           settingValue:'https://www.funddoo.com', settingType:'string'  },
      { settingGroup:'general',   settingKey:'logo_primary_text',  settingValue:'Fund',                    settingType:'string'  },
      { settingGroup:'general',   settingKey:'logo_accent_text',   settingValue:'doo',                     settingType:'string'  },
      { settingGroup:'general',   settingKey:'theme_color',        settingValue:'#1B9B6C',                 settingType:'string'  },
      { settingGroup:'general',   settingKey:'cards_per_page',     settingValue:'10',                      settingType:'number',  description:'Campaigns per page' },
      { settingGroup:'general',   settingKey:'pagination_enabled', settingValue:'true',                    settingType:'boolean' },
      { settingGroup:'contact',   settingKey:'support_email',      settingValue:'support@funddoo.com',     settingType:'string'  },
      { settingGroup:'contact',   settingKey:'support_phone',      settingValue:'+91-800-100-1234',        settingType:'string'  },
      { settingGroup:'analytics', settingKey:'ga_tracking_id',     settingValue:'G-XXXXXXXXXX',            settingType:'string'  },
      { settingGroup:'features',  settingKey:'donations_enabled',  settingValue:'true',                    settingType:'boolean' },
      { settingGroup:'features',  settingKey:'paypal_sandbox',     settingValue:'true',                    settingType:'boolean' },
    ],
  })
  ok('Settings (13)')

  // ── Home page ─────────────────────────────────────────────────────────────
  const homePage = await prisma.page.create({
    data: {
      slug:        'home',
      title:       'Funddoo — Crowdfunding for Medical & Personal Causes in India',
      description: 'Funddoo helps people raise funds for medical and personal causes. Together we save lives.',
      isPublished: true,
      sortOrder:   1,
      metadata: {
        create: {
          metaTitle:       'Funddoo — Crowdfunding for Medical & Personal Causes in India',
          metaDescription: 'Funddoo is a platform that helps people raise funds for medical and personal causes. Start your campaign free in minutes. Together we save lives.',
          metaKeywords:    'crowdfunding India, medical crowdfunding, fundraising platform, Funddoo',
          ogTitle:         'Funddoo — Together We Save Lives',
          ogDescription:   'Funddoo helps people raise funds for medical emergencies, education and personal causes.',
          ogImage:         '/og-image.png',
          canonicalUrl:    'https://www.funddoo.com/',
          robots:          'index, follow',
        },
      },
    },
  })
  ok('Page: home + metadata')

  // ── Sections + content blocks ─────────────────────────────────────────────
  const sectionsData = [
    {
      sectionKey: 'hero',
      heading:    'Together We Save Lives.',
      subheading: 'Funddoo helps people raise funds for medical and personal causes. Start your campaign free in minutes.',
      tag:        null,
      sortOrder:  1,
      blocks: [
        { blockKey:'trust_badge',         blockValue:'🌟 A new platform for people who care' },
        { blockKey:'heading_line1',       blockValue:'Together We' },
        { blockKey:'heading_line2',       blockValue:'Save Lives.' },
        { blockKey:'subheading',          blockValue:'Funddoo helps people raise funds for medical and personal causes. Start your campaign free in minutes and make a real difference.' },
        { blockKey:'cta_primary_label',   blockValue:'Donate Now' },
        { blockKey:'cta_primary_href',    blockValue:'#campaigns' },
        { blockKey:'cta_secondary_label', blockValue:'Start Fundraising →' },
        { blockKey:'cta_secondary_href',  blockValue:'#start' },
        { blockKey:'stat1_num',           blockValue:'₹0 Fee' },
        { blockKey:'stat1_label',         blockValue:'Medical Campaigns' },
        { blockKey:'stat2_num',           blockValue:'100%' },
        { blockKey:'stat2_label',         blockValue:'Secure Payments' },
        { blockKey:'stat3_num',           blockValue:'24/7' },
        { blockKey:'stat3_label',         blockValue:'Fundraising Support' },
        { blockKey:'float_card1_title',   blockValue:"Rohan's Cancer Treatment" },
        { blockKey:'float_card1_emoji',   blockValue:'👦' },
        { blockKey:'float_card1_pct',     blockValue:'72' },
        { blockKey:'float_card1_bg',      blockValue:'linear-gradient(135deg,#FF6B6B,#FF8E53)' },
        { blockKey:'float_card2_title',   blockValue:'Education for Tribal Kids' },
        { blockKey:'float_card2_emoji',   blockValue:'📚' },
        { blockKey:'float_card2_pct',     blockValue:'89' },
        { blockKey:'float_card2_bg',      blockValue:'linear-gradient(135deg,#4facfe,#00c6ff)' },
      ],
    },
    {
      sectionKey: 'campaigns',
      heading:    'Fundraising Campaigns That Need Your Support',
      subheading: 'Real people, real emergencies. Every donation — no matter how small — can change a life.',
      tag:        'Featured Campaigns',
      sortOrder:  2,
      blocks: [
        { blockKey:'view_all_label',   blockValue:'View All Campaigns →' },
        { blockKey:'filter_all_label', blockValue:'All Causes' },
      ],
    },
    {
      sectionKey: 'how-it-works',
      heading:    'How to Start a Crowdfunding Campaign',
      subheading: 'From launch to impact in 4 easy steps — no technical skills needed.',
      tag:        'Simple Process',
      sortOrder:  3,
      blocks: [
        { blockKey:'step1_num',   blockValue:'01' },
        { blockKey:'step1_icon',  blockValue:'✍️' },
        { blockKey:'step1_title', blockValue:'Start Your Campaign' },
        { blockKey:'step1_desc',  blockValue:'Fill in your story, set a fundraising goal, and launch in under 10 minutes — completely free.' },
        { blockKey:'step2_num',   blockValue:'02' },
        { blockKey:'step2_icon',  blockValue:'📣' },
        { blockKey:'step2_title', blockValue:'Share With Your Network' },
        { blockKey:'step2_desc',  blockValue:'Share across WhatsApp, Facebook, and email. Reach donors who care about your cause.' },
        { blockKey:'step3_num',   blockValue:'03' },
        { blockKey:'step3_icon',  blockValue:'💸' },
        { blockKey:'step3_title', blockValue:'Receive Donations Securely' },
        { blockKey:'step3_desc',  blockValue:'Donors contribute via UPI, cards, or net banking. Funds transfer directly to your account.' },
        { blockKey:'step4_num',   blockValue:'04' },
        { blockKey:'step4_icon',  blockValue:'🎉' },
        { blockKey:'step4_title', blockValue:'Make a Lasting Impact' },
        { blockKey:'step4_desc',  blockValue:'Use the funds for your cause, update your donors with progress, and inspire more giving.' },
      ],
    },
    {
      sectionKey: 'categories',
      heading:    'Fundraising Categories',
      subheading: 'From medical fundraising to disaster relief — find campaigns that match your values.',
      tag:        'Browse by Cause',
      sortOrder:  4,
      blocks:     [],
    },
    {
      sectionKey: 'testimonials',
      heading:    'What Our Donors & Campaigners Say',
      subheading: 'Real stories from the Funddoo community',
      tag:        'Real Stories',
      sortOrder:  5,
      blocks:     [],
    },
    {
      sectionKey: 'faq',
      heading:    'Frequently Asked Questions',
      subheading: 'Everything you need to know about starting or donating to a campaign on Funddoo.',
      tag:        'Got Questions?',
      sortOrder:  6,
      blocks:     [],
    },
    {
      sectionKey: 'cta',
      heading:    'Start Your Free Crowdfunding Campaign Today',
      subheading: 'Funddoo helps people raise funds for medical and personal causes. Zero platform fee for medical campaigns.',
      tag:        null,
      sortOrder:  7,
      blocks: [
        { blockKey:'benefit1',            blockValue:'✅ 100% Secure Payments' },
        { blockKey:'benefit2',            blockValue:'✅ Zero Platform Fee' },
        { blockKey:'benefit3',            blockValue:'✅ 24/7 Fundraising Support' },
        { blockKey:'cta_primary_label',   blockValue:"Start Your Campaign - It's Free →" },
        { blockKey:'cta_secondary_label', blockValue:'Explore Campaigns' },
      ],
    },
  ]

  for (const { blocks, ...sData } of sectionsData) {
    await prisma.section.create({
      data: {
        pageId: homePage.id,
        ...sData,
        contentBlocks: {
          create: blocks.map((b, i) => ({ sortOrder: i, blockType: 'text', ...b })),
        },
      },
    })
  }
  ok('Sections (7) + ContentBlocks')

  // ── Navigation — exactly 7 rows, no duplicates ────────────────────────────
  await prisma.navigation.createMany({
    data: [
      { location:'header', label:'Campaigns',        href:'#campaigns',    ariaLabel:'View fundraising campaigns',   isActive:true, sortOrder:1 },
      { location:'header', label:'Categories',       href:'#categories',   ariaLabel:'Browse campaign categories',   isActive:true, sortOrder:2 },
      { location:'header', label:'How It Works',     href:'#how',          ariaLabel:'Learn how crowdfunding works', isActive:true, sortOrder:3 },
      { location:'header', label:'Stories',          href:'#testimonials', ariaLabel:'Read donor success stories',   isActive:true, sortOrder:4 },
      { location:'header', label:'FAQ',              href:'#faq',          ariaLabel:'Frequently asked questions',   isActive:true, sortOrder:5 },
      { location:'header', label:'Explore',          href:'#campaigns',    ariaLabel:'Browse fundraising campaigns', isActive:true, sortOrder:6 },
      { location:'header', label:'Start a Campaign', href:'#start',        ariaLabel:'Start your free campaign',     isActive:true, sortOrder:7 },
    ],
  })
  ok('Navigation (7 rows, no duplicates)')

  // ── Footer ────────────────────────────────────────────────────────────────
  const footerCols = [
    { heading:'Fundraise For', sortOrder:1, links:[
      { label:'Medical Treatment Fundraising', href:'/campaigns/medical'   },
      { label:'Cancer Care Crowdfunding',      href:'/campaigns/medical'   },
      { label:'Child Education Fundraising',   href:'/campaigns/education' },
      { label:'NGO Campaign Fundraising',      href:'/campaigns/ngo'       },
      { label:'Disaster Relief Fund',          href:'/campaigns/disaster'  },
    ]},
    { heading:'Company', sortOrder:2, links:[
      { label:'About Funddoo',          href:'/about'        },
      { label:'How Crowdfunding Works', href:'/how-it-works' },
      { label:'Platform Pricing',       href:'/pricing'      },
    ]},
    { heading:'Support', sortOrder:3, links:[
      { label:'Help Centre',      href:'/help'    },
      { label:'Contact Us',       href:'/contact' },
      { label:'Privacy Policy',   href:'/privacy' },
    ]},
  ]
  for (const { links, ...col } of footerCols) {
    const c = await prisma.footerColumn.create({ data: col })
    await prisma.footerLink.createMany({
      data: links.map((l, i) => ({ footerColumnId: c.id, sortOrder: i + 1, ...l })),
    })
  }
  await prisma.footerSocial.createMany({
    data: [
      { label:'Facebook',  glyph:'f',  platform:'facebook',  href:'https://facebook.com/funddoo',        sortOrder:1 },
      { label:'Twitter/X', glyph:'𝕏', platform:'twitter',   href:'https://twitter.com/funddoo',         sortOrder:2 },
      { label:'Instagram', glyph:'▲', platform:'instagram', href:'https://instagram.com/funddoo',        sortOrder:3 },
      { label:'LinkedIn',  glyph:'in', platform:'linkedin', href:'https://linkedin.com/company/funddoo', sortOrder:4 },
    ],
  })
  await prisma.footerMeta.createMany({
    data: [
      { metaKey:'company_name',      metaValue:'Funddoo' },
      { metaKey:'tagline',           metaValue:'Together we save lives.' },
      { metaKey:'address_street',    metaValue:'1601, One BKC, Bandra Kurla Complex' },
      { metaKey:'address_city',      metaValue:'Mumbai' },
      { metaKey:'address_state',     metaValue:'Maharashtra' },
      { metaKey:'address_pin',       metaValue:'400051' },
      { metaKey:'address_country',   metaValue:'India' },
      { metaKey:'copyright_text',    metaValue:'Funddoo. All rights reserved.' },
      { metaKey:'disclaimer',        metaValue:'Funddoo is a new crowdfunding platform. Payments are processed securely via RBI-compliant gateways.' },
      { metaKey:'legal_link1_label', metaValue:'Privacy Policy'   },
      { metaKey:'legal_link1_href',  metaValue:'#'                },
      { metaKey:'legal_link2_label', metaValue:'Terms of Service' },
      { metaKey:'legal_link2_href',  metaValue:'#'                },
      { metaKey:'legal_link3_label', metaValue:'Sitemap'          },
      { metaKey:'legal_link3_href',  metaValue:'#'                },
    ],
  })
  ok('Footer (columns, links, socials, meta)')

  // ── Campaigns (17) ────────────────────────────────────────────────────────
  await prisma.campaign.createMany({
    data: [
      { title:'Help Rohan Beat Leukemia',              slug:'help-rohan-beat-leukemia',        description:'6-year-old Rohan needs urgent bone marrow transplant. His family has exhausted all savings fighting cancer for 2 years.',         category:'medical',     label:'Medical',        raised:1450000n, goal:2000000n, donors:1240, daysLeft:8,  isUrgent:true,  emoji:'👦',    bgGradient:'linear-gradient(135deg,#FF6B6B,#FF8E53)', sortOrder:1  },
      { title:'School Books for 200 Tribal Children',  slug:'school-books-tribal-children',    description:'Children in remote Odisha villages walk miles to school yet lack basic textbooks. Help us change that this year.',                category:'education',   label:'Education',      raised:340000n,  goal:400000n,  donors:863,  daysLeft:22, isUrgent:false, emoji:'📚',    bgGradient:'linear-gradient(135deg,#4facfe,#00c6ff)', sortOrder:2  },
      { title:'Assam Flood Victims - Emergency Aid',   slug:'assam-flood-victims-emergency',   description:'Families displaced by catastrophic flooding need food kits, clean water, and shelter immediately.',                               category:'disaster',    label:'Disaster Relief',raised:2800000n, goal:5000000n, donors:8921, daysLeft:5,  isUrgent:true,  emoji:'🌊',    bgGradient:'linear-gradient(135deg,#667eea,#764ba2)', sortOrder:3  },
      { title:'Rescue & Rehab 100 Street Dogs',        slug:'rescue-rehab-street-dogs',        description:"Mumbai's Paws & Love Foundation rescues injured strays. Funds go to surgery, vaccination, and shelter care.",                    category:'animals',     label:'Animal Welfare', raised:210000n,  goal:350000n,  donors:540,  daysLeft:30, isUrgent:false, emoji:'🐕',    bgGradient:'linear-gradient(135deg,#f7971e,#ffd200)', sortOrder:4  },
      { title:'Heart Surgery for Baby Mira',           slug:'heart-surgery-baby-mira',         description:'4-month-old Mira has a congenital heart defect. Her parents, daily wage workers, cannot afford the surgery.',                    category:'medical',     label:'Medical',        raised:320000n,  goal:500000n,  donors:412,  daysLeft:6,  isUrgent:true,  emoji:'💗',    bgGradient:'linear-gradient(135deg,#f857a6,#ff5858)', sortOrder:5  },
      { title:'Digital Skills for Rural Women',        slug:'digital-skills-rural-women',      description:'Empowering 300 women in Rajasthan with computer literacy and digital business skills for financial independence.',               category:'education',   label:'Education',      raised:185000n,  goal:300000n,  donors:329,  daysLeft:45, isUrgent:false, emoji:'👩‍💻', bgGradient:'linear-gradient(135deg,#0072ff,#00c6ff)', sortOrder:6  },
      { title:'Plant 10,000 Trees in Bengaluru',       slug:'plant-trees-bengaluru',           description:'Urban Bengaluru has lost significant tree cover. Join a community reforestation drive across the city.',                          category:'environment', label:'Environment',    raised:140000n,  goal:200000n,  donors:711,  daysLeft:60, isUrgent:false, emoji:'🌿',    bgGradient:'linear-gradient(135deg,#56ab2f,#a8e063)', sortOrder:7  },
      { title:'Dialysis Support for 50 Patients',      slug:'dialysis-support-patients',       description:'Chronic kidney disease patients cannot afford dialysis sessions. Your support keeps them alive.',                                 category:'medical',     label:'Medical',        raised:620000n,  goal:900000n,  donors:1876, daysLeft:12, isUrgent:true,  emoji:'🏥',    bgGradient:'linear-gradient(135deg,#1d976c,#93f9b9)', sortOrder:8  },
      { title:'Rebuild Village School After Cyclone',  slug:'rebuild-village-school-cyclone',  description:'A cyclone destroyed the only school in a coastal village. 400 children need a new building urgently.',                           category:'disaster',    label:'Disaster Relief',raised:780000n,  goal:1500000n, donors:2103, daysLeft:20, isUrgent:true,  emoji:'🏫',    bgGradient:'linear-gradient(135deg,#a18cd1,#fbc2eb)', sortOrder:9  },
      { title:'Feed 500 Street Animals This Winter',   slug:'feed-street-animals-winter',      description:"Bitter cold endangers stray animals. Help us provide food and warmth across Delhi's streets.",                                   category:'animals',     label:'Animal Welfare', raised:95000n,   goal:180000n,  donors:287,  daysLeft:14, isUrgent:false, emoji:'🐾',    bgGradient:'linear-gradient(135deg,#fda085,#f6d365)', sortOrder:10 },
      { title:'Liver Transplant for Ravi Kumar',       slug:'liver-transplant-ravi-kumar',     description:'34-year-old Ravi, a schoolteacher, needs an emergency liver transplant. He has two young daughters depending on him.',           category:'medical',     label:'Medical',        raised:2100000n, goal:3500000n, donors:4521, daysLeft:9,  isUrgent:true,  emoji:'🧑‍⚕️',bgGradient:'linear-gradient(135deg,#f093fb,#f5576c)', sortOrder:11 },
      { title:'Solar Power for 50 Rural Homes',        slug:'solar-power-rural-homes',         description:'50 households in Jharkhand have no electricity. Solar panels will transform their lives.',                                        category:'environment', label:'Environment',    raised:440000n,  goal:750000n,  donors:912,  daysLeft:35, isUrgent:false, emoji:'☀️',    bgGradient:'linear-gradient(135deg,#fddb92,#d1fdff)', sortOrder:12 },
      { title:'Scholarships for 50 Dalit Girls',       slug:'scholarships-dalit-girls',        description:'Break the cycle of poverty. Fund annual scholarships for Dalit girls from Uttar Pradesh to pursue STEM education.',               category:'education',   label:'Education',      raised:310000n,  goal:600000n,  donors:678,  daysLeft:28, isUrgent:false, emoji:'👩‍🎓', bgGradient:'linear-gradient(135deg,#a1c4fd,#c2e9fb)', sortOrder:13 },
      { title:'Prosthetic Limbs for 10 War Veterans',  slug:'prosthetic-limbs-veterans',       description:'Brave ex-servicemen who lost limbs in the line of duty deserve to walk again. Help fund life-changing prosthetics.',             category:'medical',     label:'Medical',        raised:870000n,  goal:1200000n, donors:3201, daysLeft:18, isUrgent:false, emoji:'🦿',    bgGradient:'linear-gradient(135deg,#30cfd0,#330867)', sortOrder:14 },
      { title:'Clean Drinking Water for Melghat Tribe',slug:'clean-water-melghat-tribe',       description:'The Korku tribe in Melghat walks kilometres for water. Install tube wells and save hundreds of lives.',                          category:'disaster',    label:'Disaster Relief',raised:530000n,  goal:800000n,  donors:1122, daysLeft:25, isUrgent:false, emoji:'💧',    bgGradient:'linear-gradient(135deg,#4facfe,#0072ff)', sortOrder:15 },
      { title:'Save the Olive Ridley Sea Turtles',     slug:'save-olive-ridley-turtles',       description:"Poachers threaten India's Olive Ridley nesting grounds on the Odisha coast. Fund rangers and conservation.",                    category:'environment', label:'Environment',    raised:220000n,  goal:400000n,  donors:541,  daysLeft:50, isUrgent:false, emoji:'🐢',    bgGradient:'linear-gradient(135deg,#0ba360,#3cba92)', sortOrder:16 },
      { title:'Spinal Surgery for Priya Mehta',        slug:'spinal-surgery-priya-mehta',      description:'28-year-old Priya is paralysed from the waist down after an accident. Spinal surgery could give her life back.',               category:'medical',     label:'Medical',        raised:1800000n, goal:2500000n, donors:3890, daysLeft:11, isUrgent:true,  emoji:'🦽',    bgGradient:'linear-gradient(135deg,#f77062,#fe5196)', sortOrder:17 },
    ],
  })
  ok('Campaigns (17)')

  // ── Categories ────────────────────────────────────────────────────────────
  await prisma.category.createMany({
    data: [
      { slug:'medical',     label:'Medical',        emoji:'🏥', count:'Browse →', bgClass:'bg-orange-50',  borderClass:'border-orange-200',  sortOrder:1 },
      { slug:'education',   label:'Education',       emoji:'📚', count:'Browse →', bgClass:'bg-green-50',   borderClass:'border-green-200',   sortOrder:2 },
      { slug:'disaster',    label:'Disaster Relief', emoji:'🌊', count:'Browse →', bgClass:'bg-blue-50',    borderClass:'border-blue-200',    sortOrder:3 },
      { slug:'animals',     label:'Animal Welfare',  emoji:'🐾', count:'Browse →', bgClass:'bg-yellow-50',  borderClass:'border-yellow-200',  sortOrder:4 },
      { slug:'women',       label:'Women & Girls',   emoji:'👩', count:'Browse →', bgClass:'bg-pink-50',    borderClass:'border-pink-200',    sortOrder:5 },
      { slug:'environment', label:'Environment',     emoji:'🌿', count:'Browse →', bgClass:'bg-emerald-50', borderClass:'border-emerald-200', sortOrder:6 },
    ],
  })
  ok('Categories (6)')

  // ── Testimonials ──────────────────────────────────────────────────────────
  await prisma.testimonial.createMany({
    data: [
      { quote:"Funddoo made it incredibly easy to share our story. Within days, people from across India were supporting my father's treatment. The transparency gave us real hope.",  name:'Priya Sharma',  location:'Mumbai, Maharashtra',  initials:'PS', colorClass:'bg-green-600',  rating:5, sortOrder:1 },
      { quote:"I started a campaign for my village school on Funddoo. Donors from everywhere helped us build a library the children had always dreamed of owning.",                    name:'Ramesh Nair',   location:'Kozhikode, Kerala',    initials:'RN', colorClass:'bg-teal-600',   rating:5, sortOrder:2 },
      { quote:"The platform is transparent and simple. I could see exactly how funds were being used throughout my campaign. That trust matters enormously.",                           name:'Anjali Das',    location:'Guwahati, Assam',      initials:'AD', colorClass:'bg-indigo-600', rating:5, sortOrder:3 },
      { quote:"Funddoo connected my campaign with donors I would never have reached on my own. Their support team guided me every step of the way.",                                    name:'Vikram Patel',  location:'Ahmedabad, Gujarat',   initials:'VP', colorClass:'bg-purple-600', rating:5, sortOrder:4 },
    ],
  })
  ok('Testimonials (4)')

  // ── FAQs ──────────────────────────────────────────────────────────────────
  await prisma.faq.createMany({
    data: [
      { question:'How do I start a fundraiser on Funddoo?',              answer:'Starting a fundraiser is free and takes under 10 minutes. Fill in your story, upload a photo, set your goal, and launch.',    sortOrder:1 },
      { question:'Is there a platform fee for medical crowdfunding?',    answer:'Funddoo charges zero platform fee for medical campaigns. A small payment processing fee (2-3%) applies.',                   sortOrder:2 },
      { question:'How quickly will I receive the donated funds?',        answer:'Funds are transferred to your verified bank account within 5-7 working days.',                                                sortOrder:3 },
      { question:'Is donating on Funddoo safe and secure?',              answer:'Yes. We use 256-bit SSL encryption and partner with RBI-compliant payment gateways. Every transaction is fully secure.',      sortOrder:4 },
      { question:"Can I fundraise for someone else's medical treatment?", answer:'Absolutely. You can start a campaign on behalf of a family member, friend, or anyone in need.',                              sortOrder:5 },
      { question:'What types of causes can I raise funds for?',          answer:'Medical treatment, education, disaster relief, animal welfare, women empowerment, environmental causes, and NGO projects.',   sortOrder:6 },
    ],
  })
  ok('FAQs (6)')

  done('Funddoo DB reset + seeded successfully!')
  console.log('   📊  17 campaigns (2 pages at limit=10)')
  console.log('   🧭   7 navigation rows  (no duplicates)')
  console.log('   🗂️   7 sections + all content blocks')
  console.log('   👣   3 footer columns + socials + meta')
  console.log('   ⭐   4 testimonials')
  console.log('   ❓   6 FAQs')
  console.log('   ⚙️   13 settings\n')
}

// ── Run ─────────────────────────────────────────────────────────────────────
async function main() {
  await clearAll()
  console.log('\n════════════════════════════════════════')
  await seedAll()
}

main()
  .catch((e) => { console.error('\n❌  Failed:', e.message); process.exit(1) })
  .finally(() => prisma.$disconnect())
