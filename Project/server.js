const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const path = require('path');
const multer = require('multer');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const User = require('./models/userModel');
const Image = require('./models/imageModel');
const Contact = require('./models/contactModel');

const app = express();

// Determine if the app is running in production
const isProduction = process.env.NODE_ENV === 'production';

// Session Middleware
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ 
        mongoUrl: 'mongodb://localhost:27017/eliteDesignsDB',
    }),
    cookie: { 
        maxAge: 24 * 60 * 60 * 1000, 
        secure: isProduction, 
        httpOnly: true
    }
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/eliteDesignsDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log('Error connecting to MongoDB:', err));

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Authentication Middleware
function isAuthenticated(req, res, next) {
    if (req.session.userId) {
        next(); 
    } else {
        res.redirect('/login.html'); 
    }
}

app.get('/', (req, res) => {
    if (req.session.userId) {
        res.redirect('/home.html');
    } else {
        res.sendFile(path.join(__dirname, 'public/login.html'));
    }
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/signup.html'));
});

app.get('/home.html', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'public/home.html'));
});

app.get('/explore.html', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'public/explore.html'));
});

app.get('/upload.html', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'public/upload.html'));
});

app.get('/contact.html', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'public/contact.html'));
});

// Signup 
app.post('/signup', async (req, res) => {
    try {
        const { username, email , password } = req.body;
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).send('User already exists');
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        res.redirect('/login.html');
    } catch (err) {
        console.error('Error signing up:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Login
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).send('User not found');
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).send('Invalid password');
        }
        req.session.userId = user._id;
        req.session.username = user.username;
        res.redirect('/home.html');
    } catch (err) {
        console.error('Error logging in:', err);
        res.status(500).send('Internal Server Error');
    }
});

// User Details 
app.get('/user-details', (req, res) => {
    if (req.session.userId) {
        res.json({ isLoggedIn: true, username: req.session.username });
    } else {
        res.json({ isLoggedIn: false });
    }
});

// Logout 
app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error logging out:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.redirect('/login.html');
    });
});

// Image Upload
app.post('/upload', isAuthenticated, upload.single('profileImage'), async (req, res) => {
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
app.get('/image/:id', isAuthenticated, async (req, res) => {
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

// Contact Form
app.post('/contact', isAuthenticated, async (req, res) => {
    try {
        const { firstname, lastname, email, mobile, concern } = req.body;
        console.log('Contact form submitted:', req.body);
        const newContact = new Contact({
            firstname,
            lastname,
            email,
            mobile,
            concern
        });
        await newContact.save();

        res.json({ message: 'Contact information received successfully!' });
    } catch (err) {
        console.error('Error handling contact form:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});