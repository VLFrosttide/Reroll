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
const ChaosOrbLabel = document.getElementById("ChaosOrbLabel");
const Alt = document.getElementById("OrbofAlteration");
const AltLabel = document.getElementById("OrbofAlterationLabel");
const EssenceContainer = document.getElementById("EssenceContainer");
const EssenceImage = document.getElementById("EssenceImage");
const EssenceClassList = document.getElementsByClassName("Essence");
const EssenceInput = document.getElementById("EssenceInput");
const DeafeningEssencesLeft = document.querySelectorAll(".Deafening.Left");
const ScreamingEssencesLeft = document.querySelectorAll(".Screaming.Left");
const ShriekingEssenceLeft = document.querySelectorAll(".Shrieking.Left");
const EssenceTabLocationLabel = document.getElementById(
  "EssenceTabItemSpotLabel"
);
const EssenceTabEssenceCoords = document.getElementById("EssenceTabItemSpot");
const CurrencyTabEssenceCoords = document.getElementById("CurrencyTabItemSpot");
const CurrencyTabLocationLabel = document.getElementById(
  "CurrencyTabItemSpotLabel"
);
const CurrencyTabDiv = document.getElementById("CurrencyTabDiv");
const EssenceTabDiv = document.getElementById("EssenceTabDiv");
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
const ElementsToRemove = [];
const EssenceCoords = {};
const CurrencyCoords = {};
const XYLabelList = document.getElementsByClassName("XYLabel");
let CoordsLabelDivList = document.getElementsByClassName("CoordsLabel");
let ChaosOrbCoords;
let OrbofAlterationCoords;
let EssenceTabCoords;
let CurrencyTabCoords;
let TabCoords;
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
let ChangingLabel; // The X / Y label for each essence.
let ScreenRatio;

window.api.ScreenRatio("ScreenRatio");
window.api.ScreenRatioValue((value) => {
  ScreenRatio = value;
});
//#endregion
for (const Essence of EssenceClassList) {
  EssenceNameArray.push(Essence.id);
  Essence.style.opacity = 0.3;
}

