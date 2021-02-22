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
let gameInit = false;

//rota inical abre o front
app.use('/', (req, res) => {
    res.render('index.html');
});

//conectando no jogo
io.on('connection', (socket) => {
    console.log(`Socket conectado: ${socket.id}`);

    if(users.length >= 2 && gameInit) {
        socket.emit('gameError', `Jogo ocupado!`);
        return;
    }

    socket.join("1");



    socket.on('disconnect', () => {

        const index = users.findIndex(user => user.id === socket.id);
        console.log(`ERROR ${index}`);
        if(index !== -1) {
            users.splice(index, 1);
            gameInit = false;
            io.to("1").emit('PlayOut', `Jogador ${socket.id} saiu!`);
            return;
        }
    });

    let messageObject = {
        user: `user${users.length + 1}`,
        id: socket.id
    };

    users.push(messageObject);

    console.log(`users ${users.length}`);

    socket.broadcast.to("1").emit('playIn', `Jogador ${socket.id} Entrou!`);

    io.to("1").emit('gameUsers', users);

    console.log(`tamanho: ${users.length}`);
    console.log(`iniciado: ${gameInit}`);
    if(users.length >= 2 && !gameInit) {
        gameInit = true;
        io.to("1").emit('gameStart', 'Jogo iniciado!');
    }
});

server.listen(3000);
