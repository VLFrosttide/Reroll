"use strict";
//#region Declarations
const ModNameInput = document.getElementById("ModInput");
const ExcludeModInput = document.getElementById("ExcludeModInput");
const Container = document.getElementById("Container");
const ExclusionContainer = document.getElementById("ExclusionContainer");
const ModClass = document.getElementsByClassName("ModName");
const ExclusionModClass = document.getElementsByClassName("ExclusionMod");
const CurrencyDiv = document.getElementById("CurrencyDiv");
const StartButton = document.getElementById("StartButton");
const SavedCrafts = document.getElementById("SavedCrafts");
let DeleteSaveButton;
let Counter;

const SaveCraftButton = document.getElementById("SaveCraftButton");
const ImageContainer = document.getElementById("ImageContainer");
const SaveGallery = document.getElementById("Gallery");
const GalleryImageArray = document.getElementsByClassName("GalleryImage");
const Chaos = document.getElementById("ChaosOrb");
const ChaosOrbLabel = document.getElementById("ChaosOrbLabel");
const Alt = document.getElementById("OrbofAlteration");
const AltLabel = document.getElementById("OrbofAlterationLabel");
const ManualContainer = document.getElementById("ManualContainer");
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
const Insertion = document.getElementById("Insertion"); // Used for saving crafts
const MaxRerolls = document.getElementById("MaxRerolls");
const MinRoll = document.getElementById("MinRoll");
const InputDiv = document.getElementById("InputDiv");
const Instructions = document.getElementsByClassName("Instructions");
const InstructionsDiv1 = document.getElementById("Instructions");
const InstructionsDiv2 = document.getElementById("Instructions2");
const InstructionsCheckBox = document.getElementById("InstructionsCheckBox");
const FractureCheckBox = document.getElementById("FractureCheckBox");
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
let Currencies = document.getElementsByClassName("Currency");
let CoordsLabelDivList = document.getElementsByClassName("CoordsLabel");
let ManualCurrency = document.getElementsByClassName("Manual");
let AnnulOrbCoords;
let ScourOrbCoords;
let TransmuteOrbCoords;
let AugOrbCoords;
let RegalOrbCoords;
let ChaosOrbCoords;
let OrbofAlterationCoords;
let EssenceTabCoords;
let CurrencyTabCoords;
let TabCoords;
let TutorialCheck;
let XDifferential;
let YDifferential;
let HoveredItem;
// let ModNumber = 0;
let CraftMaterial;
let InfoArray = []; //Array to send data to backend
// Contains an array of mods and coords of item + item slot and currency item to use.
let Timer;
let MouseCoordsX;
let MouseCoordsY;
let ChangingLabel; // The X / Y label for each essence.
let ScreenRatio;
//#endregion
function GetLSSaves(Prefix) {
  let Items = {};
  for (let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i);
    if (key.startsWith(Prefix)) {
      let value = localStorage.getItem(key);
      Items[key] = value;
    }
  }
  return Items;
}
function ChangeLSSaves(Name, NewValue) {
  for (let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i);
    if (key.includes(Name)) {
      localStorage.setItem(key, NewValue);
      console.log("NewLSValue: ", localStorage.getItem(key));
    }
  }
}
function DeleteLSSaveItem(Name) {
  let KeysToRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i);
    if (key.includes(Name)) {
      KeysToRemove.push(key);
    }
  }
  for (let key of KeysToRemove) {
    localStorage.removeItem(key);
  }
}
//#region Hotkey Object
let Hotkeys = {
  RegalOrb: "Ctrl+Shift+Enter",
  AnnulOrb: "Shift+Backspace",
  ScourOrb: "Ctrl+Backspace",
  TransmuteOrb: "Ctrl+Alt+Enter",
  AugOrb: "Shift+Enter",
};
//#endregion
//#region Resize Window
window.api.ScreenRatio("ScreenRatio");
window.api.ScreenRatioValue((value) => {
  ScreenRatio = value;
});
window.api.Logfile((event, data) => {
  console.log("Logfile data: ", data);
});

