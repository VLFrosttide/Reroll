import pyautogui
import pyperclip
import sys
import traceback
import re
import time
Rarity = None
Check = None
pyperclip.copy("")
# lst = ['sawdtr5', 'life8', 'abc123', 'xyz456']
# numbers = [int(num) for s in lst for num in re.findall('\d+', s)]
# ModName  = [re.sub('\d+', '', s) for s in lst]
# dic = dict(zip(ModName, numbers))
# print(dic)
# Check = Check.lower()
# Check_lines = Check.split('\n')
Orbs = {
    "OrbofAlteration": "magic",
    "ChaosOrb": "rare"
}
def CheckRarity(Mats, Rarity):
    if Rarity == Orbs[Mats]:
        return True
    else:
        return False


try:
    ModArray = sys.argv[1].split(",")
    ModNums = [int(num) for s in ModArray for num in re.findall('\d+', s)]
    ModName = [re.sub('\d+', '', s) for s in ModArray]
    print(ModNums, flush=True)
    if len(ModNums)>0:
        ModObject = dict(zip(ModName, ModNums))
        print(ModObject)
    CurrencyCoords = sys.argv[3].split(",")
    TabCoords = sys.argv[4].split(",")
    print(CurrencyCoords,  flush=True)
    print(TabCoords, flush=True)
    CurrencyCoords = [int(CurrencyCoords[0]), int(CurrencyCoords[1])]
    TabCoords = [int(TabCoords[0]),int(TabCoords[1])]
    CraftMaterial = sys.argv[5]
    print(CraftMaterial)

    if (sys.argv[2]==""):
        MaxRolls = 9999
    else:
        MaxRolls = int(sys.argv[2])
        
    Counter = 0

    def Reroll():
        global Counter
        global Check
        global Check_lines
        stop = False
        while stop == False:
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
                    stop = True

    pyautogui.moveTo(CurrencyCoords)
    pyautogui.rightClick(CurrencyCoords)
    pyautogui.moveTo(TabCoords)
    
    pyautogui.keyDown("shift")
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
    if CheckRarity(CraftMaterial,Rarity):
        Reroll()
    else: 
        print("Rarity Does Not Match!",  flush=True)
    pyautogui.keyUp("shift")





except Exception as e:
    # Print the error message to stderr
    traceback.print_exc()

    print(f"Python Error: {str(e)}", file=sys.stderr)
    # Exit with a non-zero status code to indicate an error
    sys.exit(1)

