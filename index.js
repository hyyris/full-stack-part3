const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]
app.use(cors())
app.use(express.json())
morgan.token('body', function getId (req) {
    return JSON.stringify(req.body)
})
app.use(morgan('tiny'))
app.use(morgan(':body', {
    skip: function (req, res) { return req.method !== 'POST' }
}))

app.get('/', (req, res) => {
  res.send('<h1>Phonebook backend</h1>')
})

app.get('/info', (req, res) => {
    console.log(req);
  res.send(`
  <p>Phonebook has info for ${persons.length} people</p>
  <p>${new Date()}</p>
  `)
})

const generateId = () => {
  return Math.floor(Math.random() * 999999)
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'Missing name or number'
    })
  } else if (persons.find(p => p.name === body.name)) {
    return response.status(400).json({ 
        error: 'name must be unique'
      })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }

  persons = persons.concat(person)

  response.json(person)
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(p => p.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})