// --- CONFIGURATION OBJECT ---
const CONFIG = {
    SONG_TITLE: "How Far I'll Go",
    ARTIST_NAME: "Auli'i Cravalho",
    YOUTUBE_URL: "https://www.youtube.com/watch?v=cPAbx5kgCJo",
    COVER_IMAGE: "assets/images/australia.jpg",
    DEFAULT_VOLUME: 0.5,

    SECTION_WAVES: {
        'about': { name: 'About', waves: 10 },
        'education': { name: 'Education', waves: 10 },
        'projects': { name: 'Academic Projects', waves: 10 },
        'awards': { name: 'Achievements', waves: 20 },
        'skills': { name: 'Skills', waves: 10 },
        'message': { name: 'Bottle Message', waves: 10 },
        'contact': { name: 'Contact', waves: 10 }
    },
    MUSIC_WAVES: 15,
    FLIP_CARD_WAVES: 5,
    TOTAL_FLIP_CARDS: 15, // 12 old + 3 Academic Projects
    MESSAGE_SUBMIT_WAVES: 15,
    
    LEVELS: [
        { level: 1, title: 'Apprentice Sailor', icon: '⛵', minWaves: 0, nextWaves: 20 },
        { level: 2, title: 'Navigator', icon: '🧭', minWaves: 20, nextWaves: 50 },
        { level: 3, title: 'First Mate', icon: '⚓', minWaves: 50, nextWaves: 90 },
        { level: 4, title: 'Captain', icon: '🚢', minWaves: 90, nextWaves: 140 },
        { level: 5, title: 'Ocean Conqueror', icon: '🏝️', minWaves: 140, nextWaves: 185 }
    ]
};

function getMaxWaves() {
    let sectionTotal = Object.values(CONFIG.SECTION_WAVES).reduce((sum, item) => sum + item.waves, 0);
    let cardsTotal = CONFIG.FLIP_CARD_WAVES * CONFIG.TOTAL_FLIP_CARDS;
    return sectionTotal + CONFIG.MUSIC_WAVES + cardsTotal + CONFIG.MESSAGE_SUBMIT_WAVES;
}

// --- DOM ELEMENTS ---
const navbar = document.getElementById('navbar');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const navItems = document.querySelectorAll('.nav-links a');
const reveals = document.querySelectorAll('.scroll-reveal');

// --- NAVIGATION TOGGLE (Mobile) ---
if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = menuToggle.querySelector('i');
        if (icon) {
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    });
}

navItems.forEach(item => {
    item.addEventListener('click', () => {
        navLinks.classList.remove('active');
        if (menuToggle) {
            const icon = menuToggle.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    });
});

// --- SCROLL EFFECTS & NAVBAR ACTIVE LINK HIGHLIGHT ---
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    let current = '';
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navItems.forEach(a => {
        a.classList.remove('active');
        if (a.getAttribute('href').includes(current)) {
            a.classList.add('active');
        }
    });

    reveals.forEach(reveal => {
        const windowHeight = window.innerHeight;
        const elementTop = reveal.getBoundingClientRect().top;
        const elementVisible = 100;
        if (elementTop < windowHeight - elementVisible) {
            reveal.classList.add('visible');
        }
    });
});

window.dispatchEvent(new Event('scroll'));

