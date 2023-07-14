import { randomUUID } from 'node:crypto'
import { Database } from "./database.js"
import { buildRoutePath } from './utils/build-route-path.js'

const database = new Database()

export const routes = [
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body

      if (!title || !description) {
        return res.writeHead(404).end(JSON.stringify({ message: "Sem título ou descrição!" }))
      }

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: Date.now(),
        updated_at: Date.now(),
      }

      database.insert('tasks', task)

      return res.writeHead(201).end(JSON.stringify({ message: 'Task criada com sucesso!' }))
    }
  },

  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const tasks = database.select('tasks')
      return res.end(JSON.stringify(tasks))
    }
  },

  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { title, description } = req.body
      const { id } = req.params
      const now = Date.now()

      if (!title || !description) {
        return res.writeHead(404).end(JSON.stringify({ message: "Sem título ou descrição!" }))
      }

      const update = database.update('tasks', id, title, description, now)

      if (update) {
        return res.writeHead(200).end(JSON.stringify({ message: 'Task atualizada com sucesso!' }))
      }

      return res.writeHead(404).end(JSON.stringify({ message: 'Task não encontrada!' }))
    }
  },

  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const task = database.remove('tasks', id)

      if (task) {
        return res.writeHead(200).end(JSON.stringify({ message: 'Task deletada com sucesso!' }))
      }

      return res.writeHead(404).end(JSON.stringify({ message: 'Task não encontrada!' }))
    }
  },

  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params
      const now = Date.now()
      const task = database.complete('tasks', id, now)

      if (task) {
        return res.writeHead(200).end(JSON.stringify({ message: 'Task completa!' }))
      }

      return res.writeHead(404).end(JSON.stringify({ message: 'Task não encontrada!' }))
    }
  }
]
