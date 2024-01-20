// Assuming you have an API endpoint to fetch repositories data
const apiEndpoint = 'https://api.github.com/users/john_doe/repos';

// Global variables for pagination
let currentPage = 1;
let pageSize = 10;
let totalRepositories = 0;

// Function to load repositories based on current page and page size
function loadRepositories() {
    const url = `${apiEndpoint}?page=${currentPage}&per_page=${pageSize}`;
    
    // Make a fetch request or use your preferred method to get repository data
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            totalRepositories = data.total_count;
            updateUI(data.items);
        })
        .catch(error => console.error('Error fetching data:', error));
}

// Function to handle changing page size
function changePageSize() {
    pageSize = parseInt(document.getElementById('pageSize').value, 10);
    currentPage = 1; // Reset current page when page size changes
    loadRepositories();
}

// Function to filter repositories based on search input
function filterRepositories() {
    const searchInput = document.getElementById('search').value.toLowerCase();

    // If search input is empty, load all repositories
    if (!searchInput.trim()) {
        loadRepositories();
        return;
    }

    const searchUrl = `${apiEndpoint}/search/repositories?q=${searchInput}&page=${currentPage}&per_page=${pageSize}`;
    
    // Make a fetch request or use your preferred method to get filtered repository data
    fetch(searchUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            totalRepositories = data.total_count;
            updateUI(data.items);
        })
        .catch(error => console.error('Error fetching data:', error));
}

// Function to update the UI with repository data
function updateUI(repositories) {
    const repositoryList = document.getElementById('repositories');
    repositoryList.innerHTML = ''; // Clear the previous content

    // Iterate through each repository in the data and create HTML elements for them
    repositories.forEach(repository => {
        const repositoryItem = document.createElement('li');
        repositoryItem.innerHTML = `
            <a href="${repository.html_url}" target="_blank">${repository.name}</a>
            <p>${repository.description || 'No description available'}</p>
            <ul class="skills">
                <li>${repository.language || 'Not specified'}</li>
                <li>Stars: ${repository.stargazers_count}</li>
            </ul>
        `;
        repositoryList.appendChild(repositoryItem);
    });

    // Update pagination buttons
    const totalPages = Math.ceil(totalRepositories / pageSize);
    const paginationControls = document.getElementById('paginationControls');
    paginationControls.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.classList.add('button');
        button.textContent = i;
        button.onclick = () => {
            currentPage = i;
            loadRepositories();
        };
        paginationControls.appendChild(button);
    }

    // Disable/enable Previous and Next buttons based on current page
    const prevButton = document.createElement('button');
    prevButton.classList.add('button');
    prevButton.textContent = 'Previous';
    prevButton.onclick = () => {
        if (currentPage > 1) {
            currentPage--;
            loadRepositories();
        }
    };
    paginationControls.appendChild(prevButton);

    const nextButton = document.createElement('button');
    nextButton.classList.add('button');
    nextButton.textContent = 'Next';
    nextButton.onclick = () => {
        if (currentPage < totalPages) {
            currentPage++;
            loadRepositories();
        }
    };
    paginationControls.appendChild(nextButton);
}

// Initial load on page load
loadRepositories();
