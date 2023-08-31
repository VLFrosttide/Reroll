import pyautogui
import time
# 1720 / 810 chance
# 1860 / 810  scour

# 1800/860 flask
pyautogui.click(1800,620)
time.sleep(0.5)
for i in range(0,10):
    pyautogui.moveTo(1720,810)
    pyautogui.rightClick(1720,810)
    
    pyautogui.moveTo(1800,860)
    pyautogui.click(1800,860)
    
    pyautogui.moveTo(1860,810)
    pyautogui.rightClick(1860,810)
    
    pyautogui.moveTo(1800,860)
    pyautogui.click(1800,860)