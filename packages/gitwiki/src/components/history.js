import { useState } from 'react';
import useSWR from 'swr'

const History = () => {
	const { data, error } = useSWR('/api/history');

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