//#endregion
for (const Essence of EssenceClassList) {
  EssenceNameArray.push(Essence.id);
  Essence.style.opacity = 0.2;
}
if (localStorage.length < 2) {
  StoreCoordsButton.style.display = "none";
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
        if (RemoveTutorialString.includes("Chaos")) {
          ChaosOrbCoords = [
            parseInt(MouseCoordsX * ScreenRatio),
            parseInt(MouseCoordsY * ScreenRatio),
          ];
        } else if (RemoveTutorialString.includes("Alteration")) {
          OrbofAlterationCoords = [
            parseInt(MouseCoordsX * ScreenRatio),
            parseInt(MouseCoordsY * ScreenRatio),
          ];
        } else if (RemoveTutorialString.includes("Annul")) {
          AnnulOrbCoords = [
            parseInt(MouseCoordsX * ScreenRatio),
            parseInt(MouseCoordsY * ScreenRatio),
          ];
        } else if (RemoveTutorialString.includes("Regal")) {
          RegalOrbCoords = [
            parseInt(MouseCoordsX * ScreenRatio),
            parseInt(MouseCoordsY * ScreenRatio),
          ];
        } else if (RemoveTutorialString.includes("Transmute")) {
          TransmuteOrbCoords = [
            parseInt(MouseCoordsX * ScreenRatio),
            parseInt(MouseCoordsY * ScreenRatio),
          ];
        } else if (RemoveTutorialString.includes("Scour")) {
          ScourOrbCoords = [
            parseInt(MouseCoordsX * ScreenRatio),
            parseInt(MouseCoordsY * ScreenRatio),
          ];
        } else if (RemoveTutorialString.includes("Aug")) {
          AugOrbCoords = [
            parseInt(MouseCoordsX * ScreenRatio),
            parseInt(MouseCoordsY * ScreenRatio),
          ];
        }
      } else if (
        !RemoveTutorialString.includes("Deafen") &&
        !RemoveTutorialString.includes("Shriek") &&
        !RemoveTutorialString.includes("Scream") &&
        !RemoveTutorialString.includes("Orb") &&
        !RemoveTutorialString.includes("Currency")
      ) {
        console.log("RemoveTStr: ", RemoveTutorialString);
        EssenceTabCoords = [
          parseInt(MouseCoordsX * ScreenRatio),
          parseInt(MouseCoordsY * ScreenRatio),
        ];
        console.log("EssenceTabCoords: ", EssenceTabCoords);
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
  let SavedItems = GetLSSaves("Save");
  if (Object.keys(SavedItems).length > 0) {
    for (const key of Object.keys(SavedItems)) {
      let Index = key.indexOf("Save");
      if (Index !== -1) {
        let res = key.substring(Index + 4);
        let Index2 = res.indexOf("Jewel");
        if (Index2 !== -1) {
          let IconName = res.substring(0, Index2 + 5);
          let CraftName = res.substring(Index2 + 5);
          let NewEl = CreateElementFn(
            "img",
            `${CraftName}`,
            ["Image", "Saved"],
            "",
            SavedCrafts
          );
          NewEl.src = `SaveIconPics/${IconName}.png`;
        }
      }
    }
  }

  //#region Saved crafts  ev.listeners

  SavedCrafts.addEventListener("mousedown", (e) => {
    if (e.button === 0) {
      let SavedCraftImg = document.getElementsByClassName("Saved");
      if (
        e.target.classList.contains("Image") &&
        !e.target.classList.contains("SavedSelectedIcon")
      ) {
        e.target.style.width = "30px";
        e.target.style.height = "30px";
        e.target.style.opacity = "1";
        e.target.classList.add("SavedSelectedIcon");
        e.target.classList.add("HoverSaved");
        for (let i = 0; i < SavedCraftImg.length; i++) {
          if (e.target !== SavedCraftImg[i]) {
            SavedCraftImg[i].style.opacity = "0.2";
            SavedCraftImg[i].classList.remove("SavedSelectedIcon");
            SavedCraftImg[i].classList.remove("HoverSaved");
          }
        }
      } else {
        for (let i = 0; i < SavedCraftImg.length; i++) {
          SavedCraftImg[i].style.opacity = "1";
        }
        e.target.classList.remove("SavedSelectedIcon");
        e.target.classList.remove("HoverSaved");
      }
    }
  });
  SavedCrafts.addEventListener("mouseup", (e) => {
    if (e.target.classList.contains("Image")) {
      e.target.style.width = "40px";
      e.target.style.height = "40px";
    }
  });
  SavedCrafts.addEventListener("mouseout", (e) => {
    if (e.target.classList.contains("Image")) {
      e.target.style.width = "40px";
      e.target.style.height = "40px";
    }
  });
  SavedCrafts.addEventListener("mouseover", (e) => {
    if (e.target.classList.contains("Image")) {
      CreateElementFn("div", "", "HoverTooltip", `${e.target.id}`, Insertion);
    }
  });
  SavedCrafts.addEventListener("mouseout", (e) => {
    if (e.target.classList.contains("Image")) {
      let HoverTooltip = document.getElementsByClassName("HoverTooltip");
      for (let i = HoverTooltip.length - 1; i >= 0; i--) {
        HoverTooltip[i].remove();
      }
    }
  });
  SavedCrafts.addEventListener("click", (e) => {
    if (e.target.classList.contains("Image")) {
      let LSSavedItems = GetLSSaves("Save");
      let Name = e.target.id; // awd
      let MyMods;
      for (const key of Object.keys(LSSavedItems)) {
        let Index = key.indexOf("Jewel");
        Index = Index + 5;
        let KeyName = key.substring(Index);
        if (Name === KeyName) {
          let OldModArray = document.getElementsByClassName("ModName");
          let OldNegatives = document.getElementsByClassName("ExclusionMod");
          if (OldNegatives.length > 0) {
            for (let i = OldNegatives.length; i--; ) {
              OldNegatives[i].remove();
            }
          }
          if (OldModArray.length > 0) {
            for (let i = OldModArray.length; i--; ) {
              OldModArray[i].remove();
            }
          }
          // let ModArray = JSON.parse(LSSavedItems[key]).split("NegativeMods");
          let ModArray = LSSavedItems[key];
          let PositiveMods;
          let NegativeMods;

          if (ModArray.includes("NegativeMods")) {
            ModArray = ModArray.split("NegativeMods");
            PositiveMods = JSON.parse(ModArray[0]);
            NegativeMods = JSON.parse(ModArray[1]);
          } else {
            PositiveMods = JSON.parse(ModArray);
            NegativeMods = null;
          }
          if (PositiveMods && PositiveMods.length > 0) {
            for (let i = 0; i < PositiveMods.length; i++) {
              CreateElementFn(
                "label",
                "",
                "ModName",
                PositiveMods[i],
                Container
              );
            }
          }

          if (NegativeMods && NegativeMods.length > 0) {
            for (let i = 0; i < NegativeMods.length; i++) {
              CreateElementFn(
                "label",
                "",
                "ExclusionMod",
                NegativeMods[i],
                ExclusionContainer
              );
            }
          }
        }
      }
    }
  });
  //#endregion
  for (let i = 0; i < ManualCurrency.length; i++) {
    ManualCurrency[i].classList.remove("Currency");
    ManualCurrency[i].style.opacity = 0.2;
  }
  ManualContainer.addEventListener("mouseover", function (e) {
    if (e.target.classList.contains("Manual")) {
      e.target.style.opacity = 1;
      let HoverTooltip = document.createElement("div");
      HoverTooltip.textContent = Hotkeys[e.target.id];
      HoverTooltip.classList.add("HoverTooltip");
      Insertion.appendChild(HoverTooltip);
    }
  });
  ManualContainer.addEventListener("mouseout", function (e) {
    if (e.target.classList.contains("Manual")) {
      e.target.style.opacity = 0.2;
      let HoverTooltip = document.getElementsByClassName("HoverTooltip");
      for (let i = HoverTooltip.length - 1; i >= 0; i--) {
        HoverTooltip[i].remove();
      }
    }
  });
  StartButton.addEventListener("mouseover", function (e) {
    let HoverTooltip = document.createElement("div");
    HoverTooltip.textContent = "Ctrl + K";
    HoverTooltip.classList.add("HoverTooltip");
    Insertion.appendChild(HoverTooltip);
  });
  StartButton.addEventListener("mouseout", function (e) {
    let HoverTooltip = document.getElementsByClassName("HoverTooltip");
    for (let i = HoverTooltip.length - 1; i >= 0; i--) {
      HoverTooltip[i].remove();
    }
  });
  let CheckBox = localStorage.getItem("InstructionsCheckBox");
  if (CheckBox === "checked") {
    InstructionsCheckBox.checked = true;
    for (const Item of Instructions) {
      Item.style.display = "none";
    }
  } else {
    InstructionsCheckBox.checked = false;
    for (const Item of Instructions) {
      Item.style.display = "flex";
    }
  }

  // ChaosOrbLabel.remove();
  // AltLabel.remove();
  for (let i = XYLabelList.length - 1; i >= 0; i--) {
    XYLabelList[i].remove();
  }
  EssenceTabDiv.remove();
  CurrencyTabDiv.remove();
  InstructionsDiv2.style.display = "none";
  InstructionsDiv1.textContent = `Type in the mod youre looking for and press enter then select the maximum number rerolls (you can use the scroll wheel)
    and click start  crafting. If input fields are not responsive , just alt tab quickly`;
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
//#region Add/Remove Mods
/**
 *
 * @param {HTMLElement} InputElement
 * @param {HTMLElement} ParentElement
 * @param {string} ClassToAdd
 */
const AddModElement = function (InputElement, ParentElement, ClassToAdd) {
  let NewMod = document.createElement("label");
  NewMod.textContent = InputElement.value;
  // NewMod.setAttribute("id", "ModString" + ModNumber);
  // ModNumber += 1;
  NewMod.classList.add(...ClassToAdd);
  ParentElement.appendChild(NewMod);
  InputElement.value = "";
};
Container.addEventListener("click", (e) => {
  if (e.target.classList.contains("ModName")) {
    Container.removeChild(e.target);
  }
});
Container.addEventListener("mouseover", (e) => {
  if (e.target.classList.contains("Mod")) {
    e.target.style.opacity = 0.5;
  }
});
Container.addEventListener("mouseout", (e) => {
  if (e.target.classList.contains("Mod")) {
    e.target.style.opacity = 1;
  }
});

ModNameInput.addEventListener("keydown", (e) => {
  if (e.key == "Enter") {
    AddModElement(ModNameInput, Container, ["ModName", "Mod"]);
  }
});
//#endregion

//#region  Add/Remove Exclusion Mods
ExclusionContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("ExclusionMod")) {
    ExclusionContainer.removeChild(e.target);
  }
});
ExcludeModInput.addEventListener("keydown", (e) => {
  if (e.key == "Enter") {
    AddModElement(ExcludeModInput, ExclusionContainer, ["ExclusionMod", "Mod"]);
  }
});
ExclusionContainer.addEventListener("mouseover", (e) => {
  if (e.target.classList.contains("Mod")) {
    e.target.style.opacity = 0.5;
  }
});
ExclusionContainer.addEventListener("mouseout", (e) => {
  if (e.target.classList.contains("Mod")) {
    e.target.style.opacity = 1;
  }
});
//#endregion
//#region Start Button Eventlistener
let LengthCheck = document.getElementsByClassName("Hover");
let Coords;
function StartCrafting() {
  let Hover = document.getElementsByClassName("Hover");
  console.log("Crafting triggered");
  if (localStorage.length < 1) {
    alert("Select coords first");
  } else if (Hover.length > 0) {
    console.log("Craft Started");
    InfoArray.length = 0;
    if (ModClass.length > 0) {
      let ModArray = [];
      let ExclusionModArray = [];
      if (ExclusionModClass.length > 0) {
        for (let i = 0; i < ExclusionModClass.length; i++) {
          ExclusionModArray.push(
            ExclusionModClass[i].textContent.toLocaleLowerCase().trim()
          );
        }
      }
      let Fracture = FractureCheckBox.checked;
      for (let i = 0; i < ModClass.length; i++) {
        ModArray.push(ModClass[i].textContent.toLocaleLowerCase().trim());
      }
      // console.log("ModArray: ", ModArray);
      InfoArray.push(ModArray);

      InfoArray.push(MaxRerolls.value);
      console.log("Craftmaterial: ", CraftMaterial);

      if (CraftMaterial.includes("Essence")) {
        TabCoords = localStorage.getItem("EssenceTabCoords");
        Coords = JSON.parse(localStorage.getItem("EssenceCoords"));
        for (const Item of Object.keys(Coords)) {
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

      InfoArray.push(Coords);
      InfoArray.push(TabCoords);
      InfoArray.push(CraftMaterial);
      InfoArray.push(Fracture);
      InfoArray.push(ExclusionModArray);
      console.log("InfoArray: ", InfoArray);
      window.api.StartCrafting(InfoArray);
    } else {
      alert("No mods selected");
    }
  } else {
    alert("Select currency to roll with by clicking (Chaos, alt or essence)");
  }
}
StartButton.addEventListener("click", function () {
  console.log("StartButton clicked");
  StartCrafting();
});
//#endregion
//#region  Global hotkey
window.api.StartCraft((event, data) => {
  console.log("StartCrafting shortcut works");
  StartCrafting();
});
window.api.GlobalKey((event, data) => {
  //data = "ScourOrb"
  let HotkeyCurrencyCoords = localStorage.getItem(`${data}Coords`);
  let ItemCoords = localStorage.getItem("CurrencyTabCoords");
  let DataArray = [];
  DataArray.push(HotkeyCurrencyCoords);
  DataArray.push(ItemCoords);

  window.api.TriggerCurrencyUse(DataArray);
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

//#region Instructions Eventlistener
InstructionsCheckBox.addEventListener("change", function () {
  for (const Item of Instructions) {
    if (InstructionsCheckBox.checked) {
      Item.style.display = "none";
      localStorage.setItem("InstructionsCheckBox", "checked");
    } else {
      Item.style.display = "flex";
      localStorage.setItem("InstructionsCheckBox", "");
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
      Item.style.opacity = 0.2;
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
  if (localStorage.length < 2) {
    StoreCoordsButton.style.display = "flex";
  }

  if (e.target == EssenceImage && !EssenceImage.classList.contains("Clicked")) {
    if (InputDiv.style.display == "flex") {
      EssenceInput.style.display = "flex";
    }
    if (localStorage.length < 1) {
      InstructionsDiv1.innerText = `Now repeat the same process for the highlighted essences. Once you're done , 
      click on the button at the bottom of the page to store your coordinates and NameTaken`;
      InstructionsDiv2.style.display = "none";
    } else {
      InstructionsDiv1.textContent = ` Type in the mod youre looking for and press enter then select the maximum number rerolls (you can use the scroll wheel)
         and click start  crafting. If input fields are not responsive , just alt tab quickly `;
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
    EssenceImage.src = "EssencePics/Arrow.png";
  } else {
    if (localStorage.length < 1) {
      InstructionsDiv2.style.display = "flex";
      InstructionsDiv1.innerText = `Select a currency item (Left click), then 
      while the program is focused (Click on the program and do not click anywhere else)
      move your mouse cursor over the center of the matching item in game (without clicking),
      then press F1 to record its coordinates`;
    } else {
      InstructionsDiv1.textContent = `Type in the mod youre looking for and press enter then select the maximum number rerolls (you can use the scroll wheel)
         and click start  crafting. If input fields are not responsive , just alt tab quickly `;
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
    ImageContainer.style.flexDirection = "column";
    EssenceImage.src =
      "EssencePics/Torment/Deafening_Essence_of_Torment_inventory_icon.png";
  }
});
//#endregion
//#region Currencies eventlistener

CurrencyDiv.addEventListener("click", (e) => {
  if (e.target.classList.contains("Currency")) {
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
      console.log("CraftMaterialCurrency: ", CraftMaterial);
      if (ChangingLabel !== null) {
        ChangingLabel.classList.add("Modify");
      }
    }
  }
});
//#endregion

//#region Delete Saved Crafts

document.addEventListener("keydown", (e) => {
  if (e.key === "Delete") {
    let SelectedItem = document.getElementsByClassName("SavedSelectedIcon");
    SelectedItem = SelectedItem[0];
    console.log(SelectedItem);
    DeleteLSSaveItem(SelectedItem.id);
    SelectedItem.remove();
    let SavedItems = document.getElementsByClassName("Saved");
    for (let i = 0; i < SavedItems.length; i++) {
      SavedItems[i].style.opacity = "1";
    }
  }
});

//#endregion

//#region Save craft
// Create label
/**
 * Creates a new element, sets its properties, and inserts it into the specified parent element.
 * @param {string} ElType - The type of the element to create (e.g., 'div', 'label', 'span').
 * @param {string} [ElID] - Optional The ID attribute of the new element.
 * @param {string} ElClass - The class attribute of the new element.
 * @param {string} ElText - The text content of the new element.
 * @param {HTMLElement} ElParent - The parent element where the new element will be inserted.
 */
function CreateElementFn(ElType, ElID = "", ElClass = "", ElText, ElParent) {
  let NewElement = document.createElement(ElType);
  if (ElID) {
    NewElement.id = ElID;
  }
  if (ElClass) {
    if (Array.isArray(ElClass)) {
      for (let i = 0; i < ElClass.length; i++) {
        NewElement.classList.add(ElClass[i]);
      }
    } else {
      NewElement.classList.add(ElClass);
    }
  }
  if (ElText) {
    NewElement.textContent = ElText;
  }
  if (ElParent) {
    ElParent.appendChild(NewElement, document.body.firstElementChild);
  }
  return NewElement;
}
//SavedSelectedIcon
SaveCraftButton.addEventListener("click", function () {
  let SavedSelectedIcon = document.getElementsByClassName("SavedSelectedIcon");
  console.log(SavedSelectedIcon);
  if (SavedSelectedIcon.length > 0) {
    let SelectedName = SavedSelectedIcon[0].id;
    console.log("SelectedName: ", SelectedName);
    let PositiveModArray = [];
    let NegativeModArray = [];
    // ModClass = document.getElementsByClassName("ModName");
    for (let i = 0; i < ExclusionModClass.length; i++) {
      NegativeModArray.push(
        ExclusionModClass[i].textContent.toLocaleLowerCase()
      );
    }
    for (let i = 0; i < ModClass.length; i++) {
      PositiveModArray.push(ModClass[i].textContent.toLocaleLowerCase());
    }
    if (NegativeModArray.length > 0 && PositiveModArray.length > 0) {
      ChangeLSSaves(
        SelectedName,
        `${JSON.stringify(PositiveModArray)}NegativeMods${JSON.stringify(
          NegativeModArray
        )}`
      );
    } else {
      ChangeLSSaves(SelectedName, `${JSON.stringify(PositiveModArray)}`);
    }
  } else {
    const SaveCraftIconSelector = document.getElementById(
      "SaveCraftIconSelector"
    );
    if (!SaveCraftIconSelector) {
      let IconSelector = CreateElementFn(
        "label",
        "SaveCraftIconSelector",
        ["SaveCraft", "SelectNone"],
        "Select an icon",
        document.body
      );
      SaveGallery.style.display = "grid";
      IconSelector.appendChild(SaveGallery);

      SaveGallery.addEventListener("mousedown", (e) => {
        if (e.target.classList.contains("Image")) {
          e.target.style.width = "30px";
          e.target.style.height = "30px";
          e.target.style.opacity = "1";
          e.target.classList.add("SelectedIcon");
          for (let i = 0; i < GalleryImageArray.length; i++) {
            if (e.target !== GalleryImageArray[i]) {
              GalleryImageArray[i].style.opacity = "0.2";
              GalleryImageArray[i].classList.remove("SelectedIcon");
            }
          }
        }
      });
      SaveGallery.addEventListener("mouseup", (e) => {
        if (e.target.classList.contains("Image")) {
          e.target.style.width = "40px";
          e.target.style.height = "40px";
        }
      });
      SaveGallery.addEventListener("mouseout", (e) => {
        if (e.target.classList.contains("Image")) {
          e.target.style.width = "40px";
          e.target.style.height = "40px";
        }
      });
      let NameSaveSelector = CreateElementFn(
        "input",
        "NameSaveSelectorInput",
        ["SaveCraft", "Input"],
        "",
        IconSelector
      );
      NameSaveSelector.placeholder = "Select a name";

      NameSaveSelector.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          let SaveName = NameSaveSelector.value;
          let SaveIcon = document.getElementsByClassName("SelectedIcon");
          SaveIcon = SaveIcon[0];
          let NameTaken = false; // used to check if the name is already taken
          if (e.key === "Enter" && SaveIcon != null) {
            if (SaveName !== "") {
              let LSSave = GetLSSaves("Save");
              console.log("LSSave: ", LSSave);
              if (Object.keys(LSSave).length > 0) {
                // If object exists, extract its name from the LS save and compare it.
                for (const key of Object.keys(LSSave)) {
                  let Index = key.indexOf("Jewel");
                  Index = Index + 5;
                  let Name = key.substring(Index);
                  console.log("Name: ", Name);
                  if (SaveName === Name) {
                    break;
                  } else {
                    NameTaken = true;
                  }
                }
              } else {
                NameTaken = true;
              }
              if (NameTaken) {
                console.log("Name already taken, please select another.");
                let PathParts = SaveIcon.src.split("/");
                let SaveIconName = PathParts[PathParts.length - 1];
                SaveIconName = SaveIconName.replace(".png", "");
                let ModArray = [];
                let NegativeModArray = [];
                for (let i = 0; i < ModClass.length; i++) {
                  ModArray.push(ModClass[i].textContent.toLocaleLowerCase());
                }
                for (let i = 0; i < ExclusionModClass.length; i++) {
                  NegativeModArray.push(
                    ExclusionModClass[i].textContent.toLocaleLowerCase()
                  );
                }
                if (ModArray.length > 0 && NegativeModArray.length > 0) {
                  localStorage.setItem(
                    `Save${SaveIconName}${SaveName}`,
                    `${JSON.stringify(ModArray)}NegativeMods${JSON.stringify(
                      NegativeModArray
                    )}`
                  );
                  let NewSave = CreateElementFn(
                    "img",
                    SaveName,
                    ["Saved", "Image"],
                    "",
                    document.body
                  );
                  NewSave.src = `${SaveIcon.src}`;
                  SavedCrafts.appendChild(NewSave);
                  IconSelector.remove();
                } else if (
                  ModArray.length > 0 &&
                  NegativeModArray.length == 0
                ) {
                  localStorage.setItem(
                    `Save${SaveIconName}${SaveName}`,
                    `${JSON.stringify(ModArray)}`
                  );
                  let NewSave = CreateElementFn(
                    "img",
                    SaveName,
                    ["Saved", "Image"],
                    "",
                    document.body
                  );
                  NewSave.src = `${SaveIcon.src}`;
                  SavedCrafts.appendChild(NewSave);
                  IconSelector.remove();
                } else {
                  alert("Please select mods for the craft you want  to save");
                }
              } else {
                alert("Name already taken, please select another one");
              }
            } else if (e.key === "Enter" && SaveName === "") {
              alert("Please select a name for the save");
            }
          } else if (e.key === "Enter" && SaveIcon === undefined) {
            alert("Please select an icon for the save");
          }
        }
      });
    }
  }
});
//#endregion
//#region Store Coords button

StoreCoordsButton.addEventListener("click", function () {
  console.log("EssenceTabCoords: ", EssenceTabCoords);
  console.log("CurrencyTabCoords: ", CurrencyTabCoords);
  if (
    typeof EssenceTabCoords === "undefined" ||
    typeof CurrencyTabCoords === "undefined"
  ) {
    alert("Please select at least one item's coords");
  } else {
    localStorage.setItem("CurrencyTabCoords", `${CurrencyTabCoords}`);
    localStorage.setItem("ChaosOrbCoords", `${ChaosOrbCoords}`);
    localStorage.setItem("AnnulOrbCoords", `${AnnulOrbCoords}`);
    localStorage.setItem("RegalOrbCoords", `${RegalOrbCoords}`);
    localStorage.setItem("ScourOrbCoords", `${ScourOrbCoords}`);
    localStorage.setItem("TransmuteOrbCoords", `${TransmuteOrbCoords}`);
    localStorage.setItem("AugOrbCoords", `${AugOrbCoords}`);
    localStorage.setItem("OrbofAlterationCoords", `${OrbofAlterationCoords}`);
    localStorage.setItem("EssenceTabCoords", `${EssenceTabCoords}`);

    if (CurrencyTabLocationLabel.textContent === "X:, Y:") {
      alert(
        "Please select the location of the item that will be rolled with alts and chaos ."
      );
    } else {
      EssenceTabLocationLabel.remove();
      if (EssenceTabLocationLabel.textContent === "X:, Y:") {
        alert(
          "Please select the location of the item that will be rolled with essences ."
        );
      } else {
        // CurrencyTabLocationLabel.remove();
        Currencies = document.getElementsByClassName("Currency");
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
    for (let i = XYLabelList.length - 1; i > 0; i--) {
      XYLabelList[i].remove();
    }
  }
});
//#endregion

//#region  ItemError:
window.api.ItemError((event, data) => {
  alert(`${data}`);
});
window.api.RarityError((event, data) => {
  alert(`${data}`);
});
//#endregion

//#region Clear Local Storage
window.api.ClearLocalStorage((event, data) => {
  console.log("Signal's here");
  localStorage.clear();
  location.reload();
});
//#endregion

//#region Counter
window.api.Counter((event, data) => {
  console.log("Counter: ", data);
  let CounterElement = document.getElementById("Counter");
  console.log("CounterElement: ", CounterElement);
  if (CounterElement === null) {
    Counter = 1;
    CreateElementFn(
      "label",
      "Counter",
      "HoverTooltip",
      `Currency Used: ${Counter}`,
      Insertion
    );
  } else {
    Counter++;
    CounterElement.textContent = `Currency Used: ${Counter}`;
  }
});
//#endregion
