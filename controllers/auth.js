const bcrypt = require("bcryptjs");
const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  //   const isLoggedIn = req
  //     .get('Cookie')
  //     .split(';')[1]
  //     .trim()
  //     .split('=')[1] === 'true';
  console.log(req.session.isLoggedIn);
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: req.flash("error"),
  });
};

exports.postLogin = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        req.flash("error", "Invalid email or password.");
        return res.redirect("/login");
      }
      bcrypt.compare(req.body.password, user.password).then((doMatch) => {
        if (doMatch) {
          console.log("Username with id " + user._id + " has logged in");
          req.session.isLoggedIn = true;
          req.session.user = user;
          return req.session.save((err) => {
            if (err) console.log("Error: " + err);
            res.redirect("/");
          });
        }
        res.redirect("/login");
      });
    })
    .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log("logged out with Error: " + err);
    res.redirect("/");
  });
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
  });
};

exports.postSignup = (req, res, next) => {
  email = req.body.email;
  password = req.body.password;
  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        console.log("User already exists");
        return res.redirect("/signup");
      }
      return bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          const user = new User({
            email: req.body.email,
            password: hashedPassword,
            cart: { items: [] },
          });
          return user.save();
        })
        .then((result) => {
          console.log("User created");
          res.redirect("/login");
        });
    })
    .catch((err) => console.log(err));
};
