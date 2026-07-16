import fs from 'fs';
import path from 'path';

// Helper to parse CLI arguments
function getArgs() {
  const args = {};
  const argv = process.argv.slice(2);
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith('--')) {
      const name = arg.slice(2);
      const nextVal = argv[i + 1];
      if (nextVal && !nextVal.startsWith('--')) {
        args[name] = nextVal;
        i++;
      } else {
        args[name] = true;
      }
    }
  }
  return args;
}

// Convert plain text paragraph breaks to HTML
function textToHtml(text) {
  return text
    .split('\n\n')
    .map(para => {
      // Basic support for markdown-style links [Text](URL)
      let html = para.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
      // Convert single line breaks to <br>
      html = html.replace(/\n/g, '<br>');
      return `<p>${html}</p>`;
    })
    .join('\n');
}

async function run() {
  const args = getArgs();

  // Validate credentials in environment
  const projectId = process.env.PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.PUBLIC_SANITY_DATASET || 'production';
  const writeToken = process.env.SANITY_WRITE_TOKEN;
  const resendApiKey = process.env.RESEND_API_KEY;

  if (args['help'] || (!args['subject'] && !args['dry-run'])) {
    console.log(`
Skipping Mondays Newsletter Broadcaster
======================================

Usage:
  node --env-file=.env scripts/send-newsletter.mjs --subject "Your Subject" [options]

Options:
  --subject "text"   The email subject line (required unless dry-run)
  --body "text"      The newsletter content in plain text/markdown
  --file "path"      Path to a text/markdown file containing the newsletter body
  --dry-run          Preview the HTML output and recipient count without sending
  --help             Show this help screen
    `);
    process.exit(0);
  }

  if (!projectId || !writeToken) {
    console.error('Error: Sanity credentials missing (PUBLIC_SANITY_PROJECT_ID, SANITY_WRITE_TOKEN)');
    process.exit(1);
  }

  if (!resendApiKey && !args['dry-run']) {
    console.error('Error: RESEND_API_KEY is missing. Use --dry-run to preview without sending.');
    process.exit(1);
  }

  // Get Body Content
  let bodyContent = args['body'] || '';
  if (args['file']) {
    const filePath = path.resolve(args['file']);
    if (!fs.existsSync(filePath)) {
      console.error(`Error: File not found at ${filePath}`);
      process.exit(1);
    }
    bodyContent = fs.readFileSync(filePath, 'utf8');
  }

  if (!bodyContent.trim()) {
    console.error('Error: Newsletter body is empty. Provide content via --body or --file.');
    process.exit(1);
  }

  const subject = args['subject'] || 'Skipping Mondays Update';
  const htmlBody = textToHtml(bodyContent);

  // HTML Template
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #ffffff;
      color: #111111;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #ffffff;
      padding: 40px 20px;
      box-sizing: border-box;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      border: 1px solid #e5e5e5;
      padding: 40px;
      border-radius: 0px;
    }
    .header {
      text-align: center;
      margin-bottom: 40px;
      border-bottom: 1px solid #e5e5e5;
      padding-bottom: 24px;
    }
    .logo {
      font-family: 'Inter Tight', 'Inter', sans-serif;
      font-size: 24px;
      font-weight: 800;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      text-decoration: none;
      color: #111111;
    }
    .content {
      font-size: 16px;
      line-height: 1.7;
      color: #111111;
      margin-bottom: 40px;
    }
    .content p {
      margin-top: 0;
      margin-bottom: 20px;
    }
    .content a {
      color: #111111;
      text-decoration: underline;
      font-weight: 500;
    }
    .footer {
      border-top: 1px solid #e5e5e5;
      padding-top: 24px;
      text-align: center;
      font-size: 12px;
      color: #8a8a8a;
      line-height: 1.6;
    }
    .footer a {
      color: #8a8a8a;
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <a href="https://skippingmondays.com" class="logo">SKIPPING MONDAYS</a>
      </div>
      <div class="content">
        ${htmlBody}
      </div>
      <div class="footer">
        <p>© ${new Date().getFullYear()} Skipping Mondays. All rights reserved.</p>
        <p>You received this email because you signed up on our website.</p>
        <p><a href="{{{resend_unsubscribe_url}}}">Unsubscribe</a> from this list.</p>
      </div>
    </div>
  </div>
</body>
</html>`;

  // Fetch Subscribers
  console.log('Fetching active subscribers from Sanity CMS...');
  const query = `*[_type == "subscriber"] | order(subscribedAt desc) { email }`;
  const sanityUrl = `https://${projectId}.api.sanity.io/v2026-07-06/data/query/${dataset}?query=${encodeURIComponent(query)}`;
  
  let emails = [];
  try {
    const res = await fetch(sanityUrl, {
      headers: {
        Authorization: `Bearer ${writeToken}`
      }
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Sanity fetch error: ${errText}`);
    }
    const data = await res.json();
    emails = (data.result || []).map(r => r.email).filter(Boolean);
  } catch (err) {
    console.error('Failed to fetch subscribers:', err.message);
    process.exit(1);
  }

  if (emails.length === 0) {
    console.log('No subscribers found in Sanity. Exiting.');
    process.exit(0);
  }

  console.log(`Found ${emails.length} subscriber(s).`);

  if (args['dry-run']) {
    console.log('\n--- DRY RUN PREVIEW ---');
    console.log(`Subject: ${subject}`);
    console.log('HTML Output:\n');
    console.log(htmlContent);
    console.log('\n-----------------------');
    console.log(`Recipients list:\n${emails.join('\n')}\n`);
    console.log('Dry run complete. No emails were sent.');
    process.exit(0);
  }

  // Confirm sending
  console.log(`\nPreparing to send campaign to ${emails.length} subscriber(s)...`);
  
  let successCount = 0;
  let failCount = 0;

  for (const email of emails) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${resendApiKey}`
        },
        body: JSON.stringify({
          from: 'Skipping Mondays <hi@skippingmondays.com>',
          to: email,
          subject: subject,
          html: htmlContent
        })
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Resend error: ${errText}`);
      }

      console.log(`✓ Sent to ${email}`);
      successCount++;
    } catch (err) {
      console.error(`✗ Failed for ${email}:`, err.message);
      failCount++;
    }
    // Rate limit buffer
    await new Promise(resolve => setTimeout(resolve, 80));
  }

  console.log(`\nCampaign completed. Sent: ${successCount}, Failed: ${failCount}`);
}

run().catch(console.error);
