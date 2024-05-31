# 音频播放

## 使用 APlayer
Kira-Hexo 自带了 `hexo-tag-aplayer` 依赖，用户可以使用它在文章中插入音乐。

关于 aplayer 的用法可以查阅[官方文档](https://github.com/MoePlayer/hexo-tag-aplayer/blob/master/docs/README-zh_cn.md#%E4%BD%BF%E7%94%A8)。

```markdown
<!-- 简单示例 (id, server, type)  -->
{% meting "60198" "netease" "playlist" %}

<!-- 进阶示例 -->
{% meting "60198" "netease" "playlist" "autoplay" "mutex:false" "listmaxheight:340px" "preload:none" "theme:#ad7a86"%}
```

:::tip
自 `hexo-theme-kira@1.3.0` 版本开始，我们已经支持直接使用 `{% meting %}` 标签使用 MetingJS 播放器。如果您曾是旧版用户，我们强烈建议您将 `_config.yml` 中的 `aplayer` 配置移除或将 `aplayer.asset_inject` 设置为 `false`。
:::

下面是 meting 标签的参数列表：
| 选项 | 默认值 | 描述 |
| --- | --- | --- |
| id | 必须值 | 歌曲 id / 播放列表 id / 相册 id / 搜索关键字 |
| server | 必须值 | 音乐平台: netease, tencent, kugou, xiami, baidu |
| type | 必须值 | song, playlist, album, search, artist |
| fixed | false | 开启固定模式 |
| mini | false | 开启迷你模式 |
| loop | all | 列表循环模式：all, one,none |
| order | list | 列表播放模式： list, random |
| volume | 0.7 | 播放器音量 |
| lrctype | 0 | 歌词格式类型 |
| listfolded | false | 指定音乐播放列表是否折叠 |
| storagename | metingjs | LocalStorage 中存储播放器设定的键名 |
| autoplay | true | 自动播放，移动端浏览器暂时不支持此功能 |
| mutex | true | 该选项开启时，如果同页面有其他 aplayer 播放，该播放器会暂停 |
| listmaxheight | 340px | 播放列表的最大长度 |
| preload | auto | 音乐文件预载入模式，可选项： none, metadata, auto |
| theme | #ad7a86 | 播放器风格色彩设置 |

## 旧版本兼容

在低于 1.3.0 的版本中，你可以在 `_config.yml` 当中添加下面的配置来开启 APlayer 对 MetingJS 的支持：
```yaml
aplayer:
    meting: true
    asset_inject: false # 请务必将该值设置为 false
```
现在你可以通过 `{% meting ... %}` 在文章中使用 MetingJS 播放器了。

:::danger APlayer导致的资源污染
由于 `hexo-tag-aplayer` 默认会自动注入资源，会对您文档的构建产物造成资源污染。因此，如果您仍在使用低于 1.3.0 的 kira-hexo，我们强烈建议您更新至 1.3.0 版本以上，并完全移除 `_config.yml` 中的 `aplayer` 相关配置或将 `aplayer.asset_inject` 设置为 `false`。
:::
