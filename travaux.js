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
btnTous.classList.add("tous");
btnTous.innerText = "Tous";
document.querySelector(".categories").appendChild(btnTous);

const reponseCategories = await fetch("http://localhost:5678/api/categories");
const categories = await reponseCategories.json();
console.log(categories);

for (let i = 0; i < categories.length; i++) {
    const btnCategorie = document.createElement("button");
    btnCategorie.classList.add("filtres");
    btnCategorie.innerText = categories[i].name;
    document.querySelector(".categories").appendChild(btnCategorie);
}

btnTous.addEventListener("click", function(event) {
    document.querySelector(".gallery").innerHTML = "";
    genererGallerie(travaux);
})

const filtresCategorie = document.querySelectorAll(".categories .filtres");
for (let i = 0; i < filtresCategorie.length; i++) {
    filtresCategorie[i].addEventListener("click", function(event) {
        const travauxFiltres = travaux.filter(function(travaux) {
            return travaux.categoryId === categories[i].id;
        })
    document.querySelector(".gallery").innerHTML = "";
    genererGallerie(travauxFiltres);
    })
}
