import React from 'react';

interface SpinnerProps {
	/** Pixel size for both width and height */
	size?: number;
	/** Additional CSS classes for color or layout */
	className?: string;
}

/**
 * `Spinner` renders a compact loading indicator for inline and empty/loading
 * states in FlexPrice.
 *
 * It inherits text color from its parent and exposes a numeric size prop so it
 * can fit buttons, table skeletons, and page-level loaders.
 */
const Spinner: React.FC<SpinnerProps> = ({ size = 24, className = '' }) => {
	return (
		<svg
			className={`animate-spin ${className}`}
			style={{ width: size, height: size }}
			xmlns='http://www.w3.org/2000/svg'
			fill='none'
			viewBox='0 0 24 24'>
			<circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
			<path
				className='opacity-75'
				fill='currentColor'
				d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
			/>
		</svg>
	);
};

export default Spinner;
