//TODO: ================ GENERADOR DE CARDS  ================

//! [1.0] Declaracion de variables

//? VARS Globales

let cleanStorage; // Nos permitira limpiar todos los nodos / arrays almacenados

//? VARS de información (Arrays - etc.)

let movieArray = []; // Aqui se almacenan las peliculas creadas
let mCard // Es donde se almacena las películas creadas via DOM

//? VARS de autentificación y usuario

import {
    check1,
    check2,
    check3, // la mayoria de imports se utilizan a partir de la linea 175 aprox
    check4,
    check5,
    check6,
    registerForm,
    loginForm,
    containerUser,
    restartStorage,
    sectionContainer
} from "./user.js"

//? VARS de formulario de películas

let movieForm;
let inputId;
let inputName;
let inputGenre; // Al declarar las variables de manera global puedo hacer referencias de funciones en otras
let inputRating;
let movieContainer;
let outpout; // Slider y Output son variables del input range
let slider;
let resetBtn;
let formCheck = false
let randomImg = "" // La misma recibira un valor aleatorio y de acuerdo a que salga se asignara una imagen al crear una película
let imgValue

//! [1.1] Constructor de películas (codigo)

class MovieBuilder { //* Clase constructora utilizada a la hora de crear películas
    constructor(id, name, genre, rating) {
        this.id = id;
        this.name = name.toLowerCase();
        this.genre = genre;
        this.rating = rating;
    }
}

//! [1.2] Inicializacion de elementos

function startElements() { //* inicializamos todos los elementos para utilizarse mas tarde enlanzando diferentes nodos

    //? FORM

    movieForm = document.getElementById("movieForm");
    inputId = document.getElementById("inputId");
    inputName = document.getElementById("inputName");
    inputGenre = document.getElementById("inputGenre");
    inputRating = document.getElementById("inputRating");
    movieContainer = document.getElementById("movieContainer");
    outpout = document.getElementById("ratingValue");
    resetBtn = document.getElementById("resetBtn");

    //? Storage

    cleanStorage = document.getElementById("cleanStorage");

    //? USER REGISTER / LOGIN (Proceso...) 
}

//! [1.3] Inicializacion de eventos

function startEvents() { //* inicializamos eventos a utilizar

    //? FORM

    movieForm.onsubmit = (event) => {
        formValidation(event)
        if (formCheck === true) {
            outpout.innerHTML = "0" // Evitamos que el rating vuelva a 0 si al darle submit no cumple con las condiciones para crear la película
        }
    };

    cleanStorage.onclick = deleteStorage;

    slider = document.getElementById("inputRating").oninput = function () { // El evento "oninput" se ejecuta cuando un usuario escriba algo en un campo <input>
        outpout.innerHTML = this.value; // El valor generado en el input de tipo "rango" se vera reflejado visualmente en el span ya que la prop. InnerHTML nos permitira modificar el codigo del elemento HTML
    }

    resetBtn.onclick = function () {
        inputRating.value = 0
        outpout.innerHTML = "0" // al usar el boton para resetear el formulario y el boton de submit, hacemos que el valor del input rating vuelva a 0
    }
}

//! [1.4] Validacion del formulario (Condiciones a cumplir para poder generar las películas)

