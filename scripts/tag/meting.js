'use strict';

const extractOptionValue = (pair) => {
	return pair.slice(pair.indexOf(':') + 1);
};

const METING_TAG_OPTION = {
	id: '',
	server: '',
	type: '',
	mode: 'circulation',
	autoplay: false,
	mutex: true,
	listmaxheight: '340px',
	preload: 'auto',
	theme: '#ad7a86',
};

function parse(options) {
	let settings = Object.assign({}, METING_TAG_OPTION);
	[settings.id, settings.server, settings.type] = options;
	const optionalArgs = options.slice(3);
	optionalArgs.forEach((option, index) => {
		switch (true) {
			case option === 'autoplay':
				settings.autoplay = true;
				break;
			case option === 'fixed':
				settings.fixed = true;
				break;
			case option === 'mini':
				settings.mini = true;
				break;
			case option.startsWith('loop:'):
				settings.loop = extractOptionValue(option);
				break;
			case option.startsWith('order:'):
				settings.order = extractOptionValue(option);
				break;
			case option.startsWith('volume:'):
				settings.volume = extractOptionValue(option);
				break;
			case option.startsWith('lrctype:'):
				settings.lrctype = extractOptionValue(option);
				break;
			case option === 'listfolded':
				settings.listfolded = true;
				break;
			case option.startsWith('storagename:'):
				settings.storagename = extractOptionValue(option);
				break;
			case option.startsWith('mutex:'):
				settings.mutex = extractOptionValue(option) === 'true';
				break;
			case option.startsWith('mode:'):
				settings.mode = extractOptionValue(option);
				break;
			case option.startsWith('listmaxheight:'):
				settings.listmaxheight = extractOptionValue(option);
				break;
			case option.startsWith('preload:'):
				settings.preload = extractOptionValue(option);
				break;
			case option.startsWith('theme:'):
				settings.theme = extractOptionValue(option);
				break;
			default:
				throwError(`Unrecognized tag argument(${index + 1}): ${value}`);
		}
	});
	return settings;
}

hexo.extend.tag.register('meting', function (args) {
	const { id, server, type, mode, autoplay, mutex, listmaxheight, preload, theme } = parse(args);

	return `<meting-js
  server="${server}"
  type="${type}"
  id="${id}"
  mode="${mode}"
  autoplay="${autoplay}"
  mutex="${mutex}"
  listmaxheight="${listmaxheight}"
  preload="${preload}"
  theme="${theme}">
</meting-js>`;
});
