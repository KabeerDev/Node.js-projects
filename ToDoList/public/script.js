let close_btn = document.querySelector(".close");
let toast = document.querySelector(".toast");

close_btn.addEventListener("click", () => {
  toast.style.display = "none";
});