// --- CAROUSEL & LIGHTBOX LOGIC ---
const carouselContainer = document.getElementById('about-carousel');
const track = document.querySelector('.carousel-track');
const galleryLightbox = document.getElementById('gallery-lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxClose = document.getElementById('lightbox-close');
const lightboxPrev = document.getElementById('lightbox-prev');
const lightboxNext = document.getElementById('lightbox-next');

if (track && carouselContainer) {
    const slides = Array.from(track.children);
    const nextButton = carouselContainer.querySelector('.next-btn');
    const prevButton = carouselContainer.querySelector('.prev-btn');
    const nav = carouselContainer.querySelector('.carousel-nav');

    if (slides.length > 0) {
        if (nav) nav.innerHTML = '';

        slides.forEach((_, index) => {
            if (nav) {
                const dot = document.createElement('span');
                dot.classList.add('dot');
                if (index === 0) dot.classList.add('active');
                dot.dataset.index = index;
                dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
                nav.appendChild(dot);
            }
        });
        const dots = nav ? Array.from(nav.children) : [];

        let currentSlideIndex = 0;
        let autoPlayTimer = null;
        let lastFocusedElement = null;

        function updateCarousel(index) {
            slides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));
            
            slides[index].classList.add('active');
            if (dots[index]) dots[index].classList.add('active');
            currentSlideIndex = index;
        }

        function nextSlide() {
            let nextIndex = currentSlideIndex + 1;
            if (nextIndex >= slides.length) nextIndex = 0;
            updateCarousel(nextIndex);
        }

        function prevSlide() {
            let prevIndex = currentSlideIndex - 1;
            if (prevIndex < 0) prevIndex = slides.length - 1;
            updateCarousel(prevIndex);
        }

        if (nextButton) {
            nextButton.addEventListener('click', (e) => {
                e.stopPropagation();
                nextSlide();
            });
        }

        if (prevButton) {
            prevButton.addEventListener('click', (e) => {
                e.stopPropagation();
                prevSlide();
            });
        }

        dots.forEach(dot => {
            dot.addEventListener('click', e => {
                e.stopPropagation();
                const index = parseInt(e.target.dataset.index, 10);
                updateCarousel(index);
            });
        });

        // Touch swipe support for Carousel
        let touchStartX = 0;
        let touchEndX = 0;

        carouselContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        carouselContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });

        function handleSwipe() {
            const threshold = 40;
            const diffX = touchEndX - touchStartX;
            if (Math.abs(diffX) > threshold) {
                if (diffX < 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
        }

        // Auto-play interval
        function startAutoPlay() {
            stopAutoPlay();
            autoPlayTimer = setInterval(nextSlide, 5000);
        }

        function stopAutoPlay() {
            if (autoPlayTimer) clearInterval(autoPlayTimer);
        }

        startAutoPlay();

        carouselContainer.addEventListener('mouseenter', stopAutoPlay);
        carouselContainer.addEventListener('mouseleave', startAutoPlay);

        // Keyboard navigation for Carousel when focused
        carouselContainer.addEventListener('keydown', (e) => {
            if (galleryLightbox && !galleryLightbox.classList.contains('hidden')) return;
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                nextSlide();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                prevSlide();
            } else if (e.key === 'Enter' || e.key === ' ') {
                if (e.target === carouselContainer || e.target.classList.contains('carousel-img') || e.target.classList.contains('lightbox-trigger-badge')) {
                    e.preventDefault();
                    openLightbox(currentSlideIndex);
                }
            }
        });

        // LIGHTBOX ENGINE
        function updateLightboxContent(index) {
            if (index < 0 || index >= slides.length) return;
            const activeSlide = slides[index];
            const imgEl = activeSlide.querySelector('img');
            const captionWrapper = activeSlide.querySelector('.carousel-caption-wrapper');

            if (imgEl && lightboxImg) {
                lightboxImg.src = imgEl.src;
                lightboxImg.alt = imgEl.alt;
            }

            if (captionWrapper && lightboxCaption) {
                const title = captionWrapper.querySelector('.carousel-caption-title')?.textContent || '';
                const subtitle = captionWrapper.querySelector('.carousel-caption-subtitle')?.textContent || '';
                lightboxCaption.innerHTML = `<strong>${title}</strong>${subtitle ? ` &bull; ${subtitle}` : ''}`;
            }
        }

        function openLightbox(index) {
            if (!galleryLightbox) return;
            lastFocusedElement = document.activeElement;
            updateCarousel(index);
            updateLightboxContent(index);
            galleryLightbox.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            if (lightboxClose) lightboxClose.focus();
            stopAutoPlay();
        }

        function closeLightbox() {
            if (!galleryLightbox) return;
            galleryLightbox.classList.add('hidden');
            const splashScreen = document.getElementById('splash-screen');
            if (!splashScreen || splashScreen.style.display === 'none') {
                document.body.style.overflow = '';
            }
            if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
                lastFocusedElement.focus();
            }
            startAutoPlay();
        }

        carouselContainer.addEventListener('click', (e) => {
            if (e.target.closest('.carousel-btn') || e.target.closest('.carousel-nav')) {
                return;
            }
            openLightbox(currentSlideIndex);
        });

        if (lightboxClose) {
            lightboxClose.addEventListener('click', closeLightbox);
        }

        if (lightboxPrev) {
            lightboxPrev.addEventListener('click', (e) => {
                e.stopPropagation();
                let prevIdx = currentSlideIndex - 1;
                if (prevIdx < 0) prevIdx = slides.length - 1;
                updateCarousel(prevIdx);
                updateLightboxContent(prevIdx);
            });
        }

        if (lightboxNext) {
            lightboxNext.addEventListener('click', (e) => {
                e.stopPropagation();
                let nextIdx = currentSlideIndex + 1;
                if (nextIdx >= slides.length) nextIdx = 0;
                updateCarousel(nextIdx);
                updateLightboxContent(nextIdx);
            });
        }

        if (galleryLightbox) {
            galleryLightbox.addEventListener('click', (e) => {
                if (e.target === galleryLightbox || e.target.classList.contains('lightbox-content')) {
                    closeLightbox();
                }
            });

            let lbTouchStartX = 0;
            let lbTouchEndX = 0;

            galleryLightbox.addEventListener('touchstart', (e) => {
                lbTouchStartX = e.changedTouches[0].screenX;
            }, { passive: true });

            galleryLightbox.addEventListener('touchend', (e) => {
                lbTouchEndX = e.changedTouches[0].screenX;
                const threshold = 40;
                const diffX = lbTouchEndX - lbTouchStartX;
                if (Math.abs(diffX) > threshold) {
                    if (diffX < 0) {
                        let nextIdx = currentSlideIndex + 1;
                        if (nextIdx >= slides.length) nextIdx = 0;
                        updateCarousel(nextIdx);
                        updateLightboxContent(nextIdx);
                    } else {
                        let prevIdx = currentSlideIndex - 1;
                        if (prevIdx < 0) prevIdx = slides.length - 1;
                        updateCarousel(prevIdx);
                        updateLightboxContent(prevIdx);
                    }
                }
            }, { passive: true });
        }

        document.addEventListener('keydown', (e) => {
            if (!galleryLightbox || galleryLightbox.classList.contains('hidden')) return;

            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowLeft') {
                let prevIdx = currentSlideIndex - 1;
                if (prevIdx < 0) prevIdx = slides.length - 1;
                updateCarousel(prevIdx);
                updateLightboxContent(prevIdx);
            } else if (e.key === 'ArrowRight') {
                let nextIdx = currentSlideIndex + 1;
                if (nextIdx >= slides.length) nextIdx = 0;
                updateCarousel(nextIdx);
                updateLightboxContent(nextIdx);
            }
        });
    }
}

