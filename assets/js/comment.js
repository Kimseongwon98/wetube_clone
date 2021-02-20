import axios from "axios";

const addCommentForm = document.getElementById("jsAddComment");
const commentList = document.getElementById("jsCommentList");
const commentNumber = document.getElementById("jsCommentNumber");
const myAvatar = document.getElementById("jsMyAvatar");
const myName = document.getElementById("jsUserName");
const delBtn = document.querySelectorAll("#jsCommentDelBtn");

const increaseNumber = () => {
  commentNumber.innerHTML = parseInt(commentNumber.innerHTML, 10) + 1;
};

const addComment = (comment) => {
  const li = document.createElement("li");
  const span = document.createElement("span");
  const avatar = document.createElement("img");
  const name = document.createElement("strong");
  const a = document.createElement("a");
  const div = document.createElement("div");
  span.innerHTML = comment;
  avatar.src = myAvatar.src;
  name.innerHTML = myName.innerHTML;
  a.appendChild(avatar);
  div.appendChild(name);
  a.appendChild(div);
  li.appendChild(a);
  li.appendChild(span);
  commentList.prepend(li);
  increaseNumber();
};

const sendComment = async (comment) => {
  const videoId = window.location.href.split("/videos/")[1];
  const response = await axios({
    url: `/api/${videoId}/comment`,
    method: "POST",
    data: {
      comment,
    },
  });
  if (response.status === 200) {
    addComment(comment);
  }
};

const handleSubmit = (event) => {
  event.preventDefault();
  const commentInput = addCommentForm.querySelector("input");
  const comment = commentInput.value;
  commentInput.value = "";
  sendComment(comment);
};

const removeComment = (id, li) => {
  li.remove();
  commentNumber.innerHTML = parseInt(commentNumber.innerHTML, 10) - 1;
};

const delComment = async (id, li) => {
  const videoId = window.location.href.split("/videos/")[1];
  const response = await axios({
    url: `/api/${id}/delcomment`,
    method: "POST",
    data: {
      videoId,
    },
  });
  if (response.status === 200) {
    removeComment(id, li);
  }
};

const getCommentId = (event) => {
  const id = event.target.parentNode.parentNode.firstChild.innerHTML;
  delComment(id, event.target.parentNode.parentNode);
};

const init = () => {
  addCommentForm.addEventListener("submit", handleSubmit);
  if (delBtn) {
    delBtn.forEach((btn) => {
      btn.addEventListener("click", getCommentId);
    });
  }
};

if (addCommentForm) {
  init();
}
