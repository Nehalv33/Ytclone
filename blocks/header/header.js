import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * Returns the appropriate SVG icon based on the item name
 */
function getSidebarIcon(name) {
  const lowerName = name.toLowerCase();
  
  if (lowerName.includes('home')) {
    return `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 4.44l-7 6.09V20h4v-6h6v6h4v-9.47l-7-6.09M12 2.69l10 8.69V20c0 1.1-.9 2-2 2h-5v-8h-6v8H4c-1.1 0-2-.9-2-2V11.38l10-8.69z"/></svg>`;
  }
  if (lowerName.includes('shorts') || lowerName.includes('short')) {
    return `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 14.65v-5.3L15 12l-5 2.65zm7.77-4.33c-.77-.32-1.2-.5-1.2-.5L18 9.06c1.84-.96 2.53-3.23 1.56-5.06s-3.24-2.53-5.07-1.56L6 6.94c-1.29.68-2.07 2.04-2 3.49.07 1.42.93 2.67 2.22 3.25.03.01 1.2.5 1.2.5L6 14.93c-1.83.97-2.53 3.24-1.56 5.07.97 1.83 3.24 2.53 5.07 1.56l8.5-4.5c1.29-.68 2.06-2.04 1.99-3.49-.07-1.42-.94-2.68-2.23-3.25z"/></svg>`;
  }
  if (lowerName.includes('subscription')) {
    return `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 7H6v2h12V7zm-2-4H8v2h8V3zm4 8H4c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2zm0 10H4v-8h16v8zM10 12.5v5l4-2.5-4-2.5z"/></svg>`;
  }
  if (lowerName.includes('library') || lowerName.includes('history')) {
    return `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12z"/></svg>`;
  }
  
  // Default Icon
  return `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>`;
}

function createSidebarItem(item) {
  const sidebarItem = document.createElement('a');
  sidebarItem.className = 'sidebar-item';
  
  const link = item.querySelector('a');
  sidebarItem.href = link ? link.href : '#';
  
  const text = item.textContent.trim();
  
  const iconContainer = document.createElement('div');
  iconContainer.className = 'sidebar-icon';
  iconContainer.innerHTML = getSidebarIcon(text);
  
  const label = document.createElement('span');
  label.className = 'sidebar-label';
  label.textContent = text;
  
  sidebarItem.appendChild(iconContainer);
  sidebarItem.appendChild(label);
  
  if (link && window.location.pathname === new URL(link.href).pathname) {
    sidebarItem.classList.add('active');
  }
  
  return sidebarItem;
}

function createSidebar(fragment) {
  const sidebar = document.createElement('aside');
  sidebar.className = 'sidebar';
  sidebar.id = 'sidebar';

  const fragmentSections = [];
  let currentSection = [];
  const fragmentChildren = Array.from(fragment.children);
  
  fragmentChildren.forEach((child) => {
    if (child.tagName === 'HR' || child.tagName.match(/^H[1-6]$/)) {
      if (currentSection.length > 0) {
        fragmentSections.push(currentSection);
        currentSection = [];
      }
      if (child.tagName.match(/^H[1-6]$/)) {
        currentSection.push({ type: 'title', content: child.textContent.trim() });
      }
    } else if (child.tagName === 'UL' || child.tagName === 'OL') {
      const listItems = Array.from(child.querySelectorAll('li'));
      currentSection.push(...listItems);
    } else if (child.tagName === 'P' && child.textContent.trim()) {
      currentSection.push(child);
    }
  });
  
  if (currentSection.length > 0) fragmentSections.push(currentSection);
  if (fragmentSections.length === 0) {
    const allItems = fragment.querySelectorAll('li, p');
    if (allItems.length > 0) fragmentSections.push(Array.from(allItems));
  }

  fragmentSections.forEach((sectionData, index) => {
    const section = document.createElement('div');
    section.className = 'sidebar-section';
    let items = sectionData;
    
    if (sectionData[0]?.type === 'title') {
      const sectionTitle = document.createElement('div');
      sectionTitle.className = 'sidebar-section-title';
      sectionTitle.textContent = sectionData[0].content;
      section.appendChild(sectionTitle);
      items = sectionData.slice(1);
    }
    
    items.forEach((item) => {
      section.appendChild(createSidebarItem(item));
    });
    
    sidebar.appendChild(section);
    
    if (index < fragmentSections.length - 1) {
      const separator = document.createElement('div');
      separator.className = 'sidebar-separator';
      sidebar.appendChild(separator);
    }
  });

  return sidebar;
}

