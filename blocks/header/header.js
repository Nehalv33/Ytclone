export default async function decorate(block) {
  // Clear the header block completely
  block.innerHTML = '';
  
  // Hide the block
  block.style.display = 'none';
  
  // Also hide the parent header element
  const header = block.closest('header');
  if (header) {
    header.style.display = 'none';
    header.style.height = '0';
    header.style.margin = '0';
    header.style.padding = '0';
  }
  
  console.log('Default header disabled - using custom nav-bar instead');
}