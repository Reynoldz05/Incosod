/*********************************************************** Importaciones ************************************************************/
const sideMenu = document.querySelector("aside");
const menuAsistenciasSemanal = document.querySelector(".menu-registrar-semanal");
const menuAsistencias = document.querySelector(".menu-asistencias");

/*********************************************************** Variables Globales ************************************************************/
let fechaHoy = 0;
let horasAsignadas = "";
let justificacionesDiarias = [];
let faltasDiarias = [];
let FI = 0;
let FF = 0;
let HSA = "";
let JS = [];
let FS = [];

/*********************************************************** Funciones de Utilidad ************************************************************/
function generateDateString(date = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date);
}

/*********************************************************** Funciones de Sincronización ************************************************************/
async function fetchFechaModificacion() {
  try {
    const respuesta = await fetch('/sincronizar-data?llave=fechaModificacion');
    const datos = await respuesta.json();
    
    if (datos) {
      const { valor } = datos;
      console.log("Fecha modificacion: " + valor);
      fechaHoy = valor;
    } else {
      console.error('No se encontró dato');
    }
  } catch (err) {
    console.error(err);
  }
}

async function fetchHorasAsignadas() {
  try {
    const respuesta = await fetch('/sincronizar-data?llave=HorasAsignadas');
    const datos = await respuesta.json();

    if (datos) {
      const { valor } = datos;
      console.log("Horas Asignadas: " + valor);
      horasAsignadas = valor;
    } else {
      console.error('No se encontró dato');
    }
  } catch (err) {
    console.error(err);
  }
}

async function fetchJustificaciones() {
  try {
    const respuesta = await fetch('/sincronizar-data?llave=Justificaciones');
    const datos = await respuesta.json();

    if (datos) {
      const { valor } = datos;
      justificacionesDiarias = valor;
    } else {
      console.error('No se encontró dato');
    }
  } catch (err) {
    console.error(err);
  }
}

async function fetchFaltas() {
  try {
    const respuesta = await fetch('/sincronizar-data?llave=Faltas');
    const datos = await respuesta.json();

    if (datos) {
      const { valor } = datos;
      console.log(valor);
      faltasDiarias = valor;
    } else {
      console.error('No se encontró dato');
    }
  } catch (err) {
    console.error(err);
  }
}

async function fetchFechaInicio() {
  try {
    const respuesta = await fetch('/sincronizar-data?llave=fechaInicio');
    const datos = await respuesta.json();

    if (datos) {
      const { valor } = datos;
      console.log("Fecha inicio: " + valor);
      FI = valor;
    } else {
      console.error('No se encontró dato');
    }
  } catch (err) {
    console.error(err);
  }
}

async function fetchFechaFin() {
  try {
    const respuesta = await fetch('/sincronizar-data?llave=fechaFin');
    const datos = await respuesta.json();

    if (datos) {
      const { valor } = datos;
      console.log("Fecha fin: " + valor);
      FF = valor;
    } else {
      console.error('No se encontró dato');
    }
  } catch (err) {
    console.error(err);
  }
}

async function fetchHorasSemanalesAsignadas() {
  try {
    const respuesta = await fetch('/sincronizar-data?llave=HorasSemanalesAsignadas');
    const datos = await respuesta.json();

    if (datos) {
      const { valor } = datos;
      console.log("Horas Semanales Asignadas: " + valor);
      HSA = valor;
    } else {
      console.error('No se encontró dato');
    }
  } catch (err) {
    console.error(err);
  }
}

async function fetchJustificacionesSemanales() {
  try {
    const respuesta = await fetch('/sincronizar-data?llave=JustificacionesSemanales');
    const datos = await respuesta.json();

    if (datos) {
      const { valor } = datos;
      JS = JSON.parse(valor);
    } else {
      console.error('No se encontró dato');
    }
  } catch (err) {
    console.error(err);
  }
}

async function fetchFaltasSemanales() {
  try {
    const respuesta = await fetch('/sincronizar-data?llave=FaltasSemanales');
    const datos = await respuesta.json();

    if (datos) {
      const { valor } = datos;
      FS = JSON.parse(valor);
    } else {
      console.error('No se encontró dato');
    }
  } catch (err) {
    console.error(err);
  }
}

/*********************************************************** Eventos del DOM ************************************************************/



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



/*********************************************************** Inicialización seccion de fecha ************************************************************/
const datePickerContainer = document.getElementById('datePickerContainer');
const dateContainer = document.getElementById('dateContainer');
const fechaActual = document.getElementById('fechaActual');
const fechaSeleccionada = document.getElementById('fechaSeleccionada');

let isDatePickerOpen = false;

dateContainer.addEventListener('click', (event) => {
  event.stopPropagation();
  if (!isDatePickerOpen) {
    fechaActual.showPicker();
    datePickerContainer.classList.add('open');
    isDatePickerOpen = true;
  } else {
    datePickerContainer.classList.remove('open');
    isDatePickerOpen = false;
  }
});

document.addEventListener('click', (event) => {
  if (isDatePickerOpen && !dateContainer.contains(event.target)) {
    datePickerContainer.classList.remove('open');
    isDatePickerOpen = false;
  }
});

fechaActual.addEventListener('change', () => {
  fechaSeleccionada.textContent = formatDate(fechaActual.value);
});

// Inicialización
const hoy = String(generateDateString());
var fecha = new Date();
var dia = fecha.getDate();
var mes = fecha.getMonth() + 1;
var ano = fecha.getFullYear();

if (dia < 10) {
  dia = '0' + dia;
}

if (mes < 10) {
  mes = '0' + mes;
}

fecha = ano + '-' + mes + '-' + dia;
fechaActual.value = fecha;
fechaSeleccionada.textContent = formatDate(fecha);

function formatDate(date) {
  const [year, month, day] = date.split('-');
  return `${day}/${month}/${year}`;
}

