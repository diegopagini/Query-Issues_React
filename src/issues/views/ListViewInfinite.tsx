/** @format */
import { useState } from 'react';

import { LoadingIcon } from '../../shared/components/LoadingIcon';
import { IssueList, LabelPicker } from '../components';
import { useIssuesInfinite } from '../hooks';
import { State } from '../interfaces';

export const ListViewInfinite = (): JSX.Element => {
	const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
	const [state, setState] = useState<State>();
	const { issuesQuery } = useIssuesInfinite({ state, labels: selectedLabels });

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
						issues={issuesQuery.data?.pages.flat() || []}
						state={state}
						onStateChanged={(newState?: State) => setState(newState)}
					/>
				)}

				{issuesQuery.data?.pages.flat()?.length && (
					<button
						className='btn btn-outline-primary mt-2'
						disabled={!issuesQuery.hasNextPage}
						onClick={() => issuesQuery.fetchNextPage()}>
						Load more
					</button>
				)}
			</div>

			<div className='col-4'>
				<LabelPicker selectedLabels={selectedLabels} onChange={(label) => onLabelChanged(label)} />
			</div>
		</div>
	);
};