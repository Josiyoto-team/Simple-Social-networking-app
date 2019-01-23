var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");


router.get("/", function(req, res){
    res.render("index");
});

router.get("/signup", function(req, res){
    res.render("signup");
});

router.post("/signup", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if (err){
            req.flash("error", err.message);
            return res.render("signup")
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to Tellme " + user.username);
            res.redirect("/post");
        });
    });
});

router.get("/login", function(req, res){
    res.render("login");
});

router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/post",
        failureRedirect: "/login"
    }
    ), function(req,res){

});

router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "You've been successfully logged out");
    res.redirect("/");

})

module.exports = router;