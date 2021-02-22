const express = require('express');
const path = require('path');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

let users = [];

//rota inical abre o front
app.use('/', (req, res) => {
    res.render('index.html');
});

//conectando no jogo
io.on('connection', (socket) => {
   console.log(`Socket conectado: ${socket.id}`);

    users.push(socket.id);

    var messageObject = {
        user: users.length === 1 ? 'user1': 'user2',
        id: socket.id,
    };

    socket.broadcast.emit('playIn', messageObject);

   if(users.length >= 2 ) {
       socket.broadcast.emit('gameStart');
   }

    socket.on('disconnect', () => {
        const index = users.findIndex(user => user.id === socket.id);

        if(index !== -1) {
            return users.splice(index, 1)[0];
        }

        console.log(`Socket ${socket.id} saiu!`);
    });
});

server.listen(3000);
