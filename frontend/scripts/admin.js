document.addEventListener('DOMContentLoaded', () => {
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    if (isAdmin) {
        const adminMenuItem = document.getElementById('adminMenuItem');
        const adminMoviesMenuItem = document.getElementById('adminMoviesMenuItem');
        if (adminMenuItem) {
            adminMenuItem.style.display = 'block';
        }
        if (adminMoviesMenuItem) {
            adminMoviesMenuItem.style.display = 'block';
        }
    }

    const adminLoginForm = document.getElementById('adminLoginForm');
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            try {
                const response = await fetch('http://localhost:7081/api/users/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include', 
                    body: JSON.stringify({ email, password })
                });
                const data = await response.json();
                if (response.ok) {
                    if (data.isAdmin) {
                        alert('Admin login successful');
                        localStorage.setItem('isAdmin', 'true'); 
                        window.location.href = 'admin-page.html'; 
                    } else {
                        alert('Wrong credentials for admin login');
                        window.location.href = 'index.html'; 
                    }
                } else {
                    alert(data.message);
                }
            } catch (error) {
                alert('An error occurred: ' + error.message);
            }
        });
    }
});
