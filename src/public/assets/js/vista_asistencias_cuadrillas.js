// Obtener elementos del DOM
const proyectosSelect = document.getElementById('proyectos-select');
const cuadrillasSelect = document.getElementById('cuadrillas-select');
const btnAceptar = document.getElementById('btn-aceptar');
const fechaActualInput = document.getElementById('fechaActual');
const tableContainer = document.querySelector('.table-container');
const tablaAsistencias = document.getElementById('tabla-asistencias');
const tablaAsistenciasBody = tablaAsistencias.querySelector('tbody');

// Función para obtener los proyectos con asistencias
async function obtenerProyectosConAsistencias() {
    try {
        const response = await fetch('/obtener-proyectos-con-asistencias');
        const proyectos = await response.json();
        return proyectos;
    } catch (error) {
        console.error('Error al obtener los proyectos con asistencias:', error);
    }
}

async function obtenerProyectosConAsistenciasUsuarios(idUser) {
    try {
        const response = await fetch(`/obtener-proyectos-con-asistencias-usuarios/${idUser}`);
        const proyectos = await response.json();
        return proyectos;
    } catch (error) {
        console.error('Error al obtener los proyectos con asistencias:', error);
    }
}

// Función para obtener las cuadrillas con asistencias de un proyecto
async function obtenerCuadrillasConAsistencias(idProyecto) {
    try {
        const response = await fetch(`/obtener-cuadrillas-con-asistencias/${idProyecto}`);
        const cuadrillas = await response.json();
        return cuadrillas;
    } catch (error) {
        console.error('Error al obtener las cuadrillas con asistencias:', error);
    }
}

// Función para obtener las asistencias de una cuadrilla
async function obtenerAsistenciasCuadrilla(idProyecto, idCuadrilla) {
    try {
        const response = await fetch(`/obtener-asistencias-cuadrilla/${idProyecto}/${idCuadrilla}`);
        const asistencias = await response.json();
        return asistencias;
    } catch (error) {
        console.error('Error al obtener las asistencias de la cuadrilla:', error);
    }
}

function obtenerFechaActualChihuahua() {
    const fechaActual = new Date().toLocaleString('es-MX', {
     timeZone: 'America/Monterrey',
     year: 'numeric',
     month: '2-digit',
     day: '2-digit'
   });
   
   console.log('Fecha actual en el formato de Durango: ', fechaActual);
   
   const [fecha] = fechaActual.split(' ');
   const [dia, mes, anio] = fecha.split('/');
   
   return `${anio}-${mes}-${dia}`;
 }

// Función para formatear la fecha en el formato deseado
function formatearFecha(fecha) {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const fechaObj = new Date(fecha + 'T00:00:00');
    return fechaObj.toLocaleDateString('es-ES', options);
  }
// Función para formatear la hora en el formato deseado
function formatearHora(hora) {
    const [horas, minutos] = hora.split(':');
    const ampm = horas >= 12 ? 'pm' : 'am';
    const horasFormateadas = horas % 12 || 12;
    return `${horasFormateadas}:${minutos} ${ampm}`;
}

// Cargar los proyectos con asistencias al cargar la página
document.addEventListener('DOMContentLoaded', async () => {
    const tablaAsistencias = document.getElementById('tabla-asistencias');
    const tablaAsistenciasBody = tablaAsistencias.querySelector('tbody');
    const fechaActualInput = document.getElementById('fechaActual');
    tablaAsistencias.style.display = 'none';
    tablaAsistenciasBody.display = 'none';
    fechaActualInput.parentElement.style.display = 'none';
    let proyectos = null
    if(proyectosSelect.dataset.id){
        const idUser = proyectosSelect.dataset.id;
        proyectos = await obtenerProyectosConAsistenciasUsuarios(idUser);
    }else{
        proyectos = await obtenerProyectosConAsistencias();
    }
    
    proyectos.forEach(proyecto => {
        const option = document.createElement('option');
        option.value = proyecto.id;
        option.textContent = proyecto.nombre;
        proyectosSelect.appendChild(option);
    });



});

// Evento de cambio en la lista desplegable de proyectos
proyectosSelect.addEventListener('change', async () => {
    const idProyecto = proyectosSelect.value;
    cuadrillasSelect.innerHTML = '<option value="">Seleccione una cuadrilla</option>';
    btnAceptar.disabled = true;

    if (idProyecto) {
        const cuadrillas = await obtenerCuadrillasConAsistencias(idProyecto);
        cuadrillas.forEach(cuadrilla => {
            const option = document.createElement('option');
            option.value = cuadrilla.id;
            option.textContent = cuadrilla.nombre;
            cuadrillasSelect.appendChild(option);
            cuadrillasSelect.dataset.nombre = cuadrilla.nombre;
        });
        cuadrillasSelect.disabled = false;
    } else {
        cuadrillasSelect.disabled = true;
    }
});

// Evento de cambio en la lista desplegable de cuadrillas
cuadrillasSelect.addEventListener('change', () => {
    const idCuadrilla = cuadrillasSelect.value;
    btnAceptar.disabled = !idCuadrilla;
});

