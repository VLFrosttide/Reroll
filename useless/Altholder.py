import pyautogui
from pynput.keyboard import Key, Listener

def Click():
    keys_down = False  # State variable to track whether keys are down

    def run(key):
        nonlocal keys_down
        if key == Key.space:
            if keys_down:
                pyautogui.keyUp("shift")
                pyautogui.keyUp("alt")
                keys_down = False
            else:
                pyautogui.keyDown("shift")
                pyautogui.keyDown("alt")
                keys_down = True

    with Listener(on_press=run) as listener:
        listener.join()

Click()
  