/** @format */
import { useState } from 'react';

import { LoadingIcon } from '../../shared/components/LoadingIcon';
import { IssueList, LabelPicker } from '../components';
import { useIssues } from '../hooks';

export const ListView = () => {
	const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
	const { issuesQuery } = useIssues();

	const onLabelChanged = (label: string) => {
		selectedLabels.includes(label)
			? setSelectedLabels(selectedLabels.filter((lbs: string) => lbs !== label))
			: setSelectedLabels([...selectedLabels, label]);
	};

	return (
		<div className='row mt-5'>
			<div className='col-8'>
				{issuesQuery.isLoading ? <LoadingIcon /> : <IssueList issues={issuesQuery.data || []} />}
			</div>

			<div className='col-4'>
				<LabelPicker selectedLabels={selectedLabels} onChange={(label) => onLabelChanged(label)} />
			</div>
		</div>
	);
};
