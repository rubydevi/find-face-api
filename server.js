const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

const app = express(); // create an instance of express

app.use(express.json()); // middleware
app.use(cors()); // middleware

// Dummy database
const database = {
  users: [
    {
      id: '123',
      name: 'John',
      email: 'john@gmail.com',
      password: 'cookies',
      entries: 0,
      joined: new Date()
    },
    {
      id: '124',
      name: 'Sally',
      email: 'sally@gmail.com',
      password: 'bananas',
      entries: 0,
      joined: new Date()
    }
  ]
}

app.get('/', (req, res) => {
  res.send(database.users);;
});

// Signin endpoint
app.post('/signin', (req, res) => {
  if (req.body.email === database.users[0].email &&
      req.body.password === database.users[0].password)
  {
    res.json(database.users[0]);
  }
  else
  {
    res.status(400).json('error logging in');
  }
});

// Register endpoint
app.post('/register', (req, res) => {
  const { email, name, password} = req.body;
  bcrypt.hash(password, null, null, function(err, hash) {
    // Store hash in your password DB.
    console.log(hash);
  });
  database.users.push({
    id: '125',
    name: name,
    email: email,
    entries: 0,
    joined: new Date()
  });
  res.json(database.users[database.users.length-1]);
});

// Profile endpoint
app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  let found = false;
  database.users.forEach(user => {
    if (user.id === id) {
      found = true;
      return res.json(user);
    }
  });
  if (!found) {
    res.status(400).json('not found');
  }
});

app.put('/image', (req, res) => {
  const { id } = req.body;
  let found = false;
  database.users.forEach(user => {
    if (user.id === id) {
      found = true;
      user.entries++;
      return res.json(user.entries);
    }
  });
  if (!found) {
    res.status(400).json('not found');
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000!');
});

/*
  / res
  /signin --> POST = success/fail
  /register --> POST = user
  /profile/:userId --> GET = user
  /image --> PUT --> user
*/