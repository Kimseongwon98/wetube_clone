const formContainer = document.querySelector(".form-container");
const thumbnailInput = document.getElementById("thumbnail");
const img = document.getElementById("jsThumbnail");

function handleInput(event) {
  console.log(event);
  const reader = new FileReader();
  reader.onload = (e) => {
    img.setAttribute("src", e.target.result);
  };
  reader.readAsDataURL(event.target.files[0]);
}

function init() {
  thumbnailInput.onchange = handleInput;
}

if (thumbnailInput) {
  init();
}
