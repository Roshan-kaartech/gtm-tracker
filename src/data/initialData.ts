import { DeliverableItem } from '../types/gtm';

export const INITIAL_WORKSTREAMS = [
  'Branding & Marketing',
  'GTM Solution',
  'Sales Playbook',
  'Sales Enablement',
  'Webinar'
];

export const INITIAL_OWNERS = [
  'Sai',
  'Shrilaxmi N M',
  'Sabareesh',
  'Vignesh Barani',
  'Pradeep',
  'Roshan',
  'Diwakar',
  'Krithik'
];

export const OWNER_AVATARS: Record<string, { bg: string; text: string; initial: string; role: string }> = {
  'Sai': { 
    bg: 'bg-white/10 text-white border-white/20 shadow-inner', 
    text: 'text-white', 
    initial: 'S', 
    role: 'GTM Strategy & Solution Lead' 
  },
  'Shrilaxmi N M': { 
    bg: 'bg-white/10 text-white border-white/20 shadow-inner', 
    text: 'text-white', 
    initial: 'SL', 
    role: 'Analyst & Public Relations' 
  },
  'Sabareesh': { 
    bg: 'bg-white/10 text-white border-white/20 shadow-inner', 
    text: 'text-white', 
    initial: 'SB', 
    role: 'Campaigns & Global Events' 
  },
  'Vignesh Barani': { 
    bg: 'bg-white/10 text-white border-white/20 shadow-inner', 
    text: 'text-white', 
    initial: 'VB', 
    role: 'AI Consulting Lead' 
  },
  'Pradeep': { 
    bg: 'bg-white/10 text-white border-white/20 shadow-inner', 
    text: 'text-white', 
    initial: 'P', 
    role: 'AI Delivery & Operations' 
  },
  'Roshan': { 
    bg: 'bg-white/10 text-white border-white/20 shadow-inner', 
    text: 'text-white', 
    initial: 'R', 
    role: 'Product Offerings Lead' 
  },
  'Diwakar': { 
    bg: 'bg-white/10 text-white border-white/20 shadow-inner', 
    text: 'text-white', 
    initial: 'D', 
    role: 'POC Architecture Lead' 
  },
  'Krithik': { 
    bg: 'bg-white/10 text-white border-white/20 shadow-inner', 
    text: 'text-white', 
    initial: 'K', 
    role: 'Global Enablement Manager' 
  },
};

export const WORKSTREAM_COLORS: Record<string, { badge: string; border: string; bar: string; text: string; dot: string }> = {
  'Branding & Marketing': {
    badge: 'bg-white/[0.06] text-white border-white/[0.12]',
    border: 'border-white/[0.12]',
    bar: 'bg-gradient-to-r from-blue-500 to-indigo-500',
    text: 'text-[#f5f5f7]',
    dot: 'bg-blue-400'
  },
  'GTM Solution': {
    badge: 'bg-white/[0.06] text-white border-white/[0.12]',
    border: 'border-white/[0.12]',
    bar: 'bg-gradient-to-r from-purple-500 to-blue-500',
    text: 'text-[#f5f5f7]',
    dot: 'bg-purple-400'
  },
  'Sales Playbook': {
    badge: 'bg-white/[0.06] text-white border-white/[0.12]',
    border: 'border-white/[0.12]',
    bar: 'bg-gradient-to-r from-emerald-500 to-teal-400',
    text: 'text-[#f5f5f7]',
    dot: 'bg-emerald-400'
  },
  'Sales Enablement': {
    badge: 'bg-white/[0.06] text-white border-white/[0.12]',
    border: 'border-white/[0.12]',
    bar: 'bg-gradient-to-r from-amber-500 to-orange-400',
    text: 'text-[#f5f5f7]',
    dot: 'bg-amber-400'
  },
  'Webinar': {
    badge: 'bg-white/[0.06] text-white border-white/[0.12]',
    border: 'border-white/[0.12]',
    bar: 'bg-gradient-to-r from-violet-500 to-pink-500',
    text: 'text-[#f5f5f7]',
    dot: 'bg-pink-400'
  }
};

