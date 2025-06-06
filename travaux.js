const reponse = await fetch("http://localhost:5678/api/works");
const travaux = await reponse.json();
console.log(travaux)

function genererGallerie(travaux) {
    for (let i = 0; i < travaux.length; i++) {
        const elementFigure = document.createElement("figure");
        const figure = travaux[i];
        const elementImage = document.createElement("img")
        elementImage.src = figure.imageUrl;
        elementImage.alt = figure.title;
        const elementFigcaption = document.createElement("figcaption");
        elementFigcaption.innerText = figure.title;
        document.querySelector(".gallery").appendChild(elementFigure)
        elementFigure.appendChild(elementImage);
        elementFigure.appendChild(elementFigcaption);
    }
}
document.querySelector(".gallery").innerHTML = "";
genererGallerie(travaux);

const conteneurCategories = document.createElement("div");
conteneurCategories.classList.add("categories");
document.querySelector(".gallery").insertAdjacentElement("beforebegin", conteneurCategories);

const btnTous = document.createElement("button");
btnTous.innerText = "Tous";
btnTous.dataset.id = "0";
document.querySelector(".categories").appendChild(btnTous);

const reponseCategories = await fetch("http://localhost:5678/api/categories");
const categories = await reponseCategories.json();
console.log(categories);

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

const utilisateurStorage = window.sessionStorage.getItem("1");
if (utilisateurStorage !== null) {
    afficherModeEdition(travaux);
};

function afficherModeEdition(travaux) {
    const barreMode = document.createElement("div");
    barreMode.classList.add("barre-mode");
    const elementSpan = document.createElement("span");
    elementSpan.classList.add("material-symbols-outlined");
    elementSpan.innerText = "edit_square"
    const elementP = document.createElement("p");
    elementP.innerText = "Mode édition";
    document.querySelector("body").prepend(barreMode);
    barreMode.appendChild(elementSpan);
    barreMode.appendChild(elementP);
    document.querySelector("header").style.margin = "97px 0px 50px 0px";

    const btnModifier = document.createElement("div");
    btnModifier.classList.add("btn-modifier");
    const elementSpan2 = document.createElement("span");
    elementSpan2.classList.add("material-symbols-outlined");
    elementSpan2.innerText = "edit_square";
    const elementP2 = document.createElement("p");
    elementP2.innerText = "Modifier";
    document.querySelector("#portfolio h2").insertAdjacentElement("afterend", btnModifier);
    btnModifier.appendChild(elementSpan2);
    btnModifier.appendChild(elementP2);

    document.querySelector(".categories").innerHTML = "";
    document.querySelector(".gallery").innerHTML = "";
    genererGallerie(travaux);
};
