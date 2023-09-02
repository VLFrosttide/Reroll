"use strict";
//#region Declarations
const ModNameInput = document.getElementById("ModInput");
const Container = document.getElementById("Container");
const ModClass = document.getElementsByClassName("ModName");
const Currencies = document.getElementsByClassName("Currency");
const CurrencyDiv = document.getElementById("CurrencyDiv");
const StartButton = document.getElementById("Start");
const ImageContainer = document.getElementById("ImageContainer");
const Chaos = document.getElementById("ChaosOrb");
const Alt = document.getElementById("OrbofAlteration");
const EssenceContainer = document.getElementById("EssenceContainer");
const EssenceImage = document.getElementById("EssenceImage");
const EssenceClassList = document.getElementsByClassName("Essence");
const EssenceInput = document.getElementById("EssenceInput");
const DeafeningEssencesLeft = document.querySelectorAll(".Deafening.Left");
const ScreamingEssencesLeft = document.querySelectorAll(".Screaming.Left");
const ShriekingEssenceLeft = document.querySelectorAll(".Shrieking.Left");
const EssenceNameArray = [];
const Insertion = document.getElementById("Insertion");
const MaxRerolls = document.getElementById("MaxRerolls");
const InputDiv = document.getElementById("InputDiv");
const Instructions = document.getElementsByClassName("Instructions");
const InstructionsDiv1 = document.getElementById("Instructions");
const InstructionsDiv2 = document.getElementById("Instructions2");
const InstructionsCheckBox = document.getElementById("InstructionsCheckBox");
const AllowLabelModification = document.getElementsByClassName("Modify");
const Greed1 = document.getElementById("DeafeningEssenceOfGreed");
const Greed2 = document.getElementById("ShriekingEssenceOfGreed");
const Contempt = document.getElementById("DeafeningEssenceOfContempt");
const Loathing = document.getElementById("DeafeningEssenceOfLoathing");
const StoreCoordsButton = document.getElementById("StoreCoordsButton");
const TutorialEssence = document.getElementsByClassName("Tutorial");
const TestCoords = document.getElementById("TestCoords");
const ItemCoords = {};
const DeafeningCoordsLeftObj = {};
const ShriekingEssenceLeftObj = {};
const ScreamingEssencesLeftObj = {};
let TutorialCheck;
let XDifferential;
let YDifferential;
let HoveredItem;
let ModNumber = 0;
let CraftMaterial;
let InfoArray = []; //Array to send data to backend
let Timer;
let MouseCoordsX;
let MouseCoordsY;
let ChangingLabel;
//#endregion
for (const Essence of EssenceClassList) {
  EssenceNameArray.push(Essence.id);
  Essence.style.opacity = 0.3;
}
Container.style.display = "none";
//#region Instructions Eventlistener
InstructionsCheckBox.addEventListener("change", function () {
  for (const Item of Instructions) {
    if (InstructionsCheckBox.checked) {
      Item.style.display = "none";
    } else {
      Item.style.display = "flex";
    }
  }
});
//#endregion

