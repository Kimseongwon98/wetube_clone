const likeBtn = document.getElementById("jsLike");
const unlikeBtn = document.getElementById("jsUnlike");
const unlogged = document.getElementById("jsLikeContainerUnlogged");
const btnContainer = document.getElementById("jsLikeContainer");
const count = document.getElementById("jsLikeCount");

const changeLikeBtn = () => {
  btnContainer.innerHTML = '<i class="fas fa-thumbs-up"></i>';
  count.innerHTML = parseInt(count.innerHTML, 10) + 1;
  btnContainer.removeEventListener("click", likeVideo);
  btnContainer.addEventListener("click", cancelLike);
};

const changeUnlikeBtn = () => {
  btnContainer.innerHTML = '<i class="far fa-thumbs-up"></i>';
  count.innerHTML = parseInt(count.innerHTML, 10) - 1;
  btnContainer.removeEventListener("click", cancelLike);
  btnContainer.addEventListener("click", likeVideo);
};

const likeVideo = () => {
  const userId = window.location.href.split("/videos/")[1];
  fetch(`/api/${userId}/like`, {
    method: "POST",
  });
  changeLikeBtn();
};

const cancelLike = () => {
  const userId = window.location.href.split("/videos/")[1];
  fetch(`/api/${userId}/cancellike`, {
    method: "POST",
  });
  changeUnlikeBtn();
};

const init = () => {
  if (likeBtn) {
    btnContainer.addEventListener("click", likeVideo);
  } else if (unlikeBtn) {
    btnContainer.addEventListener("click", cancelLike);
  }
};

if (btnContainer) {
  init();
}
