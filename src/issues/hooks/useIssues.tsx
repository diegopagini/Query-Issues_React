/** @format */
import { useQuery } from '@tanstack/react-query';

import { githubApi } from '../../api/githubApi';
import { Issue } from '../interfaces';

const getIssues = async (): Promise<Issue[]> => {
	const { data } = await githubApi<Issue[]>('/issues');
	return data;
};

export const useIssues = () => {
	const issuesQuery = useQuery(['issues'], getIssues);

	return {
		issuesQuery,
	};
};
