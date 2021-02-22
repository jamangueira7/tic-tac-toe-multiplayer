const users = [];
const options = ['X', 'O'];

function userJoin(id, username) {


    const option = optionsPlay()
    const user = { id, username, option };

    users.push(user);

    return user;
}

function optionsPlay() {

    if (userLength() == 0){
        const rand = Math.floor(Math.random() * 2);
        return options[rand];
    } else {
        const index = options.findIndex(option => option === users[0].option);
        return index === 0 ? options[1] : options[0];
    }
}

function getCurrentUser(id) {

    return users.find(user => user.id === id);
}

function userLength() {

    return users.length;
}

function usersIn() {

    return users;
}

//Usuarios saindo do chat
function userLeave(id) {
    const index = users.findIndex(user => user.id === id);

    if(index !== -1) {
        return users.splice(index, 1)[0];
    }
}


module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    userLength,
    usersIn
};
