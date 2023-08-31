import re
import pyperclip
import time
import pyautogui
Mod = "Explode"
CurrencyItemsUsed = 0
ItemName = "DeafeningEssenceofTorment"


Check = """Item Class: Jewels
Rarity: Magic
Notable Large Cluster Jewel of Significance
--------
Item Level: 83
--------
Adds 10 Passive Skills (enchant)
Explode
2 Added Passive Skills are Jewel Sockets (enchant)
Added Small Passive Skills grant: Wand Attacks deal 12% increased Damage with Hits and Ailments (enchant)
--------
1 Added Passive Skill is Drive the Destruction
1 Added Passive Skill is Smite the Weak
--------
Place into an allocated Large Jewel Socket on the Passive Skill Tree. Added passives do not interact with jewel radiuses. Right click to remove from the Socket.


"""
import re

Mod = Mod.lower()
Check = Check.lower()
print(Mod)
if Mod in Check.lower():
    # for line in Check.split('\n'):
    #     if Mod in line:
    #         print("found it ")
    #         mod_parts = Mod.split(" ", 1)
    #         if len(mod_parts) > 1:
    #             mod_to_search = re.escape(mod_parts[1])
    #             match = re.search(rf'(\d+)(?:\s+to\s+(\d+))?\s+{mod_to_search}$', line, re.IGNORECASE)
    #             print(match)
    #             if match:
                    print("matchdddddd")
                    # Roll = int(match.group(1))
                    # if Roll >= MinRoll:
                    # print("Currency Items Used:", CurrencyItemsUsed, ItemName)
                    # print(f"{Mod}")
                    Found = True