// --- MESSAGE IN A BOTTLE FORM (ANONYMOUS) ---
const bottleForm = document.getElementById('bottle-form');
const messageText = document.getElementById('message-text');
const charCount = document.getElementById('char-count');
const formStatus = document.getElementById('form-status');
const submitBtn = document.getElementById('submit-btn');
const bottleAnimation = document.getElementById('bottle-animation');

if (messageText && charCount) {
    messageText.addEventListener('input', () => {
        charCount.textContent = messageText.value.length;
    });
}

if (bottleForm) {
    bottleForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const honeypot = document.getElementById('honeypot').value;
        if (honeypot) return;

        const lastSent = localStorage.getItem('lastMessageTime');
        const now = Date.now();
        if (lastSent && now - parseInt(lastSent) < 60000) {
            formStatus.textContent = "Please wait a minute before sending another message. The tide is currently low.";
            formStatus.className = 'form-status status-error';
            return;
        }

        const message = messageText.value.trim();
        if (message.length === 0 || message.length > 500) {
            formStatus.textContent = "Message must be between 1 and 500 characters.";
            formStatus.className = 'form-status status-error';
            return;
        }

        const moodInput = document.querySelector('input[name="mood"]:checked');
        const mood = moodInput ? moodInput.value : '';

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Throwing...</span> <i class="fas fa-spinner fa-spin"></i>';

        try {
            if (window.db) {
                await window.db.collection('messages').add({
                    text: message,
                    mood: mood,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                });
            } else {
                console.log("Firebase not configured. Running in Demo Mode.");
                await new Promise(r => setTimeout(r, 1000));
            }

            localStorage.setItem('lastMessageTime', now.toString());
            formStatus.textContent = "Your message is adrift in the sea!";
            formStatus.className = 'form-status status-success';
            
            triggerMessageBonus();

            bottleForm.style.display = 'none';
            bottleAnimation.classList.remove('hidden');

            bottleForm.reset();
            charCount.textContent = '0';
            
            setTimeout(() => {
                bottleAnimation.classList.add('hidden');
                bottleForm.style.display = 'block';
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<span>Throw into the sea</span> <i class="fas fa-water"></i>';
                formStatus.textContent = '';
            }, 3000);

        } catch (error) {
            console.error("Error sending message:", error);
            formStatus.textContent = "The waves pushed it back. Try again later.";
            formStatus.className = 'form-status status-error';
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span>Throw into the sea</span> <i class="fas fa-water"></i>';
        }
    });
}

// --- CONTACT FORM (SEND A MESSAGE) ---
const contactForm = document.getElementById('contact-form');
const contactName = document.getElementById('contact-name');
const contactEmail = document.getElementById('contact-email');
const contactSubject = document.getElementById('contact-subject');
const contactMessage = document.getElementById('contact-message');
const contactCharCount = document.getElementById('contact-char-count');
const contactSubmitBtn = document.getElementById('contact-submit-btn');
const contactStatus = document.getElementById('contact-form-status');

if (contactMessage && contactCharCount) {
    contactMessage.addEventListener('input', () => {
        contactCharCount.textContent = contactMessage.value.length;
    });
}

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        document.getElementById('error-name').textContent = '';
        document.getElementById('error-email').textContent = '';
        document.getElementById('error-subject').textContent = '';
        document.getElementById('error-message').textContent = '';
        contactStatus.textContent = '';
        contactStatus.className = 'form-status';

        const honeypot = document.getElementById('contact-honeypot').value;
        if (honeypot) return;

        const nameVal = contactName.value.trim();
        const emailVal = contactEmail.value.trim();
        const subjectVal = contactSubject.value.trim();
        const messageVal = contactMessage.value.trim();
        let isValid = true;

        if (!nameVal) {
            document.getElementById('error-name').textContent = 'Please enter your name.';
            isValid = false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailVal || !emailRegex.test(emailVal)) {
            document.getElementById('error-email').textContent = 'Please enter a valid email address.';
            isValid = false;
        }

        if (!subjectVal) {
            document.getElementById('error-subject').textContent = 'Please enter a message subject.';
            isValid = false;
        }

        if (!messageVal) {
            document.getElementById('error-message').textContent = 'Please enter your message.';
            isValid = false;
        }

        if (!isValid) return;

        contactSubmitBtn.disabled = true;
        contactSubmitBtn.innerHTML = '<span>Sending...</span> <i class="fas fa-spinner fa-spin"></i>';

        const formspreeEndpoint = "[YOUR_FORMSPREE_URL]";
        
        try {
            if (formspreeEndpoint && !formspreeEndpoint.includes('[YOUR_FORMSPREE_URL]')) {
                const response = await fetch(formspreeEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        name: nameVal,
                        email: emailVal,
                        subject: subjectVal,
                        message: messageVal
                    })
                });

                if (response.ok) {
                    contactStatus.textContent = "Thank you! Your message has been sent successfully.";
                    contactStatus.className = 'form-status status-success';
                    contactForm.reset();
                    if (contactCharCount) contactCharCount.textContent = '0';
                } else {
                    throw new Error("Formspree response not OK");
                }
            } else {
                console.log("Formspree endpoint not set. Opening mailto fallback...");
                const mailtoLink = `mailto:khanhlinhvn.ftu@gmail.com?subject=${encodeURIComponent(subjectVal)}&body=${encodeURIComponent("Name: " + nameVal + "\nEmail: " + emailVal + "\n\nMessage:\n" + messageVal)}`;
                window.location.href = mailtoLink;
                contactStatus.textContent = "Opened mail client fallback! Message drafted to khanhlinhvn.ftu@gmail.com.";
                contactStatus.className = 'form-status status-success';
                contactForm.reset();
                if (contactCharCount) contactCharCount.textContent = '0';
            }
        } catch (err) {
            console.error("Error submitting contact form:", err);
            const mailtoLink = `mailto:khanhlinhvn.ftu@gmail.com?subject=${encodeURIComponent(subjectVal)}&body=${encodeURIComponent("Name: " + nameVal + "\nEmail: " + emailVal + "\n\nMessage:\n" + messageVal)}`;
            window.location.href = mailtoLink;
            contactStatus.textContent = "Network error. Mail client opened as fallback!";
            contactStatus.className = 'form-status status-success';
        } finally {
            contactSubmitBtn.disabled = false;
            contactSubmitBtn.innerHTML = '<span>Send Message</span> <i class="fas fa-paper-plane"></i>';
        }
    });
}