if (localStorage.length < 1) {
  for (let i = 0; i < CoordsLabelDivList.length; i++) {
    CoordsLabelDivList[i].id = `${EssenceClassList[i].id}Div`;
    let CoordsLabel = document.createElement("label");
    CoordsLabel.textContent = "X: , Y: ";
    CoordsLabel.id = `${EssenceClassList[i].id}Label`;
    CoordsLabel.style.display = "flex";
    CoordsLabel.style.opacity = 0.1;
    CoordsLabel.style.color = "aliceblue";
    CoordsLabel.classList.add("XYLabel");
    CoordsLabel.style.margin = "5px";
    CoordsLabelDivList[i].appendChild(CoordsLabel);
  }

  InputDiv.style.display = "none";
  EssenceInput.style.display = "none";

  Container.style.display = "none";
  //#region Mouse Position
  window.api.MousePos((event, data) => {
    console.log(ScreenRatio);
    console.log(data);
    let CoordsSplit = data.split(",");
    MouseCoordsX = parseInt(CoordsSplit[0]);
    MouseCoordsY = parseInt(CoordsSplit[1]);

    if (ChangingLabel == undefined) {
      alert("No currency selected.");
    }
    if (
      ChangingLabel !== undefined &&
      ChangingLabel.classList.contains("Modify")
    ) {
      ChangingLabel.innerText = `X: ${MouseCoordsX}, Y: ${MouseCoordsY}`;
      ChangingLabel.style.opacity = 1;
      let RemoveTutorialString = ChangingLabel.id.replace("Label", "");
      let EssenceTier;
      if (
        RemoveTutorialString.includes("Deaf") ||
        RemoveTutorialString.includes("Scream") ||
        RemoveTutorialString.includes("Shriek")
      ) {
        if (RemoveTutorialString.includes("Deaf")) {
          EssenceTier = "Deafening";
        } else if (RemoveTutorialString.includes("Shrieking")) {
          EssenceTier = "Shrieking";
        } else if (RemoveTutorialString.includes("Screaming")) {
          EssenceTier = "Screaming";
        }

        EssenceCoords[`${RemoveTutorialString}`] = {
          //////////////////////////////////////////////////
          Name: `${RemoveTutorialString}`,
          Coords: [
            parseInt(MouseCoordsX * ScreenRatio),
            parseInt(MouseCoordsY * ScreenRatio),
          ],
          Tier: EssenceTier,
        };
      } else if (
        !RemoveTutorialString.includes("Spot") &&
        !RemoveTutorialString.includes("Essence")
      ) {
        console.log(RemoveTutorialString);
        if (RemoveTutorialString.includes("Chaos")) {
          ChaosOrbCoords = [
            parseInt(MouseCoordsX * ScreenRatio),
            parseInt(MouseCoordsY * ScreenRatio),
          ];
        } else {
          OrbofAlterationCoords = [
            parseInt(MouseCoordsX * ScreenRatio),
            parseInt(MouseCoordsY * ScreenRatio),
          ];
        }
        console.log(OrbofAlterationCoords, ChaosOrbCoords);
      } else if (
        !RemoveTutorialString.includes("Deafen") &&
        !RemoveTutorialString.includes("Shriek") &&
        !RemoveTutorialString.includes("Scream") &&
        !RemoveTutorialString.includes("Orb") &&
        !RemoveTutorialString.includes("Currency")
      ) {
        console.log(MouseCoordsX);
        console.log(ScreenRatio);
        console.log(typeof MouseCoordsX);
        console.log(typeof ScreenRatio);
        console.log(MouseCoordsX * ScreenRatio);
        EssenceTabCoords = [
          parseInt(MouseCoordsX * ScreenRatio),
          parseInt(MouseCoordsY * ScreenRatio),
        ];
      } else if (
        RemoveTutorialString.includes("Spot") &&
        RemoveTutorialString.includes("Currency")
      ) {
        CurrencyTabCoords = [
          parseInt(MouseCoordsX * ScreenRatio),
          parseInt(MouseCoordsY * ScreenRatio),
        ];
      }

      let RemoveTutorial = document.getElementById(`${RemoveTutorialString}`);
      RemoveTutorial.classList.remove("Tutorial");
    }
  });
  //#endregion
} else {
  ChaosOrbLabel.remove();
  AltLabel.remove();
  EssenceTabDiv.remove();
  CurrencyTabDiv.remove();
  InstructionsDiv2.style.display = "none";
  InstructionsDiv1.textContent =
    " Type in the mod youre looking for and press enter then select the maximum number rerolls (you can use the scroll wheel) and click start  crafting. If input fields are not responsive , just alt tab quickly";
  for (let i = 0; i < CoordsLabelDivList.length; i++) {
    CoordsLabelDivList[i].id = `${EssenceClassList[i].id}Div`;
  }
  StoreCoordsButton.remove();
  let RenderEssences = JSON.parse(localStorage.getItem("EssenceCoords"));
  let RemoveEssenceFromRender = [];
  StartButton.style.display = "flex";
  for (const Item of CoordsLabelDivList) {
    let Re = Item.id.toString();
    Re = Re.replace("Div", "");
    for (const Essence in RenderEssences) {
      if (Essence.includes(Re)) {
        Item.classList.add("Chosen");
      } else if (!Item.classList.contains("Chosen")) {
        RemoveEssenceFromRender.push(Item);
      }
    }
  }
  for (const Item of RemoveEssenceFromRender) {
    if (!Item.classList.contains("Chosen")) {
      Item.remove();
    }
  }
}
EssenceInput.style.display = "none";
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
//#region Start Button Eventlistener
let LengthCheck = document.getElementsByClassName("Hover");
let Coords;
StartButton.addEventListener("click", function () {
  if (localStorage.length < 1) {
    alert("Select coords first");
  } else {
    InfoArray.length = 0;
    for (let i = 0; i < ModClass.length; i++) {
      InfoArray.push(ModClass[i].textContent);
    }
    InfoArray.push(MaxRerolls.value);
    if (CraftMaterial.includes("Essence")) {
      TabCoords = localStorage.getItem("EssenceTabCoords");
      Coords = JSON.parse(localStorage.getItem("EssenceCoords"));
      console.log("awdawdawdadaw");
      for (const Item of Object.keys(Coords)) {
        console.log(Item);
        if (Coords[Item].Name.includes(CraftMaterial)) {
          Coords = Coords[Item].Coords;
          Coords = JSON.stringify(Coords);
          Coords = Coords.replace("[", "").replace("]", "");
          break;
        }
      }
    } else {
      TabCoords = localStorage.getItem("CurrencyTabCoords");
      TabCoords = TabCoords.replace("[", "").replace("]", "");
      Coords = localStorage.getItem(`${CraftMaterial}Coords`);
      Coords = Coords.replace("[", "").replace("]", "");
    }
    console.log(TabCoords);
    InfoArray.push(Coords);
    InfoArray.push(TabCoords);
    // console.log(InfoArray.length, InfoArray);
    window.api.StartCrafting(InfoArray);
  }
});
//#endregion

//#region MaxRerolls Step event listeners
MaxRerolls.addEventListener("wheel", function (e) {
  if (e.deltaY > 0) {
    MaxRerolls.stepDown();
  } else {
    MaxRerolls.stepUp();
  }
});
//#endregion

//#region Neutral
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
//#region Click Event Highlight

