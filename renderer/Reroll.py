import pyautogui
import pyperclip
import sys
import traceback
import re 
Rarity = None
Check = None
pyperclip.copy("")
Orbs = {
    "OrbofAlteration": "magic",
    "ChaosOrb": "rare",
    "essence" : "rare"
}
def CheckRarity(Mats, Rarity):
    if Rarity == Orbs[Mats]:
        return True
    else:
        return False


try:
    ModArray = sys.argv[1].split(",")
    if (sys.argv[2]==""):   
        MaxRolls = 9999
    else:
        MaxRolls = int(sys.argv[2])
        
    CurrencyCoords = sys.argv[3].split(",")
    ModNums = [int(num) for s in ModArray for num in re.findall('\d+', s)]
    ModName = [re.sub('\d+', '', s) for s in ModArray]
    TabCoords = sys.argv[4].split(",")
    CraftMaterial = sys.argv[5]
    Fracture = sys.argv[6]
    
    CurrencyCoords = (int(CurrencyCoords[0]), int(CurrencyCoords[1]))
    TabCoords = (int(TabCoords[0]),int(TabCoords[1]))
    if len(ModNums)>0:
        ModObject = dict(zip(ModName, ModNums))
        print(ModObject)
    print(CurrencyCoords,  flush=True)
    print(TabCoords, flush=True)
    print(ModNums, flush=True)
    print(CraftMaterial)


    Counter = 0

    def Reroll():
        global Counter
        global Check
        global Check_lines
        stop = False
        while stop == False:
            pyautogui.keyDown("shift")

            pyautogui.click()
            pyperclip.copy("")
            pyautogui.keyDown("ctrl")
            pyautogui.press("c")
            pyautogui.keyUp("ctrl") 
            Check = pyperclip.paste().lower()
            Check_lines = Check.split('\n')

            if Check == "":
                print("Item Not Found")
                break
            Counter = Counter+1
            if len(ModNums)>0:    
                for line in Check_lines:
                    if Fracture and "fractured" in line:
                        continue
                    for name in ModName:
                        if name in line:
                            match = re.search('\d+', line)
                            if match is not None:
                                number = int(match.group())
                                if name in ModObject and number >= ModObject[name]: 
                                    stop = True              
                                    break
                if Counter>=MaxRolls:
                    print("Maximum number of rerolls reached", flush=True)
                    break
            else:
                if any(name in Check for name in ModName):
                    print(Check, flush=True)
                    pyautogui.keyUp("shift")
                    stop = True

    pyautogui.moveTo(CurrencyCoords)
    pyautogui.rightClick(CurrencyCoords)
    pyautogui.moveTo(TabCoords)
    
    pyautogui.keyDown("ctrl")
    pyautogui.press("c")
    pyautogui.keyUp("ctrl") 
    Check = pyperclip.paste().lower()
    lines = Check.splitlines()
    for line in lines:
        if "rarity" in line:
            Rarity = line.replace("rarity:", "").strip()
            print(Rarity, flush=True) 
    
    pyperclip.copy("")
    if "essence" in CraftMaterial.lower():
        CraftMaterial = "essence"
    if CheckRarity(CraftMaterial,Rarity):
        Reroll()
    else: 
        print("Rarity Does Not Match!",  flush=True)
    pyautogui.keyUp("shift")





except Exception as e:
    traceback.print_exc()
    print(f"Python Error: {str(e)}", file=sys.stderr)
    sys.exit(1)

