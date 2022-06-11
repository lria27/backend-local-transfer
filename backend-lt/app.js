const express = require("express")
require('dotenv').config()
const mongoose = require("mongoose")
const app = express()
const auth = require('./routes/Autorization')
const goods = require('./routes/Moves')
const history = require('./routes/History')
const PORT = process.env.PORT || 5000
const URI = process.env.MONGO_URI
const cors = require("cors");
const path = require("path");

app.use(cors());
app.use(express.json({extended: true}))
app.use('/public', express.static(path.join(__dirname, 'public')))
app.use('/api/auth', auth)
app.use('/api/goods', goods)
app.use('/api/history', history)
app.get('/', (req, res)=>{
  res.send('Hi! I am API')
})
async function start(){
  try{
    await mongoose.connect(URI,{})
    app.listen(PORT, ()=>{
      console.log(`Server started on port ${PORT}...`);
    })
  }catch(e){
    console.log(e)
    process.exit(1)
  }
}

start()
