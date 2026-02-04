export default function decorate(block) {
  // Get the image from the first row
  const imageElement = block.querySelector('picture, img');

  block.innerHTML = `
    <div class="banner-outer">
      <div class="container">
        <div class="banner-wrapper">
          ${
            imageElement
              ? imageElement.tagName === 'PICTURE'
                ? imageElement.outerHTML
                : `<img src="${imageElement.src}" alt="Banner">`
              : ''
          }
        </div>
      </div>
    </div>
  `;
}
