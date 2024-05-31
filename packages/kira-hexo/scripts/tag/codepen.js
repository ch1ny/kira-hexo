'use strict';

hexo.extend.tag.register(
	'pen',
	function (args) {
		const url = args[0];
		return `<a href="${url}" class="CodePenLink"><b>在 Codepen 上尝试</b></a>`;
	},
	{ ends: false }
);
