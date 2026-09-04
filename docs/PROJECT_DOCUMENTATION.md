# NexaHome Service Provider — Comprehensive Codebase & Architectural Guide

## 1. Executive Summary & Purpose

**NexaHome Service Provider** is the dedicated web application for contractors, tradespeople, and service professionals operating on the NexaHome home services platform. 

The application enables service providers to:
1. **Onboard & Verify**: Complete a strict 4-step wizard (Profile Setup, Business Documents, Portfolio Media, and Identity Verification via Veriff/ID Cards).
2. **Explore & Unlock Leads**: Discover homeowner job requests tailored to the provider's trade categories and geographic service radius, spending platform **Credits** to unlock homeowner contact information.
3. **Manage Pipeline**: Track applications across three distinct lifecycles: **Applied**, **Ongoing (Confirmed)**, and **Completed**.
4. **Monetize & Scale**: Purchase credit packages (fixed or custom), subscribe to **Advanced Category Plans** (unlimited trade categories), and subscribe to the **Trusted Expert Badge** for higher trust and conversion.
5. **Manage Business & Compliance**: Maintain multiple operating addresses with interactive Google Maps pinning, configure real-time notification alerts, manage portfolio media, and track detailed financial transactions.

---

## 2. Technology Stack & Framework Specifications

| Layer | Technology | Version | Purpose & Implementation Details |
|---|---|---|---|
| **Framework** | Next.js (Turbopack) | 16.2.4 | Modern App Router architecture with static generation & server rendering |
| **Core UI Engine** | React / React DOM | 19.2.4 | Modern Concurrent React with `babel-plugin-react-compiler` |
| **Language** | TypeScript | ^5.0.0 | Strict mode type-checked (100% clean `tsc --noEmit`) |
| **Styling & Design** | Tailwind CSS / PostCSS | v4.0.0 | High-performance CSS-first theming with `tw-animate-css` |
| **Component Primitives** | Radix UI / Shadcn | ^1.4.3 | Accessible modal dialogs, dropdowns, popovers, labels, and toasts |
| **Icons & Typography** | Lucide React / Fontsource | ^1.9.0 | Plus Jakarta Sans font with modern SVG iconography |
| **Server State** | TanStack React Query | ^5.100.10 | Query caching, optimistic updates, and cache invalidation hooks |
| **Client / Auth State** | Redux Toolkit | ^2.12.0 | Centralized session state (`auth-slice.ts`) and global dispatcher |
| **Forms & Validation** | React Hook Form + Zod | ^7.74.0 / ^4.3.6 | Type-safe form schemas, file validation, and real-time error toasts |
| **Identity & KYC** | Veriff SDK | ^2.5.0 | `@veriff/incontext-sdk` alongside custom dual-sided ID card upload |
| **OAuth & Push** | Firebase SDK | ^12.13.0 | Firebase Auth (Google OAuth popup) and Firebase Analytics |
| **Geo & Mapping** | Google Maps Platform | API v3 | Google Places Autocomplete, Geocoding API, and Map Pin Picker |
| **Charts** | Recharts | ^3.8.1 | Analytical telemetry and dashboard metric visualizers |
| **HTTP Transport** | Axios | ^1.16.1 | Singleton API client with device telemetry and 403 interceptors |

---

## 3. Directory Map & Structural Blueprint

