import { getFirebaseOrder, saveFirebaseOrder } from './firebase.js';

// --- ESTADOS GLOBALES ---
let musicFiles = [];
let globalMetadataCache = {}; 
let visualOrder = [];         
let shuffleQueue = [];        
let isShuffle = false;
let currentSongPath = null;

const audio = new Audio();
let playerState = JSON.parse(localStorage.getItem('playerState')) || { volume: 0.8 };

// --- DOM ELEMENTS ---
const playlistBody = document.getElementById('playlist-body');
const searchInput = document.getElementById('search-input');
const songCount = document.getElementById('song-count');
const btnPlay = document.getElementById('btn-play');
const iconPlay = document.getElementById('icon-play');
const iconPause = document.getElementById('icon-pause');
const btnNext = document.getElementById('btn-next');
const btnPrev = document.getElementById('btn-prev');
const btnShuffle = document.getElementById('btn-shuffle');
const progressBar = document.getElementById('progress-bar');
const progressContainer = document.getElementById('progress-container');
const volumeSlider = document.getElementById('volume-slider');

// --- INDEXEDDB PARA CACHE (Versión 3) ---
const dbName = "MusicDB_v3"; 
function initDB() {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open(dbName, 1);
        req.onupgradeneeded = e => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains("metadata")) {
                db.createObjectStore("metadata", { keyPath: "path" });
            }
        };
        req.onsuccess = e => resolve(e.target.result);
        req.onerror = e => reject(e);
    });
}

function getFromDB(db, path) {
    return new Promise((resolve) => {
        const tx = db.transaction("metadata", "readonly");
        const req = tx.objectStore("metadata").get(path);
        req.onsuccess = () => resolve(req.result);
    });
}

function saveToDB(db, data) {
    const tx = db.transaction("metadata", "readwrite");
    tx.objectStore("metadata").put(data);
}