//#region Mouse Position
window.api.MousePos((event, data) => {
  let CoordsSplit = data.split(",");
  MouseCoordsX = CoordsSplit[0];
  MouseCoordsY = CoordsSplit[1];

  if (ChangingLabel == undefined) {
    alert("No currency selected.");
  }
  if (
    ChangingLabel !== undefined &&
    ChangingLabel.classList.contains("Modify")
  ) {
    ChangingLabel.innerText = `X: ${MouseCoordsX}, Y: ${MouseCoordsY}`;
    let RemoveTutorialString = ChangingLabel.id.replace("Label", "");
    // console.log(RemoveTutorialString);
    ItemCoords[`${RemoveTutorialString}`] = {
      Name: `${RemoveTutorialString}`,
      Coords: [MouseCoordsX, MouseCoordsY],
    };
    console.log("This what u looking for?", ItemCoords);
    let RemovedEssence = document.getElementById(`${RemoveTutorialString}`);

    RemovedEssence.classList.remove("Tutorial");
  }
  if (Object.keys(ItemCoords).length >= 6) {
    let InitialLeftX = parseInt(ItemCoords.DeafeningEssenceOfGreed.Coords[0]);
    let InitialLeftY = parseInt(ItemCoords.DeafeningEssenceOfGreed.Coords[1]);
    XDifferential =
      parseInt(ItemCoords.ShriekingEssenceOfGreed.Coords[0]) -
      parseInt(InitialLeftX);
    YDifferential =
      parseInt(ItemCoords.DeafeningEssenceOfContempt.Coords[1]) -
      parseInt(InitialLeftY);
    for (const Item of DeafeningEssencesLeft) {
      DeafeningCoordsLeftObj[`${Item.id}`] = {
        Name: Item.id,
        Coords: [InitialLeftX, InitialLeftY],
        Side: "left",
      };
      InitialLeftY = InitialLeftY + YDifferential;
    }
    for (const Item of ShriekingEssenceLeft) {
      ShriekingEssenceLeftObj[`${Item.id}`] = {
        Name: Item.id,
        Coords: [InitialLeftX - XDifferential, InitialLeftY],
        Side: "left",
      };
      InitialLeftY = InitialLeftY - YDifferential;
    }
  }
});
//#endregion
InputDiv.style.display = "none";
EssenceInput.style.display = "none";

//#region Tutorial Essence Opacity

Greed1.style.opacity = 1;
Greed2.style.opacity = 1;
Contempt.style.opacity = 1;
Loathing.style.opacity = 1;

//#endregion

//#region Click Event Highlight

EssenceContainer.addEventListener("click", function (e) {
  if (e.target.classList.contains("Essence")) {
    TutorialCheck = e.target.classList.contains("Tutorial");

    ChangingLabel = document.getElementById(`${e.target.id}` + "Label");
    // Returns true or false
    let HoverHighlight = e.target.classList.contains("Hover", "Highlight");

    document
      .getElementById(`${e.target.id}`)
      .classList.add("Hover", "Highlight");
    for (const Item of EssenceClassList) {
      if (!Item.classList.contains("Tutorial")) {
        Item.style.opacity = 0.3;
      }
      ChangingLabel.classList.remove("Modify");
      Item.classList.remove("Hover", "Highlight");
    }
    if (!HoverHighlight) {
      ChangingLabel.classList.add("Modify");
      e.target.style.opacity = 1;
      e.target.classList.add("Hover", "Highlight");
      CraftMaterial = e.target.id;
    }
  }
});
//#endregion
//#region Hover Event listeners
EssenceContainer.addEventListener("mouseover", function (e) {
  TutorialCheck = e.target.classList.contains("Tutorial");

  if (e.target.classList.contains("Essence")) {
    e.target.style.opacity = 1;
    let HoverTooltip = document.createElement("div");
    let Spaces = `${e.target.id}`.replace(/([A-Z])/g, " $1").trim();
    HoverTooltip.textContent = `${Spaces}`;
    HoverTooltip.style.position = "static";
    Insertion.appendChild(HoverTooltip);
    HoverTooltip.classList.add("HoverTooltip");
    // }, 50);
  }
});
EssenceContainer.addEventListener("mouseout", function (e) {
  TutorialCheck = e.target.classList.contains("Tutorial");
  if (e.target.classList.contains("Essence")) {
    let Remove = document.getElementsByClassName("HoverTooltip");
    if (!e.target.classList.contains("Highlight") && !TutorialCheck) {
      e.target.style.opacity = 0.3;
    }
    // if (e.target.classList.contains("Hover"))
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
    } else if (
      !document.getElementById(`${Name}`).classList.contains("Hover")
    ) {
      document.getElementById(`${Name}`).classList.remove("Highlight");
      document.getElementById(`${Name}`).style.opacity = 0.3;
    }
  }
});
//#endregion
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
//#region EssenceImage Click event
EssenceImage.addEventListener("click", function (e) {
  for (const Item of AllowLabelModification) {
    Item.classList.remove("Modify");
  }

  if (e.target == EssenceImage && !EssenceImage.classList.contains("Clicked")) {
    InstructionsDiv1.innerText = `Now repeat the same process for the highlighted essences. Once you're done , click on the button to store your coordinates and proceed`;
    InstructionsDiv2.style.display = "none";
    StoreCoordsButton.style.display = "flex";
    EssenceImage.classList.add("Clicked");
    for (let j = 0; j < Currencies.length; j++) {
      Currencies[j].classList.remove("Hover");
    }
    CurrencyDiv.style.display = "none";
    window.api.ResizeWindow("awd");
    EssenceInput.style.display = "flex";
    EssenceContainer.style.display = "flex";
    ImageContainer.style.flexDirection = "column";
    EssenceImage.src =
      "C:/Users/shacx/Documents/GitHub/Reroll/renderer/EssencePics/Arrow.png";
  } else {
    InstructionsDiv2.style.display = "flex";
    InstructionsDiv1.innerText = `Select a currency item (Left click), then 
    while the program is focused (Click on the program and do not click anywhere else)
    move your mouse cursor over the center of the matching item in game (without clicking),
    then press F1 to record its coordinates`;

    for (const Item of EssenceClassList) {
      Item.classList.remove("Hover", "Highlight");
      CraftMaterial = "";
    }
    CurrencyDiv.style.display = "flex";
    EssenceImage.classList.remove("Clicked");
    window.api.ResizeWindow("abruvwd");
    EssenceInput.style.display = "none";
    EssenceContainer.style.display = "none";
    ImageContainer.style.flexDirection = "row";
    EssenceImage.src =
      "C:/Users/shacx/Documents/GitHub/Reroll/renderer/Torment.png";
  }
});
//#endregion

