const openModal = document.getElementById("openModal");
const UploadModal = document.getElementById("modal");
const loginModal = document.getElementById("unloggedModal");
const exitBtnUpload = document.getElementById("jsExitBtn");
const exitBtnLogin = document.getElementById("jsExitBtnUnlogged");
const body = document.querySelector("body");
const likeBtn = document.getElementById("jsLikeContainerUnlogged");
const comment = document.getElementById("jsAddComment");

let modal;
let exitBtn;

const openModalWindow = () => {
  modal.classList.remove("hidden");
  body.classList.add("scrollDisable");
};

const exitModal = () => {
  modal.classList.add("hidden");
  body.classList.remove("scrollDisable");
};

const init = () => {
  openModal.addEventListener("click", openModalWindow);
  exitBtn.addEventListener("click", exitModal);
};

const unloggedInit = () => {
  likeBtn.addEventListener("click", openModalWindow);
  exitBtn.addEventListener("click", exitModal);
  comment.addEventListener("submit", (event) => {
    event.preventDefault();
    openModalWindow();
  });
};

if (openModal) {
  modal = UploadModal;
  exitBtn = exitBtnUpload;
  init();
}

if (likeBtn) {
  modal = loginModal;
  exitBtn = exitBtnLogin;
  unloggedInit();
}
