1. Executive Summary & Core Mission
SHiFAT is an official public health trust and community organization operating at the intersection of immediate emergency assistance and sustainable healthcare system development in the Horn of Africa. Headquartered in Hargeisa, Somaliland, the organization focuses on community consensus, grassroots mobilization, and transparent resource stewardship.
This application serves as SHiFAT's official knowledge portal, mobilization center, and donation gateway. It has been built to convey the highest tier of professional authority, structural clarity, and visual beauty—strictly avoiding typical "AI boilerplate templates" in favor of customized typography, responsive layout rhythms, and high-fidelity mock integrations.
2. Technical Stack & Architecture
The application is built using a modern, fast, and secure client-side Single Page Application (SPA) architecture. Below are the core technical stack details:
Framework: React 18 scaffolded with Vite for optimized, hot-reload-free compilation.
Language: Strict, fully type-safe TypeScript.
Styling Engine: Tailwind CSS using a curated global CSS entry point (src/index.css) for utility classes, custom themes, and font variables.
Animations: Powered by Motion (imported from motion/react) for smooth page entrances, modal fade-ins, collapsible accordions, and subtle hover lifts.
Iconography: Strictly standardized on Lucide React (lucide-react)—ensuring clean, lightweight vectors across the site.
Type Safety Model (src/types.ts): Centralized data models dictate component contracts (e.g., Program, Campaign, Project, NewsItem, TeamMember, FAQItem, Partner, CareerOpportunity, Publication).
Data Store (src/data.ts): Complete, rich database dictionaries that house realistic, contextual operational figures from Hargeisa headquarters, preventing flat, repetitive placeholders.
3. UI Theme & Visual Brand Identity
To communicate absolute institutional trust, the visual brand relies on a meticulously selected palette and typeface scheme:
The Palette:
Dark Slate / Charcoal (from-slate-900 to-brand-charcoal): Provides a premium, grounded base for heavy display regions, headers, and hero overlays.
Clinical Emerald Green (text-brand-green / #10B981): Applied to active impact indicators, completed checkmarks, and operational successes.
Trust Cobalt Blue (text-brand-blue / #3B82F6): Standard color for core navigational links, interactive components, and educational highlights.
Warm Sand (bg-brand-sand): A soft, eye-safe cream color used as section dividers, representing local Horn of Africa landscape environments.
The Typography:
Primary Display: Bold, high-contrast, modern headings (font-display) that align layout hierarchies.
Body Content: Clean, readable sans-serif (font-sans) featuring generous line heights (leading-relaxed) to handle heavy descriptive texts comfortably.
Data Counters / Status Labels: Monospace (font-mono / JetBrains Mono) for financial figures, audited progress tracking, and dates, establishing a technical, reliable, and auditable feel.
4. Navigation Architecture & The Mega Menu
A core highlight of the layout is the newly redesigned, accessible desktop header navigation:
Friction-Free Cursor Buffering: Dropdowns are framed in parent divs that use an absolute vertical positioning offset (top-full pt-2). This guarantees that when a user moves their cursor from the navigation link to the dropdown box, the menu stays open, eliminating mouse-out gaps.
Our Initiatives Mega Menu: Hovering over the "Our Initiatives" link opens a grand 840px visual mega-grid:
Left Section (Impact Sectors): Houses multi-column navigation links pointing to Programs, Campaigns, Projects, and Publications. Each link contains customized sub-text and visual hover transitions.
Right Section (Featured Spotlights): A high-contrast gradient banner highlighting active humanitarian drives (e.g., "Eastern Hargeisa Mobile Clinics"), rendering live target scales, and offering immediate fast-track buttons directly to the donation forms.
5. Feature Modules & Page Architecture
The application functions via a fluid, single-view rendering structure in App.tsx matching key view states:
Home View (home): Features massive hero titles, an automated three-card statistics showcase, active news timelines, and strategic partner carousels.
About Us View (about): Contains core operating statements (Mission & Vision) and team card grids. Clicking on any doctor or team member opens a full-screen Biographical overlay modal populated with their email coordinates and regional division roles.
Programs View (programs): Focuses on SHiFAT's 6 operational pillars (Maternal Care, Clean Water, Immunization, etc.). Clicking "Learn Detailed Scope" triggers dynamic slide-up panels highlighting audited metrics and regional activities.
Campaigns View (campaigns): Features crowd-funding cards with real-time target meters, progress bars, and direct links to pre-fill donation categories.
Projects View (projects): Houses completed and active construction logs (such as borehole rehabilitations) with search filtering.
Publications Portal (publications): An educational repository displaying Peer-Reviewed Studies, Policy Briefs, and Annual Reports. Features category tabs and a live document search. Users can click "Download Report" to trigger a real, dynamic .txt file compiler in the browser that downloads a certified digital report of the file locally.
Get Involved / Careers View (get-involved): Houses diaspora vocational positions and volunteer options. Features a custom Drag-and-Drop file uploader supporting PDF resumes and compiling simulated candidate tracking codes.
Donate Gateway (donate): A fully-featured payment processor mockup. Supports quick-give selectors, program earmarking, and card credentials validation that completes by printing a formal tax receipt.
6. Developer Directives for Next Steps (Antigravity Agent Pick-up)
If you are continuing development or refactoring this project, please adhere to these guidelines:
Keep Code Modular: Do not consolidate newly requested pages back into a single massive file (e.g., App.tsx). Maintain separate components inside the src/components/ folder and export types in src/types.ts.
Strictly Preserve Theme Colors: When generating new visual assets, buttons, or charts, strictly utilize the defined colors: brand-green, brand-blue, brand-charcoal, and brand-sand (utilize native Tailwind configuration properties or explicit hexes).
Preserve Hover Gaps: If modifying the navbar dropdown controls, keep the nested layout wrapping structure intact. The visual panel must always be padded inside a container starting precisely at top-full pt-2 to prevent dead-zone hover collapses.
Lucide Icon Standardization: Never write manual SVG strings for general icons. Always look up and import corresponding elements from lucide-react.
Build and Lint Verification: Before committing major changes, verify TypeScript compiler status by running the linter (npm run lint) to avoid broken build runs on deployment containers.