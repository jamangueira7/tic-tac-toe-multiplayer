let tabuleiro =  ['', '', '', '', '', '', '', '', ''];

const sequencia_vencedora =  [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
];

let jogoIniciado = [];

let jogador_vez = '';

let primeiro_a_jogar = '';

function getJogadorDaVez() {
    return jogador_vez;
}

function setJogadorDaVez(jogador) {
    jogador_vez = jogador;
}

function setIniciarJogo(value) {
    jogoIniciado[0] = value;
}

function getJogoIniciado() {
    return jogoIniciado[0];
}


module.exports = {
    getJogadorDaVez,
    setJogadorDaVez,
    setIniciarJogo,
    getJogoIniciado,
};
