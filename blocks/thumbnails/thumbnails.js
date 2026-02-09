export default function decorate(block) {
  const videos = [];
  const rows = [...block.children];

  // Loop through every row in the table
  rows.forEach((row) => {
    const columns = [...row.children];

    // SKIP header rows or rows without enough data. 
    // We now expect 4 columns based on your new layout.
    if (columns.length < 4) return;

    // 1. EXTRACT DATA
    // Column 1: Thumbnail Image
    const thumbnail = columns[0]?.querySelector('picture, img');

    // Column 2: Channel Avatar Image (Profile Picture)
    const avatar = columns[1]?.querySelector('picture, img');

    // Column 3: Video Title & Link
    const titleDiv = columns[2];
    const titleText = titleDiv?.textContent.trim() || 'Untitled Video';
    // Check if the title was made into a link in the editor
    const linkElement = titleDiv?.querySelector('a');
    // Use the link's href if it exists, otherwise a default '#'
    const link = linkElement ? linkElement.href : '#';

    // Column 4: Channel Name
    const channelName = columns[3]?.textContent.trim() || 'Channel';

    // Only add the video if we have at least a main thumbnail image
    if (thumbnail) {
      videos.push({
        thumbnail,
        title: titleText,
        link,
        avatar, // This will be the image element or null
        channel: channelName
      });
    }
  });

  // 2. GENERATE HTML
  const thumbnailCards = videos.map((video, index) => {
    
    // Prepare Thumbnail Image HTML
    const thumbnailHTML = video.thumbnail.tagName === 'PICTURE'
      ? video.thumbnail.outerHTML
      : `<img src="${video.thumbnail.src}" alt="${video.title}" loading="lazy">`;

    // Prepare Avatar HTML
    let avatarHTML = '';
    if (video.avatar) {
      // CASE A: An avatar image was provided in Column 2. Use it.
      avatarHTML = video.avatar.tagName === 'PICTURE' 
        ? video.avatar.outerHTML 
        : `<img src="${video.avatar.src}" alt="${video.channel}">`;
    } else {
      // CASE B: No avatar image found. Fall back to the first letter.
      const letter = video.channel.charAt(0).toUpperCase();
      avatarHTML = `<span class="avatar-letter">${letter}</span>`;
    }

    return `
      <a href="${video.link}" class="thumbnail-card">
        <div class="thumbnail-image-wrapper">
          ${thumbnailHTML}
          </div>
        
        <div class="thumbnail-info">
          <div class="thumbnail-avatar">
            ${avatarHTML}
          </div>
          <div class="thumbnail-text">
            <h3 class="thumbnail-title">${video.title}</h3>
            <p class="thumbnail-channel">${video.channel}</p>
          </div>
        </div>
      </a>
    `;
  }).join('');

  // 3. UPDATE PAGE
  // Replace the original table with our new grid of cards
  block.innerHTML = `
    <div class="thumbnails-grid">
      ${thumbnailCards}
    </div>
  `;
}