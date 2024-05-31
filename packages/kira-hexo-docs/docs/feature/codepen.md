# CodePen 快捷标签

Kira-Hexo 也为各位程序员用户提供了方便快捷的 CodePen 直链标签。

## 用法

```markdown
{% pen https://codepen.io/ch1ny/pen/yLvENLp?editors=0010 %}
```

在文章中的表现如下：

<style>
    a.CodePenLink {
        transition: 0.2s;
        padding: 0.2em;
        color: rgb(49, 174, 255) !important;
        border-bottom: 1px solid rgba(49, 174, 255, 0.5);
    }

    a.CodePenLink:hover {
        text-shadow: 0px 0px 5px rgba(49, 174, 255, 0.4) !important;
        text-decoration: none;
        border-bottom: 1px solid rgb(49, 174, 255);
    }
</style>
<div style="background-color: #f3f3f3; padding: 14px; border-radius: 12px;">
    <a href="https://codepen.io/ch1ny/pen/yLvENLp?editors=0010" class="CodePenLink"><b>在 Codepen 上尝试</b></a>
</div>