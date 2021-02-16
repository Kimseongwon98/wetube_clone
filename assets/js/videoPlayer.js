const videoContainer = document.getElementById("jsVideoPlayer");
const videoPlayer = document.querySelector("#jsVideoPlayer video");
const playBtn = document.getElementById("jsPlayButton");
const volumeBtn = document.getElementById("jsVolumeBtn");
const fullScreenBtn = document.getElementById("jsFullScreen");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const volumeBar = document.getElementById("jsVolumeBar");
const rangeBar = document.getElementById("jsPlayBar");
const controlBar = document.getElementById("jsController");

let timer;

function handleTransparent() {
  controlBar.style.opacity = "0";
  videoPlayer.style.cursor = "none";
}

function handleMouse() {
  controlBar.style.opacity = "1";
  videoPlayer.style.cursor = "pointer";
  clearTimeout(timer);
  timer = setTimeout(handleTransparent, 5000);
}

function handlePlayClick() {
  if (videoPlayer.paused) {
    videoPlayer.play();
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
  } else {
    videoPlayer.pause();
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
  }
}

function handleVolumeIcon(value) {
  if (value >= 0.6) {
    volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
  } else if (value >= 0.3) {
    volumeBtn.innerHTML = '<i class="fas fa-volume-down"></i>';
  } else if (value > 0) {
    volumeBtn.innerHTML = '<i class="fas fa-volume-off"></i>';
  } else {
    volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
  }
}

function handleVolumeClick() {
  if (videoPlayer.muted) {
    videoPlayer.muted = false;
    volumeBar.value = videoPlayer.volume;
    handleVolumeIcon(volumeBar.value);
  } else {
    volumeBar.value = 0;
    videoPlayer.muted = true;
    volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
  }
}

function exitFullScreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
}

function goFullScreen() {
  if (videoContainer.requestFullscreen) {
    videoContainer.requestFullscreen();
  } else if (videoContainer.mozRequestFullScreen) {
    videoContainer.mozRequestFullScreen();
  } else if (videoContainer.webkitRequestFullscreen) {
    videoContainer.webkitRequestFullscreen();
  } else if (videoContainer.msRequestFullscreen) {
    videoContainer.msRequestFullscreen();
  }
}

function handleScreenChange() {
  if (document.fullscreenElement) {
    fullScreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
    fullScreenBtn.removeEventListener("click", goFullScreen);
    fullScreenBtn.addEventListener("click", exitFullScreen);
  } else {
    fullScreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
    fullScreenBtn.removeEventListener("click", exitFullScreen);
    fullScreenBtn.addEventListener("click", goFullScreen);
  }
}

const formatDate = (seconds) => {
  const secondsNumber = parseInt(seconds, 10);
  let hours = Math.floor(secondsNumber / 3600);
  let minutes = Math.floor((secondsNumber - hours * 3600) / 60);
  let totalSeconds = secondsNumber - hours * 3600 - minutes * 60;

  if (hours !== 0) {
    minutes += 60 * hours;
  }
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  if (totalSeconds < 10) {
    totalSeconds = `0${totalSeconds}`;
  }
  return `${minutes}:${totalSeconds}`;
};
function getCurrentTime() {
  currentTime.innerHTML = formatDate(Math.floor(videoPlayer.currentTime));
  rangeBar.value = videoPlayer.currentTime;
}

function setTotalTime() {
  const totalTimeString = formatDate(videoPlayer.duration);
  totalTime.innerHTML = totalTimeString;
}

function handleEnded() {
  videoPlayer.currentTime = 0;
  handleMouse();
  playBtn.innerHTML = '<i class="fas fa-play"></i>';
}

function getRange() {
  rangeBar.setAttribute("max", videoPlayer.duration);
}

function handleVolumeDrag(event) {
  const {
    target: { value },
  } = event;
  videoPlayer.volume = value;
  handleVolumeIcon(value);
}

function handlePlayDrag(event) {
  const {
    target: { value },
  } = event;
  videoPlayer.currentTime = value;
}

function handlekeyDown(event) {
  const keyPress = event.keyCode;
  console.log(keyPress);
  event.preventDefault();
  handleMouse();
  if (keyPress === 32) {
    handlePlayClick();
  } else if (keyPress === 37) {
    videoPlayer.currentTime -= 5;
  } else if (keyPress === 39) {
    videoPlayer.currentTime += 5;
  } else if (keyPress === 38) {
    videoPlayer.volume += 0.1;
    volumeBar.value = videoPlayer.volume;
    handleVolumeIcon(volumeBar.value);
  } else if (keyPress === 40) {
    videoPlayer.volume -= 0.1;
    volumeBar.value = videoPlayer.volume;
    handleVolumeIcon(volumeBar.value);
  }
}

function init() {
  videoPlayer.volume = 0.5;
  playBtn.addEventListener("click", handlePlayClick);
  volumeBtn.addEventListener("click", handleVolumeClick);
  fullScreenBtn.addEventListener("click", goFullScreen);
  videoPlayer.addEventListener("loadedmetadata", setTotalTime);
  videoPlayer.addEventListener("timeupdate", getCurrentTime);
  videoPlayer.addEventListener("loadedmetadata", getRange);
  videoPlayer.addEventListener("ended", handleEnded);
  rangeBar.addEventListener("input", handlePlayDrag);
  window.addEventListener("keydown", handlekeyDown);
  volumeBar.addEventListener("input", handleVolumeDrag);
  videoContainer.addEventListener("mousemove", handleMouse);
  document.addEventListener("fullscreenchange", handleScreenChange);
}

if (videoContainer) {
  init();
}