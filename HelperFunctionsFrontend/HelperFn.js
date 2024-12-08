/**
 * Creates a new element, sets its properties, and inserts it into the specified parent element.
 * @param {string}Type - The type of the element to create (e.g., 'div', 'label', 'span').
 * @param {string}[ID] - Optional The ID attribute of the new element.
 * @param {Array}Class - The class attributes of the new element.
 * @param {string}Text - The text content of the new element.
 * @param {HTMLElement}Parent - The parent element where the new element will be inserted.
 * @param {string}TextColor - Optional text color
 */
export function CreateElementFn(
  Type,
  ID = "",
  Class = [""],
  Text,
  Parent,
  TextColor = "aliceblue"
) {
  let NewElement = document.createElement(Type);
  if (ID) {
    NewElement.id = ID;
  }
  if (Class.length > 0) {
    NewElement.classList.add(...Class);
  }
  if (Text) {
    NewElement.textContent = Text;
  }
  if (TextColor) {
    NewElement.style.color = TextColor;
  }
  if (Parent) {
    Parent.appendChild(NewElement, document.body.firstElementChild);
  } else {
    console.log("Error creating element, parent not found");
    return new Error("Parent element not found");
  }
  return NewElement;
}

export function GetCurrentItem() {
  let PositiveMods = document.getElementsByClassName("ModName");
  let NegativeMods = document.getElementsByClassName("ExclusionMod");
  let PmodArray = [];
  let NmodArray = [];
  for (let i = 0; i < PositiveMods.length; i++) {
    PmodArray.push(PositiveMods[i].textContent);
  }
  for (let i = 0; i < NegativeMods.length; i++) {
    NmodArray.push(NegativeMods[i].textContent);
  }

  return [PmodArray, NmodArray];
}

export function DeleteSavedItem(Item, LSDeleteFunction) {
  console.log(Item), console.log(LSDeleteFunction);
  LSDeleteFunction(Item.id);
  Item.remove();
  let SavedItems = document.getElementsByClassName("Saved");
  for (let i = 0; i < SavedItems.length; i++) {
    SavedItems[i].style.opacity = "1";
  }
}

export function FixFocus() {
  window.api.FocusFix("FixME!");
}

export function DisplayInsertionMsg(Text, Color = "aliceblue") {
  RemoveModByClass("HoverTooltip");
  let Parent = document.getElementById("Insertion");
  return CreateElementFn("div", "", ["HoverTooltip"], Text, Parent, Color);
}

export function RemoveModByClass(ClassName) {
  let RemovalArray = Array.from(document.getElementsByClassName(ClassName));
  for (let i = 0; i < RemovalArray.length; i++) {
    RemovalArray[i].remove();
  }
}