function formValidation(event) { //* creamos una funcion la cual nos sirve para validar nuestro formulario
    event.preventDefault();
    let movieId = inputId.value;
    let movieName = inputName.value; // de cada input necesitamos sacar su valor
    let movieGenre = inputGenre.value;
    let movieRating = parseFloat(inputRating.value);

    const idExist = movieArray.some((movieCreated) => movieCreated.id === movieId);

    if (!idExist && movieRating > 0) { // si la ID no se repite estariamos cumpliendo con la condicion para poder crear la card
        let movieCreated = new MovieBuilder(movieId, movieName, movieGenre, movieRating);
        formCheck = true
        movieArray.push(movieCreated); // pusheamos el array a crear utilizando la variable - array "movieArray" que creamos en la linea 3
        movieForm.reset(); // Al darle a SUBMIT el formulario no se limpia, con este METODO logramos que el mismo de RESETEE

        movieStorageUpdate();
        generateMoviesHTML(); // llamamos la funcion que creamos mas abajo la cual generara las cards en el HTML y tiene que ser llamada aqui debido a que se ejecutara CADA VEZ que creemos una card

        Toastify({
            text: "Se creo la película: " + movieName,
            duration: 3000,
            gravity: "top",
            position: "left",
            style: {
                background: "linear-gradient(120deg, #4815be 30%, #148181 100%)",
            },
            onClick: function () {} // Callback after click
        }).showToast();

        console.log(movieArray)

    } else if (movieRating <= 0) {
        Swal.fire({
            icon: 'error',
            title: '¡ERROR!',
            text: 'El rating de la película tiene que ser mayor a 0',
            footer: 'Intentalo nuevamente',
            color: '#ffffff',
            background: 'linear-gradient(150deg, #19366b 20%, #148181 80%)',
            confirmButtonColor: '#2d5ca3'
        });
        formCheck = false

    } else if (idExist) {
        Swal.fire({
            icon: 'error',
            title: '¡ERROR!',
            text: 'La ID de la película ya fue utilizada',
            footer: 'Intenta probar con otra ID',
            color: '#ffffff',
            background: 'linear-gradient(150deg, #19366b 20%, #148181 80%)',
            confirmButtonColor: '#2d5ca3'
        }); // si no se cumple con la condicion nos devolvera un alert hasta que lo hagamos correctamente
        formCheck = false
    }
}

//! [1.5] Creacion de funcion necesaria para eliminar películas

// Hasta este punto ya pudimos crear el ARRAY pero no lo mostramos en NINGUN LADO de nuestro HTML, para eso debemos crear otra funcion

function removeMovie(movieId) { //* creamos la funcion que nos permitira borrar las cards
    let cardDelete = document.getElementById(`movieCard-${movieId}`);
    let indexDel = movieArray.findIndex( // retornamos la posicion del elemento
        (movieCreated) => Number(movieCreated.id) === Number(movieId) //la card a borrar debera cumplir estrictamente con la funcion para ser borrada
    );

    movieArray.splice(indexDel, 1); // removemos el elemento indicado en la array
    cardDelete.remove(); // removemos el nodo con el metodo REMOVE 
    movieStorageUpdate() // Llamamos a la funcion que almacena nuestras cards para mantenerla al lado de nuestro dom y array sobreescribiendo asi la card
}

//! [1.6] Generandor de valores aleatorios (Imagenes randoms al crear una película)

// function randomValue() {

//     imgValue = Math.floor(Math.random() * 5);

//     if (imgValue == 0) {
//         randomImg = "img/index/imgCard0.jpg"
//     } else if (imgValue == 1) {
//         randomImg = "img/index/imgCard1.jpg"
//     } else if (imgValue == 2) {
//         randomImg = "img/index/imgCard2.jpg"
//     } else if (imgValue == 3) {
//         randomImg = "img/index/imgCard3.jpg"
//     } else if (imgValue == 4) {
//         randomImg = "img/index/imgCard4.jpg"
//     }
// }

// function randomValueStorageUpdate() { //* Almacenamos / guardamos nuestros valores booleanos (check 5 y 6) de manera local
//     let rValueJson = JSON.stringify(randomImg); // La pasamos a String

//     localStorage.setItem("randomValue", rValueJson); // Almacenamos la misma
// }

// function getRandomValueInfoFromStorage() { //* Revertimos la transformacion a string para que al recargar la pagina, no se ejecute el formulario de registro / logeo

//     let rValueJson = localStorage.getItem("randomValue"); // seleccionamos la clave a usar

