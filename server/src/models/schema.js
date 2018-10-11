const db = require('./db')

const articleSchema = new db.Schema({
  title: String,
	date: Date,
	articleContent: String,
	state: String,
  label: String,
  pv: Number,
  uv: Number
})

const tagSchema = new db.Schema({
  tagName: String,
  tagNumber: Number,
})

const userSchema = new db.Schema({
  name: String,
  pwd: String,
  blogname: String,
  github: String,
  email: String,
  phone: String
})

const fansSchema = new db.Schema({
  email: String
})

const Models = {
  Article: db.model('Article', articleSchema),
  Tag: db.model('TagList', tagSchema),
  User: db.model('User', userSchema),
  Fans: db.model('Fans', fansSchema)
}

module.exports = Models