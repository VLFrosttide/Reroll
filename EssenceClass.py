import time
import sys
import pyautogui
import json
object = json.loads(sys.argv[1])
ConvertRate = float(sys.argv[2])
# ConvertRate = 1
print(object)
class Essence:
    def __init__(self,Name,Coords,Tier):
        self.Name = Name
        self.Coords = Coords
        self.Tier = Tier
    def GetName(self):
        return self.Name
    def GetCoords(self):
        return self.Coords
    def GetTier(self):
        return self.Tier
    def __str__(self):
        return f"{self.Name}, {self.Coords}, {self.Tier} "
EssenceList = []
for item, value in object.items():
    if "Name" in value:
        EssenceList.append(Essence(value["Name"],[int(int(value["Coords"][0])*ConvertRate), int(int(value["Coords"][1])*ConvertRate)] ,  value["Tier"]))
     
   
