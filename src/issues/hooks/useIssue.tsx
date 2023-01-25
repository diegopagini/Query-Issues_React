/** @format */
import { useQuery } from '@tanstack/react-query';

import { githubApi } from '../../api/githubApi';
import { sleep } from '../../helpers/sleep';
import { Issue } from '../interfaces';

export const getIssueInfo = async (issueNumber: number): Promise<Issue> => {
	await sleep(1); // to delay the request.
	const { data } = await githubApi.get<Issue>(`/issues/${issueNumber}`);
	return data;
};

export const getIssueComments = async (issueNumber: number): Promise<Issue[]> => {
	await sleep(2);
	const { data } = await githubApi.get<Issue[]>(`/issues/${issueNumber}/comments`);
	return data;
};

export const useIssue = (issueNumber: number) => {
	const issueQuery = useQuery<Issue>(['issue', issueNumber], () => getIssueInfo(issueNumber));

	const commentsQuery = useQuery<Issue[]>(
		['issue', issueNumber, 'comments'],
		() => getIssueComments(issueQuery.data!.number),
		{
			enabled: issueQuery.data !== undefined, // To launch this request depending if issueQuery has data.
		}
	);

	return {
		issueQuery,
		commentsQuery,
	};
};
