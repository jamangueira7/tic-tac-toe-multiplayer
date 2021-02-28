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

function getJogadorDaVez() {
    return jogador_vez;
}


function vencedor(simbol) {
    for( i in sequencia_vencedora) {
        if( tabuleiro[sequencia_vencedora[i][0]] == simbol &&
            tabuleiro[sequencia_vencedora[i][1]] == simbol &&
            tabuleiro[sequencia_vencedora[i][2]] == simbol ){
            console.log('Sequencia vencedora '+i);
            return i;
        }
    }
    return -1;
}


function setJogadorDaVez(jogador) {
    jogador_vez = jogador;
}

function setIniciarJogo(value) {
    tabuleiro =  ['', '', '', '', '', '', '', '', ''];
    jogoIniciado[0] = value;
}

function setJogada(position, peca) {
    tabuleiro[position] = peca;
}

function getJogadas() {
    return tabuleiro;
}



function getJogoIniciado() {
    return jogoIniciado[0];
}


module.exports = {
    getJogadorDaVez,
    setJogadorDaVez,
    setIniciarJogo,
    getJogoIniciado,
    setJogada,
    getJogadas,
    vencedor,
};
