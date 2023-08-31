"use strict";

const Done = document.getElementById("Auto");
console.log(Done);
Done.addEventListener("click", () => {
  document.location.href =
    "C:/Users/shacx/Documents/GitHub/Reroll/renderer/Index.html";
});

window.api.MousePos((e, value) => {
  console.log(value);
});
