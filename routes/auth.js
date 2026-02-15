import Router from 'express';
import { register, login, me } from '../controllers/authController';
import auth from '../middleware/auth'

const router = Router();

router.post('/resgister', register);
router.post('/login', login);
router.get('/me', auth, me);

module.exports = router;