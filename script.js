
let colaboradores = [];


const form = document.getElementById('colaboradorForm');
const buscadorInput = document.getElementById('buscador');
const tbody = document.getElementById('tablaColaboradores');

/* ESCUCHADORES DE EVENTOS (Event Listeners)*/


form.addEventListener('submit', function(event) {
    event.preventDefault(); // Detiene la recarga nativa del navegador
    procesarFormulario();
});


buscadorInput.addEventListener('input', function() {
    filtrarColaboradores(this.value);
});


/*FUNCIONES DE VALIDACIÓN */

/**
 
 * @param {string} texto - El valor del campo a evaluar.
 * @returns {boolean} True si está vacío, False si tiene contenido.
 */
function esVacio(texto) {
    return texto.trim() === '';
}

/**
 * @param {string} correo - El correo ingresado por el usuario.
 * @returns {Object} Un objeto con el estado de la validación y el mensaje de error si aplica.
 */
function validarCorreoCorporativo(correo) {
    const regexGeneral = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!regexGeneral.test(correo)) {
        return { valido: false, mensaje: "El formato del correo electrónico no es válido." };
    }
    
    if (!correo.toLowerCase().endsWith('@empresa.cl')) {
        return { valido: false, mensaje: "El correo debe tener el dominio @empresa.cl" };
    }
    
    return { valido: true, mensaje: "" };
}

function procesarFormulario() {
    
    const nombreVal = document.getElementById('nombre').value;
    const apellidoVal = document.getElementById('apellido').value;
    const cargoVal = document.getElementById('cargo').value;
    const correoVal = document.getElementById('correo').value;

    let esValido = true;

    
    if (esVacio(nombreVal)) {
        mostrarError('errorNombre', 'El nombre es obligatorio.');
        esValido = false;
    } else {
        limpiarError('errorNombre');
    }

    
    if (esVacio(apellidoVal)) {
        mostrarError('errorApellido', 'El apellido es obligatorio.');
        esValido = false;
    } else {
        limpiarError('errorApellido');
    }

    
    if (esVacio(cargoVal)) {
        mostrarError('errorCargo', 'Debe seleccionar un cargo de la lista.');
        esValido = false;
    } else {
        limpiarError('errorCargo');
    }

    
    if (esVacio(correoVal)) {
        mostrarError('errorCorreo', 'El correo electrónico es obligatorio.');
        esValido = false;
    } else {
        const resultadoCorreo = validarCorreoCorporativo(correoVal);
        if (!resultadoCorreo.valido) {
            mostrarError('errorCorreo', resultadoCorreo.mensaje);
            esValido = false;
        } else {
            limpiarError('errorCorreo');
        }
    }

    
    if (esValido) {
        const nuevoColaborador = {
            id: Date.now(), // ID único basado en milisegundos para poder borrarlo después
            nombre: nombreVal.trim(),
            apellido: apellidoVal.trim(),
            cargo: cargoVal,
            correo: correoVal.trim().toLowerCase()
        };

        colaboradores.push(nuevoColaborador);
        
        form.reset();
        
        buscadorInput.value = '';
        
        renderizarTabla(colaboradores);
    }
}

/**
 * Inserta un mensaje de texto descriptivo en el contenedor de error correspondiente.
 */
function mostrarError(idElemento, mensaje) {
    document.getElementById(idElemento).textContent = mensaje;
}

/**
 * Limpia el mensaje de error de un contenedor específico.
 */
function limpiarError(idElemento) {
    document.getElementById(idElemento).textContent = '';
}


/* LISTADO DINÁMICO (Renderizado de la Tabla)*/

/**

 * @param {Array} listaDeColaboradores - Arreglo de objetos a renderizar.
 */

function renderizarTabla(listaDeColaboradores) {
    
    tbody.innerHTML = '';

    
    if (listaDeColaboradores.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" class="no-data">No se encontraron colaboradores registrados.</td></tr>`;
        return;
    }

    // Recorremos el arreglo de objetos para inyectar cada fila en el DOM
    listaDeColaboradores.forEach(colaborador => {
        const fila = document.createElement('tr');

        // Construimos las celdas usando Template Literals
        fila.innerHTML = `
            <td>${colaborador.nombre} ${colaborador.apellido}</td>
            <td>${colaborador.cargo}</td>
            <td>${colaborador.correo}</td>
            <td>
                <button class="btn-delete" onclick="eliminarColaborador(${colaborador.id})">Eliminar</button>
            </td>
        `;

        // Añadimos el nodo fila como hijo del tbody
        tbody.appendChild(fila);
    });
}



const filtroCriterio = document.getElementById('filtroCriterio');

filtroCriterio.addEventListener('change', function() {
    filtrarColaboradores(buscadorInput.value);
});

/* BÚSQUEDA Y FILTRADO CON FILTROS ESPECÍFICOS*/

/**
 * @param {string} terminoBusqueda - Palabra o caracteres escritos por el usuario.
 */

function filtrarColaboradores(terminoBusqueda) {
    const terminoClean = terminoBusqueda.toLowerCase().trim();
    const criterio = filtroCriterio.value; 

    if (terminoClean === '') {
        renderizarTabla(colaboradores);
        return;
    }

    
    const colaboradoresFiltrados = colaboradores.filter(colaborador => {
        const nombreCompleto = `${colaborador.nombre} ${colaborador.apellido}`.toLowerCase();
        const cargo = colaborador.cargo.toLowerCase();

        
        if (criterio === 'nombre') {
            return nombreCompleto.includes(terminoClean);
        } else if (criterio === 'cargo') {
            return cargo.includes(terminoClean);
        } else {
            return nombreCompleto.includes(terminoClean) || cargo.includes(terminoClean);
        }
    });

    renderizarTabla(colaboradoresFiltrados);
}



/*REQUERIMIENTO 4: ELIMINAR COLABORADOR*/

/**
 * Remueve un colaborador del arreglo global utilizando su identificador único.
 * @param {number} id - Marca de tiempo única del colaborador a remover.
 */

function eliminarColaborador(id) {
    if (confirm("¿Está seguro de que desea eliminar a este colaborador de los registros?")) {
        
        
        colaboradores = colaboradores.filter(colaborador => colaborador.id !== id);

        
        if (buscadorInput.value !== '') {
            filtrarColaboradores(buscadorInput.value);
        } else {
            renderizarTabla(colaboradores);
        }
    }
}

renderizarTabla(colaboradores);