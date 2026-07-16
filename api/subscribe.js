import { createClient } from '@sanity/client';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // 1. Read raw request stream
    const buffers = [];
    for await (const chunk of req) {
      buffers.push(chunk);
    }
    const rawBody = Buffer.concat(buffers).toString();

    // 2. Check for Honeypot
    const gotchaMatch = rawBody.match(/name="_gotcha"\r?\n\r?\n([^\r\n]+)/);
    const gotcha = gotchaMatch ? gotchaMatch[1].trim() : '';
    if (gotcha) {
      return res.status(200).json({ status: 'success', message: 'Honeypot triggered' });
    }

    // 3. Extract Email Address
    const emailMatch = rawBody.match(/name="email"\r?\n\r?\n([^\r\n\s]+)/) || rawBody.match(/email=([^&\s]+)/);
    const email = emailMatch ? decodeURIComponent(emailMatch[1]).trim() : null;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'Invalid email address' });
    }

    // 4. Validate Sanity Configuration
    const projectId = process.env.PUBLIC_SANITY_PROJECT_ID;
    const dataset = process.env.PUBLIC_SANITY_DATASET || 'production';
    const writeToken = process.env.SANITY_WRITE_TOKEN;

    if (!projectId || !writeToken) {
      console.error('Sanity configuration missing in subscribe handler');
      return res.status(500).json({ message: 'Newsletter service is not fully configured.' });
    }

    const writeClient = createClient({
      projectId,
      dataset,
      token: writeToken,
      useCdn: false,
      apiVersion: '2026-07-06',
    });

    // 5. Check for duplicate subscriber
    const existing = await writeClient.fetch(
      `*[_type == "subscriber" && email == $email][0]`,
      { email }
    );

    if (existing) {
      return res.status(200).json({ status: 'success', message: 'Already subscribed.' });
    }

    // 6. Create document in Sanity
    await writeClient.create({
      _type: 'subscriber',
      email,
      subscribedAt: new Date().toISOString(),
    });

    return res.status(200).json({ status: 'success' });
  } catch (error) {
    console.error('Subscription error:', error);
    return res.status(500).json({ message: 'Failed to subscribe. Please try again later.' });
  }
}
