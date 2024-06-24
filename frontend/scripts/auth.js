// auth.js

function checkAuth() {
    const cookies = document.cookie.split(';').map(cookie => cookie.trim());
    const authenticated = cookies.some(cookie => cookie.startsWith('authenticated=true'));

    if (!authenticated) {
        window.location.href = 'login.html';
    }
}

// Function to delete cookie
function deleteCookie(name) {
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

document.addEventListener('DOMContentLoaded', () => {
    checkAuth(); // Call checkAuth on page load to ensure authentication is checked

    // Handle logout click
    document.querySelectorAll('.logout').forEach(function(element) {
        element.addEventListener('click', function() {
            deleteCookie('authenticated'); // Replace 'authenticated' with your actual cookie name
            window.location.href = 'login.html'; // Redirect to login page after logout
        });
    });

    // Handle back button navigation
    // window.addEventListener('beforeunload', function() {
    //     deleteCookie('authenticated'); // Replace 'authenticated' with your actual cookie name
    // });
});


