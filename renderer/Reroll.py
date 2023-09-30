import pyautogui
import pyperclip
import traceback
import time
import sys
Rarity = None
Check = None

try:
        
    ModName = sys.argv[1]
    MaxRolls = sys.argv[2]
    CurrencyCoords = sys.argv[3].split(",")
    TabCoords = sys.argv[4].split(",")
    CurrencyCoords = [int(CurrencyCoords[0]), int(CurrencyCoords[1])]
    TabCoords = [int(TabCoords[0]),int(TabCoords[1])]

    print(MaxRolls,type(MaxRolls),flush=True)

    if (sys.argv[2]==""):
        MaxRolls = 9999
    else:
        MaxRolls = int(sys.argv[2])
        
    Counter = 0

    def Reroll():
        global Counter
        global Check
        while  True:
            pyautogui.leftClick()
            pyperclip.copy("")
            pyautogui.keyDown("ctrl")
            pyautogui.press("c")
            pyautogui.keyUp("ctrl") 
            Check = pyperclip.paste().lower()
            Counter = Counter+1
            if ModName in Check.lower():
                print(Check, flush=True)
                break
            if Counter>=MaxRolls:
                print("Maximum number of rerolls reached", flush=True)
                break
            
        
    pyautogui.moveTo(CurrencyCoords)
    pyautogui.rightClick(CurrencyCoords)

    pyautogui.moveTo(TabCoords)
    
    pyautogui.keyDown("shift")
    pyautogui.click(TabCoords)
    pyperclip.copy("")
    pyautogui.keyDown("ctrl")
    pyautogui.press("c")
    pyautogui.keyUp("ctrl") 
    Check = pyperclip.paste().lower()
    lines = Check.splitlines()
    for line in lines:
        if "rarity" in line:
            Rarity = line.replace("rarity:", "").strip()
            print(Rarity, flush=True) 
    Reroll()
    pyautogui.keyUp("shift")





except Exception as e:
    # Print the error message to stderr
    traceback.print_exc()

    print(f"Python Error: {str(e)}", file=sys.stderr)
    # Exit with a non-zero status code to indicate an error
    sys.exit(1)

