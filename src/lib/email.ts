import nodemailer from "nodemailer";

export const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export function emailConfigured() {
  return Boolean(process.env.SMTP_URL && process.env.ADMIN_EMAIL);
}

/** Sends via SMTP. Throws if not configured or if the provider rejects. */
export async function sendMail(opts: { to: string; subject: string; text: string; html: string; replyTo?: string }) {
  const url = process.env.SMTP_URL;
  if (!url) throw new Error("SMTP not configured");
  const transporter = nodemailer.createTransport(url);
  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.ADMIN_EMAIL,
    ...opts,
  });
  if (!info.accepted || info.accepted.length === 0) throw new Error("Mail not accepted");
}

/** Builds a simple key/value email body in text + html. */
export function rows(data: [string, string][]) {
  const text = data.map(([k, v]) => `${k}: ${v}`).join("\n");
  const html =
    `<table cellpadding="6" style="font-family:Arial,sans-serif;font-size:14px">` +
    data.map(([k, v]) => `<tr><td><b>${escapeHtml(k)}</b></td><td style="white-space:pre-wrap">${escapeHtml(v)}</td></tr>`).join("") +
    `</table>`;
  return { text, html };
}
