import pyautogui


x = 1715
y=825
pyautogui.moveTo(1750,500)
pyautogui.click(1750,500)
for n in range(0,5):
    for i in range (0,10):
        pyautogui.moveTo(x,y)
        pyautogui.rightClick(x,y)
        pyautogui.moveTo(1005,855)
        pyautogui.click(1005,855)
    y = y+70