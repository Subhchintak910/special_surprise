let currentPage = 'page1';
let birthdayMusicPlaying = false; // Separate flag for birthday song
let btsMusicPlaying = false;      // Separate flag for BTS song
let btsMusicManuallyStopped = false; // Flag to track if BTS music was stopped manually

// New: To track UNIQUE flipped BTS cards (by their inner text like "RM", "Jin")
let seenBTSMembers = new Set();
let totalBTSCards = 7;

const birthdaySong = document.getElementById('birthdaySong');
const btsSong = document.getElementById('btsSong'); // New: Get BTS audio element

const musicToggleButton = document.getElementById('musicToggleButton'); // For birthday song
const btsMusicToggleButton = document.getElementById('btsMusicToggleButton'); // New: For BTS song

// Function to update the birthday song button text
function updateBirthdayMusicButtonText() {
    if (birthdayMusicPlaying) {
        musicToggleButton.textContent = '🎶 Cake Song: On';
    } else {
        musicToggleButton.textContent = '🔇 Cake Song: Off';
    }
}

// New: Function to update the BTS song button text
function updateBtsMusicButtonText() {
    if (btsMusicPlaying) {
        btsMusicToggleButton.textContent = '💜 BTS Song: On';
    } else {
        btsMusicToggleButton.textContent = '🔇 BTS Song: Off';
    }
}

// Toggle birthday music on/off (if it's ever needed, currently not auto-displayed)
musicToggleButton.addEventListener('click', function() {
    if (birthdaySong.paused) {
        birthdaySong.play()
            .then(() => {
                birthdayMusicPlaying = true;
                updateBirthdayMusicButtonText();
            })
            .catch(error => {
                console.error("Failed to play birthday song on button click:", error);
                birthdayMusicPlaying = false;
                updateBirthdayMusicButtonText();
                // alert("Music playback requires user interaction. Please try again."); // Removed alert
            });
    } else {
        birthdaySong.pause();
        birthdayMusicPlaying = false;
        updateBirthdayMusicButtonText();
    }
});

// New: Toggle BTS music on/off when its button is clicked
btsMusicToggleButton.addEventListener('click', function() {
    if (btsSong.paused) {
        btsSong.play()
            .then(() => {
                btsMusicPlaying = true;
                btsMusicManuallyStopped = false; // Reset if user explicitly plays it
                updateBtsMusicButtonText();
                console.log("BTS song started playing on Page 6!");
            })
            .catch(error => {
                console.error("Autoplay prevented for BTS song on button click:", error);
                btsMusicPlaying = false;
                btsMusicManuallyStopped = false; // If autoplay failed, it wasn't manually stopped
                updateBtsMusicButtonText();
                // alert("Music playback requires user interaction. Please click the '💜 BTS Song: Off' button to enable it."); // Removed alert
            });
    } else {
        btsSong.pause();
        btsMusicPlaying = false;
        btsMusicManuallyStopped = true; // Set flag when user manually stops it
        updateBtsMusicButtonText();
    }
});


