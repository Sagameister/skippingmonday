async function check() {
  const res = await fetch('https://skippingmonday.vercel.app');
  const html = await res.text();
  const match = html.match(/<div class="photo-track">([\s\S]*?)<\/div>\s*<\/div>/);
  if (match) {
    console.log("PHOTO TRACK CONTENT:", match[1]);
  } else {
    console.log("NO PHOTO TRACK FOUND IN HTML");
    // let's try a simpler regex
    const trackStart = html.indexOf('<div class="photo-track">');
    if (trackStart !== -1) {
      console.log("Found start, content slice:", html.substring(trackStart, trackStart + 500));
    }
  }
}
check().catch(console.error);
