const API="http://localhost:5000";

function register(){
fetch(API+"/register",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({
username:username.value,
email:email.value,
password:password.value
})
})
.then(res=>res.text())
.then(alert);
}

function login(){
fetch(API+"/login",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({
email:email.value,
password:password.value
})
})
.then(res=>res.json())
.then(data=>{
localStorage.setItem("token",data.token);
alert("Logged In");
});
}

function createPost(){
fetch(API+"/posts",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({
title:title.value,
content:content.value,
user_id:1
})
})
.then(res=>res.text())
.then(alert);
}

function loadPosts(){
fetch(API+"/posts")
.then(res=>res.json())
.then(data=>{
posts.innerHTML="";

data.forEach(post=>{
posts.innerHTML+=`
<div class="post">
<h2>${post.title}</h2>
<p>${post.content}</p>
<button onclick="deletePost(${post.id})">Delete</button>
</div>
`;
});
});
}

function deletePost(id){
fetch(API+"/posts/"+id,{
method:"DELETE"
})
.then(()=>loadPosts());
}

loadPosts();