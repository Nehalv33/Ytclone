export default function decorate(block) {
    const rows = [...block.children];
    const videos = [];
  
    console.log('Total rows:', rows.length);
  
    // Check if first row has multiple columns (table format)
    const firstRow = rows[0];
    const isTableFormat = firstRow && firstRow.children.length > 1;
  
    if (isTableFormat) {
      // Detect if we have 3-row groups or 4-row groups
      // Check if row 3 contains images (avatars) or not
      const hasAvatarRow = rows[3]?.children[0]?.querySelector('picture, img') ? true : false;
      const rowsPerGroup = hasAvatarRow ? 4 : 3;
      
      console.log('Rows per group:', rowsPerGroup);
      console.log('Has custom avatars:', hasAvatarRow);
  
      for (let rowIndex = 0; rowIndex < rows.length; rowIndex += rowsPerGroup) {
        const imageRow = rows[rowIndex];
        const titleRow = rows[rowIndex + 1];
        const channelRow = rows[rowIndex + 2];
        const avatarRow = hasAvatarRow ? rows[rowIndex + 3] : null;
  
        // Skip if we don't have complete rows
        if (!imageRow || !titleRow || !channelRow) continue;
  
        // Get number of columns in this row
        const columnCount = imageRow.children.length;
  
        // Process each column (each column is one video)
        for (let col = 0; col < columnCount; col++) {
          const thumbnail = imageRow.children[col]?.querySelector('picture, img');
          const title = titleRow.children[col]?.textContent?.trim() || 'Untitled Video';
          const channel = channelRow.children[col]?.textContent?.trim() || 'Channel';
          const avatar = avatarRow ? avatarRow.children[col]?.querySelector('picture, img') : null;
          
          // Link might be in the title or channel row
          const linkElement = titleRow.children[col]?.querySelector('a') || 
                            channelRow.children[col]?.querySelector('a');
          const link = linkElement?.href || '#';
  
          if (thumbnail) {
            videos.push({ thumbnail, title, channel, link, avatar });
            console.log(`Added video ${videos.length}:`, title, avatar ? '(with avatar)' : '(auto avatar)');
          }
        }
      }
    } else {
      // Row format: 4 rows (image, title, channel, link) or 5 rows (with avatar)
      const hasAvatar = rows[4]?.querySelector('picture, img') ? true : false;
      const rowsPerVideo = hasAvatar ? 5 : 4;
  
      for (let i = 0; i < rows.length; i += rowsPerVideo) {
        const thumbnail = rows[i]?.querySelector('picture, img');
        const title = rows[i + 1]?.textContent?.trim() || 'Untitled Video';
        const channel = rows[i + 2]?.textContent?.trim() || 'Channel';
        const linkElement = rows[i + 3]?.querySelector('a');
        const link = linkElement?.href || '#';
        const avatar = hasAvatar ? rows[i + 4]?.querySelector('picture, img') : null;
  
        if (thumbnail) {
          videos.push({ thumbnail, title, channel, link, avatar });
        }
      }
    }
  
    console.log('Total videos found:', videos.length);
  
    // Generate thumbnail cards HTML
    const thumbnailCards = videos.map((video, index) => {
      const thumbnailHTML = video.thumbnail.tagName === 'PICTURE' 
        ? video.thumbnail.outerHTML 
        : `<img src="${video.thumbnail.src}" alt="${video.title}" loading="lazy">`;
  
      // Avatar: Use custom image if provided, otherwise generate letter
      let avatarHTML;
      if (video.avatar) {
        // Custom avatar image
        avatarHTML = video.avatar.tagName === 'PICTURE'
          ? video.avatar.outerHTML
          : `<img src="${video.avatar.src}" alt="${video.channel}" class="avatar-image">`;
      } else {
        // Auto-generated letter avatar
        const avatarLetter = video.channel.charAt(0).toUpperCase();
        avatarHTML = `<span class="avatar-circle">${avatarLetter}</span>`;
      }
  
      return `
        <a href="${video.link}" class="thumbnail-card" data-index="${index}">
          <div class="thumbnail-image-wrapper">
            ${thumbnailHTML}
          </div>
          <div class="thumbnail-info">
            <div class="thumbnail-avatar">
              ${avatarHTML}
            </div>
            <div class="thumbnail-details">
              <h3 class="thumbnail-title">${video.title}</h3>
              <p class="thumbnail-channel">${video.channel}</p>
            </div>
          </div>
        </a>
      `;
    }).join('');
  
    // Replace block content
    block.innerHTML = `
      <div class="thumbnails-grid">
        ${thumbnailCards}
      </div>
    `;
  }