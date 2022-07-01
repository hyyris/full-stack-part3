require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
morgan.token('body', function getId (req) {
    return JSON.stringify(req.body)
})
app.use(morgan('tiny'))
app.use(morgan(':body', {
    skip: function (req, res) { return req.method !== 'POST' }
}))

app.get('/info', (req, res) => {
  console.log(req);
  Person.find({}).then(persons => {
    res.send(`
      <p>Phonebook has info for ${persons.length} people</p>
      <p>${new Date()}</p>
    `)
  });
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
  } /*else if (persons.find(p => p.name === body.name)) {
    return response.status(400).json({ 
        error: 'name must be unique'
      })
  }*/

  const person = new Person({
    name: body.name,
    number: body.number,
  });
  person.save().then(savedPerson => {
    response.json(savedPerson)
  });
  
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  });
})

app.delete('/api/persons/:id', (request, response) => {
  Person.findByIdAndRemove(request.params.id).then(result => response.status(204).end())
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    if (person) {
      response.json(person);
    } else {
      response.status(404).end()
    }
  },
  () => response.status(400).json({ 
    error: 'Error'
  }))
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})