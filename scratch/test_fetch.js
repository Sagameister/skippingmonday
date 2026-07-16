import { createClient } from '@sanity/client';

const client = createClient({
  projectId: '9mzj9v38',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2026-07-06',
});

async function run() {
  try {
    const res = await client.fetch('*[_type == "post" && postType == "gig"]');
    console.log("SUCCESS FETCH:", res);
  } catch (err) {
    console.error("FAILED FETCH:", err);
  }
}
run();
