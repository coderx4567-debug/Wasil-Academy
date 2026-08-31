// api/contact.js
// Vercel serverless function — handles the contact/enrollment form.
//
// IMPORTANT: the destination email lives ONLY in the CONTACT_EMAIL
// environment variable (set in your Vercel project settings). It is
// never written into any frontend file, so it is never visible to
// site visitors.
//
// This function does not send email by itself — sending email from a
// server requires a mail provider (e.g. Resend, Postmark, SendGrid).
// The code below validates the submission, protects against spam,
// and shows you exactly where to plug in your provider's API call.

const submissionLog = new Map(); // simple in-memory rate limit (resets on cold start)
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX = 3;

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function getClientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.socket && req.socket.remoteAddress ? req.socket.remoteAddress : "unknown";
}

function isRateLimited(ip) {
  const now = Date.now();
  const entry = submissionLog.get(ip) || { count: 0, windowStart: now };

  if (now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    entry.count = 0;
    entry.windowStart = now;
  }

  entry.count += 1;
  submissionLog.set(ip, entry);

  return entry.count > RATE_LIMIT_MAX;
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed." });
    return;
  }

  try {
    const ip = getClientIp(req);
    if (isRateLimited(ip)) {
      res.status(429).json({ message: "Too many requests. Please try again shortly." });
      return;
    }

    const body = req.body || {};
    const { name, email, phone, age, course, schedule, message, company } = body;

    // Honeypot: real visitors never fill this hidden field in.
    if (company) {
      // Silently accept so bots don't learn their submission was rejected.
      res.status(200).json({ message: "Thank you! Your inquiry has been received. We'll get back to you soon." });
      return;
    }

    // Required field validation.
    if (!name || typeof name !== "string" || !name.trim()) {
      res.status(400).json({ message: "Please provide your name." });
      return;
    }
    if (!email || typeof email !== "string" || !isValidEmail(email.trim())) {
      res.status(400).json({ message: "Please provide a valid email address." });
      return;
    }
    if (!course || typeof course !== "string" || !course.trim()) {
      res.status(400).json({ message: "Please select a course." });
      return;
    }

    const destinationEmail = process.env.CONTACT_EMAIL;
    if (!destinationEmail) {
      // Server misconfiguration — never leak this detail to the client.
      console.error("CONTACT_EMAIL environment variable is not set.");
      res.status(500).json({ message: "Something went wrong. Please try again." });
      return;
    }

    // ---------------------------------------------------------------
    // PLUG IN YOUR EMAIL PROVIDER HERE.
    // Example using Resend (https://resend.com):
    //
    // const { Resend } = require("resend");
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: "Wasil Academy Website <no-reply@yourdomain.com>",
    //   to: destinationEmail,
    //   subject: `New enrollment inquiry — ${name}`,
    //   text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || "-"}\n` +
    //         `Student age: ${age || "-"}\nCourse: ${course}\n` +
    //         `Preferred schedule: ${schedule || "-"}\nMessage: ${message || "-"}`
    // });
    // ---------------------------------------------------------------

    console.log("New enrollment inquiry received for course:", course);

    res.status(200).json({ message: "Thank you! Your inquiry has been received. We'll get back to you soon." });
  } catch (err) {
    console.error("Contact form error:", err);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
};
