document.addEventListener('DOMContentLoaded', () => {
    // Tab switching functionality
    const navItems = document.querySelectorAll('.nav-item');
    const contentSections = document.querySelectorAll('.content-section');

    // Function to switch tabs
    function switchTab(tabId) {
        // Hide all content sections
        contentSections.forEach(section => {
            section.classList.remove('active');
        });

        // Show the selected content section
        const activeSection = document.getElementById(tabId);
        if (activeSection) {
            activeSection.classList.add('active');
        }

        // Update active nav item
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-tab') === tabId) {
                item.classList.add('active');
            }
        });

        // Update URL hash
        history.pushState(null, null, `#${tabId}`);
    }


    // Add click event listeners to nav items
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const tabId = item.getAttribute('data-tab');
            switchTab(tabId);
        });
    });

    // Check URL hash on page load
    const initialTab = window.location.hash.substring(1);
    if (initialTab) {
        switchTab(initialTab);
    } else {
        // Default to home if no hash
        switchTab('home-content');
    }

    // Play/Pause button functionality
    const playButton = document.querySelector('.fa-play')?.parentElement;
    let isPlaying = false;
    
    if (playButton) {
        playButton.addEventListener('click', () => {
            const icon = playButton.querySelector('i');
            isPlaying = !isPlaying;
            
            if (isPlaying) {
                icon.classList.remove('fa-play');
                icon.classList.add('fa-pause');
            } else {
                icon.classList.remove('fa-pause');
                icon.classList.add('fa-play');
            }
        });
    }

    // Add hover effect for glass cards
    const glassCards = document.querySelectorAll('.glass-card');
    
    glassCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // Add parallax effect to background
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        document.body.style.setProperty('--mouse-x', x);
        document.body.style.setProperty('--mouse-y', y);
    });

    // Prevent content shift when scrollbar appears/disappears
    function handleResize() {
        document.documentElement.style.setProperty('--scrollbar-width', (window.innerWidth - document.documentElement.clientWidth) + 'px');
    }
    
    // Initial call
    handleResize();
    window.addEventListener('resize', handleResize);
});
