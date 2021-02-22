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

    if(users.length >= 2 ) {
        socket.emit('gameError', `Jogo ocupado!`);
        return;
    }

    socket.join("1");



    socket.on('disconnect', () => {
        const index = users.findIndex(user => user.id === socket.id);

        if(index !== -1) {
            return users.splice(index, 1)[0];
        }

        socket.broadcast.to("1").emit('PlayOut', `Jogador ${socket.id} saiu!`);
    });

    let messageObject = {
        user: `user${users.length}`,
        id: socket.id
    };

    users.push(messageObject);

    console.log(`users ${users.length}`);

    socket.broadcast.to("1").emit('playIn', messageObject);

    io.to("1").emit('gameUsers', users);

    if(users.length >= 2 ) {
        socket.broadcast.to("1").emit('gameStart',);
    }
});

server.listen(3000);