```
Nexa-Home-Service-Provider/
├── docs/
│   └── PROJECT_DOCUMENTATION.md      # Permanent in-repo comprehensive guide
├── public/
│   ├── asset/                        # Static brand assets (logos, badges, illustrations)
│   └── favicon.ico                   # Application icon
├── src/
│   ├── app/                          # Next.js App Router (69 compiled routes)
│   │   ├── auth/                     # Public authentication endpoints
│   │   │   ├── login/                # Unified email/password & Google login
│   │   │   ├── register/             # Provider registration
│   │   │   ├── forgot-password/      # Password recovery trigger
│   │   │   ├── verify-email/         # 5-digit OTP verification for signup
│   │   │   ├── verify-otp/           # OTP verification for password reset
│   │   │   ├── change-password/      # Reset password entry with resetToken
│   │   │   └── signup-verify-otp/    # Signup OTP modal hold screen
│   │   ├── onboarding/               # Strict 4-step onboarding wizard
│   │   │   ├── profile-setup/        # Step 1: Personal, company, address & categories
│   │   │   ├── business-documents/   # Step 2: Licenses, tax, ownership, address proof
│   │   │   ├── portfolio/            # Step 3: Photos & videos showcasing work
│   │   │   ├── identity-card/        # Step 4: Front & back government ID upload
│   │   │   ├── id-submitted/         # Post-identity submission confirmation
│   │   │   └── account-status/       # Dynamic KYC status hub (submitted/resubmit/approved)
│   │   ├── Walkthrough/              # Post-onboarding tour & upsell flow
│   │   │   ├── page.tsx              # Step 1/3: 4-card interactive feature tour
│   │   │   ├── credit-plans/         # Step 2/3: Credit package purchase selection
│   │   │   └── verified-badge/       # Step 3/3: Trusted Expert Badge subscription
│   │   ├── home/                     # Authenticated service provider dashboard
│   │   │   ├── page.tsx              # Job feed, search, filter modal, stats cards
│   │   │   └── _components/          # Header, stats, address selector, filter dialog
│   │   ├── jobs/                     # Marketplace job leads
│   │   │   └── [id]/                 # Lead details, masked client info, credit purchase
│   │   ├── my-jobs/                  # Provider's active and historical workload
│   │   │   ├── page.tsx              # Tabbed list (Applied, Ongoing, Completed)
│   │   │   └── [id]/                 # Active job details with unmasked client contacts
│   │   ├── credit-plans/             # Standalone credit package checkout screen
│   │   ├── identity-verification/    # Full-screen lock for pending/rejected KYC
│   │   ├── user-profile/             # Public-facing provider profile editor
│   │   │   ├── page.tsx              # Profile header, basic info, portfolio, reviews
│   │   │   └── _components/          # Edit profile dialog, edit portfolio dialog
│   │   ├── profile-settings/         # Comprehensive settings panel
│   │   │   ├── notifications/        # Granular alert and browser push notification toggles
│   │   │   ├── service-plan/         # Advanced Category Plan subscription management
│   │   │   ├── verified-badge-plan/  # Trusted Expert Badge subscription management
│   │   │   ├── ad-promotion/         # Local ad campaign creation and telemetry
│   │   │   ├── addresses/            # Address management with Google Map pin picker
│   │   │   ├── change-phone-number/  # Two-step phone change with SMS OTP
│   │   │   ├── change-password/      # Authenticated password updater
│   │   │   ├── transaction-history/  # Financial ledger with date filtering & details
│   │   │   ├── report-an-issue/      # Support ticketing system (Under Review / Resolved)
│   │   │   └── delete-account/       # Irreversible account termination
│   │   ├── wallet/                   # Payment gateway return routes (success / cancel)
│   │   ├── app/                      # Embedded administrative / platform analytics module
│   │   ├── layout.tsx                # Root layout mounting AppProviders & global CSS
│   │   ├── page.tsx                  # Root entrypoint redirecting via ProtectedRoute
│   │   └── globals.css               # Design tokens, animations, and custom scrollbars
│   ├── components/                   # Reusable React components
│   │   ├── auth/                     # LoginForm, GoogleSignInButton, Hydrators, Modals
│   │   ├── jobs/                     # JobDetailView, PurchaseJobModal, AttachmentGallery
│   │   ├── layout/                   # MainAppShell (standard responsive container)
│   │   ├── legal/                    # LegalDocumentModal (Terms & Privacy dialogs)
│   │   ├── media/                    # MediaGalleryModal (photo/video lightbox)
│   │   ├── notifications/            # BrowserNotificationManager
│   │   ├── onboarding/               # OnboardingLayout, step guards, logout buttons
│   │   └── ui/                       # Accessible UI primitives (Button, Dialog, Toaster, etc.)
│   ├── hooks/                        # Feature-scoped React Query mutation & query hooks
│   │   ├── addresses/                # useAddressesQuery, useAddressMutations
│   │   ├── advertisement/            # useAdHistoryQuery, usePromoteAdvertisementMutation
│   │   ├── auth/                     # useAuthMutations, useChangePassword, useChangePhone
│   │   ├── billing/                  # useSubscriptionPlans, useCheckoutSession, useTransactions
│   │   ├── jobs/                     # useProviderFeedQuery, useJobDetailQuery, useApplyJob
│   │   ├── notifications/            # useNotificationsQuery, useNotificationMutations, useBrowserSync
│   │   ├── onboarding/               # useCompleteProfileSetup, useUploadDocs
│   │   ├── report-issue/             # useMyReportIssuesQuery, useCreateReportIssueMutation
│   │   ├── reviews/                  # useReceivedReviewsQuery
│   │   ├── settings/                 # useSettingsQuery, useToggleSettingsMutation
│   │   ├── user/                     # useCurrentUserQuery, useUpdateProfile, useEditPortfolio
│   │   └── wallet/                   # useProviderDashboardQuery
│   ├── lib/                          # Core utilities, API clients, and business engines
│   │   ├── axios.ts                  # Axios instance, baseURL, device headers, 403 interceptor
│   │   ├── auth-session.ts           # Token cookies, localStorage sync, auth extractor
│   │   ├── auth-utils.ts             # US phone formatters, email existence parsers
│   │   ├── onboarding-steps.ts       # 4-step route permissions and sequential redirect logic
│   │   ├── walkthrough-storage.ts    # Walkthrough completion state in localStorage
│   │   ├── google-maps.ts            # Dynamic script loader & Geocoding helpers
│   │   ├── compress-image-file.ts    # Canvas-based client-side image compression
│   │   ├── schemas/                  # Zod validation schemas (auth, profile, documents)
│   │   └── toast.ts                  # Centralized toast event dispatcher
│   ├── providers/                    # Top-level context wrappers (`AppProviders.tsx`)
│   ├── routes/                       # `ProtectedRoutes.tsx` central state gatekeeper
│   ├── services/                     # Direct HTTP REST calls to backend API endpoints
│   ├── store/                        # Redux Toolkit store and slices (`auth-slice.ts`)
│   └── types/                        # Comprehensive TypeScript interface definitions
```

