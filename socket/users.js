var lists
class Users {
    constructor(sockID,mongoID){
       this.userslist = []
    }
    addUser(sockID, mongoID, fullName,username, room){
        var exist = this.getUser(username);
        if(exist.username) return false;
        var result = this.userslist.push({sockID,mongoID,fullName,username,room});
        return result
    }
    getUser(username){
        let result = this.userslist.filter((user)=>user.username===username)
        return result
    }
    removeUser(sockID) {
       var users = this.userslist = this.userslist.filter((user) => user.sockID !== sockID)
       this.userslist = users;
        return users
    } 
    getUserList(room){
        let results = this.userslist.filter((user) => user.room === room)
        return results
    }

}

module.exports = Users