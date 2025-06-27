window.onload = () => __init__(2);
let counter = 0;
let guess_colour = [0,0,0,0];
let color_Id = [0,0,0,0];
let errcount = 0;
let matchId;

setInterval(() => ping(),1000);
async function ping() {
    await fetch("http://127.0.0.1:8000/ping/"+matchId);
}
async function guessclick(){
    const response = await fetch("http://127.0.0.1:8000/checkcolor/"+matchId+"?player_colour="+color_Id.join("&player_colour="));
    const data = await response.json();
    console.log(data);
    console.log(data[0])
    console.log(data[1])
    console.log(typeof(data[0]))
    console.log(typeof(data[1]))
    if(counter >= 3)
    {
        let datanum = 0;
        for(let i = errcount; i < errcount + 4; i++){
            const baseColor = `hsl(${guess_colour[i%4]}, 70%, 60%)`;
            const highlightColor = `hsl(${guess_colour[i%4]}, 90%, 80%)`;
            const newDiv = document.createElement("div");
            const helpdiv = document.createElement("div");
            helpdiv.classList.add("colorCircles");

            newDiv.classList.add("colorCircles");
            newDiv.setAttribute("id","error"+(i));
            helpdiv.setAttribute("id","aiuto"+(i));
            aiuto = true;
            document.getElementById("aiuto").appendChild(helpdiv);
            if(datanum===0) {
                if (data[datanum] > 0) {
                    data[datanum]--;

                    document.getElementById("aiuto" + i).style.background = `
                        radial-gradient(circle at 30% 30%, #008000 20%, #008000 80%)
                        `;
                } else if (data[datanum] <= 0) {
                    datanum++;
                }
            }
            if(datanum === 1) {
                if (data[datanum] > 0) {
                    data[datanum]--;

                    document.getElementById("aiuto" + i).style.background = `
                        radial-gradient(circle at 30% 30%, #ffff00 20%, #ffff00 80%)
                        `;
                }
                else if(data[datanum] <= 0) {
                    datanum++;
                }
            }
            if(datanum === 2)
            {
                document.getElementById("aiuto" + i).style.background = `
                        radial-gradient(circle at 30% 30%, #ff0000 20%, #ff0000 80%)
                        `;
            }




            newDiv.style.background = `
          radial-gradient(circle at 30% 30%, #ffffff 20%, #ffffff 10 80%)
        `;
            document.getElementById("errors").appendChild(newDiv);
            document.getElementById("error"+i).style.background = `
          radial-gradient(circle at 30% 30%, ${highlightColor} 20%, ${baseColor} 80%)
        `;
            document.getElementById("guess"+i%4).style.background = `transparent`;

        }
        errcount += 4;
        counter = 0;
        guess_colour = [0,0,0,0,0];
    }
    return null;
}



function colorsel(idk,num,basecol){
    const baseColor = `hsl(${basecol}, 70%, 60%)`;
    const highlightColor = `hsl(${basecol}, 90%, 80%)`;
    let check = false;
    if(counter < 4)
    {
        for(let i = 0; i < counter; i++) {
            if(guess_colour[i] === basecol){
                check=true;
            }
        }
        if(check=== false){
            document.getElementById("guess"+counter).style.background = `
          radial-gradient(circle at 30% 30%, ${highlightColor} 20%, ${baseColor} 80%)
        `;
            guess_colour[counter] = basecol;
            color_Id[counter]= num;
            counter++;
        }
    }
    return null;
}
async function __init__(diff) {
    console.log("test")
    const response = await fetch("http://127.0.0.1:8000/init_id/"+diff);
    const data = await response.json();

    matchId = data[0];
    console.log(matchId);

    let colors;
    switch(diff) {
        case 2: colors = 8; break;
        case 3: colors = 10; break;
        case 4: colors = 12; break;
        default: colors = 6; break;
    }
    const palette = document.getElementById("palette");
    const guess = document.getElementById("guesses");
    palette.innerHTML = "";


    for(let i = 0; i < colors; i++) {
        const baseHue = (i * 360) / colors;
        const baseColor = `hsl(${baseHue}, 70%, 60%)`;
        const highlightColor = `hsl(${baseHue}, 90%, 80%)`;
        const newDiv = document.createElement("div");
        newDiv.classList.add("colorCircles");
        newDiv.addEventListener("click",(e) => colorsel(e,i,baseHue));
        newDiv.style.background = `
          radial-gradient(circle at 30% 30%, ${highlightColor} 20%, ${baseColor} 80%)
        `;
        palette.appendChild(newDiv);
    }
    //Spaghetti code final boss
    if(diff === 3 || diff === 1 ){
        for(let i = 0; i < 2; i++) {
            const newDiv = document.createElement("div");
            newDiv.classList.add("colorCircles");
            palette.appendChild(newDiv);
        }

    }
    for(let i = 0; i < 4; i++) {
        const newDiv = document.createElement("div");
        newDiv.classList.add("colorCircles");
        newDiv.setAttribute("id","guess"+i);
        guess.appendChild(newDiv);

    }

    document.getElementById("clear-btn")
        .addEventListener("click", () => clear());
}
function clear(){
    for(let i = 0; i < counter; i++) {
        guess_colour[i]=0;
        document.getElementById("guess"+i).style.background = `transparent`;
    }
    counter = 0;
    return null;
}