// Utility function to reset animations on a page
function resetAnimations(pageElement) {
    const animatedElements = pageElement.querySelectorAll('.animate-text, .animate-button, .animate-wish-text, .animate-cake, .animate-gift, .gallery-item, .animate-letter p, .animate-fade-in');
    animatedElements.forEach(el => {
        el.style.animation = 'none';
        el.offsetHeight; // Trigger reflow to apply 'none'
        el.style.animation = null; // Clear animation property for re-application

        if (el.classList.contains('animate-text') || el.classList.contains('animate-button') || el.classList.contains('animate-fade-in')) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            if (el.classList.contains('animate-button')) {
                el.style.transform = 'translateY(20px) scale(0.9)';
            }
        } else if (el.classList.contains('animate-wish-text')) {
            el.style.width = '0';
            el.style.borderRightColor = 'transparent';
            el.style.opacity = '0';
        } else if (el.classList.contains('gallery-item')) {
             el.style.opacity = '0';
             el.style.transform = 'scale(0.8) translateY(20px)';
        } else if (el.tagName === 'P' && el.closest('#letter-content')) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(10px)';
        }
    });
    // JS for click-to-enlarge
        const modal = document.getElementById("myModal");
        const modalImg = document.getElementById("modalImg");
        const closeModal = document.getElementById("closeModal");

        document.querySelectorAll("#gallery-grid img").forEach(img => {
            img.addEventListener("click", () => {
                modal.style.display = "flex"; // show modal
                modalImg.src = img.src;       // set clicked image
            });
        });

        closeModal.addEventListener("click", () => {
            modal.style.display = "none";     // close modal
        });

        // click outside image to close modal
        modal.addEventListener("click", (e) => {
            if(e.target === modal) modal.style.display = "none";
        });


    const confettiContainer = pageElement.querySelector('#confetti-container');
    if (confettiContainer) {
        confettiContainer.innerHTML = '';
    }

    const cakeUncut = pageElement.querySelector('#cake-uncut');
    const cakeCut = pageElement.querySelector('#cake-cut');
    if (cakeUncut && cakeCut) {
        cakeUncut.style.display = 'block';
        cakeCut.style.display = 'none';
        const candleFlames = pageElement.querySelectorAll('.candle-flame');
        candleFlames.forEach(flame => flame.style.display = 'block');
    }

    const giftContainer = pageElement.querySelector('#gift-container');
    const teddyReveal = document.getElementById('teddy-reveal'); // Assuming teddyReveal is always in body or correct page
    if (giftContainer && teddyReveal) {
        giftContainer.style.display = 'block';
        teddyReveal.style.display = 'none';
    }

    // Reset flipped cards and the 'seen' set for Page 6 when leaving it
    const btsSection = pageElement.querySelector('#bts-section');
    if (btsSection) {
        const flippedCards = btsSection.querySelectorAll('.flip-card.flipped');
        flippedCards.forEach(card => card.classList.remove('flipped'));
        seenBTSMembers.clear(); // Clear the set of seen members
    }

    const cakeContainer = pageElement.querySelector('.animate-cake');
    if (cakeContainer) {
        cakeContainer.style.animation = 'none';
        cakeContainer.offsetHeight;
        cakeContainer.style.animation = null;
    }
}


function showPage(pageId) {
    const prevPageElement = document.getElementById(currentPage);
    if (prevPageElement) {
        prevPageElement.classList.remove('active');
        resetAnimations(prevPageElement);
    }

    const newPageElement = document.getElementById(pageId);
    if (newPageElement) {
        newPageElement.classList.add('active');
        currentPage = pageId;
        triggerPageAnimations(newPageElement);
    }

    // Handle music display and playback based on page
    musicToggleButton.style.display = 'none'; // Hide birthday song button by default
    btsMusicToggleButton.style.display = 'none'; // Hide BTS song button by default

    // Stop birthday song if not on page 3 or if leaving page 3
    if (pageId !== 'page3' && birthdayMusicPlaying) {
        birthdaySong.pause();
        birthdaySong.currentTime = 0;
        birthdayMusicPlaying = false;
        updateBirthdayMusicButtonText();
    }

    // Handle BTS song
    if (pageId === 'page6' || pageId === 'page7') { // BTS song plays from page 6 till end
        btsMusicToggleButton.style.display = 'block'; // Show BTS song button
        
        // New: Reset btsMusicManuallyStopped when entering page 6 or 7
        // This ensures autoplay restarts on re-entry to these pages
        if (currentPage !== 'page6' && currentPage !== 'page7') { // Only reset if coming from a non-BTS page
             btsMusicManuallyStopped = false;
        }


        // Only attempt to play if not already playing AND not manually stopped
        if (!btsMusicPlaying && !btsMusicManuallyStopped) {
            btsSong.play()
                .then(() => {
                    btsMusicPlaying = true;
                    updateBtsMusicButtonText();
                    console.log("BTS song started playing on Page 6!");
                })
                .catch(error => {
                    console.error("Autoplay prevented for BTS song on Page 6:", error);
                    btsMusicPlaying = false;
                    updateBtsMusicButtonText();
                    // Alert only if it failed to play automatically. User can then click the button.
                    if (pageId === 'page6') { // Only show alert on initial arrival to page 6 if autoplay fails
                        // alert("Your browser might be preventing automatic music playback for the BTS song. Please click the '💜 BTS Song: Off' button to enable it."); // Removed alert
                    }
                });
        }
    } else {
        // Stop BTS song if navigating away from pages where it should play (page 6 and 7)
        if (btsMusicPlaying) {
            btsSong.pause();
            btsSong.currentTime = 0;
            btsMusicPlaying = false;
            updateBtsMusicButtonText();
        }
    }
}

