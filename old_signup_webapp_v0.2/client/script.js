window.onload = init;

function init() {
    // rand bg img
    setBgImg(Math.floor(Math.random() * 5));

    // get list of signed up ppl from api
    getList();

    // sign ppl up using api
    document.getElementById("signup-btn").onclick = async function () {
        var name = document.getElementById("name").value;
        var role = document.getElementById("role").value;
        if (name == "") {
            window.alert("you have to have a name to sign up, Anonymous");
            return;
        }
        if (role == "-- select --") {
            role = "";
        }

        await fetch("http://135.181.90.225:8000/signup/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "name": name,
                "role": role,
            })
        })
            .then(resp => resp.json())
            .then(data => {
                if (data.status == 200) {
                    getList();
                }
            })
    };
}

function setBgImg(bgIdx) {
    document.body.style.backgroundImage = "url('bgs/" + bgIdx + ".jpg')";
    bgNms = ["Supernova", "Ice Planet", "Black Citadel", "Battleship", "Jump Gate"]
    document.getElementById("credit").innerHTML = 'Background Image: Gabriel Björk Stiernström "' + bgNms[bgIdx] + '"';
    resizeBgImg();
}

window.onresize = resizeBgImg;

function resizeBgImg() {
    if (window.innerWidth / window.innerHeight > 1920 / 1080) {
        document.body.style.backgroundSize = "100% auto";
    } else {
        document.body.style.backgroundSize = "auto 100%";
    }
}

async function getList() {
    var signedup = [];
    await fetch("http://135.181.90.225:8000/signup/", {
        method: 'GET'
    })
        .then(resp => resp.json())
        .then(data => {
            if (data.status == 200) {
                persons = data.persons.split("\n");
                persons.forEach(person => {
                    var person = person.split("\t");
                    if (person.length == 1) {
                        person.push("");
                    }
                    signedup.push(person);
                });
            }
        })
    document.getElementById("loading").style.display = "none";
    document.getElementById("signedup").innerHTML = "<tr><th><b>#</b></th><th><b>Name</b></th><th><b>Role</b></th></tr>";
    for (let i = 0; i < persons.length - 1; i++) {
        document.getElementById("signedup").innerHTML += "<tr><th>" + (i + 1) + "</th><th>" + signedup[i][0] + "</th><th>" + signedup[i][1] + "</th></tr>";
    }
}