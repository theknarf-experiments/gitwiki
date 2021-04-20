import React from 'react';

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
			<details>
				<summary>{linkContent}</summary>
				<div>
				{ children }
				</div>
			</details>
		);
	} else {
		return ( <div>{linkContent}</div> );
	}
};

const Menu : React.FC = ({ children }) => (
	<div>
	{ children }
	</div>
);

export default Menu;
