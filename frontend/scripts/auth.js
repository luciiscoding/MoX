// auth.js
function checkAuth() {
    const cookies = document.cookie.split(';').map(cookie => cookie.trim());
    const authenticated = cookies.some(cookie => cookie.startsWith('authenticated=true'));

    if (!authenticated) {
        window.location.href = 'login.html';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    checkAuth(); // Call checkAuth on page load to ensure authentication is checked
});
