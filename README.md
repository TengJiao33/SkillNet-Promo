# SkillNet Promo

SkillNet 的 **26 秒、16:9 宣传片可编辑工程**。视频画面使用英文，内容依次介绍 SkillNet、SkillNet-Gym 和 SkillNet-Fabric，最后以居中的 Logo、名称和 slogan 定格。工程以 HTML/CSS/JS 制作，无需视频编辑软件即可修改画面、动画和文案。

## 先看什么

```text
film.html                 完整动画与播放控制；主要编辑入口
network-v3.js             技能文件缩成节点、节点连成网及背景网动画
storyboard.html           八个关键时间点的静态审阅页
storyboard_plan.md        每幕的中心、时间和内容依据
assets/brand/             SkillNet Logo
assets/paper/             Fabric 场景使用的技术报告配图
assets/audio/             26 秒配乐剪辑
render_video.py           从 HTML 时间轴导出 MP4
render_storyboard.py      导出单张或全部分镜 PNG
requirements.txt          导出脚本的 Python 依赖
```

**仓库不包含成片。** 导出后的视频路径为 `output/skillnet-promo.mp4`；新克隆的仓库里不会预先存在这个文件。`output/` 被 Git 忽略，避免将每次修改产生的视频和截图上传。

## 预览

1. 克隆仓库，进入 `SkillNet-Promo` 目录：

   ```bash
   git clone https://github.com/TengJiao33/SkillNet-Promo.git
   cd SkillNet-Promo
   ```

2. 用 Chromium、Chrome 或 Edge 打开 `storyboard.html`，逐幕查看八个关键画面。点击左侧条目后，右侧会直接加载 `film.html` 的对应时刻，**不依赖预先导出的 PNG**。
3. 打开 `film.html`，点击 **Play** 观看带配乐的完整 26 秒动画；下方滑块可定位时间点。

直接打开本地 HTML 即可预览，不需要先安装 Python、启动网站服务或执行构建。改完源码后刷新浏览器即可看到新画面。

## 修改画面和时间

- **文案、布局、颜色、转场**：编辑 `film.html`。CSS 在文件顶部；每幕是一个 `<section class="scene …">`，`data-start` 和 `data-end` 使用**毫秒**。下方的 `renderAt(ms)` 及 `animate…` 函数根据时间计算动画状态，因此拖动进度条和逐帧导出会得到相同画面。
- **技能组成网络的动画**：编辑 `network-v3.js`。开场文件到节点的过渡、连线、退到右后方及后续漂浮网都在这里绘制。
- **分镜时间点与名称**：编辑 `storyboard.html` 中的 `shot-data` JSON；再同步 `storyboard_plan.md`。分镜页显示的是指定时刻的画面，并不决定正片的播放时长。
- **片尾品牌定格**：在 `film.html` 中搜索 `scene endcard`。它从 24.3 秒开始，保持到视频终点；其 `data-end="27000"` 故意超过 26 秒，使 `renderAt(26000)` 仍显示品牌画面。Logo 图片本身已包含 SkillNet 名称。

目前视频总时长固定为 **26 秒**。若要改总时长，需要一并调整 `film.html` 中的 `duration`、进度条的 `max` 和时间显示，`render_video.py` 中的 `DURATION_MS`，各幕及分镜时间点，以及配乐长度。

## 导出 MP4 或 PNG

需要 Python 3.10+。在仓库根目录运行：

```bash
python -m pip install -r requirements.txt
python -m playwright install chromium
python render_video.py
```

默认导出 **1920×1080、60 fps、H.264 MP4，含配乐**，写入 `output/skillnet-promo.mp4`。再次运行会覆盖同名视频，不会累积版本文件。低成本预览可用：

```bash
python render_video.py --height 720 --fps 24
```

导出静音版或更换配乐：

```bash
python render_video.py --silent
python render_video.py --audio path/to/another-track.mp3
```

导出一张分镜 PNG（例：第 08 幕）或全部八张：

```bash
python render_storyboard.py --slide 08
python render_storyboard.py
```

PNG 写入 `output/storyboard/`。导出工具调用 Playwright 的 Chromium 和 `imageio-ffmpeg`；第一次运行需要安装上述依赖。MP4 是逐帧渲染，正式的 1080p／60 fps 导出会比浏览器预览慢。

## 内容与素材来源

画面中的终端是依据公开 CLI 形式制作的**示意动画**，并非录屏或某次真实任务的执行结果。`500K+` 沿用项目 README 中的规模表述，若未来数据更新，应核对后再修改。各幕的技术依据见 [`storyboard_plan.md`](storyboard_plan.md)。

- Logo：来自 [ZJUNLP/SkillNet](https://github.com/zjunlp/SkillNet)。
- Fabric 配图：取自 [SkillNet 技术报告](https://arxiv.org/abs/2603.04448)，在视频中使用其可读局部。
- 配乐：**“Chill Upbeat Summer Vlog” by Music for Creators**，来自 [Free Music Archive 曲目页](https://freemusicarchive.org/music/fretbound/electronic-background-music/chill-upbeat-summer-vlog/)，采用 [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) 许可。仓库内音频是原曲前 26 秒的剪辑，调整了音量并做了淡入淡出。分享 HTML、音频或导出视频时，请保留曲目、作者、来源、许可及修改说明。

代码采用仓库中的 MIT [`LICENSE`](LICENSE)；素材的署名与使用条件仍按各自来源执行。
