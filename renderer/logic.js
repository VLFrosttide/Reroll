"use strict";

import {
  CreateElementFn,
  DeleteSavedItem,
  GetCurrentItem,
  FixFocus,
  DisplayInsertionMsg,
  RemoveElementByClass,
  CenterItem,
  BlurBG,
  RemoveBlur,
  CloseSaveWindow,
} from "../HelperFunctionsFrontend/HelperFn.js";
import {
  DeleteLSSaveItem,
  GetLSSaves,
  ChangeLSSaves,
  CreateLocalStorageSave,
  GetSavedItem,
} from "../HelperFunctionsFrontend/LocalStorageFn.js";
import {
  LoadInitialState,
  ShowHiddenContent,
} from "../HelperFunctionsFrontend/LoadInitialState.js";
//#region Declarations
const Main = document.getElementById("Main");
const ModNameInput = document.getElementById("ModInput");
const ExcludeModInput = document.getElementById("ExcludeModInput");
const Container = document.getElementById("Container");
const ExclusionContainer = document.getElementById("ExclusionContainer");
const ModClass = document.getElementsByClassName("ModName");
const ExclusionModClass = document.getElementsByClassName("ExclusionMod");
const CurrencyDiv = document.getElementById("CurrencyDiv");
const StartButton = document.getElementById("StartButton");
const SavedCrafts = document.getElementById("SavedCrafts");
let HoverTooltip = document.getElementsByClassName("HoverTooltip");
let DeleteSaveButton;
let Counter;
const ExportFileOKButton = document.getElementById("ExportFileOKButton");
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
const LagInput = document.getElementById("LagInput");
const MinRoll = document.getElementById("MinRoll");
const InputDiv = document.getElementById("InputDiv");
const Instructions = document.getElementsByClassName("Instructions");
const InstructionsDiv1 = document.getElementById("Instructions");
const InstructionsDiv2 = document.getElementById("Instructions2");
const InstructionsCheckBox = document.getElementById("InstructionsCheckBox");
const LagCheckBox = document.getElementById("LagCheckBox");
const CheckBoxClass = document.getElementsByClassName("CheckBox");
const Fractures = document.getElementById("Fractures");
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
let LagInputLS = localStorage.getItem("LagInput");
if (LagInputLS) {
  LagInput.value = Number(LagInputLS);
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

//#endregion
for (const Essence of EssenceClassList) {
  EssenceNameArray.push(Essence.id);
  Essence.style.opacity = 0.2;
}
if (localStorage.length < 2) {
  LoadInitialState();
} else {
  let SavedItems = GetLSSaves("Save");
  if (Object.keys(SavedItems).length > 0) {
    for (const key of Object.keys(SavedItems)) {
      let IconName = localStorage.getItem(key);
      IconName = IconName.replace("SaveIconName", "");
      IconName = IconName.split("PositiveMods").shift();
      let NewEl = CreateElementFn(
        "img",
        `${key}`,
        ["Image", "Saved"],
        "",
        SavedCrafts
      );
      NewEl.src = `SaveIconPics/${IconName}`;
    }
  }

  for (let i = 0; i < ManualCurrency.length; i++) {
    ManualCurrency[i].classList.remove("Currency");
    ManualCurrency[i].style.opacity = 0.2;
  }
  ManualContainer.addEventListener("mouseover", function (e) {
    if (e.target.classList.contains("Manual")) {
      RemoveElementByClass("HoverTooltip");

      CreateElementFn(
        "div",
        "",
        ["HoverTooltip"],
        `${Hotkeys[e.target.id]}`,
        Insertion
      );
    }
  });
  ManualContainer.addEventListener("mouseout", function (e) {
    if (e.target.classList.contains("Manual")) {
      e.target.style.opacity = 0.2;
      RemoveElementByClass("HoverTooltip");
    }
  });
  StartButton.addEventListener("mouseover", function (e) {
    RemoveElementByClass("HoverTooltip");

    let newel = CreateElementFn(
      "div",
      "",
      ["HoverTooltip"],
      "Ctrl + Enter",
      Insertion,
      "aliceblue"
    );
  });
  StartButton.addEventListener("mouseout", function (e) {
    RemoveElementByClass("HoverTooltip");
  });

  let InstructionsBox = localStorage.getItem("InstructionsCheckBox");
  if (InstructionsBox === "checked") {
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
  let LagBox = localStorage.getItem("LagCheckBox");
  if (LagBox === "checked") {
    LagCheckBox.checked = true;
  } else {
    LagCheckBox.checked = false;
  }

  RemoveElementByClass("XYLabel");
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
  // StartButton.style.display = "flex";
  // SaveCraftButton.style.display = "flex";
  // Container.style.display = "flex";
  // ExclusionContainer.style.display = "flex";
  // Fractures.style.display = "flex";
  ShowHiddenContent();
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
//#region Placeholder Eventlisteners
ModNameInput.addEventListener("focusin", function () {
  ModNameInput.placeholder = "";
});
ModNameInput.addEventListener("focusout", function () {
  ModNameInput.placeholder = "Mod youre looking for";
});

//#endregion
//#region Mods ev.listeners
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("Mod")) {
    e.target.remove();
  }
});
document.addEventListener("mouseover", (e) => {
  if (e.target.classList.contains("Mod")) {
    e.target.style.opacity = 0.5;
  }
});
document.addEventListener("mouseout", (e) => {
  if (e.target.classList.contains("Mod")) {
    e.target.style.opacity = 1;
  }
});

