I have completed the development of the official web application for SHiFAT (Somali Health Initiative For All Trust). The layout, typographic balance, and color pairings reflect the organization's humanitarian vision, utilizing the green (health/hope) and blue (trust/stability) brand colors from the logo emblem.
Here is a summary of the designed and implemented features:
🎨 Visual Identity & Aesthetic Choices
Emblem Integration: Implemented a responsive custom SVG logo illustrating the dual curved abstract figures (green and blue) forming a unified circle of community care.
Outfit & Inter Typography: Set up a custom modern typographic scale using Outfit for display headings paired with Inter for legible UI copy.
Off-White Sand Canvas: Styled the background with soft off-white sand tones and charcoal grays, highlighting information with subtle borders and negative space.
⚙️ Core Web Application Modules
Inspiring Home Page
Hero Slider Carousel: Showcases fading background slides targeting maternal health, solar-water drilling, and emergency relief with direct action triggers.
Consolidated Impact statistics: Features interactive metric counters and an illustrative budget breakdown.
About, Vision, Mission & Leadership
Strategic Directives: Includes cards detailing SHiFAT's grassroots mission, future vision, and compassion-first values.
Leadership Bio Modals: Lists key medical directors and advisors, opening detailed interactive popup overlays for individual biographies.
The 6 Primary Health Programs
Presents Maternal & Child Health, Emergency Relief, Health Training, Clean Water & Sanitation (WASH), Vaccination, and Nutrition in a responsive grid.
Initiatives Modals: Clicking "Learn Detailed Scope" launches full-page overlays with strategic activities and program-specific donation triggers.
Targeted Health Campaigns
Tracks active drives, like the Zero Polio Campaign and Safe Motherhood Ward Renovation, with custom progress bars representing funding milestones.
Interactive Projects Map
Features a filterable grid of completed and ongoing field projects.
Schematic Regional Pinpoints: Integrates a responsive geographical schematic map of Somaliland showing project pins (Hargeisa, Sheikh, Burao, Erigavo, Salahlay) that link directly to cards upon click.
Publications & Newsroom
Displays press releases, emergency notices, and immunization diaries with an embedded full-text article reader.
Interactive Secure Donations Gateway
Offers pre-configured impact options (e.g. prenatal kits, midwife certification) and custom inputs.
Regional Mobile Payment Integrations: Simulates regional mobile money wallets (ZAAD Service and e-Dahab) alongside international Credit/Debit card gateways.
Official Receipts: Renders a printable tax-deductible receipt with a unique tracking ID upon successful completion.
Get Involved & Vocational Careers
Presents active vocational openings with key requirements.
Simulated Upload Dropzone: Incorporates drag-and-drop resume attachment forms.
Global Coalition & Partners
Lists key governmental and international NGO affiliates alongside a collaborative proposal inquiry form.
Contact & FAQ Hub
Hosts physical addresses, Somali coordination hotline numbers, and operating hours (Sunday to Thursday).
FAQ Accordion: Integrates smooth expandable tabs covering resource allocation, transparency, and volunteering questions.

I have refactored the SHiFAT website to introduce a more structured, balanced navigation system, extensive page heroes, subtle interactive animations, and a dedicated reports and research repository.
Key Refactoring & Core Features Completed:
Minimized Navbar Dropdown Menu Structure:
Consolidated nine individual top-level headers into five elegant categories: Home, About Us, Our Initiatives (Dropdown), News Room, and Get Involved (Dropdown).
Desktop Dropdowns: Fully responsive hovering cards with supporting descriptors to describe sub-scopes (e.g. Programs, Campaigns, Projects, and Publications).
Mobile Dropdowns: Elegant accordion drawers that smoothly expand on click, ensuring full ease of use on mobile devices.
New Publications Portal:
Introduced an official reports and research database, providing downloadable files like the Annual Report 2023, peer-reviewed maternal health studies, and regional WASH guidelines.
Category Filter & Keyword Search: Fully responsive real-time client-side filter controls.
Interactive Download Feeds: Simulated, animated file download actions with localized state indicators showing active progress spinners, completing with a checkmark.
Extensive Page Hero Sections:
Designed massive hero panels with introductory titles, detailed background images, and custom gradient overlays on the About Us, Programs, Get Involved, and Contact Us pages.
Introduced matching typography pairings such as elegant display titles paired with clean body text and custom green badges highlighting regional operations.
Fluid Animations & Micro-Interactions:
Used motion/react to apply smooth, non-intrusive stagger entrances, card slide-ups, hover scales, and accordion foldouts.
Implemented full drag-and-drop file upload interfaces inside the Get Involved recruitment board, complete with drop zone indicator styles and submission receipt notifications.

I have resolved the issue with the desktop navigation hover dropdowns:
Seamless Bridge Containers: Replaced the absolute top margin (mt-1) with top-aligned absolute wrappers (top-full) configured with invisible top padding (pt-2). This establishes an unbroken hover zone between the parent menu links and the dropdown cards.
Continuous Hover Persistence: Eliminates the "dead zone" gap where the cursor previously triggered a premature onMouseLeave event, allowing users to hover smoothly from the trigger link directly into the submenu links.
Consistent Behavior: Applied this seamless UX pattern uniformly across both primary desktop submenus (Our Initiatives and Get Involved).

I have successfully designed and built a gorgeous, highly interactive Desktop Mega Menu for the "Our Initiatives" header link!
🌟 What was implemented:
Intelligent Grid Architecture:
Replaced the simple list dropdown with an structured 12-column layout (w-[840px]).
Split the menu into a Knowledge & Impact Sector grid (7-columns) and a Featured Action Center (5-columns).
Core Initiatives Grid (Left Column):
Designed elegant cards for all 4 key areas: Programs, Campaigns, Projects, and Publications.
Integrated custom, high-contrast visual elements including status colors, micro-descriptions, dynamic sub-text, and hover arrow transition triggers.
Active Relief Action Center (Right Column):
Added a feature-rich, beautiful card highlighting the active Eastern Hargeisa Mobile Clinic initiative with a live pulse indicator.
Built a custom progress tracker showing current metrics directly in the layout ($15,000 / $25,000 Target).
Styled high-contrast Support, Volunteer, and FAQ Call-To-Action buttons to encourage direct user engagement.
Seamless Navigation & Hover Dynamics:
Preserved our gapless hover physics (top-full pt-2) to keep interactions completely fluid and solve any flickering or premature closures when moving the cursor.