export default function decorate(block) {
  // 1. CLEAR PARENT PADDING
  const parentSection = block.closest('.section');
  if (parentSection) {
    parentSection.style.padding = '0';
    parentSection.style.maxWidth = 'unset';
    parentSection.style.margin = '0 auto';
  }

  // 2. EXTRACT CONTENT
  // We scan the block for specific elements before we wipe the innerHTML
  const picture = block.querySelector('picture');
  const img = block.querySelector('img');
  
  // Find Headings (H1-H6)
  const heading = block.querySelector('h1, h2, h3, h4, h5, h6');
  
  // Find the Call to Action (Button)
  // We look for a link. If it's inside a <strong> tag, it's a primary button.
  const ctaLink = block.querySelector('a');
  let ctaHTML = '';
  if (ctaLink) {
    ctaLink.classList.add('banner-btn');
    // Check if it was bolded (strong wrapper)
    if (ctaLink.closest('strong')) {
      ctaLink.classList.add('btn-primary');
    }
    ctaHTML = ctaLink.outerHTML;
  }

  // Find Description 
  // We look for paragraphs that don't contain the image or the button
  const paragraphs = Array.from(block.querySelectorAll('p'));
  let descHTML = '';
  paragraphs.forEach((p) => {
    // If this paragraph contains the picture or the button, skip it
    if (p.querySelector('picture') || p.querySelector('img') || p.querySelector('a')) return;
    descHTML += `<p>${p.innerHTML}</p>`;
  });

  // 3. PREPARE IMAGE HTML
  let imageHTML = '';
  if (picture) {
    const imgTag = picture.querySelector('img');
    if (imgTag) {
      imgTag.setAttribute('loading', 'eager');
      imgTag.setAttribute('alt', 'Channel Banner');
    }
    imageHTML = picture.outerHTML;
  } else if (img) {
    img.setAttribute('loading', 'eager');
    img.setAttribute('alt', 'Channel Banner');
    imageHTML = img.outerHTML;
  } else {
    imageHTML = '<div class="banner-placeholder"></div>';
  }

  // 4. BUILD NEW HTML
  block.innerHTML = `
    <div class="banner-outer">
      <div class="banner-inner">
        <div class="banner-wrapper">
          ${imageHTML}
          <div class="banner-content">
            ${heading ? `<div class="banner-heading">${heading.innerHTML}</div>` : ''}
            ${descHTML ? `<div class="banner-desc">${descHTML}</div>` : ''}
            ${ctaHTML ? `<div class="banner-actions">${ctaHTML}</div>` : ''}
          </div>
        </div>
      </div>
    </div>
  `;
}