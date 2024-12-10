import { RemoveElementByClass } from "./HelperFn.js";
export function DeleteLSSaveItem(Name) {
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

export function GetLSSaves(Prefix) {
  let Items = {};
  for (let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i);
    let value = localStorage.getItem(key);
    if (value.startsWith(Prefix)) {
      Items[key] = value;
    }
  }
  return Items;
}
/**
 *
 * @param {string} Prefix
 * @param {string} Name
 * @returns {Array<Array<string>>}
 */
export function GetSavedItem(Prefix, Name) {
  return new Promise((resolve, reject) => {
    let PositiveMods;
    let NegativeMods;
    let Items = GetLSSaves(Prefix);
    for (const key of Object.keys(Items)) {
      if (Name === key) {
        RemoveElementByClass("ModName");
        RemoveElementByClass("ExclusionMod");
        let MyStr = Items[key];
        MyStr = MyStr.replace("SaveIconName", "");
        let IconName = MyStr.slice(0, MyStr.indexOf("PositiveMods"));
        MyStr = MyStr.replace(IconName, "");
        MyStr = MyStr.replace("PositiveMods", "");

        PositiveMods = MyStr.split("NegativeMods").shift();
        NegativeMods = MyStr.split("NegativeMods").pop();
        resolve([PositiveMods, NegativeMods]);
        break;
      }
    }
    reject(new Error(`Couldnt find saved item: ${Name}`));
  });
}
export function ChangeLSSaves(Name, NewValue) {
  for (let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i);
    if (key === Name) {
      try {
        localStorage.setItem(key, NewValue);
      } catch (err) {
        console.error(`Error changing a save: ${err}`);
      }
    }
  }
}

/**
 *
 * @param {string} SaveName
 * @param {string} SaveString
 * // No reason to be this complex. was just training promises
 */
export function CreateLocalStorageSave(SaveName, SaveString) {
  return new Promise((resolve, reject) => {
    try {
      localStorage.setItem(SaveName, SaveString);
      const SavedItem = localStorage.getItem(SaveName);
      if (SavedItem === SaveString) {
        resolve(SavedItem);
      } else {
        let ErrorStr = new Error(`Error matching saved item: ${SavedItem}`);
        reject(ErrorStr);
      }
    } catch (err) {
      console.error(`Error saving item: ${err.message}`);
      reject(err);
    }
  });
}
