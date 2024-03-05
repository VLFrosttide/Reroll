import pyautogui
import sys
import time
ItemCoords = [440,610]
ItemName = sys.argv[1]
def Augment():
    pyautogui.moveTo(300,440)
    pyautogui.rightClick()
    pyautogui.moveTo(ItemCoords)
    pyautogui.leftClick()
    
    
def Scour():
    pyautogui.moveTo(575,690)
    pyautogui.rightClick()
    pyautogui.moveTo(ItemCoords)
    pyautogui.leftClick()
    
def Regal():
    pyautogui.moveTo(575,360)
    pyautogui.rightClick()
    pyautogui.moveTo(ItemCoords)
    pyautogui.leftClick()
def Annul(): 
    pyautogui.moveTo(220,360)
    pyautogui.rightClick()
    pyautogui.moveTo(ItemCoords)
    pyautogui.leftClick()

def Transmute(): 
    pyautogui.moveTo(70,370)
    pyautogui.rightClick()
    pyautogui.moveTo(ItemCoords)
    pyautogui.leftClick()
    
FunctionArray = {
    "Augment" : Augment,
    "Scour" : Scour,
    "Regal": Regal,
    "Annul" : Annul,
    "Transmute" : Transmute
}

FunctionArray[ItemName]()