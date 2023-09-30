import pyautogui


x = 1715
y=825

for n in range(0,5):
    for i in range (0,10):
        pyautogui.moveTo(x,y)
        pyautogui.rightClick(x,y)
        pyautogui.moveTo(1575,825)
        pyautogui.click(1575,825)
    y = y+70