// --- ESCANEO AUTOMÁTICO BLINDADO (API TREES) ---
async function fetchMusicFilesAutomatically() {
    let files = [];
    const username = "Clashroyalo5";
    const repo = "clashroyalo5.github.io"; 
    
    // Probamos las ramas comunes donde puede estar alojada tu web
    const branches = ['main', 'master', 'gh-pages']; 
    
    for (const branch of branches) {
        // La API de árboles busca en todo el repositorio recursivamente
        const apiUrl = `https://api.github.com/repos/${username}/${repo}/git/trees/${branch}?recursive=1`;
        try {
            const res = await fetch(apiUrl);
            if (res.ok) {
                const data = await res.json();
                
                // Filtramos cualquier archivo en cualquier carpeta que termine en .mp3
                files = data.tree
                    .filter(item => item.type === 'blob' && item.path.toLowerCase().endsWith('.mp3'))
                    .map(item => item.path);
                
                if (files.length > 0) {
                    console.log(`✅ ${files.length} canciones encontradas en la rama ${branch}`);
                    return files;
                }
            } else if (res.status === 403) {
                alert("⚠️ Límite de GitHub API alcanzado por recargar mucho. Toca esperar 1 hora.");
                return [];
            }
        } catch (e) {
            console.warn(`Buscando en rama ${branch} falló...`);
        }
    }

    // Fallback local por si estás programando en Live Server
    if (files.length === 0 && (window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost')) {
        try {
            const res = await fetch('music/');
            if (res.ok) {
                const text = await res.text();
                const doc = new DOMParser().parseFromString(text, 'text/html');
                return Array.from(doc.querySelectorAll('a'))
                    .map(a => a.getAttribute('href'))
                    .filter(href => href && href.toLowerCase().endsWith('.mp3'))
                    .map(href => 'music/' + decodeURIComponent(href).split('/').pop());
            }
        } catch (e) {}
    }
    
    return files;
}

// --- EXTRACCIÓN METADATOS ---
function extractMetadata(path) {
    return new Promise(async (resolve) => {
        // 1. Obtenemos el nombre del archivo
        let fileName = decodeURIComponent(path.split('/').pop());
        
        // 2. Quitamos el ".mp3" al final de forma manual, sin expresiones regulares
        if (fileName.toLowerCase().endsWith('.mp3')) {
            fileName = fileName.slice(0, -4); 
        }
        
        // 3. Limpieza segura del texto "(SPOTISAVER)"
        fileName = fileName.split('(SPOTI')[0].trim();
        
        let fallbackArtist = "Desconocido";
        let fallbackTitle = fileName;
        
        if (fileName.includes(' - ')) {
            const parts = fileName.split(' - ');
            fallbackArtist = parts[0].trim();
            fallbackTitle = parts.slice(1).join(' - ').trim();
        }

        try {
            const safeUrl = new URL(path, window.location.origin).href;
            const response = await fetch(safeUrl);
            if (!response.ok) throw new Error("CORS o archivo no encontrado");
            
            const blob = await response.blob();
            
            jsmediatags.read(blob, {
                onSuccess: function(tag) {
                    let coverUrl = null;
                    if (tag.tags && tag.tags.picture) {
                        const { data, format } = tag.tags.picture;
                        let base64String = "";
                        for (let i = 0; i < data.length; i++) {
                            base64String += String.fromCharCode(data[i]);
                        }
                        coverUrl = `data:${format};base64,${btoa(base64String)}`;
                    }
                    
                    // Limpieza segura también para el título interno de los metadatos
                    let rawTitle = tag.tags.title || fallbackTitle;
                    let realTitle = rawTitle.split('(SPOTI')[0].trim();
                    
                    resolve({
                        path,
                        title: realTitle,
                        artist: tag.tags.artist || fallbackArtist,
                        album: tag.tags.album || 'Sin álbum',
                        cover: coverUrl
                    });
                },
                onError: function() {
                    resolve({ path, title: fallbackTitle, artist: fallbackArtist, album: 'Desconocido', cover: null });
                }
            });
        } catch (error) {
            resolve({ path, title: fallbackTitle, artist: fallbackArtist, album: 'Desconocido', cover: null });
        }
    });
}

// --- INICIALIZACIÓN ---
async function initApp() {
    musicFiles = await fetchMusicFilesAutomatically();
    
    if (musicFiles.length === 0) {
        songCount.textContent = "0 canciones encontradas";
        alert("No se pudieron leer los archivos .mp3. Asegúrate de tener las canciones subidas.");
        return;
    }

    const db = await initDB();
    
    for (const path of musicFiles) {
        let cached = await getFromDB(db, path);
        if (!cached) {
            cached = await extractMetadata(path);
            saveToDB(db, cached);
        }
        globalMetadataCache[path] = cached;
    }
    
    let fbOrder = await getFirebaseOrder();
    
    if (fbOrder) {
        visualOrder = fbOrder.filter(path => musicFiles.includes(path));
        const newSongs = musicFiles.filter(path => !visualOrder.includes(path));
        visualOrder = [...visualOrder, ...newSongs];
    } else {
        visualOrder = [...musicFiles];
    }

    isShuffle = playerState.isShuffle || false;
    currentSongPath = playerState.currentSongPath || null;
    if(isShuffle && playerState.shuffleQueue) {
        shuffleQueue = playerState.shuffleQueue;
    }
    
    if (isShuffle) btnShuffle.classList.add('active');
    
    audio.volume = playerState.volume;
    volumeSlider.value = playerState.volume;

    renderPlaylist(visualOrder);
    initSortable();
    
    if(currentSongPath && globalMetadataCache[currentSongPath]) {
        updatePlayerUI(currentSongPath);
    }
}

// --- RENDERIZADO Y UI ---
function renderPlaylist(orderArray) {
    playlistBody.innerHTML = '';
    songCount.textContent = `${orderArray.length} canciones`;

    orderArray.forEach((path, index) => {
        const meta = globalMetadataCache[path];
        const row = document.createElement('div');
        row.className = `song-row ${path === currentSongPath ? 'active' : ''}`;
        row.dataset.path = path;
        
        row.innerHTML = `
            <div class="col-index">${index + 1}</div>
            <div class="col-title">
                <img src="${meta.cover || 'data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 fill=%22%2330363D%22/></svg>'}" class="song-cover">
                <div class="song-info">
                    <span class="song-title">${meta.title}</span>
                    <span class="song-artist-mobile">${meta.artist}</span>
                </div>
            </div>
            <div class="col-artist">${meta.artist}</div>
            <div class="col-album">${meta.album}</div>
        `;
        
        row.addEventListener('click', () => playSong(path, true));
        playlistBody.appendChild(row);
    });
}

function updateVisualIndexes() {
    const rows = playlistBody.querySelectorAll('.song-row');
    rows.forEach((row, i) => {
        row.querySelector('.col-index').textContent = i + 1;
    });
}

// --- DRAG AND DROP ---
function initSortable() {
    new Sortable(playlistBody, {
        animation: 150,
        ghostClass: 'sortable-ghost',
        onEnd: function () {
            const rows = Array.from(playlistBody.querySelectorAll('.song-row'));
            visualOrder = rows.map(row => row.dataset.path);
            updateVisualIndexes();
            saveFirebaseOrder(visualOrder);
        }
    });
}

// --- BÚSQUEDA ---
searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    if(term === '') {
        renderPlaylist(visualOrder);
    } else {
        const filtered = visualOrder.filter(path => {
            const m = globalMetadataCache[path];
            return m.title.toLowerCase().includes(term) || 
                   m.artist.toLowerCase().includes(term) ||
                   m.album.toLowerCase().includes(term);
        });
        renderPlaylist(filtered);
    }
});

