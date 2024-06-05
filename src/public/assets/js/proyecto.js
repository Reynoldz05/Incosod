const sideMenu = document.querySelector("aside");
const menuBtn = document.querySelector("#menu-btn");
const closeBtn = document.querySelector("#close-btn");
const themeToggler = document.querySelector(".theme-toggler");
let imgURL;
const nombreProyectoInput = document.getElementById('nombre');
const presupuestoInicialInput = document.getElementById('presupuesto');
const nombreEncargadoInput = document.getElementById('apellidoP');
const fechaInicioInput = document.getElementById('fechaInicio');
const fechaFinInput = document.getElementById('fechaFin');
const descripcionInput = document.getElementById('descripcion');
const btnEmpleadoInput = document.getElementById('btn-empleado');
const btnGuardar = document.querySelector('.btn-guardar');
const listaSugerencias = document.getElementById('lista-sugerencias');
const listaEmpleados = document.querySelector('.employ');
const tituloProyecto = document.querySelector('#titulo-proyecto');
const descripcionProyecto = document.querySelector('#descripcion-proyecto');
const numeroCuadrillas = document.querySelector('.num-cuadrillas');
const presupuesto_Inicial = document.querySelector('#divPresupuestoinicial strong');
const presupuesto_Actual = document.querySelector('#presupuesto-actual');
const atentamente = document.querySelector('.atte strong')
const btnContratista = document.getElementById('btn-contratista');
const contenedorContratistas = document.getElementById('contratistas-agregados');


presupuestoInicialInput.disabled = true;
nombreEncargadoInput.disabled = true;
fechaInicioInput.disabled = true;
fechaFinInput.disabled = true;
descripcionInput.disabled = true;
btnEmpleadoInput.style.pointerEvents = "none";
btnContratista.style.pointerEvents = "none";
let encargadoId = null;
let Employees = [];
let presupuestoActualAnterior = null;
let presupuestoInicial = null;

console.log(descripcionProyecto.textContent);
console.log(numeroCuadrillas.textContent);
console.log(presupuesto_Inicial.textContent);
console.log(presupuesto_Actual.textContent);
console.log(atentamente.textContent);

// Obtener los elementos de las pestañas y su contenido
const tabButtons = document.querySelectorAll('.tab-button');
const tabPanes = document.querySelectorAll('.tab-pane');
const btnProyectos = document.getElementById('tab-proyectos');
const btnCuadrillas = document.getElementById('tab-cuadrillas');

//Funciones que permiten saber si un elemento cuenta con un eventlistener en especifico

function hasEventListener(element, eventName, listener) {
  const eventListeners = getEventListeners(element);
  if (eventListeners && eventListeners[eventName]) {
    return eventListeners[eventName].some(evt => evt.listener === listener);
  }
  return false;
}

function getEventListeners(element) {
  return element.eventListeners || element._eventListeners || element.__eventListeners;
}

// Función para mostrar el contenido de una pestaña
async function showTabPane(tabIndex) {
  // Ocultar todos los contenidos de las pestañas
  tabPanes.forEach(pane => pane.classList.remove('active'));

  // Mostrar el contenido de la pestaña seleccionada
  tabPanes[tabIndex].classList.add('active');

  // Cambiar el estilo de las pestañas
  tabButtons.forEach(button => button.classList.remove('active'));
  tabButtons[tabIndex].classList.add('active');

  // Cargar los proyectos y cuadrillas si se selecciona la pestaña de "Cuadrillas"
  if (tabIndex === 1) {
    await cargarProyectosCuadrillas();
  }

  if (tabIndex === 2) {
    await cargarContratistas();
  }
}

// Agregar eventos de clic a las pestañas
tabButtons.forEach((button, index) => {
  button.addEventListener('click', () => {
    showTabPane(index);
  });
});

// Mostrar la pestaña de proyectos por defecto
showTabPane(0);

if(localStorage.getItem('IDEMPLEADO')){
  localStorage.removeItem('IDEMPLEADO');
}

if(localStorage.getItem('empleadosAsignados')){
  localStorage.removeItem('empleadosAsignados');
}

if(localStorage.getItem('cuadrillasCreadas')){
  localStorage.removeItem('cuadrillasCreadas');
}

if(localStorage.getItem('proyectoId')){
  localStorage.removeItem('proyectoId');
}


/**Inicio de seccion de contratistas*/


/* Agregar event listener de abrir la modal de crear contratista una vez se de clic al logo de crear de dicha seccion */
btnContratista.addEventListener('click', () => {
  mostrarModalContratista();
});

function mostrarModalContratista(proyectoId) {
  const modalContratista = document.createElement('div');
  modalContratista.classList.add('modal');
  modalContratista.innerHTML = `
    <div class="modal-content">
      <h2>Llene los datos del contratista</h2>
      <label for="nombre-contratista">Nombre:</label>
      <input type="text" id="nombre-contratista" placeholder="Nombre del contratista">
      <label for="sueldo-contratista">Sueldo:</label>
      <input type="text" id="sueldo-contratista" placeholder="$">
      <div class="modal-buttons">
        <button id="guardar-contratista" disabled>Guardar</button>
        <button id="cancelar-contratista">Cancelar</button>
      </div>
    </div>
  `;

  
  document.body.appendChild(modalContratista);
  modalContratista.style.display = 'block';
  if(proyectoId){
    const modalContratistas = document.getElementById('modal-contratistas');
    modalContratistas.style.display = 'none';
  }

  const sueldoInput = document.getElementById('sueldo-contratista');
  const guardarBtn = document.getElementById('guardar-contratista');
  const cancelarBtn = document.getElementById('cancelar-contratista');
  const modalContratistas = document.getElementById('modal-contratistas');

  sueldoInput.addEventListener('input', () => {
    if (!sueldoInput.value.startsWith('$')) {
      sueldoInput.value = '$' + sueldoInput.value;
    }
  });

  sueldoInput.addEventListener('blur', () => {
    if (sueldoInput.value === '$') {
      sueldoInput.value = '';
    }
  });

  sueldoInput.addEventListener('focus', () => {
    if (!sueldoInput.value) {
      sueldoInput.value = '$';
    }
  });

  const nombreInput = document.getElementById('nombre-contratista');
  nombreInput.addEventListener('input', () => {
    guardarBtn.disabled = !nombreInput.value.trim() || !sueldoInput.value.trim();
  });

  sueldoInput.addEventListener('input', () => {
    guardarBtn.disabled = !nombreInput.value.trim() || !sueldoInput.value.trim();
  });

  guardarBtn.addEventListener('click', () => {
    const nombre = nombreInput.value.trim();
    const sueldo = parseFloat(sueldoInput.value.replace(/[$,]/g, ''));

    if(proyectoId){
      if (nombre && !isNaN(sueldo)) {
        const contratista = { nombre, sueldo, id_proyecto: proyectoId };
        console.log('Proyecto ID: ',proyectoId);
        guardarContratistaProyecto(contratista);
        modalContratista.remove();

      }
    }else{
      if (nombre && !isNaN(sueldo)) {
        const contratista = { nombre, sueldo };
        guardarContratista(contratista);
        modalContratista.remove();
      }
    }

  });
  
  cancelarBtn.addEventListener('click', () => {
    modalContratista.remove();
    if(proyectoId){
      modalContratistas.style.display = 'block';
    }
  });

  /*
  window.addEventListener('click', (e) => {
    if (e.target === modalContratista) {
      modalContratista.style.display = 'none';
    }
  });*/
}


async function guardarContratistaProyecto(contratista) {
  try {
    const response = await fetch('/guardar-contratista-proyecto', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(contratista)
    });

    if (response.ok) {
      Swal.fire('Éxito', 'Se ha creado el contratista exitosamente', 'success').then( ()=>{
        modal2.style.display = 'none';
      });
      console.log('Contratista guardado exitosamente');
    } else {
      console.error('Error al guardar el contratista');
    }
  } catch (error) {
    console.error('Error al guardar el contratista:', error);
  }
}

function guardarContratista(contratista) {
  let contratistas = JSON.parse(localStorage.getItem('contratistas')) || [];
  contratistas.push(contratista);
  localStorage.setItem('contratistas', JSON.stringify(contratistas));

  const contratistaTarjeta = document.createElement('div');
  contratistaTarjeta.classList.add('contratista-elemento');

  const userIcon = document.createElement('span');
  userIcon.classList.add('material-icons');
  userIcon.textContent = 'person';

  const nombreSpan = document.createElement('span');
  nombreSpan.textContent = contratista.nombre;

  const closeIcon = document.createElement('span');
  closeIcon.classList.add('material-icons');
  closeIcon.textContent = 'close';
  closeIcon.addEventListener('click', () => {
    eliminarContratista(contratista);
    contratistaTarjeta.remove();
  });

  contratistaTarjeta.appendChild(userIcon);
  contratistaTarjeta.appendChild(nombreSpan);
  contratistaTarjeta.appendChild(closeIcon);

  contenedorContratistas.appendChild(contratistaTarjeta);
}

function eliminarContratista(contratista) {
  let contratistas = JSON.parse(localStorage.getItem('contratistas')) || [];
  contratistas = contratistas.filter(c => c.nombre !== contratista.nombre || c.sueldo !== contratista.sueldo);
  if(contratistas.length === 0){
    localStorage.removeItem('contratistas');
  }else{
    localStorage.setItem('contratistas', JSON.stringify(contratistas));
  }
 
  
}
/*Fin seccion de contratistas*/



nombreProyectoInput.addEventListener('input', () => {
  if (nombreProyectoInput.value.trim() !== '') {
    presupuestoInicialInput.disabled = false;
    nombreEncargadoInput.disabled = false;
  } else {
    presupuestoInicialInput.disabled = true;
    nombreEncargadoInput.disabled = true;
    presupuestoInicialInput.value = '';
    nombreEncargadoInput.value = '';
    fechaInicioInput.disabled = true;
    fechaFinInput.disabled = true;
    descripcionInput.disabled = true;
    btnEmpleadoInput.style.pointerEvents = "none";
    btnContratista.style.pointerEvents = "none";
    fechaInicioInput.value = '';
    fechaFinInput.value = '';
    descripcionInput.value = '';

  }

  
});

function toggleRestoCampos() {
  if (presupuestoInicialInput.value.trim() !== '' && nombreEncargadoInput.value.trim() !== '') {
    fechaInicioInput.disabled = false;
    fechaFinInput.disabled = false;
    descripcionInput.disabled = false;
    btnEmpleadoInput.style.pointerEvents = "auto";
    btnContratista.style.pointerEvents = "auto";
  } else {
    fechaInicioInput.disabled = true;
    fechaFinInput.disabled = true;
    descripcionInput.disabled = true;
    btnEmpleadoInput.style.pointerEvents = "none";
    btnContratista.style.pointerEvents = "none";
    fechaInicioInput.value = '';
    fechaFinInput.value = '';
    descripcionInput.value = '';
  }
}

presupuestoInicialInput.addEventListener('input', toggleRestoCampos);




//Mostrar sidebar
menuBtn.addEventListener('click', () =>{
    
    sideMenu.classList.add('show-sidebar');
});

//Ocultar sidebar
closeBtn.addEventListener('click', () =>{
    
    sideMenu.classList.remove('show-sidebar');
});

//Cambiar tema
themeToggler.addEventListener('click', ()=>{

    document.body.classList.toggle('dark-theme-variables');

    themeToggler.querySelector('span:nth-child(1)').classList.toggle('active');
    themeToggler.querySelector('span:nth-child(2)').classList.toggle('active');

});




///////////////////////NAVEGACIÓN PANTALLAS////////////////////////


//Pestaña Index
const panelControl = document.getElementById("panel-control");

panelControl.addEventListener("click", () => {
  window.location.href = "index.html"; 
});

//Pestaña Empleados
const Empleados = document.getElementById("p-empleados");

Empleados.addEventListener("click", () => {
  window.location.href = "empleados.html"; 
});

//Subpestaña RegistrarAsistencia
const Asistencia = document.getElementById('registro-asistencia');

Asistencia.addEventListener('click', () => {

  window.location.href = 'asistencia_registrar.html';

});

//Subpestaña ConsultarAsistencia
const consulta = document.getElementById('consulta-asistencia');

consulta.addEventListener('click', () => {

  window.location.href = 'asistencia_consultar.html';

});

//Submenu

const $asistencias = document.getElementById('asistencias');
const $submenu = document.getElementById('submenu');

$asistencias.addEventListener('click', e =>{
    e.stopPropagation();

    $submenu.classList.toggle('mostrar');
});

//Pestaña Proyectos
const proyecto = document.getElementById("proyectos");

proyecto.addEventListener("click", () => {
  window.location.href = "proyecto.html"; 
});



///////////////////////Tarjetas//////////////////

// Obtener tarjetas
const tarjetas = document.querySelectorAll('.insights > div');
const modal = document.getElementById('modal');
const modal2 = document.getElementById('modal2');
const employed = document.getElementById('numero');
const modal3 = document.getElementById('modal3');
const borrar = document.querySelectorAll('.delete')
var btn = document.querySelector(".btn-add");
const btnAdd = document.getElementById('btn-empleado');
const modal4 = document.getElementById('modal4');
const btnEmpleados = document.querySelector('.btn-guardarE');
var inputs = document.querySelectorAll('#modal input[type="text"]');
var dateInputs = document.querySelectorAll('#modal input[type="date"]');
var button = document.querySelector('button[type="submit"]');
const checkboxes = document.querySelectorAll('input[type="checkbox"]');
const descripcion = document.getElementById('descripcion');
const modalListaContratistas = document.getElementById('modal-contratistas');


