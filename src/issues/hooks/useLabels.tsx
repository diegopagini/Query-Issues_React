/** @format */
import { useQuery } from '@tanstack/react-query';

import { githubApi } from '../../api/githubApi';
import { Label } from '../interfaces';

const getLabels = async (): Promise<Label[]> => {
	// await sleep(2); // like delay() from rxjs.

	const { data } = await githubApi.get<Label[]>('/labels?per_page=100', {
		headers: {
			Authorization: null,
		},
	});
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