function triggerPageAnimations(pageElement) {
    const animatedTexts = pageElement.querySelectorAll('.animate-text');
    animatedTexts.forEach((el, index) => {
        el.style.animation = 'none';
        el.offsetHeight;
        el.style.animationDelay = `${index * 0.1 + 0.1}s`;
        el.style.animation = 'slideUpFadeIn 0.8s ease-out forwards';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0) scale(1)';
    });

    const animatedButtons = pageElement.querySelectorAll('.animate-button');
    animatedButtons.forEach((el, index) => {
        el.style.animation = 'none';
        el.offsetHeight;
        el.style.animationDelay = `${animatedTexts.length * 0.1 + index * 0.1 + 0.1}s`;
        el.style.animation = 'slideUpFadeIn 0.8s ease-out forwards';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0) scale(1)';
    });

    const animateFadeIns = pageElement.querySelectorAll('.animate-fade-in');
    animateFadeIns.forEach((el, index) => {
         el.style.animation = 'none';
         el.offsetHeight;
         const baseDelay = (animatedTexts.length + animatedButtons.length) * 0.1 + 0.1;
         el.style.animationDelay = `${baseDelay + index * 0.1}s`;
         el.style.animation = 'pageFadeIn 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards';
    });


    if (pageElement.id === 'page2') {
        const wishText = pageElement.querySelector('.animate-wish-text');
        if (wishText) {
            wishText.style.animation = 'none';
            wishText.offsetHeight;
            wishText.style.width = '0';
            wishText.style.borderRightColor = 'orange';
            wishText.style.opacity = '1';
            wishText.style.animation = 'typewriter 2s steps(22) forwards, blink-caret 0.75s step-end infinite';
        }
        generateConfetti();
    }

    if (pageElement.id === 'page3') {
        const cakeContainer = pageElement.querySelector('#cake-container');
        if (cakeContainer) {
             cakeContainer.style.animation = 'none';
             cakeContainer.offsetHeight;
             cakeContainer.style.animation = 'cakeWobble 4s ease-in-out infinite';
        }
        const candleFlames = pageElement.querySelectorAll('.candle-flame');
        candleFlames.forEach(flame => flame.style.display = 'block');
    }

    if (pageElement.id === 'page5') {
        const galleryItems = pageElement.querySelectorAll('.gallery-item');
        galleryItems.forEach((item, index) => {
            item.style.animation = 'none';
            item.offsetHeight;
            item.style.opacity = '0';
            item.style.transform = 'scale(0.8) translateY(20px)';
            item.style.animationDelay = `${index * 0.1}s`;
            item.style.animation = 'galleryItemAppear 0.6s forwards ease-out';
        });
    }

    if (pageElement.id === 'page6') {
        seenBTSMembers.clear(); // Clear the set when entering the page
        const btsCards = pageElement.querySelectorAll('.flip-card');
        totalBTSCards = btsCards.length; // Dynamically get total cards
    }


    if (pageElement.id === 'page7') {
        const letterParagraphs = pageElement.querySelector('#letter-content').querySelectorAll('p'); // More specific selector
        letterParagraphs.forEach((p, index) => {
            p.style.animation = 'none';
            p.offsetHeight;
            p.style.opacity = '0';
            p.style.transform = 'translateY(10px)';
            p.style.animationDelay = `${index * 0.5 + 0.5}s`;
            p.style.animation = 'letterFadeIn 1s ease-out forwards';
        });
    }
}


