let notasGuardadas = [];
let paginaActual = 1;
const notasPorPagina = 4;

window.onload = iniciar();

function iniciar() {

    document.getElementById("btnGuardar").addEventListener("click", guardarNota);
    document.getElementById("txtBuscar").addEventListener("keyup", buscarNotas);
    document.getElementById("btnAnterior").addEventListener("click", () => cambiarPagina(-1));
    document.getElementById("btnSiguiente").addEventListener("click", () => cambiarPagina(1));
    mostrarNotas(); // Mostrar las notas al cargar la página

    /*
    const regex = /^bac.*bac$/; // ^ significa que el texto debe empezar con el siguiente patron (bac.*bac) y $ significa que el textto debe terminar con el patron.
    // leyendo la expresion reguar: el texto debe emepezar con 'bac' seguido de cualquier caracter (.*) luego otra vez 'bac' y terminar.
    const text = "bacjhsdfhsfhsufhbac";

    const regerEmail = /^(?!.*\.\.)[a-zA-Z0-9][a-z0-9.+-_%]*@[a-z.-]+\.[a-z]{2,}$/;
    const email = "alexis.-+_2%0029179@cfe-.com.mx";

    if (regerEmail.test(email)) {
        console.log("La cadena coincide con la expresión regular.");
    } else {
        console.log("La cadena no coincide con la expresión regular.");
    }
    */
}

function guardarNota() {
    var nota = document.getElementById("txtNota").value.trim();

    if (nota === "") {
        alert("Por favor, ingrese una nota.");
        return;
    }

    var arrayNotas = []; // Inicializar el array de notas

    if (localStorage.notas != undefined) {
        // Si ya hay notas guardadas, las obtenemos del localStorage
        arrayNotas = JSON.parse(localStorage.notas);
    }

    arrayNotas.push(nota); // Agregar la nota al array

    //localStorage solo guarda cadenas de texto, numeros o booleanos, por lo que debemos convertir el array a una cadena de texto JSON
    localStorage.notas = JSON.stringify(arrayNotas); // Guardar el array en localStorage como una cadena de texto JSON

    document.getElementById("txtNota").value = ""; // Limpiar el campo de entrada
    paginaActual = Math.ceil(arrayNotas.length / notasPorPagina); // Ir a la última página
    mostrarNotas(); // Actualizar la lista de notas
}

function mostrarNotas() {
    let arrayNotas = []; // Inicializar el array de notas

    if (localStorage.notas != undefined) {
        // Si ya hay notas guardadas, las obtenemos del localStorage
        arrayNotas = JSON.parse(localStorage.notas); //JSON.parse convierte la cadena de texto JSON en un array
    }

    notasGuardadas = arrayNotas; //Guardamos una copia de las notas, tenga o no tenga notas el arrayNotas

    const olNotas = document.getElementById("olNotas");
    olNotas.innerHTML = ""; // Limpiar contenido previo

    const txtSinNotas = document.getElementById("txtSinNotas");

    if (arrayNotas.length === 0) {
        //liNota = "<p>No hay notas guardadas.</p>";
        //document.getElementById("olNotas").innerHTML = liNota;
        txtSinNotas.style.display = "block"; // Mostrar mensaje de "No hay notas"
        document.getElementById("paginacion").style.display = "none";
        return; // Salir de la función si no hay notas
    }

    txtSinNotas.style.display = "none"; // Ocultar mensaje de "No hay notas"

    const inicio = (paginaActual - 1) * notasPorPagina;
    const fin = inicio + notasPorPagina;
    const notasPagina = arrayNotas.slice(inicio, fin);

    notasPagina.forEach((nota, index) => {
        const indiceOriginal = inicio + index;
        olNotas.appendChild(crearLiNota(nota, indiceOriginal, arrayNotas));
    });

    actualizarPaginacion(arrayNotas.length);

    /*arrayNotas.forEach(function (nota, index) {
        //html += nota + "<br>"; // Agregar cada nota al HTML
        olNotas.appendChild(crearLiNota(nota, index, arrayNotas)); // Agregar el elemento de lista al ul
    });*/
}

function crearLiNota(nota, index, arrayNotas) {
    const liNota = document.createElement("li"); // Crear un elemento de lista
    liNota.value = index + 1;

    const divLi = document.createElement("div"); // Crear un div que contendrá la nota y el botón
    divLi.className = "divLi"; // Asignar una clase al div para estilos

    const span = document.createElement("span"); // Crear un span para la nota
    span.textContent = nota; // Asignar el texto de la nota al span
    span.className = "spanNota"; // Asignar una clase al span para estilos

    const btnEditar = document.createElement("button");
    btnEditar.textContent = "Editar";
    btnEditar.className = "btnEditar";
    btnEditar.onclick = function () {
        const input = document.createElement("input");
        input.type = "text";
        input.value = nota;
        input.maxLength = 100;
        input.className = "spanNota";
        divLi.replaceChild(input, span);
        input.focus();

        function guardarCambios() {
            const nuevoTexto = input.value.trim();
            if (nuevoTexto === "") {
                alert("La nota no puede estar vacía.");
                input.value = nota;
                //input.focus();
                return;
            }
            arrayNotas[index] = nuevoTexto;
            localStorage.notas = JSON.stringify(arrayNotas);
            mostrarNotas();
        }

        input.addEventListener("blur", function () {
            guardarCambios();
        });
    };

    const btnEliminar = document.createElement("button"); // Crear un botón para eliminar la nota
    btnEliminar.textContent = "Eliminar"; // Asignar texto al botón
    btnEliminar.className = "btnEliminar"; // Asignar una clase al botón para estilos
    btnEliminar.onclick = function () {  // Función para eliminar la nota
        arrayNotas.splice(index, 1); // Eliminar la nota del array
        localStorage.notas = JSON.stringify(arrayNotas); // Actualizar el localStorage

        // Ajustar página si eliminamos el último de la última página
        const totalPaginas = Math.ceil(arrayNotas.length / notasPorPagina);
        if (paginaActual > totalPaginas) {
            paginaActual = totalPaginas;
        }

        mostrarNotas(); // Actualizar la lista de notas
        document.getElementById("txtBuscar").value = "";
    }
    divLi.appendChild(span); // Agregar el span con la nota al div
    divLi.appendChild(btnEditar);
    divLi.appendChild(btnEliminar); // Agregar el botón al div
    liNota.appendChild(divLi); // Agregar el div al elemento de lista

    return liNota;
}

