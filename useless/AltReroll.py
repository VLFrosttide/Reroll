import pyautogui
from Currency import CurrencyList
import pyperclip
import time
import sys
from Essence import EssenceList

ItemName = sys.argv[1]
# ItemName = "ChaosOrb"


def Click():
    
    if "essence" in ItemName.lower():
        pyautogui.moveTo(540,880)
        pyautogui.click(540,880)
    else:
        pyautogui.moveTo(450,600)
        pyautogui.click(450, 600)
    pyautogui.keyDown("ctrl")
    pyautogui.press("c")
    pyautogui.keyUp("ctrl") 

def find_stash_location(ItemName, CurrencyList, EssenceList):
    CombinedList = CurrencyList + EssenceList
    for currency in CombinedList:
        if currency.name.lower() == ItemName.lower():
            return currency.StashLocation
    return None

stash_location = find_stash_location(ItemName, CurrencyList, EssenceList)

pyautogui.moveTo(stash_location)
pyautogui.rightClick(stash_location)
# pyautogui.keyDown("shift")

pyperclip.copy("")

Click()



print(pyperclip.paste().lower(), flush=True)

     