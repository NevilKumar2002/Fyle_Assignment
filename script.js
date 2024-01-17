const apiUrl = "https://api.github.com/users/";

const repositoriesDiv = document.getElementById("repositories");

async function getRepositories() {
    const username = document.getElementById("username").value;
    const loader = document.getElementById("loader");
    const totalRepositoriesDiv = document.getElementById("totalRepositories");
    const paginationDiv = document.getElementById("pagination");

    loader.style.display = "block";
    totalRepositoriesDiv.innerHTML = "";
    repositoriesDiv.innerHTML = "";
    paginationDiv.innerHTML = "";

    try {
        const response = await fetch(`${apiUrl}${username}/repos`);
        const repositories = await response.json();

        totalRepositoriesDiv.innerHTML = `
        <div>
       
        <p><strong>UserName:</strong> ${repositories[0].owner.login}</p>
        <img src=${repositories[0].owner.avatar_url} class="avatar-image" alt="user-profile-image" />
        <p><strong>Total Repositories:</strong> ${repositories.length}</p>
        </div>
        
        `;
        renderRepositories(repositories);
        renderPaginationButtons(repositories);
    } catch (error) {
        console.error("Error fetching repositories:", error);
    } finally {
        loader.style.display = "none";
    }
}
function convertDate(date){
    const dateString = date;
    const dateTime = new Date(dateString);

// Format the date and time
        const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        timeZoneName: 'short'
        };

   const formattedDateTime = dateTime.toLocaleDateString('en-US', options);
return formattedDateTime;
}
function renderRepositories(repositories) {
    const repositoriesPerPage = 10;
    const totalPages = Math.ceil(repositories.length / repositoriesPerPage);

    renderPage(repositories, 1, repositoriesPerPage);
}

function renderPage(repositories, currentPage, repositoriesPerPage) {
    const start = (currentPage - 1) * repositoriesPerPage;
    const end = start + repositoriesPerPage;

    const repositoriesArray = Array.isArray(repositories) ? repositories : [repositories];
    const pageRepositories = repositoriesArray.slice(start, end);

    // Clear previous repositories
    repositoriesDiv.innerHTML = "";

    pageRepositories.forEach(repository => {
        const repositoryElement = document.createElement("div");
        //created_at pushed_at
        repositoryElement.className="repository-element";
        repositoryElement.innerHTML = `
            <h3>${repository.name}</h3>
            <p><strong>Description:</strong> ${repository.description || "No description"}</p>
            <p><strong>Created At:</strong>${convertDate(repository.created_at)}</p>
            <p><strong>Published At:</strong>${convertDate(repository.pushed_at)}</p>
            <p class="language-button"><strong>Language:</strong> ${repository.language || "Not specified"}</p>
            <hr>
        `;
        repositoriesDiv.appendChild(repositoryElement);
    });
}

function renderPaginationButtons(repositories) {
    const paginationDiv = document.getElementById("pagination");
    const repositoriesPerPage = 10;
    const totalPages = Math.ceil(repositories.length / repositoriesPerPage);

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement("button");
        button.className="paginationsButton"
        button.textContent = i;
        button.addEventListener("click", () => {
            renderPage(repositories, i, repositoriesPerPage);
        });
        paginationDiv.appendChild(button);
    }
}
