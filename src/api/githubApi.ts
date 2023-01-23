/** @format */
import axios from 'axios';

export const githubApi = axios.create({
	baseURL: `https://api.github.com/repos/facebook/react`,
	headers: {
		Authorization:
			'Bearer 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',
	},
});
