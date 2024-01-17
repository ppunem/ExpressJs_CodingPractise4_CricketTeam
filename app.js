const express = require('express')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const path = require('path')

const app = express()
const dbPath = path.join(__dirname, 'cricketTeam.db')

let db = null

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })

    app.listen(3000, () => {
      console.log(
        'DBconnection successfully Initialized and server running on https://localhost:3000/',
      )
    })
  } catch (error) {
    console.log(`Error is : ${error.message}`)
    process.exit(1)
  }
}

initializeDbAndServer()

app.get('/players/', async (request, response) => {
  const playerDetailsQuery = `
    SELECT * FROM cricket_team
  `
  const playerDetails = await db.all(playerDetailsQuery)
  response.send(playerDetails)
})
