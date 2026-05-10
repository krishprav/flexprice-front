import '../src/index.css';
import type { Preview } from '@storybook/react';
import React from 'react';
import { MemoryRouter } from 'react-router';

const preview: Preview = {
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
	},
	decorators: [
		(Story) => React.createElement(MemoryRouter, null, React.createElement(Story)),
	],
};

export default preview;
