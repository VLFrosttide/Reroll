import json
import sys
class EssenceTab:
    def __init__(self, Name, Coords):
        self.Name = Name
        self.Coords= Coords
    def GetName(self):
        return self.Name
    def  GetCoords(self):
        return  self.Coords
    def __str__(self):
        return f"{self.Name}, {self.Coords}"

EssenceTabCoords = None
object = sys.argv[1]
object = json.loads(object)
ConvertRate = float(sys.argv[2])
for  key,value in  object.items():
    if "Name" in value and "Coords" in value:
        EssenceTabCoords = (EssenceTab(  value["Name"], [int(int(value["Coords"][0])*ConvertRate), int(int(value["Coords"][1])*ConvertRate)]  ))
   
print(EssenceTabCoords)