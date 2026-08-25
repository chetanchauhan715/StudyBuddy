# 📚 StudyBuddy

<div align="center">

### A full-stack study productivity platform built to help students track their studies, stay consistent, and understand their progress.

Built with the **MERN Stack** and evolved through feedback from real users.

🌐 **Live Application:** https://studybuddypro.site

<br />

**React • Node.js • Express • MongoDB • PWA • Web Push • Razorpay**

</div>

---

## About StudyBuddy

StudyBuddy is a full-stack study productivity platform where students can organize subjects, record study sessions, track goals, analyze their study patterns, create reminders, and monitor their progress over time.

The project originally started as a way for me to practice full-stack development, but after deployment and feedback from real users, the way I approached the project started changing.

Instead of deciding every feature beforehand, newer versions of StudyBuddy are increasingly shaped by actual usage, user feedback, production problems, and reliability requirements.

The main focus of **V3** was turning StudyBuddy from a traditional web application into an **installable Progressive Web App (PWA)** after users repeatedly asked for an app-like experience.

That work introduced service workers, caching strategies, offline behaviour, Web Push notifications, custom reminders, production scheduling challenges, and several other engineering problems that don't normally appear while building a purely local project.

---

## What it does

- **Students create and manage subjects** that are later used while recording study sessions.

- **Study sessions record actual study activity**, including the subject, duration, date, and completion state.

- **The dashboard summarizes progress** through study hours, session counts, weekly activity, subject distribution, goals, streaks, and recent sessions.

- **Statistics provide deeper insights** into completion rate, average study duration, favorite subjects, weekly activity, and overall study patterns.

- **Weekly goals help students measure consistency** instead of looking only at total study time.

- **Custom reminders allow students to schedule study activities**, while Web Push notifications can notify them even when StudyBuddy is not actively open.

- **StudyBuddy can be installed as a PWA** on supported desktop and mobile devices without maintaining a separate native application.

- **Premium features provide additional study insights and analytics**, with authorization enforced by the backend.

- **Razorpay handles premium payments**, while payment verification and subscription fulfillment happen securely on the server.

- **A separate admin area provides application management tools** without exposing administrative functionality to normal users.

---

## Typical User Flow

```text
Create Account / Login
        ↓
Settings
        ↓
Add Subjects
        ↓
Study Sessions
        ↓
Create & Complete Sessions
        ↓
Dashboard / Statistics
        ↓
Set Weekly Goals
        ↓
Create Study Reminders
        ↓
Receive Push Notifications
        ↓
Track Progress Over Time
```

---

# Tech Stack

## Frontend

- **React**
- **Vite**
- **React Router**
- **Axios**
- **Recharts**
- **Lucide React**
- **React Hot Toast**
- **CSS**
- **Progressive Web App APIs**
- **Service Worker**
- **Cache API**
- **Push API**
- **Notifications API**

## Backend

- **Node.js**
- **Express.js**
- **MongoDB Atlas**
- **Mongoose**
- **JWT Authentication**
- **bcrypt**
- **Web Push**
- **VAPID Authentication**
- **Razorpay**
- **Resend Email API**
- **MongoDB Transactions**

## Infrastructure & Deployment

- **Frontend:** Netlify
- **Backend:** Render
- **Database:** MongoDB Atlas
- **Domain:** studybuddypro.site
- **Availability Monitoring:** UptimeRobot

---

# Architecture

StudyBuddy follows a straightforward MERN request flow:

```text
React UI
   ↓
Service Layer / Axios
   ↓
Express Route
   ↓
Authentication / Authorization Middleware
   ↓
Validation
   ↓
Controller
   ↓
Mongoose
   ↓
MongoDB Atlas
   ↓
JSON Response
   ↓
React UI
```

The frontend keeps API communication inside service modules instead of directly scattering Axios calls throughout components.

The backend separates routes, middleware, validators, controllers, models, schedulers, and configuration so responsibilities remain easier to reason about as the application grows.

---

## Frontend Structure

```text
FrontEnd/
│
├── public/
│   ├── icons/
│   ├── manifest.webmanifest
│   └── sw.js
│
└── src/
    ├── assets/
    ├── components/
    ├── context/
    ├── hooks/
    ├── layouts/
    ├── pages/
    ├── services/
    └── utils/
```

