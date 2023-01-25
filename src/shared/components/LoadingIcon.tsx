/** @format */
import { FaSpinner } from 'react-icons/fa';

export const LoadingIcon = () => {
	return (
		<div
			style={{
				alignItems: 'center',
				display: 'flex',
				justifyContent: 'center',
				padding: '3rem',
			}}>
			<FaSpinner className='loader' />
		</div>
	);
};
