const fetch = require('node-fetch');
const cheerio = require('cheerio');

/**
 * Fetches a website and extracts an email address.
 * 1. Looks for <a href="mailto:..."> links.
 * 2. If not found, searches entire HTML for email patterns.
 */
async function getEmailFromWebsite(url) {
  if (!url) return '';
  try {
    const res = await fetch(url, { timeout: 8000 });
    if (!res.ok) return '';
    const html = await res.text();
    const $ = cheerio.load(html);

    const mailLink = $('a[href^="mailto:"]').attr('href');
    if (mailLink) return mailLink.replace('mailto:', '').trim();

    const match = html.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
    return match ? match[0] : '';
  } catch {
    return '';
  }
}

module.exports = { getEmailFromWebsite };
