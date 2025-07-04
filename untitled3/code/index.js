let diff = parseInt(localStorage.getItem("difficulty"));
let multi = parseInt(localStorage.getItem("multi"));
let wincheck = 0;
if (document.readyState === 'complete') {
        __init__(diff);
} else {
    window.addEventListener('load', () => __init__(diff));

}

let counter = 0;
let guess_colour = [0, 0, 0, 0];
let color_Id = [0, 0, 0, 0];
let errcount = 0;
let matchId;
let k = 0;

setInterval(() => ping(), 1000);

async function ping() {
    console.log(matchId);
    const response = await fetch("http://127.0.0.1:8000/ping/" + matchId);
    const data = await response.json();
    wincheck = data;
    console.log(data)
    if (wincheck == 1) {
        showWinModal();
    }else if(wincheck == 2) {
        showLoseModal();
    }
}

async function guessclick() {
    console.log(diff);
    const response = await fetch("http://127.0.0.1:8000/checkcolor/" + matchId + "/"  + localStorage.getItem('code') + "?player_colour=" + color_Id.join("&player_colour="));
    const data = await response.json();

    if (counter >= 3) {
        const errcont = document.createElement("div");
        const helpcont = document.createElement("div");

        errcont.classList.add("errcont");
        helpcont.classList.add("helpcont");

        helpcont.setAttribute("id", "helpcont" + k);
        errcont.setAttribute("id", "errcont" + k);

        document.getElementById("errors").appendChild(errcont);
        document.getElementById("errors").appendChild(helpcont);

        let datanum = 0;
        for (let i = errcount; i < errcount + 4; i++) {
            const baseColor = `hsl(${guess_colour[i % 4]}, 70%, 60%)`;
            const highlightColor = `hsl(${guess_colour[i % 4]}, 90%, 80%)`;

            const newDiv = document.createElement("div");
            const helpdiv = document.createElement("div");

            newDiv.classList.add("colorCircles");
            helpdiv.classList.add("helpingCircles");

            newDiv.setAttribute("id", "error" + i);
            helpdiv.setAttribute("id", "aiuto" + i);

            document.getElementById("helpcont" + k).appendChild(helpdiv);

            if (datanum === 0) {
                if (data[datanum] > 0) {
                    data[datanum]--;

                    const helpCircle = document.getElementById("aiuto" + i);
                    helpCircle.style.background = `
                        radial-gradient(circle at 30% 30%, #4ee64e 20%, #008000 80%)
                    `;
                    helpCircle.classList.add("correct");
                } else if (data[datanum] <= 0) {
                    datanum++;
                }
            }

            if (datanum === 1) {
                if (data[datanum] > 0) {
                    data[datanum]--;

                    document.getElementById("aiuto" + i).style.background = `
                        radial-gradient(circle at 30% 30%, #ffffa8 20%, #ffff00 80%)
                    `;
                } else if (data[datanum] <= 0) {
                    datanum++;
                }
            }

            if (datanum === 2) {
                document.getElementById("aiuto" + i).style.background = `
                    radial-gradient(circle at 30% 30%, #ffabab 20%, #ff0000 80%)
                `;
            }

            newDiv.style.background = `
                radial-gradient(circle at 30% 30%, #ffffff 20%, #ffffff 10 80%)
            `;
            document.getElementById("errcont" + k).appendChild(newDiv);
            document.getElementById("error" + i).style.background = `
                radial-gradient(circle at 30% 30%, ${highlightColor} 20%, ${baseColor} 80%)
            `;
            document.getElementById("guess" + (i % 4)).style.background = `transparent`;
        }

        errcount += 4;
        counter = 0;
        guess_colour = [0, 0, 0, 0, 0];
        k++;

        const errors = document.getElementById("errors");
        smoothScrollToBottom(errors, 1500);

        // ✅ Win check — did the player win?
        const lastHelpCont = document.getElementById("helpcont" + (k - 1));
        const greenCircles = lastHelpCont.querySelectorAll(".correct");


    }

    return null;
}

function colorsel(idk, num, basecol) {
    const baseColor = `hsl(${basecol}, 70%, 60%)`;
    const highlightColor = `hsl(${basecol}, 90%, 80%)`;
    let check = false;

    if (counter < 4) {
        for (let i = 0; i < counter; i++) {
            if (guess_colour[i] === basecol) {
                check = true;
            }
        }

        if (!check) {
            document.getElementById("guess" + counter).style.background = `
                radial-gradient(circle at 30% 30%, ${highlightColor} 20%, ${baseColor} 80%)
            `;
            guess_colour[counter] = basecol;
            color_Id[counter] = num;
            counter++;
        }

    }


    return null;
}

async function __init__(diff) {
    console.log("loaded")
    console.log(diff);
    let response;
    if(multi===1){
        response = await fetch("http://127.0.0.1:8000/init_id/" + diff+ "/"+ localStorage.getItem("code") + "/?multi=true");
    }else{
        response = await fetch("http://127.0.0.1:8000/init_id/" + diff + "/0?multi=false" );
    }


    const data = await response.json();
    matchId = data;
    console.log(matchId)

    let colors;
    switch (diff) {
        case 2: colors = 8; break;
        case 3: colors = 10; break;
        case 1: colors = 6; break;
    }
    console.log(colors)

    const palette = document.getElementById("palette");
    const guess = document.getElementById("guesses");

    palette.innerHTML = "";
    guess.innerHTML = "";

    for (let i = 0; i < colors; i++) {
        const baseHue = (i * 360) / colors;
        const baseColor = `hsl(${baseHue}, 70%, 60%)`;
        const highlightColor = `hsl(${baseHue}, 90%, 80%)`;

        const newDiv = document.createElement("div");
        newDiv.classList.add("colorCircles");
        newDiv.addEventListener("click", (e) => colorsel(e, i, baseHue));
        newDiv.style.background = `
            radial-gradient(circle at 30% 30%, ${highlightColor} 20%, ${baseColor} 80%)
        `;
        palette.appendChild(newDiv);
    }

    if (diff === 3 || diff === 1) {
        for (let i = 0; i < 2; i++) {
            const newDiv = document.createElement("div");
            newDiv.classList.add("colorCircles");
            palette.appendChild(newDiv);
        }
    }

    for (let i = 0; i < 4; i++) {
        const newDiv = document.createElement("div");
        newDiv.classList.add("colorCircles");
        newDiv.setAttribute("id", "guess" + i);
        guess.appendChild(newDiv);
    }

    document.getElementById("clear-btn").addEventListener("click", () => clear());
}

function clear() {
    for (let i = 0; i < counter; i++) {
        guess_colour[i] = 0;
        document.getElementById("guess" + i).style.background = `transparent`;
    }
    counter = 0;
    return null;
}

function smoothScrollToBottom(el, duration = 300) {
    const start = el.scrollTop;
    const end = el.scrollHeight;
    const distance = end - start;
    const startTime = performance.now();

    function animateScroll(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        el.scrollTop = start + distance * easeOutCubic(progress);
        if (progress < 1) requestAnimationFrame(animateScroll);
    }

    function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    requestAnimationFrame(animateScroll);
}


function showWinModal() {
    document.getElementById("winModal").classList.remove("hidden");
}
function showLoseModal() {
    document.getElementById("winModal").classList.remove("hidden");
}

function closeWinModal() {
    document.getElementById("winModal").classList.add("hidden");
}
