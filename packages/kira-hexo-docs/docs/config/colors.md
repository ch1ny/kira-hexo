# 自定义配色

## 自定义彩虹配色
在 Kira-Hexo 中，为开发者预置了一套丰富的彩虹配色方案，同时允许开发者自行修改彩虹色配置。

```yaml
color: # 配色方案，从first到seventh为优先级为1-7的颜色，默认为彩虹配色
    first: # 同时作为主题色
        r: 49
        g: 174
        b: 255
    second:
        r: 255
        g: 78
        b: 106
    third:
        r: 255
        g: 185
        b: 0
    fourth:
        r: 51
        g: 213
        b: 122
    fifth:
        r: 0
        g: 219
        b: 255
    sixth:
        r: 255
        g: 69
        b: 0
    seventh:
        r: 144
        g: 144
        b: 255
```

下面是按顺序排出的彩虹配色：

<div style="width: 100%; display: flex;">
    <div style="width: 100%; height: 1rem; background: rgb(49, 174, 255);"></div>
    <div style="width: 100%; height: 1rem; background: rgb(255, 78, 106);"></div>
    <div style="width: 100%; height: 1rem; background: rgb(255, 185, 0);"></div>
    <div style="width: 100%; height: 1rem; background: rgb(51, 213, 122);"></div>
    <div style="width: 100%; height: 1rem; background: rgb(0, 219, 255);"></div>
    <div style="width: 100%; height: 1rem; background: rgb(255, 69, 0);"></div>
    <div style="width: 100%; height: 1rem; background: rgb(144, 144, 255);"></div>
</div>