// Recorrer cada una
tarjetas.forEach(tarjeta => {

  tarjeta.addEventListener('click', () => {

    if (tarjeta.classList.contains('asistencias')) {
      modal.style.display = 'block';
      nombreProyectoInput.disabled = false;
      presupuestoInicialInput.disabled = true;
      nombreEncargadoInput.disabled = true;
      fechaInicioInput.disabled = true;
      fechaFinInput.disabled = true;
      descripcionInput.disabled = true;
      btnEmpleadoInput.style.pointerEvents = 'none';
      nombreProyectoInput.value = '';
      presupuestoInicialInput.value = '';
      nombreEncargadoInput.value = '';
      fechaInicioInput.value = '';
      fechaFinInput.value = '';
      descripcionInput.value = '';
    }

    if(tarjeta.classList.contains('empleados')) {
      modal2.style.display = 'block';
     
    }
    
    if(tarjeta.classList.contains('asistencias')) {
      
      modal.style.display = 'block';
      button.disabled = true; 
      for (var i = 0; i < inputs.length; i++) {
        inputs[i].value = '';
    }

      return;
    }
  
  });

});

 function limpiarModalCrearProyecto(){
  modal.style.display = "none";
  listaSugerencias.innerHTML = '';
  listaSugerencias.style.display = 'none';
  nombreEncargadoInput.value = '';
  nombreProyectoInput.value = '';
  descripcion.value = '';

  // Eliminar todas las cuadrillas y limpiar el localStorage
  const cuadrillasCreadas = document.querySelectorAll('.empleado-elemento');
  cuadrillasCreadas.forEach(cuadrilla => cuadrilla.remove());
  localStorage.removeItem('cuadrillasCreadas');
  localStorage.removeItem('empleadosAsignados');
  localStorage.removeItem('contratistas');
  dateInputs.forEach(dateInput => {
      dateInput.value = '';
    });

   const selectedEmployee = document.querySelectorAll('.empleado-elemento');
   selectedEmployee.forEach(employee => {
    employee.remove();
   });

   const contratistasCreados = document.querySelectorAll('.contratista-elemento');
   contratistasCreados.forEach(item =>{
      item.remove();
   })

   const fileInput = document.getElementById('file-input');
   fileInput.value = '';
   imgURL = ''; 

   const cameraIcon = document.getElementById('camera-icon');
   cameraIcon.textContent = 'add_a_photo';
   const spanElement = cameraIcon.nextElementSibling;
   if (spanElement && spanElement.tagName === 'SPAN') {
    spanElement.remove();
  }
   

  button.disabled = true;
 }

// When the user clicks anywhere outside of the modal, close it
window.onclick = async (e) => {
  if (e.target === modal) {
    limpiarModalCrearProyecto();
    localStorage.removeItem('IDEMPLEADO');
  } else if (e.target === modal2) {
    modal2.style.display = "none";
    presupuestoActualInput.value = '$' + presupuestoActualAnterior.toFixed(2);
    presupuestoActualInput.disabled = true;
    editIcon.textContent = 'edit';
    mensajeAdvertencia.style.display = 'none';
    editIcon.style.pointerEvents = 'auto';
  } else if (e.target === modal3) {
    nombre_proyecto.forEach(nmbre_proyecto => {
      nmbre_proyecto.style.display = "none";
      const entrada = nmbre_proyecto.querySelector('input');
      entrada.value = '';
    });
    modal3.style.display = "none";
  } else if (e.target === modal4) {
    document.getElementById('cantidad-cuadrillas').value = '';
    document.getElementById('contenedor-inputs').innerHTML = '';
    btnEmpleados.disabled = true;
    modal4.style.display = "none";
  } else if (e.target === modal5) {
    modal5.style.display = 'none';
    checkboxesModal5.forEach(checkbox5 => {
      checkbox5.checked = false;
    });
    btnAsignar.disabled = true;
  } else if (e.target === modal6) {
    modal6.style.display = 'none';
  } else if (e.target === modalListaContratistas) {
    modalListaContratistas.style.display = 'none';
  }
};

// ... (Código anterior)

// Cierre de modales con el botón "closes"
const closeButtons = document.querySelectorAll('.closes');
closeButtons.forEach(button => {
  button.addEventListener('click', () => {
    const modal = button.closest('.modal');
    if (modal) {
      modal.style.display = 'none';
    }
  });
});

// ... (Código posterior)





//////////////////////Mantiene el simbolo de pesos para la modal
var inputPresupuesto = document.getElementById('presupuesto');

inputPresupuesto.addEventListener('input', function (e) {
    if (!this.value.startsWith('$')) {
        this.value = '$' + this.value;
    }
});

inputPresupuesto.addEventListener('blur', function (e) {
    if (this.value === '$') {
        this.value = '';
    }
});

inputPresupuesto.addEventListener('focus', function (e) {
    if (!this.value) {
        this.value = '$';
    }
});


//Apartado para filtrar las cuadrillas de cada uno de los proyectos creados:

// Función para cargar los proyectos y cuadrillas
async function cargarProyectosCuadrillas() {
  try {
    const respuesta = await fetch('/obtener-proyectos-cuadrillas');
    const datos = await respuesta.json();

    const proyectosCuadrillasContainer = document.querySelector('.proyectos-cuadrillas');
    proyectosCuadrillasContainer.innerHTML = ''; // Limpiar el contenido anterior

    if (datos && datos.proyectos.length > 0) {
      const proyectosAgrupados = agruparPorProyecto(datos.proyectos);

      for (const [idProyecto, proyectoCuadrillas] of Object.entries(proyectosAgrupados)) {
        // Crear un elemento para el proyecto
        const proyectoElement = document.createElement('div');
        const proyectoTitulo = document.createElement('h2');
        proyectoTitulo.textContent = proyectoCuadrillas[0].nombre_proyecto;
        proyectoElement.appendChild(proyectoTitulo);

        // Crear elementos para las cuadrillas del proyecto
        const cuadrillasContainer = document.createElement('div');
        proyectoCuadrillas.forEach(cuadrilla => {
          if (cuadrilla.id_cuadrilla && cuadrilla.nombre_cuadrilla) {
            const cuadrillaElement = document.createElement('div');
            cuadrillaElement.classList.add('card');

            const icon = document.createElement('i');
            icon.classList.add('fas', 'fa-users');

            const title = document.createElement('h3');
            title.textContent = cuadrilla.nombre_cuadrilla;

            const empleadosCount = document.createElement('p');
            empleadosCount.textContent = `Hay un total de ${cuadrilla.cantidad_empleados} empleados en esta cuadrilla.`;

            // Agregar el logo de "x" para eliminar el proyecto
            const deleteIcon = document.createElement('span');
            deleteIcon.classList.add('delete-icon');
            deleteIcon.innerHTML = '&times;';
            deleteIcon.addEventListener('click', (event) => {
              event.stopPropagation();
              confirmarEliminarProyecto(cuadrilla.id_cuadrilla, cuadrilla.nombre_cuadrilla);
            });

            const cardContent = document.createElement('div');
            cardContent .classList.add('card-content');
            cardContent.appendChild(icon);
            cardContent.appendChild(title);
            cardContent.appendChild(empleadosCount);

            cuadrillaElement.appendChild(cardContent);
            cuadrillaElement.appendChild(deleteIcon);

            cuadrillaElement.addEventListener('click', () => {
              cargarEmpleadosCuadrilla(cuadrilla.id_cuadrilla, cuadrilla.cantidad_empleados);
              modal3.style.display = 'block';
              modal6.style.display = 'none';
            });

            cuadrillasContainer.appendChild(cuadrillaElement);
          }
        });

        proyectoElement.appendChild(cuadrillasContainer);
        proyectosCuadrillasContainer.appendChild(proyectoElement);
      }
    } else {
      const mensajeElement = document.createElement('p');
      mensajeElement.textContent = 'No hay proyectos ni cuadrillas disponibles.';
      proyectosCuadrillasContainer.appendChild(mensajeElement);
    }
  } catch (error) {
    console.error('Error al cargar los proyectos y cuadrillas:', error);
  }
}

function agruparPorProyecto(cuadrillas) {
  const proyectosAgrupados = {};

  cuadrillas.forEach(cuadrilla => {
    const idProyecto = cuadrilla.id_proyecto;
    if (!proyectosAgrupados[idProyecto]) {
      proyectosAgrupados[idProyecto] = [];
    }
    proyectosAgrupados[idProyecto].push(cuadrilla);
  });

  return proyectosAgrupados;
}


//Funcion que obtiene los datos de los contratistas y genera las filas de la tabla contratistas

async function cargarContratistas() {
  try {
    const response = await fetch('/obtener-contratistas');
    const data = await response.json();

    const tablaContratistas = document.getElementById('tabla-contratistas');
    const tbody = tablaContratistas.querySelector('tbody');
    tbody.innerHTML = '';

    data.contratistas.forEach(contratista => {
      const row = document.createElement('tr');

      const nombreCell = document.createElement('td');
      nombreCell.textContent = contratista.nombre;
      row.appendChild(nombreCell);

      const proyectoCell = document.createElement('td');
      proyectoCell.textContent = contratista.nombre_proyecto;
      row.appendChild(proyectoCell);

      const sueldoCell = document.createElement('td');
      sueldoCell.textContent = `$${contratista.sueldo.toFixed(2)}`;
      row.appendChild(sueldoCell);

      const fechaAgregadoCell = document.createElement('td');
      const [year, month, day] = contratista.fecha_agregado.split('-');
      const fechaAgregado = new Date(year, month - 1, day);
      const opcionesFecha = { day: '2-digit', month: 'long', year: 'numeric' };
      const fechaFormateada = fechaAgregado.toLocaleDateString('es-ES', opcionesFecha);
      fechaAgregadoCell.textContent = fechaFormateada;
      row.appendChild(fechaAgregadoCell);

      const accionesCell = document.createElement('td');
      accionesCell.classList.add('acciones');

      const editIcon = document.createElement('span');
      editIcon.classList.add('material-icons');
      editIcon.textContent = 'edit';
      editIcon.dataset.id = contratista.id;
      editIcon.addEventListener('click', () => {
        mostrarModalEditarContratista(contratista);
      });
      accionesCell.appendChild(editIcon);

      const deleteIcon = document.createElement('span');
      deleteIcon.classList.add('material-icons');
      deleteIcon.textContent = 'delete';
      deleteIcon.dataset.id = contratista.id;
      deleteIcon.addEventListener('click', () => {
        confirmEliminarContratista(contratista.id, contratista.nombre);
      });
      accionesCell.appendChild(deleteIcon);

      row.appendChild(accionesCell);

      tbody.appendChild(row);
    });
  } catch (error) {
    console.error('Error al cargar los contratistas:', error);
  }
}

//Funcion que se encarga de mostrar la modal que permitira editar los datos del contratista
function mostrarModalEditarContratista(contratista) {
  const modalEditarContratista = document.createElement('div');
  modalEditarContratista.classList.add('modal');
  modalEditarContratista.innerHTML = `
    <div class="modal-content">
      <h2>Editar Contratista</h2>
      <label for="nombre-contratista-editar">Nombre:</label>
      <input type="text" id="nombre-contratista-editar" placeholder="Nombre del contratista" value="${contratista.nombre}">
      <label for="sueldo-contratista-editar">Sueldo:</label>
      <input type="text" id="sueldo-contratista-editar" placeholder="$" value="${contratista.sueldo}">
      <div class="modal-buttons">
        <button id="modificar-contratista" data-id="${contratista.id}">Modificar</button>
        <button id="cancelar-editar-contratista">Cancelar</button>
      </div>
    </div>
  `;

  document.body.appendChild(modalEditarContratista);
  modalEditarContratista.style.display = 'block';

  const nombreInput = document.getElementById('nombre-contratista-editar');
  const sueldoInput = document.getElementById('sueldo-contratista-editar');
  const modificarBtn = document.getElementById('modificar-contratista');
  const cancelarBtn = document.getElementById('cancelar-editar-contratista');

  // Habilitar/deshabilitar el botón "Modificar" según los campos de entrada
  function validarCampos() {
    modificarBtn.disabled = !nombreInput.value.trim() || !sueldoInput.value.trim();
  }

  nombreInput.addEventListener('input', validarCampos);
  sueldoInput.addEventListener('input', validarCampos);

  modificarBtn.addEventListener('click', async () => {
    const nombre = nombreInput.value.trim();
    const sueldo = parseFloat(sueldoInput.value.replace(/[^0-9.]/g, ''));
    await modificarContratista(contratista.id, nombre, sueldo);
    modalEditarContratista.remove();
  });

  cancelarBtn.addEventListener('click', () => {
    modalEditarContratista.remove();
  });
}

async function modificarContratista(id, nombre, sueldo) {
  try {
    const response = await fetch(`/modificar-contratista?id=${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ nombre, sueldo })
    });

    if (response.ok) {
      await Swal.fire('Éxito', 'El contratista ha sido modificado exitosamente', 'success');
      cargarContratistas();
    } else {
      await Swal.fire('Error', 'No se pudo modificar al contratista', 'error');
    }
  } catch (error) {
    console.error('Error al modificar al contratista:', error);
    await Swal.fire('Error', 'Ocurrió un error al modificar al contratista', 'error');
  }
}


async function confirmEliminarContratista(id, nombre) {
  const result = await Swal.fire({
    title: '¿Estás seguro?',
    text: `¿Deseas eliminar al contratista ${nombre}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  });

  if (result.isConfirmed) {
    await borrarContratista(id);
  }
}


