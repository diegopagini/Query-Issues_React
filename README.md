<!-- @format -->

# React Query - Issues

### Axios create

```typescript
import axios from 'axios';

export const githubApi = axios.create({
	baseURL: `https://api.github.com/repos/facebook/react`,
	headers: {},
});
```

---

### useLabels

```typescript
import { useQuery } from '@tanstack/react-query';
import { githubApi } from '../../api/githubApi';
import { Label } from '../interfaces/label.interface';

const getLabels = async (): Promise<Label[]> => {
	const { data } = await githubApi.get<Label[]>('/labels');
	return data;
};

export const useLabels = () => {
	const labelsQuery = useQuery(['labels'], getLabels, {
		// initialData: [], // This could be used like an initial data to show.
		staleTime: 1000 * 60 * 60, // It means that this will be cached by 1 hour.
		placeholderData: [
			// This could be used like fake thata to show when is loading.
			{
				id: 725156255,
				node_id: 'MDU6TGFiZWw3MjUxNTYyNTU=',
				url: 'https://api.github.com/repos/facebook/react/labels/good%20first%20issue%20(taken)',
				name: 'good first issue (taken)',
				color: 'b60205',
				default: false,
			},
			{
				id: 717031390,
				node_id: 'MDU6TGFiZWw3MTcwMzEzOTA=',
				url: 'https://api.github.com/repos/facebook/react/labels/good%20first%20issue',
				name: 'good first issue',
				color: '6ce26a',
				default: true,
			},
		],
	});

	return {
		labelsQuery,
	};
};
```

---

### useIssues

```typescript
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
```

---

### useIssue

```typescript
import { useQuery } from '@tanstack/react-query';

import { githubApi } from '../../api/githubApi';
import { sleep } from '../../helpers/sleep';
import { Issue } from '../interfaces';

const getIssueInfo = async (issueNumber: number): Promise<Issue> => {
	await sleep(1); // delay the request.
	const { data } = await githubApi.get<Issue>(`/issues/${issueNumber}`);
	return data;
};

const getIssueComments = async (issueNumber: number): Promise<Issue[]> => {
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
```

---

## Prefetch & Preset

```tsx
import { useQueryClient } from '@tanstack/react-query';
import { FC } from 'react';
import { FiCheckCircle, FiInfo, FiMessageSquare } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

import { getIssueComments, getIssueInfo } from '../hooks/useIssue';
import { Issue, State } from '../interfaces';

interface Props {
	issue: Issue;
}

export const IssueItem: FC<Props> = ({ issue }) => {
	/**
	 * useNavigate() from react-router-dom to navigate in the app.
	 */
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const prefetchData = () => {
		queryClient.prefetchQuery(['issue', issue.number], () => getIssueInfo(issue.number));
		queryClient.prefetchQuery(['issue', issue.number, 'comments'], () =>
			getIssueComments(issue.number)
		);
	};

	const preSetData = () => {
		queryClient.setQueryData(['issue', issue.number], () => issue);
	};

	return (
		<div
			className='card mb-2 issue'
			onClick={() => navigate(`/issues/issue/${issue.number}`)}
			// onMouseEnter={prefetchData}>
			onMouseEnter={preSetData}>
			<div className='card-body d-flex align-items-center'>
				{issue.state === State.Open ? (
					<FiInfo size={30} color='red' />
				) : (
					<FiCheckCircle size={30} color='green' />
				)}

				<div className='d-flex flex-column flex-fill px-2'>
					<span>{issue.title}</span>
					<span className='issue-subinfo'>
						{`#${issue.number} created at: ${issue.created_at}. `}
						<span className='fw-bold'>by: {issue.user.login}</span>
					</span>
				</div>

				<div className='d-flex align-items-center'>
					<img src={issue.user.avatar_url} alt='User Avatar' className='avatar' />
					<span className='px-2'>{issue.comments}</span>
					<FiMessageSquare />
				</div>
			</div>
		</div>
	);
};
```
