function checkAuth() {
    const cookies = document.cookie.split(';').map(cookie => cookie.trim());
    const authenticated = cookies.some(cookie => cookie.startsWith('authenticated=true'));

    if (!authenticated) {
        window.location.href = 'login.html';
    }
}

function deleteCookie(name) {
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

document.addEventListener('DOMContentLoaded', () => {
    checkAuth(); 

  
    document.querySelectorAll('li.logout').forEach(function(element) {
        element.addEventListener('click', function() {
            deleteCookie('authenticated'); 
            window.location.href = 'login.html'; 
        });
    });

    
   
});


