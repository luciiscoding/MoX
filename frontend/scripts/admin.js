document.addEventListener('DOMContentLoaded', () => {
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    if (isAdmin) {
        document.getElementById('adminMenuItem').style.display = 'block';
        document.getElementById('adminMoviesMenuItem').style.display = 'block';
    }
});
