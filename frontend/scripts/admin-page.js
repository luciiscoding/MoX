// frontend/scripts/admin-page.js
document.addEventListener('DOMContentLoaded', () => {
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    if (!isAdmin) {
        alert('Access denied. Admins only.');
        window.location.href = 'admin-page.html'; // Redirect to admin login page
        return;
    }

    document.getElementById('adminContent').style.display = 'flex';

    document.getElementById('uploadMovieForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const movie = {
            title: document.getElementById('title').value,
            description: document.getElementById('description').value,
            release_year: document.getElementById('release_year').value,
            director: document.getElementById('director').value,
            cast: document.getElementById('cast').value,
            country: document.getElementById('country').value,
            rating: document.getElementById('rating').value,
            duration: document.getElementById('duration').value,
            listed_in: document.getElementById('listed_in').value,
            imageUrl: document.getElementById('imageUrl').value
        };
        
        const canUpload = checkMovieUploadLimit(movie.title);
        if (canUpload) {
            await uploadMovie(movie);
            incrementMovieUploadCount(movie.title);
        } else {
            alert('This movie has already been uploaded.');
        }
    });

    document.getElementById('deleteMovieForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('deleteTitle').value;
        await deleteMovie(title);
        resetMovieUploadCount(title);
    });
});

function checkMovieUploadLimit(title) {
    const uploadCount = parseInt(localStorage.getItem(`uploadCount_${title}`)) || 0;
    return uploadCount < 1;
}

function incrementMovieUploadCount(title) {
    const uploadCount = parseInt(localStorage.getItem(`uploadCount_${title}`)) || 0;
    localStorage.setItem(`uploadCount_${title}`, uploadCount + 1);
}

function resetMovieUploadCount(title) {
    localStorage.removeItem(`uploadCount_${title}`);
}

async function uploadMovie(movie) {
    try {
        const response = await fetch('http://localhost:7081/api/movies', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(movie)
        });
        if (!response.ok) {
            throw new Error('Failed to upload movie');
        }
        alert('Movie uploaded successfully');
    } catch (error) {
        console.error('Error uploading movie:', error);
        alert('Error uploading movie: ' + error.message);
    }
}

async function deleteMovie(title) {
    try {
        const response = await fetch(`http://localhost:7081/api/movies?title=${encodeURIComponent(title)}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('Failed to delete movie');
        }
        alert('Movie deleted successfully');
    } catch (error) {
        console.error('Error deleting movie:', error);
        // alert('Error deleting movie: ' + error.message);
        alert('The movie does not exist in the database.');
    }
}
