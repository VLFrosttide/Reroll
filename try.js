"use strict";

document.addEventListener("mousedown", (e) => {
  console.log("it works");
  if (e.button === 2) {
    e.preventDefault();
    const cursorDiv = document.createElement("div");
    cursorDiv.id = "MyDiv";
    cursorDiv.style.left = `${e.pageX}px`;
    cursorDiv.style.top = `${e.pageY}px`;
    document.body.appendChild(cursorDiv);
  }
});
