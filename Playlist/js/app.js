import { getFirebaseOrder, saveFirebaseOrder } from './firebase.js';

// --- CONFIGURACIÓN Y ESTADOS ---
// Debes colocar el nombre EXACTO del archivo incluyendo la extensión
const musicFiles = [
    "music/Alan Walker, Ava Max - Alone, Pt. II (SPOTISAVER).mp3",
    "music/cancion2.mp3",
    "music/cancion3.mp3"
];

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

// --- INDEXEDDB PARA CACHE ---
const dbName = "MusicDB";
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

// --- EXTRACCIÓN METADATOS INTELIGENTE ---
function extractMetadata(path) {
    return new Promise((resolve) => {
        // Extraer nombre del archivo decodificado (por si tiene %20)
        const fileName = decodeURIComponent(path.split('/').pop().replace('.mp3', ''));
        
        // Separar "Artista - Título" si el archivo tiene ese formato
        let fallbackArtist = "Desconocido";
        let fallbackTitle = fileName;
        
        if (fileName.includes(' - ')) {
            const parts = fileName.split(' - ');
            fallbackArtist = parts[0].trim();
            fallbackTitle = parts[1].trim(); // Toma el resto como título
        }

        fetch(path)
            .then(res => {
                if(!res.ok) throw new Error("Fetch failed (posible problema de CORS o ruta incorrecta)");
                return res.blob();
            })
            .then(blob => {
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
                        resolve({
                            path,
                            title: tag.tags.title || fallbackTitle,
                            artist: tag.tags.artist || fallbackArtist,
                            album: tag.tags.album || 'Sin álbum',
                            cover: coverUrl
                        });
                    },
                    onError: function() {
                        // Falla la librería jsmediatags, usamos los nombres del archivo
                        resolve({ path, title: fallbackTitle, artist: fallbackArtist, album: 'Desconocido', cover: null });
                    }
                });
            })
            .catch(() => {
                // Falla el fetch (CORS o archivo no existe), usamos los nombres del archivo
                resolve({ path, title: fallbackTitle, artist: fallbackArtist, album: 'Error de carga', cover: null });
            });
    });
}

// --- INICIALIZACIÓN ---
async function initApp() {
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
        
        row.addEventListener('click', () => playSong(path));
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
        onEnd: function (evt) {
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

function playSong(path) {
    currentSongPath = path;
    
    if (isShuffle) {
        shuffleQueue = generateShuffleQueue(path);
    }

    audio.src = path;
    audio.play();
    
    iconPlay.style.display = 'none';
    iconPause.style.display = 'block';
    
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
        nextPath = (idx === -1 || idx === shuffleQueue.length - 1) ? shuffleQueue[0] : shuffleQueue[idx + 1];
    } else {
        const idx = visualOrder.indexOf(currentSongPath);
        nextPath = (idx === -1 || idx === visualOrder.length - 1) ? visualOrder[0] : visualOrder[idx + 1];
    }
    playSong(nextPath);
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
    playSong(prevPath);
});

btnPlay.addEventListener('click', () => {
    if (!currentSongPath && visualOrder.length > 0) {
        playSong(visualOrder[0]);
        return;
    }
    if (audio.paused) {
        audio.play();
        iconPlay.style.display = 'none';
        iconPause.style.display = 'block';
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