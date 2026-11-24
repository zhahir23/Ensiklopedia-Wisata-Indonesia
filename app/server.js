const express = require('express');
const path = require('path');
const publicRoutes = require('../routes/publicRoutes');

const app = express();
const PORT = 3000;

// Menyajikan file statis (CSS, JS, gambar) dari folder public
app.use(express.static(path.join(__dirname, '../public')));

// Menggunakan router dari folder routes
app.use('/', publicRoutes);

app.listen(PORT, () => {
console.log(`Server berjalan di http://localhost:${PORT}`);
});