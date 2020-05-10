var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var auth = require("./firebase/authorization.js");
var Joi = require("joi");
var User = require("./db/queries/user.js");
var app = express();

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
    uid: Joi.number().integer(),
    name: Joi.string().min(2).max(30).required(),
    last_name: Joi.string().min(2).max(30).required(),
    email: Joi.string().email({ minDomainSegments: 2 }).required(),
    document_type: Joi.string()
      .valid("nid", "ic", "passport")
      .insensitive()
      .required(),
    document: Joi.string().length(8).required(),
    telephone_type: Joi.string()
      .valid("particular", "cellphone")
      .insensitive()
      .required(),
    country: Joi.string().required(),
    province: Joi.string().required(),
    location: Joi.string().required(),
    street: Joi.string().required(),
    street_number: Joi.string().required(),
  };
  return Joi.validate(user_info, shema);
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
    User.getUserByEmail(email).then((user) => {
      //if user not found
      if (!user) {
        //unique email
        const user = {
          id: req.body.uid,
          name: req.body.name,
          last_name: req.body.last_name,
          email: req.body.email,
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
            street: req.body.street,
            street_number: req.body.street_number,
          };
          User.createPersonalInfo(personal_info);
          res.status(201).end();
        });
      } else {
        //email in use
        res.status(409).send("EMAIL ALREADY IN USE");
      }
    });
  }
});
