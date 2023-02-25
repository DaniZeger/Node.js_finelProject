const express = require('express');
const app = express();
const http = require('http').Server(app);

const userRouter = require("./routes/usersRouter.js")
const authRouter = require("./routes/authRouter.js")
const cards = require('./routes/cardRouter.js');

require("./dal/dal.js")

app.use(express.json());

app.use("/api/users", userRouter)
app.use("/api/auth", authRouter)
app.use('/api/cards', cards);

const port = 3000;
http.listen(port, () => console.log(`Listening on port ${port}...`))