// --- REPRODUCCIÓN Y SHUFFLE ---
function saveLocalState() {
    playerState = { isShuffle, shuffleQueue, currentSongPath, volume: audio.volume };
    localStorage.setItem('playerState', JSON.stringify(playerState));
}

function generateShuffleQueue(startPath) {
    let pool = visualOrder.filter(p => p !== startPath);
    for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    return [startPath, ...pool];
}

function playSong(path, isManualClick = false) {
    currentSongPath = path;
    
    if (isShuffle && (isManualClick || shuffleQueue.length === 0)) {
        shuffleQueue = generateShuffleQueue(path);
    }

    const safeUrl = new URL(path, window.location.origin).href;
    audio.src = safeUrl;
    
    audio.play().then(() => {
        iconPlay.style.display = 'none';
        iconPause.style.display = 'block';
    }).catch(error => {
        console.error("Error reproduciendo:", error);
    });
    
    updatePlayerUI(path);
    
    document.querySelectorAll('.song-row').forEach(row => {
        row.classList.toggle('active', row.dataset.path === path);
    });
    
    saveLocalState();
}

btnShuffle.addEventListener('click', () => {
    isShuffle = !isShuffle;
    btnShuffle.classList.toggle('active', isShuffle);
    
    if (isShuffle && currentSongPath) {
        shuffleQueue = generateShuffleQueue(currentSongPath);
    }
    saveLocalState();
});

btnNext.addEventListener('click', () => {
    if (!currentSongPath) return;
    let nextPath;
    
    if (isShuffle) {
        const idx = shuffleQueue.indexOf(currentSongPath);
        if (idx === -1 || idx === shuffleQueue.length - 1) {
            const randomStart = visualOrder[Math.floor(Math.random() * visualOrder.length)];
            shuffleQueue = generateShuffleQueue(randomStart);
            nextPath = shuffleQueue[0];
        } else {
            nextPath = shuffleQueue[idx + 1];
        }
    } else {
        const idx = visualOrder.indexOf(currentSongPath);
        nextPath = (idx === -1 || idx === visualOrder.length - 1) ? visualOrder[0] : visualOrder[idx + 1];
    }
    
    playSong(nextPath, false); 
});

btnPrev.addEventListener('click', () => {
    if (!currentSongPath) return;
    if (audio.currentTime > 3) {
        audio.currentTime = 0;
        return;
    }
    
    let prevPath;
    if (isShuffle) {
        const idx = shuffleQueue.indexOf(currentSongPath);
        prevPath = (idx <= 0) ? shuffleQueue[shuffleQueue.length - 1] : shuffleQueue[idx - 1];
    } else {
        const idx = visualOrder.indexOf(currentSongPath);
        prevPath = (idx <= 0) ? visualOrder[visualOrder.length - 1] : visualOrder[idx - 1];
    }
    
    playSong(prevPath, false);
});

btnPlay.addEventListener('click', () => {
    if (!currentSongPath && visualOrder.length > 0) {
        playSong(visualOrder[0], true);
        return;
    }
    if (audio.paused) {
        audio.play().then(() => {
            iconPlay.style.display = 'none';
            iconPause.style.display = 'block';
        }).catch(e => console.error(e));
    } else {
        audio.pause();
        iconPlay.style.display = 'block';
        iconPause.style.display = 'none';
    }
});

audio.addEventListener('ended', () => btnNext.click());

// --- UI DEL REPRODUCTOR ---
function updatePlayerUI(path) {
    const meta = globalMetadataCache[path];
    document.getElementById('player-title').textContent = meta.title;
    document.getElementById('player-artist').textContent = meta.artist;
    document.getElementById('player-cover').src = meta.cover || 'data:image/svg+xml;utf8,<svg viewBox="0 0 100 100"><rect width="100" height="100" fill="%2330363D"/></svg>';
}

function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}

audio.addEventListener('timeupdate', () => {
    document.getElementById('time-current').textContent = formatTime(audio.currentTime);
    if(audio.duration) {
        document.getElementById('time-total').textContent = formatTime(audio.duration);
        const progress = (audio.currentTime / audio.duration) * 100;
        progressBar.style.width = `${progress}%`;
    }
});

progressContainer.addEventListener('click', (e) => {
    if (!audio.duration) return;
    const rect = progressContainer.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    audio.currentTime = (clickX / width) * audio.duration;
});

volumeSlider.addEventListener('input', (e) => {
    audio.volume = e.target.value;
    saveLocalState();
});

document.addEventListener('DOMContentLoaded', initApp);