const { User } 	    = require('../models');
import validator from 'validator';
import {to,TE} from './utils.service';

const createUser = async (userInfo) => {
    let err,user;
    // console.log(userInfo)
    if(!userInfo.email) TE('An email or phone number was not entered.');

    if(validator.isEmail(userInfo.email)){
        [err, user] = await to(User.create(userInfo));
        if(err) TE('user already exists with that email');

        return user;

    }else{
        TE('A valid email or phone number was not entered.');
    }
}
module.exports.createUser = createUser;

const authUser = async (userInfo) => {//returns token

    if(!userInfo.email) TE('Please enter an email or phone number to login');


    if(!userInfo.password) TE('Please enter a password to login');

    let user, err;
    if(validator.isEmail(userInfo.email)){
        [err, user] = await to(User.findOne({where:{email:userInfo.email}}));
        if(err) TE(err.message);
    }else{
        TE('A valid email was not entered');
    }

    if(!user) TE('Not registered');

    [err, user] = await to(user.comparePassword(userInfo.password));

    if(err) TE(err.message);

    return user;

}
module.exports.authUser = authUser;