The application uses separate layouts for public, authenticated, and administrative areas.

Routes are lazy-loaded where appropriate, while shared application state such as the authenticated user is managed through React context.

Axios is configured centrally and automatically attaches the JWT token to authenticated requests.

---

## Backend Structure

```text
Backend/
│
├── config/
├── controllers/
├── middleware/
├── migrations/
├── models/
├── routes/
├── schedulers/
├── utils/
└── validators/
```

Routes primarily connect middleware, validation, and controllers.

Authentication and authorization decisions are enforced by backend middleware rather than relying on what the frontend chooses to display.

---

# Progressive Web App

The main engineering focus of **StudyBuddy V3** was converting the existing React application into a Progressive Web App.

This direction came directly from user feedback asking for a more app-like experience.

Rather than immediately maintaining a separate Android or iOS application, StudyBuddy uses capabilities already available on the web platform.

The PWA implementation currently includes:

- Web App Manifest
- Installable mobile/desktop experience
- Application icons
- Service Worker registration
- Cache API
- Same-origin asset caching
- API response caching
- Offline fallback behaviour
- Network-first page navigation
- Cache versioning
- Automatic old-cache cleanup
- Web Push support

---

## Caching Strategy

Different resources have different freshness requirements, so StudyBuddy does not use one caching strategy for every request.

### API Requests

API requests use a **network-first** approach:

```text
API Request
     ↓
Try Network
     ↓
Success
 ├── Return fresh response
 └── Update cached response

Network Failure
     ↓
Look in Cache
     ↓
Return cached response if available
```

This keeps application data fresh while still providing limited resilience when the network becomes unavailable.

### Page Navigation

Navigation requests also prefer the network:

```text
Page Navigation
      ↓
Try Network
      ↓
Latest deployed HTML
      ↓
Update Cache

Network unavailable
      ↓
Cached page
      ↓
Root-page fallback
```

This decision became important after an installed PWA continued serving an older cached version of the frontend after a new deployment.

Using network-first navigation allows installed applications to receive the latest deployed HTML while preserving an offline fallback.

---

# Reminders & Web Push Notifications

StudyBuddy allows users to create custom study reminders.

A simplified reminder flow looks like:

```text
User Creates Reminder
        ↓
Reminder Stored in MongoDB
        ↓
Backend Scheduler Checks Due Reminders
        ↓
User Push Subscription Retrieved
        ↓
Web Push Sent
        ↓
Service Worker Receives Push Event
        ↓
System Notification Displayed
```

Push subscriptions are stored on the backend and invalid subscriptions can be removed when the push provider reports that they are no longer usable.

The implementation required working with:

- Browser notification permissions
- Push subscriptions
- Service Workers
- VAPID public/private keys
- Web Push
- Backend scheduling
- Expired subscriptions
- Cross-browser behaviour

This became one of the more challenging parts of V3 because it crosses several boundaries between the browser, frontend, backend, operating system notification service, and deployment infrastructure.

---

# Production Reliability

Running reminders in production exposed an infrastructure problem that was invisible during local development.

The reminder scheduler currently runs inside the Node.js backend process.

On infrastructure that can sleep after a period of inactivity:

```text
Backend Sleeps
      ↓
Node Process Stops Running
      ↓
Reminder Scheduler Stops Running
      ↓
Scheduled Reminder Can Be Delayed
```

As an interim reliability measure, StudyBuddy exposes a lightweight health endpoint:

```http
GET /health
```

The endpoint is monitored externally using **UptimeRobot**.

This currently provides two benefits:

1. Basic backend availability monitoring.
2. Regular inbound traffic while using early-stage infrastructure.

A dedicated background-worker/job architecture is a future improvement as usage and infrastructure requirements grow.

---

# Payments & Premium

StudyBuddy includes optional premium functionality backed by Razorpay.

The frontend never decides whether a payment succeeded or whether a user should receive premium access.

A simplified payment flow is:

