const express = require('express')
const router = express.Router()
const db = require('../dbconfig.js')

router.get('/', (req, res) => {
	if (!req.session.ID) {
		res.redirect('/login')
	} else {
		const myID = req.session.ID
		db.pools
			// Run query
			.then((pool) => {
				return pool.request()
					// Select leaderboard
					.query('SELECT * FROM dbo.leaderboard JOIN dbo.accounts ON dbo.leaderboard.account_id = dbo.accounts.id ORDER BY average_score DESC;')
			})
			.then(result => {
				let columns = ['id', 'account_id', 'username', 'game_count', 'score', 'average_score']
				let cols = columns.length
				let rows = result.recordset.length
				let x
				if (rows > 0) {
					const myTable = Array.from(Array(rows), () => new Array(cols));
					for (let row = 0; row < rows; row++) {
						for (let col = 0; col < cols; col++) {
							if (columns[col] === 'id') {
								x = row + 1
							} else {
								x = result.recordsets[0][row][columns[col]]
							}
							myTable[row][col] = x
						}
					}
					leaderboard.stats = myTable
				}
			})
			.then(result => {
				db.pools
					// Run query
					.then((pool) => {
						return pool.request()
							// Select game log
							.query('SELECT dbo.rankings.id, dbo.rankings.account_id, dbo.accounts.username, game_count, score, average_score FROM dbo.rankings JOIN dbo.accounts ON dbo.rankings.account_id = dbo.accounts.id WHERE game_count !=0 ORDER BY average_score DESC;')
					})
					.then(result => {
						let columns = ['id', 'account_id', 'username', 'game_count', 'score', 'average_score']
						let cols = columns.length
						let rows = result.recordset.length
						let best
						if (rows > 0) {
							const myTable = Array.from(Array(rows), () => new Array(cols));
							for (let row = 0; row < rows; row++) {
								for (let col = 0; col < cols; col++) {
									if (columns[col] === 'id') {
										x = row + 1
									}
									else if (columns[col] === 'account_id') {
										x = result.recordsets[0][row][columns[col]]
										let average = ((result.recordsets[0][row]['score']) / (result.recordsets[0][row]['game_count']) * 100)
										average = Math.round(average)
										updateAverage(average, x)
									}
									else {
										x = result.recordsets[0][row][columns[col]]
									}
									myTable[row][col] = x
								}
							}
							ranking.stats = myTable
							mvp.stats = ranking.stats[0][2]
						}
						res.render('users/leaderboard', { data_l: leaderboard, data_r: ranking, id: myID, best: mvp })
					})
			})
			.catch(err => {
				res.send({ Error: err })
			})
		newAction(req.session.ID, 'ON THE LEADERBOARD PAGE')
	}
})

const leaderboard = {
	name: 'leaderboard',
	stats: []
}

const ranking = {
	name: 'ranking',
	stats: []
}

const mvp = {
	name: 'mvp',
	stats: ''
}

function updateAverage(average, user) {
	const average_score = average
	const account_id = user
	db.pools
		.then((pool) => {
			// info 
			return pool.request()
				.input('account_id', account_id)
				.input('average_score', average_score)
				.query('UPDATE dbo.rankings SET average_score = @average_score WHERE account_id = @account_id;')
		})
}

function newAction(user_ID, action_details) {
	// enter action into the actions log
	const account_id = user_ID
	const action = action_details
	let current = new Date();
	let cDate = current.getFullYear() + '-' + (current.getMonth() + 1) + '-' + current.getDate();
	let cTime = current.getHours() + ":" + current.getMinutes() + ":" + current.getSeconds();
	let time = cDate + ' ' + cTime;
	db.pools
		.then((pool) => {
			return pool.request()
				.input('account_id', account_id)
				.input('action', action)
				.input('time', time)
				.query('INSERT INTO dbo.actions (account_id, action, time) VALUES (@account_id, @action, @time);')
		})
}

module.exports = router