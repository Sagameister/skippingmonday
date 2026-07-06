import re

# Read SVG path from logo-horiz-wht.svg
with open('public/Images/logo-horiz-wht.svg', 'r') as f:
    svg_content = f.read()

# Extract path d="..."
path_match = re.search(r'd="([^"]+)"', svg_content)
if not path_match:
    print("Error: Could not find path d attribute")
    exit(1)
path_d = path_match.group(1)

# Read Footer.astro
with open('src/components/Footer.astro', 'r') as f:
    footer_content = f.read()

# Construct the new SVG block
new_svg_block = f"""  <div class="giant-wrap">
    <svg class="giant" viewBox="0 0 953 164" aria-label="Skipping Mondays">
      <defs>
        <radialGradient id="rainbow" gradientUnits="userSpaceOnUse"
                        cx="476" cy="82" r="260" spreadMethod="repeat">
          <stop offset="0.000" stop-color="#3D7BE8"/>
          <stop offset="0.143" stop-color="#A78BE8"/>
          <stop offset="0.286" stop-color="#6B2C91"/>
          <stop offset="0.429" stop-color="#E63B2E"/>
          <stop offset="0.571" stop-color="#F58220"/>
          <stop offset="0.714" stop-color="#9FBF3B"/>
          <stop offset="0.857" stop-color="#2E8C7A"/>
          <stop offset="1.000" stop-color="#3D7BE8"/>
          <animate id="rainbow-anim-r" attributeName="r"
                   values="260;380;260" dur="8s" repeatCount="indefinite"/>
        </radialGradient>
      </defs>
      <path d="{path_d}" fill="currentColor"/>
      <path class="giant-rainbow" aria-hidden="true" d="{path_d}" fill="url(#rainbow)"/>
    </svg>
  </div>"""

# Replace the giant-wrap block in Footer.astro
pattern = r'  <div class="giant-wrap">.*?  </div>'
new_footer_content = re.sub(pattern, new_svg_block, footer_content, flags=re.DOTALL)

with open('src/components/Footer.astro', 'w') as f:
    f.write(new_footer_content)

print("Successfully updated Footer.astro!")