```text
User Selects Plan
        ↓
Frontend Requests Order
        ↓
Backend Resolves Trusted Price
        ↓
Razorpay Order Created
        ↓
Checkout
        ↓
Payment Captured
        ↓
Frontend Verification / Razorpay Webhook
        ↓
Backend Verification
        ↓
Subscription Fulfillment
```

The payment implementation includes:

- Server-controlled pricing
- Razorpay order creation
- Checkout signature verification
- Webhook signature verification
- Payment status verification
- Order ID validation
- Amount validation
- Currency validation
- MongoDB transactions
- Existing-subscription extension
- Failed-payment handling
- Duplicate-event protection
- Idempotent subscription fulfillment

---

## Idempotent Fulfillment

Payment systems cannot assume that an event will arrive exactly once.

For example:

```text
Payment Captured
      ↓
Razorpay Webhook ──────┐
                       │
Browser Verification ──┤
                       ↓
              Same Fulfillment Logic
                       ↓
             Premium Applied Once
```

The payment record tracks whether the subscription has already been applied.

```text
subscriptionApplied = true
```

If a webhook fulfills the payment first, a later browser verification does not extend the subscription again.

Likewise, webhook retries cannot repeatedly grant premium for the same payment.

---

## Transactional Payment Updates

A successful payment changes more than one database document.

StudyBuddy needs to update:

```text
Payment Record
      +
User Subscription
```

These writes run inside a MongoDB transaction so they either succeed together or fail together.

This avoids inconsistent states such as:

```text
Payment = Successful
User    = Free
```

or:

```text
Payment = Pending
User    = Premium
```

---

# Authentication & Authorization

StudyBuddy currently supports:

- User registration
- Login
- JWT authentication
- Protected routes
- Logout
- Forgot password
- Password reset
- Password update
- Profile management
- Role-based administrative access
- Premium authorization

Authenticated frontend requests automatically include:

```http
Authorization: Bearer <token>
```

The backend verifies the token before allowing access to protected resources.

Premium access is also enforced on the backend.

The frontend may hide or lock premium UI for usability, but it is never considered the security boundary.

---

# Subject Management

Users can:

- Create subjects
- Edit subjects
- Delete subjects

Subjects form the foundation for study-session tracking.

A user first creates the subjects they study and then selects those subjects while creating sessions.

---

# Study Sessions

Users can:

- Create study sessions
- Edit sessions
- Delete sessions
- Mark/track session status
- Search sessions
- Filter by subject
- Filter by status
- Sort sessions
- Paginate session history

Session data is later used by the dashboard and statistics systems to generate study insights.

---

# Dashboard

The dashboard currently includes:

- Total study sessions
- Total study hours
- Completed sessions
- Pending sessions
- Recent sessions
- Weekly study activity
- Subject distribution
- Daily goal progress
- Study streak
- User study overview

Additional premium insights provide more detailed study analysis.

---

# Statistics

StudyBuddy statistics include information such as:

- Completion rate
- Average session duration
- Favorite subject
- Total study activity
- Weekly study patterns
- Subject distribution
- Streak information

Additional analytics are available as part of the premium feature set.

---

# Weekly Goals

Students can define weekly study goals and compare their actual study activity against those goals.

Rather than looking only at lifetime totals, weekly goals provide a shorter feedback loop for consistency.

```text
Weekly Goal
     ↓
Study Sessions
     ↓
Accumulated Study Time
     ↓
Progress Toward Goal
```

---

# Notifications

StudyBuddy also maintains in-app notifications alongside system-level Web Push notifications.

This allows application events and announcements to remain visible inside the product instead of relying exclusively on temporary operating-system notifications.

---

# Admin Area

StudyBuddy contains a separate administrative area with protected admin routes.

Current administrative functionality includes:

- Admin dashboard
- User management
- Application announcements
- User-level monitoring and management

Administrative authorization is verified by the backend rather than relying only on frontend route protection.

---

# API Overview

| Area | Purpose |
|---|---|
| Authentication | Registration, login, password recovery and account authentication |
| Dashboard | Study summaries, goals, streaks and dashboard analytics |
| Study Sessions | Session creation, editing, deletion, filtering and tracking |
| Subjects | Subject management |
| Statistics | Study analytics and progress information |
| Profile | User account and profile management |
| Reminders | Reminder creation and management |
| Notifications | In-app notification management |
| Push | Push subscriptions and Web Push functionality |
| Payments | Razorpay order creation, verification and webhook processing |
| Premium | Protected premium insights and analytics |
| Admin | Administrative functionality |

