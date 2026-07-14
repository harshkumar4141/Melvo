const songId = localStorage.getItem("songId");
const songImg = document.querySelector(".song-img");
const slider = document.querySelector(".slider");
const totalTime = document.querySelector(".total-time");
const runningTime = document.querySelector(".running-time");
const songAudio = document.querySelector(".song-audio");
const playList = document.querySelector(".playlist");
const playBtn = document.querySelector("#play");
const prevBtn = document.querySelector("#prev");
const nextBtn = document.querySelector("#next");
const loopBtn = document.querySelector("#loop");
let isLooping = false;

let playlistSongs = [];
let songs = [];

const playIcon = `<svg class="play-icon" width="24" height="24" viewBox="0 0 24 24" ><path d="M8 5v14l11-7z" /></svg>`;

const pauseIcon = `<svg class="play-icon" width="24" height="24" viewBox="0 0 24 24" ><path d="M6 5h4v14H6zm8 0h4v14h-4z" /></svg>`;

fetch("./songs.json")
  .then((response) => response.json())
  .then((data) => {
    songs = data;
    playlistSongs = [...songs];
    console.log("playlist:", playlistSongs);

    if (playlistSongs.length > 0) {
      makePlaylist(playlistSongs);
      
      const song = songs.find((item) => item.id == songId) || songs[0];
      startPlayer(song);
      setEvents();
    } else {
      console.error("No songs found in the playlist.");
    }
  })
  .catch((error) => {
    console.error("Error fetching songs:", error);
  });

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
}

function makePlaylist(playlistSongs) {
  playlistSongs.forEach((song) => {
    playList.innerHTML += `<div class="song-card" id="${song.id}">
            <img class="song-cover" src="${song.cover}" alt="${song.name}">
            <div class="credits">
              <div class="song-name">
                ${song.name}
              </div>
              <div class="singer-name">
                ${song.artist}
              </div>
            </div>
        </div>`;
  });
}

function setEvents() {
  playBtn.addEventListener("click", () => {
    if (songAudio.paused) {
      songAudio.play();
    } else {
      songAudio.pause();
    }
  });

  songAudio.addEventListener("play", () => {
    playBtn.innerHTML = pauseIcon;
  });

  songAudio.addEventListener("pause", () => {
    playBtn.innerHTML = playIcon;
  });
  slider.addEventListener("input", () => {
    songAudio.currentTime = Number(slider.value);
  });

  songAudio.addEventListener("timeupdate", () => {
    if (!songAudio.duration) return;

    const progress = (songAudio.currentTime / songAudio.duration) * 100;
    slider.style.setProperty("--progress", `${progress}%`);
    slider.value = songAudio.currentTime;
    runningTime.textContent = formatTime(songAudio.currentTime);
  });

  prevBtn.addEventListener("click", () => {
    const currentIndex = playlistSongs.findIndex(
      (song) => song.audio === songAudio.src,
    );
    const prevIndex =
      (currentIndex - 1 + playlistSongs.length) % playlistSongs.length;
    const prevSong = playlistSongs[prevIndex];
    startPlayer(prevSong);
  });

  nextBtn.addEventListener("click", () => {
    const currentIndex = playlistSongs.findIndex(
      (song) => song.audio === songAudio.src,
    );
    const nextIndex = (currentIndex + 1) % playlistSongs.length;
    const nextSong = playlistSongs[nextIndex];
    startPlayer(nextSong);
  });

  loopBtn.addEventListener("click", () => {
    isLooping = !isLooping;
    songAudio.loop = isLooping;
    loopBtn.classList.toggle("active", isLooping);
  });

  playList.addEventListener("click", (event) => {
    const songCard = event.target.closest(".song-card");
    if (songCard) {
      const selectedSong = playlistSongs.find(
        (song) => song.id == songCard.id,
      );
      startPlayer(selectedSong);
    }else{
      console.error("Clicked element is not a song card.");
    }
  });
}

function startPlayer(song) {
  songImg.src = song.cover;
  songAudio.src = song.audio;

  runningTime.textContent = "0:00";
  slider.value = 0;
  slider.style.setProperty("--progress", "0%");

  playBtn.innerHTML = playIcon;

  songAudio.onloadedmetadata = function () {
    slider.max = songAudio.duration;
    totalTime.textContent = formatTime(songAudio.duration);
  };
  
}