//     randomImg = JSON.parse(rValueJson); // Usamos el metodo parse para revertir el mismo
// }

//! [1.7] Creacion de películas con DOM (interaccion HTML)

function generateMoviesHTML() {
    movieContainer.innerHTML = ""; // Al crear una película y luego otra por default va a volver el producto anteriormente creado + el nuevo es por eso que el innerHTML reemplazara al mismo evitando crear 2 veces lo mismo que ademas es donde llamaremos a crear las cards en el HTML
    movieArray.forEach((movieCreated) => { // vamos a recibir una película
        mCard = document.createElement("figure"); // usamos la propiedad createElement para crear una figure
        mCard.className = ""

        if (movieCreated.genre === "Terror") { // al crear obtendremos 2 clases, 1ra es global "movieCard" la cual da estilo a TODAS
            mCard.className = "movieCard horrorCard"
            randomImg = "img/index/horror1.jpg"
        } else if (movieCreated.genre === "Romance") { // la segunda clase es exclusiva de cada card de acuerdo a que valor en el select de "genero" 
            mCard.className = "movieCard romanceCard"
            randomImg = "img/index/romance1.jpg"
        } else if (movieCreated.genre === "Suspenso") {
            mCard.className = "movieCard suspenseCard"
            randomImg = "img/index/suspense1.jpg"
        } else if (movieCreated.genre === "Comedia") { // Esta clase secundaria "exclusiva" nos serviran para crear filtros más adelante
            mCard.className = "movieCard comedyCard"
            randomImg = "img/index/comedy1.jpg"
        } else if (movieCreated.genre === "Acción") {
            mCard.className = "movieCard actionCard"
            randomImg = "img/index/action1.jpg"
        } else if (movieCreated.genre === "Ciencia Ficción") {
            mCard.className = "movieCard scienceFictionCard"
            randomImg = "img/index/fiction1.jpg"
        } else if (movieCreated.genre === "Musical") {
            mCard.className = "movieCard musicalCard"
            randomImg = "img/index/musical1.jpg"
        } else if (movieCreated.genre === "Fantasía") {
            mCard.className = "movieCard fantasyCard"
            randomImg = "img/index/fantasy1.jpg"
        } else if (movieCreated.genre === "Aventuras") {
            mCard.className = "movieCard adventureCard"
            randomImg = "img/index/adventure1.jpg"
        }

        // randomValueStorageUpdate()
        // randomValue()

        // randomValue() // Llamamos a la funcion que nos permitira obtener una imagen aleatoria

        mCard.id = `movieCard-${movieCreated.id}`; // tambien le asignaremos una ID la cual servira de referencia a la hora de ELIMINAR cards con otra funcion que recibira como nombre una ID ennumerada
        mCard.innerHTML = `
                <h3 class="movieTitle">Película</h3>
                <img src="${randomImg}" alt="película" class="imgCard">
                <p class="movieText">ID: <b class="movieTextBold">${movieCreated.id}</b></p>
                <p class="movieText">Nombre: <b class="movieTextBold">${movieCreated.name}</b></p>
                <p class="movieText">Género: <b class="movieTextBold">${movieCreated.genre}</b></p>
                <p class="movieText">Rating: <b class="movieTextBold">${movieCreated.rating}</b></p>
            <div class="card-footer"> <button class="btn btn-danger formBtnCreate" id="delButtom-${movieCreated.id}" >Eliminar</button></div>
             `; //definimos el cuerpo que tendra la card

        movieContainer.append(mCard); // El APPEND nos permitira insertar nuevos elementos / nodos a uno existente similar a un PUSH
        let delButtom = document.getElementById(`delButtom-${movieCreated.id}`); // Creamos la funcion que sirve para borrar cards dentro de OTRA y no por fuera ya que el mismo se crea dinamicamente al crearse el boton y antes no existe
        delButtom.onclick = () => {

            Swal.fire({
                title: '¿Seguro?',
                text: "No podrás revertir esta acción",
                icon: 'warning',
                showCancelButton: true,
                color: '#ffffff',
                confirmButtonColor: '#2d5ca3',
                cancelButtonColor: '#1b427c',
                background: 'linear-gradient(150deg, #19366b 20%, #148181 80%)',
                cancelButtonText: 'X',
                confirmButtonText: 'Borrar'
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        title: '¡Hecho!',
                        text: "La película fue borrada con exito",
                        icon: 'success',
                        color: '#ffffff',
                        background: 'linear-gradient(150deg, #19366b 20%, #148181 80%)',
                        confirmButtonColor: '#2d5ca3'
                    })
                    removeMovie(movieCreated.id)

                    Toastify({
                        text: "Se elimino la película: " + movieCreated.name,
                        duration: 3000,
                        gravity: "top",
                        position: "right",
                        style: {
                            background: "linear-gradient(160deg, #461ca8 10%, #6d0f0cb4 100%)",
                        },
                        onClick: function () {} // Callback after click
                    }).showToast();
                }
            })
        }; //llamamos a una funcion creada arriba pasandole como parametro lo que queremos borrar
    });
}

