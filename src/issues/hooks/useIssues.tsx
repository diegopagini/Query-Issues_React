/** @format */
import { useQuery } from '@tanstack/react-query';

import { githubApi } from '../../api/githubApi';
import { sleep } from '../../helpers/sleep';
import { Issue } from '../interfaces';
import { State } from '../interfaces/issue.interface';

interface Props {
	state?: State;
	labels: string[];
}

const getIssues = async (labels: string[], state?: State): Promise<Issue[]> => {
	await sleep(2);
	const params = new URLSearchParams();

	if (state) params.append('state', state);

	if (labels.length > 0) {
		const labelString = labels.join(',');
		params.append('labels', labelString);
	}

	// Pagination
	params.append('page', '1');
	params.append('per_page', '5');

	const { data } = await githubApi<Issue[]>('/issues', { params });
	return data;
};

export const useIssues = ({ state, labels }: Props) => {
	const issuesQuery = useQuery(['issues', { state, labels }], () => getIssues(labels, state));

	return {
		issuesQuery,
	};
};
