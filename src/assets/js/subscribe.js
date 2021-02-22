const subcribeBtn = document.getElementById("jsSubscribe");
const unsubscribeBtn = document.getElementById("jsUnsubscribe");
const btnContainer = document.getElementById("subscribeContainer");

let btn;

const subscribeUser = () => {
  if (window.location.href.includes("users")) {
    const userId = window.location.href.split("/users/")[1];
    fetch(`/api/${userId}/subscribe`, {
      method: "POST",
    });
  } else {
    const idContainer = document.getElementById("jsCreaterId");
    const userId = idContainer.href.split("/users/")[1];
    fetch(`/api/${userId}/subscribe`, {
      method: "POST",
    });
  }
  changeSubBtn();
};

const unsubscribeUser = () => {
  if (window.location.href.includes("users")) {
    const userId = window.location.href.split("/users/")[1];
    fetch(`/api/${userId}/unsubscribe`, {
      method: "POST",
    });
  } else {
    const idContainer = document.getElementById("jsCreaterId");
    const userId = idContainer.href.split("/users/")[1];
    fetch(`/api/${userId}/unsubscribe`, {
      method: "POST",
    });
  }
  changeUnsubBtn();
};

const changeSubBtn = () => {
  btn.innerHTML = "Unsubcribe";
  btn.style = "background-color:red;";
  btn.removeEventListener("click", subscribeUser);
  btn.addEventListener("click", unsubscribeUser);
};

const changeUnsubBtn = () => {
  btn.innerHTML = "Subcribe";
  btn.style = "background-color:#3498db;";
  btn.removeEventListener("click", unsubscribeUser);
  btn.addEventListener("click", subscribeUser);
};

const init = () => {
  if (subcribeBtn) {
    btn = subcribeBtn;
    btn.addEventListener("click", subscribeUser);
  }
  if (unsubscribeBtn) {
    btn = unsubscribeBtn;
    btn.addEventListener("click", unsubscribeUser);
  }
};

if (btnContainer) {
  init();
}
