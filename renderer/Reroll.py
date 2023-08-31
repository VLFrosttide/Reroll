import pyautogui
from Currency import CurrencyList
import pyperclip
import sys
from Essence import EssenceList
Rarity = None
Check = None
ItemName = sys.argv[1]
Mod = sys.argv[2].lower()
if (sys.argv[3]==""):
    MaxRerolls = 9999
else:
    MaxRerolls = int(sys.argv[3])
print(MaxRerolls,flush=True)
Counter = 0
def ItemPosition():
    if "essence" in ItemName.lower():
        return (540, 880)
    else:
        return (450, 600)

Coords = ItemPosition()
def Reroll():
    global Counter
    global Check
    while  True:
        pyautogui.leftClick()
        pyperclip.copy("")
        pyautogui.keyDown("ctrl")
        pyautogui.press("c")
        pyautogui.keyUp("ctrl") 
        Check = pyperclip.paste().lower()
        Counter = Counter+1
        if Mod in Check.lower():
            print("found")
            break
        if Counter>=MaxRerolls:
            print("Maximum number of rerolls reached", flush=True)
            break
        
def Tier(Name):
    if ("deafen" in Name.lower()):
        return stash_location[0]
    elif("shriek" in Name.lower()):
        if stash_location[1] == 0:
            x = stash_location[0][0] + 70
            y = stash_location[0][1] 
            return [x,y]
        else:
                x = stash_location[0][0] - 70
                y = stash_location[0][1] 
                return[x,y]
    elif("scream" in Name):
        if stash_location[1] == 0:
            x = stash_location[0][0] + 140
            y = stash_location[0][1] 
            return [x,y]
        else:
                x = stash_location[0][0] - 140
                y = stash_location[0][1]
                return[x,y]    
    

def find_stash_location(ItemName, CurrencyList, EssenceList):
    ItemName = ItemName.lower()   
    if ("essence" in ItemName):
        for essence in EssenceList:
            if NewItemName in essence.name.lower():
         
  
                return essence.StashLocation, essence.side
    else:
        for currency in CurrencyList:
            if currency.name.lower() == ItemName:
                return currency.StashLocation
    return None
SubStr = "Essence"
if ("essence" in ItemName):
    Index = ItemName.find(SubStr)   
    NewItemName = ItemName[Index:].lower()
    stash_location = find_stash_location(NewItemName, CurrencyList, EssenceList)
    EssenceTier = Tier(ItemName)
    pyautogui.moveTo(EssenceTier)
    pyautogui.rightClick(EssenceTier)

else: 
    stash_location = find_stash_location(ItemName, CurrencyList, EssenceList)
    pyautogui.moveTo(stash_location)
    pyautogui.rightClick(stash_location)





pyautogui.moveTo(Coords)
pyautogui.leftClick()
pyperclip.copy("")
pyautogui.keyDown("ctrl")
pyautogui.press("c")
pyautogui.keyUp("ctrl") 
Check = pyperclip.paste().lower()
lines = Check.splitlines()
for line in lines:
    if "rarity" in line:
        Rarity = line.replace("rarity:", "").strip()
        print(Rarity, flush=True) 
pyautogui.keyDown("shift")
Reroll()
pyautogui.keyUp("shift")




