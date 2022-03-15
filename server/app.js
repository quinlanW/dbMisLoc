let createError = require("http-errors");
let express = require("express");
let path = require("path");
let cookieParser = require("cookie-parser");
let logger = require("morgan");

let userRouter = require("./routes/userRouter");
let idxRouter = require("./routes/indexRouter");

let app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
require("./repositories/protein").init();

app.use("/api", userRouter);


// 404
app.use(function (req, res, next) {
    res.status(404);

    let ans = {
        error: true,
        data: "ERROR: Can't handle this request!",
    };
    res.send(ans);
});




module.exports = app;