export const INITIAL_GTM_DATA: DeliverableItem[] = [
  // --- Branding & Marketing ---
  {
    id: 'bm-1',
    stream: 'Branding & Marketing',
    title: 'LinkedIn',
    startDate: '20-Aug',
    endDate: '30-Sep',
    milestone1: {
      id: 'bm-1-m1',
      name: 'Content plan finalization',
      targetDate: '27-Aug',
      status: 'in-progress',
      notes: 'Social content calendar draft and executive posts'
    },
    milestone2: {
      id: 'bm-1-m2',
      name: 'Engagement & optimization',
      targetDate: '04-Sep',
      status: 'upcoming',
      notes: 'Paid booster campaign and organic engagement tracking'
    },
    milestone3: {
      id: 'bm-1-m3',
      name: 'Campaign review & analytics',
      targetDate: '30-Sep',
      status: 'upcoming',
      notes: 'Final impressions, leads, and conversion metrics'
    },
    owner: 'Sai',
    priority: 'high',
    progress: 0,
    tags: ['Social', 'Brand', 'Awareness'],
    notes: 'Primary social channel to establish AI leadership.'
  },
  {
    id: 'bm-2',
    stream: 'Branding & Marketing',
    title: 'Website',
    startDate: '20-Aug',
    endDate: '30-Sep',
    milestone1: {
      id: 'bm-2-m1',
      name: 'Landing page copy & wireframes',
      targetDate: '28-Aug',
      status: 'in-progress',
      notes: 'Structure for GTM AI Solution hub'
    },
    milestone2: {
      id: 'bm-2-m2',
      name: 'Design staging & assets ready',
      targetDate: '10-Sep',
      status: 'upcoming',
      notes: 'Visual banners, CTAs, and gated asset forms'
    },
    milestone3: {
      id: 'bm-2-m3',
      name: 'Go-live & SEO analytics',
      targetDate: '30-Sep',
      status: 'upcoming',
      notes: 'Domain launch and UTM tracking verification'
    },
    owner: 'Sai',
    priority: 'high',
    progress: 0,
    tags: ['Web', 'Digital', 'Lead Gen'],
    notes: 'Core conversion destination for whitepapers and webinars.'
  },
  {
    id: 'bm-3',
    stream: 'Branding & Marketing',
    title: 'AR (Analyst Relations)',
    startDate: '19-Aug',
    endDate: '30-Sep',
    milestone1: {
      id: 'bm-3-m1',
      name: 'Finalise the Analyst Firm for the white Paper',
      targetDate: '26-Aug',
      status: 'in-progress',
      notes: 'Evaluating Gartner/Forrester and boutique AI research firms'
    },
    milestone2: {
      id: 'bm-3-m2',
      name: '1st Draft',
      targetDate: '15-Sep',
      status: 'upcoming',
      notes: 'Collaborative draft with chosen analyst firm'
    },
    milestone3: {
      id: 'bm-3-m3',
      name: '2nd Draft',
      targetDate: '30-Sep',
      status: 'upcoming',
      notes: 'Executive review & analyst validation report'
    },
    owner: 'Shrilaxmi N M',
    priority: 'high',
    progress: 0,
    tags: ['AR', 'Research', 'Credibility'],
    notes: 'Third-party validation for enterprise AI credibility.'
  },
  {
    id: 'bm-4',
    stream: 'Branding & Marketing',
    title: 'PR (Public Relations)',
    startDate: '14-Aug',
    endDate: '30-Sep',
    milestone1: {
      id: 'bm-4-m1',
      name: 'Finalise the AI PR plan',
      targetDate: '26-Aug',
      status: 'in-progress',
      notes: 'Press release kit and media outlet targeting'
    },
    milestone2: {
      id: 'bm-4-m2',
      name: 'N/A',
      targetDate: 'N/A',
      status: 'not-applicable',
      notes: 'Not applicable for this track'
    },
    milestone3: {
      id: 'bm-4-m3',
      name: 'Publish',
      targetDate: '30-Sep',
      status: 'upcoming',
      notes: 'Global wire distribution & interview opportunities'
    },
    owner: 'Shrilaxmi N M',
    priority: 'medium',
    progress: 0,
    tags: ['PR', 'Media', 'Outreach'],
    notes: 'Targeting tier-1 tech publications and AI newsletters.'
  },
  {
    id: 'bm-5',
    stream: 'Branding & Marketing',
    title: 'Email',
    startDate: '27-Jul',
    endDate: '30-Sep',
    milestone1: {
      id: 'bm-5-m1',
      name: 'Tool finilaization',
      targetDate: '15-Aug',
      status: 'completed', // Green cell
      notes: 'Outreach & marketing automation tool stack finalized'
    },
    milestone2: {
      id: 'bm-5-m2',
      name: 'Target list + sequences built',
      targetDate: '15-Sep',
      status: 'in-progress',
      notes: 'Segmented enterprise ICP list and cold email nurture copy'
    },
    milestone3: {
      id: 'bm-5-m3',
      name: 'First campaign live, replies tracked',
      targetDate: '30-Sep',
      status: 'upcoming',
      notes: 'Campaign blast, SDR cadence, reply triage'
    },
    owner: 'Sabareesh',
    priority: 'high',
    progress: 33, // 1 of 3 completed
    tags: ['Email', 'Outbound', 'SDR'],
    notes: 'Outbound pipeline generation engine.'
  },
  {
    id: 'bm-6',
    stream: 'Branding & Marketing',
    title: 'Events/Roadshows',
    startDate: '27-Jul',
    endDate: '30-Sep',
    milestone1: {
      id: 'bm-6-m1',
      name: 'Event finilization',
      targetDate: '27-Aug',
      status: 'in-progress',
      notes: 'Locations, venue booking & partner sponsorship'
    },
    milestone2: {
      id: 'bm-6-m2',
      name: 'Promotional asset prep',
      targetDate: '27-Aug',
      status: 'upcoming',
      notes: 'Booth displays, demo kiosks, handouts'
    },
    milestone3: {
      id: 'bm-6-m3',
      name: 'Event report delivery',
      targetDate: '15-Sep',
      status: 'upcoming',
      notes: 'Event lead capture summary and follow-up plan'
    },
    owner: 'Sabareesh',
    priority: 'medium',
    progress: 0,
    tags: ['Events', 'Field Marketing', 'Networking'],
    notes: 'In-person executive roadshows in key tier-1 hubs.'
  },

  // --- GTM Solution ---
  {
    id: 'gtm-1',
    stream: 'GTM Solution',
    title: 'White paper - Institutional Sovereignty',
    startDate: '27-Jul',
    endDate: '30-Sep',
    milestone1: {
      id: 'gtm-1-m1',
      name: 'Thesis & Outline approved',
      targetDate: '15-Aug',
      status: 'completed', // Green cell
      notes: 'Enterprise sovereignty blueprint and data privacy positioning approved'
    },
    milestone2: {
      id: 'gtm-1-m2',
      name: 'First Complete Draft & Expert Review',
      targetDate: '07-Sep',
      status: 'in-progress',
      notes: 'Deep technical draft with case studies'
    },
    milestone3: {
      id: 'gtm-1-m3',
      name: 'Final Design, Layout & Global Release',
      targetDate: '30-Sep',
      status: 'upcoming',
      notes: 'PDF publication, ungated preview, and gated full download'
    },
    owner: 'Sai',
    priority: 'high',
    progress: 33, // 1 of 3 completed
    tags: ['Whitepaper', 'Thought Leadership', 'AI Governance'],
    notes: 'Flagship thought leadership piece for enterprise decision makers.'
  },
  {
    id: 'gtm-2',
    stream: 'GTM Solution',
    title: 'White Paper - Agentic Enterprise OS for Efficient AI',
    startDate: '27-Jul',
    endDate: '30-Sep',
    milestone1: {
      id: 'gtm-2-m1',
      name: 'Architecture Framework & Research approved',
      targetDate: '15-Aug',
      status: 'completed', // Green cell
      notes: 'Technical framework and ROI equations approved'
    },
    milestone2: {
      id: 'gtm-2-m2',
      name: 'Draft complete & Technical review',
      targetDate: '07-Sep',
      status: 'in-progress',
      notes: 'Benchmarking and architecture diagrams complete'
    },
    milestone3: {
      id: 'gtm-2-m3',
      name: 'Executive publication & distribution',
      targetDate: '30-Sep',
      status: 'upcoming',
      notes: 'Release via analyst channels and direct enterprise briefing'
    },
    owner: 'Sai',
    priority: 'high',
    progress: 33, // 1 of 3 completed
    tags: ['Whitepaper', 'Agentic AI', 'Architecture'],
    notes: 'Detailed engineering & business architecture for agentic systems.'
  },

  // --- Sales Playbook ---
  {
    id: 'sp-1',
    stream: 'Sales Playbook',
    title: 'Assets for AI Consulting services',
    startDate: '27-Jul',
    endDate: '15-Sep',
    milestone1: {
      id: 'sp-1-m1',
      name: 'Consulting pitch decks & frameworks draft',
      targetDate: '07-Sep',
      status: 'in-progress',
      notes: 'Advisory packages, discovery questionnaires, workshop decks'
    },
    milestone2: {
      id: 'sp-1-m2',
      name: 'Final collateral package ready for sales',
      targetDate: '15-Sep',
      status: 'upcoming',
      notes: 'Customer-ready presentations and pricing calculators'
    },
    milestone3: {
      id: 'sp-1-m3',
      name: 'N/A',
      targetDate: 'N/A',
      status: 'not-applicable',
      notes: ''
    },
    owner: 'Vignesh Barani',
    priority: 'high',
    progress: 0,
    tags: ['Playbook', 'Consulting', 'Sales Kit'],
    notes: 'Enable sales team to pitch high-margin AI advisory.'
  },
  {
    id: 'sp-2',
    stream: 'Sales Playbook',
    title: 'Assets for AI Delivery & Ops services',
    startDate: '27-Jul',
    endDate: '15-Sep',
    milestone1: {
      id: 'sp-2-m1',
      name: 'Service catalog, SLA & delivery methodology docs',
      targetDate: '07-Sep',
      status: 'in-progress',
      notes: 'Managed AI operations and deployment runbooks'
    },
    milestone2: {
      id: 'sp-2-m2',
      name: 'Ops enablement kit & customer onboarding guides',
      targetDate: '15-Sep',
      status: 'upcoming',
      notes: 'Implementation timeline templates and RACI matrices'
    },
    milestone3: {
      id: 'sp-2-m3',
      name: 'N/A',
      targetDate: 'N/A',
      status: 'not-applicable',
      notes: ''
    },
    owner: 'Pradeep',
    priority: 'medium',
    progress: 0,
    tags: ['Playbook', 'Delivery', 'Ops'],
    notes: 'Collateral for enterprise operations and sustained support.'
  },
  {
    id: 'sp-3',
    stream: 'Sales Playbook',
    title: 'AI Services Offering Pack',
    startDate: '20-Jul',
    endDate: '07-Sep',
    milestone1: {
      id: 'sp-3-m1',
      name: 'Pricing models, packaging & scoping templates',
      targetDate: '25-Aug',
      status: 'in-progress',
      notes: 'Modular bundle packages for mid-market & enterprise'
    },
    milestone2: {
      id: 'sp-3-m2',
      name: 'Field rollout & sales one-pagers finalized',
      targetDate: '07-Sep',
      status: 'upcoming',
      notes: 'Ready-to-send slick sheets and deal qualification checklist'
    },
    milestone3: {
      id: 'sp-3-m3',
      name: 'N/A',
      targetDate: 'N/A',
      status: 'not-applicable',
      notes: ''
    },
    owner: 'Roshan',
    priority: 'high',
    progress: 0,
    tags: ['Packaging', 'Pricing', 'Services'],
    notes: 'Core services catalog packages across AI implementation.'
  },
  {
    id: 'sp-4',
    stream: 'Sales Playbook',
    title: '4 AI solutions offering pack',
    startDate: '20-Jul',
    endDate: '07-Sep',
    milestone1: {
      id: 'sp-4-m1',
      name: 'Value prop & architecture blueprints across 4 solutions',
      targetDate: '25-Aug',
      status: 'in-progress',
      notes: 'Solution blueprints for Customer AI, Operations AI, Code AI & Data AI'
    },
    milestone2: {
      id: 'sp-4-m2',
      name: 'Demo scripts & battlecards published',
      targetDate: '07-Sep',
      status: 'upcoming',
      notes: 'Competitive battlecards against legacy SaaS and hyperscalers'
    },
    milestone3: {
      id: 'sp-4-m3',
      name: 'N/A',
      targetDate: 'N/A',
      status: 'not-applicable',
      notes: ''
    },
    owner: 'Roshan',
    priority: 'high',
    progress: 0,
    tags: ['Solutions', 'Architecture', 'Battlecards'],
    notes: 'Packaged solutions ready for vertical go-to-market.'
  },
  {
    id: 'sp-5',
    stream: 'Sales Playbook',
    title: "5-POC's",
    startDate: '20-Jul',
    endDate: '07-Sep',
    milestone1: {
      id: 'sp-5-m1',
      name: 'POC definitions, success metrics & sandbox setup',
      targetDate: '25-Aug',
      status: 'in-progress',
      notes: 'Standardized 2-week and 4-week proof of concept frameworks'
    },
    milestone2: {
      id: 'sp-5-m2',
      name: 'POC collateral & client evaluation guides',
      targetDate: '07-Sep',
      status: 'upcoming',
      notes: 'Success criteria scorecard and executive readout template'
    },
    milestone3: {
      id: 'sp-5-m3',
      name: 'N/A',
      targetDate: 'N/A',
      status: 'not-applicable',
      notes: ''
    },
    owner: 'Diwakar',
    priority: 'medium',
    progress: 0,
    tags: ['POC', 'Sales Acceleration', 'Templates'],
    notes: 'Pre-packaged POC prototypes to accelerate deal closure.'
  },

  // --- Sales Enablement ---
  {
    id: 'se-1',
    stream: 'Sales Enablement',
    title: 'Identify SBU Participants',
    startDate: '01-Jul',
    endDate: '04-Sep',
    milestone1: {
      id: 'se-1-m1',
      name: 'List Participants across 4 SBUs',
      targetDate: '04-Sep',
      status: 'in-progress',
      notes: 'Nominated sales reps, solution architects, and practice heads'
    },
    milestone2: {
      id: 'se-1-m2',
      name: 'N/A',
      targetDate: 'N/A',
      status: 'not-applicable',
      notes: ''
    },
    milestone3: {
      id: 'se-1-m3',
      name: 'N/A',
      targetDate: 'N/A',
      status: 'not-applicable',
      notes: ''
    },
    owner: 'Krithik',
    priority: 'high',
    progress: 0,
    tags: ['Enablement', 'SBU', 'Stakeholders'],
    notes: 'Cross-functional participation across Strategic Business Units.'
  },
  {
    id: 'se-2',
    stream: 'Sales Enablement',
    title: 'Finalize AI Services Bootcamp topics & asset',
    startDate: '01-Jul',
    endDate: '18-Sep',
    milestone1: {
      id: 'se-2-m1',
      name: 'Finalize necessary & required assets to be shared',
      targetDate: '18-Sep',
      status: 'upcoming',
      notes: 'Curriculum, hands-on lab exercises, and certification quiz'
    },
    milestone2: {
      id: 'se-2-m2',
      name: 'N/A',
      targetDate: 'N/A',
      status: 'not-applicable',
      notes: ''
    },
    milestone3: {
      id: 'se-2-m3',
      name: 'N/A',
      targetDate: 'N/A',
      status: 'not-applicable',
      notes: ''
    },
    owner: 'Krithik',
    priority: 'medium',
    progress: 0,
    tags: ['Bootcamp', 'Training', 'Curriculum'],
    notes: 'Training content for multi-day AI sales mastery bootcamp.'
  },
  {
    id: 'se-3',
    stream: 'Sales Enablement',
    title: 'Organize calls with the 4 SBUs',
    startDate: '01-Jul',
    endDate: '21-Sep',
    milestone1: {
      id: 'se-3-m1',
      name: 'Schedule 4 meetings to cover the 4 SBUs',
      targetDate: '21-Sep',
      status: 'upcoming',
      notes: 'Individual alignment calls with SBU executive leaders'
    },
    milestone2: {
      id: 'se-3-m2',
      name: 'N/A',
      targetDate: 'N/A',
      status: 'not-applicable',
      notes: ''
    },
    milestone3: {
      id: 'se-3-m3',
      name: 'N/A',
      targetDate: 'N/A',
      status: 'not-applicable',
      notes: ''
    },
    owner: 'Krithik',
    priority: 'medium',
    progress: 0,
    tags: ['Meetings', 'SBU Alignment', 'Leadership'],
    notes: 'Ensuring leadership buy-in and pipeline quota alignment.'
  },
  {
    id: 'se-4',
    stream: 'Sales Enablement',
    title: 'Run bootcamp and share assets',
    startDate: '01-Jul',
    endDate: '30-Sep',
    milestone1: {
      id: 'se-4-m1',
      name: 'Conduct enablement session',
      targetDate: '28-Sep',
      status: 'upcoming',
      notes: 'Live virtual & classroom bootcamp delivery with roleplay'
    },
    milestone2: {
      id: 'se-4-m2',
      name: 'Share assets via email & teams',
      targetDate: '30-Sep',
      status: 'upcoming',
      notes: 'Recording links, slides, and toolkit published to Teams channel'
    },
    milestone3: {
      id: 'se-4-m3',
      name: 'N/A',
      targetDate: 'N/A',
      status: 'not-applicable',
      notes: ''
    },
    owner: 'Krithik',
    priority: 'high',
    progress: 0,
    tags: ['Bootcamp Delivery', 'Certification', 'Asset Distribution'],
    notes: 'Final enablement execution before Q4 quota activation.'
  },

  // --- Webinar ---
  {
    id: 'wb-1',
    stream: 'Webinar',
    title: 'Webinar topic finalization',
    startDate: '27-Jul',
    endDate: '15-Sep',
    milestone1: {
      id: 'wb-1-m1',
      name: 'Topic signoff',
      targetDate: '15-Sep',
      status: 'in-progress',
      notes: 'Executive topic title and abstract approved by leadership'
    },
    milestone2: {
      id: 'wb-1-m2',
      name: 'N/A',
      targetDate: 'N/A',
      status: 'not-applicable',
      notes: ''
    },
    milestone3: {
      id: 'wb-1-m3',
      name: 'N/A',
      targetDate: 'N/A',
      status: 'not-applicable',
      notes: ''
    },
    owner: 'Sabareesh',
    priority: 'high',
    progress: 0,
    tags: ['Webinar', 'Topic', 'Signoff'],
    notes: 'Key themes: Agentic Enterprise OS & Enterprise AI ROI.'
  },
  {
    id: 'wb-2',
    stream: 'Webinar',
    title: 'Webinar speaker finalization',
    startDate: '15-Sep',
    endDate: '30-Sep',
    milestone1: {
      id: 'wb-2-m1',
      name: 'Speaker shortlist drawn up',
      targetDate: '23-Sep',
      status: 'upcoming',
      notes: 'External industry analyst + internal AI leaders'
    },
    milestone2: {
      id: 'wb-2-m2',
      name: 'Speaker availability and slot confirmed',
      targetDate: '30-Sep',
      status: 'upcoming',
      notes: 'Tech check session and presentation rehearsal'
    },
    milestone3: {
      id: 'wb-2-m3',
      name: 'N/A',
      targetDate: 'N/A',
      status: 'not-applicable',
      notes: ''
    },
    owner: 'Sabareesh',
    priority: 'medium',
    progress: 0,
    tags: ['Speakers', 'Keynote', 'Webinar'],
    notes: 'Targeting 1 customer keynote speaker + 1 internal tech fellow.'
  },
  {
    id: 'wb-3',
    stream: 'Webinar',
    title: 'Webinar promotion plan published',
    startDate: '27-Jul',
    endDate: '30-Sep',
    milestone1: {
      id: 'wb-3-m1',
      name: 'Channel mix and target list defined',
      targetDate: '15-Sep',
      status: 'in-progress',
      notes: 'Social ads, email blasts, SDR invites, partner promotion'
    },
    milestone2: {
      id: 'wb-3-m2',
      name: 'Draft plan circulated for review',
      targetDate: '23-Sep',
      status: 'upcoming',
      notes: 'Creative copy, registration landing page, reminder cadence'
    },
    milestone3: {
      id: 'wb-3-m3',
      name: 'Plan approved and published',
      targetDate: '30-Sep',
      status: 'upcoming',
      notes: 'Campaign goes live across all enterprise channels'
    },
    owner: 'Sabareesh',
    priority: 'high',
    progress: 0,
    tags: ['Promotion', 'Campaign', 'Registration'],
    notes: 'Targeting 500+ enterprise registrant sign-ups.'
  }
];
