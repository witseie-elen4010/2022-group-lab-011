const express = require('express')
const router = express.Router()
const db = require('../dbconfig.js')

router.get('/', (req, res) => {
	console.log(req.session.ID)
	if (!req.session.ID) {
		res.redirect('/login')
	} else {
		res.render('users/rules')
		newAction(req.session.ID, 'ON THE RULES PAGE')
	}
})

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