document.addEventListener('DOMContentLoaded', () => {
    // Tab switching functionality
    const navItems = document.querySelectorAll('.nav-item');
    const contentSections = document.querySelectorAll('.content-section');
    const floatingNowPlaying = document.getElementById('floating-now-playing');
    let nowPlayingObserver;
    let currentTab = 'home-content'; // Track current tab

    // Function to set up Intersection Observer for Now Playing card
    function setupNowPlayingObserver() {
        const nowPlayingCard = document.querySelector('#home-content .now-playing-card');
        
        // If we're not on the home page, show the floating bar
        if (currentTab !== 'home-content') {
            showFloatingBar();
            return;
        }

        // If there's no Now Playing card on the page, show the floating bar
        if (!nowPlayingCard) {
            showFloatingBar();
            return;
        }

        // Disconnect previous observer if it exists
        if (nowPlayingObserver) {
            nowPlayingObserver.disconnect();
        }

        // Create new observer
        nowPlayingObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Card is in view, hide floating bar
                        hideFloatingBar();
                    } else {
                        // Card is out of view, show floating bar
                        showFloatingBar();
                    }
                });
            },
            {
                threshold: 0.1, // Trigger when 10% of the card is visible
                rootMargin: '-80px 0px 0px 0px' // Adjust this to control when the floating bar appears
            }
        );

        // Start observing the Now Playing card
        nowPlayingObserver.observe(nowPlayingCard);
    }


    // Function to show the floating Now Playing bar
    function showFloatingBar() {
        if (floatingNowPlaying) {
            floatingNowPlaying.classList.add('visible');
        }
    }


    // Function to hide the floating Now Playing bar
    function hideFloatingBar() {
        if (floatingNowPlaying) {
            floatingNowPlaying.classList.remove('visible');
        }
    }

    // Function to switch tabs
    function switchTab(tabId) {
        // Update current tab
        currentTab = tabId;
        
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
        
        // Set up the observer for the Now Playing card when on home tab
        if (tabId === 'home-content') {
            // Small delay to ensure the content is loaded
            setTimeout(setupNowPlayingObserver, 100);
        } else {
            // On other tabs, always show the floating bar
            showFloatingBar();
        }
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
    
    // Initial setup for Now Playing observer
    if (currentTab === 'home-content') {
        // Wait for the home content to be loaded
        const checkHomeContent = setInterval(() => {
            const homeContent = document.getElementById('home-content');
            if (homeContent && homeContent.children.length > 0) {
                clearInterval(checkHomeContent);
                setupNowPlayingObserver();
            }
        }, 100);
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
