require("dotenv-safe").config();

const express = require('express'); 
const cookieParser = require('cookie-parser');
const path = require('path');

const http = require("http");

const apiRoute = require('./routes/api');

const socketHandler = require('./helpers/socketHandler');

const app = express(); 
const httpServer = http.createServer(app);
socketHandler.createIo(httpServer);
 
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());

app.use(express.static('../client/public'));

app.use('/api', apiRoute);

app.get('/*', (req, res, next) => {
  if(req.url.startsWith('/api')) return next();

  res.sendFile(path.join(__dirname, '../client/public/index.html'));
})

const PORT = process.env.PORT || 3000;

const server = httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});