// Custom functions for interactions called directly from HTML onclick
function cutCake() {
    const cakeUncut = document.getElementById('cake-uncut');
    const cakeCut = document.getElementById('cake-cut');
    const candleFlames = document.querySelectorAll('#cake-container .candle-flame');

    if (cakeUncut && cakeCut) {
        cakeUncut.style.display = 'none';
        cakeCut.style.display = 'block';
        candleFlames.forEach(flame => flame.style.display = 'none');

        // Play birthday song when cake is cut
        if (birthdaySong.paused) {
            birthdaySong.play()
                .then(() => {
                    birthdayMusicPlaying = true;
                    updateBirthdayMusicButtonText();
                    // Display the birthday music toggle button
                    musicToggleButton.style.display = 'block';
                })
                .catch(error => {
                    console.error("Failed to play birthday song after cutting cake:", error);
                    birthdayMusicPlaying = false;
                    updateBirthdayMusicButtonText();
                    // alert("Music playback requires user interaction. Please click the '🎶 Cake Song: Off' button in the top right to enable it."); // Removed alert
                });
        }
    }
}

function openGift() {
    const giftContainer = document.getElementById('gift-container');
    const teddyReveal = document.getElementById('teddy-reveal');

    if (giftContainer && teddyReveal) {
        giftContainer.style.display = 'none';
        teddyReveal.style.display = 'flex';
    }
}

function flipCard(cardElement) {
    const isCurrentlyFlipped = cardElement.classList.contains('flipped');
    const memberName = cardElement.querySelector('.flip-card-front').textContent.trim();

    // Close any other currently flipped card, unless it's the one we're about to flip
    const currentlyFlipped = document.querySelector('.flip-card.flipped');
    if (currentlyFlipped && currentlyFlipped !== cardElement) {
        currentlyFlipped.classList.remove('flipped');
    }

    // Toggle the clicked card's flipped state
    cardElement.classList.toggle('flipped');

    // If the card is now flipped (showing the back)
    if (cardElement.classList.contains('flipped')) {
        // Ensure the member is added to the set only when *initially* flipped
        if (!seenBTSMembers.has(memberName)) {
            seenBTSMembers.add(memberName);
        }
    } else {
        // If the card is unflipped, remove it from the seen set
        seenBTSMembers.delete(memberName);
    }


    // Check if all unique cards have been seen
    if (seenBTSMembers.size >= totalBTSCards) {
        // Give a small delay before revealing all
        setTimeout(() => {
            const allCards = document.querySelectorAll('#bts-section .flip-card');
            allCards.forEach(card => {
                // Ensure all cards are flipped (revealed)
                card.classList.add('flipped');
            });
            // seenBTSMembers.clear(); // If you want to allow re-discovering members after full reveal
            // alert("आपने सभी BTS सदस्यों को देख लिया है! अब सभी कार्ड पलट गए हैं।"); // <--- यह लाइन हटा दी गई है
        }, 1000); // 1 second delay
    }
}


// Initial setup on page load
document.addEventListener('DOMContentLoaded', () => {
    updateBirthdayMusicButtonText();
    updateBtsMusicButtonText(); // Initialize BTS button text
    showPage('page1');

    document.getElementById('cake-cut').style.display = 'none';
    document.getElementById('teddy-reveal').style.display = 'none';
});

function generateConfetti() {
    console.log("Confetti generated! (If confetti library is included and configured)");
    const confettiContainer = document.getElementById('confetti-container');
    // Using a simple CSS-based confetti fallback if 'confetti' library is not available
    if (confettiContainer && typeof confetti !== 'undefined') {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    } else if (confettiContainer) {
        // Fallback CSS confetti (simplified)
        confettiContainer.innerHTML = `
            <div class="confetti" style="left: 10%; background-color: red; animation-delay: 0s;"></div>
            <div class="confetti" style="left: 20%; background-color: blue; animation-delay: 0.2s;"></div>
            <div class="confetti" style="left: 30%; background-color: green; animation-delay: 0.4s;"></div>
            <div class="confetti" style="left: 40%; background-color: yellow; animation-delay: 0.6s;"></div>
            <div class="confetti" style="left: 50%; background-color: purple; animation-delay: 0.8s;"></div>
            <div class="confetti" style="left: 60%; background-color: orange; animation-delay: 1s;"></div>
            <div class="confetti" style="left: 70%; background-color: pink; animation-delay: 1.2s;"></div>
            <div class="confetti" style="left: 80%; background-color: cyan; animation-delay: 1.4s;"></div>
            <div class="confetti" style="left: 90%; background-color: magenta; animation-delay: 1.6s;"></div>
        `;
         setTimeout(() => confettiContainer.innerHTML = '', 3000); // Clear confetti after 3 seconds
    }
}