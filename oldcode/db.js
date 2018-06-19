//Very simplyfied pseudocode to demonstrate the read/write into a database system

exports.dbConnection = function(){
    //Connection to some database
}

exports.persistState = (state) => {
    //Write the application state into some database
}

exports.getState = (someParam) => {
    //Returns the last saved application state for a vehicle 
}