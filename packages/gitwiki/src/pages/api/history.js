const handler = (req, res) => {
	res.statusCode = 200
	res.setHeader('Content-Type', 'application/json')
	res.end(JSON.stringify({
		history: [
			{ hash: '2560b27', author: 'John Doe', message: 'Did some stuff' },
			{ hash: '2560b27', author: 'John Doe', message: 'Did some stuff' },
			{ hash: 'fb0edeb', author: 'John Doe', message: 'Did some stuff' },
		]
	}))
}

export default handler;