/*function buscarNotas() {
    //console.log(hola.includes(""));
    //console.log(hola.startsWith(""));
    let inputValue = document.getElementById("txtBuscar").value.trim();
    const olNotas = document.getElementById("olNotas");
    olNotas.innerHTML = ""; // Limpia antes de mostrar nuevas coincidencias
    const txtSinNotas = document.getElementById("txtSinNotas");

    if (inputValue === "") {
        mostrarNotas();
        return;
    }

    const prioridadNotaMap = new Map();

    notasGuardadas.forEach((nota) => {
        const prioridad = calcularPrioridad(inputValue.toLowerCase(), nota.toLowerCase());
        if (prioridad > 0) {
            prioridadNotaMap.set(nota, prioridad);
        }
    });

    // Convertir el Map a un array de arrays (clave-valor)
    const mapArray = Array.from(prioridadNotaMap);
    //console.log(JSON.stringify(mapArray));

    // Ordenar el array por prioridad (segundo elemento de cada array interno)
    mapArray.sort((array1, array2) => {
        if (array2[1] !== array1[1]) { //si son diferentes se evaluan
            return array2[1] - array1[1];//Positivo --> se intercambian, Negativo --> permanece igual
        }
        return array1[0].localeCompare(array2[0]); //si son iguales se compara las notas y se ordena alfabetiacamente a-z
    });

    if (mapArray.length === 0) {
        txtSinNotas.style.display = "block";
    } else {
        txtSinNotas.style.display = "none";
        mapArray.forEach((arrayNota) => {
            olNotas.appendChild(crearLiNota(arrayNota[0], notasGuardadas.indexOf(arrayNota[0]), notasGuardadas))
        });
    }
    //console.log(prioridadSpanMap);
    //console.log(liMap.has("Phyton"))
}*/

function buscarNotas() {
    let inputValue = document.getElementById("txtBuscar").value.trim().toLowerCase();
    const olNotas = document.getElementById("olNotas");
    olNotas.innerHTML = "";
    const txtSinNotas = document.getElementById("txtSinNotas");

    if (inputValue === "") {
        paginaActual = 1;
        mostrarNotas();
        return;
    }

    const resultados = [];

    notasGuardadas.forEach((nota, index) => {
        const prioridad = calcularPrioridad(inputValue, nota.toLowerCase());
        if (prioridad > 0) {
            resultados.push({ nota, prioridad, index });
        }
    });

    resultados.sort((a, b) => {
        if (b.prioridad !== a.prioridad) {
            return b.prioridad - a.prioridad;
        }
        if (a.nota !== b.nota) {
            return a.nota.localeCompare(b.nota);
        }
        return a.index - b.index; // más antigua primero
    });

    if (resultados.length === 0) {
        txtSinNotas.style.display = "block";
        document.getElementById("paginacion").style.display = "none";
    } else {
        txtSinNotas.style.display = "none";
        resultados.forEach(({ nota, index }) => {
            olNotas.appendChild(crearLiNota(nota, index, notasGuardadas));
        });
        document.getElementById("paginacion").style.display = "none"; // Ocultamos paginación en modo búsqueda
    }
}

function calcularPrioridad(inputValue, spanContent) {

    let prioridad = 0;

    if (spanContent.includes(inputValue)) {
        prioridad += 3;
        if (spanContent.startsWith(inputValue)) {
            prioridad += 5;
        }
        if (spanContent === inputValue) {
            prioridad += 15;
        }
    }
    return prioridad;
}

function cambiarPagina(direccion) {
    const totalPaginas = Math.ceil(notasGuardadas.length / notasPorPagina);
    paginaActual += direccion;
    if (paginaActual < 1) paginaActual = 1;
    if (paginaActual > totalPaginas) paginaActual = totalPaginas;
    mostrarNotas();
}

function actualizarPaginacion(totalNotas) {
    const totalPaginas = Math.ceil(totalNotas / notasPorPagina);
    const paginacion = document.getElementById("paginacion");

    if (totalPaginas <= 1) {
        paginacion.style.display = "none";
    } else {
        paginacion.style.display = "block";
        document.getElementById("numPagina").textContent = `Página ${paginaActual} de ${totalPaginas}`;
        document.getElementById("btnAnterior").disabled = paginaActual === 1;
        document.getElementById("btnSiguiente").disabled = paginaActual === totalPaginas;
    }
}