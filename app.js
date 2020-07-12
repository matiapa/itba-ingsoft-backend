var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var auth = require("./firebase/authorization.js");
var schemas = require("./db/schemas.js");
const Joi = require("joi");
var User = require("./db/queries/user.js");
var app = express();
var http = require('http');

var user = require("./routes/user");
var auction = require("./routes/auction");
var bid = require("./routes/bid");
var expert = require("./routes/expert");
var lot = require("./routes/lot");
var mp_notifications = require("./routes/mp_notifications");
var photo = require("./routes/photo");
var chat = require("./routes/chat");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;

app.use("/test", auth.checkAuth);
app.get("/test", (req, res) => {
  res.json({
    message: "Hello World!",
  });
});

app.post("/login", auth.createSession);
app.use("/logout", auth.checkAuth);
app.post("/logout", auth.closeSession);

//register validations
function validateUser(user_info) {
  const schema = {
    ...schemas.user_required,
    ...schemas.personal_info_required,
  };
  return Joi.validate(user_info, schema);
}

//register
app.use("/register", auth.checkAuth);
app.post("/register", (req, res) => {
  //validate user info syntax
  const result = validateUser(req.body);
  if (result.error) {
    return res.status(400).send(result.error.details[0].message);
  } else {
    //check if email is in use
    User.getUserByEmail(req.user.email).then((user) => {
      //if user not found
      if (!user) {
        //unique email
        const user = {
          id: req.user.uid,
          rol: "user",
          name: req.body.name,
          last_name: req.body.last_name,
          email: req.user.email,
        };
        User.createUser(user).then((id) => {
          const personal_info = {
            user_id: id,
            document_type: req.body.document_type,
            document: req.body.document,
            telephone_type: req.body.telephone_type,
            telephone: req.body.telephone,
            country: req.body.country,
            province: req.body.province,
            location: req.body.location,
            zip: req.body.zip,
            street: req.body.street,
            street_number: req.body.street_number,
          };
          User.createPersonalInfo(personal_info).then(() => {
            res.status(201).end();
          });
        });
      } else {
        //email in use
        res.status(409).send("EMAIL ALREADY IN USE");
      }
    });
  }
});

var server = http.createServer(app);
app.set('server', server);
io = require("socket.io")(server);

app.use("/user", user);
app.use("/auction", auction(io));
app.use("/bid", bid);
app.use("/expert", expert);
app.use("/lot", lot);
app.use("/mp", mp_notifications);
app.use("/photo", photo);
app.use("/chat", chat(io));