async function borrarContratista(id) {
  try {
    const response = await fetch(`/eliminar-contratista-proyecto?contratistaId=${id}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      await Swal.fire('Éxito', 'El contratista ha sido eliminado exitosamente', 'success');
      cargarContratistas();
    } else {
      await Swal.fire('Error', 'No se pudo eliminar al contratista', 'error');
    }
  } catch (error) {
    console.error('Error al eliminar al contratista:', error);
    await Swal.fire('Error', 'Ocurrió un error al eliminar al contratista', 'error');
  }
}


//////////////Abrir Explorador de Archivos con el Icono de Camera
document.getElementById('camera-icon').addEventListener('click', () => {
      
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    // El usuario está utilizando un dispositivo móvil
    mostrarModalFotografia();
  } else {
    // El usuario está utilizando un ordenador
    document.getElementById('file-input').click();
  }

});



function mostrarModalFotografia() {

  // Obtener referencias a los elementos de la modal
  const modalFotografia = document.getElementById('modal-fotografia');

  modalFotografia.style.display = 'block';

  const opcionGaleria = document.getElementById('opcion-galeria');
  const opcionCamara = document.getElementById('opcion-camara');

  // Evento de clic en la opción de galería
  opcionGaleria.addEventListener('click', () => {
    document.getElementById('file-input').click();
    modalFotografia.style.display= 'none';
  });

  // Evento de clic en la opción de cámara
  opcionCamara.addEventListener('click', () => {
    tomarFotografia();
    modalFotografia.style.display= 'none';
  });

  
}


//Implementacion de la funcion tomar fotografia la cual permite al usuario tomar una fotografia desde la camara del dispositivo movil
function tomarFotografia() {
  // Verificar si el navegador admite la API de Media Devices
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        // Crear un elemento de video para mostrar la vista previa de la cámara
        const videoElement = document.createElement('video');
        videoElement.srcObject = stream;
        videoElement.play();

        // Crear un contenedor para el video y el botón de captura
        const contenedorCamara = document.createElement('div');
        contenedorCamara.classList.add('contenedor-camara');
        contenedorCamara.appendChild(videoElement);

        // Crear un botón para capturar la imagen
        const botonCapturar = document.createElement('button');
        botonCapturar.textContent = 'Capturar';
        botonCapturar.classList.add('boton-capturar');
        contenedorCamara.appendChild(botonCapturar);

        // Agregar el contenedor de la cámara al body
        document.body.appendChild(contenedorCamara);

        // Crear un canvas para capturar la imagen
        const canvasElement = document.createElement('canvas');
        const context = canvasElement.getContext('2d');

        // Evento de clic en el botón de captura
       
      botonCapturar.addEventListener('click', () => {
        context.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
        const imageUrl = canvasElement.toDataURL('image/jpeg');

        // Detener la transmisión de video
        stream.getTracks().forEach(track => track.stop());

        // Crear un objeto File a partir de la URL de la imagen capturada
        fetch(imageUrl)
          .then(res => res.blob())
          .then(blob => {
            const file = new File([blob], 'imagen_capturada.jpg', { type: 'image/jpeg' });
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            document.getElementById('file-input').files = dataTransfer.files;

            // Eliminar el contenedor de la cámara
            contenedorCamara.remove();

            // Cambiar el icono de la cámara por el icono de editar y agregar el texto "Cambiar imagen"
            const cameraIcon = document.getElementById('camera-icon');
            cameraIcon.textContent = 'edit';
            cameraIcon.insertAdjacentHTML('afterend', '<span>Cambiar imagen</span>');

            // Actualizar la visualización de la imagen en la modal
            const imgElement = document.createElement('img');
            imgElement.src = imageUrl;
            imgElement.style.maxWidth = '100%';
            imgElement.style.maxHeight = '200px';
            imgElement.style.marginBottom = '10px';

            const modalContent = document.querySelector('.modal-content');
            const existingImg = modalContent.querySelector('img');

            if (existingImg) {
              existingImg.remove();
            }

            modalContent.insertBefore(imgElement, modalContent.firstChild);
          });
      });
      })
      .catch(error => {
        console.error('Error al acceder a la cámara:', error);
      });
  } else {
    console.error('La API de Media Devices no es compatible en este navegador.');
  }
}



///////////////////////////////////// Desactiva el botón de guardar para Agregar un nuevo Proyecto

button.disabled = true;

function checkInputs() {
  let isValid = true;

  inputs.forEach(input => {
    if (input.value === '' || input.value === '$') {
      isValid = false;
   }
  });

  if (descripcion.value.trim().length === 0) {
    isValid = false;
  }

  dateInputs.forEach(dateInput => {
    if (dateInput.value === '') {
      isValid = false;
   }
  });

  return isValid;
}


  inputs.forEach(input => {
     input.addEventListener('input', verify); 
     descripcion.addEventListener('input', verify);
  });
  
  dateInputs.forEach(dateInput => {
    dateInput.addEventListener('input', verify);  
  });

  function checkCuadrillas() {
    const empleadosAgregadosHabilitados = document.querySelectorAll('.empleado-elemento:not(.disabled)');
    const empleadosAgregados = document.querySelectorAll('.empleado-elemento.disabled');
    return empleadosAgregadosHabilitados.length == 0 && empleadosAgregados.length > 0 && Array.from(empleadosAgregados).every(cuadrilla => cuadrilla.hasAttribute('data-empleados-seleccionados'));
  }


  


////Seleccion de Imagen de Fondo de la Tarjeta

// Evento de cambio para el input de archivo
document.getElementById('file-input').addEventListener('change', (e) => {

  const cameraIcon = document.getElementById('camera-icon');
  if(cameraIcon.textContent == 'add_a_photo'){
    cameraIcon.textContent = 'edit';
    cameraIcon.insertAdjacentHTML('afterend', '<span>Cambiar imagen</span>');
  }
    

});


/////Obtener valores de fecha del modal

let fechaInicio;
let fechaFin;
fechaInicioInput.addEventListener('change', () => {
  fechaInicio = new Date(fechaInicioInput.value);
  verify();
  validarFechas();
});

fechaFinInput.addEventListener('change', () => {
  fechaFin = new Date(fechaFinInput.value);
  verify();
  validarFechas();
});

function verify() {
  let inputsValid = checkInputs();
  let cuadrillasValid = checkCuadrillas();
  let fechasValid = validarFechas();
  

  button.disabled = !inputsValid || !cuadrillasValid || !fechasValid;
}

function validarFechas() {
  const errorFechaInicio = document.getElementById('errorFechaInicio');
  const errorFechaFin = document.getElementById('errorFechaFin');

  errorFechaInicio.textContent = '';
  errorFechaFin.textContent = '';

  if (fechaInicio && fechaFin) {
    if (fechaFin < fechaInicio) {
      errorFechaFin.textContent = 'La fecha de finalización no puede ser menor a la fecha de inicio.';
      return false;
    } else if (fechaInicio > fechaFin) {
      errorFechaInicio.textContent = 'La fecha de inicio no puede ser mayor a la fecha de finalización.';
      return false;
    }

    
  }
  return true;
}



///////Modificación del presupuesto actual


var colorDarkVariant = getComputedStyle(document.documentElement).getPropertyValue('--color-dark-variant');
const editIcon = document.getElementById('edit-icon');
const presupuestoActualInput = document.getElementById('presupuesto-actual');
const mensajeAdvertencia = document.getElementById('mensaje-advertencia');
presupuestoActualInput.disabled = true;



editIcon.addEventListener('click', async function(e) {
  

  if (editIcon.textContent === 'edit') {
    editIcon.textContent = 'done';
    presupuestoActualInput.disabled = false;
    presupuestoActualInput.focus();
  } else {
    const valorIngresado = presupuestoActualInput.value.trim();

    if (valorIngresado === '') {
      editIcon.style.pointerEvents = 'none';
      mensajeAdvertencia.textContent = 'Debe ingresar una cantidad.';
      mensajeAdvertencia.style.display = 'block';
      return;
    }

    const valorNumerico = parseFloat(valorIngresado.replace(/[^0-9.]/g, ''));

    if (isNaN(valorNumerico)) {
      editIcon.style.pointerEvents = 'none';
      mensajeAdvertencia.textContent = 'Debe ingresar un valor numérico válido.';
      mensajeAdvertencia.style.display = 'block';
      return;
    }else if (valorNumerico < presupuestoActualAnterior) {
      editIcon.style.pointerEvents = 'none';
      mensajeAdvertencia.textContent = 'Debe ingresar una cantidad mayor a la anterior.';
      mensajeAdvertencia.style.display = 'block';
      return;
    }

    // Actualizar el presupuesto actual en la base de datos
    const proyectoId = e.target.dataset.id;
    console.log("PROYECTO ID DEVUELTO: ",proyectoId);
    await actualizarPresupuestoActual(proyectoId, valorNumerico)
      .then(() => {
        presupuestoActualInput.value = '$' + valorNumerico.toFixed(2);
        editIcon.textContent = 'edit';
        presupuestoActualInput.disabled = true;
        editIcon.style.pointerEvents = 'auto';
        mensajeAdvertencia.style.display = 'none';
        presupuestoActualAnterior = valorNumerico;
        if (valorNumerico > presupuestoInicial) {
          mensajeAdvertencia.textContent = 'El presupuesto actual ha sobrepasado al inicial.';
          mensajeAdvertencia.style.display = 'block';
          document.querySelector('#presupuesto-actual').style.color = 'red';
        }
      })
      .catch(error => {
        console.error('Error al actualizar el presupuesto actual:', error);
        // Manejar el error adecuadamente
      });
  }
});

presupuestoActualInput.addEventListener('input', function() {
  const valor = this.value;
  const valorSinSigno = valor.replace(/\$/g, '');

  if (/^[0-9]*\.?[0-9]*$/.test(valorSinSigno)) {
    this.value = '$' + valorSinSigno;
  } else {
    this.value = '$' + valorSinSigno.slice(0, -1);
  }

  
  if (this.value === '$' || this.value === '$.') {
    editIcon.style.pointerEvents = 'none';
    mensajeAdvertencia.textContent = 'Debe ingresar una cantidad.';
    mensajeAdvertencia.style.display = 'block';
    
  }else if(this.value <= presupuestoActualAnterior){
      editIcon.style.pointerEvents = 'none';
      mensajeAdvertencia.textContent = 'Debe ingresar una cantidad mayor a la anterior.';
      mensajeAdvertencia.style.display = 'block';
  }
  
  else{
    editIcon.style.pointerEvents = 'auto';
    mensajeAdvertencia.style.display = 'none';
  }
});

async function actualizarPresupuestoActual(proyectoId, presupuestoActual) {
  return await fetch(`/actualizar-presupuesto-actual?id=${proyectoId}&presupuesto=${presupuestoActual}`, {
    method: 'PUT'
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        console.log('Presupuesto actual actualizado correctamente');
      } else {
        throw new Error('Error al actualizar el presupuesto actual');
      }
    });
}


//Generar modal con la cantidad de cuadrillas que contenga x proyecto

numeroCuadrillas.addEventListener('click', e => {
  const proyectoId = e.target.dataset.id;
  localStorage.setItem('proyectoId', proyectoId);
  console.log("Id del proyecto desde la parte de numero de cuadrillas",proyectoId);
  cargarCuadrillas(proyectoId);
  modal6.style.display = 'block';
});

async function cargarCuadrillas(proyectoId) {
  return await fetch(`/obtener-cuadrillas?id=${proyectoId}`)
    .then(response => response.json())
    .then(data => {
      const cardContainer = document.getElementById('card-container');
      cardContainer.innerHTML = '';
      const header = document.getElementById('h2-cuadrillas');
      header.textContent = `Cuadrillas del proyecto ${data.cuadrillas[0].nombre_proyecto}`;
      data.cuadrillas.forEach(cuadrilla => {
        const card = document.createElement('div');
        card.classList.add('card');

        const icon = document.createElement('i');
        icon.classList.add('fas', 'fa-users');

        const title = document.createElement('h3');
        title.textContent = cuadrilla.nombre;

        const empleadosCount = document.createElement('p');
        if(cuadrilla.cantidad_empleados == 0){
          empleadosCount.textContent = `No hay ningún empleado asignado a esta cuadrilla.`;
          
        }else{
          empleadosCount.textContent = `Hay un total de ${cuadrilla.cantidad_empleados} empleados en esta cuadrilla.`;
        }


        // Crear un contenedor para el contenido de la tarjeta
        const cardContent = document.createElement('div');
        cardContent.classList.add('card-content');
        cardContent.appendChild(icon);
        cardContent.appendChild(title);
        cardContent.appendChild(empleadosCount);

         // Agregar el logo de "x" para eliminar el proyecto
         const deleteIcon = document.createElement('span');
         deleteIcon.classList.add('delete-icon');
         deleteIcon.innerHTML = '&times;';
         deleteIcon.addEventListener('click', (event) => {
           event.stopPropagation();
           confirmarEliminarProyecto(cuadrilla.id, cuadrilla.nombre);
         });

      
         card.appendChild(cardContent);
         card.appendChild(deleteIcon); 
        
        card.addEventListener('click', () => {
         
          cargarEmpleadosCuadrilla(cuadrilla.id, cuadrilla.cantidad_empleados);
          modal3.style.display = 'block';
          modal6.style.display = 'none';
        });

        cardContainer.appendChild(card);

        

      });
      //Integrar el boton de crear cuadrilla dentro de la card container

      const crearCuadrillaButton = document.createElement('button');
      crearCuadrillaButton.textContent = 'Crear Cuadrilla';
      crearCuadrillaButton.classList.add('crear-cuadrilla-button');
      crearCuadrillaButton.addEventListener('click', () => {
        mostrarModalCrearCuadrilla(proyectoId);
      });

      cardContainer.appendChild(crearCuadrillaButton);

    })
    .catch(error => {
      console.error('Error al obtener las cuadrillas:', error);
    });
}


//Funcion de mostrar la modal de crear cuadrillas

function mostrarModalCrearCuadrilla(proyectoId) {
  const modalCrearCuadrilla = document.getElementById('modal-crear-cuadrilla');
  const nombreCuadrillaInput = document.getElementById('nombre-cuadrilla');
  const nombreCuadrillaError = document.getElementById('nombre-cuadrilla-error');
  const agregarEmpleadosButton = document.getElementById('agregar-empleados-button');
  const crearCuadrillaButton = document.getElementById('crear-cuadrilla-button');
  const cancelarButton = document.getElementById('cancelar-crear-cuadrilla-button');

  nombreCuadrillaInput.value = '';
  nombreCuadrillaError.textContent = '';
  agregarEmpleadosButton.disabled = true;
  crearCuadrillaButton.disabled = true;

  

  function funcionNombreCuadrillaInput(){
    console.log('Id de proyecto para verificacion de nombre de cuadrilla: ',proyectoId);
    const nombreCuadrilla = nombreCuadrillaInput.value.trim();
    validarNombreCuadrilla(proyectoId, nombreCuadrilla);
  }

  nombreCuadrillaInput.addEventListener('input', funcionNombreCuadrillaInput);
  

  agregarEmpleadosButton.addEventListener('click', () => {
    mostrarModalSeleccionarEmpleados(proyectoId);
  });

   // Eliminar el event listener anterior del botón "Crear Cuadrilla"
   if (crearCuadrillaListener) {
    crearCuadrillaButton.removeEventListener('click', crearCuadrillaListener);
  }

  // Agregar el event listener al botón "Crear Cuadrilla"
  crearCuadrillaListener = crearCuadrillaHandler.bind(null, proyectoId);
  crearCuadrillaButton.addEventListener('click', crearCuadrillaListener);
  
  cancelarButton.addEventListener('click', () =>{
    modalCrearCuadrilla.style.display = 'none';
    localStorage.removeItem('empleadosAsignados');
    nombreCuadrillaInput.removeEventListener('input', funcionNombreCuadrillaInput);
  })



  modalCrearCuadrilla.style.display = 'block';
}

//Funcion para verificar si el nombre de la cuadrilla a crear no existe en la base de datos
async function validarNombreCuadrilla(proyectoId, nombreCuadrilla) {
  const nombreCuadrillaError = document.getElementById('nombre-cuadrilla-error');
  const agregarEmpleadosButton = document.getElementById('agregar-empleados-button');
  const crearCuadrillaButton = document.getElementById('crear-cuadrilla-button');

  if (nombreCuadrilla === '') {
    nombreCuadrillaError.textContent = '';
    agregarEmpleadosButton.disabled = true;
    crearCuadrillaButton.disabled = true;
    return;
  }

  await fetch(`/verificar-nombre-cuadrilla?proyectoId=${proyectoId}&nombreCuadrilla=${encodeURIComponent(nombreCuadrilla)}`)
    .then(response => response.json())
    .then(data => {

      if (data.exists) {
        nombreCuadrillaError.textContent = 'Ya existe una cuadrilla con ese nombre en este proyecto.';
        agregarEmpleadosButton.disabled = true;
        crearCuadrillaButton.disabled = true;
      } else {
        nombreCuadrillaError.textContent = '';
        if(localStorage.getItem('empleadosAsignados')){
          agregarEmpleadosButton.disabled = true;
          crearCuadrillaButton.disabled = false;
        }else{
          agregarEmpleadosButton.disabled = false;
          crearCuadrillaButton.disabled = true;
        }
       
      }
    })
    .catch(error => {
      console.error('Error al verificar el nombre de la cuadrilla:', error);
    });
}


function obtenerEmpleadosAsignados() {
  const empleadosAsignados = JSON.parse(localStorage.getItem('empleadosAsignados')) || [];
  return empleadosAsignados;
}


//Funcion de mostrar la modal para seleccionar los empleados a asignar dentro de la cuadrilla a crear

let asignarEmpleadosListener = null;

let crearCuadrillaListener = null;

function crearCuadrillaHandler(proyectoId) {
  const nombreCuadrillaInput = document.getElementById('nombre-cuadrilla');
  const nombreCuadrilla = nombreCuadrillaInput.value.trim();
  const employees = JSON.parse(localStorage.getItem('empleadosAsignados'));
  const empleadosAsignados = [...new Set([...employees])];
  crearCuadrilla(proyectoId, nombreCuadrilla, empleadosAsignados);
}
async function mostrarModalSeleccionarEmpleados(proyectoId) {
  const modalSeleccionarEmpleados = document.getElementById('modal-seleccionar-empleados');
  const listaEmpleadosDisponibles = document.getElementById('lista-employees-disponibles');
  const asignarEmpleadosButton = document.getElementById('asignar-empleados-button');

  // Obtener los empleados disponibles desde el servidor
  await fetch(`/obtener-empleados-disponibles`)
    .then(response => response.json())
    .then(data => {
      listaEmpleadosDisponibles.innerHTML = '';
      if(data.empleados.length === 0){
          // Mostrar mensaje cuando no hay empleados disponibles
        const mensajeHtml = `
        <li class="mensaje-no-disponibles">
          <p>No hay empleados disponibles en este momento.</p>
        </li>
      `;
      listaEmpleadosDisponibles.insertAdjacentHTML('beforeend', mensajeHtml);
      }else{
      // Generar la plantilla HTML para la lista de empleados disponibles
      const empleadosTemplate = data.empleados.map(empleado => `
        <li>
          <input type="checkbox" value="${empleado.id}">
          <label>${empleado.nombre} ${empleado.apellido_paterno} ${empleado.apellido_materno}</label>
        </li>
      `).join('');

      // Actualizar el contenido de la lista de empleados disponibles con la plantilla generada
      listaEmpleadosDisponibles.innerHTML = empleadosTemplate;
      }
      // Eliminar el event listener anterior del botón "Asignar"
      if (asignarEmpleadosListener) {
        asignarEmpleadosButton.removeEventListener('click', asignarEmpleadosListener);
      }

      // Agregar el event listener al botón "Asignar"
      asignarEmpleadosListener = () => {
        const empleadosSeleccionados = Array.from(listaEmpleadosDisponibles.querySelectorAll('input[type="checkbox"]:checked')).map(checkbox => checkbox.value);
        const empleadosAsignados = [...new Set(empleadosSeleccionados)]; // Eliminar duplicados

        localStorage.setItem("empleadosAsignados", JSON.stringify(empleadosAsignados));

        console.log(empleadosAsignados);

        modalSeleccionarEmpleados.style.display = 'none';

        const agregarEmpleadosButton = document.getElementById('agregar-empleados-button');
        agregarEmpleadosButton.disabled = true;

        const crearCuadrillaButton = document.getElementById('crear-cuadrilla-button');
      
        crearCuadrillaButton.disabled = !document.getElementById('nombre-cuadrilla').value.trim() || !empleadosAsignados.length;
       
      };
      asignarEmpleadosButton.addEventListener('click', asignarEmpleadosListener);

      // Agregar el event listener al botón "Cancelar"
      const cancelarSeleccionButton = document.getElementById('cancelar-seleccion-button');
      cancelarSeleccionButton.addEventListener('click', () => {
        // Limpiar los checkboxes seleccionados al cancelar
        const checkboxes = listaEmpleadosDisponibles.querySelectorAll('input[type="checkbox"]:checked');
        checkboxes.forEach(checkbox => {
          checkbox.checked = false;
        });

        const crearCuadrillaButton = document.getElementById('crear-cuadrilla-button');

        crearCuadrillaButton.removeEventListener('click', crearCuadrillaListener);

        modalSeleccionarEmpleados.style.display = 'none';
      });

      // Actualizar el estado del botón "Asignar" según los checkboxes seleccionados
      const checkboxes = listaEmpleadosDisponibles.querySelectorAll('input[type="checkbox"]');
      checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
          asignarEmpleadosButton.disabled = !listaEmpleadosDisponibles.querySelectorAll('input[type="checkbox"]:checked').length;
        });
      });

      // Deshabilitar el botón "Asignar" inicialmente
      asignarEmpleadosButton.disabled = true;
      

      modalSeleccionarEmpleados.style.display = 'block';
    })
    .catch(error => {
      console.error('Error al obtener los empleados disponibles:', error);
    });
}

function recargarPagina() {
  const url = window.location.href; // Obtener la URL actual

  fetch(url, {
    cache: 'no-cache'
  })
    .then(respuesta => {
      if (respuesta.status === 200) {
        // Simular una recarga de la página utilizando el historial del navegador
        window.history.replaceState({}, '', url);
        window.dispatchEvent(new Event('popstate'));
      } else {
        console.error('Error al cargar la página:', respuesta.status);
      }
    })
    .catch(error => {
      console.error('Error al cargar la página:', error);
    });
}
//Funcion crear cuadrilla para enviar los datos de la cuadrilla que se desea crear al servidor

async function crearCuadrilla(proyectoId, nombreCuadrilla, empleadosAsignados) {
  const data = {
    proyectoId,
    nombreCuadrilla,
    empleadosAsignados
  };

  console.log('data enviada hacia la ruta crear-cuadrilla', data);

  await fetch('/crear-cuadrilla', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(result => {
      if (result.success) {
        Swal.fire('Éxito', `La cuadrilla ${nombreCuadrilla} ha sido creada exitosamente.`, 'success');
        const modalCrearCuadrilla = document.getElementById('modal-crear-cuadrilla');
        modalCrearCuadrilla.style.display = 'none';
        const modal6 = document.getElementById('modal6');
        modal6.style.display = 'none';
        const modal2 = document.getElementById('modal2');
        modal2.style.display = 'none';
        localStorage.removeItem('empleadosAsignados');
        cargarCuadrillas(proyectoId);
        const nombreCuadrillaInput = document.getElementById('nombre-cuadrilla');
        nombreCuadrillaInput.value = '';
        nombreCuadrillaInput.removeEventListener('input', funcionNombreCuadrillaInput);
        recargarPagina();
      } else {
        // Error al crear la cuadrilla
        console.error('Error al crear la cuadrilla:', result.error);
      }
    })
    .catch(error => {
      console.error('Error al crear la cuadrilla:', error);
    });
}



//Funcion que permite confirmar la eliminacion de una cuadrilla
function confirmarEliminarProyecto(cuadrillaId, nombreCuadrilla) {
  Swal.fire({
    title: '¿Estás seguro?',
    text: `¿Deseas eliminar la cuadrilla "${nombreCuadrilla}"?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      eliminarCuadrilla(cuadrillaId);
    }
  });
}


