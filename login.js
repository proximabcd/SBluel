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
            console.log(reponseLogin.status);
        } else {
            if (reponseLogin.status === 401) {
                throw new Error("Mot de passe erroné");
            };
            if (reponseLogin.status === 404) {
                throw new Error("Utilisateur inconnu");
            };
            console.log(reponseLogin.status);
        }
    } catch (error) {
        let elementErreur = document.getElementById("message-erreur");
        if (elementErreur === null) {
            let elementErreur = document.createElement("p");
            elementErreur.id = "message-erreur";
            elementErreur.innerText = error.message;    
            document.querySelector("form").appendChild(elementErreur);
        } else {
            elementErreur.innerText = error.message;
        }
    }
    let elementErreur = document.getElementById("message-erreur");
    if (elementErreur !== null) {
        elementErreur.remove();
    };
    const objetUser = await reponseLogin.json(); 
    window.sessionStorage.setItem(objetUser.userId, objetUser.token);
    window.open("./index.html", "_blank");

})
