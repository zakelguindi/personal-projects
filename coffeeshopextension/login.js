import { signIn, signUp, initializeAuth } from './auth.js';

// DOM Elements
const signinForm = document.getElementById('signinForm');
const signupForm = document.getElementById('signupForm');
const signinError = document.getElementById('signinError');
const signupError = document.getElementById('signupError');
const authTabs = document.querySelectorAll('.auth-tab');

// Check if user is already logged in
initializeAuth().then(user => {
    if (user) {
        window.location.href = 'popup.html';
    }
});

// Tab switching
authTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const targetTab = tab.dataset.tab;
        
        // Update active tab
        authTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Show/hide forms
        if (targetTab === 'signin') {
            signinForm.classList.remove('hidden');
            signupForm.classList.add('hidden');
        } else {
            signinForm.classList.add('hidden');
            signupForm.classList.remove('hidden');
        }
    });
});

// Sign In Form Handler
signinForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    signinError.textContent = '';
    
    const email = document.getElementById('signinEmail').value;
    const password = document.getElementById('signinPassword').value;
    
    const result = await signIn(email, password);
    
    if (result.success) {
        window.location.href = 'popup.html';
    } else {
        signinError.textContent = result.error;
    }
});

// Sign Up Form Handler
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    signupError.textContent = '';
    
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (password !== confirmPassword) {
        signupError.textContent = 'Passwords do not match';
        return;
    }
    
    const result = await signUp(email, password);
    
    if (result.success) {
        window.location.href = 'popup.html';
    } else {
        signupError.textContent = result.error;
    }
}); 