async function eliminarCuadrilla(cuadrillaId) {
  try {
    const response = await fetch(`/eliminar-cuadrilla?id=${cuadrillaId}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      Swal.fire('Éxito', 'La cuadrilla ha sido eliminada exitosamente', 'success').then( async ()=>{
        const modal6 = document.getElementById('modal6');
        modal6.style.display = 'none';
        const modal2 = document.getElementById('modal2');
        modal2.style.display = 'none';
        if(btnCuadrillas.classList.contains('active')){
          await showTabPane(0);
          await showTabPane(1);
        }
      })
      
    } else {
      Swal.fire('Error', 'No se pudo eliminar la cuadrilla', 'error');
    }
  } catch (error) {
    console.error('Error al eliminar la cuadrilla:', error);
    Swal.fire('Error', 'Ocurrió un error al eliminar la cuadrilla', 'error');
  }
}



//Funcion que regresa los empleados que hay dentro de una determinada cuadrilla dentro de un proyecto en especifico
async function cargarEmpleadosCuadrilla(cuadrillaId, cantidad) {
  return await fetch(`/obtener-empleados-cuadrilla?id=${cuadrillaId}`)
    .then(response => response.json())
    .then(data => {
      const listaEmpleados = document.getElementById('lista-empleados');
      listaEmpleados.innerHTML = '';
      console.log('Cantidad de empleados en la cuadrilla: ',cantidad);
      if(cantidad === 0){
        const mensaje = document.createElement('p');
        mensaje.classList.add('mensaje-sinEmpleados');
        mensaje.textContent = 'No hay ningún empleado asignado a esta cuadrilla. Presione clic al botón de agregar empleados para asignar empleados.';
        listaEmpleados.appendChild(mensaje);
      }else{
        data.empleados.forEach((empleado, index) => {
          const li = document.createElement('li');
  
          const nameContainer = document.createElement('div');
          nameContainer.classList.add('name-container');
  
          const span = document.createElement('span');
          span.textContent = `${index + 1}. ${empleado.nombre} ${empleado.apellido_paterno} ${empleado.apellido_materno}`;
  
          nameContainer.appendChild(span);
          li.appendChild(nameContainer);
  
          const alignIcon = document.createElement('span');
          alignIcon.classList.add('material-icons', 'align-icon');
          alignIcon.textContent = 'sync_alt';
          alignIcon.dataset.id = empleado.id;
          alignIcon.dataset.idCuadrillaActual = empleado.id_detalle;
          alignIcon.dataset.idCuadrilla = cuadrillaId;
          li.appendChild(alignIcon);
  
          const seleccionProyecto = document.createElement('div');
          seleccionProyecto.classList.add('seleccion_proyecto');
          seleccionProyecto.style.display = 'none';
  
          const inputItem = document.createElement('input');
          inputItem.classList.add('input-item');
          inputItem.placeholder = 'Escriba el proyecto:';
          seleccionProyecto.appendChild(inputItem);
  
          const doneIcon = document.createElement('span');
          doneIcon.classList.add('material-icons', 'done');
          doneIcon.textContent = 'done';
          seleccionProyecto.appendChild(doneIcon);
  
          const closeIcon = document.createElement('span');
          closeIcon.classList.add('material-icons', 'close');
          closeIcon.textContent = 'close';
          seleccionProyecto.appendChild(closeIcon);
  
          li.appendChild(seleccionProyecto);
  
          const deleteIcon = document.createElement('span');
          deleteIcon.classList.add('delete', 'material-icons');
          deleteIcon.textContent = 'delete';
          deleteIcon.dataset.id = empleado.id;
          deleteIcon.dataset.idCuadrilla = cuadrillaId;
          li.appendChild(deleteIcon);
  
          listaEmpleados.appendChild(li);
        });
      }

      const botonAgregar = document.createElement('button');
      botonAgregar.textContent = 'Agregar Empleados';
      botonAgregar.addEventListener('click', () => {
        mostrarModalAsignarEmpleados(cuadrillaId);
      });
      listaEmpleados.appendChild(botonAgregar);

      // Agregar eventos a los iconos después de generar la lista de empleados
      agregarEventos();
    })
    .catch(error => {
      console.error('Error al obtener los empleados de la cuadrilla:', error);
    });
}

function agregarEventos() {
  const change = document.querySelectorAll(".align-icon");
  const nombre_proyecto = document.querySelectorAll(".seleccion_proyecto");
  const botonesListo = document.querySelectorAll('.seleccion_proyecto .done');
  const botonesCerrar = document.querySelectorAll('.seleccion_proyecto .close');
  const borrar = document.querySelectorAll('.delete');

  change.forEach(change => {
    change.addEventListener('click', (e) => {
      const idEmpleado = e.target.dataset.id;
      const idCuadrillaActual = e.target.dataset.idCuadrillaActual;
      const idCuadrilla = e.target.dataset.idCuadrilla;
      mostrarListaProyectos(idEmpleado, idCuadrillaActual, idCuadrilla);
    });
  });

  nombre_proyecto.forEach((proyecto, index) => {
    const entrada = proyecto.querySelector('input');
    entrada.addEventListener('input', () => {
      botonesListo[index].disabled = entrada.value.trim() === '';
    });

    botonesCerrar[index].addEventListener('click', () => {
      entrada.value = '';
      proyecto.style.display = "none";
    });

    botonesListo[index].addEventListener('click', () => {
      if (entrada.value.trim() !== '' && entrada.value !== entrada.placeholder) {
        Swal.fire({
          title: 'Éxito!',
          text: 'El Empleado se Cambio de Proyecto',
          icon: 'success'
        }).then((result) => {
          if (result.isConfirmed) {
            proyecto.style.display = "none";
            entrada.value = '';
          }
        });
      }
    });
  });

  
  borrar.forEach(deletes => {
    deletes.addEventListener('click', e => {
      const idEmpleado = e.target.dataset.id;
      const idCuadrilla = e.target.dataset.idCuadrilla;
      Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Deseas eliminar al empleado de la cuadrilla?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        eliminarEmpleadoProyecto(idEmpleado, idCuadrilla);
      }
    });
    });
  });
}


async function mostrarModalAsignarEmpleados(cuadrillaId) {
  return await fetch('/obtener-empleados-disponibles')
    .then(response => response.json())
    .then(data => {
      const modalAsignarEmpleados = document.getElementById('modal-asignar-empleados');
      const listaEmpleadosDisponibles = document.getElementById('lista-empleados-disponibles');
      listaEmpleadosDisponibles.innerHTML = '';
      console.log(data.empleados.length);
      if (data.empleados.length === 0) {
        // Mostrar mensaje cuando no hay empleados disponibles
        const mensajeHtml = `
          <li class="mensaje-no-disponibles">
            <p>No hay empleados disponibles en este momento.</p>
          </li>
        `;
        listaEmpleadosDisponibles.insertAdjacentHTML('beforeend', mensajeHtml);
      } else {
        // Generar los elementos de la lista de empleados disponibles
        data.empleados.forEach(empleado => {
          const li = document.createElement('li');
          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.value = empleado.id;

          const label = document.createElement('label');
          label.appendChild(checkbox);
          label.appendChild(document.createTextNode(`${empleado.nombre} ${empleado.apellido_paterno} ${empleado.apellido_materno}`));

          li.appendChild(label);
          listaEmpleadosDisponibles.appendChild(li);
        });
      }

      const botonAsignar = document.getElementById('btn-asignar-empleados');
      botonAsignar.disabled = true;

      listaEmpleadosDisponibles.addEventListener('change', () => {
        botonAsignar.disabled = listaEmpleadosDisponibles.querySelectorAll('input[type="checkbox"]:checked').length === 0;
      });

      botonAsignar.onclick = async () => {
        const empleadosSeleccionados = Array.from(listaEmpleadosDisponibles.querySelectorAll('input[type="checkbox"]:checked')).map(checkbox => checkbox.value);
        console.log('Cuadrilla ID antes de pasar por la ruta asignarEmpleadosCuadrilla: ', cuadrillaId);
        console.log('EmpleadosSeleccionados antes de pasar por la ruta asignarEmpleadosCuadrilla: ', empleadosSeleccionados);
        await asignarEmpleadosCuadrilla(cuadrillaId, empleadosSeleccionados);
        modalAsignarEmpleados.style.display = 'none';
        cargarEmpleadosCuadrilla(cuadrillaId);
      };

      const botonCancelar = document.getElementById('btn-cancelar-asignar');
      botonCancelar.onclick = () => {
        modalAsignarEmpleados.style.display = 'none';
      };

      modalAsignarEmpleados.style.display = 'block';
    })
    .catch(error => {
      console.error('Error al obtener los empleados disponibles:', error);
    });
}


async function asignarEmpleadosCuadrilla(cuadrillaId, empleadosSeleccionados) {
  return await fetch(`/asignar-empleados-cuadrilla`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ cuadrillaId, empleados: empleadosSeleccionados })
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        Swal.fire('Éxito', 'El/Los empleados se han asignado a la cuadrilla.', 'success').then( async() =>{
          const modalAsignarEmpleados = document.getElementById('modal-asignar-empleados');
          modalAsignarEmpleados.style.display = 'none';
          const modal3 = document.getElementById('modal3');
          modal3.style.display = 'none';
          console.log('Empleados asignados correctamente a la cuadrilla');
          if(btnCuadrillas.classList.contains('active')){
            await showTabPane(0);
            await showTabPane(1);
          }
        })
        
      } else {
        console.error('Error al asignar empleados a la cuadrilla:', data.error);
      }
    })
    .catch(error => {
      console.error('Error al asignar empleados a la cuadrilla:', error);
    });
}



  //Funcion para mostrar el listado de los proyectos creados para mover a x empleado

  async function mostrarListaProyectos(idEmpleado, idCuadrillaActual, idCuadrilla, esContratista = false) {
    return await fetch('/obtenerProyectos')
      .then(response => response.json())
      .then(data => {
        const proyectos = data.proyectos;
        const listaProyectos = document.getElementById('lista-proyectos');
        listaProyectos.innerHTML = '';
        document.getElementById('btn-seleccionar-proyecto').dataset.id = idEmpleado;
        document.getElementById('btn-seleccionar-proyecto').dataset.idCuadrillaActual = idCuadrillaActual;
        document.getElementById('btn-seleccionar-proyecto').dataset.idCuadrilla = idCuadrilla;
        proyectos.forEach(proyecto => {
          const li = document.createElement('li');
          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.id = `proyecto-${proyecto.id}`;
          checkbox.value = proyecto.id;
          checkbox.addEventListener('change', () => {
            const checkboxes = document.querySelectorAll('#lista-proyectos input[type="checkbox"]');
            checkboxes.forEach(cb => {
              if (cb !== checkbox) {
                cb.disabled = checkbox.checked;
              }
            });
            document.getElementById('btn-seleccionar-proyecto').disabled = !checkbox.checked;

          });
          
          const label = document.createElement('label');
          label.htmlFor = `proyecto-${proyecto.id}`;
          label.textContent = proyecto.nombre;
  
          li.appendChild(checkbox);
          li.appendChild(label);
          listaProyectos.appendChild(li);
        });

        const btnSeleccionarProyecto = document.getElementById('btn-seleccionar-proyecto');
        const btnCancelarProyecto = document.getElementById('btn-cancelar-proyecto');

        btnSeleccionarProyecto.disabled = true;
        btnSeleccionarProyecto.removeEventListener('click', seleccionProyectoMoverContratista);
        
      
        btnSeleccionarProyecto.addEventListener('click', seleccionarProyectoMoverEmpleado);

        btnCancelarProyecto.removeEventListener('click', cancelarProyectoMoverContratista);

        btnCancelarProyecto.addEventListener('click', cancelarProyectoMoverEmpleado);
      
        const modalProyectos = document.getElementById('modal-proyectos');
        modalProyectos.style.display = 'block';
      })
      .catch(error => {
        console.error('Error al obtener los proyectos:', error);
      });
  }

 
  function seleccionarProyectoMoverEmpleado(e){
    const checkboxes = document.querySelectorAll('#lista-proyectos input[type="checkbox"]');
    let idProyectoSeleccionado = null;
    checkboxes.forEach(checkbox => {
      if (checkbox.checked) {
        idProyectoSeleccionado = checkbox.value;
      }
    });
  
    const idEmpleado = e.target.dataset.id;
    const idCuadrillaActual = e.target.dataset.idCuadrillaActual;
    const idCuadrilla = e.target.dataset.idCuadrilla;
    e.target.disabled = true;
    const esContratista = false;
    if (esContratista) {
      // Si es un contratista, llama a la función moverContratistaProyecto directamente
      moverContratistaProyecto(idEmpleado, idProyectoSeleccionado);
    } else {
      // Si es un empleado, muestra la modal de selección de cuadrilla
      mostrarCuadrillasProyecto(idProyectoSeleccionado, idEmpleado, idCuadrillaActual, idCuadrilla);
    }
  }


  function cancelarProyectoMoverEmpleado(){
    const modalProyectos = document.getElementById('modal-proyectos');
    const btnSeleccionarProyecto = document.getElementById('btn-seleccionar-proyecto');
    modalProyectos.style.display = 'none';
    btnSeleccionarProyecto.disabled = true;
  }


async function mostrarCuadrillasProyecto(idProyecto, idEmpleado, idCuadrillaActual, idCuadrilla) {
  return await fetch(`/obtener-cuadrillas?id=${idProyecto}`)
    .then(response => response.json())
    .then(data => {
      const cuadrillas = data.cuadrillas;
      const modalCuadrillas = document.getElementById('modal6');
      const contenedorCuadrillas = document.getElementById('card-container');
      const header = document.getElementById('h2-cuadrillas');
      header.textContent = `Elija Alguna de las Cuadrillas del Proyecto ${cuadrillas[0].nombre_proyecto}`;
      contenedorCuadrillas.innerHTML = '';

      cuadrillas.forEach(cuadrilla => {

        const card = document.createElement('div');
        card.classList.add('card');

        const icon = document.createElement('i');
        icon.classList.add('fas', 'fa-users');

        const title = document.createElement('h3');
        title.textContent = cuadrilla.nombre;

        const empleadosCount = document.createElement('p');
        empleadosCount.textContent = `Hay un total de ${cuadrilla.cantidad_empleados} empleados en esta cuadrilla.`;

        card.appendChild(icon);
        card.appendChild(title);
        card.appendChild(empleadosCount);
        
        card.dataset.idCuadrilla = cuadrilla.id;
        
        card.addEventListener('click', () => {
          confirmarMovimientoEmpleado(idEmpleado, cuadrilla.id, idCuadrillaActual);
        });

        if(card.dataset.idCuadrilla == idCuadrilla){
          card.style.pointerEvents = "none";
        }

        contenedorCuadrillas.appendChild(card);

      });

      const modalProyectos = document.getElementById('modal-proyectos');
      modalProyectos.style.display = 'none';

      modalCuadrillas.classList.add('move');
      modalCuadrillas.style.display = 'block';
    })
    .catch(error => {
      console.error('Error al obtener las cuadrillas del proyecto:', error);
    });
}

function confirmarMovimientoEmpleado(idEmpleado, idCuadrilla, idCuadrillaActual) {
  Swal.fire({
    title: '¿Estás seguro?',
    text: '¿Deseas mover al empleado a esta cuadrilla?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, mover',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      moverEmpleadoCuadrilla(idEmpleado, idCuadrilla, idCuadrillaActual);
    }
  });
}

async function actualizarListaEmpleados(idCuadrilla) {
  return await fetch(`/obtener-empleados-cuadrilla?cuadrillaId=${idCuadrilla}`)
    .then(response => response.json())
    .then(data => {
      const listaEmpleados = document.getElementById('lista-empleados');
      listaEmpleados.innerHTML = '';

      data.empleados.forEach((empleado, index) => {
        const li = document.createElement('li');

        const nameContainer = document.createElement('div');
        nameContainer.classList.add('name-container');

        const span = document.createElement('span');
        span.textContent = `${index + 1}. ${empleado.nombre} ${empleado.apellido_paterno} ${empleado.apellido_materno}`;

        nameContainer.appendChild(span);
        li.appendChild(nameContainer);

        const alignIcon = document.createElement('span');
        alignIcon.classList.add('material-icons', 'align-icon');
        alignIcon.textContent = 'sync_alt';
        alignIcon.dataset.id = empleado.id;
        li.appendChild(alignIcon);

        const seleccionProyecto = document.createElement('div');
        seleccionProyecto.classList.add('seleccion_proyecto');
        seleccionProyecto.style.display = 'none';

        const inputItem = document.createElement('input');
        inputItem.classList.add('input-item');
        inputItem.placeholder = 'Escriba el proyecto:';
        seleccionProyecto.appendChild(inputItem);

        const doneIcon = document.createElement('span');
        doneIcon.classList.add('material-icons', 'done');
        doneIcon.textContent = 'done';
        seleccionProyecto.appendChild(doneIcon);

        const closeIcon = document.createElement('span');
        closeIcon.classList.add('material-icons', 'close');
        closeIcon.textContent = 'close';
        seleccionProyecto.appendChild(closeIcon);

        li.appendChild(seleccionProyecto);

        const deleteIcon = document.createElement('span');
        deleteIcon.classList.add('delete', 'material-icons');
        deleteIcon.textContent = 'delete';
        deleteIcon.dataset.id = empleado.id;
        deleteIcon.dataset.idCuadrilla = idCuadrilla;
        li.appendChild(deleteIcon);

        listaEmpleados.appendChild(li);
      });

      // Agregar eventos a los iconos después de generar la lista de empleados
      agregarEventos();
    })
    .catch(error => {
      console.error('Error al obtener los empleados de la cuadrilla:', error);
    });
}

async function moverEmpleadoCuadrilla(idEmpleado, idCuadrilla, idCuadrillaActual) {
  return await fetch(`/mover-empleado-cuadrilla?idEmpleado=${idEmpleado}&idCuadrilla=${idCuadrilla}&idCuadrillaActual=${idCuadrillaActual}`, {
    method: 'PUT'
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        Swal.fire('Éxito', 'El empleado ha sido movido de cuadrilla', 'success').then( async ()=>{

          const modalCuadrillas = document.querySelector('#modal6');
          modalCuadrillas.style.display = 'none';
          const modalProyectos = document.querySelector('#modal-proyectos');
          modalProyectos.style.display = 'none';
          const modalEmpleados = document.querySelector('#modal3');
          modalEmpleados.style.display = 'none';
          if(localStorage.getItem('proyectoId')){
            localStorage.removeItem('proyectoId');
          }
          if(btnCuadrillas.classList.contains('active')){
            await showTabPane(0);
            await showTabPane(1);
          }
        });
       
      } else {
        Swal.fire('Error', 'No se pudo mover al empleado a la cuadrilla', 'error');
      }
    })
    .catch(error => {
      console.error('Error al mover al empleado a la cuadrilla:', error);
    });
}



async function eliminarEmpleadoProyecto(idEmpleado, idCuadrilla) {
  return await fetch(`/eliminar-empleado-proyecto?idEmpleado=${idEmpleado}&&idCuadrilla=${idCuadrilla}`, {
    method: 'DELETE'
  })
    .then(response => response.json())
    .then(async data => {
      if (data.success) {
        Swal.fire('Éxito', 'El empleado ha sido eliminado del proyecto', 'success').then( async() =>{
          const modalEmpleados = document.querySelector('#modal3');
          modalEmpleados.style.display = 'none';
          if(btnCuadrillas.classList.contains('active')){
            await showTabPane(0);
            await showTabPane(1);
          }
        })
        
      } else {
        Swal.fire('Error', 'No se pudo eliminar al empleado del proyecto', 'error');
      }
    })
    .catch(error => {
      console.error('Error al eliminar al empleado del proyecto:', error);
    });
}



const modal6 = document.getElementById('modal6');

// Obtener todas las tarjetas de proyectos
const tarjetasProyectos = document.querySelectorAll('.tarjeta-proyecto, .empleados');

// Recorrer cada una
tarjetasProyectos.forEach(tarjeta => {
  tarjeta.addEventListener('click', () => {
    modal2.style.display = 'block';
  });
});

//////Ventana Modal Cuadrillas
  employed.addEventListener('click', ()=> {
    modal6.style.display = 'block';
  });


  


////Ventana modal empleados que se encuentra dentro de esa cuadrilla
const cuadrillas = document.querySelectorAll(".card");

cuadrillas.forEach(cuadrillas => {
  cuadrillas.addEventListener('click', ()=> {
    modal6.style.display = 'none';
    modal3.style.display = 'block';
  });
});


////////////Botones de cambio de cuadrilla
const change = document.querySelectorAll(".align-icon");
const nombre_proyecto = document.querySelectorAll(".seleccion_proyecto");

nombre_proyecto.forEach(nmbre_proyecto => {
  nmbre_proyecto.style.display = "none";
});

change.forEach(change => {
  change.addEventListener('click', (e) => {
    let elemento = e.target.nextElementSibling;
    if (elemento.style.display === 'block') {
      elemento.style.display = 'none';
    } else {
      nombre_proyecto.forEach(proyecto => {
        if (proyecto !== elemento) {
          proyecto.style.display = 'none';
          const entrada = proyecto.querySelector('input');
          entrada.value = '';
        }
      });
      elemento.style.display = 'block';
      elemento.querySelector('input').focus();
    }
  });
});

///////Botones de listo o cancelar

const botonesListo = document.querySelectorAll('.seleccion_proyecto .done');
const botonesCerrar = document.querySelectorAll('.seleccion_proyecto .close');

nombre_proyecto.forEach((proyecto, index) => {
  const entrada = proyecto.querySelector('input');

  entrada.addEventListener('input', () => {
    botonesListo[index].disabled = entrada.value.trim() === '';
  });

  botonesCerrar[index].addEventListener('click', () => {
    entrada.value = '';
    proyecto.style.display = "none";
  });

  botonesListo[index].addEventListener('click', () => {
    if (entrada.value.trim() !== '' && entrada.value !== entrada.placeholder) {
      Swal.fire({
        title: 'Éxito!',
        text: 'El Empleado se Cambio de Proyecto',
        icon: 'success'
      }).then((result) => {
        if (result.isConfirmed) {
          proyecto.style.display = "none";
          entrada.value = '';
        }
      });
    }
  });
});



//////////////////Botones de Borrar
  borrar.forEach(deletes =>{
    deletes.addEventListener('click', ()=> {
      Swal.fire({
        title: "Estas Seguro?",
        text: "No podras revertir esta acción!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, Borrarlo!"
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "Borrado!",
            text: "El empleado ha sido removido del proyecto.",
            icon: "success"
          });
        }
      });

    });

  });

  



  ////Modal Asignar Cuadrillas

const modal5 = document.getElementById('modal5');
modal5.style.display = 'none';

async function mostrarEmpleadosDisponibles() {
  const empleadosAsignados = JSON.parse(localStorage.getItem('empleadosAsignados')) || {};
  const empleadosAsignadosIds = Object.values(empleadosAsignados).flat();

  await fetch('/obtener-empleados-disponibles')
    .then(response => response.json())
    .then(data => {
      let empleadosDisponibles;

      if (Object.keys(empleadosAsignados).length === 0) {
        empleadosDisponibles = data.empleados.filter(empleado => {
          return empleado.id.toString() !== encargadoId;
        });
      } else {
        empleadosDisponibles = data.empleados.filter(empleado => {
          return empleado.id.toString() !== encargadoId && !empleadosAsignadosIds.includes(empleado.id);
        });
      }

      console.log('Empleados disponibles:', empleadosDisponibles);

      listaEmpleados.innerHTML = ''; // Limpiar la lista antes de agregar nuevos elementos

      if (empleadosDisponibles.length === 0) {
        // Mostrar mensaje cuando no hay empleados disponibles
        const mensajeHtml = `
          <li class="mensaje-no-disponibles">
            <p>No hay empleados disponibles en este momento.</p>
          </li>
        `;
        listaEmpleados.insertAdjacentHTML('beforeend', mensajeHtml);
      } else {
        // Generar los elementos de la lista de empleados disponibles
        empleadosDisponibles.forEach(empleado => {
          const checkboxId = `employee-${empleado.id}`;
          const checkboxHtml = `
            <li>
              <input type="checkbox" id="${checkboxId}" value="${empleado.id}">
              <label for="${checkboxId}">${empleado.nombre} ${empleado.apellido_paterno} ${empleado.apellido_materno}</label>
            </li>
          `;
          listaEmpleados.insertAdjacentHTML('beforeend', checkboxHtml);
          const checkbox = document.getElementById(checkboxId);
          checkbox.addEventListener('change', verificarCheckboxes);
        });
      }

      console.log(listaEmpleados.innerHTML);

      modal5.style.display = 'block';
      modal5.offsetHeight;
    })
    .catch(error => {
      console.error('Error al obtener los empleados disponibles:', error);
    });
}




  function verificarInputs() {
    const inputs = document.querySelectorAll('#contenedor-inputs input');
    let todosLlenos = true;
    let nombresRepetidos = false;
  
    const nombres = new Set();
    const cuadrillasCreadas = JSON.parse(localStorage.getItem('cuadrillasCreadas')) || [];
  
    inputs.forEach(input => {
      const nombre = input.value.trim();
      const errorMessage = input.parentNode.querySelector('.error-message');
  
      if (nombre === '') {
        todosLlenos = false;
        errorMessage.style.display = 'none';
      } else if (nombres.has(nombre) || cuadrillasCreadas.includes(nombre)) {
        nombresRepetidos = true;
        input.classList.add('nombre-repetido');
        errorMessage.style.display = 'block';
      } else {
        nombres.add(nombre);
        input.classList.remove('nombre-repetido');
        errorMessage.style.display = 'none';
      }
    });
  
    const cantidadCuadrillas = document.getElementById('cantidad-cuadrillas').value;
    const cantidadCuadrillasValida = cantidadCuadrillas !== '' && parseInt(cantidadCuadrillas) > 0;

    btnEmpleados.disabled = !todosLlenos || nombresRepetidos || !cantidadCuadrillasValida;
  }
  
  function generarInputsCuadrillas() {
    const cantidadCuadrillas = document.getElementById('cantidad-cuadrillas').value;
    const contenedorInputs = document.getElementById('contenedor-inputs');
    contenedorInputs.innerHTML = '';
  
    for (let i = 0; i < cantidadCuadrillas; i++) {
      const inputContainer = document.createElement('div');
      inputContainer.classList.add('input-container');
  
      const input = document.createElement('input');
      input.type = 'text';
      input.placeholder = `Nombre de la cuadrilla ${i + 1}`;
      inputContainer.appendChild(input);
  
      const errorMessage = document.createElement('span');
      errorMessage.classList.add('error-message');
      errorMessage.textContent = 'Ya existe una cuadrilla con ese nombre.';
      errorMessage.style.display = 'none';
      inputContainer.appendChild(errorMessage);
  
      contenedorInputs.appendChild(inputContainer);
  
      input.addEventListener('input', verificarInputs);
    }

    verificarInputs();
  }

  document.getElementById('cantidad-cuadrillas').addEventListener('input', generarInputsCuadrillas);


  btnEmpleados.addEventListener('click', () => {
    const inputs = document.querySelectorAll('#contenedor-inputs input');
    const cuadrillasCreadas = JSON.parse(localStorage.getItem('cuadrillasCreadas')) || [];
  
    inputs.forEach(input => {
      const nombre = input.value.trim();
      if (nombre !== '') {
        let elemento = document.createElement('div');
        elemento.className = 'empleado-elemento';
        elemento.dataset.nombre = nombre;
        const contenedor = document.getElementById('empleados-agregados');
  
        // Crear un elemento <span> para el nombre de la cuadrilla
        const nombreCuadrilla = document.createElement('span');
        nombreCuadrilla.textContent = nombre;
        elemento.appendChild(nombreCuadrilla);
  
        // Crear el elemento <span> de cierre
        const closeIcon = document.createElement('span');
        closeIcon.className = 'material-icons';
        closeIcon.textContent = 'close';
        elemento.appendChild(closeIcon);
  
        closeIcon.addEventListener('click', () => {
          button.disabled = !verify();
          elemento.remove();
          event.stopPropagation();
  
          // Eliminar la cuadrilla del localStorage
          const index = cuadrillasCreadas.indexOf(nombre);
          if (index > -1) {
            cuadrillasCreadas.splice(index, 1);
            localStorage.setItem('cuadrillasCreadas', JSON.stringify(cuadrillasCreadas));
          }
          verify();
          
        });
  
        elemento.addEventListener('click', () => {
          cuadrillas.forEach(c => c.classList.remove('selected'));
          elemento.classList.add('selected');
          mostrarEmpleadosDisponibles();
        });
  
        contenedor.insertBefore(elemento, contenedor.lastElementChild);
        cuadrillasCreadas.push(nombre);
        
      }
    });
  
    localStorage.setItem('cuadrillasCreadas', JSON.stringify(cuadrillasCreadas));
  
    document.getElementById('cantidad-cuadrillas').value = '';
    document.getElementById('contenedor-inputs').innerHTML = '';
    btnEmpleados.disabled = true;
    modal4.style.display = "none";
    button.disabled = true;
    verify();
  });
  document.getElementById('btn-empleado').addEventListener('click', () => {
    document.getElementById('modal4').style.display = "block";
  });



////////////////////////////////////////////Acciones dentro de la modal 5
const btnAsignar = document.getElementById('asignar');
const checkboxesModal5 = document.querySelectorAll('.employ input[type="checkbox"]');
let asignarClicked = false;


function verificarCheckboxes() {


  const empleadosSeleccionados = Array.from(document.querySelectorAll('.employ input[type="checkbox"]:checked')).map(checkbox => parseInt(checkbox.value));
  btnAsignar.disabled = empleadosSeleccionados.length === 0;
  
}

checkboxesModal5.forEach(checkbox5 => {
  checkbox5.addEventListener('change', () => {
    verificarCheckboxes();
    verify();
  });
});

btnAsignar.disabled = true;
btnAsignar.addEventListener('click', () => {
  const cuadrillaSeleccionada = document.querySelector('.empleado-elemento.selected').dataset.nombre;
  const empleadosSeleccionados = Array.from(document.querySelectorAll('.employ input[type="checkbox"]:checked')).map(checkbox => parseInt(checkbox.value));

  const empleadosAsignados = JSON.parse(localStorage.getItem('empleadosAsignados')) || {};
  empleadosAsignados[cuadrillaSeleccionada] = empleadosSeleccionados;
  localStorage.setItem('empleadosAsignados', JSON.stringify(empleadosAsignados));

  Swal.fire({
    title: 'Éxito!',
    text: 'Empleados Asignados',
    icon: 'success'
  }).then(() => {
    modal5.style.display = 'none';
    const checkboxes = document.querySelectorAll('.employ input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
      checkbox.checked = false;
    });
    btnAsignar.disabled = true;

    const cuadrillaActual = document.querySelector('.empleado-elemento.selected');
    if (cuadrillaActual) {
      cuadrillaActual.setAttribute('data-empleados-seleccionados', 'true');
      cuadrillaActual.classList.remove('selected');
      cuadrillaActual.classList.add('disabled');
    }

    button.disabled = !checkCuadrillas() || !checkInputs();
  });
});

let idProyecto = null;
//Funcion para generar las tarjetas en base al proyecto:
function generarTarjetaProyecto(proyecto) {
  let imagenUrl = null;
  console.log("Info Proyecto: ", proyecto);
  console.log("Id de imagen: ", proyecto.id_imagen);

  if (proyecto.id_imagen != null) {
    imagenUrl = `/imagen-proxy?fileId=${proyecto.id_imagen}`;
  } else {
    imagenUrl = `/images/empleados.jpg`;
  }

  // Generar tarjeta
  const tarjeta = document.createElement('div');
  

  if (imagenUrl) {
    // Crear un elemento de imagen
    const imagenElement = document.createElement('img');
    imagenElement.src = imagenUrl;
    imagenElement.style.display = 'none'; // Ocultar la imagen inicialmente

    // Aplicar estilos a la tarjeta
    tarjeta.style.backgroundRepeat = 'no-repeat';
    tarjeta.style.backgroundSize = 'cover';
    tarjeta.style.borderRadius = 'var(--card-border-radius)';
    tarjeta.style.position = 'relative';
    tarjeta.style.backgroundPosition = 'center';
    tarjeta.style.zIndex = '1';
    tarjeta.style.cursor = 'pointer';

    // Crear el elemento after para el efecto de superposición
    const afterElement = document.createElement('div');
    afterElement.style.borderRadius = 'var(--card-border-radius)';
    afterElement.style.content = '';
    afterElement.style.backgroundImage = 'linear-gradient(to top, #5e2d05, #000000)';
    afterElement.style.position = 'absolute';
    afterElement.style.top = '0';
    afterElement.style.left = '0';
    afterElement.style.width = '100%';
    afterElement.style.height = '100%';
    afterElement.style.opacity = '0.5';
    afterElement.style.zIndex = '1';

    // Esperar a que la imagen se cargue antes de aplicarla como fondo
    imagenElement.addEventListener('load', () => {
      tarjeta.style.backgroundImage = `url(${imagenUrl})`;
      imagenElement.remove(); // Eliminar el elemento de imagen después de cargar
    });

    tarjeta.appendChild(imagenElement);
    tarjeta.appendChild(afterElement);
  } else {
    tarjeta.classList.add('empleados');
  }

  const icono = document.createElement('span');
  icono.classList.add('material-icons');
  icono.textContent = 'construction';

  const fechaInicio = new Date(proyecto.fecha_inicio);
  const fechaFin = new Date(proyecto.fecha_fin);

  const fechaIFormateada = `${fechaInicio.getDate()}/${fechaInicio.getMonth() + 1}/${fechaInicio.getFullYear()}`;
  const fechaFFormateada = `${fechaFin.getDate()}/${fechaFin.getMonth() + 1}/${fechaFin.getFullYear()}`;

  const contenido = `
    <div class="middle">
      <div class="left">
        <h3>${proyecto.nombre}</h3>
        <h2>Fecha de Inicio: ${fechaIFormateada}</h2>
        <h2>Fecha de Finalización: ${fechaFFormateada}</h2>
      </div>
    </div>
  `;

  tarjeta.appendChild(icono);
  tarjeta.innerHTML += contenido;
  tarjeta.dataset.id = proyecto.id;


  // Abre la modal de la descripción
  
  tarjeta.addEventListener('click', async () => {
    const proyectoId = tarjeta.dataset.id;
    idProyecto = proyectoId;
    // Realizar una solicitud al servidor para obtener los detalles del proyecto
    await fetch(`/obtener-detalles-proyecto?id=${proyectoId}`)
      .then(response => response.json())
      .then(async data => {
        // Actualizar el contenido de la ventana modal con los datos del proyecto
        const idProyecto = data.id;
        const nombreProyecto = data.nombre;
        const descripcionProyecto = data.descripcion;
        const cantidadCuadrillas = data.cantidad_cuadrillas;
        const PresupuestoInicial = data.presupuesto_inicial;
        const presupuestoActual = data.presupuesto_actual;
        const nombreEncargado = data.nombre_encargado;
        const cantidadContratistas = await obtenerCantidadContratistas(proyectoId);
  
        presupuestoInicial = PresupuestoInicial;
        presupuestoActualAnterior = presupuestoActual;
  
        // Actualizar los elementos de la ventana modal con los datos obtenidos
        document.querySelector('#titulo-proyecto').textContent = 'Descripción del Proyecto: ' + nombreProyecto;
        document.querySelector('#descripcion-proyecto').textContent = descripcionProyecto;
        document.querySelector('.num-cuadrillas').textContent = cantidadCuadrillas + ' cuadrillas';
        document.querySelector('#divPresupuestoinicial strong').textContent = 'Presupuesto Inicial: $' + PresupuestoInicial;
        document.querySelector('#presupuesto-actual').value = '$' + presupuestoActual.toFixed(2);
        document.querySelector('.atte strong').textContent = nombreEncargado;
        document.querySelector('#edit-icon').dataset.id = idProyecto;
        document.querySelector('#delete-icon').dataset.id = idProyecto;
        document.querySelector('.num-cuadrillas').dataset.id = idProyecto;
        document.querySelector('#numero-contratistas').textContent = cantidadContratistas + ' contratistas';
  
        // Ajustar el diseño de la ventana modal según la cantidad de información de la descripción
        const descripcionElement = document.querySelector('#descripcion-proyecto');
        const alturaDescripcion = descripcionElement.clientHeight;
  
        if (PresupuestoInicial < presupuestoActual) {
          document.querySelector('#presupuesto-actual').style.color = 'red';
        } else {
          document.querySelector('#presupuesto-actual').style.color = 'black';
        }
  
        if (alturaDescripcion > 100) {
          descripcionElement.style.maxHeight = '200px';
          descripcionElement.style.overflowY = 'auto';
        } else {
          descripcionElement.style.maxHeight = 'none';
          descripcionElement.style.overflowY = 'visible';
        }
  
        modal2.style.display = 'block';
  
        console.log('Id del Proyecto Incrustado en el logo Edit: ', document.querySelector('#edit-icon').dataset.id);
        console.log('Id del Proyecto Incrustado en el logo Delete: ', document.querySelector('#delete-icon').dataset.id);
  
      })
      .catch(error => {
        console.error('Error al obtener los detalles del proyecto:', error);
      });
  });

  return tarjeta;
}

// Agregar evento clic al número de contratistas al cargar la página
document.querySelector('#numero-contratistas').addEventListener('click', async () => {
  const editIcon = document.querySelector('#edit-icon');
  const proyectoId = editIcon.dataset.id;
  await mostrarListadoContratistas(proyectoId);
});


document.querySelector('#delete-icon').addEventListener('click', e => {
  const idProyecto = e.target.dataset.id;
  eliminarConfirmarProyecto(idProyecto);
});

async function obtenerCantidadContratistas(proyectoId) {
  try {
    const respuesta = await fetch(`/obtener-contratistas-proyecto?id=${proyectoId}`);
    const data = await respuesta.json();
    return data.contratistas.length;
  } catch (error) {
    console.error('Error al obtener la cantidad de contratistas:', error);
    return 0;
  }
}

let contratistasProyectoActual = [];

async function mostrarListadoContratistas(proyectoId) {
  contratistasProyectoActual = [];
  await fetch(`/obtener-contratistas-proyecto?id=${proyectoId}`)
    .then(response => response.json())
    .then(data => {
      
      const modalContratistas = document.getElementById('modal-contratistas');
      const modalContent = document.querySelector('#modal-contratistas .modal-content');
      modalContent.innerHTML = '';

      const titulo = document.createElement('h2');
      titulo.textContent = 'Listado de Contratistas';
      modalContent.appendChild(titulo);

      contratistasProyectoActual = data.contratistas;

      if (contratistasProyectoActual.length > 0) {
        const contratistasListaElement = document.createElement('ol');

        contratistasProyectoActual.forEach((contratista, index) => {
          const contratistaNodo = document.createElement('li');

          const nombreSpan = document.createElement('span');
          nombreSpan.textContent = `${index + 1}. ${contratista.nombre}`;

          const asyncIcon = document.createElement('span');
          asyncIcon.classList.add('material-icons');
          asyncIcon.textContent = 'sync_alt';
          asyncIcon.title = 'Mover Contratista';

          // Agregar evento de clic al icono "sync_alt"
          asyncIcon.addEventListener('click', () => {
           
            mostrarModalSeleccionProyecto(contratista.id);
          });

          const deleteIcon = document.createElement('span');
          deleteIcon.classList.add('material-icons');
          deleteIcon.textContent = 'delete';
          deleteIcon.title = 'Eliminar Contratista';

          // Agregar evento de clic al icono "delete"
          deleteIcon.addEventListener('click', () => {
            confirmarEliminarContratista(contratista.id, contratista.nombre);
          });


          contratistaNodo.appendChild(nombreSpan);
          contratistaNodo.appendChild(asyncIcon);
          contratistaNodo.appendChild(deleteIcon);

          contratistasListaElement.appendChild(contratistaNodo);
        });

        modalContent.appendChild(contratistasListaElement);
      } else {
        const mensajeElement = document.createElement('p');
        mensajeElement.textContent = 'No hay contratistas asignados a este proyecto.';
        modalContent.appendChild(mensajeElement);
      }

      // Agregar botón para agregar contratistas
      const agregarContratistasBtn = document.createElement('button');
      agregarContratistasBtn.textContent = 'Agregar Contratistas';
      agregarContratistasBtn.addEventListener('click', () => {
        mostrarModalContratista(proyectoId);
      });
      modalContent.appendChild(agregarContratistasBtn);

      modalContratistas.style.display = 'block';
    })
    .catch(error => {
      console.error('Error al obtener el listado de contratistas:', error);
    });
}


//Funcion que muestra la modal con la lista de proyectos disponibles en donde el usuario podra elegir a donde mover el contratista
let idContratista = null;
async function mostrarModalSeleccionProyecto(contratistaId) {
  idContratista = contratistaId;
  const modalProyectos = document.getElementById('modal-proyectos');
  const listaProyectos = document.getElementById('lista-proyectos');
  const btnSeleccionarProyecto = document.getElementById('btn-seleccionar-proyecto');
  const btnCancelarProyecto = document.getElementById('btn-cancelar-proyecto');

  // Cerrar la modal de listado de contratistas
  const modalContratistas = document.getElementById('modal-contratistas');
  modalContratistas.style.display = 'none';

  try {
    const response = await fetch('/obtener-proyectos');
    const data = await response.json();
    const [proyectos] = [data];
    console.log('Proyectos: ',proyectos);
    listaProyectos.innerHTML = '';

    proyectos.forEach(proyecto => {
      const li = document.createElement('li');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.value = proyecto.id;
      checkbox.id = `proyecto-${proyecto.id}`; // Agregar un id único al checkbox
      checkbox.addEventListener('change', () => {
        const checkboxes = listaProyectos.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(cb => {
          if (cb !== checkbox) {
            cb.checked = false;
          }
        });
        btnSeleccionarProyecto.disabled = !checkbox.checked;
      });
    
      const label = document.createElement('label');
      label.textContent = proyecto.nombre;
      label.setAttribute('for', `proyecto-${proyecto.id}`); // Asociar la etiqueta con el checkbox mediante el atributo 'for'
    
      li.appendChild(checkbox);
      li.appendChild(label);
      listaProyectos.appendChild(li);
    });

    btnSeleccionarProyecto.disabled = true;
   

  
    btnSeleccionarProyecto.removeEventListener('click', seleccionarProyectoMoverEmpleado);
    

    btnSeleccionarProyecto.addEventListener('click', seleccionProyectoMoverContratista);

    btnCancelarProyecto.removeEventListener('click', cancelarProyectoMoverEmpleado);

    btnCancelarProyecto.addEventListener('click', cancelarProyectoMoverContratista);

    modalProyectos.style.display = 'block';
  } catch (error) {
    console.error('Error al obtener los proyectos:', error);
  }
}

function seleccionProyectoMoverContratista(){
  const listaProyectos = document.getElementById('lista-proyectos');
  const proyectoSeleccionado = listaProyectos.querySelector('input[type="checkbox"]:checked').value;
  console.log('Proyecto Seleccionado: ',proyectoSeleccionado);
  console.log('ID Contratista: ',idContratista);
  moverContratistaProyecto(idContratista, proyectoSeleccionado);
}

function cancelarProyectoMoverContratista(){
  const modalProyectos = document.getElementById('modal-proyectos');
  const modalContratistas = document.getElementById('modal-contratistas');
  modalProyectos.style.display = 'none';
  modalContratistas.style.display = 'block';
}

//Funcion para mover contratistas de proyectos
async function moverContratistaProyecto(contratistaId, proyectoId) {
  const confirmResult = await Swal.fire({
    title: '¿Estás seguro?',
    text: '¿Deseas mover al contratista a este proyecto?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, mover',
    cancelButtonText: 'Cancelar'
  });

  if (confirmResult.isConfirmed) {
    try {
      const response = await fetch(`/mover-contratista-proyecto?contratistaId=${contratistaId}&proyectoId=${proyectoId}`, {
        method: 'PUT'
      });

      if (response.ok) {
        await Swal.fire('Éxito', 'El contratista se ha movido al nuevo proyecto', 'success').then( async()=>{
          const modalProyectos = document.getElementById('modal-proyectos');
          modalProyectos.style.display = 'none';
          const cantidadContratistas = await obtenerCantidadContratistas(idProyecto);
          document.querySelector('#numero-contratistas').textContent = cantidadContratistas + ' contratistas';
          await mostrarListadoContratistas(idProyecto);
        })
       
      } else {
        await Swal.fire('Error', 'No se pudo mover al contratista al nuevo proyecto', 'error');
      }
    } catch (error) {
      console.error('Error al mover al contratista:', error);
      await Swal.fire('Error', 'Ocurrió un error al mover al contratista', 'error');
    }
  }
}

//Funcion que permite comprobar si el usuario desea eliminar el contratista del proyecto
async function confirmarEliminarContratista(contratistaId, nombreContratista) {
  const modalContratistas = document.getElementById('modal-contratistas');
  const confirmResult = await Swal.fire({
    title: '¿Estás seguro?',
    text: `¿Deseas eliminar al contratista ${nombreContratista}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    customClass: {
      container: 'swal-container',
      popup: 'swal-popup'
    }
  });

  if (confirmResult.isConfirmed) {
    deleteContratista(contratistaId);
  }
}

