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

### IssueItem

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

---

## Pagination

### useIssues

```tsx
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
```

### ListView

```tsx
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
```

---

## Infinite Scroll

### useIssuesInfinite

```tsx
import { useInfiniteQuery } from '@tanstack/react-query';

import { githubApi } from '../../api/githubApi';
import { Issue, State } from '../interfaces';

interface Props {
	state?: State;
	labels: string[];
	page?: number;
}

interface QueryProps {
	pageParam?: number;
	queryKey: (string | Props)[];
}

const getIssues = async ({ pageParam = 1, queryKey }: QueryProps): Promise<Issue[]> => {
	const [, , args] = queryKey;
	const { state, labels } = args as Props;
	const params = new URLSearchParams();

	if (state) params.append('state', state);

	if (labels.length > 0) {
		const labelString = labels.join(',');
		params.append('labels', labelString);
	}

	// Pagination
	params.append('page', pageParam?.toString());
	params.append('per_page', '5');

	const { data } = await githubApi<Issue[]>('/issues', { params });
	return data;
};

export const useIssuesInfinite = ({ state, labels }: Props) => {
	const issuesQuery = useInfiniteQuery(
		['issues', 'infinite', { state, labels }],
		// data.queryKey = ['issues', 'infinite', { state, labels, page: 1 }]
		(data) => getIssues(data),
		{
			getNextPageParam: (lastPage: Issue[], pages: Issue[][]) => {
				if (lastPage.length === 0) return;

				return pages.length + 1;
			},
		}
	);

	return {
		issuesQuery,
	};
};
```

### ListViewInfinite

```tsx
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
```