ModNameInput.addEventListener("keydown", (e) => {
  if (e.key == "Enter") {
    CreateElementFn(
      "div",
      "",
      ["ModName", "Mod"],
      ModNameInput.value,
      Container,
      "rgb(112, 255, 112)" // green
    );
    ModNameInput.value = "";
  }
});

ExcludeModInput.addEventListener("keydown", (e) => {
  if (e.key == "Enter") {
    CreateElementFn(
      "div",
      "",
      ["ExclusionMod", "Mod"],
      ExcludeModInput.value,
      ExclusionContainer,
      "rgb(255, 62, 28)"
    );
    ExcludeModInput.value = "";
  }
});

//#endregion
//#region Start Button Eventlistener
let Coords;
function StartCrafting() {
  let Hover = document.getElementsByClassName("Hover");
  if (localStorage.length < 1) {
    RemoveElementByClass("HoverTooltip");
    DisplayInsertionMsg("Select coords first!", "red");
  } else if (Hover.length > 0) {
    InfoArray.length = 0;
    if (ModClass.length > 0) {
      let Fracture = FractureCheckBox.checked;
      let ModArray = [];
      let ExclusionModArray = [];
      if (ExclusionModClass.length > 0) {
        for (let i = 0; i < ExclusionModClass.length; i++) {
          ExclusionModArray.push(
            ExclusionModClass[i].textContent.toLocaleLowerCase().trim()
          );
        }
      }
      for (let i = 0; i < ModClass.length; i++) {
        let MyMod = ModClass[i].textContent.toLocaleLowerCase().trim();
        let HasNumber = /\d/.test(MyMod);
        if (!HasNumber) {
          MyMod = MyMod + "0";
        }
        ModArray.push(MyMod);
      }
      InfoArray.push(ModArray); //0

      InfoArray.push(MaxRerolls.value); //1

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

      InfoArray.push(Coords); //2
      InfoArray.push(TabCoords); //3
      InfoArray.push(CraftMaterial); //4
      InfoArray.push(Fracture); //5
      InfoArray.push(ExclusionModArray); //6
      let LagInputNumber;
      if (LagCheckBox.checked) {
        LagInputNumber = Number(LagInput.value);
      } else {
        LagInputNumber = 0;
      }
      InfoArray.push(Number(LagInputNumber)); //7
      window.api.StartCrafting(InfoArray);
    } else {
      RemoveElementByClass("HoverTooltip");

      DisplayInsertionMsg("No mods selected", "red");
    }
  } else {
    RemoveElementByClass("HoverTooltip");

    DisplayInsertionMsg(
      "Select currency to roll with by clicking (Chaos, alt or essence)",
      "red"
    );
  }
}
StartButton.addEventListener("click", function () {
  DisplayInsertionMsg("Crafting started!", "green");
  StartCrafting();
});
//#endregion
//#region  Global hotkey
window.api.StartCraft((event, data) => {
  DisplayInsertionMsg("Crafting started!", "green");

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
//#region  StepUp/Down event listeners
MaxRerolls.addEventListener("wheel", function (e) {});

LagInput.addEventListener("wheel", function (e) {});

//#endregion

//#region CheckBox Eventlistener
LagInput.addEventListener("blur", function () {
  // blur is used for element being out of focus in this case.
  localStorage.setItem("LagInput", LagInput.value);
});
//Loop through all instructions and show/hide them based on the checkbox
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

LagCheckBox.addEventListener("change", function () {
  if (LagCheckBox.checked) {
    localStorage.setItem("LagCheckBox", "checked");
  } else {
    localStorage.setItem("LagCheckBox", "");
    LagInput.value = "";
  }
});
//#endregion
//#region Click Event Highlight

EssenceContainer.addEventListener("click", function (e) {
  if (e.target.classList.contains("Essence")) {
    Main.style.position = "";
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
//#region Essence Hover Event listeners
// EssenceContainer.addEventListener("mouseover", function (e) {
//   if (e.target.classList.contains("Essence")) {
//     RemoveElementByClass("HoverTooltip");

//     let Spaces = `${e.target.id}`.replace(/([A-Z])/g, " $1").trim(); // Breaks down the essence ID and capitalizes every letter and adds space between words.
//     CreateElementFn("div", "", ["HoverTooltip"], Spaces, Insertion);
//   }
// });
// EssenceContainer.addEventListener("mouseout", function (e) {
//   if (e.target.classList.contains("Essence")) {
//     if (!e.target.classList.contains("Highlight")) {
//       e.target.style.opacity = 0.3;
//     }
//     // if (e.target.classList.contains("Hover"))
//     RemoveElementByClass("HoverTooltip");
//   }
// });
//#endregion

//#region Essence Image Click event
EssenceImage.addEventListener("click", function (e) {
  for (const Item of AllowLabelModification) {
    Item.classList.remove("Modify");
  }
  if (localStorage.length < 2) {
    StoreCoordsButton.style.display = "flex";
  }

  if (
    e.target === EssenceImage &&
    !EssenceImage.classList.contains("Clicked")
  ) {
    if (localStorage.length < 1) {
      InstructionsDiv1.innerText = `Now repeat the same process for the highlighted essences. Once you're done , 
      click on the button at the bottom of the page to store your coordinates`;
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
      if (ChangingLabel !== null) {
        ChangingLabel.classList.add("Modify");
      }
    }
  }
});
//#endregion

//#region Delete Saved Crafts
SavedCrafts.addEventListener("mouseover", (e) => {
  if (e.target.classList.contains("Saved")) {
    e.target.classList.add("Delete");
  }
});
SavedCrafts.addEventListener("mouseout", (e) => {
  if (e.target.classList.contains("Delete")) {
    e.target.classList.remove("Delete");
  }
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Delete") {
    let SelectedItem = document.getElementsByClassName("Delete")[0];
    if (SelectedItem) {
      DeleteSavedItem(SelectedItem, DeleteLSSaveItem);
    }
  }
});

//#endregion

//#region Save craft

SaveCraftButton.addEventListener("click", function () {
  let SavedSelectedIcon = document.getElementsByClassName("SavedSelectedIcon");

  // Used so you can add / remove mods from existing saves
  if (SavedSelectedIcon.length > 0) {
    let Mods = GetCurrentItem();
    let IconName = SavedSelectedIcon[0].src.split("/").pop();
    let SelectedName = SavedSelectedIcon[0].id;
    if (Mods[0].length > 0) {
      let SaveString = `SaveIconName${IconName}PositiveMods${JSON.stringify(
        Mods[0]
      )}NegativeMods${JSON.stringify(Mods[1])}`;
      ChangeLSSaves(SelectedName, SaveString);
      DisplayInsertionMsg(
        "Successfully saved changes to the selected existing item",
        "green"
      );
    } else {
      DisplayInsertionMsg("Please select at least one positive mod", "red");
    }
  } else {
    const SaveCraftContainer = document.getElementById("SaveCraftContainer");
    if (!SaveCraftContainer) {
      let SaveCraftContainer = CreateElementFn(
        "div",
        "SaveCraftContainer",
        ["SaveCraft", "SelectNone"],
        "Select an icon",
        document.body
      );
      BlurBG();
      CenterItem(SaveCraftContainer);
      window.api.LoadSaveIconPics("InitialRequest");
      SaveGallery.style.display = "grid";
      SaveCraftContainer.appendChild(SaveGallery);

      SaveGallery.addEventListener("mousedown", (e) => {
        if (e.target.classList.contains("Image")) {
          e.target.style.transform = "scale(0.6)";
          e.target.style.opacity = "1";
          e.target.classList.add("SelectedIcon");
          for (let i = 0; i < GalleryImageArray.length; i++) {
            if (e.target !== GalleryImageArray[i]) {
              GalleryImageArray[i].style.opacity = "0.35";
              GalleryImageArray[i].classList.remove("SelectedIcon");
            }
          }
        }
      });
      SaveGallery.addEventListener("mouseup", (e) => {
        if (e.target.classList.contains("Image")) {
          e.target.style.transform = "scale(1)";
        }
      });
      SaveGallery.addEventListener("mouseout", (e) => {
        if (e.target.classList.contains("Image")) {
          e.target.style.transform = "scale(1)";
        }
      });
      let NameSaveSelector = CreateElementFn(
        "input",
        "NameSaveSelectorInput",
        ["SaveCraft", "Input"],
        "",
        SaveCraftContainer
      );
      NameSaveSelector.placeholder = "Select a name";

      NameSaveSelector.addEventListener("keydown", async (e) => {
        if (e.key === "Enter") {
          let SaveName = NameSaveSelector.value;
          let SaveIcon = document.getElementsByClassName("SelectedIcon")[0];
          let NameTaken = false; // used to check if the name is already taken
          if (e.key === "Enter" && SaveIcon != null) {
            if (SaveName !== "") {
              let LSSave = GetLSSaves("Save");
              if (Object.keys(LSSave).length > 0) {
                // If object exists, extract its name from the LS save and compare it and assign a value to NameTaken.
                for (const key of Object.keys(LSSave)) {
                  if (SaveName === key) {
                    NameTaken = true; // Break out of the loop without setting NameTaken to true
                    break;
                  }
                }
              }
              //
              //
              //
              //
              if (!NameTaken) {
                RemoveBlur();
                CloseSaveWindow();

                let SaveIconName = SaveIcon.src.split("/").pop();
                // && GetMods[1].length > 0
                let GetMods = GetCurrentItem();
                if (GetMods[0].length > 0) {
                  RemoveBlur();
                  CloseSaveWindow();
                  let SaveString = `SaveIconName${SaveIconName}PositiveMods${JSON.stringify(
                    GetMods[0]
                  )}NegativeMods${JSON.stringify(GetMods[1])}`;
                  let SavedItem = await CreateLocalStorageSave(
                    SaveName,
                    SaveString
                  );
                  let NewSave = CreateElementFn(
                    "img",
                    SaveName,
                    ["Saved", "Image"],
                    "",
                    SavedCrafts
                  );
                  NewSave.src = `${SaveIcon.src}`;
                  SavedCrafts.appendChild(NewSave);
                  SaveCraftContainer.remove();
                } else {
                  RemoveBlur();
                  CloseSaveWindow();

                  DisplayInsertionMsg(
                    "Please select mods for the craft you want  to save",
                    "red"
                  );
                }
              } else {
                RemoveBlur();
                CloseSaveWindow();

                DisplayInsertionMsg(
                  "Name already taken, please select another one",
                  "red"
                );
              }
            } else if (e.key === "Enter" && SaveName === "") {
              RemoveBlur();
              CloseSaveWindow();

              DisplayInsertionMsg("Please select a name for the save", "red");
            }
          } else if (e.key === "Enter" && SaveIcon === undefined) {
            CloseSaveWindow();

            RemoveBlur();
            DisplayInsertionMsg("Please select an icon for the save", "red");
          }
        }
      });
    }
  }
});
//#endregion
//#region Store Coords button

StoreCoordsButton.addEventListener("click", function () {
  if (
    typeof EssenceTabCoords === "undefined" ||
    typeof CurrencyTabCoords === "undefined"
  ) {
    DisplayInsertionMsg("Please select at least one item's coords", "red");
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
      DisplayInsertionMsg(
        "Please select the location of the item that will be rolled with alts and chaos",
        "red"
      );
    } else {
      EssenceTabLocationLabel.remove();
      if (EssenceTabLocationLabel.textContent === "X:, Y:") {
        DisplayInsertionMsg(
          "Please select the location of the item that will be rolled with essences",
          "red"
        );
      } else {
        // CurrencyTabLocationLabel.remove();
        Currencies = document.getElementsByClassName("Currency");
        ShowHiddenContent();
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
        for (const Item of ElementsToRemove) {
          Item.remove();
        }
        window.location.reload();
        DisplayInsertionMsg("Items have been stored!", "green");
      }
    }
  }
});
//#endregion

//#region  ItemError:
window.api.ItemError((event, data) => {
  DisplayInsertionMsg(`${data}`, "red");
});
window.api.RarityError((event, data) => {
  DisplayInsertionMsg(`${data}`, "red");
});
//#endregion

//#region Clear Local Storage
window.api.ClearLocalStorage((event, data) => {
  localStorage.clear();
  location.reload();
});
//#endregion

//#region Counter
window.api.Counter((event, data) => {
  let CounterElement = document.getElementById("Counter");
  if (CounterElement === null) {
    Counter = 1;

    DisplayInsertionMsg(`Currency Used: ${Counter}`, "aliceblue");
  } else {
    Counter++;
    CounterElement.textContent = `Currency Used: ${Counter}`;
  }
});
//#endregion

//#region Logfiles
window.api.Logfile((event, data) => {
  DisplayInsertionMsg(`${data}`);
});

//#endregion

//#region Export Items as files
ExportFileOKButton.addEventListener("click", function (e) {
  let FileName = document.getElementById("ExportFileInput").value;
  RemoveBlur();

  let Mods = GetCurrentItem(); // Mods[0] = positive, Mods[1] = negative

  if (FileName.length > 0) {
    Mods.push(FileName);
    window.api.ReturnExportData(Mods);
  } else {
    DisplayInsertionMsg("File name cannot be empty", "red");
  }
  document.getElementById("ExportFileInput").value = "";
});
window.api.ExportItemsListener((event, data) => {
  if (data === "InitialRequest") {
    let ModCollection = document.getElementsByClassName("Mod");
    if (ModCollection.length > 0) {
      let FileNameDialog = document.getElementById("FileNameDialog");
      FileNameDialog.showModal();
      RemoveElementByClass("HoverTooltip");

      BlurBG();
    } else {
      DisplayInsertionMsg("Add mods you want to export first", "red");
    }
  }
  if (data === "Confirmation") {
    DisplayInsertionMsg("Successfully exported current item", "green");
  }
  if (data === "NamingError") {
    DisplayInsertionMsg("Name already exists, please select another.", "red");
  }
});

//#endregion

//#region Clear Mods
window.api.ClearMods((event, data) => {
  let RemoveModsArray = Array.from(document.getElementsByClassName("Mod"));
  for (let i = 0; i < RemoveModsArray.length; i++) {
    RemoveModsArray[i].remove();
  }
});
//#endregion

window.api.ImportItemsListener((event, data) => {
  let Pmods = data[0];
  let Nmods = data[1];
  for (let i = 0; i < Pmods.length; i++) {
    CreateElementFn(
      "label",
      "",
      ["ModName", "Mod"],
      Pmods[i],
      Container,
      "rgb(112, 255, 112)"
    );
  }
  for (let i = 0; i < Nmods.length; i++) {
    CreateElementFn(
      "label",
      "",
      ["ExclusionMod", "Mod"],
      Nmods[i],
      ExclusionContainer,
      "rgb(255, 62, 28)"
    );
  }
  DisplayInsertionMsg("Item imported successfully!", "green");
});
window.api.SaveIconsData((event, data) => {
  let IconFolderPath = data[0];
  let IconNameArray = data[1];

  for (let i = 0; i < IconNameArray.length; i++) {
    let NewElement = document.getElementById(IconNameArray[i]);
    if (!NewElement) {
      let NewImg = CreateElementFn(
        "img",
        `${IconNameArray[i]}`,
        ["Image", "GalleryImage"],
        "",
        SaveGallery
      );
      let NewImgSrc = IconFolderPath + "\\" + IconNameArray[i];
      NewImg.src = NewImgSrc;
    }
  }
});
//#region Escape ev.listener
window.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    RemoveBlur();
    CloseSaveWindow();
    let ActiveElement = this.document.activeElement;
    if (ActiveElement.classList.contains("Input")) {
      ActiveElement.value = "";
    }
  }
});

