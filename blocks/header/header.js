import { getMetadata } from '../../scripts/aem.js';

/**
 * Header Block - YouTube Style Navigation
 * Content pulled from the 'header' document in da.live
 */
export default async function decorate(block) {
  // 1. Get logo and profile image from the block content rows
  const rows = [...block.children];
  
  // These logs will appear in your browser console (F12) to confirm data is found
  console.log('Header rows found:', rows.length);
  
  const logo = rows[0]?.querySelector('picture, img');
  const profileImage = rows[1]?.querySelector('picture, img');
  
  // 2. Clear the block to inject our custom YouTube-style HTML
  block.innerHTML = '';
  
  // 3. Build the navigation structure
  const nav = document.createElement('nav');
  nav.className = 'navbar-container';
  nav.innerHTML = `
    <div class="navbar-left">
      <button class="hamburger-menu" aria-label="Menu">
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
      </button>
      <a href="/" class="navbar-logo">
        ${logo ? (
          logo.tagName === 'PICTURE' 
            ? logo.outerHTML 
            : `<img src="${logo.src}" alt="Logo">`
        ) : `
          <svg width="90" height="20" viewBox="0 0 90 20" fill="currentColor">
            <path d="M27.9727 3.12324C27.6435 1.89323 26.6768 0.926623 25.4468 0.597366C23.2197 0 14.285 0 14.285 0C14.285 0 5.35042 0 3.12323 0.597366C1.89323 0.926623 0.926623 1.89323 0.597366 3.12324C0 5.35042 0 10 0 10C0 10 0 14.6496 0.597366 16.8768C0.926623 18.1068 1.89323 19.0734 3.12323 19.4026C5.35042 20 14.285 20 14.285 20C14.285 20 23.2197 20 25.4468 19.4026C26.6768 19.0734 27.6435 18.1068 27.9727 16.8768C28.5701 14.6496 28.5701 10 28.5701 10C28.5701 10 28.5677 5.35042 27.9727 3.12324Z" fill="#FF0000"/>
            <path d="M11.4253 14.2854L18.8477 10.0004L11.4253 5.71533V14.2854Z" fill="white"/>
          </svg>
        `}
      </a>
    </div>

    <div class="navbar-center">
      <form class="search-form" role="search">
        <input type="text" class="search-input" placeholder="Search" aria-label="Search" />
        <button type="submit" class="search-button" aria-label="Search">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="11" cy="11" r="8" stroke-width="2"/>
            <path d="M21 21L16.65 16.65" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </form>
      <button class="voice-search-button" aria-label="Voice search">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
          <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
        </svg>
      </button>
    </div>

    <div class="navbar-right">
      <button class="profile-button" aria-label="Profile">
        ${profileImage ? (
          profileImage.tagName === 'PICTURE'
            ? profileImage.outerHTML
            : `<img src="${profileImage.src}" alt="Profile" class="profile-image">`
        ) : `
          <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="8" r="4"/>
            <path d="M12 14c-6 0-8 4-8 4v2h16v-2s-2-4-8-4z"/>
          </svg>
        `}
      </button>
    </div>
  `;
  
  block.appendChild(nav);
  setupEventListeners(block);
}

function setupEventListeners(block) {
  const hamburger = block.querySelector('.hamburger-menu');
  const searchForm = block.querySelector('.search-form');
  
  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    console.log('Menu toggled');
  });
  
  searchForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = block.querySelector('.search-input').value;
    if (query.trim()) {
      console.log('Searching for:', query);
    }
  });
}