---

## 4. Authentication, Session & Routing Engine

### 4.1. Axios Architecture (`src/lib/axios.ts`)
- **API Base URL**: Dynamically resolves `process.env.NEXT_PUBLIC_API_URL` with fallback to `https://api.nexahomeapp.com`.
- **Telemetry Headers**:
  - `devicemodel`: Fixed string `"Web Browser"`.
  - `deviceuniqueid`: Client-generated UUID stored in `localStorage` under `deviceUniqueId`.
  - `ngrok-skip-browser-warning`: `"true"` (enables seamless tunneling during staging/dev).
  - `authorization`: Attached as `Bearer <token>` whenever `token` is present in cookies.
- **Interceptors**:
  - Global request timeout: `1,000,000ms`.
  - On HTTP `403 Forbidden`: Automatically invokes `clearAuthTokenCookie()` and forces a window redirect to `/auth/login` (whitelisting `/auth/*` endpoints to allow legitimate auth errors).

### 4.2. Tri-Tier Session Synchronization (`src/lib/auth-session.ts`)
Session state is coordinated across three synchronizing stores:
1. **HTTP Cookie (`js-cookie`)**: Stores `token` with a 7-day expiration, `sameSite: "lax"`, accessible across client-side API requests.
2. **Redux Store (`auth-slice.ts`)**: In-memory global state tracking `{ token, isAuthenticated, user }`.
3. **Local Storage (`nexa_auth_user`)**: Serialized JSON representation of the `User` object, allowing instant zero-latency hydration before network re-validation via `<AuthHydrator />` and `<CurrentUserSync />`.

### 4.3. Route Guard Engine (`src/routes/ProtectedRoutes.tsx`)
`ProtectedRoutes` acts as the traffic controller for all page views, enforcing an uninterrupted sequence:

```
                                  [ Incoming Request ]
                                           │
                                           ▼
                                 Is User Authenticated?
                                   ├── No  ──► Is Public Auth Path?
                                   │              ├── Yes ──► Allow Access
                                   │              └── No  ──► Redirect to /auth/login
                                   └── Yes
                                           │
                                           ▼
                                Is Billing Return Path?
                                   ├── Yes ──► Allow Access (Process Stripe return)
                                   └── No
                                           │
                                           ▼
                                Is Email Verified?
                                   ├── No  ──► Redirect to /auth/verify-email
                                   └── Yes
                                           │
                                           ▼
                              Is Onboarding Complete? (4 Steps)
                                   ├── No  ──► Lock to current incomplete step:
                                   │            1: /onboarding/profile-setup
                                   │            2: /onboarding/business-documents
                                   │            3: /onboarding/portfolio
                                   │            4: /onboarding/identity-card
                                   └── Yes
                                           │
                                           ▼
                              Is Identity Status "approved"?
                                   ├── No  ──► Lock to /identity-verification (Full-screen KYC)
                                   └── Yes
                                           │
                                           ▼
                              Has Completed Walkthrough?
                                   ├── No  ──► Redirect to /Walkthrough (3-step tour & upsell)
                                   └── Yes ──► Grant Access to /home (Dashboard & Marketplace)
```

