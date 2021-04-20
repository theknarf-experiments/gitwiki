import React from 'react';
import { className } from './styles.css';

const ArticleSection : React.FC = ({ children }) =>
	<section className={className}>
	{ children }
	</section>;

export default ArticleSection;
