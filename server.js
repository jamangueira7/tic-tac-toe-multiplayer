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

const {
    getJogadorDaVez,
    setJogadorDaVez,
    setIniciarJogo,
    getJogoIniciado,
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

    //Usuario fica checando se é ou não a vez dele
    socket.on('MinhaVez', (data) => {
        if(users[getJogadorDaVez()].id == data.user) {
            var obj = {
                user: data.user,
                suaVez: true,
                peca: getCurrentUser(socket.id).option,
                username: getCurrentUser(socket.id).username,
            }
            socket.to("1").emit('SuaVez', obj);
        } else {
            var obj = {
                user: data.user,
                suaVez: false,
                peca: getCurrentUser(socket.id).option,
                username: getCurrentUser(socket.id).username,
            }
            socket.to("1").emit('SuaVez', obj);
        }
        //data.user
        return;
    });


    //Add novo jogador
    newUser = userLength() === 1 ? 'user2' : 'user1';
    userJoin(socket.id, newUser);

    //Avisa que um novo jogador entrou
    socket.broadcast.to("1").emit('playIn', `Jogador ${socket.id} Entrou!`);

    //Envia jogadores do jogo
    io.to("1").emit('gameUsers', usersIn());

    //Inicia o jogo caso tenha 2 jogadores e o jogo não tenha sido iniciado
    if(userLength() >= 2 && !getJogoIniciado()) {
        setIniciarJogo(true);
        const rand = Math.floor(Math.random() * 2);
        setJogadorDaVez(rand);
        io.to("1").emit('gameStart', 'Jogo iniciado!');
    }
});

server.listen(3000);