---

## 5. Core Business Workflows

### 5.1. The 4-Step Onboarding Pipeline
1. **Profile Setup (`/onboarding/profile-setup`)**:
   - Captures Provider Name, Contact Phone, Company Name, Referral Code, and Professional Overview.
   - Embeds Google Maps Places Autocomplete to capture Street, City, State, Country, Zip Code, and GPS Coordinates (`[longitude, latitude]`).
   - Fetches platform categories from `/category`, allowing providers to select their trade categories. Enforces free tier limits via `ServiceLimitModal`.
   - Supports in-browser canvas image compression (`compressImageFileIfNeeded`) and draft preservation (`profile-setup-draft-storage.ts`).
2. **Business Documents (`/onboarding/business-documents`)**:
   - Accepts Business License, Tax Registration Certificate, Business Ownership Certificate, and Proof of Address.
   - Allows optional upload or skipping.
3. **Portfolio Showcase (`/onboarding/portfolio`)**:
   - Allows uploading up to 10 photos and videos.
   - Generates local object URL previews, supports video playback indicators, and allows individual removal before submission.
4. **Identity Card (`/onboarding/identity-card`)**:
   - Captures Front and Back sides of Government ID Card.
   - Upon upload, sets `identityStatus: "pending"` and routes to `/onboarding/id-submitted`.

### 5.2. Post-Onboarding Walkthrough (`/Walkthrough`)
Once onboarding documents are submitted, new providers are guided through a 3-step walkthrough:
- **Step 1 (`/Walkthrough`)**: 4-card interactive feature tour (Discover New Projects, Unlock Leads, Showcase Your Work, Manage Your Jobs).
- **Step 2 (`/Walkthrough/credit-plans`)**: Introduction to platform credits with an opportunity to buy Starter (100) or Advanced (500) credit packages.
- **Step 3 (`/Walkthrough/verified-badge`)**: Introduction to the Trusted Expert Badge subscription with option to subscribe or "Skip for Now" directly into `/home`.

