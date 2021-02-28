const express = require('express');
const path = require('path');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const {
    userJoin,
    getCurrentUser,
    getNotCurrentUser,
    userLeave,
    userLength,
    usersIn
} = require('./utils/users');

const {
    getJogadorDaVez,
    setJogadorDaVez,
    setIniciarJogo,
    getJogoIniciado,
    setJogada,
    getJogadas,
} = require('./utils/game');

app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

//rota inical abre o front
app.use('/', (req, res) => {
    res.render('index.html');
});

//conectando no jogo
io.on('connection', (socket) => {
    console.log(`Socket conectado: ${socket.id}`);
    users = usersIn();

    //Evita que um terceiro jogador consiga entrar.
    if(userLength() >= 2 && getJogoIniciado()) {
        socket.emit('gameError', `Jogo ocupado!`);
        return;
    }

    socket.join("1");

    socket.on('disconnect', () => {
        userLeave(socket.id);
        setIniciarJogo(false);
        io.to("1").emit('PlayOut', `Jogador ${socket.id} saiu!`);
        return;
    });

    socket.on('Jogando', (data) => {
        console.log(`---------------> ${getJogadorDaVez().id}`);
        if(getJogadorDaVez().id == data.user) {
            console.log(`--------------->2`);
            setJogada(data.position, getJogadorDaVez().option);
            setJogadorDaVez(getNotCurrentUser(socket.id));

            io.to("1").emit('Joguei', getJogadas());
        }
        return;
    });

    //Usuario fica checando se é ou não a vez dele
    socket.on('MinhaVez', (data) => {

        if(getJogadorDaVez().id === data.user) {

            var obj = {
                suaVez: false,
                peca: getNotCurrentUser(socket.id).option,
                username: getNotCurrentUser(socket.id).username,
            };
        } else {

            var obj = {
                suaVez: true,
                peca: getNotCurrentUser(socket.id).option,
                username: getNotCurrentUser(socket.id).username,
            };
        }

        socket.broadcast.to("1").emit('SuaVez', obj);
        return;
    });


    newUser = 'user1';
    //Add novo jogador
    if(userLength() === 1) {
        newUser = users[0].username === 'user2' ? 'user1' : 'user2';
    }

    userJoin(socket.id, newUser);

    //Avisa que um novo jogador entrou
    socket.broadcast.to("1").emit('playIn', `Jogador ${socket.id} Entrou!`);

    //Envia jogadores do jogo
    io.to("1").emit('gameUsers', usersIn());

    //Inicia o jogo caso tenha 2 jogadores e o jogo não tenha sido iniciado
    if(userLength() >= 2 && !getJogoIniciado()) {
        setIniciarJogo(true);
        const rand = Math.floor(Math.random() * 2);
        setJogadorDaVez(users[rand]);
        io.to("1").emit('gameStart', 'Jogo iniciado!');
    }
});

server.listen(3000);
