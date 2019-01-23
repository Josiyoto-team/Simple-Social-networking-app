var express        = require("express"),
    app            = express(),
    bodyParser     = require("body-parser"),
    mongoose       = require("mongoose"),
    flash          = require("connect-flash"),
    passport       = require("passport"),
    LocalStrategy  = require("passport-local"),
    methodOverride = require("method-override"),
    Post           = require("./models/post"),
    Comments       = require("./models/comment"),
    User           = require("./models/user"),
    seedDB         = require("./seeds");

 indexRoutes   = require("./routes/index");
 postRoutes    = require("./routes/post");
 commentRoutes = require("./routes/comment");


mongoose.connect("mongodb://localhost/tell_me");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();


app.use(require("express-session")({
    secret: "Coding is interesting",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req, res, next){
    res.locals.currentUser= req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();  
});


app.use("/", indexRoutes);
app.use("/post", postRoutes);
app.use("/post/:id/comment", commentRoutes);

app.listen(3000, function(){
    console.log("The Tellme server has started");
});