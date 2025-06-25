const reponse = await fetch("http://localhost:5678/api/works");
let travaux = await reponse.json();
console.log(travaux);

document.querySelector(".gallery").innerHTML = "";
genererGallerie(travaux);

const reponseCategories = await fetch("http://localhost:5678/api/categories");
const categories = await reponseCategories.json();
console.log(categories);

genererFiltres(travaux, categories);

const token = window.sessionStorage.getItem("1");
if (token !== null) {
    afficherModeEdition(travaux);
};

//Génération et gestion de la modale

for (let i = 0; i < travaux.length; i++) {
    genererFigure(travaux[i]);
}

const modale = document.querySelector("dialog");
const conteneurVue1 = document.querySelector(".vue1");
const conteneurVue2 = document.querySelector(".vue2");

const btnModifier = document.querySelector(".btn-modifier");
btnModifier.addEventListener("click", () => {
    modale.showModal();
    conteneurVue1.style.display = "flex";
    conteneurVue2.style.display = "none";
});

const btnAjouter = document.getElementById("btn-ajouter");
btnAjouter.addEventListener("click", () => {
    conteneurVue1.style.display = "none";
    conteneurVue2.style.display = "flex";
});

const btnFermer = document.getElementById("btn-fermer");
btnFermer.addEventListener("click", () => {
    modale.close();
});

const btnRetour = document.getElementById("btn-retour");
btnRetour.addEventListener("click", () => {
    conteneurVue1.style.display = "flex";
    conteneurVue2.style.display = "none";
});

const btnFermer2 = document.getElementById("btn-fermer-2");
btnFermer2.addEventListener("click", () => {
    modale.close();
});

modale.addEventListener("click", () => {
    if (event.target === modale) {
        modale.close();
    };
});

//Création des entrées de la liste déroulante (vue2)

for (let i = 0; i < categories.length; i++) {
    const elementOption = document.createElement("option");
    console.log(categories[i].name);
    elementOption.value = categories[i].id;
    elementOption.innerText = categories[i].name;
    document.querySelector("select").appendChild(elementOption);
};

//Suppression d'un travail

const eltsFigVue1 = document.querySelectorAll(".grid figure");
console.log(token);
eltsFigVue1.forEach(figure => {
    console.log(figure);
    figure.addEventListener("click", async () => {
        const id = figure.dataset.id;
        console.log(id);
        const reponseSuppression = await fetch(`http://localhost:5678/api/works/${id}`, {
            method: "DELETE",
            headers: {
                "accept": "*/*",
                "Authorization": `Bearer ${token}`
            }
        });
        try {
            if (reponseSuppression.ok) {
                console.log(reponseSuppression.status);
                console.log(figure);
             } else {
                if (reponseSuppression.status === 401) {
                    throw new Error("Unauthorized");
                }
                if (reponseSuppression.status === 500) {
                    throw new Error("Unexpected Behaviour");
                }
                console.log(reponseSuppression.status);
             }
        } catch (error) {
            console.log(error.message);
        }
        document.querySelector(".grid").removeChild(figure);
        const objetGallerie = document.querySelector(".gallery");
        const eltFigSuppr = objetGallerie.querySelector(`[data-id="${id}"]`);
        objetGallerie.removeChild(eltFigSuppr);
    });
});

//Ajout et upload d'une image

document.getElementById("btn-ajouter-image").addEventListener("click", () => {
document.getElementById("image").click();
});

const inputFichier = document.getElementById("image");
const conteneurImage = document.querySelector(".zone-select-image");
inputFichier.addEventListener("change", (event) => {
    const elementImage = document.createElement("img");
    console.log(inputFichier.files[0]);
    elementImage.src = URL.createObjectURL(inputFichier.files[0]);
    elementImage.classList.add("nouvelle-image");
    const conteneurImage = document.querySelector(".zone-select-image");
    conteneurImage.replaceChildren();
    conteneurImage.appendChild(elementImage);
    document.querySelector(".btn-valider").style.backgroundColor = "#1D6154";
});

//Envoi d'un nouveau travail à l'api

