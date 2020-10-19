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
	const path = require('path');
	const wikiDir = path.resolve(process.cwd(), '../wiki/');

	let filename = context.params.page;
	if(filename == "") filename = "index";

	const mdx = await read(path.join(wikiDir, filename + '.mdx'), 'utf8');
	return { props: {
		mdx
	} };
};

export default Home;
