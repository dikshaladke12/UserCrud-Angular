import express from 'express';
import { 
    login, 
    getUser, 
    getUserById, 
    deleteUserById, 
    updateUser,
    changepassword,
    addUser
} from '../controller/userController';
import {
    verifyToken
} from '../middleware/jwt'
import { helperUpload } from '../helper/multer';

const route = express.Router();

route.post("/addUser",helperUpload, addUser);
route.post('/login', login);
route.get('/details', getUser);
route.get('/detail/:id', getUserById);
route.delete('/delete/:id', deleteUserById);
route.put('/update/:id', updateUser);
route.post('/changePassword',verifyToken, changepassword);

export default route;