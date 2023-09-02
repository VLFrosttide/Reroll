import time
import sys
import pyautogui
import json
Convert = float(sys.argv[2])
class Essence:
    def __init__(self,Name,Coords,Side,Tier):
        self.Name = Name
        self.Coords = Coords
        self.Side = Side
        self.Tier = Tier
    def GetSide(self):
        return self.Side
    def GetName(self):
        return self.Name
    def GetCoords(self):
        return self.Coords
    def GetTier(self):
        return self.Tier
    def __str__(self):
        return f"{self.Name}, {self.Coords}, {self.Side},{self.Tier} "
EssenceList = []
object = json.loads(sys.argv[1])
for item, value in object.items():
    if "Name" in value:
        EssenceList.append(Essence(value["Name"],[int(int(value["Coords"][0])*Convert), int(int(value["Coords"][1])*Convert)] , value["Side"], "Deafening" ))
     
   
for item in EssenceList:   
    print(item.GetTier(), flush=True)
    print("awd", flush=True)
    print(item.GetCoords(), flush=True)
    pyautogui.moveTo(item.GetCoords())
    time.sleep(1)
    pyautogui.click(item.GetCoords())
    time.sleep(0.2)
    pyautogui.click(item.GetCoords())