### 5.3. Job Feed, Lead Unlocking & Purchase
- **Marketplace Feed (`/home`)**:
  - Live search with a 400ms debounce timer.
  - Filter by Category IDs, Radius (in miles from provider's selected address), and Job Type (`one-time` vs `recurring`).
  - Homeowner contact details (Phone, Email, Street Address) are strictly **masked**.
- **Lead Detail View (`/jobs/[id]`)**:
  - Displays job scope, scheduled timeline, category, and credit cost.
  - Clicking "Unlock Lead" triggers `useApplyJobMutation` calling `/job/:jobId/apply`.
  - Backend deducts provider credits, marks `hasApplied: true`, and immediately unmasks the homeowner's full name, direct phone number, email address, and Google Maps pin link.
- **My Jobs Tracking (`/my-jobs`)**:
  - Organizes unlocked leads into **Applied Jobs**, **Ongoing Jobs**, and **Completed Jobs** with full pagination and status tracking.

### 5.4. Address Management & Interactive Geocoding (`/profile-settings/addresses`)
- Providers can register multiple operating bases (e.g., Headquarters, Regional Warehouse, Secondary Branch).
- **Add & Edit Address Dialogs**:
  - Incorporates `AddressGoogleMapPicker` for visual pin dropping.
  - Incorporates `resolveAddressCoordinates` with fallback geocoding.
  - Allows marking an address as the default dispatch base (`/address/set-default/:id`).

### 5.5. Subscriptions, Promotions & Financial Ledger
- **Category Subscription (`/profile-settings/service-plan`)**:
  - Upgrades provider from base category limits to unlimited trade categories.
- **Trusted Expert Badge (`/profile-settings/verified-badge-plan`)**:
  - Awards verified checkmark badge across search feeds and homeowner recommendations.
- **Ad Promotion (`/profile-settings/ad-promotion`)**:
  - Enables providers to launch geo-targeted advertisement campaigns within a customized radius.
- **Transaction History (`/profile-settings/transaction-history`)**:
  - Full financial ledger of credit purchases, subscription renewals, and refunds with date range filters.

---

## 6. Audit & Technical Debt Inventory

During our exhaustive code review and build validation (`npm run build`), several non-blocking improvements and code hygiene observations were identified:

1. **Recharts SSR Warning**:
   - During static page generation of routes containing analytics charts, Recharts warns: `The width(-1) and height(-1) of chart should be greater than 0...`.
   - *Recommendation*: Ensure chart components wrap `ResponsiveContainer` inside client-only mounted guards or supply explicit numeric `minWidth` / `minHeight`.
2. **Missing `metadataBase` in Root Layout**:
   - Next.js logs a build warning: `metadataBase property in metadata export is not set for resolving social open graph or twitter images`.
   - *Recommendation*: Add `metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://provider.nexahomeapp.com")` in `src/app/layout.tsx`.
3. **Nested `<html>` and `<body>` in Admin Route Layout**:
   - `src/app/app/layout.tsx` renders its own `<html>` and `<body>` tags inside a nested App Router path.
   - *Recommendation*: In Next.js App Router, nested layouts should only render `<div>` containers; root HTML tags belong exclusively in `src/app/layout.tsx`.
4. **Hardcoded Disabled State on Credit Package Buy Button**:
   - In `src/app/credit-plans/_components/credit-plans-content.tsx` (line 119), the "Buy Now" button has `disabled={true}` hardcoded, preventing purchase of preset packages from this specific screen (custom package modal remains functional).
   - *Recommendation*: Connect the `disabled` property to package selection and mutation state: `disabled={!selectedPackage || checkoutMutation.isPending}`.
5. **Google Maps API Key Exposure**:
   - `src/app/onboarding/profile-setup/page.tsx` contains a direct fallback Google Maps API key string.
   - *Recommendation*: Centralize all Google Maps initialization through `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` via `src/lib/google-maps.ts`.

---

## 7. Developer Cheat Sheet & Common Tasks

### Quick Start Commands
```bash
# Start local development server (Turbopack)
npm run dev

# Run TypeScript type verification without compiling
npx tsc --noEmit

# Compile production bundle
npm run build

# Start production server
npm start
```

### Key File Reference
- **API Interceptor & Base URL**: [`src/lib/axios.ts`](file:///c:/Users/Muhammad%20Kamil%20Raza/Desktop/KamilRaza/Projects/NexaHome/Nexa-Home-Service-Provider/src/lib/axios.ts)
- **Central Route Guard**: [`src/routes/ProtectedRoutes.tsx`](file:///c:/Users/Muhammad%20Kamil%20Raza/Desktop/KamilRaza/Projects/NexaHome/Nexa-Home-Service-Provider/src/routes/ProtectedRoutes.tsx)
- **Onboarding Step Engine**: [`src/lib/onboarding-steps.ts`](file:///c:/Users/Muhammad%20Kamil%20Raza/Desktop/KamilRaza/Projects/NexaHome/Nexa-Home-Service-Provider/src/lib/onboarding-steps.ts)
- **Auth Session & Cookies**: [`src/lib/auth-session.ts`](file:///c:/Users/Muhammad%20Kamil%20Raza/Desktop/KamilRaza/Projects/NexaHome/Nexa-Home-Service-Provider/src/lib/auth-session.ts)
- **Redux Auth Slice**: [`src/store/slices/auth-slice.ts`](file:///c:/Users/Muhammad%20Kamil%20Raza/Desktop/KamilRaza/Projects/NexaHome/Nexa-Home-Service-Provider/src/store/slices/auth-slice.ts)
- **Job Marketplace Feed**: [`src/app/home/page.tsx`](file:///c:/Users/Muhammad%20Kamil%20Raza/Desktop/KamilRaza/Projects/NexaHome/Nexa-Home-Service-Provider/src/app/home/page.tsx)
- **Job Detail & Purchase**: [`src/components/jobs/job-detail-view.tsx`](file:///c:/Users/Muhammad%20Kamil%20Raza/Desktop/KamilRaza/Projects/NexaHome/Nexa-Home-Service-Provider/src/components/jobs/job-detail-view.tsx)
- **Address Editor Dialog**: [`src/app/profile-settings/addresses/_components/edit-address-dialog.tsx`](file:///c:/Users/Muhammad%20Kamil%20Raza/Desktop/KamilRaza/Projects/NexaHome/Nexa-Home-Service-Provider/src/app/profile-settings/addresses/_components/edit-address-dialog.tsx)
