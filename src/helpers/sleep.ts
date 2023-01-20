/** @format */

/**
 * Promise to put to sleep my component for "x" seconds.
 */
export const sleep = (seconds: number = 1): Promise<boolean> => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(true);
		}, seconds * 1000);
	});
};
