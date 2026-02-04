export default function decorate(block) {
    // Get logo and optional profile image
    const rows = [...block.children];
    const logo = rows[0]?.querySelector('picture, img');
    const profileImage = rows[1]?.querySelector('picture, img');
    
    // Clear the block
    block.innerHTML = '';
    
    // Build the navigation HTML
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
          <input 
            type="text" 
            class="search-input" 
            placeholder="Search" 
            aria-label="Search"
          />
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
    
    // CRITICAL FIX: Move navbar to body level to escape wrapper
    moveToBodyLevel(block);
    
    // Setup sticky
    makeSticky(block);
    
    // Add event listeners
    setupEventListeners(block);
  }
  
  // Move navbar outside of wrapper to body level
  function moveToBodyLevel(block) {
    // Wait for DOM to be ready
    setTimeout(() => {
      const body = document.body;
      const main = document.querySelector('main');
      
      // Clone the block
      const navClone = block.cloneNode(true);
      navClone.id = 'global-navbar';
      
      // Insert at the very top of body, before main
      if (main) {
        body.insertBefore(navClone, main);
      } else {
        body.insertBefore(navClone, body.firstChild);
      }
      
      // Hide the original block
      block.style.display = 'none';
      
      // Apply sticky to the cloned navbar
      makeSticky(navClone);
      setupEventListeners(navClone);
      
      console.log('Navbar moved to body level for sticky positioning');
    }, 100);
  }
  
  // Force sticky positioning
  function makeSticky(block) {
    block.style.position = 'sticky';
    block.style.top = '0';
    block.style.zIndex = '1000';
    block.style.backgroundColor = '#fff';
    block.style.width = '100%';
    block.style.margin = '0';
    block.style.padding = '0';
    
    // Fallback to fixed on scroll
    let isFixed = false;
    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      if (scrollTop > 0 && !isFixed) {
        block.style.position = 'fixed';
        block.style.top = '0';
        block.style.left = '0';
        block.style.right = '0';
        isFixed = true;
      } else if (scrollTop === 0 && isFixed) {
        block.style.position = 'sticky';
        isFixed = false;
      }
    });
  }
  
  // Setup event listeners
  function setupEventListeners(block) {
    const hamburger = block.querySelector('.hamburger-menu');
    const searchForm = block.querySelector('.search-form');
    const voiceButton = block.querySelector('.voice-search-button');
    
    hamburger?.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      console.log('Menu clicked');
    });
    
    searchForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = block.querySelector('.search-input').value;
      if (query.trim()) {
        console.log('Searching for:', query);
      }
    });
    
    voiceButton?.addEventListener('click', () => {
      console.log('Voice search clicked');
      alert('Voice search coming soon!');
    });
  }
  
  
  
  
  
  
  