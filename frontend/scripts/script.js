const tmdbApiKey = '95c7c5191fa7aa91931cdcce48430fac';

function showSidebar() {
    document.querySelector('.sidebar').style.display = 'block';
}

function hideSidebar() {
    document.querySelector('.sidebar').style.display = 'none';
}

let currentPage = 1;
const limit = 32;
let totalPages = 0;
let allMovies = [];
let displayedMovies = [];  // Add this line

document.addEventListener('DOMContentLoaded', async () => {
    await fetchAllMovies();
    

    document.getElementById('firstPage').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage = 1;
            fetchAndDisplayMovies(currentPage, limit);
        }
    });

    document.getElementById('prevPage').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            fetchAndDisplayMovies(currentPage, limit);
        }
    });

    document.getElementById('nextPage').addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            fetchAndDisplayMovies(currentPage, limit);
        }
    });

    document.getElementById('lastPage').addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage = totalPages;
            fetchAndDisplayMovies(currentPage, limit);
        }
    });

    document.getElementById('filterButton').addEventListener('click', () => {
        showFilterModal();
    });

    document.getElementById('applyFilterButton').addEventListener('click', () => {
        const startYear = document.getElementById('startYearInput').value;
        const endYear = document.getElementById('endYearInput').value;
        const genres = Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(checkbox => checkbox.value);
        const orderBy = document.getElementById('orderBySelect').value;
        applyFilter(startYear, endYear, genres, orderBy);
        closeFilterModal();
    });
    
    
    

    document.getElementById('searchButton').addEventListener('click', () => {
        const query = document.getElementById('searchInput').value.toLowerCase();
        searchMovies(query);
    });
});

