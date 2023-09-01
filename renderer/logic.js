"use strict";
//#region Declarations
const ModNameInput = document.getElementById("ModInput");
const RerollCurrency = document.getElementById("RerollCurrency");
const Container = document.getElementById("Container");
const ModClass = document.getElementsByClassName("ModName");
const Currencies = document.getElementsByClassName("Currency");
const StartButton = document.getElementById("Start");
const EssenceContainer = document.getElementById("EssenceContainer");
const ImageContainer = document.getElementById("ImageContainer");
const EssenceImage = document.getElementById("EssenceImage");
const Chaos = document.getElementById("ChaosOrb");
const Alt = document.getElementById("OrbofAlteration");
const EssenceClassList = document.getElementsByClassName("Essence");
const EssenceInput = document.getElementById("EssenceInput");
const EssenceNameArray = [];
const Insertion = document.getElementById("Insertion");
const MaxRerolls = document.getElementById("MaxRerolls");
let ModNumber = 0;
let CraftMaterial;
let InfoArray = []; //Array to send data to backend
let DebounceTimer;
//#endregion
for (const Essence of EssenceClassList) {
  EssenceNameArray.push(Essence.id);
  Essence.style.opacity = 0.3;
}
EssenceInput.style.display = "none";

//#region Click Event Highlight

EssenceContainer.addEventListener("click", function (e) {
  if (e.target.classList.contains("Essence")) {
    // Returns true or false
    let HoverHighlight = e.target.classList.contains("Hover", "Highlight");

    document
      .getElementById(`${e.target.id}`)
      .classList.add("Hover", "Highlight");
    for (const Item of EssenceClassList) {
      Item.style.opacity = 0.3;
      Item.classList.remove("Hover", "Highlight");
    }
    if (!HoverHighlight) {
      e.target.style.opacity = 1;
      e.target.classList.add("Hover", "Highlight");
      CraftMaterial = e.target.id;
    }
  }
});
//#endregion
//#region Hover Event listeners
EssenceContainer.addEventListener("mouseover", function (e) {
  if (e.target.classList.contains("Essence")) {
    clearTimeout(DebounceTimer);

    DebounceTimer = setTimeout(() => {
      e.target.style.opacity = 1;
      let HoverTooltip = document.createElement("div");
      let Spaces = `${e.target.id}`.replace(/([A-Z])/g, " $1").trim();
      HoverTooltip.textContent = `${Spaces}`;
      HoverTooltip.style.position = "static";
      Insertion.appendChild(HoverTooltip);
      HoverTooltip.classList.add("HoverTooltip");
    }, 0);
  }
});
EssenceContainer.addEventListener("mouseout", function (e) {
  if (e.target.classList.contains("Essence")) {
    let Remove = document.getElementsByClassName("HoverTooltip");
    if (!e.target.classList.contains("Highlight")) {
      e.target.style.opacity = 0.3;
    }
    for (const Item of Remove) {
      Item.remove();
    }
  }
});
//#endregion

//#region Input highlight
EssenceInput.addEventListener("input", function () {
  for (const Name of EssenceNameArray) {
    let SpacedName = Name.replace(/([A-Z])/g, " $1").trim();
    if (
      SpacedName.toLowerCase().includes(EssenceInput.value.toLowerCase()) &&
      EssenceInput.value !== ""
    ) {
      document.getElementById(`${Name}`).style.opacity = 1;
      document.getElementById(`${Name}`).classList.add("Highlight");
    } else {
      document.getElementById(`${Name}`).classList.remove("Highlight");
      document.getElementById(`${Name}`).style.opacity = 0.3;
    }
  }
});
//#region Placeholder Eventlisteners
ModNameInput.addEventListener("focusin", function () {
  ModNameInput.placeholder = "";
});
ModNameInput.addEventListener("focusout", function () {
  ModNameInput.placeholder = "Mod youre looking for";
});

EssenceInput.addEventListener("focusin", function () {
  EssenceInput.placeholder = "";
});
EssenceInput.addEventListener("focusout", function () {
  EssenceInput.placeholder = "Essence Highlight";
});

//#endregion
EssenceImage.addEventListener("click", function (e) {
  if (e.target == EssenceImage && !EssenceImage.classList.contains("Clicked")) {
    EssenceImage.classList.add("Clicked");
    for (let j = 0; j < Currencies.length; j++) {
      Currencies[j].classList.remove("Hover");
    }
    window.api.ResizeWindow("awd");
    EssenceInput.style.display = "flex";
    EssenceContainer.style.display = "flex";
    Chaos.style.display = "none";
    Alt.style.display = "none";
    ImageContainer.style.flexDirection = "column";
    EssenceImage.src =
      "C:/Users/shacx/Documents/GitHub/Reroll/renderer/EssencePics/Arrow.png";
  } else {
    EssenceImage.classList.remove("Clicked");
    window.api.ResizeWindow("abruvwd");
    EssenceInput.style.display = "none";
    EssenceContainer.style.display = "none";
    Chaos.style.display = "flex";
    Alt.style.display = "flex";
    ImageContainer.style.flexDirection = "row";
    EssenceImage.src =
      "C:/Users/shacx/Documents/GitHub/Reroll/renderer/Torment.png";
  }
});

const AddModElement = function () {
  let NewMod = document.createElement("label");
  NewMod.textContent = ModNameInput.value;
  NewMod.setAttribute("id", "ModString" + ModNumber);
  ModNumber += 1;
  NewMod.classList.add("ModName");
  Container.appendChild(NewMod);
  console.log(ModClass);
  ModNameInput.value = "";
  NewMod.addEventListener("click", (e) => {
    console.log(e.target);
    Container.removeChild(e.target);
  });
};
ModNameInput.addEventListener("keydown", (e) => {
  if (e.key == "Enter") {
    AddModElement();
  }
});

for (let i = 0; i < Currencies.length; i++) {
  Currencies[i].addEventListener("click", (e) => {
    let wasHovered = e.target.classList.contains("Hover");

    // Remove the "Hover" class from all elements
    for (let j = 0; j < Currencies.length; j++) {
      Currencies[j].classList.remove("Hover");
    }

    // If the clicked element was not already hovered, add the "Hover" class
    if (!wasHovered) {
      e.target.classList.add("Hover");
      CraftMaterial = e.target.id;
    }
  });
}
let LengthCheck = document.getElementsByClassName("Hover");
StartButton.addEventListener("click", function () {
  // InfoArray.length = 0;
  // if (
  //   CraftMaterial === undefined ||
  //   ModClass.length < 1 ||
  //   LengthCheck.length < 1
  // ) {
  //   alert("Please select crafting method and mods");
  // } else {
  //   InfoArray.push(CraftMaterial);
  //   for (let i = 0; i < ModClass.length; i++) {
  //     InfoArray.push(ModClass[i].textContent);
  //   }
  //   InfoArray.push(MaxRerolls.value);
  //   console.log(InfoArray);
  //   window.api.SendModNames(InfoArray);
  // }
});
