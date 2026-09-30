# SkillNet Promo

Editable source for a 26-second, 16:9 SkillNet promotional film. The film introduces SkillNet, SkillNet-Gym, and SkillNet-Fabric. On-screen copy is in English.

## Preview and edit

Open `film.html` in a current Chromium-based browser and press **Play**. Open `storyboard.html` to review eight representative frames. The storyboard loads frames directly from `film.html`; no pre-rendered screenshots are required.

- Edit scenes, copy, and timing in `film.html`.
- Edit the animated skill network in `network-v3.js`.
- Review the scene plan and content sources in `storyboard_plan.md`.

The HTML references only files in this repository. The preview does not require Python or a build step.

## Export

Install Python 3.10+ and then run:

```bash
python -m pip install -r requirements.txt
python -m playwright install chromium
python render_video.py
```

The last command writes `output/skillnet-promo.mp4` at 1920×1080, 60 fps. For a quick draft, run `python render_video.py --height 720 --fps 24`. Use `--silent` or `--audio path/to/music.mp3` to change the soundtrack. Export a static review frame with `python render_storyboard.py --slide 04`, or all eight with `python render_storyboard.py`. Generated files under `output/` are ignored by Git.

## Credits and assets

The SkillNet logo (`assets/brand/skillnet.png`) comes from the [ZJUNLP SkillNet repository](https://github.com/zjunlp/SkillNet). The cropped Fabric diagram (`assets/paper/fabric-routing.png`) comes from the [SkillNet technical report](https://arxiv.org/abs/2603.04448). The code is distributed under the repository's MIT `LICENSE`; that license does not replace the attribution or terms of third-party assets.

Music: **“Chill Upbeat Summer Vlog” by Music for Creators**, via the [Free Music Archive track page](https://freemusicarchive.org/music/fretbound/electronic-background-music/chill-upbeat-summer-vlog/), licensed [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). `assets/audio/chill-upbeat-promo-cut.mp3` is a 26-second excerpt with volume adjustment and fades. Keep this attribution when sharing the HTML, soundtrack, or exported video.

The terminal output in the film is an illustrative mockup of the public CLI format; it is not a recorded run. See `storyboard_plan.md` for the research basis behind each scene.
