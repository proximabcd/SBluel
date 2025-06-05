const controleIdentifiants = document.querySelector("form");
controleIdentifiants.addEventListener("submit", async function(event) {
    event.preventDefault();
    const identifiants = {
        email: event.target.querySelector("[name=email]").value,
        password: event.target.querySelector("[name=password]").value
    };
    console.log(identifiants);
    const reponseLogin = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
            "accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(identifiants)
    });
    try {
        if (reponseLogin.ok) {
            let elementErreur = document.getElementById("message-erreur");
            if (elementErreur !== null) {
                elementErreur.remove();
            };
            const objetToken = await reponseLogin.json(); 
            console.log(objetToken);
            window.sessionStorage.setItem("1", JSON.stringify(objetToken));
            window.location.href = "./index.html";
        } else {
            if (reponseLogin.status === 401) {
                throw new Error("Not authorized");
            };
            if (reponseLogin.status === 404) {
                throw new Error("User not found");
            };
            console.log(reponseLogin.status);
        }
    } catch (error) {
        let elementErreur = document.getElementById("message-erreur");
        if (elementErreur === null) {
            let elementErreur = document.createElement("p");
            elementErreur.id = "message-erreur";
            elementErreur.innerText = error.message;    
            document.querySelector("form").insertAdjacentElement("beforebegin", elementErreur);
        } else {
            elementErreur.innerText = error.message;
        }
    }
})
