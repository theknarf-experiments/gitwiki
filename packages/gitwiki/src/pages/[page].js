import MDX from '@mdx-js/runtime'

const Home = ({ mdx }) => <>
	<h1> Git Wiki </h1>
	<div>
		Sidemenu
	</div>
	<section>
		<a href="#"> Edit </a>	
		<a href="#"> History </a>	
		<article>
		<MDX>{mdx}</MDX>
		</article>
	</section>
</>;

export async function getStaticPaths() {
	return {
		paths: [
			{ params: { page: 'index' } },
		],
		fallback: true
	};
}

export const getStaticProps = async (context) => {
	const read = require('util').promisify(require('fs').readFile);
	const fs = require('fs');
	const path = require('path');
	const wikiDir = path.resolve(process.cwd(), '../wiki/');

	let filename = context.params.page;
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
