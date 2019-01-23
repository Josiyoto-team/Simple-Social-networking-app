var express = require("express"),
    router = express.Router(),
    Post   = require("../models/post"),
    middleware = require("../middleware");

router.get("/", function(req,res){
    Post.find({}, function(err, allPosts){
        if (err){
            console.log(err);
        }else{
            res.render("post/index", {allPosts: allPosts})
        }
    });
});

router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("post/new")
})

router.post("/", middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newPost = {name: name, image: image, description: description, author: author};
    Post.create(newPost, function(err, newlycreated){
        if (err){
            console.log(err)
        }else{
            console.log(newlycreated);
            res.redirect("/post");
        }
    });
});

router.get("/:id", function(req, res){
    Post.findById(req.params.id).populate("comments").exec(function(err, foundPost){
        if(err){
            console.log(err);
        } else {
            res.render("post/show", {post: foundPost});
        }
    });
});


router.get("/:id/edit",middleware.checkPostOwnership, function(req, res){
    Post.findById(req.params.id, function(err, foundPost){
        res.render("post/edit", {post: foundPost});
    });
});


router.put("/:id",middleware.checkPostOwnership, function(req, res){
    Post.findByIdAndUpdate(req.params.id, req.body.post, function(err, updatedPost){
       if(err){
           res.redirect("/post");
       } else {
           res.redirect("/post/" + req.params.id);
       }
    });
});


router.delete("/:id",middleware.checkPostOwnership, function(req, res){
    Post.findByIdAndRemove(req.params.id, function(err){
       if(err){
           res.redirect("/post");
       } else {
           res.redirect("/post");
       }
    });
 });
 

module.exports = router;