// --- SIDEBAR TOGGLE (ENHANCED FOR MOBILE) ---
function toggleSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const body = document.body;
  const isMobile = window.innerWidth <= 1024;

  if (isMobile) {
    // On mobile, toggle the mobile-open class for slide-in effect
    sidebar.classList.toggle('mobile-open');
    body.classList.toggle('mobile-sidebar-open');
  } else {
    // On desktop, toggle between mini and full sidebar
    sidebar.classList.toggle('mini');
    
    if (sidebar.classList.contains('mini')) {
      body.classList.remove('sidebar-full');
      body.classList.add('sidebar-mini');
      localStorage.setItem('vidtube-sidebar-pref', 'mini');
    } else {
      body.classList.remove('sidebar-mini');
      body.classList.add('sidebar-full');
      localStorage.setItem('vidtube-sidebar-pref', 'full');
    }
  }
}

// Close sidebar when clicking outside on mobile
function setupMobileOverlay() {
  document.addEventListener('click', (e) => {
    const sidebar = document.querySelector('.sidebar');
    const hamburger = document.querySelector('.hamburger-menu');
    const isMobile = window.innerWidth <= 1024;
    
    if (isMobile && 
        sidebar.classList.contains('mobile-open') && 
        !sidebar.contains(e.target) && 
        !hamburger.contains(e.target)) {
      sidebar.classList.remove('mobile-open');
      document.body.classList.remove('mobile-sidebar-open');
    }
  });
}

// --- DARK MODE LOGIC ---
function updateDarkModeIcon(isDark) {
  const btn = document.querySelector('.dark-mode-toggle');
  if (btn) {
    if (isDark) {
      btn.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/></svg>`;
      btn.setAttribute('aria-label', 'Switch to Light Mode');
    } else {
      btn.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/></svg>`;
      btn.setAttribute('aria-label', 'Switch to Dark Mode');
    }
  }
}

function toggleDarkMode() {
  const body = document.body;
  const isDark = body.classList.toggle('dark-mode');
  localStorage.setItem('vidtube-dark-mode', isDark ? 'enabled' : 'disabled');
  updateDarkModeIcon(isDark);
}

// --- LIVE SEARCH ---
function filterVideos(query) {
  const lowerQuery = query.toLowerCase().trim();
  const cards = document.querySelectorAll('.thumbnail-card');
  const container = document.querySelector('.thumbnails-grid');
  
  if (!container) return; 

  const oldMsg = document.querySelector('.search-no-results');
  if (oldMsg) oldMsg.remove();

  let matchCount = 0;
  cards.forEach(card => {
    const title = card.querySelector('.thumbnail-title')?.textContent || '';
    const channel = card.querySelector('.thumbnail-channel')?.textContent || '';
    if (title.toLowerCase().includes(lowerQuery) || channel.toLowerCase().includes(lowerQuery)) {
      card.style.display = ''; 
      matchCount++;
    } else {
      card.style.display = 'none';
    }
  });

  if (matchCount === 0 && lowerQuery.length > 0) {
    const msg = document.createElement('div');
    msg.className = 'search-no-results';
    msg.textContent = 'No videos found for your search';
    container.appendChild(msg);
  }
}

