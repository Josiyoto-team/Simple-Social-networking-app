var Post = require("../models/post");
var Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }    
    req.flash("error", "Log in First");
    res.redirect("/login");
}

middlewareObj.checkPostOwnership = function(req, res, next) {
    if (req.isAuthenticated()){
        Post.findById(req.params.id, function(err, foundPost){
            if (err){
                req.flash("error", "Post was not found");
                res.redirect("back");
            } else{
                if (foundPost.author.id .equals (req.user._id)){
                    next();
                }else{
                    req.flash("error", "Permission denied");
                    res.redirect("back");
                }
            }
        });
    } else{
        req.flash("error", "Log in first");
        res.redirect("back");
    }
}


middlewareObj.checkCommentOwnership = function(req, res, next) {
    if (req.isAuthenticated()){
        Post.findById(req.params.comment_id, function(err, foundComment){
            if (err){
                res.redirect("back");
            } else{
                if (foundComment.author.id .equals (req.user._id)){
                    next();
                }else{
                    req.flash("error", "Permission denied")
                    res.redirect("back");
                }
            }
        });
    } else{
        req.flash("error", "Log in first");
        res.redirect("back");
    }
}


module.exports = middlewareObj;