EssenceContainer.addEventListener("click", function (e) {
  if (e.target.classList.contains("Essence")) {
    ChangingLabel = document.getElementById(`${e.target.id}` + "Label");
    // Returns true or false
    let HoverHighlight = e.target.classList.contains("Hover", "Highlight");
    document
      .getElementById(`${e.target.id}`)
      .classList.add("Hover", "Highlight");
    for (const Item of EssenceClassList) {
      Item.style.opacity = 0.3;
      if (ChangingLabel) {
        ChangingLabel.classList.remove("Modify");
      }
      Item.classList.remove("Hover", "Highlight");
    }
    for (const Item of XYLabelList) {
      Item.style.opacity = 0.1;
    }
    if (!HoverHighlight) {
      if (ChangingLabel) {
        ChangingLabel.classList.add("Modify");
        ChangingLabel.style.opacity = 1;
      }

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
    e.target.style.opacity = 1;
    let HoverTooltip = document.createElement("div");
    let Spaces = `${e.target.id}`.replace(/([A-Z])/g, " $1").trim(); // Breaks down the essence ID and capitalizes every letter and adds space between words.
    HoverTooltip.textContent = `${Spaces}`; // Used for the Label that displays name when an essence is hovered.
    HoverTooltip.style.position = "static";
    Insertion.appendChild(HoverTooltip);
    HoverTooltip.classList.add("HoverTooltip");
    // }, 50);
  }
});
EssenceContainer.addEventListener("mouseout", function (e) {
  if (e.target.classList.contains("Essence")) {
    let Remove = document.getElementsByClassName("HoverTooltip");
    if (!e.target.classList.contains("Highlight")) {
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
//#region EssenceImage Click event
EssenceImage.addEventListener("click", function (e) {
  for (const Item of AllowLabelModification) {
    Item.classList.remove("Modify");
  }

  if (e.target == EssenceImage && !EssenceImage.classList.contains("Clicked")) {
    if (InputDiv.style.display == "flex") {
      EssenceInput.style.display = "flex";
    }
    if (localStorage.length < 1) {
      InstructionsDiv1.innerText = `Now repeat the same process for the highlighted essences. Once you're done , click on the button to store your coordinates and proceed`;
      InstructionsDiv2.style.display = "none";
    } else {
      InstructionsDiv1.textContent =
        " Type in the mod youre looking for and press enter then select the maximum number rerolls (you can use the scroll wheel) and click start  crafting. If input fields are not responsive , just alt tab quickly ";
      InstructionsDiv2.style.display = "none";
    }
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
    if (localStorage.length < 1) {
      InstructionsDiv2.style.display = "flex";
      InstructionsDiv1.innerText = `Select a currency item (Left click), then 
      while the program is focused (Click on the program and do not click anywhere else)
      move your mouse cursor over the center of the matching item in game (without clicking),
      then press F1 to record its coordinates`;
    } else {
      InstructionsDiv1.textContent =
        " Type in the mod youre looking for and press enter then select the maximum number rerolls (you can use the scroll wheel) and click start  crafting. If input fields are not responsive , just alt tab quickly ";
      InstructionsDiv2.style.display = "none";
    }

    for (const Item of EssenceClassList) {
      Item.style.opacity = 0.3;
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
      if (ChangingLabel !== null) {
        ChangingLabel.classList.add("Modify");
      }
    }
  });
}
//#endregion
//#region Store Coords button

StoreCoordsButton.addEventListener("click", function () {
  if (EssenceTabCoords.length < 1 || CurrencyTabCoords.length < 1) {
    console.log(EssenceTabCoords, CurrencyCoords, CurrencyTabCoords);
    alert("Please select at least one item's coords");
  } else {
    localStorage.setItem(
      "CurrencyTabCoords",
      JSON.stringify(CurrencyTabCoords)
    );
    localStorage.setItem("ChaosOrbCoords", ChaosOrbCoords);
    localStorage.setItem(
      "OrbofAlterationCoords",
      JSON.stringify(OrbofAlterationCoords)
    );
    console.log(EssenceTabCoords);
    console.log(JSON.stringify(EssenceTabCoords));
    localStorage.setItem("EssenceTabCoords", EssenceTabCoords);

    ChaosOrbLabel.remove();
    AltLabel.remove();
    console.log(CurrencyTabLocationLabel.textContent);
    if (CurrencyTabLocationLabel.textContent === "X:, Y:") {
      alert(
        "Please select the location of the item that will be rolled with alts and chaos ."
      );
    } else {
      EssenceTabLocationLabel.remove();
      if (EssenceTabLocationLabel.textContent === "X:, Y:") {
        console.log(EssenceTabLocationLabel.text);
        alert(
          "Please select the location of the item that will be rolled with essences ."
        );
      } else {
        CurrencyTabLocationLabel.remove();
        InputDiv.style.display = "flex";
        StartButton.style.display = "flex";
        StoreCoordsButton.style.display = "none";
        localStorage.setItem("EssenceCoords", JSON.stringify(EssenceCoords));
        for (const Essence of CoordsLabelDivList) {
          let Replace = Essence.id.replace("Div", "");
          for (const Item in EssenceCoords) {
            if (EssenceCoords[Item].Name.includes(Replace)) {
              document.getElementById(`${Replace}Label`).style.display = "none";
            } else {
              if (!Essence.classList.contains("Selected")) {
                ElementsToRemove.push(Essence);
              }
            }
          }
        }
        alert("Items have been stored!");
        for (const Item of ElementsToRemove) {
          Item.remove();
        }
        window.location.reload();
      }
    }
  }
});
//#endregion
//#region Clear Local Storage
window.api.ClearLocalStorage((event, data) => {
  localStorage.clear();
});
//#endregion
