const express = require('express');
const cors = require('cors');
const { v4: uuid } = require('uuid');

const NAME_PATTERN = /^((\p{Lu}{1})\S(\p{Ll}{1,20})[^0-9])+[-'\s]((\p{Lu}{1})\S(\p{Ll}{1,20}))*[^0-9]$/u
const USERNAME_PATTERN = /^[a-zA-Z]([._-](?![._-])|[a-zA-Z0-9]){3,18}[a-zA-Z0-9]$/u

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

  if (!NAME_PATTERN.test(name))
    return response.status(400).json({ error: "invalid name" })

  if (!USERNAME_PATTERN.test(username))
    return response.status(400).json({ error: "invalid username" })
  
  const findUsername = users.some((user) => user.username === username)

  if (findUsername)
    return response.status(400).json({ error: "username already exists" })

  users.push({ id: uuid(), username, name, todos: [] })

  return response.status(201).send()
});

app.get('/todos', userGuard, (request, response) => {
  // Complete aqui
});

app.post('/todos', userGuard, (request, response) => {
  // Complete aqui
});

app.put('/todos/:id', userGuard, (request, response) => {
  // Complete aqui
});

app.patch('/todos/:id/done', userGuard, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', userGuard, (request, response) => {
  // Complete aqui
});

module.exports = app;