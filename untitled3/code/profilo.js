async function  signin(){
    let user = document.getElementById("nickname").value; //aggiungere id che prende il nickname
    let password = document.getElementById("password").value; //password
    if (password.length <8){
        console.log("password corta")
        return 0;
    }
    const response = await fetch("http://127.0.0.1:8000/profile/add/" + user + "?password=" + password);
    const data = await response.json();
    if(data.id === -1){
        console.log("error")
    }else{
        console.log("success")
        localStorage.setItem("token", data);
    }

    window.location.href='home.html';

}
async function login(){
    let user = document.getElementById("nickname").value;
    let password = document.getElementById("password").value;
    const response = await fetch("http://127.0.0.1:8000/profile/get/" + user + "?password=" + password);
    const data = await response.json();
    if(data === -1 || data === 0){
        console.log("error")
    }else{
        console.log(data)
        localStorage.setItem("token", data);
    }
    window.location.href='home.html';
}