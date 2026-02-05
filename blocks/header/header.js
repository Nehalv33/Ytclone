import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * Returns the appropriate SVG icon based on the item name
 * @param {string} name The item name
 * @returns {string} SVG icon HTML
 */
function getSidebarIcon(name) {
  const lowerName = name.toLowerCase();
  
  if (lowerName.includes('home')) {
    return `<svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 4.44l-7 6.09V20h4v-6h6v6h4v-9.47l-7-6.09M12 2.69l10 8.69V20c0 1.1-.9 2-2 2h-5v-8h-6v8H4c-1.1 0-2-.9-2-2V11.38l10-8.69z"/>
    </svg>`;
  }
  
  if (lowerName.includes('shorts') || lowerName.includes('short')) {
    return `<svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M10 14.65v-5.3L15 12l-5 2.65zm7.77-4.33c-.77-.32-1.2-.5-1.2-.5L18 9.06c1.84-.96 2.53-3.23 1.56-5.06s-3.24-2.53-5.07-1.56L6 6.94c-1.29.68-2.07 2.04-2 3.49.07 1.42.93 2.67 2.22 3.25.03.01 1.2.5 1.2.5L6 14.93c-1.83.97-2.53 3.24-1.56 5.07.97 1.83 3.24 2.53 5.07 1.56l8.5-4.5c1.29-.68 2.06-2.04 1.99-3.49-.07-1.42-.94-2.68-2.23-3.25z"/>
    </svg>`;
  }
  
  if (lowerName.includes('subscription')) {
    return `<svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 7H6v2h12V7zm-2-4H8v2h8V3zm4 8H4c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2zm0 10H4v-8h16v8zM10 12.5v5l4-2.5-4-2.5z"/>
    </svg>`;
  }
  
  if (lowerName.includes('view')) {
    return `<svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
    </svg>`;
  }
  
  if (lowerName.includes('history')) {
    return `<svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>
    </svg>`;
  }
  
  if (lowerName.includes('watch') && lowerName.includes('later')) {
    return `<svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm4.2 14.2L11 13V7h1.5v5.2l4.5 2.7-.8 1.3z"/>
    </svg>`;
  }
  
  if (lowerName.includes('like')) {
    return `<svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/>
    </svg>`;
  }
  
  return `<svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
  </svg>`;
}

/**
 * Creates a sidebar item
 * @param {Element} item The fragment item element
 * @returns {Element} The sidebar item element
 */
function createSidebarItem(item) {
  const sidebarItem = document.createElement('a');
  sidebarItem.className = 'sidebar-item';
  
  const link = item.querySelector('a');
  if (link) {
    sidebarItem.href = link.href;
  } else {
    sidebarItem.href = '#';
  }
  
  const text = item.textContent.trim();
  
  const iconContainer = document.createElement('div');
  iconContainer.className = 'sidebar-icon';
  iconContainer.innerHTML = getSidebarIcon(text);
  
  const label = document.createElement('span');
  label.className = 'sidebar-label';
  label.textContent = text;
  
  sidebarItem.appendChild(iconContainer);
  sidebarItem.appendChild(label);
  
  // Mark active page
  if (link && window.location.pathname === new URL(link.href).pathname) {
    sidebarItem.classList.add('active');
  }
  
  return sidebarItem;
}

/**
 * Creates the sidebar from fragment content
 * @param {Element} fragment The loaded fragment
 * @returns {Element} The sidebar element
 */
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
  
  if (currentSection.length > 0) {
    fragmentSections.push(currentSection);
  }

  if (fragmentSections.length === 0) {
    const allItems = fragment.querySelectorAll('li, p');
    if (allItems.length > 0) {
      fragmentSections.push(Array.from(allItems));
    }
  }

  fragmentSections.forEach((sectionData, index) => {
    const section = document.createElement('div');
    section.className = 'sidebar-section';
    
    let title = '';
    let items = sectionData;
    
    if (sectionData[0]?.type === 'title') {
      title = sectionData[0].content;
      items = sectionData.slice(1);
      
      const sectionTitle = document.createElement('div');
      sectionTitle.className = 'sidebar-section-title';
      sectionTitle.textContent = title;
      section.appendChild(sectionTitle);
    }
    
    items.forEach((item) => {
      const sidebarItem = createSidebarItem(item);
      section.appendChild(sidebarItem);
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

/**
 * Toggles the sidebar between full and mini mode
 */
function toggleSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const hamburger = document.querySelector('.hamburger-menu');
  
  if (sidebar && hamburger) {
    const isMobile = window.innerWidth <= 1024;
    
    if (isMobile) {
      // Mobile: toggle sidebar visibility
      sidebar.classList.toggle('mobile-open');
      document.body.classList.toggle('mobile-sidebar-open');
      hamburger.classList.toggle('active');
    } else {
      // Desktop: toggle mini mode
      sidebar.classList.toggle('mini');
      hamburger.classList.toggle('active');
      
      if (sidebar.classList.contains('mini')) {
        document.body.classList.remove('sidebar-full');
        document.body.classList.add('sidebar-mini');
      } else {
        document.body.classList.remove('sidebar-mini');
        document.body.classList.add('sidebar-full');
      }
    }
  }
}

/**
 * Closes mobile sidebar when clicking outside
 */
function setupMobileSidebarClose() {
  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 1024) {
      const sidebar = document.querySelector('.sidebar');
      const hamburger = document.querySelector('.hamburger-menu');
      
      if (sidebar && sidebar.classList.contains('mobile-open')) {
        if (!sidebar.contains(e.target) && !hamburger.contains(e.target)) {
          sidebar.classList.remove('mobile-open');
          document.body.classList.remove('mobile-sidebar-open');
          hamburger.classList.remove('active');
        }
      }
    }
  });
}

