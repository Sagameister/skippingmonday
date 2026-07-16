async function check() {
  const res = await fetch('https://skippingmonday.vercel.app');
  const html = await res.text();
  const match = html.match(/<div class="gigs-list">([\s\S]*?)<\/div>\s*<\/div>/);
  if (match) {
    console.log("GIGS LIST CONTENT:", match[1]);
  } else {
    console.log("NO GIGS LIST FOUND");
    const gigStart = html.indexOf('<div class="gigs-list">');
    if (gigStart !== -1) {
      console.log("Gigs list start slice:", html.substring(gigStart, gigStart + 1000));
    }
  }
}
check().catch(console.error);
