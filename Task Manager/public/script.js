let edit_btns = document.querySelectorAll(".edit");
let title = document.querySelector("#e_title");
let desc = document.querySelector("#e_desc");
let t_id = document.querySelector("#t_id");

edit_btns.forEach((edit_btn) => {
  edit_btn.addEventListener("click", (e) => {
    let tr = e.target.closest("tr");
    let tt = tr.querySelector(".tt").innerText;
    let td = tr.querySelector(".td").innerText;
    title.value = tt;
    desc.value = td;
    t_id.value = e.currentTarget.id;
  });
});
