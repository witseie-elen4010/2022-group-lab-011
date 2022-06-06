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
					// Select actions table
					.query('SELECT * FROM dbo.actions ORDER BY id DESC;')
			})
			.then(result => {
				let columns = ['id', 'account_id', 'action', 'time']
				let cols = columns.length
				let rows = result.recordset.length
				if (rows > 0) {
					const myTable = Array.from(Array(rows), () => new Array(cols));
					for (let row = 0; row < rows; row++) {
						for (let col = 0; col < cols; col++) {
							let x = result.recordsets[0][row][columns[col]]
							myTable[row][col] = x
						}
					}
					actions_log.stats = myTable
				}
				res.render('users/actions_log', { data: actions_log, id: myID })
			})
			.catch(err => {
				res.send({ Error: err })
			})
	}
})

const actions_log = {
	name: 'actions_log',
	stats: []
}

module.exports = router