const videoBlock = document.querySelectorAll("#jsVideoBlock");

const stopPlaying = (event) => {
  const video = event.target.querySelector("video");
  video.pause();
};

const handleHover = (event) => {
  const video = event.target.querySelector("video");
  video.play();
  video.muted = true;
};

const init = () => {
  videoBlock.forEach((video) => {
    video.addEventListener("mouseenter", handleHover);
    video.addEventListener("mouseleave", stopPlaying);
  });
};

if (videoBlock) {
  init();
}
