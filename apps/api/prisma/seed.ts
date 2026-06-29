import { PrismaClient, Role, DonationFrequency, PaymentMethod, DonationStatus, CampaignStatus, ProjectStatus, NewsCategory, PublicationCategory, TeamCategory, JobType, PartnerType } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding SHiFAT database...');

  // Clean existing data in reverse dependency order
  await prisma.mediaFile.deleteMany();
  await prisma.application.deleteMany();
  await prisma.newsItem.deleteMany();
  await prisma.publication.deleteMany();
  await prisma.project.deleteMany();
  await prisma.careerOpportunity.deleteMany();
  await prisma.partner.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.faq.deleteMany();
  await prisma.contactSubmission.deleteMany();
  await prisma.newsletterSubscriber.deleteMany();
  await prisma.donation.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.program.deleteMany();
  await prisma.user.deleteMany();
  console.log('Cleaned existing data');

  // 1. Create default admin and staff users
  const saltRounds = 10;
  const adminPasswordHash = await bcrypt.hash('password123', saltRounds);
  const staffPasswordHash = await bcrypt.hash('staff123', saltRounds);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@shifatcharity.org' },
    update: {},
    create: {
      email: 'admin@shifatcharity.org',
      fullName: 'SHiFAT Administrator',
      passwordHash: adminPasswordHash,
      role: Role.ADMIN,
      phone: '+252 (63) 441-2345',
      isActive: true,
      emailVerified: true,
    },
  });

  const staff = await prisma.user.upsert({
    where: { email: 'staff@shifatcharity.org' },
    update: {},
    create: {
      email: 'staff@shifatcharity.org',
      fullName: 'Dr. Hodan Yusuf',
      passwordHash: staffPasswordHash,
      role: Role.STAFF,
      phone: '+252 (63) 551-6789',
      isActive: true,
      emailVerified: true,
    },
  });

  console.log('Users seeded successfully');

  // 2. Seed Programs
  const maternalChild = await prisma.program.upsert({
    where: { slug: 'maternal-child' },
    update: {},
    create: {
      slug: 'maternal-child',
      title: 'Maternal & Child Health',
      description: 'Providing comprehensive prenatal care, safe delivery kits, neonatal intensive care support, and maternal health education in Hargeisa and rural centers.',
      longDescription: 'Our Maternal & Child Health program is at the core of SHiFAT\'s mission. In the Horn of Africa, maternal mortality rates are among the highest in the world. We establish maternal care wards, equip local clinics with ultrasound scanners, train traditional birth attendants (TBAs) to become community health advocates, and provide sanitary clean-delivery kits to expectant mothers. We also run the Hargeisa Maternity Wing, which provides 24/7 free neonatal and obstetrics support to vulnerable mothers.',
      iconName: 'Baby',
      imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=800',
      impactStat: '45,000+ Safe Deliveries Assisted',
      sortOrder: 1,
    },
  });

  const emergencyRelief = await prisma.program.upsert({
    where: { slug: 'emergency-relief' },
    update: {},
    create: {
      slug: 'emergency-relief',
      title: 'Emergency Relief Operations',
      description: 'Rapid response mobilization during extreme droughts, floods, and healthcare emergencies. Distributing medicine, shelter, and survival packs.',
      longDescription: 'SHiFAT has a dedicated, highly trained emergency team ready to mobilize within 24 hours of climate-related crises or disease outbreaks. When severe droughts strike the pastoral communities of the Horn of Africa, we establish mobile treatment camps, distribute emergency medical supplies, and provide therapeutic rehydration salts. We coordinate closely with national authorities to establish temporary clinics in displaced-persons settlements, ensuring the most vulnerable are never left behind.',
      iconName: 'ShieldAlert',
      imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800',
      impactStat: '120,000+ Beneficiaries in Crisis',
      sortOrder: 2,
    },
  });

  const healthEducation = await prisma.program.upsert({
    where: { slug: 'health-education' },
    update: {},
    create: {
      slug: 'health-education',
      title: 'Health Education & Training',
      description: 'Mobilizing community health workers and running widespread public health campaigns to prevent infectious disease transmission.',
      longDescription: 'We believe sustainable health begins with community knowledge. SHiFAT trains community volunteers in essential hygiene practices, disease transmission vectors, and first aid. Our "Mobilizing Communities for Development" initiative conducts neighborhood workshops, radio health hours, and deploys local advocates who deliver critical health guidance in Somali. We also partner with local universities in Somaliland to provide continuing medical education credits for nursing staff and midwives.',
      iconName: 'GraduationCap',
      imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800',
      impactStat: '1,500+ Local Health Workers Trained',
      sortOrder: 3,
    },
  });

  const wash = await prisma.program.upsert({
    where: { slug: 'wash' },
    update: {},
    create: {
      slug: 'wash',
      title: 'Clean Water & Sanitation (WASH)',
      description: 'Rehabilitating vital water points, constructing solar-powered wells, and installing sanitation infrastructure to eradicate waterborne pathogens.',
      longDescription: 'Access to clean water is synonymous with disease prevention. SHiFAT installs and rehabilitates shallow wells and boreholes, converting them to clean solar-powered pumping systems. In drought-affected areas, we implement dry-season water trucking coupled with water purification tablets. We construct gender-separated sanitary pit latrines in community centers and public schools, dramatically reducing the local incidence of cholera, dysentery, and typhoid.',
      iconName: 'Droplet',
      imageUrl: 'https://images.unsplash.com/photo-1541256996761-85df2efaa164?auto=format&fit=crop&q=80&w=800',
      impactStat: '85+ Solar Wells Constructed',
      sortOrder: 4,
    },
  });

  const vaccination = await prisma.program.upsert({
    where: { slug: 'vaccination' },
    update: {},
    create: {
      slug: 'vaccination',
      title: 'Vaccination & Immunization',
      description: 'Running mobile immunization clinics to vaccinate children against polio, measles, diphtheria, and tuberculosis in remote nomadic tracks.',
      longDescription: 'To eliminate vaccine-preventable diseases, SHiFAT conducts intensive immunization drives in both urban centers and isolated pastoral settlements. Maintaining the "cold chain" in 40°C heat is a significant challenge; we employ solar-refrigerated backpack carriers that allow our healthcare workers to travel on foot or via camel to reach remote nomadic camps. We vaccinate newborns and children under five against life-threatening diseases, ensuring high community herd immunity.',
      iconName: 'Syringe',
      imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800',
      impactStat: '250,000+ Vaccine Doses Administered',
      sortOrder: 5,
    },
  });

  const nutrition = await prisma.program.upsert({
    where: { slug: 'nutrition' },
    update: {},
    create: {
      slug: 'nutrition',
      title: 'Nutrition & Food Security',
      description: 'Operating therapeutic feeding centers for malnourished children and pregnant mothers, while distributing drought-resilient seed stocks.',
      longDescription: 'Malnutrition impairs cognitive development and increases susceptibility to infection. SHiFAT operates community-based nutrition screening sites where we measure Mid-Upper Arm Circumference (MUAC) and distribute Ready-to-Use Therapeutic Foods (RUTF), such as Plumpy\'Nut, to moderately and severely malnourished children. We also support pastoralists and farmers with climate-smart agricultural training and drought-resilient grain seed varieties to build long-term nutrition independence.',
      iconName: 'Beef',
      imageUrl: 'https://images.unsplash.com/photo-1599059813005-11265ba4b4ce?auto=format&fit=crop&q=80&w=800',
      impactStat: '15,000+ Children Rehabilitated',
      sortOrder: 6,
    },
  });

  console.log('Programs seeded successfully');

  // 3. Seed Campaigns
  await prisma.campaign.upsert({
    where: { slug: 'polio-eradication-2026' },
    update: {},
    create: {
      slug: 'polio-eradication-2026',
      title: 'Zero Polio Campaign - Togdheer',
      description: 'Mobile immunization teams operating across rural settlements in Togdheer to vaccinate children against Polio.',
      longDescription: 'The Zero Polio Campaign targets nomadic settlements along the border areas where vaccine access is historically low. This initiative deploys 40 trained community vaccinators on motorbikes and camels, utilizing portable vaccine cold-boxes. Our objective is to immunize 30,000 children under the age of five and deliver vital Vitamin A supplements to boost immune resilience.',
      status: CampaignStatus.Active,
      targetAmount: 50000,
      currentRaised: 42500,
      progressPercentage: 85,
      region: 'Togdheer Region, Somaliland',
      startDate: new Date('2026-05-01'),
      imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=600',
    },
  });

  await prisma.campaign.upsert({
    where: { slug: 'safe-motherhood-hargeisa' },
    update: {},
    create: {
      slug: 'safe-motherhood-hargeisa',
      title: 'Safe Motherhood Ward Renovation',
      description: 'Expanding and upgrading the maternity and neonatal emergency ward in central Hargeisa.',
      longDescription: 'The central maternity unit requires major rehabilitation to handle double the patient capacity. This fundraising campaign will purchase 15 advanced patient monitors, 5 infant incubators, a standby solar generator, and furnish a dedicated recovery room for mothers recovering from high-risk deliveries. Funding directly supports structural upgrades and capital equipment purchase.',
      status: CampaignStatus.Active,
      targetAmount: 120000,
      currentRaised: 78900,
      progressPercentage: 66,
      region: 'Hargeisa HQ, Somaliland',
      startDate: new Date('2026-03-01'),
      imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=600',
    },
  });

  await prisma.campaign.upsert({
    where: { slug: 'clean-water-sanaag' },
    update: {},
    create: {
      slug: 'clean-water-sanaag',
      title: 'Sanaag Borehole Rehabilitation Drive',
      description: 'Restoring damaged boreholes and fitting solar pumping solutions for 12 rural water points in East Sanaag.',
      longDescription: 'Communities in rural Sanaag walk over 15 kilometers to source water during dry spells. SHiFAT is undertaking the major task of flushing, casing, and capping 12 strategic community boreholes. We are replacing obsolete, expensive diesel pumps with green, maintenance-free solar pumping arrays and implementing gravity-fed community tap-stands.',
      status: CampaignStatus.Active,
      targetAmount: 75000,
      currentRaised: 61200,
      progressPercentage: 82,
      region: 'Sanaag Region, Horn of Africa',
      startDate: new Date('2026-04-01'),
      imageUrl: 'https://images.unsplash.com/photo-1541256996761-85df2efaa164?auto=format&fit=crop&q=80&w=600',
    },
  });

  await prisma.campaign.upsert({
    where: { slug: 'cholera-prevention-2025' },
    update: {},
    create: {
      slug: 'cholera-prevention-2025',
      title: 'Awdal Cholera Prevention Blitz',
      description: 'Emergency response to mitigate water contamination and hygiene issues during post-flood seasons.',
      longDescription: 'Following heavy seasonal floods, waterborne risk rises rapidly in low-lying rural villages. SHiFAT deployed 10 sanitarians who successfully chlorinated 220 local water wells, constructed 40 disaster-resilient emergency latrines, distributed 5,000 hygiene and water filtration kits, and held cholera-awareness school programs across Awdal.',
      status: CampaignStatus.Completed,
      targetAmount: 35000,
      currentRaised: 35000,
      progressPercentage: 100,
      region: 'Awdal Region, Somaliland',
      startDate: new Date('2025-11-01'),
      imageUrl: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&q=80&w=600',
    },
  });

  console.log('Campaigns seeded successfully');

  // 4. Seed Projects
  await prisma.project.createMany({
    data: [
      {
        programId: maternalChild.id,
        title: 'Mobile Maternity Clinic - Sheikh Mountains',
        description: 'Deploying custom all-terrain 4x4 vehicles converted into fully equipped antenatal checkup rooms to reach nomadic pastoral families.',
        location: 'Sheikh, Sahil Region',
        status: ProjectStatus.Ongoing,
        imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=600',
        beneficiaries: '8,500+ Nomadic Mothers',
      },
      {
        programId: wash.id,
        title: 'Salahlay Solar Water Network',
        description: 'Constructing an integrated 25,000-liter storage tank connected to 6 solar-powered collection points across a high-density rural hub.',
        location: 'Salahlay, Maroodi Jeeh',
        status: ProjectStatus.Completed,
        imageUrl: 'https://images.unsplash.com/photo-1518398046578-8cca57782e17?auto=format&fit=crop&q=80&w=600',
        beneficiaries: '12,000 Villagers & Pastoralists',
      },
      {
        programId: nutrition.id,
        title: 'Regional Nutrition Assessment & Outpatient Hub',
        description: 'Establishing a screening clinic focusing on children under five suffering from drought-induced severe acute malnutrition.',
        location: 'Burao Outskirts',
        status: ProjectStatus.Ongoing,
        imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=600',
        beneficiaries: '4,200 Children Rehabilitated',
      },
      {
        programId: healthEducation.id,
        title: 'Community First Aid & Midwifery Training Program',
        description: 'A 6-month intensive vocational certification program for 40 local women in rural communities to serve as safe birth assistants.',
        location: 'Erigavo, Sanaag Region',
        status: ProjectStatus.Completed,
        imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=600',
        beneficiaries: '40 Certified Midwives, 10,000+ Community Reach',
      },
      {
        programId: emergencyRelief.id,
        title: 'Emergency Flood Medical Response Camp',
        description: 'Providing immediate wound care, malaria testing, and essential medicines during riverine floods.',
        location: 'Gabilay Agricultural Valleys',
        status: ProjectStatus.Completed,
        imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=600',
        beneficiaries: '3,100 Urgent Consultations',
      },
    ],
  });

  console.log('Projects seeded successfully');

  // 5. Seed News Items
  await prisma.newsItem.createMany({
    data: [
      {
        authorId: admin.id,
        title: 'SHiFAT Receives Prestigious Regional Health Partnership Award',
        excerpt: 'Recognized for pioneering local, community-led maternal healthcare solutions and mobile solar-powered clinics in pastoral areas.',
        content: 'We are incredibly honored to receive the Regional Health Excellence Partnership Award from national authorities. Over the last three years, SHiFAT has established six self-sufficient health centers in rural desert regions. Dr. Hodan Yusuf, our Executive Director, stated: "This award belongs to our community health advocates who traverse hundreds of kilometers on foot to deliver hope and vital vaccines. True healthcare development is built from the community up."',
        category: NewsCategory.Announcement,
        imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=600',
        slug: 'shifat-receives-prestigious-regional-health-partnership-award',
        isPublished: true,
        publishedAt: new Date('2026-06-18'),
      },
      {
        authorId: admin.id,
        title: 'Drought Emergency Operations Activated in Sanaag Region',
        excerpt: 'Mobilizing five mobile health clinics and emergency water transport in response to severe dry conditions in Sanaag.',
        content: 'Following two missed consecutive rainfall seasons, the water deficit has reached critical levels in parts of eastern Sanaag. In response, SHiFAT has activated its Emergency Level 2 response. Our team has dispatched five 4x4 mobile health tankers delivering clean drinking water to over 15 grazing camps. We have also set up urgent health outposts in remote communities to treat drought-related conditions, including severe dehydration and respiratory stress.',
        category: NewsCategory.Emergency,
        imageUrl: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&q=80&w=600',
        slug: 'drought-emergency-operations-activated-in-sanaag-region',
        isPublished: true,
        publishedAt: new Date('2026-06-02'),
      },
      {
        authorId: admin.id,
        title: 'Incredible Milestone: 250,000 Vaccine Doses Administered in East Africa',
        excerpt: 'Our mobile vaccination outreach reaches a quarter-million immunized children across remote regions of Somaliland.',
        content: 'Today, our immunization team reached a major milestone by administering our 250,000th vaccine dose to a 9-month-old infant named Warsame in a pastoral settlement near Erigavo. Our team relies on innovative solar backpack immunization coolers and extensive partnerships with local clan elders, who play a vital role in educating parents and building vaccine confidence. The immunization program targets Polio, Measles, and DPT.',
        category: NewsCategory.Campaign,
        imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=600',
        slug: 'incredible-milestone-250000-vaccine-doses-administered-in-east-africa',
        isPublished: true,
        publishedAt: new Date('2026-05-14'),
      },
      {
        authorId: admin.id,
        title: 'Expanding Our Reach: Constructing Safe Water Facilities in Schools',
        excerpt: 'SHiFAT partners with local authorities to construct solar-pump wells and sanitary latrines in 10 primary schools.',
        content: 'Safe water access is crucial for children to remain in school and learn comfortably. SHiFAT is launching its "Schools for WASH" program to drill boreholes and install water taps right inside school grounds. Each school will also receive training on community health advocacy, creating student hygiene committees to promote handwashing and basic disease prevention guidelines.',
        category: NewsCategory.Update,
        imageUrl: 'https://images.unsplash.com/photo-1541256996761-85df2efaa164?auto=format&fit=crop&q=80&w=600',
        slug: 'expanding-our-reach-constructing-safe-water-facilities-in-schools',
        isPublished: true,
        publishedAt: new Date('2026-04-28'),
      },
    ],
  });

  console.log('News Items seeded successfully');

  // 6. Seed Publications
  await prisma.publication.createMany({
    data: [
      {
        title: 'Annual Report 2023: A Year of Record Impact',
        description: 'Comprehensive overview of SHiFAT\'s programs, financial performance, and impact metrics for the 2023 fiscal year. Includes detailed breakdowns of all six program areas.',
        category: PublicationCategory.ANNUAL_REPORT,
        fileUrl: '/mock/Annual_Report_2023.txt',
        pages: '48 pages',
        isPublished: true,
        publicationDate: new Date('2024-03-15'),
      },
      {
        title: 'Maternal Health in Somaliland: A Community-Based Approach',
        description: 'Peer-reviewed study documenting the effectiveness of SHiFAT\'s community-based maternal health model in reducing maternal and neonatal mortality in rural Somaliland.',
        category: PublicationCategory.RESEARCH_PAPER,
        fileUrl: '/mock/Maternal_Health_Study.txt',
        pages: '24 pages',
        isPublished: true,
        publicationDate: new Date('2024-01-10'),
      },
      {
        title: 'Emergency Relief Operations: Lessons from the 2023 Drought Response',
        description: 'Detailed analysis of SHiFAT\'s emergency relief operations during the 2023 Horn of Africa drought, including logistics, coordination, and outcomes assessment.',
        category: PublicationCategory.FIELD_REPORT,
        fileUrl: '/mock/Drought_Response_2023.txt',
        pages: '32 pages',
        isPublished: true,
        publicationDate: new Date('2023-11-20'),
      },
      {
        title: 'Community Health Worker Training Manual',
        description: 'Comprehensive training curriculum for community health workers covering primary healthcare, hygiene promotion, and maternal care support.',
        category: PublicationCategory.TRAINING_GUIDE,
        fileUrl: '/mock/CHW_Training_Manual.txt',
        pages: '86 pages',
        isPublished: true,
        publicationDate: new Date('2023-09-05'),
      },
      {
        title: 'Water, Sanitation and Hygiene (WASH) Regional Policy Brief',
        description: 'Strategic guidelines and policy recommendations for regional authorities and non-governmental partners regarding solar-powered borehole rehabilitations.',
        category: PublicationCategory.POLICY_BRIEF,
        fileUrl: '/mock/WASH_Policy_Brief.txt',
        pages: '12 pages',
        isPublished: true,
        publicationDate: new Date('2024-05-12'),
      },
    ],
  });

  console.log('Publications seeded successfully');

  // 7. Seed Team Members
  await prisma.teamMember.createMany({
    data: [
      {
        name: 'Dr. Hodan Yusuf',
        role: 'Founder & Executive Director',
        bio: 'Dr. Yusuf is an obstetrician-gynecologist with over 18 years of humanitarian experience in East Africa. She founded SHiFAT to combine direct clinical service with grass-roots mobilization, believing that sustainable healthcare is built by training local communities.',
        imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300',
        category: TeamCategory.Leadership,
        sortOrder: 1,
      },
      {
        name: 'Dr. Abdirahman Omar',
        role: 'Chief Medical Officer',
        bio: 'Dr. Omar holds a Master of Public Health from the University of London and has managed disease outbreak responses for leading international NGOs. He oversees all field clinical activities, mobile units, and therapeutic nutrition outposts.',
        imageUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300',
        category: TeamCategory.Leadership,
        sortOrder: 2,
      },
      {
        name: 'Halima Farah',
        role: 'Director of Community Mobilization',
        bio: 'Halima is a master of community organizing with a background in social development. She leads the community health worker training curriculum and coordinates with regional leaders to build high-trust relationships in remote villages.',
        imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
        category: TeamCategory.Leadership,
        sortOrder: 3,
      },
      {
        name: 'Faisal Warsame',
        role: 'WASH & Infrastructure Lead',
        bio: 'Faisal is a hydrogeological engineer with 12 years of experience designing water networks. He manages drilling teams, solar system integrations, and sanitary construction projects across drought-prone sectors.',
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
        category: TeamCategory.Advisory,
        sortOrder: 4,
      },
      {
        name: 'Dr. Marian Duale',
        role: 'Senior Pediatric Advisor & Vaccinations Coordinator',
        bio: 'Dr. Duale coordinates our immunization programs, managing logistics and the cold chain integrity of remote vaccine drops. She specializes in infectious pediatric diseases and advocates for early infant vaccination.',
        imageUrl: 'https://images.unsplash.com/photo-1594824813573-246434e33963?auto=format&fit=crop&q=80&w=300',
        category: TeamCategory.Medical,
        sortOrder: 5,
      },
      {
        name: 'Anisa Barre',
        role: 'Chief Operations & Finance Officer',
        bio: 'Anisa handles logistics, donor compliance, and transparent financial reporting. She has over a decade of experience managing multilateral grants from global trusts and government partnerships.',
        imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300',
        category: TeamCategory.Leadership,
        sortOrder: 6,
      },
    ],
  });

  console.log('Team Members seeded successfully');

  // 8. Seed Career Opportunities
  await prisma.careerOpportunity.createMany({
    data: [
      {
        title: 'Senior Community Midwife Trainer',
        department: 'Maternal & Child Health',
        location: 'Hargeisa HQ, with frequent travel to Togdheer',
        type: JobType.FULL_TIME,
        description: 'Lead clinical and practical health workshops for local birth attendants and midwife candidates in rural maternal care clinics.',
        requirements: [
          'Registered Midwife or Obstetric Nurse certification with 5+ years experience.',
          'Fluency in Somali and English is required.',
          'Previous experience training health workers in resource-limited environments.',
        ],
      },
      {
        title: 'WASH Field Engineer',
        department: 'Water & Sanitation Infrastructure',
        location: 'Sanaag Region Field Post',
        type: JobType.FULL_TIME,
        description: 'Design and supervise borehole rehabilitation, solar-powered water pump integrations, and school washroom construction.',
        requirements: [
          'B.S. in Civil, Civil-Environmental, or Hydrogeological Engineering.',
          '2+ years engineering field experience, specifically solar pump sizing and well casing.',
          'Willingness to live and operate in remote desert sectors.',
        ],
      },
      {
        title: 'Mobile Immunization Team Lead',
        department: 'Vaccinations & Outreach',
        location: 'Burao Outreach Office',
        type: JobType.FULL_TIME,
        description: 'Manage vaccine cold-chain logistics, supervise 5 mobile health teams, and liaise with community leaders to schedule child immunization campaigns.',
        requirements: [
          'Nursing degree or equivalent public health qualifications.',
          'Experience in vaccine stock management and public immunization protocols.',
          'Strong leadership and cross-cultural communication skills.',
        ],
      },
      {
        title: 'Public Health Volunteer (Campaigns Coordinator)',
        department: 'Health Education',
        location: 'Various Regions (Flexible)',
        type: JobType.VOLUNTEER,
        description: 'Help coordinate public health training events, distribute sanitizing equipment, and lead school hygiene clubs.',
        requirements: [
          'Enthusiasm for humanitarian healthcare and community engagement.',
          'Basic knowledge of hygiene, sanitation, and nutrition.',
          'Commitment of at least 3 months.',
        ],
      },
    ],
  });

  console.log('Careers seeded successfully');

  // 9. Seed Partners
  await prisma.partner.createMany({
    data: [
      {
        name: 'Somaliland Ministry of Health',
        logoUrl: 'SL-MOH',
        type: PartnerType.GOVERNMENT,
        logoBg: 'bg-emerald-600 text-white',
        sortOrder: 1,
      },
      {
        name: 'UNICEF Horn of Africa (Collaborative)',
        logoUrl: 'UNICEF-H',
        type: PartnerType.INTERNATIONAL_NGO,
        logoBg: 'bg-sky-500 text-white',
        sortOrder: 2,
      },
      {
        name: 'Horn of Africa Medical Aid',
        logoUrl: 'HAMA',
        type: PartnerType.LOCAL_TRUST,
        logoBg: 'bg-blue-700 text-white',
        sortOrder: 3,
      },
      {
        name: 'Global Well-Water Trust',
        logoUrl: 'G-WASH',
        type: PartnerType.INTERNATIONAL_NGO,
        logoBg: 'bg-indigo-600 text-white',
        sortOrder: 4,
      },
      {
        name: 'Somali Diaspora Health Forum',
        logoUrl: 'SDHF',
        type: PartnerType.CORPORATE_DONOR,
        logoBg: 'bg-teal-700 text-white',
        sortOrder: 5,
      },
      {
        name: 'Mercy Horn Humanitarian Group',
        logoUrl: 'MHHG',
        type: PartnerType.INTERNATIONAL_NGO,
        logoBg: 'bg-amber-600 text-white',
        sortOrder: 6,
      },
    ],
  });

  console.log('Partners seeded successfully');

  // 10. Seed FAQs
  await prisma.faq.createMany({
    data: [
      {
        question: 'What is SHiFAT and what does it do?',
        answer: 'SHiFAT (Somali Health Initiative For All Trust) is a non-profit humanitarian organization dedicated to improving healthcare access, maternal and child health, nutrition, clean water, and emergency relief across the Horn of Africa, with a primary focus on Somaliland.',
        category: 'General',
        sortOrder: 1,
      },
      {
        question: 'How can I donate to SHiFAT?',
        answer: 'You can donate online through our website using ZAAD, e-Dahab, Premier Wallet, Premier Bank MasterCard, or Stripe. You can also set up monthly recurring donations. All donations are tax-deductible and you will receive a receipt.',
        category: 'Donations',
        sortOrder: 2,
      },
      {
        question: 'Is my donation tax-deductible?',
        answer: 'Yes, SHiFAT is a registered charitable trust. All donations are tax-deductible, and we provide official tax receipts for every contribution. You can download your receipts from your donor dashboard.',
        category: 'Donations',
        sortOrder: 3,
      },
      {
        question: 'Can I volunteer with SHiFAT?',
        answer: 'Absolutely! We welcome volunteers with medical, engineering, education, and administrative backgrounds. Visit our Get Involved page to view current opportunities and submit your application.',
        category: 'Volunteering',
        sortOrder: 4,
      },
      {
        question: 'Where does SHiFAT operate?',
        answer: 'SHiFAT primarily operates across Somaliland, including Hargeisa, Togdheer, Sanaag, Awdal, Sahil, and Maroodi Jeeh regions. We also coordinate emergency responses throughout the Horn of Africa.',
        category: 'General',
        sortOrder: 5,
      },
      {
        question: 'How are my donations used?',
        answer: 'Over 85% of all donations go directly to program activities, including medical supplies, clean water infrastructure, nutrition programs, and emergency relief. Less than 15% covers administrative and operational costs. Our annual reports provide full financial transparency.',
        category: 'Donations',
        sortOrder: 6,
      },
      {
        question: 'Does SHiFAT accept partnership inquiries?',
        answer: 'Yes, we actively partner with international NGOs, government bodies, local trusts, and corporate donors. Contact our partnerships team through the Partners section on our website.',
        category: 'Partnerships',
        sortOrder: 7,
      },
      {
        question: 'How can I stay updated on SHiFAT activities?',
        answer: 'Subscribe to our newsletter, follow us on social media, or visit our News section for the latest updates, campaign progress, and impact stories from the field.',
        category: 'General',
        sortOrder: 8,
      },
    ],
  });

  console.log('FAQs seeded successfully');
  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
