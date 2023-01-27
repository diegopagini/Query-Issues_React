/** @format */
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import { githubApi } from '../../api/githubApi';
import { sleep } from '../../helpers/sleep';
import { Issue } from '../interfaces';
import { State } from '../interfaces/issue.interface';

interface Props {
	state?: State;
	labels: string[];
	page?: number;
}

const getIssues = async ({ labels, state, page = 1 }: Props): Promise<Issue[]> => {
	await sleep(2);
	const params = new URLSearchParams();

	if (state) params.append('state', state);

	if (labels.length > 0) {
		const labelString = labels.join(',');
		params.append('labels', labelString);
	}

	// Pagination
	params.append('page', page?.toString());
	params.append('per_page', '5');

	const { data } = await githubApi<Issue[]>('/issues', { params });
	return data;
};

export const useIssues = ({ state, labels }: Props) => {
	const [page, setPage] = useState(1);

	// If the state or the labels the page will change to the number 1 again.
	useEffect(() => {
		setPage(1);
	}, [state, labels]);

	const issuesQuery = useQuery(['issues', { state, labels, page }], () =>
		getIssues({ labels, state, page })
	);

	const nextPage = (): void => {
		if (issuesQuery.data?.length === 0) return;
		setPage(page + 1);
	};

	const prevPage = (): void => {
		if (page > 1) setPage(page - 1);
	};

	return {
		issuesQuery,
		// Getter
		page: issuesQuery.isFetching ? 'Loading' : page,
		// Methods
		nextPage,
		prevPage,
	};
};
