#!/usr/bin/env python3
"""Prepare approved individual LINE stickers. Requires Pillow; never removes backgrounds."""
import argparse, json, sys, zipfile
from pathlib import Path
from PIL import Image

def load(path):
    with Image.open(path) as im:
        if im.format != "PNG" or im.mode != "RGBA":
            raise ValueError(f"{path.name}: PNG RGBA required; RGB/checkerboard backgrounds rejected")
        image = im.copy()
    a = image.getchannel("A")
    if a.getextrema()[0] != 0 or a.getbbox() is None:
        raise ValueError(f"{path.name}: transparent background required")
    w, h = image.size
    if any(a.getpixel((x, y)) for x in range(w) for y in (0, h-1)) or any(a.getpixel((x, y)) for y in range(h) for x in (0, w-1)):
        raise ValueError(f"{path.name}: content touches edge; may be clipped")
    return image

def fit(image, size, margin):
    art = image.crop(image.getchannel("A").getbbox())
    scale = min((size[0]-2*margin)/art.width, (size[1]-2*margin)/art.height, 1)
    dims = (max(1, int(art.width*scale)), max(1, int(art.height*scale)))
    if dims != art.size:
        art = art.resize(dims, Image.Resampling.LANCZOS)
    out = Image.new("RGBA", size, (0,0,0,0))
    out.alpha_composite(art, ((size[0]-dims[0])//2, (size[1]-dims[1])//2))
    b = out.getchannel("A").getbbox()
    margins = [b[0], b[1], size[0]-b[2], size[1]-b[3]]
    if min(margins) < margin:
        raise ValueError(f"insufficient margin: {margins}")
    return out, margins

def main():
    p = argparse.ArgumentParser()
    p.add_argument("input", type=Path, help="folder containing only approved 01.png..24.png")
    p.add_argument("output", type=Path, help="new empty output folder")
    p.add_argument("--margin", type=int, default=14)
    p.add_argument("--main-from", type=int, default=1)
    p.add_argument("--tab-from", type=int, default=1)
    args = p.parse_args()
    if not 12 <= args.margin <= 40 or not 1 <= args.main_from <= 24 or not 1 <= args.tab_from <= 24:
        p.error("invalid margin or thumbnail index")
    if args.output.exists() and any(args.output.iterdir()):
        p.error("output must be empty; overwriting is prohibited")
    expected = {f"{i:02d}.png" for i in range(1,25)}
    actual = {x.name for x in args.input.iterdir() if x.is_file()}
    if expected != actual:
        p.error(f"expected exactly 01.png..24.png; missing={sorted(expected-actual)} extra={sorted(actual-expected)}")
    originals = {i: load(args.input / f"{i:02d}.png") for i in range(1,25)}
    results, report = {}, {}
    for i in range(1,25):
        name = f"{i:02d}.png"
        results[name], margins = fit(originals[i], (370,320), args.margin)
        report[name] = {"size":[370,320], "mode":"RGBA", "margins":margins}
    for name, idx, size in (("main.png",args.main_from,(240,240)), ("tab.png",args.tab_from,(96,74))):
        results[name], margins = fit(originals[idx], size, 12)
        report[name] = {"size":list(size), "mode":"RGBA", "margins":margins, "source":f"{idx:02d}.png"}
    args.output.mkdir(parents=True, exist_ok=True)
    for name, image in results.items():
        image.save(args.output / name, format="PNG", optimize=True)
    with zipfile.ZipFile(args.output / "line-stickers-26.zip", "w", compression=zipfile.ZIP_DEFLATED) as z:
        for name in sorted(results):
            z.write(args.output / name, arcname=name)
    (args.output / "validation.json").write_text(json.dumps({"count":len(results),"files":report}, ensure_ascii=False, indent=2), encoding="utf-8")
    print("PASS: 26 independent PNGs prepared; visual review still required")

if __name__ == "__main__":
    try:
        main()
    except (ValueError, OSError) as e:
        print(f"FAIL: {e}", file=sys.stderr)
        sys.exit(1)
