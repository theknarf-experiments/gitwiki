import { useState } from 'react';
import { request } from 'graphql-request'
import useSWR from 'swr'

const fetcher = query => request('/api/graphql', query)

const History = () => {
	const { data, error } = useSWR(
		`
		{
			history {
				hash
				author
				message
			}
		}
		`, fetcher);

	if(error) return <div>Failed to load</div>;
	if(!data) return <div>Loading...</div>;
	
	return <div>{
		(data.history||[]).map(({ hash, author, message }) => (
			<div>
				<span>{hash}</span>
				<b>{author}</b>
				<span>{message}</span>
			</div>
		))
	}</div>;
}

const LoadableHistory = () => {
	const [showHistoy, setShowHistory] = useState(false);
	const onClick = () => {
		setShowHistory(true);
	};

	const LoadHistoy = () => {
		return <History />
	};

	return <div>
		<h2> History </h2>
		{
			!showHistoy
			? <button onClick={onClick}>Load history</button>
			: <LoadHistoy />
		}
	</div>
}

export default LoadableHistory;
