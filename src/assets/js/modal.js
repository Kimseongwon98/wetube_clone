const openModal = document.getElementById("openModal");
const modal = document.getElementById("modal");
const exitBtn = document.getElementById("jsExitBtn");
const body = document.querySelector("body");

const openModalWindow = () => {
  console.log("1");
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

init();
