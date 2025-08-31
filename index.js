const express = require('express')
const mongoose = require('mongoose');
const Show = require('./models/show.model.js')
const cors = require('cors');
const app = express()

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/tvshows')
    .then(() => {
        console.log("Connected!");
        app.listen(3000, () => {
            console.log('Server is running on port 3000');
        });
    })
    .catch(() => {
        console.log("Connection failed");
    });

//GET route
app.get('/', (req, res) => {
    res.send("GET from API") 
});

//GET all shows
app.get('/api/shows', async (req,res) => {
    try {
        const shows = await Show.find({});
        res.status(200).json(shows);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

//GET one show
app.get('/api/show/:id', async (req,res) => {
    try {
        const { id } = req.params;
        const show = await Show.findById(id);
        res.status(200).json(show);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

//UPDATE show
app.put('/api/show/:id', async (req,res) => {
    try {
       const {id} = req.params;
       const show = await Show.findByIdAndUpdate(id, req.body);
        if(!show){
            return res.status(404).json({message: "show not found"});
        }
       const updatedProduct = await Show.findById(id)
       res.status(200).json(updatedProduct)
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

//POST show
app.post('/api/shows', async (req, res) => {
    try {
        const show = await Show.create(req.body);
        res.status(200).json(show);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

//DELETE show
app.delete('/api/show/:id', async (req,res) => {
    try {
        const {id} = req.params;
        const show = await Show.findByIdAndDelete(id);
        if(!show){
            return res.status(404).json({message: "show not found"});
        }
        res.status(200).json({message: "show deleted succesfully", show});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});