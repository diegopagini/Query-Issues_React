/** @format */
import { LoadingIcon } from '../../shared/components/LoadingIcon';
import { useLabels } from '../hooks/useLabels';
import { Label } from '../interfaces/label.interface';

export const LabelPicker = () => {
	const { labelsQuery } = useLabels();

	if (labelsQuery.isLoading) return <LoadingIcon />;

	return (
		<>
			{labelsQuery.data?.map((label: Label) => (
				<span
					key={label.id}
					className='badge rounded-pill m-1 label-picker'
					style={{ border: `1px solid #${label.color}`, color: `#${label.color}` }}>
					{label.name}
				</span>
			))}
		</>
	);
};
