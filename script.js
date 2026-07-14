const btn = document.querySelectorAll(".song");
const imageSection = document.querySelectorAll(".features li");
const footer = document.querySelector(".melvo-footer");
const progressBar = document.querySelector(".progress-bar");
const totalTime = document.querySelector(".total-time");
const playBtn = document.querySelector(".play-pause");
const songAudio = document.querySelector(".song-audio");

function updateFooter(song){
  footer.innerHTML = `<div class="track-info">
        <img src="${song.cover}" alt="Album Art" class="album-art" />
        <div class="track-details">
          <h4 class="track-title">${song.name}</h4>
          <p class="track-artist">${song.artist}</p>
        </div>
      </div>

      <div class="player-controls">
        <div class="control-buttons">
          <button class="btn-icon" aria-label="Shuffle">&#128256;</button>
          <button class="btn-icon" aria-label="Previous">&#9198;</button>
          <button class="btn-icon play-pause" aria-label="Play/Pause">
            &#9654;
          </button>
          <button class="btn-icon" aria-label="Next">&#9197;</button>
          <button class="btn-icon" aria-label="Repeat">&#128257;</button>
        </div>
        <div class="progress-container">
          <span class="song-audio"></span>
          <span class="time current-time">0:00</span>
          <input
            type="range"
            class="progress-bar"
            min="0"
            max="100"
            value="0"
          />
          <span class="time total-time">0:00</span>
        </div>
      </div>

      <div class="volume-controls">
        <span class="volume-icon">&#128266;</span>
        <input type="range" class="volume-bar" min="0" max="100" value="70" />
      </div>`;

}

function startPlayer(song) {

  runningTime.textContent = "0:00";
  progressBar.value = 0;
  progressBar.style.setProperty("--progress", "0%");

  playBtn.innerHTML = playIcon;

  songAudio.onloadedmetadata = function () {
    progressBar.max = song.audio.duration;
    totalTime.textContent = formatTime(song.audio.duration);
  };
  
}


fetch("./songs.json")
.then((response) => response.json())
.then((data) => {
  songs = data;
  
  btn.forEach((button) => {
    button.addEventListener("click", () => {
      const songId = button.id;

      localStorage.setItem("songId", songId);

      const selectedSong = songs.find((item) => item.id == songId);

      if (selectedSong) {
        updateFooter(selectedSong);
        startPlayer(selectedSong);
        setEvents();
      } else {
        console.error("Selected song not found.");
      }
    });  
  }); 
  })  

  .catch((error) => {
    console.error("Error fetching songs:", error);
  });  

imageSection.forEach((image) => {
  image.addEventListener("click", () => {
    imageSection.forEach((img) => {
      img.classList.remove("active");
    });  
    image.classList.add("active");
  });  
});  

function setEvents() {
  playBtn.addEventListener("click", () => {
    if (songAudio.paused) {
      songAudio.play();
    } else {
      songAudio.pause();
    }
  });

  songAudio.addEventListener("play", () => {
    playBtn.innerHTML = `&#10074`;
  });

  songAudio.addEventListener("pause", () => {
    playBtn.innerHTML = `&#9654`;
  });
  progressBar.addEventListener("input", () => {
    songAudio.currentTime = Number(progressBar.value);
  });

  songAudio.addEventListener("timeupdate", () => {
    if (!songAudio.duration) return;

    const progress = (songAudio.currentTime / songAudio.duration) * 100;
    progressBar.style.setProperty("--progress", `${progress}%`);
    progressBar.value = songAudio.currentTime;
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