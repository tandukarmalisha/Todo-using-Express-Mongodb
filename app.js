const express = require('express');
const mongoose = require('mongoose');
const Todo = require('./models/todo');

const app = express();

app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb+srv://todo_user:todo1234@todocluster.by5evmo.mongodb.net/tododb?retryWrites=true&w=majority&appName=TodoCluster', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("✅ Connected to MongoDB Atlas!");
}).catch(err => {
  console.error("❌ MongoDB connection error:", err);
});


app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
  try {
    const todos = await Todo.find(); // get all todos
    res.render('index', { todos });  // pass them to EJS
  } catch (err) {
    res.status(500).send('Error loading TODOs');
  }
});

// app.post('*', (req, res, next) => {
//   console.log("👉 Received a POST request to:", req.originalUrl);
//   next();
// });

app.post('/add', async (req, res) => {
  console.log("🔥 POST /add hit!");
  console.log("Body:", req.body);

  const { task } = req.body;

  try {
    await Todo.create({ task, done: false });
    res.redirect('/');
  } catch (err) {
    res.status(500).send('Failed to add task');
  }
});

// app.post('/add', async (req, res) => {
//   const { task } = req.body;

//   try {
//     await Todo.create({ task, done: false });
//     res.redirect('/'); // go back to homepage after adding
//   } catch (err) {
//     res.status(500).send('Failed to add task');
//   }
// });

app.post('/toggle/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const todo = await Todo.findById(id);
    todo.done = !todo.done; // toggle true/false
    await todo.save();
    res.redirect('/');
  } catch (err) {
    res.status(500).send('Failed to toggle task');
  }
});


app.listen(3000, () => {
  console.log('Server is running at http://localhost:3000');
});