// --- MUSIC PLAYER PILL MODULE & YOUTUBE API ---
let ytPlayer;
let isMusicPlaying = false;
let isPlayerReady = false;
let userClickedEnter = false;
let playerVolume = CONFIG.DEFAULT_VOLUME;
let previousVolume = CONFIG.DEFAULT_VOLUME;
let isMuted = false;
let isPlayerExpanded = false;

// DOM references for Player Pill
const playerPill = document.getElementById('music-player-pill');
const vinylDisc = document.getElementById('vinyl-disc');
const playerDiscBtn = document.getElementById('player-disc-btn');
const playerPlayBtn = document.getElementById('player-play-btn');
const playerMuteBtn = document.getElementById('player-mute-btn');
const playerVolumeSlider = document.getElementById('player-volume-slider');
const playerCollapseBtn = document.getElementById('player-collapse-btn');
const playerStatusText = document.getElementById('player-status-text');
const playerTitleText = document.getElementById('player-title-text');
const playerArtistText = document.getElementById('player-artist-text');
const playerYtLink = document.getElementById('player-yt-link');
const splashScreen = document.getElementById('splash-screen');
const enterBtn = document.getElementById('enter-btn');

const musicVideoIds = ['cPAbx5kgCJo', 'gme8u3a-g4A', 'L0MK7qz13bU'];
let currentVideoIndex = 0;

document.body.style.overflow = 'hidden';

// Load stored Volume and Expansion preferences
try {
    const savedVol = localStorage.getItem('portfolio_player_volume');
    if (savedVol !== null) {
        playerVolume = parseFloat(savedVol);
        if (isNaN(playerVolume) || playerVolume < 0 || playerVolume > 1) {
            playerVolume = CONFIG.DEFAULT_VOLUME;
        }
    }
    isPlayerExpanded = localStorage.getItem('portfolio_player_expanded') === 'true';
} catch (e) {
    console.log("Local storage not accessible for player config");
}

function initPlayer() {
    if (playerTitleText) playerTitleText.textContent = CONFIG.SONG_TITLE;
    if (playerArtistText) playerArtistText.textContent = CONFIG.ARTIST_NAME;
    if (playerYtLink) playerYtLink.href = CONFIG.YOUTUBE_URL;
    
    // Set custom cover image if available
    if (CONFIG.COVER_IMAGE && vinylDisc) {
        vinylDisc.style.backgroundImage = `url('${CONFIG.COVER_IMAGE}')`;
        vinylDisc.style.backgroundSize = 'cover';
    }

    // Set initial volume slider UI
    if (playerVolumeSlider) {
        playerVolumeSlider.value = playerVolume;
        playerVolumeSlider.setAttribute('aria-valuenow', Math.round(playerVolume * 100));
    }

    // Set initial expanded/collapsed state
    toggleExpand(isPlayerExpanded);

    // Event listeners
    if (playerDiscBtn) {
        playerDiscBtn.addEventListener('click', () => {
            toggleExpand(!isPlayerExpanded);
        });
    }
    if (playerCollapseBtn) {
        playerCollapseBtn.addEventListener('click', () => {
            toggleExpand(false);
        });
    }
    if (playerPlayBtn) {
        playerPlayBtn.addEventListener('click', () => {
            togglePlay();
        });
    }
    if (playerMuteBtn) {
        playerMuteBtn.addEventListener('click', () => {
            toggleMute();
        });
    }
    if (playerVolumeSlider) {
        playerVolumeSlider.addEventListener('input', (e) => {
            setVolume(parseFloat(e.target.value));
        });
    }
}

function toggleExpand(expandState) {
    isPlayerExpanded = (typeof expandState === 'boolean') ? expandState : !isPlayerExpanded;
    if (playerPill) {
        if (isPlayerExpanded) {
            playerPill.classList.remove('collapsed');
        } else {
            playerPill.classList.add('collapsed');
        }
    }
    try {
        localStorage.setItem('portfolio_player_expanded', isPlayerExpanded.toString());
    } catch (e) {}
}

function togglePlay() {
    if (!ytPlayer || typeof ytPlayer.getPlayerState !== 'function') return;
    
    if (isMusicPlaying) {
        ytPlayer.pauseVideo();
    } else {
        startMusicPlayback();
    }
}

