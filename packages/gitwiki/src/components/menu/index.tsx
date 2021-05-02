import React from 'react';
import { className, memuItemClassName, detailsClassName, summaryClassName } from './menu.css';

interface MenuItemProps {
	title: string;
	link?: string;
	icon?: string;
}

export const MenuItem : React.FC<MenuItemProps> = ({
	title,
	link,
	icon,
	children
}) => {
	// TODO: implement icon handeling
	const content = icon ? (
		title
	) : (
		title
	);

	const linkContent = link ? (
		<a href={link}>{content}</a>
	) : (
		<span>{content}</span>
	);

	if( typeof children !== 'undefined' ) {
		return (
			<div className={memuItemClassName}>
				<details className={detailsClassName}>
					<summary className={summaryClassName}>{linkContent}</summary>
					<div>
					{ children }
					</div>
				</details>
			</div>
		);
	} else {
		return (
			<div className={memuItemClassName}>{linkContent}</div>
		);
	}
};

const Menu : React.FC = ({ children }) => (
	<div className={className}>
	{ children }
	</div>
);

export default Menu;
