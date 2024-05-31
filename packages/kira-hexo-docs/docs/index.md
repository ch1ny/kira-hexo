# 快速开始

## Kira Hexo

:::tip CREDITS
特别鸣谢 [`nexmoe`](https://github.com/theme-nexmoe/hexo-theme-nexmoe)，这是我最初使用的 hexo 主题，kira-hexo 的设计风格也是借鉴于此，在其风格之上做了部分定制化，希望各位能够支持支持原作者。
:::

> A kirameki ✨ hexo theme for your blog.


<div style="width: 100%; display: flex;">
  <a href="https://www.npmjs.com/package/hexo-theme-kira">
    <img src="https://badgen.net/npm/v/hexo-theme-kira" alt="npm version" />
  </a>
  &nbsp;
  <a href="https://www.npmjs.com/package/hexo-theme-kira">
    <img src="https://badgen.net/npm/dw/hexo-theme-kira" alt="npm weekly download" />
  </a>
  &nbsp;
  <a href="https://github.com/ch1ny/kira-hexo/stargazers">
    <img src="https://badgen.net/github/stars/ch1ny/kira-hexo" alt="github stars" />
  </a>
</div>


[Kira-Hexo](https://github.com/ch1ny/kira-hexo) 是一款高度定制化的 Hexo 专属主题
![预览](/assets/img/preview.webp)

> 欢迎访问 [我的主页](https://kira.host/)，这也是使用该主题搭建的示例站点。

:::tip
在使用 kira-hexo 之前，请确认已经仔细阅读过 [Hexo 官方文档](https://hexo.io/zh-cn/docs/)，完成了对 hexo 的安装以及对 `_config.yml` 的基本配置。
:::

## 使用模板

我们提供了一份 `kira-hexo` 模板，帮您免去了初期的配置工作，如果您不想学习后面的配置方案，则可以使用我们提供的模板体验 `kira-hexo` 。

**With npm:**
```bash
# 我其实更推荐您使用 yarn 或 pnpm ，而不是 npm
npm create kira-hexo@latest myblog
```

**With yarn:**
```bash
yarn create kira-hexo myblog
```

**With pnpm:**
```bash
pnpm create kira-hexo myblog
```

## 使用 npm 安装主题

在你的 Hexo 项目根目录下运行

```bash
npm i hexo-theme-kira
```

当然，我们更推荐您使用 yarn 进行安装

```bash
yarn add hexo-theme-kira
```

## 启用 Kira-Hexo

在 `_config.yml` 中，将 `theme` 的值修改为 `kira`

:::tip **代码高亮**
`Kira-Hexo` 的代码高亮依赖于 `hljs`，因此使用 kira-hexo 的同时需要将 `_config.yml` 中的 `highlight.hljs` 设置为 `true`。
:::

## 配置 Kira-Hexo

安装好主题后，在 Hexo 根目录下修改 `_config.kira.yml`

配置文件内容请参考 [配置文件](/config/config.html)