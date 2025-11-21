const express = require('express');
const path = require('path');
const { exportPlaces,setCancel} = require('./routes/export');

const app = express();
app.use(express.json());

// Serve frontend
app.use(express.static(path.join(__dirname, 'public')));

// API route
app.post('/export', exportPlaces);


app.post("/cancel", (req, res) => {
  setCancel(true);
  res.json({ ok: true });
});
app.listen(3000, () => console.log('Server running on http://localhost:3000'))