const express = require('express')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const path = require('path')

const app = express()
app.use(express.json())
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

//1.API to get all players
app.get('/players/', async (request, response) => {
  const playersDetailsQuery = `
    SELECT * FROM cricket_team
  `
  const playersDetails = await db.all(playersDetailsQuery)
  console.log(playersDetails)
  response.send(playersDetails)
})

//2.API to add a new player
app.post('/players/', async (request, response) => {
  const playerDetails = request.body
  const {playerName, jerseyNumber, role} = playerDetails

  const addNewPlayerQuery = `
    INSERT INTO cricket_team (player_name,jersey_number,role) 
    VALUES ('${playerName}','${jerseyNumber}','${role}')
  `
  const newPlayer = await db.run(addNewPlayerQuery)
  console.log(newPlayer)
  response.send('Player Added to Team')
})

//3.API to get a player based on id
app.get('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const getPlayerQuery = `
    SELECT * FROM cricket_team WHERE player_id='${playerId}'
  `
  const playerDetails = await db.get(getPlayerQuery)
  console.log(playerDetails)
  response.send(playerDetails)
})

//4.API to update an existing player data
app.put('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const playerDetails = request.body
  const {playerName, jerseyNumber, role} = playerDetails

  const updateQuery = `
    UPDATE cricket_team SET player_name='${playerName}',jersey_Number='${jerseyNumber}',role='${role}' 
    WHERE player_id='${playerId}'
  `
  await db.run(updateQuery)
  response.send('Player Details Updated')
})

//5.API to delete a player based on id
app.delete('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const deleteQuery = `
    DELETE from cricket_team WHERE player_id='${playerId}'
  `
  await db.run(deleteQuery)
  response.send('Player Removed')
})

module.exports = app