//Funcion que eliminar el contratista del proyecto y de la tabla contratistas una vez que el usuario lo haya confirmado
async function deleteContratista(contratistaId) {
  try {
    const response = await fetch(`/eliminar-contratista-proyecto?contratistaId=${contratistaId}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      //await Swal.fire('Éxito', 'El contratista se ha eliminado exitosamente', 'success');
      await Swal.fire({
        title: 'Éxito',
        text: 'El contratista se ha eliminado exitosamente',
        icon: 'success',
        customClass: {
          container: 'swal-container',
          popup: 'swal-popup'
        }
      }).then( async () =>{
        const modalContratistas = document.getElementById('modal-contratistas');
        modalContratistas.style.display = 'none';
        const cantidadContratistas = await obtenerCantidadContratistas(idProyecto);
        document.querySelector('#numero-contratistas').textContent = cantidadContratistas + ' contratistas';
        mostrarListadoContratistas(idProyecto);
      })
      
    } else {
      await Swal.fire('Error', 'No se pudo eliminar al contratista', 'error');
    }
  } catch (error) {
    console.error('Error al eliminar al contratista:', error);
    await Swal.fire('Error', 'Ocurrió un error al eliminar al contratista', 'error');
  }
}


function eliminarConfirmarProyecto(idProyecto){
  Swal.fire({
    title: '¿Estás seguro?',
    text: `¿Deseas eliminar este proyecto?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      eliminarProyecto(idProyecto);
    }
  });
}

