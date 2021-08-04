const dalRead = require('../DAL/fileReader');
const usersBL = require('../models/usersBL');

exports.checkCredentials = async function(obj)
{
    let json = {};
    let resp = await dalRead.readDataFromFile('../node_mid_project/jsonData/Users.json');
    const users = resp.users;
    const usrname = obj.username;
    const pwd = obj.pwd;
    const user = users.find(x=> x.username === usrname && x.password === pwd);
    if(user === undefined)
        json['msg'] = "Wrong credentials. please try again";
    else{
        const numTrans = user.num_of_transactions;
        let used = user.operations.used;

        if(user.operations.date !== new Date().toLocaleDateString() && !user.admin){
            used = 0;
            await usersBL.updateUserCredit(usrname,used);
            await usersBL.updateUserCreditDate(usrname,new Date().toLocaleDateString());
        }

        if(numTrans == used && !user.admin)
            json['msg'] = "You don't have enough credits for the current day";
        else{
            json['msg'] = '';
            json["credits"] = numTrans;
            json["admin"] = user.admin;
            json["name"] = usrname;
            json["used"] = used;
        }
    }
    
    return json;
}