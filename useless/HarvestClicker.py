import pyautogui
from pynput.keyboard import Key, Listener
import time
def Click():
    def run(key):
        if key == Key.space:
            pyautogui.moveTo(1275,815)
            pyautogui.click(1275,815)
            # time.sleep(0.3)
            pyautogui.moveTo(1275,615)
            pyautogui.keyDown("alt")
  
    with Listener(on_press = run) as listener:  
        listener.join()

Click()  