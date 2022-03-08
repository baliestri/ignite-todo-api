const express = require('express');
const cors = require('cors');
const { v4: uuid } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function userGuard(request, response, next) {
  const { username } = request.headers

  const user = users.find((user) => user.username === username)

  if (!user)
    return response.status(401).json({ error: "user not found" })

  request.user = user

  return next()
}

app.post('/users', (request, response) => {
  const { username, name } = request.body

  if (!username || !name)
    return response.status(400).json({ error: "missing required fields" })

  const findUsername = users.some((user) => user.username === username)

  if (findUsername)
    return response.status(400).json({ error: "username already exists" })

  const user = { id: uuid(), username, name, todos: [] }

  users.push(user)

  return response.status(201).json(user)
});

app.get('/todos', userGuard, (request, response) => {
  const { user } = request

  return response.json(user.todos)
});

app.post('/todos', userGuard, (request, response) => {
  const { user } = request
  const { title, deadline } = request.body

  if (!title || !deadline)
    return response.status(400).json({ error: "missing required fields" })

  const todo = {
    id: uuid(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }

  user.todos.push(todo)

  return response.status(201).json(todo)
});

app.put('/todos/:id', userGuard, (request, response) => {
  const { user } = request
  const { title, deadline } = request.body
  const { id } = request.params

  const todo = user.todos.find((todo) => todo.id === id)
 
  if (!title || !deadline)
    return response.status(400).json({ error: "missing required fields" })

  if (!todo)
    return response.status(404).json({ error: "todo not found" })

  todo.title = title
  todo.deadline = new Date(deadline)

  return response.json(todo)
});

app.patch('/todos/:id/done', userGuard, (request, response) => {
  const { user } = request
  const { id } = request.params

  const todo = user.todos.find((todo) => todo.id === id)

  if (!todo)
    return response.status(404).json({ error: "todo not found" })

  todo.done = true

  return response.json(todo)
});

app.delete('/todos/:id', userGuard, (request, response) => {
  const { user } = request
  const { id } = request.params

  const todo = user.todos.find((todo) => todo.id === id)

  if (!todo)
    return response.status(404).json({ error: "todo not found" })

  user.todos.splice(todo, 1)

  return response.status(204).json(todo)
});

module.exports = app;