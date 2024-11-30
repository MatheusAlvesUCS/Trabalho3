const API_URL = "https://ucsdiscosapi.azurewebsites.net/api";
const API_KEY = "8175fA5f6098c5301022f475da32a2aa";

let token = "";
let currentPage = 1;
let totalItems = 105;
let isLoading = false; // Flag para impedir múltiplas requisições simultâneas

async function authenticate() {
    try {
        const response = await fetch(`${API_URL}/autenticar`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ apiKey: API_KEY }),
        });

        // Verificando se a resposta foi bem-sucedida
        if (!response.ok) {
            throw new Error(`Erro na autenticação: ${response.status}`);
        }

        const data = await response.json();
        token = data.token;
        console.log('Autenticação bem-sucedida, token obtido.');
    } catch (error) {
        console.error("Erro ao autenticar:", error);
    }
}

async function fetchAlbums(page, limit = 4) {
    if (isLoading) return; // Evita múltiplas requisições simultâneas
    isLoading = true;

    try {
        showLoading(true);

        // Verificando se o token está presente
        if (!token) {
            console.error("Token não encontrado. A autenticação pode ter falhado.");
            return;
        }

        const response = await fetch(`${API_URL}/albums?page=${page}&limit=${limit}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        // Verificando a resposta da API
        if (!response.ok) {
            throw new Error(`Erro ao buscar álbuns: ${response.status}`);
        }

        const data = await response.json();
        renderAlbums(data);
        isLoading = false;
    } catch (error) {
        console.error("Erro ao buscar álbuns:", error);
    } finally {
        showLoading(false);
    }
}

function renderAlbums(albums) {
    const container = document.getElementById("album-container");
    
    // Limpa o conteúdo anterior para evitar duplicações
    container.innerHTML = "";
    
    albums.forEach(album => {
        const col = document.createElement("div");
        col.className = "col-12 col-md-6";
        col.innerHTML = `<img src="${album.capa}" alt="${album.titulo}" data-id="${album.id}" class="album-cover">`;
        container.appendChild(col);
    });

    setupModalEvents();
}

function setupModalEvents() {
    document.querySelectorAll(".album-cover").forEach(img => {
        img.addEventListener("click", async () => {
            const id = img.getAttribute("data-id");
            const album = await fetchAlbumDetails(id);
            showAlbumModal(album);
        });
    });
}

async function fetchAlbumDetails(id) {
    try {
        const response = await fetch(`${API_URL}/albums/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
            throw new Error(`Erro ao buscar detalhes do álbum: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Erro ao buscar detalhes do álbum:", error);
    }
}

function showAlbumModal(album) {
    document.getElementById("modalTitle").textContent = album.titulo;
    document.getElementById("modalImage").src = album.capa;
    document.getElementById("modalArtist").textContent = album.artista;
    document.getElementById("modalGenre").textContent = album.genero;
    document.getElementById("modalYear").textContent = album.anoLancamento;
    new bootstrap.Modal(document.getElementById("albumModal")).show();
}

function showLoading(show) {
    document.getElementById("loading").classList.toggle("d-none", !show);
}

function setupInfiniteScroll() {
    window.addEventListener("scroll", () => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
            if (currentPage * 4 < totalItems) {
                currentPage++;
            } else {
                currentPage = 1;
            }
            fetchAlbums(currentPage, 4);
        }
    });
}

(async function init() {
    await authenticate();
    fetchAlbums(currentPage, 12);
    setupInfiniteScroll();
})();
