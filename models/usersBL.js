const dalRead = require('../DAL/fileReader');
const dalWrite = require('../DAL/fileWriter');

exports.updateUserCredit = async function (user, credits) {
    let resp = await dalRead.readDataFromFile('../node_mid_project/jsonData/Users.json');
    let users = resp.users;
    const objIndex = users.findIndex(obj => obj.username === user);
    if (objIndex > -1) {
        users[objIndex].operations.used = credits;
        await dalWrite.writeDataToFile('../node_mid_project/jsonData/Users.json', { users });
    }
}

exports.updateUserCreditDate = async function (user, date) {
    let resp = await dalRead.readDataFromFile('../node_mid_project/jsonData/Users.json');
    let users = resp.users;
    const objIndex = users.findIndex(obj => obj.username === user);
    if (objIndex > -1) {
        users[objIndex].operations.date = date;
        await dalWrite.writeDataToFile('../node_mid_project/jsonData/Users.json', { users });
    }
}

exports.getUsers = async function () {
    let resp = await dalRead.readDataFromFile('../node_mid_project/jsonData/Users.json');
    return resp.users;
}

exports.getUser = async function (user) {
    let resp = await dalRead.readDataFromFile('../node_mid_project/jsonData/Users.json');
    return resp.users.find(x => x.username === user);
}

exports.deleteUser = async function (user) {
    let resp = await dalRead.readDataFromFile('../node_mid_project/jsonData/Users.json')
    .catch(error => { return error; });
    const users = resp.users;
    const ind = users.findIndex(x => x.username === user);
    if (ind > -1) {
        users.splice(ind, 1);
        await dalWrite.writeDataToFile('../node_mid_project/jsonData/Users.json', { users })
        .catch(error => { return error; });
    }
    return "User deleted successfully";
}

exports.updateUser = async function (user) {
    let resp = await dalRead.readDataFromFile('../node_mid_project/jsonData/Users.json');
    let users = resp.users;
    const usrIndex = users.findIndex(obj => obj.username === user.username);
    if (usrIndex > -1) {
        users[usrIndex] = user;
        await dalWrite.writeDataToFile('../node_mid_project/jsonData/Users.json', { users });
    }
    return "User updated successfully";
}

exports.addUser = async function (user) {
    let resp = await dalRead.readDataFromFile('../node_mid_project/jsonData/Users.json');
    let users = resp.users;
    users.push(user);
    await dalWrite.writeDataToFile('../node_mid_project/jsonData/Users.json', { users });
    return "User added successfully";
}