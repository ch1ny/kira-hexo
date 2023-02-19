window.onload = () => {
	let searchCache; // 搜索缓存

	const searchInput = document.querySelector('#kira-search-input');

	searchInput.addEventListener('keydown', async (evt) => {
		if (evt.keyCode !== 13) return;
		if (!searchCache) {
			const content = await fetch('./content.json')
				.then((res) => res.json())
				.catch((ex) => {
					console.error(ex);
					return {};
				});
			searchCache = content.posts;
		}
		if (!Array.isArray(searchCache)) return;
		const keyWords = evt.target.value.replace(/[ ]/g, '').split(' ');

		const result = [];
		keyWords.forEach((keyWord) => {
			const regex = new RegExp(`(${keyWord})`, 'g');

			searchCache.forEach((post) => {
				const titleReplaced = regex.test(post.title);
				const textReplacedIndex = post.text.search(regex);

				if (titleReplaced || textReplacedIndex !== -1) {
					result.push({
						title: titleReplaced
							? post.title.replace(regex, `<span class="kira-search-keyword">${keyWord}</span>`)
							: post.title,
						text:
							textReplacedIndex !== -1
								? `…${post.text.substring(
										textReplacedIndex - 18,
										textReplacedIndex + 18
								  )}…`.replace(regex, '<span class="kira-search-keyword">$1</span>')
								: post.text,
					});
				}
			});
		});

		console.log(result);
	});
};
