const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");
const multer = require("multer");

const errorController = require("./controllers/error");
const User = require("./models/user");

// const MONGODB_URI ='mongodb+srv://lakshya:312004lakshya@cluster0.i4nia.mongodb.net/NodeJS';
const MONGODB_URI =
  "mongodb+srv://lakshya:312004lakshya@cluster0.i4nia.mongodb.net/NodeJS?retryWrites=true&w=majority&appName=Cluster0";

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});
const csrfProtection = csrf();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname
      // new Date().toISOString() + "-" + file.originalname
    );
  },
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
}

//* Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single("image"));
app.use(express.static(path.join(__dirname, "public")));
app.use('/images',express.static(path.join(__dirname, "images")));
app.use(
  session({
    secret: "my secret key",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use(csrfProtection);
app.use(flash());

//* This middleware will run for every request
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      next(new Error(err));
    });
});
app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
// app.use("/500", errorController.get500);
app.use(errorController.get404);
app.use((error, req, res, next) => {
  console.log("\x1b[31m",">> Error: ", error);
  res.status(500).render("500", {
    pageTitle: "Error!",
    path: "/500",
  });
});

mongoose
  .connect(
    "mongodb+srv://lakshya:312004lakshya@cluster0.i4nia.mongodb.net/NodeJS"
  )
  .then((result) => {
    app.listen(3000, () => {
      console.log("\x1b[36m%s\x1b[0m","Server started at port 3000");
    });
  })
  .catch((err) => {
    console.log(err);
  });
