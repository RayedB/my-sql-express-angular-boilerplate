import { Router } from 'express';
import passport from 'passport';
import AuthController from '../controllers/auth.controller';
require('./../middleware/passport')(passport)
const router = new Router();

//Auth routes
router.post('/register', (req, res) => {
    AuthController.register(req, res);
});

router.post('/login', (req, res) => {
    AuthController.login(req, res);
});

router.get('/user', passport.authenticate('jwt', {session:false}),AuthController.getUsers)

export default router;