document.addEventListener('DOMContentLoaded', function() {
    const popup = document.getElementById('popup');
    const closeBtn = document.getElementById('closePopup');
    
    // Check if popup has been shown before in this session
    const popupShown = sessionStorage.getItem('biasPopupShown');
    
    // Only show popup if it hasn't been shown before
    if (!popupShown) {
        popup.style.display = 'block';
    }
    
    // Close popup when X button is clicked
    closeBtn.addEventListener('click', function() {
        popup.style.display = 'none';
        // Mark popup as shown in session storage
        sessionStorage.setItem('biasPopupShown', 'true');
        // Trigger music to start playing
        window.dispatchEvent(new CustomEvent('popupClosed'));
    });
    
    // Close popup when clicking outside the popup content
    popup.addEventListener('click', function(event) {
        if (event.target === popup) {
            popup.style.display = 'none';
            // Mark popup as shown in session storage
            sessionStorage.setItem('biasPopupShown', 'true');
            // Trigger music to start playing
            window.dispatchEvent(new CustomEvent('popupClosed'));
        }
    });
    
    // Close popup with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && popup.style.display === 'block') {
            popup.style.display = 'none';
            // Mark popup as shown in session storage
            sessionStorage.setItem('biasPopupShown', 'true');
            // Trigger music to start playing
            window.dispatchEvent(new CustomEvent('popupClosed'));
        }
    });
});
