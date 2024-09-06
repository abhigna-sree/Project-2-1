const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const path = require('path');
const multer = require('multer');

const User = require('./models/userModel');
const Image = require('./models/imageModel');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/eliteDesignsDB')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log('Error connecting to MongoDB:', err));

// Configure multer for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Route to handle image upload
app.post('/upload', upload.single('profileImage'), async (req, res) => {
    try {
        const { userId } = req.body;
        const { originalname, mimetype, buffer } = req.file;

        const newImage = new Image({
            data: buffer,
            contentType: mimetype,
            userId
        });

        await newImage.save();
        res.json({ message: 'Image uploaded successfully', imageUrl: `/image/${newImage._id}` });
    } catch (err) {
        console.error('Error uploading image:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Route to serve uploaded images
app.get('/image/:id', async (req, res) => {
    try {
        const image = await Image.findById(req.params.id);
        if (!image) {
            return res.status(404).send('Image not found');
        }
        res.set('Content-Type', image.contentType);
        res.send(image.data);
    } catch (err) {
        console.error('Error fetching image:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Other routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/login.html'));
});
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/signup.html'));
});
app.get('/home.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/home.html'));
});
app.get('/upload.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/upload.html'));
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
