/** @format */
import axios from 'axios';

export const githubApi = axios.create({
	baseURL: `https://api.github.com/repos/facebook/react`,
	headers: {
		Authorization:
			'Bearer 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',
	},
});