//#endregion
//#region Saved crafts  ev.listeners

SavedCrafts.addEventListener("mousedown", (e) => {
  if (e.button === 0) {
    let SavedCraftImg = document.getElementsByClassName("Saved");
    if (
      e.target.classList.contains("Image") &&
      !e.target.classList.contains("SavedSelectedIcon")
    ) {
      //rework
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
    RemoveElementByClass("HoverTooltip");
    CreateElementFn("div", "", ["HoverTooltip"], `${e.target.id}`, Insertion);
  }
});
SavedCrafts.addEventListener("mouseout", (e) => {
  if (e.target.classList.contains("Image")) {
    RemoveElementByClass("HoverTooltip");

    for (let i = HoverTooltip.length - 1; i >= 0; i--) {
      HoverTooltip[i].remove();
    }
  }
});
SavedCrafts.addEventListener("click", (e) => {
  if (e.target.classList.contains("Image")) {
    let Name = e.target.id; // Example:  ShaperWand
    GetSavedItem("Save", Name)
      .then((result) => {
        let Pmods = JSON.parse(result[0]);
        let Nmods = JSON.parse(result[1]);
        RemoveElementByClass("ModName");
        RemoveElementByClass("ExclusionMod");
        for (let i = 0; i < Pmods.length; i++) {
          CreateElementFn(
            "label",
            "",
            ["ModName", "Mod"],
            Pmods[i],
            Container,
            "rgb(112, 255, 112)"
          );
        }
        for (let i = 0; i < Nmods.length; i++) {
          CreateElementFn(
            "label",
            "",
            ["ExclusionMod", "Mod"],
            Nmods[i],
            ExclusionContainer,
            "rgb(255, 62, 28)"
          );
        }

        DisplayInsertionMsg("Saved item loaded successfully!", "green");
      })
      .catch((error) => {
        DisplayInsertionMsg(`Error loading item: ${error}`, "red");

        console.error(error);
      });
  }
});
//#endregion
//#region Mouse position API
//rework
window.api.MousePos((event, data) => {
  let CoordsSplit = data.split(",");
  MouseCoordsX = parseInt(CoordsSplit[0]);
  MouseCoordsY = parseInt(CoordsSplit[1]);
  if (ChangingLabel == undefined) {
    RemoveElementByClass("HoverTooltip");

    DisplayInsertionMsg("No currency selected.", "red");
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