// --- MOBILE SEARCH TOGGLE (FULLSCREEN VERSION) ---
function toggleMobileSearch() {
  const navbarCenter = document.querySelector('.navbar-center');
  const navbarLeft = document.querySelector('.navbar-left');
  const navbarRight = document.querySelector('.navbar-right');
  const mobileSearchBtn = document.querySelector('.mobile-search-toggle');
  
  if (navbarCenter.classList.contains('mobile-search-active')) {
    // Close search
    navbarCenter.classList.remove('mobile-search-active');
    navbarLeft.style.display = 'flex';
    navbarRight.style.display = 'flex';
    // Restore all buttons
    navbarRight.querySelectorAll('button').forEach(btn => {
      btn.style.display = 'flex';
    });
    mobileSearchBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`;
  } else {
    // Open search - fullscreen overlay
    navbarCenter.classList.add('mobile-search-active');
    navbarLeft.style.display = 'none';
    navbarRight.style.display = 'flex';
    // Hide other icons except search toggle
    navbarRight.querySelectorAll('button:not(.mobile-search-toggle)').forEach(btn => {
      btn.style.display = 'none';
    });
    // Keep search toggle visible and change to X
    mobileSearchBtn.style.display = 'flex';
    mobileSearchBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
    
    // Focus the search input
    setTimeout(() => {
      navbarCenter.querySelector('.search-input').focus();
    }, 100);
  }
}

export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const navFragment = await loadFragment(navPath);

  const sidebarMeta = getMetadata('sidebar');
  const sidebarPath = sidebarMeta ? new URL(sidebarMeta, window.location).pathname : '/sidebar';
  const sidebarFragment = await loadFragment(sidebarPath);

  block.textContent = '';

  const fragmentContent = navFragment.querySelectorAll('p, div');
  const logoElement = fragmentContent[0]?.querySelector('picture, img, a') || fragmentContent[0];
  
  let profileElement = null;
  for (let i = fragmentContent.length - 1; i >= 0; i--) {
    const img = fragmentContent[i].querySelector('picture, img');
    if (img && i !== 0) {
      profileElement = img;
      break;
    }
  }

  // --- NAVBAR ---
  const navbarContainer = document.createElement('div');
  navbarContainer.className = 'navbar-container';

  // Left
  const navbarLeft = document.createElement('div');
  navbarLeft.className = 'navbar-left';
  const hamburger = document.createElement('button');
  hamburger.className = 'hamburger-menu';
  hamburger.innerHTML = `<span class="hamburger-line"></span><span class="hamburger-line"></span><span class="hamburger-line"></span>`;
  hamburger.addEventListener('click', toggleSidebar);
  navbarLeft.appendChild(hamburger);

  const logoLink = document.createElement('a');
  logoLink.href = '/';
  logoLink.className = 'navbar-logo';
  if (logoElement) logoLink.appendChild(logoElement.cloneNode(true));
  else logoLink.textContent = 'VidTube';
  navbarLeft.appendChild(logoLink);

  // Center
  const navbarCenter = document.createElement('div');
  navbarCenter.className = 'navbar-center';

  const searchForm = document.createElement('form');
  searchForm.className = 'search-form';
  searchForm.innerHTML = `
    <input type="text" class="search-input" placeholder="Search">
    <button type="submit" class="search-button">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
    </button>
  `;
  searchForm.addEventListener('submit', (e) => e.preventDefault());
  searchForm.querySelector('.search-input').addEventListener('input', (e) => filterVideos(e.target.value));
  navbarCenter.appendChild(searchForm);

  const voiceButton = document.createElement('button');
  voiceButton.className = 'voice-search-button';
  voiceButton.innerHTML = `<svg viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>`;
  navbarCenter.appendChild(voiceButton);

  // Right
  const navbarRight = document.createElement('div');
  navbarRight.className = 'navbar-right';

  // Mobile search toggle button
  const mobileSearchBtn = document.createElement('button');
  mobileSearchBtn.className = 'mobile-search-toggle';
  mobileSearchBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`;
  mobileSearchBtn.addEventListener('click', toggleMobileSearch);
  navbarRight.appendChild(mobileSearchBtn);

  const darkModeButton = document.createElement('button');
  darkModeButton.className = 'dark-mode-toggle';
  darkModeButton.addEventListener('click', toggleDarkMode);
  navbarRight.appendChild(darkModeButton);

  const profileButton = document.createElement('button');
  profileButton.className = 'profile-button';
  if (profileElement) profileButton.appendChild(profileElement.cloneNode(true));
  else profileButton.innerHTML = `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="currentColor"/><circle cx="12" cy="9" r="3" fill="white"/><path d="M17 18C17 15.79 14.76 14 12 14C9.24 14 7 15.79 7 18" stroke="white" stroke-width="2" fill="none"/></svg>`;
  navbarRight.appendChild(profileButton);

  navbarContainer.appendChild(navbarLeft);
  navbarContainer.appendChild(navbarCenter);
  navbarContainer.appendChild(navbarRight);

  const nav = document.createElement('nav');
  nav.appendChild(navbarContainer);
  const sidebar = createSidebar(sidebarFragment);

  block.appendChild(nav);
  block.appendChild(sidebar);

  // Setup mobile overlay click handler
  setupMobileOverlay();

  // Restore State
  const savedState = localStorage.getItem('vidtube-sidebar-pref');
  const savedTheme = localStorage.getItem('vidtube-dark-mode');
  
  // Only apply saved state on desktop
  if (window.innerWidth > 1024) {
    if (savedState === 'mini') {
      sidebar.classList.add('mini');
      document.body.classList.add('sidebar-mini');
    } else {
      document.body.classList.add('sidebar-full');
    }
  }

  if (savedTheme === 'enabled') {
    document.body.classList.add('dark-mode');
    updateDarkModeIcon(true);
  } else {
    updateDarkModeIcon(false);
  }
}