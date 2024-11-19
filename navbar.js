document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const wipeOverlay = document.querySelector('.wipe-overlay');
    const mainContent = document.querySelector('main');
    const footer = document.querySelector('footer');
    
    // Calculate menu height for proper content displacement
    const getMenuHeight = () => {
        return mobileMenu.scrollHeight;
    };

    menuToggle.addEventListener('click', function() {
        menuToggle.classList.toggle('active');
        
        requestAnimationFrame(() => {
            mobileMenu.classList.toggle('active');
            wipeOverlay.classList.toggle('active');
            
            const menuHeight = getMenuHeight();
            
            if (mobileMenu.classList.contains('active')) {
                // Opening animation
                mainContent.style.transition = 'transform 0.6s ease-in';
                footer.style.transition = 'transform 0.6s ease-in';
                mainContent.style.transform = `translateY(${menuHeight}px)`;
                footer.style.transform = `translateY(${menuHeight}px)`;
                document.body.style.overflow = 'hidden';
            } else {
                // Closing animation
                mainContent.style.transition = 'transform 0.6s ease-out';
                footer.style.transition = 'transform 0.6s ease-out';
                mainContent.style.transform = 'translateY(0)';
                footer.style.transform = 'translateY(0)';
                document.body.style.overflow = '';
            }
        });
    });
});