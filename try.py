from Essence import EssenceList
from Currency import CurrencyList
import pyautogui
ItemName = "ShriekingEssenceOfZeal"
SubStr = "Essence"
Index = ItemName.find(SubStr)   

NewItemName = ItemName[Index:].lower()

def find_stash_location(ItemName, CurrencyList, EssenceList):
    ItemName = ItemName.lower()   
    if ("essence" in ItemName):
        for essence in EssenceList:
            if NewItemName in essence.name.lower():
         
                # print(f"x: {x}, y: {y}") 
  
                return essence.StashLocation, essence.side
    else:
        for currency in CurrencyList:
            if currency.name.lower() == ItemName:
                return currency.StashLocation
    return None

stash_location = find_stash_location(ItemName, CurrencyList, EssenceList)

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

EssenceTier = Tier(ItemName.lower())
print(EssenceTier)
pyautogui.moveTo(EssenceTier)