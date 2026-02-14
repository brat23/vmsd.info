// formHandler.js - Manages the email subscription form logic

import { animateCurrencyGain } from './uiElements.js';
import { createParticleExplosion } from './utilities.js';

export function initFormHandler() {
    const form = document.getElementById('notifyForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = form.querySelector('input').value;

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
            body: JSON.stringify({ email: email })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Success animation
                const originalText = 'Notify Me! 🚀'; // Restore original text
                button.textContent = '✅ Subscribed!';
                button.style.background = 'linear-gradient(135deg, #2ECC71, #27AE60)';

                gsap.to(button, {
                    scale: 1.2,
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

                document.body.appendChild(successMsg);

                gsap.fromTo(successMsg,
                    { scale: 0, rotation: -180 },
                    { scale: 1, rotation: 0, duration: 0.8, ease: 'back.out(1.7)' }
                );

                gsap.to(successMsg, {
                    scale: 0,
                    opacity: 0,
                    duration: 0.5,
                    delay: 3,
                    ease: 'back.in(1.7)',
                    onComplete: () => successMsg.remove()
                });

                // Reset form
                setTimeout(() => {
                    form.reset();
                    button.textContent = originalText;
                    button.style.background = 'linear-gradient(135deg, #27AE60, #2ECC71)';
                    button.disabled = false; // Re-enable button
                }, 3000);

                // Reward the user
                animateCurrencyGain('vg');
                createParticleExplosion(button, '🎉');

            } else {
                console.error('Server error:', data.message);
                // alert('Subscription failed: ' + data.message); // Provide user feedback
                
                displayFeedbackMessage(data.message, false); // Display error message
                
                button.textContent = 'Try Again 🚀';
                button.style.background = 'linear-gradient(135deg, #E74C3C, #C0392B)';
                button.disabled = false; // Re-enable button
            }
        })
        .catch(error => {
            console.error('Network error:', error);
            // alert('An error occurred during subscription. Please try again later.'); // Provide user feedback
            
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

    document.body.appendChild(feedbackMsg);

    gsap.fromTo(feedbackMsg,
        { scale: 0, rotation: -180 },
        { scale: 1, rotation: 0, duration: 0.8, ease: 'back.out(1.7)' }
    );

    gsap.to(feedbackMsg, {
        scale: 0,
        opacity: 0,
        duration: 0.5,
        delay: 3,
        ease: 'back.in(1.7)',
        onComplete: () => feedbackMsg.remove()
    });
}
