import sys
import json

# object = sys.argv[1]
# ConvertRate = float(sys.argv[2])
# object = json.loads(object)
# print(object)
object = {'ChaosOrb': {'Name': 'ChaosOrb', 'Coords': ['647', '192']}, 'OrbofAlteration': {'Name': 'OrbofAlteration', 'Coords': ['748', '196']}}
ConvertRate = 1
class Currency:
    def __init__(self,Name, Coords, ) :
        self.Name = Name
        self.Coords = Coords
    def GetName(self):
        return self.Name
    def GetCoords(self):
        return self.Coords
    
    def __str__(self):
        return f"{self.Name}, {self.Coords}"
        
        
CurrencyList = []

for key,value in object.items():
    if "Name" in value and "Coords" in value:
        CurrencyList.append(Currency( value["Name"],   [int(value["Coords"][0])*ConvertRate, int(value["Coords"][1])*ConvertRate   ]   ))
        
        

for item in CurrencyList:
    print(item.GetName())