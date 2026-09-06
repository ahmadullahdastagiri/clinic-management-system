import { existsSync } from "node:fs";

import puppeteer from "puppeteer";

const getChromeExecutablePath = () =>
  process.env.PUPPETEER_EXECUTABLE_PATH ||
  [
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
  ].find((path) => existsSync(path));

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const formatDate = (value) => {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
  }).format(new Date(value));
};

const formatAmount = (value, currency = "AFN") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(Number(value) || 0);

const getPatientName = (patient) => {
  if (!patient) return "—";
  return [patient.firstName, patient.lastName].filter(Boolean).join(" ") || "—";
};

const renderItems = (items = [], currency) =>
  items
    .map(
      (item, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>${escapeHtml(item.description || item.type || "Item")}</td>
          <td>${escapeHtml(item.type || "—")}</td>
          <td class="number">${escapeHtml(item.quantity)}</td>
          <td class="number">${formatAmount(item.unitPrice, currency)}</td>
          <td class="number">${formatAmount(item.amount, currency)}</td>
        </tr>`,
    )
    .join("");

const renderInvoiceHtml = (invoice) => {
  const currency = invoice.currency || "AFN";
  const patientName = getPatientName(invoice.patientId);

  return `<!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>Invoice ${escapeHtml(invoice.invoiceNumber || "")}</title>
        <style>
          * { box-sizing: border-box; }
          body { margin: 0; color: #1f2937; font: 14px Arial, sans-serif; }
          .page { padding: 36px; }
          .header { display: flex; justify-content: space-between; border-bottom: 3px solid #2563eb; padding-bottom: 20px; }
          h1 { color: #2563eb; font-size: 28px; margin: 0 0 8px; }
          h2 { font-size: 18px; margin: 0 0 8px; }
          p { margin: 4px 0; }
          .muted { color: #6b7280; }
          .details { display: flex; justify-content: space-between; gap: 24px; margin: 28px 0; }
          .details > div { flex: 1; }
          table { border-collapse: collapse; width: 100%; }
          th { background: #eff6ff; color: #1d4ed8; text-align: left; }
          th, td { border-bottom: 1px solid #dbe3ef; padding: 10px 8px; }
          .number { text-align: right; }
          .summary { margin: 22px 0 0 auto; width: 280px; }
          .summary div { display: flex; justify-content: space-between; padding: 6px 0; }
          .summary .total { border-top: 2px solid #2563eb; font-size: 17px; font-weight: bold; padding-top: 10px; }
          .notes { background: #f9fafb; margin-top: 28px; padding: 14px; }
          .footer { border-top: 1px solid #dbe3ef; color: #6b7280; margin-top: 40px; padding-top: 12px; text-align: center; }
        </style>
      </head>
      <body>
        <main class="page">
          <header class="header">
            <div>
              <h1>INVOICE</h1>
              <p class="muted">${escapeHtml(invoice.invoiceNumber || "—")}</p>
            </div>
            <div>
              <p><strong>Status:</strong> ${escapeHtml(invoice.status || "draft")}</p>
              <p><strong>Issued:</strong> ${formatDate(invoice.issuedAt || invoice.createdAt)}</p>
              <p><strong>Due:</strong> ${formatDate(invoice.dueDate)}</p>
            </div>
          </header>

          <section class="details">
            <div>
              <h2>Bill to</h2>
              <p>${escapeHtml(patientName)}</p>
              <p>${escapeHtml(invoice.patientId?.patientCode || "")}</p>
              <p>${escapeHtml(invoice.patientId?.phone || "")}</p>
            </div>
            <div>
              <h2>Invoice details</h2>
              <p><strong>Currency:</strong> ${escapeHtml(currency)}</p>
              <p><strong>Appointment:</strong> ${escapeHtml(invoice.appointmentId?.appointmentCode || "—")}</p>
            </div>
          </section>

          <table>
            <thead>
              <tr><th>#</th><th>Description</th><th>Type</th><th class="number">Qty</th><th class="number">Unit price</th><th class="number">Amount</th></tr>
            </thead>
            <tbody>${renderItems(invoice.items, currency)}</tbody>
          </table>

          <section class="summary">
            <div><span>Subtotal</span><span>${formatAmount(invoice.subtotal, currency)}</span></div>
            <div><span>Discount</span><span>${formatAmount(invoice.discount, currency)}</span></div>
            <div><span>Tax</span><span>${formatAmount(invoice.tax, currency)}</span></div>
            <div class="total"><span>Total</span><span>${formatAmount(invoice.totalAmount, currency)}</span></div>
            <div><span>Paid</span><span>${formatAmount(invoice.paidAmount, currency)}</span></div>
            <div><span>Due</span><span>${formatAmount(invoice.dueAmount, currency)}</span></div>
          </section>

          ${invoice.notes ? `<section class="notes"><strong>Notes</strong><p>${escapeHtml(invoice.notes)}</p></section>` : ""}
          <footer class="footer">Thank you for choosing our clinic.</footer>
        </main>
      </body>
    </html>`;
};

/**
 * Generate an invoice PDF using Puppeteer.
 * @param {Object} invoice - Populated invoice data.
 * @returns {Promise<Buffer>} Generated PDF bytes.
 */
export const generateInvoicePdf = async (invoice) => {
  const executablePath = getChromeExecutablePath();
  const browser = await puppeteer.launch({
    headless: true,
    ...(executablePath ? { executablePath } : {}),
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-crashpad",
    ],
  });

  try {
    const page = await browser.newPage();
    await page.setContent(renderInvoiceHtml(invoice), {
      waitUntil: "networkidle0",
    });

    return await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: {
        top: "12mm",
        right: "12mm",
        bottom: "12mm",
        left: "12mm",
      },
    });
  } finally {
    await browser.close();
  }
};
