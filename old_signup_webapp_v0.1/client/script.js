window.onload = init;

function init() {
    getList();

    document.getElementById("signup-btn").onclick = async function () {
        var name = document.getElementById("name").value;
        if (name == "") {
            window.alert("you have to have a name to sign up, Anonymous");
            return;
        }

        await fetch("http://135.181.90.225:8000/signup/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "name": name,
            })
        })
            .then(resp => resp.json())
            .then(data => {
                if (data.status == 200) {
                    window.alert("all done! you can see your name after I refresh real quick");
                    getList();
                }
            })
    };
}

async function getList() {
    await fetch("http://135.181.90.225:8000/signup/", {
        method: 'GET'
    })
        .then(resp => resp.json())
        .then(data => {
            if (data.status == 200) {
                document.getElementById("signup-list").innerHTML = data.names.replaceAll("\n", "<br>")
            }
        })
}