function setVolume(vol) {
    vol = Math.max(0, Math.min(1, vol));
    playerVolume = vol;
    
    if (vol > 0) {
        isMuted = false;
    }

    if (ytPlayer && typeof ytPlayer.setVolume === 'function') {
        ytPlayer.setVolume(vol * 100);
    }

    if (playerVolumeSlider) {
        playerVolumeSlider.value = vol;
        playerVolumeSlider.setAttribute('aria-valuenow', Math.round(vol * 100));
    }

    updateSpeakerIcon(vol);

    try {
        localStorage.setItem('portfolio_player_volume', vol.toString());
    } catch (e) {}
}

function toggleMute() {
    if (isMuted || playerVolume === 0) {
        const restoreVol = (previousVolume > 0) ? previousVolume : CONFIG.DEFAULT_VOLUME;
        isMuted = false;
        setVolume(restoreVol);
    } else {
        previousVolume = playerVolume;
        isMuted = true;
        setVolume(0);
    }
}

function updateSpeakerIcon(vol) {
    if (!playerMuteBtn) return;
    const icon = playerMuteBtn.querySelector('i');
    if (!icon) return;

    if (vol === 0 || isMuted) {
        icon.className = 'fas fa-volume-xmark';
        playerMuteBtn.setAttribute('aria-label', 'Unmute');
        playerMuteBtn.title = 'Unmute';
    } else if (vol < 0.5) {
        icon.className = 'fas fa-volume-low';
        playerMuteBtn.setAttribute('aria-label', 'Mute');
        playerMuteBtn.title = 'Mute';
    } else {
        icon.className = 'fas fa-volume-high';
        playerMuteBtn.setAttribute('aria-label', 'Mute');
        playerMuteBtn.title = 'Mute';
    }
}

function updatePlayerUI(playing, paused, error = false) {
    // Disc spin animation
    if (vinylDisc) {
        if (playing) {
            vinylDisc.classList.add('playing');
        } else {
            vinylDisc.classList.remove('playing');
        }
    }

    // Play button icon
    if (playerPlayBtn) {
        const icon = playerPlayBtn.querySelector('i');
        if (error) {
            playerPlayBtn.disabled = true;
            if (icon) icon.className = 'fas fa-play';
        } else if (playing) {
            playerPlayBtn.disabled = false;
            if (icon) icon.className = 'fas fa-pause';
            playerPlayBtn.setAttribute('aria-label', 'Pause');
            playerPlayBtn.title = 'Pause';
        } else {
            playerPlayBtn.disabled = false;
            if (icon) icon.className = 'fas fa-play';
            playerPlayBtn.setAttribute('aria-label', 'Play');
            playerPlayBtn.title = 'Play';
        }
    }

    // Subline status text
    if (playerStatusText) {
        if (error) {
            playerStatusText.textContent = "Unavailable";
            playerStatusText.className = "player-status-text unavailable";
        } else if (playing) {
            playerStatusText.textContent = "Playing";
            playerStatusText.className = "player-status-text playing";
        } else {
            playerStatusText.textContent = "Paused";
            playerStatusText.className = "player-status-text paused";
        }
    }

    updateSpeakerIcon(playerVolume);
}

function onYouTubeIframeAPIReady() {
    ytPlayer = new YT.Player('youtube-player', {
        height: '0',
        width: '0',
        videoId: musicVideoIds[currentVideoIndex],
        playerVars: {
            'autoplay': 0,
            'controls': 0,
            'loop': 1,
            'playlist': musicVideoIds[currentVideoIndex],
            'playsinline': 1,
            'start': 19,
            'origin': window.location.origin || '*'
        },
        events: {
            'onReady': onPlayerReady,
            'onError': onPlayerError,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    isPlayerReady = true;
    if (ytPlayer && typeof ytPlayer.setVolume === 'function') {
        ytPlayer.setVolume(playerVolume * 100);
    }
    
    if (userClickedEnter) {
        startMusicPlayback();
    }
}

function startMusicPlayback() {
    if (!ytPlayer) return;
    try {
        if (typeof ytPlayer.seekTo === 'function') {
            ytPlayer.seekTo(19, true);
        }
        if (typeof ytPlayer.playVideo === 'function') {
            ytPlayer.playVideo();
            isMusicPlaying = true;
            updatePlayerUI(true, false);
            triggerMusicBonus();
        }
    } catch (err) {
        console.error("Playback error:", err);
    }
}

function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.PLAYING) {
        isMusicPlaying = true;
        updatePlayerUI(true, false);
        triggerMusicBonus();
        if (typeof ytPlayer.getCurrentTime === 'function' && ytPlayer.getCurrentTime() < 18) {
            ytPlayer.seekTo(19, true);
        }
    } else if (event.data === YT.PlayerState.PAUSED) {
        isMusicPlaying = false;
        updatePlayerUI(false, true);
    }
}

function onPlayerError(event) {
    console.warn("YouTube player error code:", event.data);
    currentVideoIndex++;
    if (currentVideoIndex < musicVideoIds.length) {
        if (ytPlayer && typeof ytPlayer.loadVideoById === 'function') {
            ytPlayer.loadVideoById({
                videoId: musicVideoIds[currentVideoIndex],
                startSeconds: 19
            });
            return;
        }
    }
    updatePlayerUI(false, false, true);
}

if (enterBtn) {
    enterBtn.addEventListener('click', () => {
        userClickedEnter = true;
        
        document.body.style.overflow = '';
        document.body.classList.remove('splash-active');
        
        if (splashScreen) {
            splashScreen.style.opacity = '0';
            setTimeout(() => {
                splashScreen.style.display = 'none';
            }, 800);
        }
        
        if (isPlayerReady) {
            startMusicPlayback();
        }
    });
}

document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        if (isMusicPlaying && ytPlayer && typeof ytPlayer.pauseVideo === 'function') {
            ytPlayer.pauseVideo();
            updatePlayerUI(false, true);
        }
    } else {
        if (isMusicPlaying && ytPlayer && typeof ytPlayer.playVideo === 'function') {
            ytPlayer.playVideo();
            updatePlayerUI(true, false);
        }
    }
});