async function fetchAllMovies() {
    try {
        let page = 1;
        let movies = [];
        let response;

        do {
            response = await fetch(`http://127.0.0.1:7081/api/movies/Movies?page=${page}&limit=${limit}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            const newMovies = data.movies.filter(movie => movie.imageUrl !== '../images/card-picture.avif');
            movies = movies.concat(newMovies);
            totalPages = data.totalPages;
            page++;
        } while (page <= totalPages);

        allMovies = movies;
        await fetchAndDisplayMovies(currentPage, limit);
        document.getElementById('pageInfo').innerText = `Page ${currentPage} of ${totalPages}`;
    } catch (error) {
        console.error('Error fetching movies:', error);
        const cardContainer = document.getElementById('cardContainer');
        cardContainer.innerHTML = '<p class="error-message">Failed to load movies. Please try again later.</p>';
    }
}

async function fetchAndDisplayMovies(page, limit) {
    try {
        const response = await fetch(`http://127.0.0.1:7081/api/movies/Movies?page=${page}&limit=${limit}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const newMovies = data.movies.filter(movie => movie.imageUrl !== '../images/card-picture.avif');
        await fetchAndDisplayMoviesWithImages(newMovies); // Display only new movies
        currentPage = page;
        document.getElementById('pageInfo').innerText = `Page ${currentPage} of ${totalPages}`;
    } catch (error) {
        console.error('Error fetching movies:', error);
        const cardContainer = document.getElementById('cardContainer');
        cardContainer.innerHTML = '<p class="error-message">Failed to load movies. Please try again later.</p>';
    }
}

async function fetchAndDisplayMoviesWithImages(movies) {
    try {
        if (movies.length === 0) {
            const cardContainer = document.getElementById('cardContainer');
            cardContainer.innerHTML = '<p class="no-results-message">No movies found.</p>';
            return;
        }
        const moviesWithImages = await Promise.all(movies.map(async movie => {
            const imageUrl = await fetchMovieImageByTitle(movie.title);
            return { ...movie, imageUrl };
        }));
        displayedMovies = moviesWithImages; // Update displayedMovies here
        displayMovies(moviesWithImages);
    } catch (error) {
        console.error('Error fetching and displaying movies with images:', error);
    }
}

async function fetchMovieImageByTitle(title) {
    try {
        const searchResponse = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${tmdbApiKey}&query=${encodeURIComponent(title)}`);
        if (!searchResponse.ok) {
            throw new Error('Failed to search for movie');
        }
        const searchData = await searchResponse.json();
        if (searchData.results.length === 0) {
            return '../images/card-picture.avif';
        }
        const movieId = searchData.results[0].id;
        const imageResponse = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/images?api_key=${tmdbApiKey}`);
        if (!imageResponse.ok) {
            throw new Error('Failed to fetch image');
        }
        const imageData = await imageResponse.json();
        const posterPath = imageData.posters.length > 0 ? imageData.posters[0].file_path : null;
        return posterPath ? `https://image.tmdb.org/t/p/w500${posterPath}` : '../images/card-picture.avif';
    } catch (error) {
        console.error(`Error fetching image for movie title ${title}:`, error);
        return '../images/card-picture.avif';
    }
}

function displayMovies(movies) {
    const cardContainer = document.getElementById('cardContainer');
    cardContainer.innerHTML = '';
    movies.forEach((movie, index) => {
        if (movie.imageUrl !== '../images/card-picture.avif') {
            const card = document.createElement('div');
            card.classList.add('card');
            card.innerHTML = `
                <img src="${movie.imageUrl}" alt="${movie.title}">
                <p><strong>Title:</strong> ${movie.title}</p>
                <div class="buttons">
                    <button class="showInfoButton" onclick="showModal(${index})">Show Info</button>
                    <button class="exportButton" onclick="showExportOptions(${index})">Export</button>
                </div>
                <div id="exportButtons_${index}" class="exportButtons" style="display: none;">
                    <button onclick="exportToCSV(${index})">Export CSV</button>
                    <button onclick="exportToWebP(${index})">Export WebP</button>
                    <button onclick="exportToSVG(${index})">Export SVG</button>
                </div>
            `;
            cardContainer.appendChild(card);
        }
    });
}

function searchMovies(query) {
    let filteredMovies = allMovies;

    const year = document.getElementById('yearInput').value;
    const genres = Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(checkbox => checkbox.value);

    if (year) {
        const parsedYear = parseInt(year);
        if (!isNaN(parsedYear)) {
            filteredMovies = filteredMovies.filter(movie => movie.release_year === parsedYear);
        }
    }

    if (genres.length > 0) {
        filteredMovies = filteredMovies.filter(movie => {
            return genres.some(genre => movie.listed_in.includes(genre));
        });
    }

    filteredMovies = filteredMovies.filter(movie => movie.title.toLowerCase().includes(query.toLowerCase()));

    fetchAndDisplayMoviesWithImages(filteredMovies);
}

async function applyFilter(startYear, endYear, genres, orderBy) {
    let filteredMovies = allMovies;

    if (startYear && endYear) {
        const parsedStartYear = parseInt(startYear);
        const parsedEndYear = parseInt(endYear);
        if (!isNaN(parsedStartYear) && !isNaN(parsedEndYear)) {
            filteredMovies = filteredMovies.filter(movie => {
                return movie.release_year >= parsedStartYear && movie.release_year <= parsedEndYear;
            });
        }
    }

    if (genres.length > 0) {
        filteredMovies = filteredMovies.filter(movie => {
            return genres.some(genre => movie.listed_in.includes(genre));
        });
    }

    switch (orderBy) {
        case 'relevance':
            // No sorting needed for relevance (default order)
            break;
        case 'year':
            filteredMovies.sort((a, b) => a.release_year - b.release_year);
            break;
        case 'alpha':
            filteredMovies.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'reverseAlpha':
            filteredMovies.sort((a, b) => b.title.localeCompare(a.title));
            break;
        default:
            break;
    }

    fetchAndDisplayMoviesWithImages(filteredMovies);
}





function showModal(index) {
    const movie = displayedMovies[index]; // Use displayedMovies here
    const modal = document.getElementById('movieInfoModal');
    const movieInfoContent = document.getElementById('movieInfoContent');
    movieInfoContent.innerHTML = `
        <img src="${movie.imageUrl}" alt="${movie.title}">
        <p><strong>Title:</strong> ${movie.title}</p>
        <p><strong>Description:</strong> ${movie.description}</p>
        <p><strong>Cast:</strong> ${movie.cast}</p>
        <p><strong>Country:</strong> ${movie.country}</p>
        <p><strong>Release Year:</strong> ${movie.release_year}</p>
        <p><strong>Rating:</strong> ${movie.rating}</p>
        <p><strong>Duration:</strong> ${movie.duration}</p>
        <p><strong>Genres:</strong> ${movie.listed_in}</p>
    `;
    modal.style.display = 'block';
}

function closeModal() {
    const modal = document.getElementById('movieInfoModal');
    modal.style.display = 'none';
}

function showExportOptions(index) {
    const movie = displayedMovies[index]; // Use displayedMovies here
    const modal = document.getElementById('exportOptionsModal');
    const exportOptionsContent = document.getElementById('exportOptionsContent');
    exportOptionsContent.innerHTML = `
        <p><strong>Export options for ${movie.title}</strong></p>
        <button onclick="exportToCSV(${index})">Export CSV</button>
        <button onclick="exportToWebP(${index})">Export WebP</button>
        <button onclick="exportToSVG(${index})">Export SVG</button>
    `;
    modal.style.display = 'block';
}

function closeExportModal() {
    const modal = document.getElementById('exportOptionsModal');
    modal.style.display = 'none';
}

function showFilterModal() {
    const modal = document.getElementById('filterOptionsModal');
    modal.style.display = 'block';
}

function closeFilterModal() {
    const modal = document.getElementById('filterOptionsModal');
    modal.style.display = 'none';
}

function exportToCSV(index) {
    const movie = displayedMovies[index]; // Use displayedMovies here
    const csvData = `Title,Release Year,Director,Description,Cast,Country,Rating,Duration,Genres\n${movie.title},${movie.release_year},${movie.director},${movie.description},${movie.cast},${movie.country},${movie.rating},${movie.duration},${movie.listed_in}`;
    downloadFile(csvData, `${movie.title}_data.csv`, 'text/csv');
}

function exportToWebP(index) {
    const movie = displayedMovies[index];
    if (!movie.imageUrl || movie.imageUrl === '../images/card-picture.avif') {
        console.error('No valid image URL found for this movie.');
        return;
    }
    
    const corsProxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const imageUrl = `${corsProxyUrl}${movie.imageUrl}`;
    
    const image = new Image();
    image.crossOrigin = 'Anonymous'; // Ensure CORS compatibility
    image.onload = function() {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = image.width;
        canvas.height = image.height;
        context.drawImage(image, 0, 0, image.width, image.height);

        canvas.toBlob(function(blob) {
            if (blob) {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${movie.title}_image.webp`;
                document.body.appendChild(a);
                a.click();
                setTimeout(() => {
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                }, 0);
            } else {
                console.error('Conversion to Blob failed!');
            }
        }, 'image/webp');
    };

    image.onerror = function() {
        console.error('Failed to load image.');
    };

    image.src = imageUrl;
}



function exportToSVG(index) {
    const movie = displayedMovies[index]; // Use displayedMovies here
    const svgData = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200">
        <text x="10" y="20">Title: ${movie.title}</text>
        <text x="10" y="40">Description: ${movie.description}</text>
        <text x="10" y="60">Release Year: ${movie.release_year}</text>
        <text x="10" y="80">Director: ${movie.director}</text>
        <text x="10" y="100">Cast: ${movie.cast}</text>
        <text x="10" y="120">Country: ${movie.country}</text>
        <text x="10" y="140">Rating: ${movie.rating}</text>
        <text x="10" y="160">Duration: ${movie.duration}</text>
        <text x="10" y="180">Genres: ${movie.listed_in}</text>
    </svg>`;
    downloadFile(svgData, `${movie.title}_data.svg`, 'image/svg+xml');
}

function downloadFile(data, filename, type) {
    const blob = new Blob([data], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 0);
}
function clearFilters() {
    // Clear year input
    document.getElementById('yearInput').value = '';

    // Uncheck all genre checkboxes
    const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });

    // Reset orderBy select to its default value (relevance)
    document.getElementById('orderBySelect').value = 'relevance';

    // Reset displayedMovies to allMovies (clearing filters)
    displayedMovies = allMovies;

    // Fetch and display all movies with cleared filters
    fetchAndDisplayMoviesWithImages(displayedMovies);

    // Close the filter modal
    closeFilterModal();
}

// Event listener for Clear All button
document.getElementById('clearFilterButton').addEventListener('click', clearFilters);

