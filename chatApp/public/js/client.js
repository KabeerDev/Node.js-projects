const socket = io();

const send_btn = document.querySelector("#submit");
const msg = document.querySelector("#messageInp");
const wrap = document.querySelector(".wrap");

socket.on("message", (message) => {
  let r_div = document.createElement("div");
  r_div.classList.add("right");
  r_div.classList.add("message");
  r_div.innerText = message;
  wrap.append(r_div);
});
send_btn.addEventListener("click", (e) => {
  if (msg.value != "") {
    let message = msg.value;
    socket.emit("user-message", message);
    msg.value = "";
  } else {
    msg.value = "Message cannot be empty!";
  }
});