Protected endpoints pass through authentication middleware before reaching their controllers.

Premium and administrative endpoints apply additional authorization checks.

---

# Notable Engineering Decisions

## PWA instead of maintaining a second application

The request for an app-like experience came from existing users.

Rather than immediately creating a separate native application and maintaining two clients, StudyBuddy uses Progressive Web App capabilities to provide installation, caching, offline behaviour, and notifications from the existing React application.

---

## Backend-authoritative premium access

UI restrictions are useful for user experience but are not security.

StudyBuddy verifies premium status against the database on protected backend requests.

A user modifying frontend JavaScript or manually calling an endpoint therefore cannot grant themselves premium access.

---

## Pricing is controlled by the backend

The frontend sends the selected plan rather than a trusted payment amount.

The backend resolves the corresponding price from its own configuration before creating the Razorpay order.

This prevents the client from deciding how much a premium subscription costs.

---

## Payment fulfillment is shared

Browser verification and Razorpay webhooks do not contain separate implementations for granting premium.

Both eventually use the same internal fulfillment logic.

This reduces the chance that one payment path behaves differently from another.

---

## Payment fulfillment is idempotent

A successful payment must affect the subscription exactly once.

StudyBuddy records whether fulfillment has already occurred and safely handles repeated verification/webhook events.

---

## Payment + subscription writes use transactions

Payment state and subscription state belong to the same logical operation.

MongoDB transactions prevent a failure halfway through fulfillment from leaving the two documents inconsistent.

---

## Different resources use different caching strategies

StudyBuddy originally used cache-first behaviour broadly for same-origin requests.

Production testing exposed the downside: an installed PWA could continue receiving stale navigation HTML after a new deployment.

Navigation was therefore changed to network-first while preserving cached fallback behaviour.

This is an example of the caching strategy being changed based on observed production behaviour rather than treating offline support as a one-time configuration task.

---

## Production problems are treated differently from local bugs

Several V3 problems only became visible after deployment:

- Browser-specific Web Push behaviour
- VAPID configuration
- Service Worker cache invalidation
- Installed PWA update behaviour
- Environment configuration
- Backend sleep affecting scheduled work
- Payment webhook behaviour
- Production payment verification

These issues influenced the architecture and operational setup of StudyBuddy beyond the original feature implementation.

---

# Getting Started

## Prerequisites

Before running StudyBuddy locally, you will need:

- Node.js
- npm
- MongoDB database
- Resend account/API key
- Razorpay account for payment functionality
- VAPID key pair for Web Push

---

## Clone the Repository

```bash
git clone https://github.com/chetanchauhan715/StudyBuddy.git
cd StudyBuddy
```

---

## Backend Setup

```bash
cd Backend
npm install
npm start
```

Create a `.env` file inside `Backend/`.

Example:

```env
PORT=3000

MONGO_URI=
JWT_SECRET=

CLIENT_URL=

RESEND_API_KEY=

RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=

VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
VAPID_SUBJECT=
```

Never commit real environment credentials to the repository.

---

## Frontend Setup

```bash
cd FrontEnd
npm install
npm run dev
```

Create a `.env` file inside `FrontEnd/`.

Example:

```env
VITE_API_URL=http://localhost:3000
VITE_RAZORPAY_KEY_ID=
```

`VITE_RAZORPAY_KEY_ID` is a public checkout identifier.

The Razorpay **Key Secret** and **Webhook Secret** must remain exclusively on the backend.

---

# Screenshots

> 

### Landing Page

<img width="1327" height="640" alt="image" src="https://github.com/user-attachments/assets/3ff36864-0e4f-488b-94f2-60d89d337e08" />


### Dashboard

<img width="1333" height="637" alt="image" src="https://github.com/user-attachments/assets/20f721fc-7ba4-4586-af87-2c619e817750" />


### Study Sessions

<img width="1331" height="648" alt="image" src="https://github.com/user-attachments/assets/70616186-034b-422d-8de2-dc4f6042ba08" />


