require('body-parser');
require('babel-polyfill');
import User from '../models/user';
import { to, ReE, ReS } from '../services/utils.service';
import authService from '../services/auth.service';

const AuthController = {};
AuthController.register = async (req, res) => {
    try{
        res.setHeader('Content-Type', 'application/json');
        if (!req.body.email) {
            return ReE(res, 'Please enter an email to register.');
        } else if (!req.body.password) {
            return ReE(res, 'Please enter a password to register.');
        } else {
            let err, user;
            [err, user] = await to(authService.createUser(req.body));
            if(err) console.log(err);
            // if(err) return ReE(res, err, 422);
            return ReS(res, {message:'Successfully created new user.', user:user.toWeb(), token:user.getJWT()}, 201);
        }
    }
    catch(err){
        console.log(err);
    }
};

AuthController.login = async (req, res) => {
    try {
        let err, user;
        
        [err, user] = await to(authService.authUser(req.body));
        if(err) return ReE(res, err, 422);

        return ReS(res, {token:user.getJWT(), user:user.toWeb()});
    }
    catch(err){
        console.log(err);
    }
};

AuthController.getUsers = async (req,res,next) => {
    console.log('in getusers')
}

export default AuthController 