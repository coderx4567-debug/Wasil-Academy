# Wasil Academy — Website

A static, beginner-friendly website for Wasil Academy (Online Quran Learning Academy), built with plain HTML, CSS and JavaScript — no build tools, no frameworks.

## 1. Project structure

```
wasil-academy/
│
├── index.html              # The entire site (one page, anchor-linked sections)
├── css/
│   └── style.css           # All styling
├── js/
│   └── script.js           # Navigation, accordion, modal, form handling
├── assets/
│   ├── images/              # Put real academy/course photos here
│   └── icons/
│       └── favicon.svg
├── api/
│   └── contact.js          # Vercel serverless function for the contact form
├── README.md
└── .gitignore
```

Placeholders throughout the site are marked with `[REPLACE THIS]`, `[ADD ...]`, or `[CONFIRM ...]` — search the HTML for these before publishing.

## 2. How to open it locally

No build step is needed.

1. Download or clone the project folder.
2. Double-click `index.html`, or right-click → "Open with" your browser.
3. For the contact form to work locally, you'll need a local server that can run `api/contact.js` (see the Vercel CLI note below) — the rest of the site works by simply opening the file.

## 3. How to upload to GitHub

1. Create a new repository on GitHub (e.g. `wasil-academy`).
2. In the project folder, run:
   ```
   git init
   git add .
   git commit -m "Initial website"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/wasil-academy.git
   git push -u origin main
   ```

## 4. How to deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in (you can use your GitHub account).
2. Click **Add New → Project**, then select your `wasil-academy` GitHub repository.
3. Vercel will detect it as a static project automatically — no build command is required. Click **Deploy**.
4. Once deployed, Vercel gives you a live URL (e.g. `wasil-academy.vercel.app`).

## 5. How to configure environment variables

The contact form needs one environment variable: `CONTACT_EMAIL` — the private address where enrollment inquiries should be reviewed (e.g. in your email provider's dashboard, not sent directly, see below).

1. In your Vercel project, go to **Settings → Environment Variables**.
2. Add:
   - **Name:** `CONTACT_EMAIL`
   - **Value:** your real destination email address
   - **Environment:** Production (and Preview, if you want form testing on preview deployments)
3. Redeploy the project so the variable takes effect.

**Never** put this email address directly into `index.html`, `style.css`, `script.js`, or any file inside `assets/` — it should only ever live in this environment variable.

## 6. How to connect the contact form

`api/contact.js` is a Vercel serverless function. It:
- Validates required fields (name, email, course) server-side
- Rejects submissions that fill in the hidden honeypot field (basic spam protection)
- Applies a simple rate limit per IP address
- Reads the destination address from `process.env.CONTACT_EMAIL`

**It does not send email on its own** — sending email from a server requires an email provider (Resend, Postmark, SendGrid, etc., most of which have a free tier). Inside `api/contact.js`, you'll find a commented-out example using [Resend](https://resend.com):

1. Sign up for an email provider and get an API key.
2. Add that key as another environment variable (e.g. `RESEND_API_KEY`) in Vercel.
3. Install the provider's SDK (e.g. `npm install resend`) and uncomment/adjust the example block in `api/contact.js`.
4. Redeploy.

Until this is connected, submissions are validated and logged on the server but not emailed anywhere — check your Vercel function logs to confirm submissions are arriving while you finish setup.

## 7. How to replace course images

Course sections currently use styled placeholder boxes (dashed border, "UPLOAD REAL IMAGE HERE") instead of stock photos, so nothing fake is shown to visitors. To add real images:

1. Add your image files to `assets/images/` (e.g. `course-tajweed.jpg`).
2. In `index.html`, find the relevant `.media-placeholder` `<div>` and replace its contents with:
   ```html
   <img src="assets/images/course-tajweed.jpg" alt="Describe the image" loading="lazy">
   ```
3. Remove the placeholder SVG/text once a real image is in place.

## 8. How to add teacher profiles

In `index.html`, find the `<!-- ============ TEACHERS ============ -->` section. Each `.teacher-card` has:
- A photo placeholder (`.media-placeholder.teacher-photo`) — replace with a real `<img>` as above
- `[Teacher Name]`, `[Qualifications]`, `[Subjects / Courses]`, `[Short introduction]` — replace each bracketed placeholder with real, verified information

Copy the whole `.teacher-card` block to add more teachers.

## 9. How to add testimonials

The `.testimonials` section currently shows: *"Genuine testimonials will be added here."* Only add real, permission-given testimonials. A simple pattern once you have them:

```html
<blockquote class="testimonial-card">
  <p>"Real quote from a real parent or student."</p>
  <cite>— First name, course</cite>
</blockquote>
```
Style `.testimonial-card` in `style.css` to match the rest of the site, and remove the placeholder paragraph.

## 10. How to change social links

In `index.html`, search for `[ADD INSTAGRAM URL]` and `[ADD FACEBOOK URL]` in the footer. Replace the `href` and visible text with your real profile URLs, e.g.:
```html
<a href="https://instagram.com/yourhandle">Instagram</a>
```
Only add accounts that actually exist and belong to the academy.

## 11. How to edit academy information

All visible text lives directly in `index.html` — there's no CMS or database. Use your browser's search (Ctrl/Cmd+F on the file) to find the section you want (About, FAQ, Why Wasil Academy, etc.) and edit the text directly between the HTML tags.

## 12. How to add new courses

1. Copy an existing `.course-card` block inside the `<!-- ============ COURSES ============ -->` section, update its number, title, description, "suitable for" and "key areas" text, and give it a unique `data-course="your-course-id"`.
2. In `js/script.js`, add a matching entry to the `courseData` object with the same key (`your-course-id`) so "Learn More" opens the right details.

## 13. How to connect a custom domain

1. In your Vercel project, go to **Settings → Domains**.
2. Add your domain (e.g. `wasilacademy.com`).
3. Vercel will show you DNS records to add at your domain registrar (usually an `A` record or `CNAME`).
4. Once DNS propagates, Vercel automatically issues an SSL certificate.
5. Update the `[YOUR WEBSITE URL]` placeholders in `index.html` (canonical tag, Open Graph tags, structured data) with your real domain.

---

**Before publishing:** search the project for `[REPLACE THIS]`, `[ADD`, `[CONFIRM`, and `TEACHER PHOTO` / `UPLOAD REAL IMAGE HERE` to make sure every placeholder has been reviewed and replaced with real, accurate academy information.
