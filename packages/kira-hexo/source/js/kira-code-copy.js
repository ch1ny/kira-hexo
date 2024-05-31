window.addEventListener('DOMContentLoaded', () => {
	const codeBlocks = document.querySelectorAll('figure.highlight');
	if (!codeBlocks.length) return;

	const addCopyButton = function (codeBlock) {
		const copyWrapper = document.createElement('div');
		copyWrapper.setAttribute('class', 'kira-codeblock-copy-wrapper');

		let copiedTimeout = null;

		copyWrapper.addEventListener('click', (ev) => {
			const highlightDom = ev.target.parentElement;
			const code = highlightDom.querySelector('code');

			let copiedCode = '';

			(function traverseChildNodes(node) {
				const childNodes = node.childNodes;
				childNodes.forEach((child) => {
					switch (child.nodeName) {
						case '#text':
							copiedCode += child.nodeValue;
							break;
						case 'BR':
							copiedCode += '\n';
							break;
						default:
							traverseChildNodes(child);
					}
				});
			})(code);

			navigator.clipboard
				.writeText(
					// 去掉最后的换行
					copiedCode.slice(0, -1)
				)
				.then(() => {
					if (!!copiedTimeout) clearTimeout(copiedTimeout);

					copyWrapper.classList.add('kira-codeblock-copy-wrapper-copied');
					copiedTimeout = setTimeout(() => {
						copyWrapper.classList.remove('kira-codeblock-copy-wrapper-copied');
						copiedTimeout = null;
					}, 1500);
				});
		});
		codeBlock.appendChild(copyWrapper);
	};

	codeBlocks.forEach(addCopyButton);
});
