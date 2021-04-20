import React from 'react';
import { GetStaticProps, GetStaticPaths } from 'next'
import MDX from '@mdx-js/runtime';
import History from '../components/history';
import ArticleSection from '../components/article-section';

interface HomeProps {
	mdx: String;
}

const Home : React.FC<HomeProps> = ({ mdx }) => <>
	<h1> Git Wiki </h1>
	<section>
		<a href="#"> Edit </a>	
		<ArticleSection>
			<MDX>{mdx}</MDX>
		</ArticleSection>
		<History />
	</section>
</>;

export const getStaticPaths : GetStaticPaths = async () => {
	return {
		paths: [
			{ params: { page: 'index' } },
		],
		fallback: true
	};
}

export const getStaticProps : GetStaticProps = async (context) => {
	const read = require('util').promisify(require('fs').readFile);
	const fs = require('fs');
	const path = require('path');
	const wikiDir = path.resolve(process.cwd(), '../wiki/');

	let filename = context!.params!.page;
	if(filename == "") filename = "index";
	const fullpath = path.join(wikiDir, filename + '.mdx');

	if(!fs.existsSync(fullpath)) {
		return { props: {
			mdx: `# File not found
Couldn' find ${filename}`
		} };
	}

	const mdx = await read(fullpath, 'utf8');
	return { props: {
		mdx
	} };
};

export default Home;
