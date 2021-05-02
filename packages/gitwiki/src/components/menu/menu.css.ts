import { style } from '@vanilla-extract/css';

export const className = style({
});

export const memuItemClassName = style({
	cursor: 'pointer',
	padding: '1em',
});

export const detailsClassName = style({
});

export const summaryClassName = style({
	'list-style-type': 'none',
	selectors: {
		'&::after': {
			content: '" ►"',
		},
		'details[open] > &:after': {
			content: '" ▼"',
		},
	}
});
