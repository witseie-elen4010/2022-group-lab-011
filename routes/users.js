const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    console.log(req.query.username)
    res.send('User List')
})

router.get('/new', (req, res) => {
    res.render("users/new")
})   

//router.get('/home', (req, res) => {
//    console.log('we are here')
//    res.render("users/home")
//})

router.post('/', (req, res) => {
    const isValid = true
    let x = req.body.username
    let y = req.body.password
    //verify(x, y)
    if (isValid) {
        users.push( {username: x, password: y})
        //console.log(users)
        //console.log(users[0])
        z = users.length - 1
        res.redirect('/users/'+z)
    } else {
        console.log("Error")
        res.render('users/new', { username: x})
    }
    console.log(x)
    res.send("Hi "+x)
})

router
    .route("/:id")
    .get((req, res) => {
        let x = req.params.id
        let y = users[x].username
        let z = users[x].password
        console.log(y)
        console.log(z)
        console.log('we here!')
        res.redirect('/home')
    })
    .put((req, res) => {
        let x = req.params.id
        res.send('Update User with ID '+x)
    })
    .delete((req, res) => {
        let x = req.params.id
        res.send('Delete User with ID '+x)
    })

const users = [{ username: "Kyle", password: "1234"}, { username: "Sally", password: "1234"}]

router.param('id', (req, res, next, id) => {
    req.user = users[id]
    //console.log('we are here')
    next()
})

//function verify(x, y){
 //   for (let i in users) {
  //      if (x === users[i].username){
   //         console.log('match') 
     //   } else {
     //       consolve.log('nope')
     //   }

  //  }
//}

module.exports = router