# Indirect reciprocity with inertial reputation updating

本仓库汇集了关于**具有惯性声誉更新的间接互惠**的模型说明、数值计算、数据与论文图表。模型研究个体如何在私人声誉判断下，根据行为及社会规范更新对他人的评价，以及声誉惯性如何影响合作与策略演化。

## 从哪里开始

1. 阅读 [Model.md](代码与图/Model.md)，了解模型假设、声誉状态、社会规范和动力学定义。
2. 根据下表进入对应图表包，先读其中的 `Results_*.md` 和 `README.md`：前者解释图表及结果，后者说明数据、计算设置和复现范围。
3. 在相应目录中查看 Jupyter notebook、`data/`、`figures/` 和 `validation/`。各包的 `manifest.csv` 记录文件清单及校验信息。

| 图表 | 内容 | 入口 |
|---|---|---|
| Figure 2、Extended Data Figure 1 | 声誉矩阵、惯性深度与识别分析 | [目录](代码与图/Fig2%20%26%20ED_Fig1/) · [结果说明](代码与图/Fig2%20%26%20ED_Fig1/Results_Figure2_and_ED1.md) · [运行说明](代码与图/Fig2%20%26%20ED_Fig1/README.md) |
| Figure 3、Extended Data Figures 2–5 | 策略单纯形动力学、声誉、合作及入侵分析 | [目录](代码与图/Fig3%20%26%20ED_Fig2-5/) · [结果说明](代码与图/Fig3%20%26%20ED_Fig2-5/Results_Figure3_and_ED2_to_ED5.md) · [运行说明](代码与图/Fig3%20%26%20ED_Fig2-5/README.md) |
| Figure 4、Extended Data Figure 6 | 总深度、深度分配与合作 | [目录](代码与图/Fig4%20%26%20ED_Fig6/) · [结果说明](代码与图/Fig4%20%26%20ED_Fig6/Results_Figure4_and_ED6.md) · [运行说明](代码与图/Fig4%20%26%20ED_Fig6/README.md) |
| Figure 5、Extended Data Figure 7 | 机会主义策略入侵与合作 | [目录](代码与图/Fig5%20%26%20ED_Fig7/) · [结果说明](代码与图/Fig5%20%26%20ED_Fig7/Results_Figure5_and_ED7.md) · [运行说明](代码与图/Fig5%20%26%20ED_Fig7/README.md) |

## 运行与复现

各图表包使用 Python 3.11，并分别提供 `requirements.txt`。在所需图表包的目录下安装依赖，在已有的 Jupyter 环境中打开对应 notebook，按顺序运行单元格。例如：

```bash
cd '代码与图/Fig2 & ED_Fig1'
python -m pip install -r requirements.txt
```

Notebook 默认读取随仓库提供的数据；图表导出为 PDF 和 SVG。完整参数扫描或模拟需要在 notebook 中显式启用相应重算选项，可能耗时较长，并可能写入现有数据或输出目录。重算前请先备份，并查阅对应包的运行说明和验证记录。

## 使用结果时的注意事项

- Figure 3 和 Extended Data Figures 2–5 包含有科学意义的数值修正；复用早期图表或描述前，请阅读 [NUMERICAL_CHANGES.md](代码与图/Fig3%20%26%20ED_Fig2-5/NUMERICAL_CHANGES.md)。
- Figure 4 的部分条件是有记录的重算，完整深度扫描并未全部重跑；验证门槛及其限制见该包的 README。
- Figure 5 和 Extended Data Figure 7 检验的是所定义的 IID 机会主义 O-DISC 策略族；对该策略族的抵抗性不能直接推广为对所有突变策略的抵抗性。

## 给新对话的建议

向新对话提供本仓库链接，并指出希望讨论的图表或问题。建议先让对话读取 `Model.md`，再读取对应图表包的 `Results_*.md`、`README.md` 及必要的 notebook、数据和验证文件；涉及数值结果时以实际文件和其中记录的计算范围为准。
