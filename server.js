const express = require('express');
const path = require('path');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const {
    userJoin,
    getCurrentUser,
    userLeave,
    userLength,
    usersIn
} = require('./utils/users');

app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

let gameInit = false;

//rota inical abre o front
app.use('/', (req, res) => {
    res.render('index.html');
});

//conectando no jogo
io.on('connection', (socket) => {
    console.log(`Socket conectado: ${socket.id}`);

    if(userLength() >= 2 && gameInit) {
        socket.emit('gameError', `Jogo ocupado!`);
        return;
    }

    socket.join("1");



    socket.on('disconnect', () => {
        userLeave(socket.id);
        gameInit = false;
        io.to("1").emit('PlayOut', `Jogador ${socket.id} saiu!`);
        return;
    });


    const user = userJoin(socket.id, `user${userLength() + 1}`);

    socket.broadcast.to("1").emit('playIn', `Jogador ${socket.id} Entrou!`);

    io.to("1").emit('gameUsers', usersIn());
    
    if(userLength() >= 2 && !gameInit) {
        gameInit = true;
        io.to("1").emit('gameStart', 'Jogo iniciado!');
    }
});

server.listen(3000);