const waterOverlay = document.getElementById('water-overlay');
window.addEventListener('scroll', () => {
    if (waterOverlay) {
        const scrollPercent = Math.min(window.scrollY / (document.body.scrollHeight - window.innerHeight), 1);
        waterOverlay.style.opacity = 0.45 + (scrollPercent * 0.5);
    }
});

// --- SAILOR JOURNEY GAMIFICATION ENGINE ---
const SAILOR_STORAGE_KEY = 'sailor_journey_v3';

let sailorState = {
    waves: 0,
    exploredSections: {},
    flippedCards: {},
    musicBonus: false,
    messageBonus: false
};

function loadSailorState() {
    try {
        const stored = localStorage.getItem(SAILOR_STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            sailorState.waves = typeof parsed.waves === 'number' ? parsed.waves : 0;
            sailorState.exploredSections = parsed.exploredSections || {};
            sailorState.flippedCards = parsed.flippedCards || {};
            sailorState.musicBonus = !!parsed.musicBonus;
            sailorState.messageBonus = !!parsed.messageBonus;
        }
    } catch (e) {
        console.warn("Could not load sailor journey state from localStorage:", e);
    }
}

function saveSailorState() {
    try {
        localStorage.setItem(SAILOR_STORAGE_KEY, JSON.stringify(sailorState));
    } catch (e) {
        console.warn("Could not save sailor journey state to localStorage:", e);
    }
}

function getCurrentLevel(waves) {
    if (waves >= CONFIG.LEVELS[4].minWaves) return CONFIG.LEVELS[4];
    if (waves >= CONFIG.LEVELS[3].minWaves) return CONFIG.LEVELS[3];
    if (waves >= CONFIG.LEVELS[2].minWaves) return CONFIG.LEVELS[2];
    if (waves >= CONFIG.LEVELS[1].minWaves) return CONFIG.LEVELS[1];
    return CONFIG.LEVELS[0];
}

function renderHUD() {
    const currentLvl = getCurrentLevel(sailorState.waves);
    
    const iconEl = document.getElementById('sailor-icon');
    const titleEl = document.getElementById('sailor-level-title');
    const barFillEl = document.getElementById('sailor-bar-fill');
    const countEl = document.getElementById('sailor-waves-count');
    
    if (iconEl) iconEl.textContent = currentLvl.icon;
    if (titleEl) titleEl.textContent = currentLvl.title;
    
    if (currentLvl.level === 5) {
        if (barFillEl) barFillEl.style.width = '100%';
        if (countEl) countEl.textContent = `${sailorState.waves} Waves – Max level 🏝️`;
    } else {
        const nextThreshold = currentLvl.nextWaves;
        const fillPercent = Math.min(100, Math.max(0, (sailorState.waves / nextThreshold) * 100));
        if (barFillEl) barFillEl.style.width = `${fillPercent}%`;
        if (countEl) countEl.textContent = `${sailorState.waves} / ${nextThreshold} Waves 🌊`;
    }

    updateModalContent();
    updateFlippedCardBadges();
}

// QUEUED TOAST NOTIFICATIONS ENGINE
const toastQueue = [];
let isToastActive = false;

function enqueueToast(message) {
    toastQueue.push(message);
    processToastQueue();
}

function processToastQueue() {
    if (isToastActive || toastQueue.length === 0) return;
    isToastActive = true;
    
    const message = toastQueue.shift();
    const container = document.getElementById('sailor-toast-container');
    if (!container) {
        isToastActive = false;
        return;
    }
    
    const toast = document.createElement('div');
    toast.className = 'sailor-toast';
    toast.innerHTML = message;
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
        isToastActive = false;
        processToastQueue();
    }, 2000);
}

function triggerConfetti() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const container = document.getElementById('confetti-container');
    if (!container) return;
    container.innerHTML = '';

    const colors = ['#90E0EF', '#00B4D8', '#0077B6', '#F4E3C1', '#FFFFFF'];
    for (let i = 0; i < 25; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.left = `${Math.random() * 100}%`;
        piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        piece.style.animationDelay = `${Math.random() * 0.8}s`;
        piece.style.animationDuration = `${1.8 + Math.random() * 1.2}s`;
        container.appendChild(piece);
    }
}

let levelUpTimeout = null;

