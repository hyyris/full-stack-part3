const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://phonebook:${password}@cluster0.bd8bi.mongodb.net/phonebook?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
  id: Number,
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

mongoose
  .connect(url)
  .then((result) => {
    console.log('connected')
    if (process.argv.length > 3) {
        // Tallennetaan henkilö
        const name = process.argv[3]
        const number = process.argv[4]
        const person = new Person({
          name: name,
          number: number
        })
        console.log(`added ${name} number ${number} to phonebook`);
        return person.save().then(() => mongoose.connection.close());
    } else {
      // Haetaan tallennetut
      Person.find({}).then(persons => {
        console.log('phonebook:');
        persons.forEach(person => {
          console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
      });
    }
  })
  .catch((err) => console.log(err))