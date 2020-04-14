const User = require('../models/user');
function UserController(){

}


//Create User
UserController.prototype.createUser =(req, res, next) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Details could not be empty"
        });
    } else {
        const {...data} = req.body;
        const {phone_number, first_name, last_name, password, email, role} = data;

        User.findOne({phone_number})
            .then(emp => {
                if (emp) {
                    res.status(409).send({message : "user already exist!"});
                } else {
                    const user = new User({phone_number, first_name, last_name, password, 'address.email':email, role});
                    user.save()
                        .then(data => {
                            res.status(200).send({message : "registration successfull!"});
                        }).catch(err => {
                            console.error("values are Not inserted", err.message);
                            res.status(500).send({
                                message: err.message || "values are Not inserted"
                            });
                        });
                }  
            }).catch(err => {
                console.error("Details are Not retrived",err.message);
                res.status(500).send({
                     message: err.message || "Details are not retrived"
                });   
            });    
    }
};

//Retrive  All Users
UserController.prototype.findAll = (req, res) => {
    User.find().lean()
    .then(raw => {
        res.status(200).send(raw);
    }).catch(err => {
        console.error("Details are Not retrived", err.message);
        res.status(500).send({
            message : err.message || "Details are not retrived"
        });   
    });
};

//Find one User
UserController.prototype.findOne = (req, res) => {
    const { _id } = req.params;
    User.findOne({_id})
    .then(emp => {
        if(!emp) {
            res.status(500).send({
                message : "User not found, Please Enter valid userDetails"
            });
        }
        else {
            res.send(emp);
        }
    }).catch(err => {
        console.error("userDetails not found", err.message);
        res.status(500).send({
            message : `Error:${err.message}`
        });
    });
};

//Update user
UserController.prototype.update = (req, res) => {
    const {_id} = req.params;
    const {phone_number, first_name, last_name, password, email} = req.body;
    User.findOneAndUpdate({_id},{phone_number : phone_number, first_name : first_name, last_name : last_name, password : password, email : email}, {new : true})
    .then(emp => {
        if(!emp) {
            res.status(500).send({
                message :"user not found, Please Enter valid userDetails"
            });
        }
        else {
            res.send(emp);
        }
    }).catch(err => {
        console.error("userData not matched", err.message);
        res.status(500).send({
            message : `Error:${err.message}`
        });
    });    
};

//Delete user
UserController.prototype.delete = (req, res) => {    
    const {_id} = req.params;
    User.findOneAndRemove({_id})
    .then(emp => {
        if(!emp) {
            res.status(500).send({
                message :"user not found, Please Enter valid details"
            });
        }
        else {
            res.status(200).send({message : "User successfully removed"});
        }
    }).catch(err => {
        console.error("userData not matched", err.message);
        res.status(500).send({
            message : `Error:${err.message}`
        });
    });
};


var userController = new UserController();
module.exports = userController;
