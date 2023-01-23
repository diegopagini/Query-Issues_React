/** @format */

export interface Issue {
	active_lock_reason: null;
	assignee: null;
	assignees: any[];
	author_association: AuthorAssociation;
	body: string;
	closed_at: null;
	comments_url: string;
	comments: number;
	created_at: Date;
	draft?: boolean;
	events_url: string;
	html_url: string;
	id: number;
	labels_url: string;
	labels: Label[];
	locked: boolean;
	milestone: null;
	node_id: string;
	number: number;
	performed_via_github_app: null;
	pull_request?: PullRequest;
	reactions: Reactions;
	repository_url: string;
	state_reason: null;
	state: State;
	timeline_url: string;
	title: string;
	updated_at: Date;
	url: string;
	user: User;
}

export enum AuthorAssociation {
	Contributor = 'CONTRIBUTOR',
	Member = 'MEMBER',
	None = 'NONE',
}

export interface Label {
	color: string;
	default: boolean;
	description?: string | null;
	id: number;
	name: string;
	node_id: string;
	url: string;
}

export interface PullRequest {
	diff_url: string;
	html_url: string;
	merged_at: null;
	patch_url: string;
	url: string;
}

export interface Reactions {
	'-1': number;
	'+1': number;
	confused: number;
	eyes: number;
	heart: number;
	hooray: number;
	laugh: number;
	rocket: number;
	total_count: number;
	url: string;
}

export enum State {
	Closed = 'closed',
	Open = 'open',
}

export interface User {
	avatar_url: string;
	events_url: string;
	followers_url: string;
	following_url: string;
	gists_url: string;
	gravatar_id: string;
	html_url: string;
	id: number;
	login: string;
	node_id: string;
	organizations_url: string;
	received_events_url: string;
	repos_url: string;
	site_admin: boolean;
	starred_url: string;
	subscriptions_url: string;
	type: Type;
	url: string;
}

export enum Type {
	User = 'User',
}
