import fs from 'fs';
import path from 'path';
import { SitemapStream } from 'sitemap';
import { defineConfig } from 'vitepress';

const links: { url: string; lastmod?: number }[] = [];

export default defineConfig({
	base: '/hexo',
	title: 'Kira-Hexo',
	description: 'A kirameki ✨ hexo theme for your blog.',
	appearance: true, // 允许用户切换深色模式
	outDir: '../dist',
	themeConfig: {
		socialLinks: [
			{ icon: 'github', link: 'https://github.com/ch1ny/' },
			{
				icon: {
					svg: '<svg t="1662274378269" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1610" width="200" height="200"><path d="M824.8 613.2c-16-51.4-34.4-94.6-62.7-165.3C766.5 262.2 689.3 112 511.5 112 331.7 112 256.2 265.2 261 447.9c-28.4 70.8-46.7 113.7-62.7 165.3-34 109.5-23 154.8-14.6 155.8 18 2.2 70.1-82.4 70.1-82.4 0 49 25.2 112.9 79.8 159-26.4 8.1-85.7 29.9-71.6 53.8 11.4 19.3 196.2 12.3 249.5 6.3 53.3 6 238.1 13 249.5-6.3 14.1-23.8-45.3-45.7-71.6-53.8 54.6-46.2 79.8-110.1 79.8-159 0 0 52.1 84.6 70.1 82.4 8.5-1.1 19.5-46.4-14.5-155.8z" p-id="1611"></path></svg>',
				},
				link: 'tencent://AddContact/?fromId=45&fromSubId=1&subcmd=all&uin=1056317718&website=www.oicqzone.com',
			},
		],
		sidebar: [
			{
				items: [
					{ text: '快速开始', link: '/' },
					{ text: '版本迭代', link: '/version' },
					{ text: '常见问题', link: '/faqs' },
				],
			},
			{
				text: '主题配置',
				items: [
					{ text: '配置文件', link: '/config/config' },
					{ text: '图标', link: '/config/icon' },
					{ text: '自定义样式', link: '/config/customStyles' },
					{ text: '自定义配色', link: '/config/colors' },
				],
			},
			{
				text: '页面配置',
				items: [
					{ text: 'Front Matter', link: '/article/front-matter' },
					{ text: '文章归档', link: '/article/archive' },
				],
			},
			{
				text: '特色功能',
				items: [
					{ text: '可复制的代码块', link: '/feature/copy-codeblock' },
					{ text: '音频播放', link: '/feature/music' },
					{
						text: '哔哩哔哩播放器',
						link: '/feature/bilibili',
					},
					{
						text: 'CodePen',
						link: '/feature/codepen',
					},
				],
			},
		],
	},
	async transformHtml(_code, id, ctx) {
		if (/[\\/]404\.html$/.test(id)) return;

		const url = ctx.pageData.relativePath.replace(/((^|\/)index)?\.md$/, `$2.html`);

		const link = {
			url: `${ctx.siteConfig.site.base}${url === '.html' ? 'index.html' : url}`,
			lastmod: ctx.pageData.lastUpdated,
		}

		links.push(link);
	},
	async buildEnd(siteConfig) {
		const { outDir, site: { base } } = siteConfig;
		const sitemap = new SitemapStream({ hostname: `https://kira.host${base}` });
		const sitemapWriteStream = fs.createWriteStream(path.resolve(outDir, 'sitemap.xml'));
		sitemap.pipe(sitemapWriteStream);
		links.forEach((link) => sitemap.write(link));
		sitemap.end();
	},
});
