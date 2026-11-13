# Serampore Rooms

A student-first room renting and room finding app for Serampore, West Bengal.
Built with Next.js, TypeScript, and Tailwind CSS. Listings are stored in a
Google Sheet through a small Google Apps Script API.

## What is included

- Home page with a locality/budget/room-type search
- Browse page with keyword, area, room type, gender, furnishing, budget, and sort filters
- Individual room pages with photo gallery, amenities, map, and owner contact
- Three-step "List your room" flow with validation and moderation queue
- WhatsApp and call buttons, saved rooms in local storage, and native sharing
- Responsive, student-focused design
- Ten student-shared hostel and PG leads from the uploaded directory, used when Google Sheets is not configured
- Google Apps Script backend with token-protected writes and formula-injection protection

## Tech stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- Lucide icons
- Google Sheets + Apps Script (no database required)

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

The app works immediately with ten student-shared hostel and PG leads. New
listing submissions require the Google Sheet connection described below.

Useful commands:

```bash
npm run typecheck
npm run lint
npm run build
npm run start
```

## Connect Google Sheets

### 1. Create the sheet

Create a Google Sheet. Give it a name like `Serampore Rooms`.

### 2. Add the Apps Script

1. In the sheet, open **Extensions → Apps Script**.
2. Delete the placeholder code.
3. Paste the contents of [`google-sheets/apps-script.gs`](google-sheets/apps-script.gs).
4. Replace `PASTE_A_LONG_RANDOM_SECRET_HERE` with a long random value. Keep it private.
5. Save the project.

### 3. Set up the columns

In the Apps Script editor, select `setupSheet` from the function dropdown and
click **Run** once. Approve the permissions Google asks for.

This creates a `Listings` tab with the correct headers, text formats, and a
status dropdown (`pending`, `active`, `hidden`).

### 4. Deploy the web app

1. Click **Deploy → New deployment**.
2. Choose **Web app** as the type.
3. Set **Execute as** to **Me**.
4. Set **Who has access** to **Anyone**.
5. Deploy and copy the URL ending in `/exec`.

When changing the script later, create a new deployment version or update the
existing deployment so the live URL receives the changes.

### 5. Configure the Next.js app

Create `.env.local` in the project root:

```env
GOOGLE_SHEETS_WEB_APP_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
GOOGLE_SHEETS_WRITE_TOKEN=the-same-long-random-secret
NEXT_PUBLIC_CONTACT_EMAIL=hello@seramporerooms.in
```

Restart the dev server. The home page and browse page now read from the sheet.
New submissions are appended with status `pending`.

### 6. Publish a submitted room

Open the `Listings` tab and change the room's `status` to `active`. Only active
rows are returned by the public API. Use `hidden` to remove a room without
deleting the row.

## Sheet schema

The first row must contain these headers:

| Column | Field | Notes |
| --- | --- | --- |
| A | `id` | Unique listing ID, for example `SER-1042` |
| B | `title` | Listing headline |
| C | `area` | One of the Serampore localities in `lib/constants.ts` |
| D | `address` | Public address or landmark |
| E | `rent` | Monthly rent in INR, number only |
| F | `deposit` | Security deposit in INR, number only |
| G | `roomType` | `single`, `shared`, `pg`, or `1bhk` |
| H | `gender` | `girls`, `boys`, or `coed` |
| I | `furnishing` | `unfurnished`, `semi-furnished`, or `furnished` |
| J | `availableFrom` | `YYYY-MM-DD` or `Immediately` |
| K | `description` | Long description; line breaks are preserved |
| L | `amenities` | Pipe-separated, for example `WiFi \| Geyser \| Bed` |
| M | `images` | Pipe-separated image URLs |
| N | `ownerName` | Public contact name |
| O | `whatsapp` | Digits with country code, for example `919830000000` |
| P | `phone` | Optional call number |
| Q | `mapQuery` | Address or landmark used for Google Maps |
| R | `verified` | `TRUE` or `FALSE` |
| S | `featured` | `TRUE` or `FALSE` |
| T | `status` | `pending`, `active`, or `hidden` |
| U | `createdAt` | ISO date |
| V | `source` | `owner` or `student-directory` |

To add a room manually, fill a row and set `status` to `active`. `verified` and
`featured` control the badges and ordering. `source` controls the student-tip
label and source disclosure. `images` can contain up to four direct image URLs.

## Import the hostel and PG directory

The file [`google-sheets/hostel-pg-listings.csv`](google-sheets/hostel-pg-listings.csv)
contains the ten consolidated leads extracted from the uploaded student
directory PDF. It already uses the current sheet headers.

1. Create the `Listings` tab and run `setupSheet`.
2. In Google Sheets, choose **File → Import → Upload** and select the CSV.
3. Choose **Replace data at selected cell**, then place it at `A1`.
4. Set each row's `status` to `active` when you are ready to publish it.
5. Run the Apps Script deployment again so its new `source` column is included.

The directory rows use `source = student-directory`. The site labels these as
student tips, keeps illustrative photos, and asks visitors to confirm rent,
availability, and facilities directly.

### Images

Use direct image URLs (for example an Unsplash image URL or a public image from
your own site). A normal Google Drive sharing link usually will not render as an
image. If you use Drive, make sure the file is public and convert the link to a
direct image URL first.

## API

### `GET /api/listings`

Returns public listings with optional query parameters:

```text
?q=college&area=Chatra&roomType=single&gender=girls&maxRent=6000&sort=price-low
```

### `POST /api/listings`

Accepts the listing form payload and writes to the Google Sheet. Field validation,
a honeypot, and a basic in-memory rate limit are included. Submissions are created
as `pending` and require manual approval in the sheet.

The write route is disabled with a clear error until both Google Sheets
environment variables are present.

## Deploy

Deploy to Vercel (or any Next.js host) and add the same environment variables in
the project settings. The Google Apps Script web app must remain deployed with
access set to **Anyone** so the server can read and write.

Because writes happen through the Apps Script URL, the Google Sheet does not need
public edit access. Keep the write token in server-side environment variables
only. Never prefix it with `NEXT_PUBLIC_`.

## Project structure

```text
app/
  api/listings/route.ts     Listing read + submission API
  list-room/page.tsx        Owner listing page
  rooms/page.tsx            Search and filters
  rooms/[id]/page.tsx       Room detail page
components/                 Shared UI, forms, gallery
lib/
  demo-listings.ts          Seed data and fallback images
  google-sheets.ts          Sheet read/write client
  listings.ts               Filtering and data access
  validation.ts             Shared form/API validation
google-sheets/
  apps-script.gs            Google Sheet backend
```

## Before going live

- Replace the placeholder contact email in `.env.local`.
- Review the student-shared leads in `lib/demo-listings.ts`, or import the CSV
  and connect the sheet.
- Set `GOOGLE_SHEETS_WRITE_TOKEN` to a strong random secret.
- Approve listings manually by setting `status` to `active`.
- Add a privacy policy and terms page if you collect real user data publicly.
- Keep the safety guidance visible: students should always visit a room before
  paying a deposit.
