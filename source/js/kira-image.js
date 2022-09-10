window.onload = () => {
	/**
	 * 1. 先获取需要展示的 img DOM
	 */
	const articleImageDoms = Array.from(
		document.querySelectorAll('div.kira-content > div.kira-main-content article img')
	).slice(1);
	const modal = document.querySelector('.kira-image > .kira-image-modal');
	const nowImage = modal.querySelector('.kira-image-now > img');
	const prevImage = modal.querySelector('.kira-image-prev > img');
	const nextImage = modal.querySelector('.kira-image-next > img');
	/**
	 * 2. 声明图片地址缓存
	 */
	let nowImageIndex = undefined;
	const imgProps = [];
	/**
	 * 3. 定义替换图片函数
	 */
	const setImageProp = () => {
		const index = nowImageIndex;
		const { src: prevSrc, alt: prevAlt } =
			index === 0 ? imgProps[imgProps.length - 1] : imgProps[index - 1];
		const { src: nowSrc, alt: nowAlt } = imgProps[index];
		const { src: nextSrc, alt: nextAlt } =
			index === imgProps.length - 1 ? imgProps[0] : imgProps[index + 1];

		prevImage.setAttribute('src', prevSrc);
		nowImage.setAttribute('src', nowSrc);
		nextImage.setAttribute('src', nextSrc);
	};
	/**
	 * 4. 定义点击事件
	 */
	const onKiraImagesClick = (index) => {
		nowImageIndex = index;
		setImageProp();
		modal.classList.add('visible');
		const onVisibleModalClick = (evt) => {
			if (evt.target !== modal) return;
			modal.classList.remove('visible');
			document.querySelector('.kira-body').style.overflow = 'auto';
			modal.removeEventListener('click', onVisibleModalClick);
		};
		modal.addEventListener('click', onVisibleModalClick);
		document.querySelector('.kira-body').style.overflow = 'hidden';
	};
	/**
	 * 5. 定义切换图片函数
	 */
	let switchingImage = false;
	const switchImage = (prevOrNext) => {
		if (switchingImage) return;
		switchingImage = true;
		const imgListDom = document.querySelector('.kira-image .kira-image-modal .kira-image-list');
		setTimeout(() => {
			imgListDom.style.animationName = '';
			if (prevOrNext === 'prev') {
				nowImageIndex = nowImageIndex === 0 ? imgProps.length - 1 : nowImageIndex - 1;
			} else {
				nowImageIndex = nowImageIndex === imgProps.length - 1 ? 0 : nowImageIndex + 1;
			}
			setImageProp();
			switchingImage = false;
		}, 200);
		imgListDom.style.animationName = `kira-image-to-${prevOrNext}`;
	};
	/**
	 * 6. 绑定切换图片函数
	 */
	const prevButton = document.querySelector(
		'.kira-main-content > .kira-image div.kira-image-container > div.kira-image-prev-button-panel > div'
	);
	const nextButton = document.querySelector(
		'.kira-main-content > .kira-image div.kira-image-container > div.kira-image-next-button-panel > div'
	);
	prevButton.addEventListener('click', () => switchImage('prev'));
	nextButton.addEventListener('click', () => switchImage('next'));
	/**
	 * 7. 提取图片地址
	 */
	articleImageDoms.forEach((articleImageDom, index) => {
		imgProps.push({
			src: articleImageDom.getAttribute('data-src'),
			alt: articleImageDom.getAttribute('alt'),
		});
		articleImageDom.addEventListener('click', () => {
			onKiraImagesClick(index);
		});
	});
};
