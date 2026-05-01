"""Generate a 1200x630 placeholder Open Graph image.

Paper background, italic serif title, courier tagline. Matches the
site's typographic identity. Save to public/og-default.png. The user
can replace this with a richer Canva/Figma export later.
"""

from PIL import Image, ImageDraw, ImageFont
from pathlib import Path
import re

OUT = Path(__file__).parent.parent / "public" / "og-default.png"
FAVICON = Path(__file__).parent.parent / "public" / "favicon.svg"

W, H = 1200, 630
PAPER = "#faf6ec"
INK = "#2a2420"
RED = "#b8000a"
DIVIDER = "#c4b89f"

TIMES = "/System/Library/Fonts/Times.ttc"
COURIER = "/System/Library/Fonts/Courier.ttc"


def font(path: str, size: int, index: int = 0) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(path, size, index=index)


def draw_dino(draw: ImageDraw.ImageDraw, target_w: int, target_h: int, anchor_x: int, anchor_y: int) -> None:
    """Render the favicon.svg pixel art onto the canvas at the given anchor (top-left)."""
    svg = FAVICON.read_text()
    vb_match = re.search(r'viewBox="0 0 (\d+) (\d+)"', svg)
    if not vb_match:
        raise SystemExit("favicon.svg viewBox not found")
    svg_w, svg_h = int(vb_match.group(1)), int(vb_match.group(2))
    scale_x = target_w / svg_w
    scale_y = target_h / svg_h
    rects = re.findall(r'<rect x="(\d+)" y="(\d+)" width="(\d+)" height="(\d+)"\s*/>', svg)
    for sx, sy, sw, sh in rects:
        x0 = anchor_x + int(int(sx) * scale_x)
        y0 = anchor_y + int(int(sy) * scale_y)
        x1 = anchor_x + int((int(sx) + int(sw)) * scale_x)
        y1 = anchor_y + int((int(sy) + int(sh)) * scale_y)
        # Clamp so degenerate rects (zero-width / zero-height after scaling) still render one pixel.
        x1 = max(x1, x0 + 1)
        y1 = max(y1, y0 + 1)
        draw.rectangle([(x0, y0), (x1 - 1, y1 - 1)], fill=INK)


def main() -> None:
    img = Image.new("RGB", (W, H), PAPER)
    draw = ImageDraw.Draw(img)

    # Top label
    label = font(COURIER, 22, 0)
    draw.text((80, 70), "~/catalina-torres", fill=INK, font=label)

    # Title — italic Times, large
    title_font = font(TIMES, 110, 3)  # 3 = italic
    draw.text((80, 180), "Catalina Torres", fill=INK, font=title_font)

    # Em-dash divider
    draw.rectangle([(80, 320), (200, 322)], fill=RED)

    # Tagline — italic Times, medium
    tagline_font = font(TIMES, 52, 3)
    draw.text((80, 350), "AI Solutions,", fill=INK, font=tagline_font)
    draw.text((80, 410), "built by an editor.", fill=INK, font=tagline_font)

    # Bottom: dashed divider + URL
    dash_y = H - 110
    for x in range(80, W - 80, 12):
        draw.rectangle([(x, dash_y), (x + 6, dash_y + 1)], fill=DIVIDER)

    url_font = font(COURIER, 24, 0)
    draw.text((80, H - 80), "catatorres.ca", fill=INK, font=url_font)

    # Bottom right: pixel-art dino sitting just above the dashed divider
    dino_w, dino_h = 120, 60
    draw_dino(draw, dino_w, dino_h, anchor_x=W - 80 - dino_w, anchor_y=dash_y - dino_h - 6)

    img.save(OUT, "PNG", optimize=True)
    print(f"wrote {OUT.relative_to(Path.cwd())} ({W}x{H})")


if __name__ == "__main__":
    main()
