"use strict";
let ExampleCase = ``;
let DesiredModsArray = ["Evasion Rating", "Maximum Life"];
for (let i = 0; i < DesiredModsArray.length; i++) {
  DesiredModsArray[i] = DesiredModsArray[i].toLowerCase();
}

let Lines = ExampleCase.split("\n");
for (let i = 0; i < Lines.length; i++) {
  Lines[i] = Lines[i].toLowerCase();
}
let FoundMods = {};

DesiredModsArray.forEach((Mod) => {
  Lines.forEach((line) => {
    if (line.includes(Mod)) {
      let Rolls = [...line.matchAll(/\d+/g)].map((match) =>
        parseInt(match[0], 10)
      );
      // Find the maximum value in the Rolls array and assign it to FoundMods[Mod]
      FoundMods[Mod] = Math.max(...Rolls);
    }
  });
});
console.log(FoundMods);
