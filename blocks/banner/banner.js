export default function decorate(block) {
  // 1. CLEAR PARENT PADDING
  // This is crucial for da.live/EDS. The parent '.section' often has default padding 
  // that squeezes the banner. We remove it so the banner controls its own spacing.
  const parentSection = block.closest('.section');
  if (parentSection) {
    parentSection.style.padding = '0';
    parentSection.style.maxWidth = 'unset';
    parentSection.style.margin = '0 auto';
  }

  // 2. GET THE IMAGE
  // Support both <picture> (responsive) and <img> (fallback)
  const picture = block.querySelector('picture');
  const img = block.querySelector('img');
  
  let imageHTML = '';

  if (picture) {
    const imgTag = picture.querySelector('img');
    if (imgTag) {
      imgTag.setAttribute('loading', 'eager'); // Load fast (LCP)
      imgTag.setAttribute('alt', 'Channel Banner');
    }
    imageHTML = picture.outerHTML;
  } else if (img) {
    img.setAttribute('loading', 'eager');
    img.setAttribute('alt', 'Channel Banner');
    imageHTML = img.outerHTML;
  } else {
    // Fallback if no image is found
    imageHTML = '<div class="banner-placeholder"></div>';
  }

  // 3. BUILD HTML
  // We use 'banner-inner' to match the CSS padding rules
  block.innerHTML = `
    <div class="banner-outer">
      <div class="banner-inner">
        <div class="banner-wrapper">
          ${imageHTML}
        </div>
      </div>
    </div>
  `;
}