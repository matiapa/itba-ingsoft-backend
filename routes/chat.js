const auth = require("../firebase/authorization");
const Chat = require("../db/queries/chat");
const express = require("express");
const router = express.Router();
const schemas = require("../db/schemas.js");
const Joi = require("joi");

router.get("/:id", auth.checkAuth, (req, res) => {
    Joi.validate(req.query, schemas.message_list).then(async (data) => {
        result = await Chat.getMessages(req.user.uid, req.params.id, data.offset, data.limit);
        res.status(200).send(result);
    }, (err) => {
        res.status(400).send(err.details[0].message);
    });
});

router.post("/:id", auth.checkAuth, (req, res) => {
    Joi.validate(req.body, schemas.message).then((data) => {
        entry = {
            from_id: req.user.uid,
            to_id: req.params.id,
            date: new Date(),
            msg: data.msg
        }
        result = Chat.addMessage(entry).then(
            (msg) => {
                io.to(entry.to_id).send(entry.msg);
                res.status(201).end();
            }
            , (err) => {
                res.status(400).end();
            }
        );
    }, (err) => {
        res.status(400).send(err.details[0].message);
    });
})

var io;
module.exports = function(server) {
    const io = server.of("/chat");
    io.use(auth.checkSocket);
    io.on("connection", (socket) => {
        console.log("a user connected");
        socket.join(socket.user.uid);
        socket.on("disconnect", () => {
            console.log("user disconnected");
        });
        socket.on("chat message", async (to, msg) => {
            console.log(`Message "${msg}" sent to "${to}"`);
            socket.to(to).send(msg);
            await Chat.addMessage({
                from_id: socket.user.uid,
                to_id: to,
                date: new Date(),
                msg: msg
            });
        });
    });
    return router;
};