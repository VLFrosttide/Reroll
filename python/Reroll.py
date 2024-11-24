import pyautogui
import time
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
    ExclusionModArray = sys.argv[7].split(",")
    ExclusionModArray = [item for item in ExclusionModArray if item]
    ExclusionModArray = [item for item in ExclusionModArray if item.strip()]
    SleepTimer = float(sys.argv[8])

    if (sys.argv[2]==""):   
        MaxRolls = 9999
    else:
        MaxRolls = int(sys.argv[2])
        
    CurrencyCoords = sys.argv[3].split(",")
    ModNums = [int(num) for s in ModArray for num in re.findall(r'\d+', s)]
    ModName = [re.sub(r'\d+', '', s) for s in ModArray]
    TabCoords = sys.argv[4].split(",")
    CraftMaterial = sys.argv[5]
    Fracture = sys.argv[6]
    if Fracture == "false":
        Fracture = False
    CurrencyCoords = (int(CurrencyCoords[0]), int(CurrencyCoords[1]))
    TabCoords = (int(TabCoords[0]),int(TabCoords[1]))
    if len(ModNums)>0:
        ModObject = dict(zip(ModName, ModNums))
        print("ModObject: ", ModObject)


    Counter = 0

    def Reroll():
        global Counter
        global Check
        global Check_lines
        stop = False
        while stop == False:
            time.sleep(SleepTimer)
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
            print("MyCounter: ", Counter,flush= True)
            for line in Check_lines:
                if Fracture:
                    if "fractured" in line:
                        continue

                for name in ModName:
                    if name.strip().lower() in line:
                        print("Found Line! " + line)
        
                        if len(ExclusionModArray)>0:
                            Exclusion = False
                            for ExclMod in ExclusionModArray:
                                if ExclMod in line:
                                    print("Found exclusion mod: ", line, flush=True)
                                    Exclusion = True
                                    break
                            if Exclusion:
                                print("Found mod, but exclusion triggered.")
                                continue
            
                        
                        if len(ModNums)>0:
                            NumberInLine = re.findall(r'\d+', line)  #[1,70]
                            NumberInLine = int(NumberInLine[-1])  #70
                            if NumberInLine is not None:
                                print("ModObject: ", ModObject)
                                if name in ModObject and NumberInLine >= ModObject[name]: 
                                    print("Stopped because of this!",flush= True)

                                    stop = True
                                    break
                                else: 
                                    print("Number was an issue")
                                    print(name in ModObject)
                                    print("Number in line: ", NumberInLine)
                                    print("ModObject: ", ModObject[name])
                                    continue
                        else: 
                            stop = True
                            break
                            
            
               
            if stop: 
                break             
            if Counter>=MaxRolls:
                print("Maximum number of rerolls reached", flush=True)
                break


    pyautogui.moveTo(CurrencyCoords)
    pyautogui.rightClick(CurrencyCoords)
    pyautogui.moveTo(TabCoords)
    
    pyautogui.keyDown("ctrl")
    pyautogui.press("c")
    pyautogui.keyUp("ctrl") 
    Check = pyperclip.paste().lower()
    print("CurrentBase: "+Check)
    lines = Check.splitlines()
    for line in lines:
        if "rarity" in line:
            Rarity = line.replace("rarity:", "").strip().lower()
            break

    
    pyperclip.copy("")
    if "essence" in CraftMaterial.lower():
        CraftMaterial = "essence"
    if CheckRarity(CraftMaterial,Rarity):
        Reroll()
    else: 
        print("RarityError")
    pyautogui.keyUp("shift")





except Exception as e:
    traceback.print_exc()
    print(f"Python Error: {str(e)}", file=sys.stderr)
    sys.exit(1)


