var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    expressSanitizer = require("express-sanitizer"),
    methodOverride = require("method-override"),
    mongoose    = require("mongoose");

    
    // APP CONFIG
    
    mongoose.connect("mongodb://localhost/restful_blog", {
     useMongoClient: true,
    });
    app.set("view engine", "ejs");
    app.use(express.static("public"));
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(expressSanitizer());
    app.use(methodOverride("_method"));
    
    //BLOG CONFIG
    
    
    var blogSchema = new mongoose.Schema({
       
        title: String,
        image: String,
        body: String,
        created:{type: Date, default:Date.now}
        
    });
    
    var Blog = mongoose.model("Blog", blogSchema);
    //RESTfull routes
    
    //INDEX ROUTE
    app.get("/",function(req, res) {
        res.redirect("/blogs");
    });
    
    
    app.get("/blogs",function(req, res) {
        // body...
        Blog.find({}, function(err, blogs){
            if(err){
                console.log(err);
            }else{
                res.render("index",{blogs:blogs});
            }
        });
    });
    
    //NEW ROUTE
    
    app.get("/blogs/new", function(req, res) {
        res.render("new");
    });
    
    //CREATE ROUTE
    app.post("/blogs",function(req, res){
        console.log(req.body);
        req.body.blog.body = req.sanitize(req.body.blog.body);
        console.log("=============");
        console.log(req.body)
       Blog.create(req.body.blog, function(err, newBlog){
           if(err){
               res.render("new");
           }else{
               res.redirect("/blogs");
           }
       });
    });
    
    //Show ROUTE
    app.get("/blogs/:id", function(req, res) {
        Blog.findById(req.params.id, function(err, foundBlog){
            if(err){
                res.redirect("/blogs");
            }else{
                res.render("show", {blog: foundBlog});
            }
        });
    });
    
    //Edit Route
    app.get("/blogs/:id/edit", function(req, res) {
        Blog.findById(req.params.id, function(err, foundBlog) {
            // body...
            if(err){
                res.redirect("/blogs");
            }else{
                res.render("edit", {blog: foundBlog});
            }
        });
    });
    
    //update ROUTE
    app.put("/blogs/:id", function(req, res) {
        // body
        req.body.blog.body = req.sanitize(req.body.blog.body);
        Blog.findByIdAndUpdate(req.params.id,req.body.blog, function(err,updatedBlog) {
            if(err){
                res.redirect("/blogs");
            }else{
                res.redirect("/blogs/"+ req.params.id);
            }
        });
    });
    
    // DELETE ROUTE
    app.delete("/blogs/:id/",function(req, res){
       Blog.findByIdAndRemove(req.params.id, function(err){
           if(err){
               res.redirect("/blogs");
           }else{
               res.redirect("/blogs");
           }
       }) ;
    });
    //server start
    app.listen(8000, process.env.IP, function (req, res) {
        // body...
       console.log("SERVER HAS STARTED"); 
    });