let request = new XMLHttpRequest();
request.open('get','/profile');
request.send();
let obj;
request.addEventListener('load',function(){

obj = JSON.parse(request.responseText);
// let d = document.getElementById("div");
let p = document.getElementById("span");
p.innerHTML = obj.username;
// d.appendChild(p);
});

