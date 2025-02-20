/** @format */
import { useState } from 'react';

import { LoadingIcon } from '../../shared/components/LoadingIcon';
import { IssueList, LabelPicker } from '../components';
import { useIssues } from '../hooks';
import { State } from '../interfaces';

export const ListView = () => {
	const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
	const [state, setState] = useState<State>();
	const { issuesQuery, page, nextPage, prevPage } = useIssues({ state, labels: selectedLabels });

	const onLabelChanged = (label: string) => {
		selectedLabels.includes(label)
			? setSelectedLabels(selectedLabels.filter((lbs: string) => lbs !== label))
			: setSelectedLabels([...selectedLabels, label]);
	};

	return (
		<div className='row mt-5'>
			<div className='col-8'>
				{issuesQuery.isLoading ? (
					<LoadingIcon />
				) : (
					<IssueList
						issues={issuesQuery.data || []}
						state={state}
						onStateChanged={(newState?: State) => setState(newState)}
					/>
				)}

				<div className='d-flex mt-2 justify-content-between align-items-center'>
					<button
						className='btn btn-outline-primary'
						disabled={issuesQuery.isFetching}
						onClick={prevPage}>
						Prev
					</button>
					<span>{page}</span>
					<button
						className='btn btn-outline-primary'
						disabled={issuesQuery.isFetching}
						onClick={nextPage}>
						Next
					</button>
				</div>
			</div>

			<div className='col-4'>
				<LabelPicker selectedLabels={selectedLabels} onChange={(label) => onLabelChanged(label)} />
			</div>
		</div>
	);
};