function showLevelUpBanner(newLevel) {
    const modal = document.getElementById('level-up-modal');
    const iconEl = document.getElementById('level-up-icon');
    const headingEl = document.getElementById('level-up-heading');
    const textEl = document.getElementById('level-up-text');
    const actionsEl = document.getElementById('level-up-actions');
    
    if (!modal) return;
    
    if (levelUpTimeout) clearTimeout(levelUpTimeout);

    if (iconEl) iconEl.textContent = newLevel.icon;
    
    if (newLevel.level === 5) {
        if (headingEl) headingEl.textContent = "Ocean Conqueror! 🏝️";
        if (textEl) textEl.innerHTML = "You've sailed the whole ocean! 🏝️ Thank you for exploring.";
        if (actionsEl) actionsEl.classList.remove('hidden');
    } else {
        if (headingEl) headingEl.textContent = "Level Up!";
        if (textEl) textEl.innerHTML = `You are now a <strong>${newLevel.title}</strong>`;
        if (actionsEl) actionsEl.classList.add('hidden');
    }

    modal.classList.remove('hidden');
    triggerConfetti();

    levelUpTimeout = setTimeout(() => {
        modal.classList.add('hidden');
    }, 3000);
}

function addWaves(source, id, amount, toastMessage) {
    const oldWaves = sailorState.waves;
    const oldLevel = getCurrentLevel(oldWaves);
    const maxWaves = getMaxWaves();
    
    sailorState.waves = Math.min(maxWaves, sailorState.waves + amount);
    saveSailorState();
    
    const newWaves = sailorState.waves;
    const newLevel = getCurrentLevel(newWaves);
    
    enqueueToast(`+${amount} Waves 🌊 – ${toastMessage}`);
    renderHUD();
    
    if (newLevel.level > oldLevel.level) {
        setTimeout(() => {
            showLevelUpBanner(newLevel);
        }, 400);
    }
}

function triggerMusicBonus() {
    if (!sailorState.musicBonus) {
        sailorState.musicBonus = true;
        saveSailorState();
        addWaves('music', 'music', CONFIG.MUSIC_WAVES, 'Music on, smooth sailing!');
    }
}

function triggerMessageBonus() {
    if (!sailorState.messageBonus) {
        sailorState.messageBonus = true;
        saveSailorState();
        addWaves('message', 'message', CONFIG.MESSAGE_SUBMIT_WAVES, 'Your bottle is floating out to sea.');
    }
}

function initFlipCards() {
    const cards = document.querySelectorAll('.flip-card');
    cards.forEach(card => {
        const cardId = card.getAttribute('data-card-id');
        const cardTitle = card.getAttribute('data-card-title') || 'Card';
        
        if (sailorState.flippedCards[cardId]) {
            card.classList.add('has-flipped');
            const badge = card.querySelector('.card-wave-badge');
            if (badge) badge.textContent = '✓';
        }

        const handleFlip = () => {
            card.classList.toggle('flipped');
            const isFlipped = card.classList.contains('flipped');
            card.setAttribute('aria-pressed', isFlipped ? 'true' : 'false');
            
            if (!sailorState.flippedCards[cardId]) {
                sailorState.flippedCards[cardId] = true;
                card.classList.add('has-flipped');
                const badge = card.querySelector('.card-wave-badge');
                if (badge) badge.textContent = '✓';
                saveSailorState();
                
                addWaves('card', cardId, CONFIG.FLIP_CARD_WAVES, `You flipped "${cardTitle}".`);
            }
        };

        card.addEventListener('click', handleFlip);
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleFlip();
            }
        });
    });
}

function initSectionObserver() {
    const timers = {};
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const id = entry.target.getAttribute('id');
            const config = CONFIG.SECTION_WAVES[id];
            if (!config) return;

            if (sailorState.exploredSections[id]) return;

            if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
                if (!timers[id]) {
                    timers[id] = setTimeout(() => {
                        if (!sailorState.exploredSections[id]) {
                            sailorState.exploredSections[id] = true;
                            saveSailorState();
                            addWaves('section', id, config.waves, `You explored ${config.name}`);
                        }
                        delete timers[id];
                    }, 4000);
                }
            } else {
                if (timers[id]) {
                    clearTimeout(timers[id]);
                    delete timers[id];
                }
            }
        });
    }, {
        threshold: [0.6]
    });

    Object.keys(CONFIG.SECTION_WAVES).forEach(id => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
    });
}

