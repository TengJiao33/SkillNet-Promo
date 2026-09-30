"""Render the deterministic HTML timeline to a reviewable MP4."""

from __future__ import annotations

import argparse
import subprocess
from pathlib import Path

import imageio_ffmpeg
from playwright.sync_api import sync_playwright


ROOT = Path(__file__).resolve().parent
DURATION_MS = 26_000
def render_video(page, target: Path, fps: int, music: Path | None) -> None:
    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    rendering = target.with_name(f"{target.stem}.rendering{target.suffix}")
    cmd = [
        ffmpeg,
        "-y",
        "-loglevel",
        "error",
        "-f",
        "image2pipe",
        "-vcodec",
        "mjpeg",
        "-r",
        str(fps),
        "-i",
        "pipe:0",
    ]
    if music is not None:
        cmd.extend(["-i", str(music)])
    cmd.extend([
        "-c:v",
        "libx264",
        "-preset",
        "fast",
        "-crf",
        "18",
        "-pix_fmt",
        "yuv420p",
    ])
    if music is not None:
        cmd.extend(["-c:a", "aac", "-b:a", "192k", "-shortest"])
    cmd.append(str(rendering))
    with subprocess.Popen(cmd, stdin=subprocess.PIPE) as process:
        assert process.stdin is not None
        try:
            for frame in range(DURATION_MS * fps // 1000):
                page.evaluate("ms => window.renderAt(ms)", frame * 1000 / fps)
                process.stdin.write(page.locator("#stage").screenshot(type="jpeg", quality=95))
                if frame % fps == 0:
                    print(f"Rendered {frame // fps:02d}/{DURATION_MS // 1000}s", flush=True)
        finally:
            process.stdin.close()
        result = process.wait()
    if result:
        raise RuntimeError(f"ffmpeg failed with exit code {result}")
    rendering.replace(target)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--fps", type=int, default=60)
    parser.add_argument("--height", type=int, choices=(720, 1080, 1440), default=1080)
    audio_options = parser.add_mutually_exclusive_group()
    audio_options.add_argument("--audio", type=Path, help="Use a different soundtrack")
    audio_options.add_argument("--silent", action="store_true", help="Export without music")
    args = parser.parse_args()
    output = ROOT / "output"
    output.mkdir(exist_ok=True)
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1400, "height": 860}, device_scale_factor=args.height / 720)
        page.goto((ROOT / "film.html").as_uri(), wait_until="load")
        page.evaluate("document.fonts.ready")
        page.add_style_tag(content="#viewport{width:1280px!important;height:720px!important}#controls{display:none!important}")
        page.evaluate("window.dispatchEvent(new Event('resize'))")
        # Keep the animated mesh at its 1600x900 design resolution. The
        # DOM text and figures still rasterize at the requested video size.
        page.evaluate("""() => {
            const canvas = document.getElementById('network');
            canvas.width = 1600;
            canvas.height = 900;
            canvas.getContext('2d').setTransform(1, 0, 0, 1, 0, 0);
        }""")
        default_music = ROOT / "assets/audio/chill-upbeat-promo-cut.mp3"
        music = None if args.silent else args.audio or default_music
        if music is not None and not music.is_file():
            raise FileNotFoundError(music)
        render_video(page, output / "skillnet-promo.mp4", args.fps, music)
        browser.close()


if __name__ == "__main__":
    main()
