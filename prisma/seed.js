// prisma/seed.js - Full seed for ImpactGuru CMS database
// Run: node prisma/seed.js  OR  npx prisma db seed

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log('🌱  Seeding ImpactGuru database...\n')

  // ─────────────────────────────────────────────
  // SETTINGS
  // ─────────────────────────────────────────────
  await prisma.setting.createMany({
    skipDuplicates: true,
    data: [
      { settingGroup:'general',   settingKey:'site_name',          settingValue:'ImpactGuru',                        settingType:'string',  description:'Site brand name' },
      { settingGroup:'general',   settingKey:'site_tagline',       settingValue:"India's #1 Crowdfunding Platform",  settingType:'string'  },
      { settingGroup:'general',   settingKey:'site_url',           settingValue:'https://www.impactguru.com',         settingType:'string'  },
      { settingGroup:'general',   settingKey:'logo_primary_text',  settingValue:'Impact',                            settingType:'string'  },
      { settingGroup:'general',   settingKey:'logo_accent_text',   settingValue:'Guru',                              settingType:'string'  },
      { settingGroup:'general',   settingKey:'theme_color',        settingValue:'#FF5722',                           settingType:'string'  },
      { settingGroup:'general',   settingKey:'cards_per_page',     settingValue:'10',                                settingType:'number',  description:'Campaigns shown per page' },
      { settingGroup:'general',   settingKey:'pagination_enabled', settingValue:'true',                              settingType:'boolean' },
      { settingGroup:'contact',   settingKey:'support_email',      settingValue:'support@impactguru.com',            settingType:'string'  },
      { settingGroup:'contact',   settingKey:'support_phone',      settingValue:'+91-800-100-1234',                  settingType:'string'  },
      { settingGroup:'analytics', settingKey:'ga_tracking_id',     settingValue:'G-XXXXXXXXXX',                      settingType:'string'  },
      { settingGroup:'features',  settingKey:'donations_enabled',  settingValue:'true',                              settingType:'boolean' },
      { settingGroup:'features',  settingKey:'paypal_sandbox',     settingValue:'true',                              settingType:'boolean' },
    ],
  })
  console.log('✔  Settings')

  // ─────────────────────────────────────────────
  // PAGE: home
  // ─────────────────────────────────────────────
  const homePage = await prisma.page.upsert({
    where:  { slug: 'home' },
    update: {},
    create: {
      slug:        'home',
      title:       'ImpactGuru - Crowdfunding for Medical, Education & Social Causes in India',
      description: "India's most trusted crowdfunding platform.",
      isPublished: true,
      sortOrder:   1,
    },
  })

  await prisma.metadata.upsert({
    where:  { pageId: homePage.id },
    update: {},
    create: {
      pageId:          homePage.id,
      metaTitle:       'ImpactGuru - Crowdfunding for Medical, Education & Social Causes in India',
      metaDescription: "ImpactGuru is India's most trusted crowdfunding platform. Raise funds for medical treatment, education, disaster relief & more. Over ₹1,200 Cr raised.",
      metaKeywords:    'crowdfunding India, medical crowdfunding, fundraising platform, donate online India, ImpactGuru',
      ogTitle:         'ImpactGuru - Crowdfunding for Medical & Social Causes in India',
      ogDescription:   "India's most trusted crowdfunding platform. ₹1,200 Cr+ raised. 20M+ lives impacted.",
      ogImage:         'https://www.impactguru.com/og-image.png',
      canonicalUrl:    'https://www.impactguru.com/',
      robots:          'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
    },
  })
  console.log('✔  Pages + Metadata')

  // ─────────────────────────────────────────────
  // SECTIONS & CONTENT BLOCKS
  // ─────────────────────────────────────────────
  const sections = [
    {
      sectionKey:'hero', heading:"India's #1 Crowdfunding Platform",
      subheading:'Raise funds for medical emergencies, education, and social causes. Over ₹1,200 Cr raised. Start your campaign free in minutes.',
      tag:null, sortOrder:1,
      blocks:[
        { blockKey:'trust_badge',         blockValue:'🌟 Trusted by 2M+ donors across India',              blockType:'text'   },
        { blockKey:'heading_line1',       blockValue:"India's #1",                                          blockType:'text'   },
        { blockKey:'heading_line2',       blockValue:'Crowdfunding Platform',                               blockType:'text'   },
        { blockKey:'subheading',          blockValue:'Raise funds for medical emergencies, education, and social causes. Over ₹1,200 Cr raised. Start your campaign free in minutes.', blockType:'text' },
        { blockKey:'cta_primary_label',   blockValue:'Donate Now',                                          blockType:'text'   },
        { blockKey:'cta_primary_href',    blockValue:'#campaigns',                                          blockType:'url'    },
        { blockKey:'cta_secondary_label', blockValue:'Start Fundraising →',                                 blockType:'text'   },
        { blockKey:'cta_secondary_href',  blockValue:'#start',                                              blockType:'url'    },
        { blockKey:'stat1_num',           blockValue:'₹1,200 Cr+',                                          blockType:'text'   },
        { blockKey:'stat1_label',         blockValue:'Total Raised',                                        blockType:'text'   },
        { blockKey:'stat2_num',           blockValue:'5,00,000+',                                           blockType:'text'   },
        { blockKey:'stat2_label',         blockValue:'Active Campaigns',                                    blockType:'text'   },
        { blockKey:'stat3_num',           blockValue:'20M+',                                                blockType:'text'   },
        { blockKey:'stat3_label',         blockValue:'Lives Impacted',                                      blockType:'text'   },
        { blockKey:'float_card1_title',   blockValue:"Rohan's Cancer Treatment",                            blockType:'text'   },
        { blockKey:'float_card1_emoji',   blockValue:'👦',                                                  blockType:'text'   },
        { blockKey:'float_card1_pct',     blockValue:'72',                                                  blockType:'number' },
        { blockKey:'float_card1_bg',      blockValue:'linear-gradient(135deg,#FF6B6B,#FF8E53)',              blockType:'text'   },
        { blockKey:'float_card2_title',   blockValue:'Education for Tribal Kids',                           blockType:'text'   },
        { blockKey:'float_card2_emoji',   blockValue:'📚',                                                  blockType:'text'   },
        { blockKey:'float_card2_pct',     blockValue:'89',                                                  blockType:'number' },
        { blockKey:'float_card2_bg',      blockValue:'linear-gradient(135deg,#4facfe,#00c6ff)',              blockType:'text'   },
      ],
    },
    {
      sectionKey:'campaigns', heading:'Fundraising Campaigns That Need Your Support',
      subheading:'Real people, real emergencies across India. Every donation — no matter how small — changes a life.',
      tag:'Featured Campaigns', sortOrder:2,
      blocks:[
        { blockKey:'view_all_label',   blockValue:'View All Campaigns →', blockType:'text' },
        { blockKey:'filter_all_label', blockValue:'All Causes',           blockType:'text' },
      ],
    },
    {
      sectionKey:'how-it-works', heading:'How to Start a Crowdfunding Campaign',
      subheading:'From launch to impact in 4 easy steps — no technical skills needed.',
      tag:'Simple Process', sortOrder:3,
      blocks:[
        { blockKey:'step1_num',   blockValue:'01',                        blockType:'text' },
        { blockKey:'step1_icon',  blockValue:'✍️',                       blockType:'text' },
        { blockKey:'step1_title', blockValue:'Start Your Campaign',       blockType:'text' },
        { blockKey:'step1_desc',  blockValue:'Fill in your story, set a fundraising goal, and launch your campaign in under 10 minutes — completely free.', blockType:'text' },
        { blockKey:'step2_num',   blockValue:'02',                        blockType:'text' },
        { blockKey:'step2_icon',  blockValue:'📣',                       blockType:'text' },
        { blockKey:'step2_title', blockValue:'Share With Your Network',   blockType:'text' },
        { blockKey:'step2_desc',  blockValue:'Share across WhatsApp, Facebook, and email. Our team helps promote your medical or social campaign to millions.', blockType:'text' },
        { blockKey:'step3_num',   blockValue:'03',                        blockType:'text' },
        { blockKey:'step3_icon',  blockValue:'💸',                       blockType:'text' },
        { blockKey:'step3_title', blockValue:'Receive Donations Securely', blockType:'text' },
        { blockKey:'step3_desc',  blockValue:'Donors contribute via UPI, cards, or net banking. Funds are transferred directly and quickly to your account.', blockType:'text' },
        { blockKey:'step4_num',   blockValue:'04',                        blockType:'text' },
        { blockKey:'step4_icon',  blockValue:'🎉',                       blockType:'text' },
        { blockKey:'step4_title', blockValue:'Make a Lasting Impact',     blockType:'text' },
        { blockKey:'step4_desc',  blockValue:'Use the funds for your cause, update your donors with progress reports, and inspire more giving.', blockType:'text' },
      ],
    },
    {
      sectionKey:'categories', heading:'Crowdfunding Categories',
      subheading:'From medical fundraising to disaster relief — find campaigns that match your values.',
      tag:'Browse by Cause', sortOrder:4, blocks:[],
    },
    {
      sectionKey:'testimonials', heading:'What Our Donors & Campaigners Say',
      subheading:'Rated 4.8/5 by over 48,000 users',
      tag:'Real Stories', sortOrder:5,
      blocks:[
        { blockKey:'rating_value', blockValue:'4.8',    blockType:'number' },
        { blockKey:'rating_count', blockValue:'48,000', blockType:'text'   },
      ],
    },
    {
      sectionKey:'faq', heading:'Frequently Asked Questions',
      subheading:'Everything you need to know about starting or donating to a crowdfunding campaign on ImpactGuru.',
      tag:'Got Questions?', sortOrder:6, blocks:[],
    },
    {
      sectionKey:'cta', heading:'Start Your Free Crowdfunding Campaign Today',
      subheading:'Join 5 lakh+ fundraisers who trust ImpactGuru. Zero platform fee for medical campaigns. Funds in your account within days.',
      tag:null, sortOrder:7,
      blocks:[
        { blockKey:'benefit1',             blockValue:'✅ 100% Secure Payments',     blockType:'text' },
        { blockKey:'benefit2',             blockValue:'✅ Zero Platform Fee',         blockType:'text' },
        { blockKey:'benefit3',             blockValue:'✅ 24/7 Fundraising Support',  blockType:'text' },
        { blockKey:'cta_primary_label',    blockValue:"Start Your Campaign - It's Free →", blockType:'text' },
        { blockKey:'cta_secondary_label',  blockValue:'Explore Campaigns',           blockType:'text' },
      ],
    },
  ]

  for (const { blocks, ...sData } of sections) {
    const sec = await prisma.section.upsert({
      where:  { pageId_sectionKey: { pageId: homePage.id, sectionKey: sData.sectionKey } },
      update: {},
      create: { pageId: homePage.id, ...sData },
    })
    for (let i = 0; i < blocks.length; i++) {
      await prisma.contentBlock.upsert({
        where:  { sectionId_blockKey: { sectionId: sec.id, blockKey: blocks[i].blockKey } },
        update: {},
        create: { sectionId: sec.id, sortOrder: i, ...blocks[i] },
      })
    }
  }
  console.log('✔  Sections + ContentBlocks')

  // ─────────────────────────────────────────────
  // NAVIGATION
  // ─────────────────────────────────────────────
  await prisma.navigation.createMany({
    skipDuplicates: true,
    data: [
      { location:'header', label:'Campaigns',       href:'#campaigns',    ariaLabel:'View fundraising campaigns',       sortOrder:1 },
      { location:'header', label:'Categories',      href:'#categories',   ariaLabel:'Browse campaign categories',       sortOrder:2 },
      { location:'header', label:'How It Works',    href:'#how',          ariaLabel:'Learn how crowdfunding works',     sortOrder:3 },
      { location:'header', label:'Stories',         href:'#testimonials', ariaLabel:'Read donor success stories',       sortOrder:4 },
      { location:'header', label:'FAQ',             href:'#faq',          ariaLabel:'Frequently asked questions',       sortOrder:5 },
      { location:'header', label:'Explore',         href:'#campaigns',    ariaLabel:'Browse fundraising campaigns',     sortOrder:6 },
      { location:'header', label:'Start a Campaign',href:'#start',        ariaLabel:'Start your free campaign',         sortOrder:7 },
    ],
  })
  console.log('✔  Navigation')

  // ─────────────────────────────────────────────
  // FOOTER
  // ─────────────────────────────────────────────
  const footerColsData = [
    { heading:'Fundraise For', sortOrder:1, links:[
      { label:'Medical Treatment Fundraising', href:'/campaigns/medical'   },
      { label:'Cancer Care Crowdfunding',      href:'/campaigns/medical'   },
      { label:'Child Education Fundraising',   href:'/campaigns/education' },
      { label:'NGO Campaign Fundraising',      href:'/campaigns/ngo'       },
      { label:'Disaster Relief Fund',          href:'/campaigns/disaster'  },
    ]},
    { heading:'Company', sortOrder:2, links:[
      { label:'About ImpactGuru',       href:'/about'        },
      { label:'How Crowdfunding Works', href:'/how-it-works' },
      { label:'Platform Pricing',       href:'/pricing'      },
      { label:'Success Stories',        href:'/stories'      },
      { label:'Fundraising Blog',       href:'/blog'         },
    ]},
    { heading:'Support', sortOrder:3, links:[
      { label:'Help Centre',      href:'/help'    },
      { label:'Contact Us',       href:'/contact' },
      { label:'Privacy Policy',   href:'/privacy' },
      { label:'Terms of Service', href:'/terms'   },
      { label:'Refund Policy',    href:'/refund'  },
    ]},
  ]

  for (const { links, ...colData } of footerColsData) {
    const col = await prisma.footerColumn.create({ data: colData })
    await prisma.footerLink.createMany({
      data: links.map((l, i) => ({ footerColumnId: col.id, sortOrder: i + 1, ...l })),
    })
  }

  await prisma.footerSocial.createMany({
    skipDuplicates: true,
    data: [
      { label:'Follow ImpactGuru on Facebook',  glyph:'f',  platform:'facebook',  href:'https://facebook.com/ImpactGuru',        sortOrder:1 },
      { label:'Follow ImpactGuru on Twitter/X', glyph:'𝕏', platform:'twitter',   href:'https://twitter.com/ImpactGuru',         sortOrder:2 },
      { label:'Follow ImpactGuru on Instagram', glyph:'▲', platform:'instagram', href:'https://instagram.com/impactguru',        sortOrder:3 },
      { label:'ImpactGuru on LinkedIn',         glyph:'in', platform:'linkedin', href:'https://linkedin.com/company/impactguru', sortOrder:4 },
    ],
  })

  await prisma.footerMeta.createMany({
    skipDuplicates: true,
    data: [
      { metaKey:'company_name',       metaValue:'ImpactGuru' },
      { metaKey:'tagline',            metaValue:"India's most trusted crowdfunding platform since 2014. Empowering millions through the power of giving." },
      { metaKey:'address_street',     metaValue:'1601, One BKC, Bandra Kurla Complex' },
      { metaKey:'address_city',       metaValue:'Mumbai' },
      { metaKey:'address_state',      metaValue:'Maharashtra' },
      { metaKey:'address_pin',        metaValue:'400051' },
      { metaKey:'address_country',    metaValue:'India' },
      { metaKey:'copyright_text',     metaValue:'ImpactGuru. All rights reserved.' },
      { metaKey:'disclaimer',         metaValue:'PayPal integration uses sandbox mode — demo only, no real transactions processed.' },
      { metaKey:'legal_link1_label',  metaValue:'Privacy Policy'  },
      { metaKey:'legal_link1_href',   metaValue:'#'               },
      { metaKey:'legal_link2_label',  metaValue:'Terms of Service'},
      { metaKey:'legal_link2_href',   metaValue:'#'               },
      { metaKey:'legal_link3_label',  metaValue:'Sitemap'         },
      { metaKey:'legal_link3_href',   metaValue:'#'               },
    ],
  })
  console.log('✔  Footer (columns, links, socials, meta)')

  // ─────────────────────────────────────────────
  // CAMPAIGNS (17 records - triggers pagination)
  // ─────────────────────────────────────────────
  await prisma.campaign.createMany({
    skipDuplicates: true,
    data: [
      { title:'Help Rohan Beat Leukemia',              slug:'help-rohan-beat-leukemia',        description:'6-year-old Rohan needs urgent bone marrow transplant. His family has exhausted all savings fighting cancer for 2 years.',                          category:'medical',     label:'Medical',        raised:1450000n, goal:2000000n, donors:1240, daysLeft:8,  isUrgent:true,  emoji:'👦',  bgGradient:'linear-gradient(135deg,#FF6B6B,#FF8E53)', sortOrder:1  },
      { title:'School Books for 200 Tribal Children',  slug:'school-books-tribal-children',    description:'Children in remote Odisha villages walk miles to school yet lack basic textbooks. Help us change that this year.',                                 category:'education',   label:'Education',      raised:340000n,  goal:400000n,  donors:863,  daysLeft:22, isUrgent:false, emoji:'📚',  bgGradient:'linear-gradient(135deg,#4facfe,#00c6ff)', sortOrder:2  },
      { title:'Assam Flood Victims - Emergency Aid',   slug:'assam-flood-victims-emergency',   description:'Over 50,000 families displaced by catastrophic flooding. Provide food kits, clean water, and shelter immediately.',                               category:'disaster',    label:'Disaster Relief',raised:2800000n, goal:5000000n, donors:8921, daysLeft:5,  isUrgent:true,  emoji:'🌊',  bgGradient:'linear-gradient(135deg,#667eea,#764ba2)', sortOrder:3  },
      { title:'Rescue & Rehab 100 Street Dogs',        slug:'rescue-rehab-street-dogs',        description:"Mumbai's Paws & Love Foundation rescues injured strays. Funds go to surgery, vaccination, and shelter care.",                                      category:'animals',     label:'Animal Welfare', raised:210000n,  goal:350000n,  donors:540,  daysLeft:30, isUrgent:false, emoji:'🐕',  bgGradient:'linear-gradient(135deg,#f7971e,#ffd200)', sortOrder:4  },
      { title:'Heart Surgery for Baby Mira',           slug:'heart-surgery-baby-mira',         description:'4-month-old Mira has a congenital heart defect. Her parents, daily wage workers, cannot afford the surgery.',                                     category:'medical',     label:'Medical',        raised:320000n,  goal:500000n,  donors:412,  daysLeft:6,  isUrgent:true,  emoji:'💗',  bgGradient:'linear-gradient(135deg,#f857a6,#ff5858)', sortOrder:5  },
      { title:'Digital Skills for Rural Women',        slug:'digital-skills-rural-women',      description:'Empowering 300 women in Rajasthan with computer literacy and digital business skills for financial independence.',                                  category:'education',   label:'Education',      raised:185000n,  goal:300000n,  donors:329,  daysLeft:45, isUrgent:false, emoji:'👩‍💻',bgGradient:'linear-gradient(135deg,#0072ff,#00c6ff)', sortOrder:6  },
      { title:'Plant 10,000 Trees in Bengaluru',       slug:'plant-trees-bengaluru',           description:'Urban Bengaluru has lost 78% of tree cover. Join a massive community reforestation drive across the city.',                                        category:'environment', label:'Environment',    raised:140000n,  goal:200000n,  donors:711,  daysLeft:60, isUrgent:false, emoji:'🌿',  bgGradient:'linear-gradient(135deg,#56ab2f,#a8e063)', sortOrder:7  },
      { title:'Dialysis Support for 50 Patients',      slug:'dialysis-support-patients',       description:'Chronic kidney disease patients cannot afford ₹1,500 per session. Your support keeps them alive.',                                                 category:'medical',     label:'Medical',        raised:620000n,  goal:900000n,  donors:1876, daysLeft:12, isUrgent:true,  emoji:'🏥',  bgGradient:'linear-gradient(135deg,#1d976c,#93f9b9)', sortOrder:8  },
      { title:'Rebuild Village School After Cyclone',  slug:'rebuild-village-school-cyclone',  description:'Cyclone Remal destroyed the only school in Patuakhali. 400 children need a new school building urgently.',                                         category:'disaster',    label:'Disaster Relief',raised:780000n,  goal:1500000n, donors:2103, daysLeft:20, isUrgent:true,  emoji:'🏫',  bgGradient:'linear-gradient(135deg,#a18cd1,#fbc2eb)', sortOrder:9  },
      { title:'Feed 500 Street Animals This Winter',   slug:'feed-street-animals-winter',      description:"Bitter cold kills hundreds of stray animals every winter. Help us provide food and warmth across Delhi's streets.",                                 category:'animals',     label:'Animal Welfare', raised:95000n,   goal:180000n,  donors:287,  daysLeft:14, isUrgent:false, emoji:'🐾',  bgGradient:'linear-gradient(135deg,#fda085,#f6d365)', sortOrder:10 },
      { title:'Liver Transplant for Ravi Kumar',       slug:'liver-transplant-ravi-kumar',     description:'34-year-old Ravi, a schoolteacher, needs an emergency liver transplant. He has two young daughters depending on him.',                             category:'medical',     label:'Medical',        raised:2100000n, goal:3500000n, donors:4521, daysLeft:9,  isUrgent:true,  emoji:'🧑‍⚕️',bgGradient:'linear-gradient(135deg,#f093fb,#f5576c)', sortOrder:11 },
      { title:'Solar Power for 50 Rural Homes',        slug:'solar-power-rural-homes',         description:'50 households in Jharkhand have no electricity. Solar panels will transform their lives and reduce carbon emissions.',                              category:'environment', label:'Environment',    raised:440000n,  goal:750000n,  donors:912,  daysLeft:35, isUrgent:false, emoji:'☀️',  bgGradient:'linear-gradient(135deg,#fddb92,#d1fdff)', sortOrder:12 },
      { title:'Scholarships for 50 Dalit Girls',       slug:'scholarships-dalit-girls',        description:'Break the cycle of poverty. Fund annual scholarships for 50 Dalit girls from Uttar Pradesh to pursue STEM education.',                             category:'education',   label:'Education',      raised:310000n,  goal:600000n,  donors:678,  daysLeft:28, isUrgent:false, emoji:'👩‍🎓',bgGradient:'linear-gradient(135deg,#a1c4fd,#c2e9fb)', sortOrder:13 },
      { title:'Prosthetic Limbs for 10 War Veterans',  slug:'prosthetic-limbs-veterans',       description:'Brave ex-servicemen who lost limbs in the line of duty deserve to walk again. Help fund life-changing prosthetics.',                               category:'medical',     label:'Medical',        raised:870000n,  goal:1200000n, donors:3201, daysLeft:18, isUrgent:false, emoji:'🦿',  bgGradient:'linear-gradient(135deg,#30cfd0,#330867)', sortOrder:14 },
      { title:'Clean Drinking Water for Melghat Tribe',slug:'clean-water-melghat-tribe',       description:'The Korku tribe in Melghat walks 6 km for water. Install 5 tube wells and save hundreds of lives this monsoon.',                                  category:'disaster',    label:'Disaster Relief',raised:530000n,  goal:800000n,  donors:1122, daysLeft:25, isUrgent:false, emoji:'💧',  bgGradient:'linear-gradient(135deg,#4facfe,#0072ff)', sortOrder:15 },
      { title:'Save the Olive Ridley Sea Turtles',     slug:'save-olive-ridley-turtles',       description:"Poachers threaten India's Olive Ridley nesting grounds on the Odisha coast. Fund rangers and conservation efforts.",                               category:'environment', label:'Environment',    raised:220000n,  goal:400000n,  donors:541,  daysLeft:50, isUrgent:false, emoji:'🐢',  bgGradient:'linear-gradient(135deg,#0ba360,#3cba92)', sortOrder:16 },
      { title:'Spinal Surgery for Priya Mehta',        slug:'spinal-surgery-priya-mehta',      description:'28-year-old Priya is paralysed from the waist down after an accident. Spinal surgery could give her life back.',                                  category:'medical',     label:'Medical',        raised:1800000n, goal:2500000n, donors:3890, daysLeft:11, isUrgent:true,  emoji:'🦽',  bgGradient:'linear-gradient(135deg,#f77062,#fe5196)', sortOrder:17 },
    ],
  })
  console.log('✔  Campaigns (17 records - pagination kicks in at page 2)')

  // ─────────────────────────────────────────────
  // CATEGORIES
  // ─────────────────────────────────────────────
  await prisma.category.createMany({
    skipDuplicates: true,
    data: [
      { slug:'medical',     label:'Medical',        emoji:'🏥', count:'2,34,000+', bgClass:'bg-orange-50',  borderClass:'border-orange-200',  sortOrder:1 },
      { slug:'education',   label:'Education',       emoji:'📚', count:'89,000+',  bgClass:'bg-green-50',   borderClass:'border-green-200',   sortOrder:2 },
      { slug:'disaster',    label:'Disaster Relief', emoji:'🌊', count:'12,000+',  bgClass:'bg-blue-50',    borderClass:'border-blue-200',    sortOrder:3 },
      { slug:'animals',     label:'Animal Welfare',  emoji:'🐾', count:'34,000+',  bgClass:'bg-yellow-50',  borderClass:'border-yellow-200',  sortOrder:4 },
      { slug:'women',       label:'Women & Girls',   emoji:'👩', count:'56,000+',  bgClass:'bg-pink-50',    borderClass:'border-pink-200',    sortOrder:5 },
      { slug:'environment', label:'Environment',     emoji:'🌿', count:'18,000+',  bgClass:'bg-emerald-50', borderClass:'border-emerald-200', sortOrder:6 },
    ],
  })
  console.log('✔  Categories')

  // ─────────────────────────────────────────────
  // TESTIMONIALS
  // ─────────────────────────────────────────────
  await prisma.testimonial.createMany({
    skipDuplicates: true,
    data: [
      { quote:"ImpactGuru helped us raise ₹18 lakh for my son's kidney transplant in just 3 weeks. The support from strangers across India gave us hope we never thought was possible.", name:'Priya Sharma',  location:'Mumbai, Maharashtra',  initials:'PS', colorClass:'bg-orange-500', rating:5, sortOrder:1 },
      { quote:"I started a campaign for my village school's library. Over 400 donors from across India contributed. The kids now have books they've never dreamed of owning.",          name:'Ramesh Nair',  location:'Kozhikode, Kerala',    initials:'RN', colorClass:'bg-teal-600',   rating:5, sortOrder:2 },
      { quote:"After the floods in Assam, ImpactGuru's disaster relief campaign reached us within days. The platform truly connects hearts across the country instantly.",              name:'Anjali Das',   location:'Guwahati, Assam',      initials:'AD', colorClass:'bg-indigo-600', rating:5, sortOrder:3 },
      { quote:"As a regular donor, I love how transparent ImpactGuru is. I can see exactly where my money goes and receive real updates. I've supported 12 campaigns this year!",       name:'Vikram Patel', location:'Ahmedabad, Gujarat',   initials:'VP', colorClass:'bg-purple-600', rating:5, sortOrder:4 },
    ],
  })
  console.log('✔  Testimonials')

  // ─────────────────────────────────────────────
  // FAQs
  // ─────────────────────────────────────────────
  await prisma.faq.createMany({
    skipDuplicates: true,
    data: [
      { question:'How do I start a fundraiser on ImpactGuru?',           answer:'Starting a fundraiser is free and takes under 10 minutes. Fill in your story, upload a photo, set your goal amount, and launch. Our team reviews quickly and helps promote them to millions.', sortOrder:1 },
      { question:'Is there a platform fee for medical crowdfunding?',     answer:'ImpactGuru charges zero platform fee for medical campaigns. A small payment processing fee (2-3%) applies, but you keep the vast majority of every donation.', sortOrder:2 },
      { question:'How quickly will I receive the donated funds?',         answer:'Funds are transferred to your verified bank account within 5-7 working days. For urgent medical cases, we offer expedited transfers on a case-by-case basis.', sortOrder:3 },
      { question:'Is donating on ImpactGuru safe and secure?',           answer:'Yes. We use 256-bit SSL encryption and partner with RBI-compliant payment gateways. Donors can pay via UPI, credit/debit cards, net banking, or PayPal. Every transaction is fully secure.', sortOrder:4 },
      { question:"Can I fundraise for someone else's medical treatment?", answer:'Absolutely. You can start a campaign on behalf of a family member, friend, or anyone in need. Simply provide accurate information about the beneficiary and the medical condition.', sortOrder:5 },
      { question:'What types of causes can I raise funds for?',           answer:'You can raise funds for medical treatment (cancer, transplants, surgeries), education, disaster relief, animal welfare, women empowerment, environmental causes, and registered NGO projects.', sortOrder:6 },
    ],
  })
  console.log('✔  FAQs')

  console.log('\n✅  Database seeded successfully!\n')
  console.log('   📊  17 campaigns (2 pages at limit=10)')
  console.log('   🗂️   7 sections with content blocks')
  console.log('   🧭  7 navigation links')
  console.log('   👣  3 footer columns + socials + meta')
  console.log('   ⭐  4 testimonials')
  console.log('   ❓  6 FAQs')
  console.log('   ⚙️  13 settings\n')
}

main()
  .catch((e) => { console.error('❌  Seed failed:', e); process.exit(1) })
  .finally(() => prisma.$disconnect())