async function eliminarProyecto(idProyecto){
  try {
    const response = await fetch(`/eliminar-proyecto?id=${idProyecto}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      Swal.fire('Éxito', 'El proyecto ha sido eliminado exitosamente', 'success')
      .then(()=>{
        const modal2 = document.getElementById('modal2');
        modal2.style.display = 'none';
        actualizarTarjetasProyectos();
      })
      
    } else {
      Swal.fire('Error', 'No se pudo eliminar el proyecto', 'error');
    }
  } catch (error) {
    console.error('Error al eliminar el proyecto:', error);
    Swal.fire('Error', 'Ocurrió un error al eliminar el proyecto', 'error');
  }
}

async function actualizarTarjetasProyectos() {
  try {
    const respuesta = await fetch('/obtener-proyectos');
    const datos = await respuesta.json();

    if (datos) {
      const insightsContainer = document.querySelector('.insights');
      const asistenciasCard = document.querySelector('.asistencias');

      // Eliminar todas las tarjetas de proyectos existentes, excepto la tarjeta de "Crear nuevo proyecto"
      while (insightsContainer.firstChild !== asistenciasCard) {
        insightsContainer.removeChild(insightsContainer.firstChild);
      }

      datos.forEach(proyecto => {
        // Generar tarjeta para cada proyecto
        const tarjeta = generarTarjetaProyecto(proyecto);
        insightsContainer.insertBefore(tarjeta, asistenciasCard);
      });
    }
  } catch (err) {
    console.error("Hay un error al actualizar las tarjetas de proyectos: ", err);
  }
}

async function mostrarProyectos(){
  try{
    const respuesta = await fetch('/obtener-proyectos')
    const datos = await respuesta.json();

    if(datos){
        datos.forEach(proyecto =>{
        
           // Generar tarjeta para cada proyecto
          const tarjeta = generarTarjetaProyecto(proyecto);
          document.querySelector('.insights').insertBefore(tarjeta, document.querySelector('.asistencias'));
        });
    }
  }catch(err){
    console.error("Hay un error en la funcion mostrarEmpleados: ", err);
  }
}



async function mostrarEmpleados() {
    try{
      const respuesta = await fetch('/mostrarEmpleados')
      const datos = await respuesta.json();

      if(datos){
          console.log(datos);
          Employees = datos.empleados;
          const empleadosObj = {};
          Employees.forEach(empleado => {
            const nombreCompleto = `${empleado.nombre} ${empleado.apellido_paterno} ${empleado.apellido_materno}`;
            empleadosObj[empleado.id] = nombreCompleto;
          });
         
    
          let timeoutId = null;
          
          function validarNombreEncargado() {
            const nombreEncargado = nombreEncargadoInput.value.trim();
            encargadoId = Object.keys(empleadosObj).find(id => empleadosObj[id].toLowerCase() === nombreEncargado.toLowerCase());
          
            if (encargadoId) {
              localStorage.setItem('IDEMPLEADO', encargadoId);
              fechaInicioInput.disabled = false;
              fechaFinInput.disabled = false;
              descripcionInput.disabled = false;
              btnEmpleadoInput.style.pointerEvents = 'auto';
            } else {
              encargadoId = null;
              fechaInicioInput.disabled = true;
              fechaFinInput.disabled = true;
              descripcionInput.disabled = true;
              btnEmpleadoInput.style.pointerEvents = 'none';
              fechaInicioInput.value = '';
              fechaFinInput.value = '';
              descripcionInput.value = '';
            }
            
            console.log('Nombre del encargado:', nombreEncargado);
            console.log('ID del encargado:', encargadoId);
          }

          

      async function mostrarSugerencias() {
        const nombreIngresado = nombreEncargadoInput.value.trim().toLowerCase();
        const listaSugerencias = document.getElementById('lista-sugerencias');

        // Cancelar cualquier carga de sugerencias pendiente
        clearTimeout(timeoutId);

        if (nombreIngresado === '') {
          listaSugerencias.innerHTML = '';
          listaSugerencias.style.display = 'none';
          return;
        }

        await fetch('/obtener-encargados-disponibles')
        .then(response => response.json())
        .then(data => {
          const empleados = data.empleados.map(empleado => `${empleado.nombre} ${empleado.apellido_paterno} ${empleado.apellido_materno}`);
          const sugerencias = empleados.filter(empleado => empleado.toLowerCase().includes(nombreIngresado));
          listaSugerencias.innerHTML = '';
          listaSugerencias.scrollTop = 0; // Reiniciar la posición de desplazamiento
  
          if (sugerencias.length > 0) {
            let indiceInicial = 0;
            const maxSugerencias = 3;
  
            function cargarSugerencias() {
              const sugerenciasRestantes = sugerencias.slice(indiceInicial);
              const sugerenciasAMostrar = sugerenciasRestantes.slice(0, maxSugerencias);
  
              sugerenciasAMostrar.forEach(sugerencia => {
                const li = document.createElement('li');
                li.textContent = sugerencia;
  
                const sugerenciasYaMostradas = Array.from(listaSugerencias.children).map(li => li.textContent);
                if (!sugerenciasYaMostradas.includes(sugerencia)) {
                  li.addEventListener('click', () => {
                    nombreEncargadoInput.value = sugerencia;
                    listaSugerencias.innerHTML = '';
                    listaSugerencias.style.display = 'none';
                    nombreEncargadoInput.classList.add('sugerencia-seleccionada'); // Agregar clase CSS
                    validarNombreEncargado(); // Validar el nombre del encargado
                  });
                  listaSugerencias.appendChild(li);
                }
              });
  
              indiceInicial += maxSugerencias;
  
              // Verificar si hay más sugerencias para mostrar
              if (indiceInicial < sugerencias.length) {
                timeoutId = setTimeout(() => {
                  cargarSugerencias();
                }, 100); // Pequeño retraso para evitar bloqueo de UI
              }
            }
  
            cargarSugerencias();
            listaSugerencias.style.display = 'block';
  
          } else {
            const li = document.createElement('li');
            li.textContent = 'No se encontraron empleados con ese nombre o el empleado que busca pertenece a otra cuadrilla.';
            listaSugerencias.appendChild(li);
            listaSugerencias.style.display = 'block';
  
            fechaInicioInput.disabled = true;
            fechaFinInput.disabled = true;
            descripcionInput.disabled = true;
            btnEmpleadoInput.style.pointerEvents = "none";
  
            fechaInicioInput.value = '';
            fechaFinInput.value = '';
            descripcionInput.value = '';
          }
        })

      }
        // Función de debounce
      function debounce(func, delay) {
        let timeoutId;
        return function(...args) {
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => {
            func.apply(this, args);
          }, delay);
        };
      }

      // Función de mostrarSugerencias con debounce
      const mostrarSugerenciasDebounced = debounce(mostrarSugerencias, 300);

        nombreEncargadoInput.addEventListener('input', function() {
          toggleRestoCampos();
          mostrarSugerenciasDebounced();
          nombreEncargadoInput.classList.remove('sugerencia-seleccionada'); // Remover clase CSS
          validarNombreEncargado(); // Validar el nombre del encargado
        });

      }else{
        console.error('No se encontró dato en la funcion mostrarEmpleados');
      }

    }catch(err){
      console.error("Hay un error en la funcion mostrarEmpleados: ", err);
    }
}


//Funcion para comprimir la imagen del fondo de proyecto que el usuario elija
function compressImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = event => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);

        canvas.toBlob(blob => {
          const compressedFile = new File([blob], file.name, { type: file.type });
          resolve(compressedFile);
        }, file.type, 0.7); // Ajusta la calidad de compresión según tus necesidades (0.7 en este ejemplo)
      };
      img.src = event.target.result;
    };
    reader.onerror = error => {
      reject(error);
    };
    reader.readAsDataURL(file);
  });
}



(async () =>{

 
  await  mostrarEmpleados();
  await  mostrarProyectos();

//Boton de guardar proyecto

btnGuardar.addEventListener('click', async e => {
  e.preventDefault();

  //Aqui se muestra el loading animation
  document.getElementById('loading-overlay').style.display = 'flex';

  console.log('id del encargado desde el submit: ', localStorage.getItem('IDEMPLEADO'));

  const nombreProyecto = nombreProyectoInput.value;
  const encargadoId = localStorage.getItem('IDEMPLEADO');
  const fechaInicio = fechaInicioInput.value;
  const fechaFin = fechaFinInput.value;
  const presupuestoInicial = parseFloat(presupuestoInicialInput.value.replace(/[$,]/g, ""));
  const descripcion = descripcionInput.value;
  const cuadrillas = Array.from(document.querySelectorAll('.empleado-elemento')).map(cuadrilla => cuadrilla.dataset.nombre);
  const empleadosAsignados = JSON.parse(localStorage.getItem('empleadosAsignados')) || {};
  const contratistas = JSON.parse(localStorage.getItem('contratistas')) || [];
  const fileInput = document.getElementById('file-input');
  const file = fileInput.files[0];

  const formData = new FormData();
  formData.append('nombreProyecto', nombreProyecto);
  formData.append('encargadoId', encargadoId);
  formData.append('fechaInicio', fechaInicio);
  formData.append('fechaFin', fechaFin);
  formData.append('presupuestoInicial', presupuestoInicial);
  formData.append('descripcion', descripcion);
  formData.append('cuadrillas', JSON.stringify(cuadrillas));
  formData.append('contratistas', JSON.stringify(contratistas));
  formData.append('empleadosAsignados', JSON.stringify(empleadosAsignados));

  if (file) {
    try {
      let compressedFile;
      if (file.type.startsWith('image/')) {
        // La imagen se seleccionó desde el explorador de archivos
        compressedFile = await compressImage(file);
      } else {
        // La imagen se capturó desde la cámara
        compressedFile = file;
      }
      formData.append('imagen', compressedFile);

    } catch (error) {
      //Display none del animation
      document.getElementById('loading-overlay').style.display = 'none';
      console.error('Error al comprimir la imagen:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Ocurrió un error al procesar la imagen',
        icon: 'error'
      });
      return;
    }
  }

  await fetch('/guardar-proyecto', {
    method: 'POST',
    body: formData
  })
    .then(response => response.json())
    .then(data => {
      //Display none del animation
      document.getElementById('loading-overlay').style.display = 'none';
      if (data.success) {
        const proyecto = data.proyecto;
        const tarjeta = generarTarjetaProyecto(proyecto);
        document.querySelector('.insights').insertBefore(tarjeta, document.querySelector('.asistencias'));
        Swal.fire({
          title: 'Éxito!',
          text: 'Proyecto Guardado',
          icon: 'success'
        }).then(() => {
          limpiarModalCrearProyecto();
          localStorage.removeItem('IDEMPLEADO');
          localStorage.removeItem('empleadosAsignados');
          localStorage.removeItem('cuadrillasCreadas');
          const selectedEmployees = document.querySelectorAll('.empleado-elemento');
          selectedEmployees.forEach(emp => emp.remove());
          modal.style.display = 'none';
          descripcion.value = '';
          dateInputs.forEach(dateInput => {
            dateInput.value = '';
          });
          btnGuardar.disabled = true;
        });
      } else {
        Swal.fire({
          title: 'Error!',
          text: 'Ocurrió un error al guardar el proyecto',
          icon: 'error'
        });
      }
    })
    .catch(error => {
      //Display none del animation
      document.getElementById('loading-overlay').style.display = 'none';
      console.error('Error al guardar el proyecto:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Ocurrió un error al guardar el proyecto',
        icon: 'error'
      });
    });
});









})(); 

/* ================================= Drop down menu ================================= */



function toggleDropdown(event) {
  event.preventDefault();
  const dropdownMenu = event.target.closest('.sidebar-item').querySelector('.dropdown-menu');
  const dropdownIcon = event.target.closest('.sidebar-item').querySelector('.dropdown-icon');
  
  dropdownMenu.classList.toggle('show');
  dropdownIcon.classList.toggle('open');
  
  const sidebarItems = document.querySelectorAll('.sidebar-item');
  sidebarItems.forEach(item => {
    if (item !== event.target.closest('.sidebar-item')) {
      item.querySelector('.dropdown-menu').classList.remove('show');
      item.querySelector('.dropdown-icon').classList.remove('open');
    }
  });
}





  

  
    