const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  const user = users.find(user => user.username === username)

  if (!user) return response.status(404).json({ error: 'Username not found!' })

  request.user = user;

  return next();
}

app.post('/users', (request, response) => {
  const { name, username } = request.body;

  const usernameAlreadyExists = users.some(user => user.username === username)

  if (usernameAlreadyExists) return response.status(400).json({ error: 'Username Already Exists!' })

  users.push({
    id: uuidv4(),
    name,
    username,
    todos: []
  });

  return response.status(201).json(users[0]);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;

  return response.status(200).json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;
  const { user } = request;

  const arrayTodos = user.todos;

  const createTodo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }

  arrayTodos.push(createTodo);

  return response.status(201).json(createTodo);
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { id } = request.params;
  const { title, deadline } = request.body;
  const { user } = request;

  const arrayTodos = user.todos;
  const todoIndex = arrayTodos.findIndex(index => index.id === id);

  if (todoIndex < 0) return response.status(404).json({ error: 'Id not found!' });

  const todo = {
    ...arrayTodos[todoIndex],
    title,
    deadline: new Date(deadline)
  };

  arrayTodos[todoIndex] = todo;

  return response.status(201).json(todo);
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;