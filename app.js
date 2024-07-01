/*import express from "express";
import server from "socket.io";
import {createServer } from "http";

const port = 3000;

const index = express();
const server = createServer(index);
const io = new Server(server,{
    cors:{
        origin:"http://localhost:5500/",
        methods:["GET","POST"],
        Credential:true,
    }
});*/

const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server ,{
    cors:{
        origin:"*",
        methods:["GET","POST"],
        Credential:true,
    }
});

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

server.listen(8000, () => {
    console.log('server running at http://localhost:8000');
  });



const users= {};

io.on('connection', (socket) =>{
    socket.on('new-user-joined', name =>{
       // console.log("New user",name);
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });
    
    socket.on('send', (message)  =>{
        socket.broadcast.emit('receive',{ message: message,name: users[socket.id]})
    });

    socket.on('disconnect', messgae =>{
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });
})
