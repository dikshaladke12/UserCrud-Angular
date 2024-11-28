import express from "express";
import cors from 'cors'
import bodyParser from 'body-parser';
import route from './router/userRoute.js'
import path from 'path'

const app=express();

app.use(express.json({ limit: '50mb' }));
app.use(cors({origin:"*"}))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use("/images", express.static(path.join("images")));

app.use('',route);

export default app;