const infosTravail = document.querySelector("#infos-travail");
infosTravail.addEventListener("submit", async (event) => {
    event.preventDefault();
    const donneesForm = new FormData(infosTravail);
    donneesForm.set("image", inputFichier.files[0]);
    console.log(donneesForm);
    const reponseAjout = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
            "accept": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: donneesForm
    });
    console.log(reponseAjout);
    try {
        if (reponseAjout.ok) {
            console.log(reponseAjout.status)
            const elementMessage = document.querySelector(".zone-message p");
            elementMessage.innerText = "Nouveau travail ajouté";
        } else {
            if (reponseAjout.status === 400) {
                throw new Error("Saisie non conforme");
            };
            if (reponseAjout.status === 401) {
                throw new Error("Accès non autorisé"); 
            }
        };
        console.log(reponseAjout.status);
    } catch (error) {
        const elementMessage = document.querySelector(".zone-message p");
        elementMessage.innerText = error.message;
    };
    const reponseTravaux = await fetch("http://localhost:5678/api/works/");
    travaux = await reponseTravaux.json();
    console.log(travaux);
    const nouveauTravail = travaux[travaux.length - 1];
    console.log(nouveauTravail);
    genererFigure(nouveauTravail);
    document.querySelector(".gallery").innerHTML = "";
    genererGallerie(travaux);
});

//Fonctions

function genererGallerie(travaux) {
    for (let i = 0; i < travaux.length; i++) {
        const elementFigure = document.createElement("figure");
        elementFigure.dataset.id = travaux[i].id;
        const elementImage = document.createElement("img");
        elementImage.src = travaux[i].imageUrl;
        elementImage.alt = travaux[i].title;
        const elementFigcaption = document.createElement("figcaption");
        elementFigcaption.innerText = travaux[i].title;
        document.querySelector(".gallery").appendChild(elementFigure);
        elementFigure.appendChild(elementImage);
        elementFigure.appendChild(elementFigcaption);
    }
};

function genererFiltres(travaux, categories) {
    const conteneurCategories = document.createElement("div");
    conteneurCategories.classList.add("categories");
    document.querySelector(".gallery").insertAdjacentElement("beforebegin", conteneurCategories);   

    const btnTous = document.createElement("button");
    btnTous.innerText = "Tous";
    btnTous.dataset.id = "0";
    document.querySelector(".categories").appendChild(btnTous);

    for (let i = 0; i < categories.length; i++) {
        const btnCategorie = document.createElement("button");
        btnCategorie.innerText = categories[i].name;
        btnCategorie.dataset.id = categories[i].id;
        document.querySelector(".categories").appendChild(btnCategorie);
    }

    const filtresCategorie = document.querySelectorAll(".categories button");
    for (let i = 0; i < filtresCategorie.length; i++) {
        filtresCategorie[i].addEventListener("click", function(event) {
            if (event.target.dataset.id === "0") {
                document.querySelector(".gallery").innerHTML = "";
                genererGallerie(travaux);
            } else {
                const travauxFiltres = travaux.filter(function(travaux) {
                    return travaux.categoryId === parseInt(event.target.dataset.id);
                });
                document.querySelector(".gallery").innerHTML = "";
                genererGallerie(travauxFiltres);
            }
        })
    }
}

function afficherModeEdition(travaux) {
    document.querySelector(".categories").innerHTML = "";

    const conteneurBarreMode = document.createElement("div");
    conteneurBarreMode.classList.add("barre-mode");
    const elementIconeBarre = document.createElement("span");
    elementIconeBarre.classList.add("material-symbols-outlined");
    elementIconeBarre.innerText = "edit_square";
    const elementPBarre = document.createElement("p");
    elementPBarre.innerText = "Mode édition";
    document.body.prepend(conteneurBarreMode);
    conteneurBarreMode.appendChild(elementIconeBarre);
    conteneurBarreMode.appendChild(elementPBarre);
    document.querySelector("header").style.marginTop = "97px";

    const btnModifier = document.createElement("button");
    btnModifier.classList.add("btn-modifier");
    const elementIconeBtn = document.createElement("span");
    elementIconeBtn.classList.add("material-symbols-outlined");
    elementIconeBtn.innerText = "edit_square";
    const elementPBtn = document.createElement("p");
    elementPBtn.innerText = "modifier";
    document.body.appendChild(btnModifier);
    btnModifier.appendChild(elementIconeBtn);
    btnModifier.appendChild(elementPBtn);
};

function genererFigure(travail) {
    const elementFigure = document.createElement("figure");
    elementFigure.dataset.id = travail.id;
    const elementImage = document.createElement("img");
    elementImage.src = travail.imageUrl;
    elementImage.alt = travail.title;
    const iconeCorbeille = document.createElement("span");
    iconeCorbeille.classList.add("material-symbols-outlined");
    iconeCorbeille.classList.add("icone-delete");
    iconeCorbeille.innerText = "delete";
    document.querySelector(".grid").appendChild(elementFigure)
    elementFigure.appendChild(elementImage);
    elementFigure.appendChild(iconeCorbeille);
}


