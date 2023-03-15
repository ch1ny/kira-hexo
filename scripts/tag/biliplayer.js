'use strict';

hexo.extend.tag.register(
	'biliplayer',
	function (args) {
		const vid = args[0];
		const page = args[1] ? args[1] : 1;
		const danmaku = args[2] ? 1 : 0;

		const isBv = /([a-z]|[A-Z])/.test(vid);

		return `<iframe src="https://player.bilibili.com/player.html?${
			isBv ? 'bv' : 'a'
		}id=${vid}&page=${page}&as_wide=1&high_quality=1&danmaku=${danmaku}"
style="width: 62em; height: 35em;"
allowfullscreen="allowfullscreen" width="100%" height="100%" scrolling="no" frameborder="0" sandbox="allow-top-navigation allow-same-origin allow-forms allow-scripts"></iframe>`;
	},
	{ ends: false }
);
