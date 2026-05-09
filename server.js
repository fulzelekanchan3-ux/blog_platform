const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("./db");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());


// Register
app.post("/register", async (req,res)=>{
    const {username,email,password}=req.body;

    const hashed = await bcrypt.hash(password,10);

    db.query(
        "INSERT INTO users(username,email,password) VALUES(?,?,?)",
        [username,email,hashed],
        (err,result)=>{
            if(err) return res.send(err);
            res.send("Registered Successfully");
        }
    );
});


// Login
app.post("/login",(req,res)=>{
    const {email,password}=req.body;

    db.query(
        "SELECT * FROM users WHERE email=?",
        [email],
        async(err,result)=>{
            if(err) return res.send(err);

            if(result.length===0)
                return res.send("User not found");

            const valid = await bcrypt.compare(
                password,
                result[0].password
            );

            if(!valid)
                return res.send("Wrong Password");

            const token = jwt.sign(
                {id:result[0].id},
                process.env.JWT_SECRET
            );

            res.json({token});
        }
    );
});


// Create Post
app.post("/posts",(req,res)=>{
    const {title,content,user_id}=req.body;

    db.query(
        "INSERT INTO posts(title,content,user_id) VALUES(?,?,?)",
        [title,content,user_id],
        (err,result)=>{
            if(err) return res.send(err);
            res.send("Post Created");
        }
    );
});


// Get Posts
app.get("/posts",(req,res)=>{
    db.query("SELECT * FROM posts",(err,result)=>{
        if(err) return res.send(err);
        res.json(result);
    });
});


// Delete Post
app.delete("/posts/:id",(req,res)=>{
    db.query(
        "DELETE FROM posts WHERE id=?",
        [req.params.id],
        ()=>res.send("Deleted")
    );
});


// Add Comment
app.post("/comments",(req,res)=>{
    const {post_id,comment}=req.body;

    db.query(
        "INSERT INTO comments(post_id,comment) VALUES(?,?)",
        [post_id,comment],
        ()=>res.send("Comment Added")
    );
});


// Get Comments
app.get("/comments/:post_id",(req,res)=>{
    db.query(
        "SELECT * FROM comments WHERE post_id=?",
        [req.params.post_id],
        (err,result)=>res.json(result)
    );
});


app.listen(process.env.PORT,()=>{
    console.log("Server running");
});