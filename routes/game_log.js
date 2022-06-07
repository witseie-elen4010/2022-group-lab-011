const express = require('express')
const router = express.Router()
const db = require('../dbconfig.js')

router.get('/', (req, res) => {
	if (!req.session.ID) {
		res.redirect('/login')
	} else {
		let myID1 = req.session.ID
		let myID2 = req.session.ID
		db.pools
			// Run query
			.then((pool) => {
				return pool.request()
					// Select game log
					.query('SELECT * FROM dbo.solo_game_log JOIN dbo.accounts ON dbo.solo_game_log.account_id = dbo.accounts.id ORDER BY solo_game_log.id DESC;')
			})
			.then(result => {
				let columns = ['username', 'guess_1', 'guess_2', 'guess_3', 'guess_4', 'guess_5', 'guess_6', 'word']

				let cols = columns.length
				let rows = result.recordset.length
				let temp
				if (rows > 0) {
					const myTable = Array.from(Array(rows), () => new Array(cols));
					for (let row = 0; row < rows; row++) {
						temp = result.recordsets[0][row]['account_id']
						if (temp === myID1) {
							myID1 = result.recordsets[0][row]['username']
						}
						for (let col = 0; col < cols; col++) {
							if (columns[col] === 'id') {
								x = row + 1
							} else {
								x = result.recordsets[0][row][columns[col]]
							}
							myTable[row][col] = x
						}
					}
					solo_game_log.stats = myTable
				}
			})
			.then(result => {
				db.pools
					// Run query
					.then((pool) => {
						return pool.request()
							// Select game log
							.query('SELECT * FROM dbo.multi_game_log JOIN dbo.accounts ON dbo.multi_game_log.account_id = dbo.accounts.id ORDER BY multi_game_log.game_id DESC;')
					})
					.then(result => {
						let columns1 = ['game_id', 'username', 'opponent_id', 'admin_id', 'winner']
						let columns2 = ['game_id', 'username', 'guess_1', 'guess_2', 'guess_3', 'guess_4', 'guess_5', 'guess_6', 'word']
						let cols1 = columns1.length
						let cols2 = columns2.length
						let rows = result.recordset.length
						let y
						let z
						if (rows > 0) {
							const myTable1 = Array.from(Array(rows), () => new Array(cols1));
							const myTable2 = Array.from(Array(rows), () => new Array(cols2));
							for (let row = 0; row < rows; row++) {
								temp = result.recordsets[0][row]['account_id']
								if (temp === myID2) {
									myID2 = result.recordsets[0][row]['username']
								}
								for (let col = 0; col < cols1; col++) {
									if (columns1[col] === 'id') {
										y = row + 1
									} else {
										y = result.recordsets[0][row][columns1[col]]
										if (columns1[col] === 'admin_id' && y === 0) y = 'NO ADMIN'
									}
									myTable1[row][col] = y
								}
								for (let col = 0; col < cols2; col++) {
									if (columns2[col] === 'id') {
										z = row + 1
									} else {
										z = result.recordsets[0][row][columns2[col]]
									}
									myTable2[row][col] = z
								}
							}
							multi_game_log_1.stats = myTable1
							multi_game_log_2.stats = myTable2
						}
						res.render('users/game_log', { data_multi_1: multi_game_log_1, data_multi_2: multi_game_log_2, data_solo: solo_game_log, id1: myID1, id2: myID2 })
					})
			})

			.catch(err => {
				res.send({ Error: err })
			})
		newAction(req.session.ID, 'ON THE GAME LOG PAGE')
	}
})

const solo_game_log = {
	name: 'solo_game_log',
	stats: []
}

const multi_game_log_1 = {
	name: 'multi_game_log_1',
	stats: []
}

const multi_game_log_2 = {
	name: 'multi_game_log_2',
	stats: []
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