/** @format */
import { Link, Navigate, useParams } from 'react-router-dom';

import { LoadingIcon } from '../../shared/components/LoadingIcon';
import { IssueComment } from '../components/IssueComment';
import { useIssue } from '../hooks';
import { Issue } from '../interfaces/issue.interface';

export const IssueView = () => {
	const params = useParams();
	const { id = '0' } = params;
	const { issueQuery, commentsQuery } = useIssue(+id); // +id like parseInt() or Number()

	if (issueQuery.isLoading) return <LoadingIcon />;

	if (!issueQuery.data) return <Navigate to='./issues/list' />;

	return (
		<div className='row mb-5'>
			<div className='col-12 mb-3'>
				<Link to='./issues/list'>Go Back</Link>
			</div>
			{/* Issue */}
			<IssueComment issue={issueQuery.data!} />
			{/* Comments spinner */}
			{commentsQuery.isLoading && <LoadingIcon />}
			{/* Issue comments */}
			{commentsQuery.data?.map((comment: Issue) => (
				<IssueComment key={comment.id} issue={comment} />
			))}
		</div>
	);
};
