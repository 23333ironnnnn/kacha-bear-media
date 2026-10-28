from PIL import Image, ImageDraw, ImageFilter
import numpy as np

src = Image.open('/tmp/kacha-wxmp/assets/mascot-src.jpg').convert('RGB')
a = np.asarray(src).astype(np.float32)
lum = a[..., 0] * 0.3 + a[..., 1] * 0.59 + a[..., 2] * 0.11
# 贴纸外圈是亮薄荷（lum≈180），外面的光晕往外渐暗；阈值取高一点，边缘干净
fg = Image.fromarray(((lum > 92) * 255).astype(np.uint8))
fg = fg.copy()
ImageDraw.floodfill(fg, (0, 0), 128)
inside = (np.asarray(fg) != 128).astype(np.float32)
alpha = Image.fromarray((inside * 255).astype(np.uint8)).filter(ImageFilter.MinFilter(9)).filter(ImageFilter.GaussianBlur(1.3))
al = np.clip((np.asarray(alpha).astype(np.float32) - 70) * 1.9, 0, 255).astype(np.uint8)
rgba = src.convert('RGBA')
rgba.putalpha(Image.fromarray(al))
bbox = rgba.getbbox()
rgba = rgba.crop(bbox)
rgba.save('/tmp/kacha-wxmp/assets/mascot-cut.png')
print('bbox', bbox, rgba.size)

for name, bg in [('mint', (166, 220, 195)), ('cream', (251, 244, 230))]:
    c = Image.new('RGBA', rgba.size, bg + (255,))
    c.alpha_composite(rgba)
    c.convert('RGB').resize((rgba.width // 2, rgba.height // 2)).save(f'/tmp/kacha-wxmp/_cutv3-{name}.jpg', quality=88)
