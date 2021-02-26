import getBlobDuration from "get-blob-duration";

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
const commentForm = document.getElementById("jsComment");
const videoIcon = document.getElementById("jsvideoIcon");

let timer;

const registerView = () => {
  const videoId = window.location.href.split("/videos/")[1];
  fetch(`/api/${videoId}/view`, {
    method: "POST",
  });
};

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

const handleIcon = () => {
  videoIcon.innerHTML = "";
};

function handlePlayClick() {
  if (videoPlayer.paused) {
    videoPlayer.play();
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    videoIcon.innerHTML = '<i class="fas fa-play"></i>';
    setTimeout(handleIcon, 3000);
  } else {
    videoPlayer.pause();
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
    videoIcon.innerHTML = '<i class="fas fa-pause"></i>';
    setTimeout(handleIcon, 3000);
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
  videoPlayer.classList.remove("full");
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
  videoPlayer.classList.add("full");
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
  const hours = Math.floor(secondsNumber / 3600);
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

async function setTotalTime() {
  let duration;
  if (!Number.isFinite(videoPlayer.duration)) {
    const blob = await fetch(videoPlayer.src).then((response) =>
      response.blob()
    );
    duration = await getBlobDuration(blob);
  } else {
    duration = videoPlayer.duration;
  }
  getRange(duration);
  const totalTimeString = formatDate(duration);
  totalTime.innerHTML = totalTimeString;
}

function handleEnded() {
  registerView();
  videoPlayer.currentTime = 0;
  handleMouse();
  playBtn.innerHTML = '<i class="fas fa-play"></i>';
}

function getRange(duration) {
  rangeBar.setAttribute("max", duration);
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
  handleMouse();
  if (keyPress === 32) {
    event.preventDefault();
    handlePlayClick();
  } else if (keyPress === 37) {
    event.preventDefault();
    videoPlayer.currentTime -= 5;
    videoIcon.innerHTML = '<i class="fas fa-angle-double-left"></i>';
    setTimeout(handleIcon, 3000);
  } else if (keyPress === 39) {
    event.preventDefault();
    videoPlayer.currentTime += 5;
    videoIcon.innerHTML = '<i class="fas fa-angle-double-right"></i>';
    setTimeout(handleIcon, 3000);
  } else if (keyPress === 38) {
    event.preventDefault();
    videoPlayer.volume += 0.1;
    volumeBar.style.opacity = 1;

    volumeBar.value = videoPlayer.volume;
    setTimeout(() => {
      volumeBar.style = "";
    }, 3000);
    handleVolumeIcon(volumeBar.value);
  } else if (keyPress === 40) {
    event.preventDefault();
    videoPlayer.volume -= 0.1;
    volumeBar.style.opacity = 1;

    volumeBar.value = videoPlayer.volume;
    setTimeout(() => {
      volumeBar.style = "";
    }, 3000);
    handleVolumeIcon(volumeBar.value);
  }
}

const onComment = () => {
  window.removeEventListener("keydown", handlekeyDown);
};
const offComment = () => {
  window.addEventListener("keydown", handlekeyDown);
};

function init() {
  videoPlayer.volume = 0.5;
  setTotalTime();
  playBtn.innerHTML = '<i class="fas fa-play"></i>';
  playBtn.addEventListener("click", handlePlayClick);
  volumeBtn.addEventListener("click", handleVolumeClick);
  fullScreenBtn.addEventListener("click", goFullScreen);
  videoPlayer.addEventListener("timeupdate", getCurrentTime);
  videoPlayer.addEventListener("ended", handleEnded);
  videoPlayer.addEventListener("click", handlePlayClick);
  rangeBar.addEventListener("input", handlePlayDrag);
  window.addEventListener("keydown", handlekeyDown);
  volumeBar.addEventListener("input", handleVolumeDrag);
  videoContainer.addEventListener("mousemove", handleMouse);
  document.addEventListener("fullscreenchange", handleScreenChange);
  commentForm.onfocus = onComment;
  commentForm.onblur = offComment;
}

if (videoContainer) {
  videoPlayer.onload = init();
}
