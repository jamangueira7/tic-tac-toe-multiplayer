var socket = io('http://localhost:3000/');

const game = {
    board: ['', '', '', '', '', '', '', '', ''],
    simbols: {
        options: ['X', 'O'],
        turn_index: 0,
        change: function () {
            this.turn_index = this.turn_index === 0 ? 1 : 0;
        }
    },
    container_element: null,
    winning_sequences: [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6]
    ],

    init: function (container) {
        this.container_element = container;
    },

    make_play: function (position) {
        if(this.board[position] === "") {
            socket.emit('Jogando', { position, user:socket.id });
        }
    },

    start: function () {
        this.board.fill('');
        this.draw();
        this.gameover = false;
    },


    draw: function () {
        let content = '';
        for ( i in this.board ) {
            content += '<div id="casa_'+ i +'" onclick="game.make_play('+ i +')">'+ this.board[i] +'</div>';
        }

        this.container_element.innerHTML = content;
    },
};
