// formHandler.js - Manages the email subscription form logic

import { animateCurrencyGain } from './uiElements.js';
import { createParticleExplosion } from './utilities.js';

export function initFormHandler() {
    const form = document.getElementById('notifyForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = form.querySelector('input[name="name"]').value;
        const email = form.querySelector('input[name="email"]').value;
        const phone = form.querySelector('input[name="phone"]').value;
        const message = form.querySelector('textarea[name="message"]').value;
        const button = form.querySelector('button');

        // Immediately disable button to prevent multiple submissions
        button.disabled = true;
        button.textContent = 'Subscribing...';
        button.style.background = '#555';

        // Send email to PHP backend
        fetch('api/send_email.php', { // IMPORTANT: Adjust this path if your PHP script is elsewhere
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                email: email,
                phone: phone,
                message: message
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Success animation
                const originalText = 'Notify Me! 🚀'; // Restore original text
                button.textContent = '✅ Subscribed!';
                button.style.background = 'linear-gradient(135deg, #2ECC71, #27AE60)';

                gsap.to(button, {
                    scale: 1.1, // Reduced scale for subtlety
                    duration: 0.3,
                    yoyo: true,
                    repeat: 1,
                    ease: 'power2.inOut'
                });

                // Show success message
                const successMsg = document.createElement('div');
                successMsg.textContent = `🎉 Welcome to VMSD! Check ${email} for updates.`;
                successMsg.style.position = 'fixed';
                successMsg.style.top = '50%';
                successMsg.style.left = '50%';
                successMsg.style.transform = 'translate(-50%, -50%)';
                successMsg.style.background = 'linear-gradient(135deg, #3E2723, #5D4037)';
                successMsg.style.color = '#FFD700';
                successMsg.style.padding = '30px 60px';
                successMsg.style.borderRadius = '20px';
                successMsg.style.border = '5px solid #FFD700';
                successMsg.style.fontSize = '24px';
                successMsg.style.fontWeight = '800';
                successMsg.style.boxShadow = '0 20px 60px rgba(0,0,0,0.5)';
                successMsg.style.zIndex = '10000';
                successMsg.style.fontFamily = "'Baloo 2', cursive";
                successMsg.style.opacity = 0; // Start with opacity 0 for fade-in
                document.body.appendChild(successMsg);

                // Smoother, less jarring animation
                gsap.fromTo(successMsg,
                    { scale: 0.9, opacity: 0 },
                    { scale: 1, opacity: 1, duration: 0.4, ease: 'power2.out' }
                );

                gsap.to(successMsg, {
                    scale: 0.9,
                    opacity: 0,
                    duration: 0.4,
                    delay: 3,
                    ease: 'power2.in',
                    onComplete: () => successMsg.remove()
                });

                // Reset form
                setTimeout(() => {
                    form.reset();
                    button.textContent = originalText;
                    button.style.background = 'linear-gradient(135deg, #27AE60, #2ECC71)';
                    button.disabled = false; // Re-enable button
                }, 3500); // Increased delay to match animation

                // Reward the user
                animateCurrencyGain('vg');
                createParticleExplosion(button, '🎉');

            } else {
                console.error('Server error:', data.message);
                displayFeedbackMessage(data.message, false); // Display error message
                
                button.textContent = 'Try Again 🚀';
                button.style.background = 'linear-gradient(135deg, #E74C3C, #C0392B)';
                button.disabled = false; // Re-enable button
            }
        })
        .catch(error => {
            console.error('Network error:', error);
            displayFeedbackMessage('An unexpected error occurred. Please try again later.', false); // Display error message
            
            button.textContent = 'Try Again 🚀';
            button.style.background = 'linear-gradient(135deg, #E74C3C, #C0392B)';
            button.disabled = false; // Re-enable button
        });
    });
}

function displayFeedbackMessage(message, isSuccess) {
    const feedbackMsg = document.createElement('div');
    feedbackMsg.textContent = message;
    feedbackMsg.style.position = 'fixed';
    feedbackMsg.style.top = '50%';
    feedbackMsg.style.left = '50%';
    feedbackMsg.style.transform = 'translate(-50%, -50%)';
    feedbackMsg.style.background = isSuccess ? 'linear-gradient(135deg, #3E2723, #5D4037)' : 'linear-gradient(135deg, #E74C3C, #C0392B)';
    feedbackMsg.style.color = isSuccess ? '#FFD700' : 'white';
    feedbackMsg.style.padding = '30px 60px';
    feedbackMsg.style.borderRadius = '20px';
    feedbackMsg.style.border = isSuccess ? '5px solid #FFD700' : '5px solid #FFD700'; // Keep gold border for consistency
    feedbackMsg.style.fontSize = '24px';
    feedbackMsg.style.fontWeight = '800';
    feedbackMsg.style.boxShadow = '0 20px 60px rgba(0,0,0,0.5)';
    feedbackMsg.style.zIndex = '10000';
    feedbackMsg.style.fontFamily = "'Baloo 2', cursive";
    feedbackMsg.style.textAlign = 'center'; // Center text
    feedbackMsg.style.opacity = 0;

    document.body.appendChild(feedbackMsg);

    // Smoother animation for feedback message as well
    gsap.fromTo(feedbackMsg,
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, ease: 'power2.out' }
    );

    gsap.to(feedbackMsg, {
        scale: 0.9,
        opacity: 0,
        duration: 0.4,
        delay: 3,
        ease: 'power2.in',
        onComplete: () => feedbackMsg.remove()
    });
}