/**
 * Loads and decorates the header with navbar and sidebar
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // Load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const navFragment = await loadFragment(navPath);

  // Load sidebar as fragment
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

  // Create navbar container
  const navbarContainer = document.createElement('div');
  navbarContainer.className = 'navbar-container';

  // LEFT SECTION
  const navbarLeft = document.createElement('div');
  navbarLeft.className = 'navbar-left';

  const hamburger = document.createElement('button');
  hamburger.className = 'hamburger-menu';
  hamburger.setAttribute('aria-label', 'Toggle menu');
  hamburger.setAttribute('type', 'button');
  hamburger.innerHTML = `
    <span class="hamburger-line"></span>
    <span class="hamburger-line"></span>
    <span class="hamburger-line"></span>
  `;
  
  hamburger.addEventListener('click', toggleSidebar);
  navbarLeft.appendChild(hamburger);

  const logoLink = document.createElement('a');
  logoLink.href = '/';
  logoLink.className = 'navbar-logo';
  if (logoElement) {
    logoLink.appendChild(logoElement.cloneNode(true));
  } else {
    logoLink.textContent = 'VidTube';
  }
  navbarLeft.appendChild(logoLink);

  // CENTER SECTION
  const navbarCenter = document.createElement('div');
  navbarCenter.className = 'navbar-center';

  const searchForm = document.createElement('form');
  searchForm.className = 'search-form';
  searchForm.setAttribute('role', 'search');
  searchForm.innerHTML = `
    <input 
      type="text" 
      class="search-input" 
      placeholder="Search" 
      aria-label="Search"
    >
    <button type="submit" class="search-button" aria-label="Search">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
  `;

  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = searchForm.querySelector('.search-input').value;
    if (query.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(query)}`;
    }
  });

  navbarCenter.appendChild(searchForm);

  const voiceButton = document.createElement('button');
  voiceButton.className = 'voice-search-button';
  voiceButton.setAttribute('type', 'button');
  voiceButton.setAttribute('aria-label', 'Search with your voice');
  voiceButton.innerHTML = `
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 15C13.66 15 15 13.66 15 12V6C15 4.34 13.66 3 12 3C10.34 3 9 4.34 9 6V12C9 13.66 10.34 15 12 15Z"/>
      <path d="M17 12C17 14.76 14.76 17 12 17C9.24 17 7 14.76 7 12H5C5 15.53 7.61 18.43 11 18.92V22H13V18.92C16.39 18.43 19 15.53 19 12H17Z"/>
    </svg>
  `;

  navbarCenter.appendChild(voiceButton);

  // RIGHT SECTION
  const navbarRight = document.createElement('div');
  navbarRight.className = 'navbar-right';

  const profileButton = document.createElement('button');
  profileButton.className = 'profile-button';
  profileButton.setAttribute('type', 'button');
  profileButton.setAttribute('aria-label', 'Account menu');
  
  if (profileElement) {
    profileButton.appendChild(profileElement.cloneNode(true));
  } else {
    profileButton.innerHTML = `
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill="currentColor"/>
        <circle cx="12" cy="9" r="3" fill="white"/>
        <path d="M17 18C17 15.79 14.76 14 12 14C9.24 14 7 15.79 7 18" stroke="white" stroke-width="2" fill="none"/>
      </svg>
    `;
  }

  navbarRight.appendChild(profileButton);

  // Assemble navbar
  navbarContainer.appendChild(navbarLeft);
  navbarContainer.appendChild(navbarCenter);
  navbarContainer.appendChild(navbarRight);

  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.setAttribute('aria-label', 'Main navigation');
  nav.appendChild(navbarContainer);

  // Create sidebar
  const sidebar = createSidebar(sidebarFragment);

  // Assemble
  block.appendChild(nav);
  block.appendChild(sidebar);

  // Set initial state
  document.body.classList.add('sidebar-full');
  
  // Setup mobile sidebar close
  setupMobileSidebarClose();
}