// Evento de clic en el botón de aceptar
btnAceptar.addEventListener('click', async () => {

    if (btnAceptar.textContent === 'Cambiar') {
        // Ocultar el campo de fecha y la tabla de asistencias
        fechaActualInput.parentElement.style.display = 'none';
        tablaAsistencias.style.display = 'none';
        tablaAsistenciasBody.style.display = 'none';
        tableContainer.style.display = 'none';
        // Cambiar el texto del botón y habilitar las listas desplegables
        btnAceptar.textContent = 'Aceptar';
        proyectosSelect.disabled = false;
        cuadrillasSelect.disabled = false;
    }else{
        const idProyecto = proyectosSelect.value;
        const idCuadrilla = cuadrillasSelect.value;
        const asistencias = await obtenerAsistenciasCuadrilla(idProyecto, idCuadrilla);
        const nombreCuadrilla = cuadrillasSelect.dataset.nombre;
        console.log(nombreCuadrilla);
        // Limpiar la tabla de asistencias
        tablaAsistenciasBody.innerHTML = '';

        // Agregar las filas de asistencias a la tabla
        asistencias.forEach(asistencia => {
            const idUser = proyectosSelect.dataset.id;
            console.log(asistencia.id);
            const row = document.createElement('tr');
            if(idUser){
                row.innerHTML = `
                <td>${formatearFecha(asistencia.fecha_asistencia)}</td>
                <td>${formatearHora(asistencia.hora_inicio)}</td>
                <td>${formatearHora(asistencia.hora_fin)}</td>
                <td>${asistencia.total_asistencias}</td>
                <td>${asistencia.total_inasistencias}</td>
                <td>
                    <div class="acciones">
                        <a href="/mostrarDetallesAsistenciasCuadrillas/?idAsistenciaCuadrilla=${asistencia.id}&nombreCuadrilla=${nombreCuadrilla}" ><span class="material-icons">visibility</span></a>
                    </div>
                </td>
            `;
            }else{
                row.innerHTML = `
                <td>${formatearFecha(asistencia.fecha_asistencia)}</td>
                <td>${formatearHora(asistencia.hora_inicio)}</td>
                <td>${formatearHora(asistencia.hora_fin)}</td>
                <td>${asistencia.total_asistencias}</td>
                <td>${asistencia.total_inasistencias}</td>
                <td>
                    <div class="acciones">
                    <a href="/mostrarDetallesAsistenciasCuadrillas/?idAsistenciaCuadrilla=${asistencia.id}&nombreCuadrilla=${nombreCuadrilla}" ><span class="material-icons">visibility</span></a>
                    <span class="material-icons eliminarAsistencia" data-id="${asistencia.id}" data-fecha="${asistencia.fecha_asistencia}">delete</span>
                    </div>
                </td>
            `;
            }
           
            tablaAsistenciasBody.appendChild(row);
        });

        // Mostrar el campo de fecha y la tabla de asistencias
        fechaActualInput.parentElement.style.display = '';
        tablaAsistencias.style.display = '';
        tablaAsistenciasBody.style.display = '';
        tableContainer.style.display = '';
        
        // Cambiar el texto del botón y deshabilitar las listas desplegables
        btnAceptar.textContent = 'Cambiar';
        proyectosSelect.disabled = true;
        cuadrillasSelect.disabled = true;

        // Agrega un evento de clic a todos los elementos con la clase "eliminarAsistencia"
    document.querySelectorAll('.eliminarAsistencia').forEach(element => {
        element.addEventListener('click', function() {
        const idAsistencia = this.getAttribute('data-id');
        const fechaAsistencia = this.getAttribute('data-fecha');
        const fechaHoy = obtenerFechaActualChihuahua();

        const fechasCoinciden = (fechaHoy == fechaAsistencia);
    
        // Muestra una alerta de SweetAlert para confirmar la eliminación
        Swal.fire({
            title: '¿Estás seguro?',
            text: `¿Deseas eliminar la asistencia del ${fechaAsistencia}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                document.getElementById('loading-overlay').style.display = 'flex';
            // Realiza una solicitud al servidor para eliminar la asistencia
            await fetch(`/eliminar-asistencia/${idAsistencia}/${fechasCoinciden}/${fechaHoy}`, {
                method: 'DELETE'
            }).then(response => {
                document.getElementById('loading-overlay').style.display = 'none';
                if (response.ok) {
                // Si la eliminación fue exitosa, muestra una alerta de éxito
                Swal.fire(
                    '¡Eliminado!',
                    'La asistencia ha sido eliminada correctamente.',
                    'success'
                ).then(() => {
                    // Recarga la página después de que el usuario cierre la alerta
                    location.reload();
                });
                } else {
                // Si hubo un error en la eliminación, muestra una alerta de error
                Swal.fire(
                    'Error',
                    'No se pudo eliminar la asistencia. Por favor, intenta nuevamente.',
                    'error'
                );
                }
            })
            .catch(error => {
                console.error('Error al eliminar la asistencia:', error);
                Swal.fire(
                'Error',
                'No se pudo eliminar la asistencia. Por favor, intenta nuevamente.',
                'error'
                );
            });
            }
        });
        });
    });


    }
});




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

