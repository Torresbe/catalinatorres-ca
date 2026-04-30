"""Trace a black-on-white pixel-art image into a single-color SVG.

Reads a source JPG/PNG, crops to the bounding box of the dark pixels,
resizes to a target grid using nearest-neighbor (preserves pixel-art
edges), thresholds to B&W, and emits an SVG with one <rect> per dark
pixel (runs of consecutive dark pixels in a row are merged).
"""

from PIL import Image, ImageFilter
import sys
from pathlib import Path

SRC = Path(__file__).parent.parent / "LOGO" / "trex1.jpg"
OUT = Path(__file__).parent.parent / "public" / "favicon.svg"

# Target grid — wider than tall to fit dino + laptop scene
TARGET_W = 128
TARGET_H = 64
THRESHOLD = 128  # 0-255; below = dark


def load_and_crop(path: Path) -> Image.Image:
    img = Image.open(path).convert("L")
    # Threshold first so JPG compression noise doesn't survive
    bw = img.point(lambda p: 0 if p < THRESHOLD else 255).convert("L")
    # Morphological cleanup at full resolution:
    # - close (max then min) fills tiny gaps inside shapes
    # - open (min then max) removes speckle/noise outside shapes
    cleaned = bw.filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.MinFilter(3))
    cleaned = cleaned.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.MaxFilter(3))
    # Crop to bbox of dark content
    inverted = cleaned.point(lambda p: 255 - p)
    bbox = inverted.getbbox()
    if bbox is None:
        raise SystemExit("no dark pixels found")
    return cleaned.crop(bbox)


def to_grid(img: Image.Image, w: int, h: int) -> list[list[bool]]:
    # Preserve aspect ratio, pad with white
    src_w, src_h = img.size
    scale = min(w / src_w, h / src_h)
    new_w = int(src_w * scale)
    new_h = int(src_h * scale)
    resized = img.resize((new_w, new_h), Image.NEAREST)
    canvas = Image.new("L", (w, h), 255)
    canvas.paste(resized, ((w - new_w) // 2, (h - new_h) // 2))
    return [
        [canvas.getpixel((x, y)) < THRESHOLD for x in range(w)]
        for y in range(h)
    ]


def grid_to_svg(grid: list[list[bool]], w: int, h: int) -> str:
    parts = [
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" shape-rendering="crispEdges">',
        '  <g fill="#2a2420">',
    ]
    for y, row in enumerate(grid):
        x = 0
        while x < w:
            if not row[x]:
                x += 1
                continue
            run_start = x
            while x < w and row[x]:
                x += 1
            run_len = x - run_start
            parts.append(f'    <rect x="{run_start}" y="{y}" width="{run_len}" height="1"/>')
    parts.append("  </g>")
    parts.append("</svg>")
    return "\n".join(parts) + "\n"


def main() -> None:
    if not SRC.exists():
        raise SystemExit(f"source not found: {SRC}")
    img = load_and_crop(SRC)
    grid = to_grid(img, TARGET_W, TARGET_H)
    svg = grid_to_svg(grid, TARGET_W, TARGET_H)
    OUT.write_text(svg)
    dark = sum(1 for row in grid for c in row if c)
    print(f"wrote {OUT.relative_to(Path.cwd())} ({TARGET_W}x{TARGET_H}, {dark} dark pixels)")


if __name__ == "__main__":
    main()
