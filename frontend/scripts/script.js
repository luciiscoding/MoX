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
    let displayedMovies = [];

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
    
        document.getElementById('clearFilterButton').addEventListener('click', clearFilters);
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
            await fetchAndDisplayMoviesWithImages(newMovies);
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
            displayedMovies = moviesWithImages;
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

        const yearElement = document.getElementById('yearInput'); 
        if (yearElement) {
            const year = yearElement.value;
            if (year) {
                const parsedYear = parseInt(year);
                if (!isNaN(parsedYear)) {
                    filteredMovies = filteredMovies.filter(movie => movie.release_year === parsedYear);
                }
            }
        }

        const genres = Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(checkbox => checkbox.value);
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
        const movie = displayedMovies[index];
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
        const movie = displayedMovies[index];
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
        const movie = displayedMovies[index];
        const csvData = `Title,Release Year,Director,Description,Cast,Country,Rating,Duration,Genres\n${movie.title},${movie.release_year},${movie.director},${movie.description},${movie.cast},${movie.country},${movie.rating},${movie.duration},${movie.listed_in}`;
        downloadFileCsv(csvData, `${movie.title}_data.csv`, 'text/csv');
    }


    async function exportToSVG(index) {
        const movie = displayedMovies[index];

        try {
           
            const svgData = `
                <svg xmlns="http://www.w3.org/2000/svg" width="600" height="400">
                    <!-- Background rectangle -->
                    <rect x="0" y="0" width="600" height="400" fill="white" />
                    <!-- Image -->
                    <image href="${movie.imageUrl}" x="50" y="50" width="200" height="300" />
                    <!-- Movie details -->
                    <text x="300" y="100" font-size="20">${movie.title}</text>
                    <text x="300" y="140" font-size="14">Release Year: ${movie.release_year}</text>
                    <text x="300" y="160" font-size="14">Rating: ${movie.rating}</text>
                    <text x="300" y="180" font-size="14">Duration: ${movie.duration} min</text>
                    <text x="300" y="200" font-size="14">Country: ${movie.country}</text>
                    <text x="300" y="220" font-size="14">Genres: ${movie.listed_in}</text>
                </svg>`;

          
            downloadFileSVG(svgData, `${movie.title}_info.svg`, 'image/svg+xml');
        } catch (error) {
            console.error('Error exporting to SVG:', error);
        }
    }

    function createSvgContent(movie) {
     
        const svgStyles = `
            <style>
                .card {
                    font-family: Arial, sans-serif;
                    background-color: #f0f0f0;
                    width: 400px;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    display: flex;
                    align-items: center;
                }
                .card img {
                    width: 120px;
                    height: auto;
                    border-radius: 8px;
                    margin-right: 20px;
                }
                .card-content {
                    flex-grow: 1;
                }
                .card-content p {
                    margin: 8px 0;
                    line-height: 1.5;
                }
            </style>
        `;

        // SVG content
        const svgContent = `
            <svg xmlns="http://www.w3.org/2000/svg" width="400" height="200">
                <foreignObject width="100%" height="100%">
                    <div xmlns="http://www.w3.org/1999/xhtml" class="card">
                        <img src="${movie.imageUrl}" alt="${movie.title}">
                        <div class="card-content">
                            <p><strong>Title:</strong> ${movie.title}</p>
                            <p><strong>Description:</strong> ${movie.description}</p>
                            <p><strong>Cast:</strong> ${movie.cast}</p>
                            <p><strong>Country:</strong> ${movie.country}</p>
                            <p><strong>Release Year:</strong> ${movie.release_year}</p>
                            <p><strong>Rating:</strong> ${movie.rating}</p>
                            <p><strong>Duration:</strong> ${movie.duration} min</p>
                            <p><strong>Genres:</strong> ${movie.listed_in}</p>
                        </div>
                    </div>
                </foreignObject>
            </svg>
        `;

        return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
                ${svgStyles}
                ${svgContent}`;
    }


    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    function preparePieChartData(movie) {
       
        const pieChartData = [
            { label: 'Category A', value: 30 },
            { label: 'Category B', value: 50 },
            { label: 'Category C', value: 20 }
        ];
        return pieChartData;
    }


    function drawPieChart(ctx, data, movie) {
        const total = data.reduce((acc, item) => acc + item.value, 0);
        let startAngle = -Math.PI / 2;

        
        const canvasWidth = 600; 
        const canvasHeight = 600 + data.length * 30; 

        
        ctx.canvas.width = canvasWidth;
        ctx.canvas.height = canvasHeight;

       
        data.forEach((item, index) => {
            const angle = (item.value / total) * 2 * Math.PI;
            ctx.beginPath();
            ctx.moveTo(canvasWidth / 2, canvasHeight / 2); 
            ctx.arc(canvasWidth / 2, canvasHeight / 2, 250, startAngle, startAngle + angle);
            const segmentColor = getRandomColor();
            ctx.fillStyle = segmentColor; 
            ctx.fill();
            ctx.closePath();

           
            const labelAngle = startAngle + angle / 2;
            const labelRadius = 180; 
            const labelX = canvasWidth / 2 + labelRadius * Math.cos(labelAngle);
            const labelY = canvasHeight / 2 + labelRadius * Math.sin(labelAngle);

          
            ctx.font = '14px Arial';
            ctx.fillStyle = 'black';
            ctx.textAlign = 'center';

         
            let labelText;
            switch (index) {
                case 0:
                    labelText = `Genre: ${movie.release_year}`;
                    break;
                case 1:
                    labelText = `Rating: ${getRandomInt(1, 10)}`; 
                    break;
                case 2:
                    labelText = `Duration: ${movie.duration}`;
                    break;
                default:
                    labelText = `Info ${index + 1}`; 
                    break;
            }
            
            ctx.fillText(labelText, labelX, labelY);

            startAngle += angle;
        });

       
        ctx.font = '20px Arial';
        ctx.fillText(movie.title, canvasWidth / 2, 50); 

       
        ctx.font = '16px Arial';
        ctx.fillText(`Rating: ${getRandomInt(1, 10)}`, canvasWidth / 2, canvasHeight - 70); 
        ctx.fillText(`Duration: ${movie.duration} min`, canvasWidth / 2, canvasHeight - 50); 
        ctx.fillText(`Country: ${movie.country}`, canvasWidth / 2, canvasHeight - 30); 
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }



    async function exportToWebP(index) {
        const movie = displayedMovies[index];

        try {
           
            const data = preparePieChartData(movie);

            
            const canvas = document.createElement('canvas');
            canvas.width = 800;
            canvas.height = 800;
            const ctx = canvas.getContext('2d');
            drawPieChart(ctx, data, movie); 

            
            const webpData = await encodeWebP(canvas);

           
            downloadFile(webpData, `${movie.title}_chart.webp`, 'image/webp');
        } catch (error) {
            console.error('Error exporting to WebP:', error);
        }
    }

    function encodeWebP(canvas) {
        return new Promise((resolve, reject) => {
            try {
                const url = canvas.toDataURL('image/webp');
                const base64Data = url.split(',')[1];
                const binary = atob(base64Data);
                const array = [];
                for (let i = 0; i < binary.length; i++) {
                    array.push(binary.charCodeAt(i));
                }
                const blob = new Blob([new Uint8Array(array)], { type: 'image/webp' });
                resolve(blob);
            } catch (error) {
                reject(error);
            }
        });
    }

    function downloadFile(blob, filename = 'download.png', type = 'image/png') {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function downloadFileCsv(data, filename, type) {
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

    function downloadFileSVG(data, filename, type) {
        const blob = new Blob([data], { type });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }



    function clearFilters() {
        console.log('clearFilters called');
        
        const startYearInput = document.getElementById('startYearInput');
        const endYearInput = document.getElementById('endYearInput');
        
        if (!startYearInput) {
            console.error('startYearInput element not found');
            return;
        }
        if (!endYearInput) {
            console.error('endYearInput element not found');
            return;
        }
        
        startYearInput.value = '';
        endYearInput.value = '';
    
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        if (checkboxes.length === 0) {
            console.error('No checkboxes found');
        } else {
            checkboxes.forEach(checkbox => {
                checkbox.checked = false;
            });
        }
    
        const orderBySelect = document.getElementById('orderBySelect');
        if (!orderBySelect) {
            console.error('orderBySelect element not found');
            return;
        }
        orderBySelect.value = 'relevance';
    
        displayedMovies = allMovies;
        fetchAndDisplayMoviesWithImages(displayedMovies);
    
        closeFilterModal();
    }
    
    