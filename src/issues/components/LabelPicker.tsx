/** @format */
import { FC } from 'react';

import { LoadingIcon } from '../../shared/components/LoadingIcon';
import { useLabels } from '../hooks/useLabels';
import { Label } from '../interfaces/label.interface';

interface Props {
	selectedLabels: string[];
	onChange: (label: string) => void;
}

export const LabelPicker: FC<Props> = ({ selectedLabels, onChange }) => {
	const { labelsQuery } = useLabels();

	if (labelsQuery.isLoading) return <LoadingIcon />;

	return (
		<>
			{labelsQuery.data?.map((label: Label) => (
				<span
					key={label.id}
					className={`badge rounded-pill m-1 label-picker ${
						selectedLabels.includes(label.name) ? 'label-active' : ''
					}`}
					style={{ border: `1px solid #${label.color}`, color: `#${label.color}` }}
					onClick={() => onChange(label.name)}>
					{label.name}
				</span>
			))}
		</>
	);
};
