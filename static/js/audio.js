document.addEventListener("DOMContentLoaded", () => {
    const section = document.body.dataset.section;
    const muteBtn = document.getElementById("muteBtn");

    const tracks = {
        general: "/static/music/general.mp3",
        politics: "/static/music/politics.mp3",
        business: "/static/music/business.mp3"
    };

    let audio = new Audio();
    let currentSection = null;
    let isMuted = localStorage.getItem("isMuted") === "true";
    let musicInitialized = false;
    
    // Set default to unmuted if no preference is stored
    if (localStorage.getItem("isMuted") === null) {
        isMuted = false;
        localStorage.setItem("isMuted", "false");
    }

    // Smooth fade-in/out helper
    function fadeAudio(targetVolume, duration = 1000) {
        const step = 0.05;
        const interval = duration / (1 / step);
        const fade = setInterval(() => {
            if (audio.volume < targetVolume) {
                audio.volume = Math.min(targetVolume, audio.volume + step);
            } else if (audio.volume > targetVolume) {
                audio.volume = Math.max(targetVolume, audio.volume - step);
            } else {
                clearInterval(fade);
            }
        }, interval);
    }

    // Load music for section
    function playMusicForSection(sec) {
        if (!tracks[sec]) {
            audio.pause();
            return;
        }

        if (currentSection === sec) return; // no change
        currentSection = sec;

        const newAudio = new Audio(tracks[sec]);
        newAudio.loop = true;
        newAudio.volume = 0;

        // Fade out old audio
        fadeAudio(0);
        setTimeout(() => {
            audio.pause();
            audio = newAudio;
            // Always try to play after user interaction (popup close)
            audio.play().then(() => {
                if (!isMuted) {
                    fadeAudio(0.4, 1500);
                } else {
                    // If muted, set volume to 0 but keep playing
                    audio.volume = 0;
                }
            }).catch(e => {
                console.log("Audio play failed:", e);
            });
        }, 800);
    }

    // Toggle mute/unmute
    muteBtn.addEventListener("click", () => {
        isMuted = !isMuted;
        localStorage.setItem("isMuted", isMuted);
        muteBtn.textContent = isMuted ? "🔈 Unmute" : "🔇 Mute";

        if (isMuted) {
            fadeAudio(0, 500);
            setTimeout(() => audio.pause(), 500);
        } else {
            if (currentSection && tracks[currentSection]) {
                audio.play().then(() => fadeAudio(0.4, 1500)).catch(e => {
                    console.log("Audio play failed:", e);
                });
            }
        }
    });

    // Initialize mute button state
    if (!isMuted) {
        muteBtn.textContent = "🔇 Mute";
    } else {
        muteBtn.textContent = "🔈 Unmute";
    }

    // Initialize music function
    function initMusic() {
        if (!musicInitialized) {
            console.log("Initializing music for section:", section);
            musicInitialized = true;
            playMusicForSection(section);
        }
    }

    // Listen for popup close event to start music
    window.addEventListener('popupClosed', function() {
        console.log("Popup closed, initializing music...");
        if (!musicInitialized) {
            initMusic();
        }
        // Force music to play when popup is closed (user interaction)
        if (currentSection && tracks[currentSection]) {
            console.log("Playing music for section:", currentSection);
            audio.play().then(() => {
                console.log("Music started successfully");
                if (!isMuted) {
                    fadeAudio(0.4, 1500);
                }
            }).catch(e => {
                console.log("Audio play failed:", e);
            });
        }
    });
    
    // Check if popup was already closed (for returning visitors)
    const popupShown = sessionStorage.getItem('biasPopupShown');
    if (popupShown === 'true') {
        // Popup was already closed, start music immediately
        initMusic();
    }
    
    // Also listen for user interactions as fallback
    document.body.addEventListener("click", initMusic);
    document.body.addEventListener("scroll", initMusic);
    document.body.addEventListener("keydown", initMusic);
});
