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
    if (key.startsWith(Prefix)) {
      let value = localStorage.getItem(key);
      Items[key] = value;
    }
  }
  return Items;
}
export function ChangeLSSaves(Name, NewValue) {
  for (let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i);
    if (key.includes(Name)) {
      localStorage.setItem(key, NewValue);
      console.log("NewLSValue: ", localStorage.getItem(key));
    }
  }
}
