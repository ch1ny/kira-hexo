window.addEventListener('load', () => {
	// 定义阻止默认事件函数
	const preventDefault = (ev) => {
		ev.preventDefault();
	};

	/**
	 * 1. 先获取需要展示的 img DOM
	 */
	const articleImageDoms = Array.from(
		document.querySelectorAll(
			'div.kira-content > div.kira-main-content article img:not(.disabled-kira-image)'
		)
	);

	const modal = document.querySelector('.kira-image > .kira-image-modal');
	const nowImage = modal.querySelector('.kira-image-now > img');
	const prevImage = modal.querySelector('.kira-image-prev > img');
	const nextImage = modal.querySelector('.kira-image-next > img');
	const zoomButton = modal.querySelector(
		'.kira-image-header > .kira-image-operation > #kira-image-operation-button-zoom'
	);

	const zoomIn = () => {
		nowImage.classList.add('zoom');
		zoomButton.querySelector('i').classList.remove('icon-zoom-in');
		zoomButton.querySelector('i').classList.add('icon-zoom-out');
	};
	const zoomOut = () => {
		nowImage.style.transform = 'translate(0px, 0px)';
		nowImage.classList.remove('zoom');
		zoomButton.querySelector('i').classList.remove('icon-zoom-out');
		zoomButton.querySelector('i').classList.add('icon-zoom-in');
	};

	zoomButton.addEventListener('click', () => {
		if (zoomButton.querySelector('i').classList.contains('icon-zoom-in')) {
			zoomIn();
		} else {
			zoomOut();
		}
	});
	/**
	 * 2. 定义放大后图片拖动函数
	 */
	const translateRegex = new RegExp(
		/translate\((-?\d{1,}(\.\d{1,})?)px,.*?(-?\d{1,}(\.\d{1,})?)px\)/
	);
	const onDragStart = (evt) => {
		if (!nowImage.classList.contains('zoom')) return;
		if (evt.button !== 0) return; // 仅匹配鼠标左键
		const startTransform = nowImage.style.transform;
		const [_0, initialX, _1, initialY, _2] = (
			translateRegex.exec(startTransform) || new Array(5).fill(0)
		)
			.map(Number)
			.map((num) => num * 2);
		// 鼠标按下的坐标
		const startX = evt.clientX;
		const startY = evt.clientY;

		const onDragging = (evt) => {
			const finalX = initialX + (evt.clientX - startX);
			const finalY = initialY + (evt.clientY - startY);
			// 因为放大了倍数，所以移动时需要除以相应的倍数
			nowImage.style.transform = `translate(${finalX / 2}px, ${finalY / 2}px)`;
		};
		const onDragEnd = () => {
			nowImage.removeEventListener('mousemove', onDragging);
			nowImage.removeEventListener('mouseup', onDragEnd);
		};

		nowImage.addEventListener('mouseup', onDragEnd);
		nowImage.addEventListener('mousemove', onDragging);
	};
	nowImage.addEventListener('mousedown', onDragStart);
	nowImage.addEventListener('click', zoomIn);
	/**
	 * 3. 声明图片地址缓存
	 */
	let nowImageIndex = undefined;
	const imgProps = [];
	/**
	 * 4. 定义替换图片函数
	 */
	const setImageProp = () => {
		const index = nowImageIndex;
		const { src: prevSrc } = index === 0 ? imgProps[imgProps.length - 1] : imgProps[index - 1];
		const { src: nowSrc, alt: nowAlt } = imgProps[index];
		const { src: nextSrc } = index === imgProps.length - 1 ? imgProps[0] : imgProps[index + 1];

		prevImage.setAttribute('src', prevSrc);
		nowImage.setAttribute('src', nowSrc);
		nextImage.setAttribute('src', nextSrc);

		modal.querySelector('.kira-image-header > .kira-image-counter').innerText = `${index + 1} / ${
			imgProps.length
		}`;
		modal.querySelector('.kira-image-header > .kira-image-title').innerText = `${nowAlt || ''}`;
	};
	/**
	 * 5. 定义关闭模态屏事件
	 */
	const onVisibleModalClick = (evt) => {
		if (evt.target !== modal) return;
		onClose();
	};
	const onClose = () => {
		modal.classList.remove('visible');
		// 恢复页面滚动
		modal.removeEventListener('mousewheel', preventDefault);
		modal.removeEventListener('touchmove', preventDefault);
		modal.removeEventListener('click', onVisibleModalClick);
	};
	modal
		.querySelector(
			'.kira-image-header > .kira-image-operation > #kira-image-operation-button-close'
		)
		.addEventListener('click', onClose);
	/**
	 * 6. 定义点击事件
	 */
	const onKiraImagesClick = (index) => {
		nowImageIndex = index;
		zoomOut();
		setImageProp();
		modal.classList.add('visible');
		modal.addEventListener('click', onVisibleModalClick);
		// 阻止页面滚动
		modal.addEventListener('mousewheel', preventDefault, { passive: false });
		// 阻止移动端页面滚动
		modal.addEventListener('touchmove', preventDefault, { passive: false });
	};
	/**
	 * 7. 定义切换图片函数
	 */
	let switchingImage = false;
	const switchImage = (prevOrNext) => {
		if (switchingImage) return;
		switchingImage = true;
		const imgListDom = document.querySelector('.kira-image .kira-image-modal .kira-image-list');
		zoomOut();
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
	 * 8. 绑定切换图片函数
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
	 * 9. 提取图片地址
	 */
	articleImageDoms.forEach((articleImageDom, index) => {
		imgProps.push({
			src: articleImageDom.getAttribute('data-src') || articleImageDom.getAttribute('src'),
			alt: articleImageDom.getAttribute('alt'),
		});
		articleImageDom.addEventListener('click', () => {
			onKiraImagesClick(index);
		});
	});
});
