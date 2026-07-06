export default async function handler(req, res) {
  // Allow requests from Sanity Studio cloud url
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', 'https://skippingmondays.sanity.studio');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { text, target_lang } = req.body;
    
    // Fallback to the user's provided key if environment variable is not set yet on Vercel
    const authKey = process.env.DEEPL_API_KEY || '6f95895f-c90d-4b6c-b4b7-c631fe79b629:fx';

    const response = await fetch('https://api-free.deepl.com/v2/translate', {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${authKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text,
        target_lang: target_lang || 'DE'
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ message: `DeepL API error: ${errText}` });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}
