import React from 'react';
import Menu, { MenuItem } from './index';

export default {
	title: 'components/menu',
};

export const Default= ({ ...args }) => (
	<Menu {...args}>
		<MenuItem title="test" />
		<MenuItem title="test2" />
		<MenuItem title="test3" link="http://google.com" />
		<MenuItem title="test4" link="http://google.com" />
		<MenuItem title="test5">
			<MenuItem title="sub test" />
			<MenuItem title="sub test2" />
			<MenuItem title="sub test3" link="http://google.com" />
			<MenuItem title="sub test4" link="http://google.com" />
		</MenuItem>
		<MenuItem title="test6" link="http://google.com">
			<MenuItem title="sub test" />
			<MenuItem title="sub test2" />
			<MenuItem title="sub test3" link="http://google.com" />
			<MenuItem title="sub test4" link="http://google.com" />
			<MenuItem title="sub test5">
				<MenuItem title="sub test" />
				<MenuItem title="sub test2" />
				<MenuItem title="sub test3" link="http://google.com" />
				<MenuItem title="sub test4" link="http://google.com" />
			</MenuItem>
		</MenuItem>
	</Menu>
);
Default.args = {
	children: <div>test</div>,
};