### Statistics

<img width="1320" height="610" alt="image" src="https://github.com/user-attachments/assets/c4e7d6f4-c98f-474a-9ea8-4759c9cb4186" />
<img width="1047" height="534" alt="image" src="https://github.com/user-attachments/assets/f005685f-89cd-4bfb-86f8-67f1e20aa64e" />


### Installed PWA

<img width="720" height="1600" alt="image" src="https://github.com/user-attachments/assets/f5843ce0-0306-446e-9500-1907bd5d0b6f" />


### Reminders & Notifications

<img width="1330" height="642" alt="image" src="https://github.com/user-attachments/assets/c78071b3-d1f6-4b90-83c0-f7d977f000c8" />




---

# Version History

## V1 — Foundation

The first version established the basic StudyBuddy idea and study-session tracking foundation.

Core work included:

- Study-session tracking
- Basic CRUD operations
- Initial frontend/backend structure

---

## V2 — Full-Stack Product Foundation

V2 expanded StudyBuddy into a deployed full-stack application.

Major additions included:

- Authentication
- Password recovery
- Dashboard
- Statistics
- Subject management
- Profile management
- Responsive UI
- Production deployment
- User-facing polish

After V2 reached users, their feedback began influencing the direction of future releases.

---

## V3 — PWA & Production Evolution

**Current production version**

The primary goal of V3 was turning StudyBuddy into an installable Progressive Web App based on user feedback.

Major work included:

- Progressive Web App support
- Installable mobile/desktop experience
- Service Worker
- Cache API
- Offline resilience
- Improved cache-update strategy
- Web Push notifications
- Custom study reminders
- Weekly study goals
- Improved study analytics
- Premium study insights
- Razorpay payment integration
- Safer payment fulfillment
- Admin improvements
- Production monitoring
- Reliability improvements
- Mobile and UI polish

---

# Roadmap

StudyBuddy's roadmap is increasingly driven by real usage and feedback rather than adding features only because they look interesting on a project checklist.

Areas currently being considered for future versions include:

- Improved first-time onboarding
- Easier subject creation during first-session setup
- More reliable background reminder infrastructure
- Additional PWA improvements
- Better mobile experience
- Improved feedback collection
- Deeper study analytics
- More productivity-focused features
- Continued admin improvements
- V4 features based on user behaviour and feedback

---

# Known Trade-offs

These are current engineering decisions/limitations that are understood and can be revisited as StudyBuddy grows.

- **Reminder scheduling currently runs inside the web-server process.** A dedicated background worker or job queue would provide stronger scheduling guarantees as usage grows.

- **The current backend infrastructure can become inactive during idle periods.** External health monitoring is being used as an interim solution while StudyBuddy remains at its current scale.

- **PWA caching requires explicit cache/version management.** This adds complexity compared with a traditional always-online SPA, but enables offline resilience and an installable experience.

- **Premium plans currently use payment-based subscription periods rather than automatic recurring subscription billing.**

- **Authentication currently uses client-stored JWT authentication rather than a short-lived access-token + refresh-token/session architecture.**

- **Automated test coverage is still limited.** Releases currently rely heavily on manual testing and production smoke tests, making automated coverage an important future engineering improvement.

These trade-offs are intentionally documented rather than presenting the application as having solved infrastructure requirements it has not yet reached.

---

# Production

<div align="center">

### 🌐 Live Application

**https://studybuddypro.site**

### ⚙️ Backend

**https://api.studybuddypro.site**

</div>

---

# Author

<div align="center">

## Chetan Chauhan

**Full-Stack Developer | MERN Stack**

[GitHub](https://github.com/chetanchauhan715) • [LinkedIn](https://www.linkedin.com/in/chetan-chauhan-879746231/)

</div>

---

# License

© 2026 Chetan Chauhan. All rights reserved.

StudyBuddy is maintained as the official application by the author.

The source code is publicly available for demonstration, learning, and educational purposes.

Unauthorized commercial redistribution, resale, or rebranding of StudyBuddy is not permitted.

---

<div align="center">

### Built with ❤️ by Chetan Chauhan

**StudyBuddy — Learn. Track. Improve.**

</div>
