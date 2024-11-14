document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const wipeOverlay = document.querySelector('.wipe-overlay');
    
    menuToggle.addEventListener('click', function() {
        menuToggle.classList.toggle('active');
        requestAnimationFrame(() => {
            mobileMenu.classList.toggle('active');
            wipeOverlay.classList.toggle('active');
        });
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });
});