//#region Add Mods
const AddModElement = function () {
  let NewMod = document.createElement("label");
  NewMod.textContent = ModNameInput.value;
  NewMod.setAttribute("id", "ModString" + ModNumber);
  ModNumber += 1;
  NewMod.classList.add("ModName");
  Container.appendChild(NewMod);
  ModNameInput.value = "";
  NewMod.addEventListener("click", (e) => {
    Container.removeChild(e.target);
  });
};
ModNameInput.addEventListener("keydown", (e) => {
  if (e.key == "Enter") {
    AddModElement();
  }
});
//#endregion

//#region Currencies eventlistener
for (let i = 0; i < Currencies.length; i++) {
  Currencies[i].addEventListener("click", (e) => {
    let wasHovered = e.target.classList.contains("Hover");
    ChangingLabel = document.getElementById(`${e.target.id}` + "Label");

    // Remove the "Hover" class from all elements
    for (const Item of AllowLabelModification) {
      Item.classList.remove("Modify");
    }
    for (let j = 0; j < Currencies.length; j++) {
      Currencies[j].classList.remove("Hover");
    }

    // If the clicked element was not already hovered, add the "Hover" class
    if (!wasHovered) {
      e.target.classList.add("Hover");
      CraftMaterial = e.target.id;
      ChangingLabel.classList.add("Modify");
    }
  });
}
//#endregion
//#region Start Button Eventlistener
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
//#endregion
//#region Store Coords button

StoreCoordsButton.addEventListener("click", function () {
  if (Object.keys(ItemCoords).length < 6) {
    alert("Select the coords of all currencies.");
  } else {
    // for (const Item in ItemCoords) {
    //   console.log(ItemCoords[Item]);
    //   localStorage.setItem(`${ItemCoords[Item].Name}`, ItemCoords[Item].Coords);
    // }
    console.log(ItemCoords);
    alert("Items have been stored!");
  }
});
//#endregion
//#region Test coords button
TestCoords.addEventListener("click", function () {
  // console.log(ShriekingEssenceLeftObj);
  window.api.SendTestCoords(
    JSON.stringify(DeafeningCoordsLeftObj, ShriekingEssenceLeftObj)
  );
  // for (const Item in ItemCoords) {
  // console.log(ItemCoords[Item].Coords);
  // }
});
//#endregion
