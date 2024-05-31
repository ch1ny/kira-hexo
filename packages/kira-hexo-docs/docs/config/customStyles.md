# 自定义样式

`kira-hexo` 为用户提供了自定义样式的配置接口。
先在 `_config.kira.yml` 主题配置文件中新增字段 `customStyles`，其值为字符串数组。例如下面的配置：

```yaml
# 自定义样式
customStyles:
    - style
    - custom
```
之后在博客根目录下的 `source` 文件夹下分别新建 `style.css` 以及 `custom.css` 即可。

::: danger 自定义样式注意
如果您需要使用自定义样式，我们建议您对根目录下的 `_config.yml` 进行如下修改：
```yaml
aplayer:
    asset_inject: false
```
:::
