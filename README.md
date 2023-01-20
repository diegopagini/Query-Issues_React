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
	const labelsQuery = useQuery(['labels'], getLabels);

	return {
		labelsQuery,
	};
};
```
