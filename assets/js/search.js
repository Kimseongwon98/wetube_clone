const searchBar = document.getElementById("jsSearch");
const option = searchBar.querySelector("select");
const input = searchBar.querySelector("input");

const getOption = (event) => {
  input.name = event.target.value;
};

const init = () => {
  option.addEventListener("change", getOption);
};

init();
