const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const memberRoutes = require('./routes/member');
const memberModel = require('./models/member');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads')); 

mongoose.connect('mongodb://127.0.0.1:27017/test2')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

app.use('/api/members', memberRoutes);


// เพิ่ม EJS view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));



app.get('/index', async (req, res) => {
    try {
        const members = await memberModel.find();
        res.render('index', { members });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

app.get('/add-member', (req, res) => {
    res.render('addMember');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
