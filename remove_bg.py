from PIL import Image
import numpy as np

src = r'C:\Users\metal\.cursor\projects\c-dev-nefedov-tech\assets\c__Users_metal_AppData_Roaming_Cursor_User_workspaceStorage_6189786dfb7ca693161710121a09a35d_images_Name_ISHAKER__Logo_LogoOnlyIcon-2bef5046-9818-43d5-ba06-119c67aae675.png'
dst = r'c:\dev\nefedov.tech\sites\shaker-dev.ru\maket\logo-icon.png'

img = Image.open(src).convert('RGBA')
data = np.array(img, dtype=np.float32)

r, g, b, a = data[:,:,0], data[:,:,1], data[:,:,2], data[:,:,3]
# Pixels close to white → transparent (smooth falloff over 30 levels)
whiteness = np.minimum(r, np.minimum(g, b))
alpha_mask = np.clip((255 - whiteness) / 30, 0, 1)
data[:,:,3] = (a / 255.0) * alpha_mask * 255

result = Image.fromarray(data.astype(np.uint8))
result.save(dst)
print('Done', result.size)
