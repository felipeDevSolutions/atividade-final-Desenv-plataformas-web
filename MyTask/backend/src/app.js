require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const userRoutes = require('./routes/userRoutes');

const app = express();

const corsOptions = {
  origin: [
    'http://localhost:3000', // URL do seu frontend local
    'https://app-fiz.firebaseapp.com' // URL do seu aplicativo web no Firebase
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Permite todos os métodos
  allowedHeaders: 'Content-Type,Authorization', // Permite cabeçalhos importantes
  credentials: true // Permite cookies e credenciais
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // limita cada IP a 100 requisições por `window` (aqui, por 15 minutos)
  message: 'Muitas requisições criadas a partir deste IP, por favor tente novamente após 15 minutos'
});

app.use('/api/', apiLimiter);

app.use('/api', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
