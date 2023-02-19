'use strict';

hexo.extend.tag.register(
	'myplayer',
	function (args, content) {
		return `<div class="my-aplayer-container">${content}</div>`;
	},
	{ ends: true }
);
