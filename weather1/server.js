const express = require('express'); 
const sqlite3 = require('sqlite3').verbose(); 
const cors = require('cors'); 

const app = express(); 
const port = 3000; 

app.use(cors()); 
app.use(express.json()); 


const db = new sqlite3.Database('./sehirler.db');


db.run(`CREATE TABLE IF NOT EXISTS aramalar (id INTEGER PRIMARY KEY AUTOINCREMENT, city TEXT )`);


app.get('/api/history', (req, res) => { 
    db.all('SELECT city FROM aramalar ORDER BY id DESC LIMIT 5', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message }); 
        const cities = rows.map(row => row.city); 
        res.json(cities); 
    });
});

app.post('/api/history', (req, res) => {  
    console.log("post isteği alındı, gelen veri:", req.body); 
    const { city } = req.body;  
    if (!city) return res.status(400).json({ error: 'city boş olamaz' }); 

    db.run('INSERT INTO aramalar (city) VALUES (?)', [city], function (err) { 
        if (err) return res.status(500).json({ error: err.message }); 
        res.json({ success: true, id: this.lastID }); 
    });
});

app.listen(port, () => { 
    console.log(`Database çalışıyor: http://localhost:${port}`); 
});