function updateModalContent() {
    const currentLvl = getCurrentLevel(sailorState.waves);
    const maxWaves = getMaxWaves();
    
    const badgeEl = document.getElementById('modal-level-badge');
    const titleEl = document.getElementById('modal-level-title');
    const summaryEl = document.getElementById('modal-waves-summary');
    const checklistUl = document.getElementById('sailor-checklist-items');
    
    if (badgeEl) badgeEl.textContent = `Level ${currentLvl.level}`;
    if (titleEl) titleEl.textContent = currentLvl.title;
    if (summaryEl) summaryEl.textContent = `${sailorState.waves} / ${maxWaves} Waves 🌊`;

    if (checklistUl) {
        checklistUl.innerHTML = '';
        
        Object.keys(CONFIG.SECTION_WAVES).forEach(id => {
            const conf = CONFIG.SECTION_WAVES[id];
            const isDone = !!sailorState.exploredSections[id];
            const li = document.createElement('li');
            li.className = `checklist-item ${isDone ? 'done' : ''}`;
            li.innerHTML = `
                <span><span class="status-icon">${isDone ? '✓' : '○'}</span> Explore ${conf.name}</span>
                <span class="item-waves">+${conf.waves} 🌊</span>
            `;
            checklistUl.appendChild(li);
        });

        const isMusicDone = !!sailorState.musicBonus;
        const liMusic = document.createElement('li');
        liMusic.className = `checklist-item ${isMusicDone ? 'done' : ''}`;
        liMusic.innerHTML = `
            <span><span class="status-icon">${isMusicDone ? '✓' : '○'}</span> Turn Music On</span>
            <span class="item-waves">+${CONFIG.MUSIC_WAVES} 🌊</span>
        `;
        checklistUl.appendChild(liMusic);

        const cards = document.querySelectorAll('.flip-card');
        cards.forEach(card => {
            const cardId = card.getAttribute('data-card-id');
            const cardTitle = card.getAttribute('data-card-title') || 'Card';
            const isDone = !!sailorState.flippedCards[cardId];
            const liCard = document.createElement('li');
            liCard.className = `checklist-item ${isDone ? 'done' : ''}`;
            liCard.innerHTML = `
                <span><span class="status-icon">${isDone ? '✓' : '○'}</span> Flip "${cardTitle}"</span>
                <span class="item-waves">+${CONFIG.FLIP_CARD_WAVES} 🌊</span>
            `;
            checklistUl.appendChild(liCard);
        });

        const isMsgDone = !!sailorState.messageBonus;
        const liMsg = document.createElement('li');
        liMsg.className = `checklist-item ${isMsgDone ? 'done' : ''}`;
        liMsg.innerHTML = `
            <span><span class="status-icon">${isMsgDone ? '✓' : '○'}</span> Send Bottle Message</span>
            <span class="item-waves">+${CONFIG.MESSAGE_SUBMIT_WAVES} 🌊</span>
        `;
        checklistUl.appendChild(liMsg);
    }
}

function updateFlippedCardBadges() {
    const cards = document.querySelectorAll('.flip-card');
    cards.forEach(card => {
        const cardId = card.getAttribute('data-card-id');
        const isDone = !!sailorState.flippedCards[cardId];
        const badge = card.querySelector('.card-wave-badge');
        if (isDone) {
            card.classList.add('has-flipped');
            if (badge) badge.textContent = '✓';
        } else {
            card.classList.remove('has-flipped');
            if (badge) badge.textContent = `+${CONFIG.FLIP_CARD_WAVES} 🌊`;
        }
    });
}

function resetSailorProgress() {
    if (confirm("Are you sure you want to reset your Sailor Journey progress and clear all flipped card states?")) {
        sailorState = {
            waves: 0,
            exploredSections: {},
            flippedCards: {},
            musicBonus: false,
            messageBonus: false
        };
        saveSailorState();
        
        document.querySelectorAll('.flip-card').forEach(card => {
            card.classList.remove('flipped', 'has-flipped');
            card.setAttribute('aria-pressed', 'false');
        });

        renderHUD();
        
        const modal = document.getElementById('sailor-modal');
        if (modal) modal.classList.add('hidden');
        
        enqueueToast("Progress reset. Ready for a new voyage! ⛵");
    }
}

function initSailorEvents() {
    const navHud = document.getElementById('sailor-nav-hud');
    const modal = document.getElementById('sailor-modal');
    const modalClose = document.getElementById('sailor-modal-close');
    const levelUpModal = document.getElementById('level-up-modal');
    const levelUpClose = document.getElementById('level-up-close');
    const level5ScrollMessage = document.getElementById('level5-scroll-message');
    const level5ScrollContact = document.getElementById('level5-scroll-contact');
    const resetModalBtn = document.getElementById('reset-sailor-modal');
    const resetFooterBtn = document.getElementById('reset-sailor-footer');

    if (navHud) {
        navHud.addEventListener('click', () => {
            if (modal) modal.classList.remove('hidden');
        });
        navHud.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (modal) modal.classList.remove('hidden');
            }
        });
    }

    if (modalClose) {
        modalClose.addEventListener('click', () => {
            if (modal) modal.classList.add('hidden');
        });
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.add('hidden');
        });
    }

    if (levelUpClose) {
        levelUpClose.addEventListener('click', () => {
            if (levelUpModal) levelUpModal.classList.add('hidden');
        });
    }

    if (levelUpModal) {
        levelUpModal.addEventListener('click', (e) => {
            if (e.target === levelUpModal) levelUpModal.classList.add('hidden');
        });
    }

    if (level5ScrollMessage) {
        level5ScrollMessage.addEventListener('click', () => {
            if (levelUpModal) levelUpModal.classList.add('hidden');
            const messageSec = document.getElementById('message');
            if (messageSec) messageSec.scrollIntoView({ behavior: 'smooth' });
        });
    }

    if (level5ScrollContact) {
        level5ScrollContact.addEventListener('click', () => {
            if (levelUpModal) levelUpModal.classList.add('hidden');
            const contactSec = document.getElementById('contact');
            if (contactSec) contactSec.scrollIntoView({ behavior: 'smooth' });
        });
    }

    if (resetModalBtn) resetModalBtn.addEventListener('click', resetSailorProgress);
    if (resetFooterBtn) resetFooterBtn.addEventListener('click', resetSailorProgress);
}

// INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
    loadSailorState();
    initPlayer();
    renderHUD();
    initFlipCards();
    initSectionObserver();
    initSailorEvents();
});

if (document.readyState === 'interactive' || document.readyState === 'complete') {
    loadSailorState();
    initPlayer();
    renderHUD();
    initFlipCards();
    initSectionObserver();
    initSailorEvents();
}
