let diff = parseInt(localStorage.getItem("difficulty"));
localStorage.removeItem("code")
setInterval(() => checkjoined(), 1000);
async function creapartita(){
    if(localStorage.getItem("code") === null){
        const response = await fetch("http://127.0.0.1:8000/create?difficulty=" + diff);
        const data = await response.json();
        localStorage.setItem("code", data);
        document.getElementById("crea").innerHTML = localStorage.getItem("code");
    }
}
async function joinpartita(){
    let jcode = document.getElementById("inserisci").value;
    const response = await fetch("http://127.0.0.1:8000/join/" + jcode);
    const data = await response.json();
    localStorage.setItem("code", jcode);
}

async function checkjoined(){
    if(localStorage.getItem("code") !== null){
        let jcode = localStorage.getItem("code");
        const response = await fetch("http://127.0.0.1:8000/joincheck/" + jcode);
        const data = await response.json();
        if(data===1){
            window.location.href='index.html'
        }
    }
}