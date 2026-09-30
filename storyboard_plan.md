# SkillNet 宣传片：内容画幅、组网动画与品牌定格

目标：26 秒、16:9、全英文。内容画幅之间加入独立的全屏组网动画，片尾落到居中的品牌定格；分镜审阅器提供八个时间点。主线是 SkillNet 创建、评估并组织技能；Gym 用可执行任务检验技能使用；Fabric 面向具体任务整理相关技能。三者是技术报告的三个部分，不画成严格的串行运行流水线。

| 画幅 / 时间 | 中心 | 静态画面与动态动作 |
| --- | --- | --- |
| 01 / 0–2s | 记住 SkillNet 品牌 | 官方 Logo、名称、slogan、官网网址。快速淡入。 |
| 02 / 2–6.2s | 全屏展示技能如何成网 | 一份 `SKILL.md` 出现；镜头拉远，更多文件进入画面；每份文件沿自己的位置缩小成节点，两端节点显现后才连线，形成有机细网；成网后短暂停顿，约 4.7 秒起向右后方移动并虚化，直接接下一页。此段没有说明卡片遮挡。 |
| 03 / 6.2–10.2s | SkillNet 创建、评估并连接技能 | 网退到右后方后，依次出现输入、创建和质量筛选、关系网三段；右侧卡片用示意技能节点和连接线展示 `similar_to` 与 `compose_with`。静态定格保留完整流程。 |
| 04 / 10–14.2s | Gym 把技能图变成可执行测试 | 左侧以报告中的测序任务为例，依次显示技能链和 Instruction、Solution、Test script、Environment 四件测试材料；右侧明确列出 Construct、Retrieve、Compose 三类基准。动画展示的是 composition 示例，不把三类基准混成同一任务。 |
| 05 / 14–18.2s | Fabric 为任务构造局部 Wiki 并路由技能 | 完整保留报告中 task-specific Wiki 与 skill package 的原图局部，不在原图上叠加额外标签；左侧把任务拆为 Localize、Organize、Route，图下独立说明 Wiki 保存技能档案、关系与原始 `SKILL.md`，以及 Explorer 带理由地选出技能。 |
| 06 / 18–23s | 项目可以直接使用 | 左侧白色 macOS 风格终端。真实安装、search、analyze、route 命令约以原版 1.5 倍速度逐字输入，光标紧跟已输入的文字闪烁；输出只展示代码中可核对的表头与 JSON 结构。右侧给官网和 GitHub 入口。 |
| 07 / 22.8–24.5s | 展示生态规模并引导进一步了解 | 大号 `500K+ GitHub skills indexed`，三部分各用一行回顾功能，官网、GitHub 和技术报告入口；Logo 缩小到页眉。背景细网呼应开场。 |
| 08 / 24.3–26s | 用品牌画面结束 | 居中展示官方 Logo（内含 SkillNet 名称）、slogan 与官网网址。快速淡入后保持静止，直到视频结束。 |

画面复用一张报告原图，位于 `assets/paper/fabric-routing.png`。第 04 页的测试材料和测序任务取自[新版技术报告](https://arxiv.org/html/2603.04448)中的 Gym 机制与 composition 案例，并重画为适合短视频阅读的动画示意。第 02、03 页用原生动画说明技能如何组成网络。第 06 页命令和输出结构按仓库 `README.md`、`skillnet-ai/README.md` 与 `skillnet-ai/src/skillnet_ai/interfaces/cli.py` 核对；终端是示意画面，不表示已在本机完成搜索或路由运行。第 07 页的 `500K+` 采用仓库 README 于 2026-07-11 发布的技能库规模表述。

当前配乐及授权信息见 `README.md`。静态分镜在 `storyboard.html` 中直接读取 `film.html`；需要 PNG 或 MP4 时再用脚本导出，生成文件不纳入源码仓库。