//! [1.8] Almacenamiento de datos locales 

//? Movies Storage

function movieStorageUpdate() { //* Almacenamos / guardamos nuestra array de manera local (LocalStorage)
    let moviesJson = JSON.stringify(movieArray); // La pasamos a String
    localStorage.setItem("movies", moviesJson); // Almacenamos la misma
}

function getMoviesFromStorage() { //* revertimos la transformacion a string
    let moviesJson = localStorage.getItem("movies"); // seleccionamos la clave a usar

    if (moviesJson) { // Si el array almacenado no esta vacio lo "revertimos"
        movieArray = JSON.parse(moviesJson); // Usamos el metodo parse para revertir el mismo
        generateMoviesHTML(); // Llamamos de nuevo a la funcion que genera las peliculas dando como resultado que la misma se vuelva a "RECREAR" al ser almacenada
    }
}

//! [1.9] Limpieza de STORAGE

function deleteStorage() { //* La misma nos permite eliminar TODO lo que almacenemos localmente
    Swal.fire({ //Aqui obligamos al usuario a confirmar su accion (en caso del que el mismo no quiera eliminar, puede cancelarlo)
        title: '¿Estas seguro?',
        text: "Tu cuenta sera eliminada y todo lo que hayas creado con ella",
        icon: 'warning',
        color: '#ffffff',
        background: 'linear-gradient(150deg, #19366b 20%, #148181 80%)',
        showCancelButton: true,
        confirmButtonColor: '#2d5ca3',
        cancelButtonColor: '#1b427c',
        confirmButtonText: 'Borrar',
        cancelButtonText: 'X'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire(
                '¡Borrado!',
                'Tu cuenta y contenido fue borrado',
                'success'
            )

            localStorage.clear(); // Metodo que nos permitira eliminar nuestro save local
            movieArray = [];

            if (check1 == true || check2 == true || check3 == true || check4 == true || check5 == true || check6 == true) { // si se cumple la condicion, reseteamos el registro / logeo
                registerForm.classList.remove("hiddeContent");
                loginForm.classList.add("hiddeContent");
                containerUser.classList.remove("hiddeContent");
                sectionContainer.classList.add("filter")
                restartStorage(); // llamamos la funcion exportada
            }

            generateMoviesHTML(); // Actualizamos el resultado sin tener que recargar manualmente la pagina
        }
    })
}

//! [2.0] Punto de encuentro de las funciones

function main() { //* juntamos a la funciones que contienen los elementos y eventos
    startElements();
    startEvents();
    getMoviesFromStorage(); // Llamamos a la funcion que almacena sobrescribiendo a la que crea cards
    // getRandomValueInfoFromStorage();
}

//! [2.1] Llamada principal

main(); // Mandamos a llamar a la funcion principal