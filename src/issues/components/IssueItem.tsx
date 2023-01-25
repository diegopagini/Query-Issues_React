/** @format */
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
		queryClient.setQueryData(['issue', issue.number], () => issue, {
			updatedAt: new Date().getTime() + 100000,
		});
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
