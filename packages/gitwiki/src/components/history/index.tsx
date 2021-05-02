import React from 'react';
import { useState } from 'react';
import { request } from 'graphql-request'
import useSWR from 'swr'

const fetcher = (query: any) =>
	request('/api/graphql', query)

interface HistoryObject {
	hash: String;
	author: String;
	message: String;
}

const History : React.FC = () => {
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
	
	return <table>
		<tr>
			<th>Git hash</th>
			<th>Author</th>
			<th>Comitt message</th>
		</tr>
		{
			(data.history||[]).map(({ hash, author, message } : HistoryObject) => (
				<tr>
					<td>{hash}</td>
					<td>{author}</td>
					<td>{message}</td>
				</tr>
			))
		}
	</table>;
}

const LoadableHistory : React.FC = () => {
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
