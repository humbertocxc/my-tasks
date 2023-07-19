import fs from 'node:fs/promises'

const databasePath = new URL('../db.json', import.meta.url)

export class Database {
  #database = {}

  constructor() {
    fs.readFile(databasePath, 'utf8')
      .then(data => this.#database = JSON.parse(data))
      .catch(() => this.#persist())
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database))
  }

  list(table) {
    const data = this.#database[table] ?? []
    return data
  }

  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data)
    } else {
      this.#database[table] = [data]
    }

    this.#persist()

    return data
  }

  remove(table, id) {
    const index = this.#database[table].findIndex(element => id === element.id)

    if (index > -1) {
      this.#database[table].splice(index, 1)
      this.#persist()
      return true
    }

    return false
  }

  update(table, id, title, description, updated_at) {
    const index = this.#database[table].findIndex(element => id === element.id)

    if (index > -1) {
      const data = this.#database[table][index]

      data.title = title
      data.description = description
      data.updated_at = updated_at

      this.#database[table][index] = data
      this.#persist()

      return data
    }

    return
  }

  complete(table, id, completed_at) {
    const index = this.#database[table].findIndex(element => id === element.id)

    if (index > -1) {
      const data = this.#database[table][index]
      data.completed_at = completed_at
      this.#database[table][index] = data

      return true
    }

    return false
  }
}
