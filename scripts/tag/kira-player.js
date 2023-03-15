'use strict';

hexo.extend.tag.register(
	'krplayer',
	function (args, content) {
		return `<div class="kira-aplayer-container">${content}</div>`;
	},
	{ ends: true }
);
