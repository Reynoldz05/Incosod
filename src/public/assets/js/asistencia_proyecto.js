const sideMenu = document.querySelector("aside");
const menuBtn = document.querySelector("#menu-btn");
const closeBtn = document.querySelector("#close-btn");
const themeToggler = document.querySelector(".theme-toggler");
const faltaIconos = [];
const tbody1 = document.getElementById('tbody1');
const tbody2 = document.getElementById('tbody2');
const adjuntarIcono = document.getElementById('adjuntar');
const adjuntarEtiqueta = document.getElementById('adjuntar-etiqueta');
let fotoCapturada = null;
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
const empleados = document.getElementById("p-empleados");

empleados.addEventListener("click", () => {
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


///////////////////////////////////////// Cuando el usuario da click afuera de la pantalla modal
const modal_semana = document.getElementById('modal-semana');

var checkboxes = document.querySelectorAll('#modal input[type="checkbox"]');
var inputs = document.querySelectorAll('#modal input[type="text"]');

var checkboxes_semana = document.querySelectorAll('#modal-semana input[type="checkbox"]');
var inputs_semana = document.querySelectorAll('#modal-semana input[type="text"]');

const checksModal2 = document.querySelectorAll('#modal2 input[type="checkbox"]');
const numerosModal2 = document.querySelectorAll('#modal2 input[type="number"]');

const checksModal2_semana = document.querySelectorAll('#modal2-semana input[type="checkbox"]');
const numerosModal2_semana = document.querySelectorAll('#modal2-semana input[type="number"]');

const checksModal3 = document.querySelectorAll('#modal3 input[type="checkbox"]');

const modal =  document.getElementById('modal');
const modal2_semana = document.getElementById('modal2_semana');
const modal3 = document.getElementById('modal3');





window.onclick = (e) => {
    if (e.target === modal) { 

        inputs.forEach(input => {
            input.value = "";
          });

        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
          });

        modal.style.display = "none";
    }
    if(e.target === modal_semana){
      inputs_semana.forEach(input => {
        input.value = "";
      });

    checkboxes_semana.forEach(checkbox => {
        checkbox.checked = false;
      });

    modal_semana.style.display = "none";
    }
    if (e.target === modal2){

        checksModal2.forEach(check => {
            check.checked = false;
          });

        numerosModal2.forEach(num => {
        num.value = 1;
        });

        btnConfirmar.disabled = true;
      

        modal2.style.display = "none";
    }
    if (e.target === modal2_semana){

      checksModal2_semana.forEach(check => {
          check.checked = false;
        });

      numerosModal2_semana.forEach(num => {
      num.value = 1;
      });

      btnConfirmar_semana.disabled = true;
    

      modal2_semana.style.display = "none";
  }
    if (e.target === modal3){
        modal3.style.display = "none";

        checksModal3.forEach(good => {
          good.checked = false;
        });

        fotoCapturada = null;
        adjuntarIcono.textContent = 'attach_file';
        adjuntarEtiqueta.textContent = 'Adjuntar Evidencia';
        document.getElementById('file-input').value = '';
        modal3.style.display = 'none';
        textarea.value = "";
        btn_Terminar.disabled = true;


    }
}


       

////Sugerencias de Palabras
const proyectos = ["Casa Domicilio", "Carretera", "Rascacielos"];

const datalist = document.getElementById("sugerencias-proyecto");

proyectos.forEach(proyecto => {
  const option = document.createElement('option');
  option.value = proyecto;
  
  datalist.appendChild(option);
})




// Obtener elementos del DOM
const proyectosSelect = document.getElementById('proyectos-select');
const cuadrillasSelect = document.getElementById('cuadrillas-select');
const btnAceptar = document.getElementById('btn-aceptar');
const tablaEmpleados = document.getElementById('tabla-empleados');
const tablaEmpleadosBody = tablaEmpleados.querySelector('tbody');

// Función para obtener los proyectos
async function obtenerProyectos() {
  try {
    const response = await fetch('/obtener-proyectos');
    const proyectos = await response.json();
    return proyectos;
  } catch (error) {
    console.error('Error al obtener los proyectos:', error);
  }
}

// Función para obtener las cuadrillas de un proyecto
async function obtenerCuadrillas(idProyecto) {
  try {
    const response = await fetch(`/obtenerCuadrillas/${idProyecto}`);
    const cuadrillas = await response.json();
    return cuadrillas;
  } catch (error) {
    console.error('Error al obtener las cuadrillas:', error);
  }
}

// Función para obtener los empleados de una cuadrilla
async function obtenerEmpleadosCuadrilla(idCuadrilla) {
  try {
    const response = await fetch(`/obtenerEmpleadosCuadrilla/${idCuadrilla}`);
    const empleados = await response.json();
    return empleados;
  } catch (error) {
    console.error('Error al obtener los empleados de la cuadrilla:', error);
  }
}

// Cargar los proyectos al cargar la página
document.addEventListener('DOMContentLoaded', async () => {

  // Obtener todos los inputs de tipo "time"
const timeInputs = document.querySelectorAll('input[type="time"]');

// Recorrer cada input de tipo "time"
timeInputs.forEach(function(input) {
  // Agregar un evento "focus" al input
  input.addEventListener('focus', function() {
    // Obtener la hora actual
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    
    // Formatear la hora actual con los minutos en ":00"
    const formattedTime = `${currentHour.toString().padStart(2, '0')}:00`;
    
    // Establecer el valor del input con la hora formateada
    input.value = formattedTime;
  });
});


  const proyectos = await obtenerProyectos();
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
    const cuadrillas = await obtenerCuadrillas(idProyecto);
    cuadrillas.forEach(cuadrilla => {
      console.log('cuadrilla: ',cuadrilla);
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

// Función para verificar si se ha terminado el turno para una asistencia de cuadrilla
async function verificarTerminarTurno(idAsistenciaCuadrilla) {
  try {
    const response = await fetch(`/verificar-terminar-turno/${idAsistenciaCuadrilla}`);
    const data = await response.json();
    return data.terminado;
  } catch (error) {
    console.error('Error al verificar si se ha terminado el turno:', error);
    return false;
  }
}

// Función para obtener las horas de inicio y fin desde la base de datos
async function obtenerHorasJornada(idAsistenciaCuadrilla) {
  try {
    const response = await fetch(`/obtener-horas-jornada/${idAsistenciaCuadrilla}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener las horas de la jornada:', error);
    return null;
  }
}


// Evento de clic en el botón "Aceptar"
btnAceptar.addEventListener('click', async () => {
  const tablaContainer = document.getElementById('tabla-container');
  if(btnAceptar.textContent == 'Cambiar'){
    // Habilitar las listas desplegables de proyecto y cuadrilla
    document.getElementById('proyectos-select').disabled = false;
    document.getElementById('cuadrillas-select').disabled = false;

    // Ocultar la tabla de asistencia
    tablaContainer.classList.add('oculto2');

    // Cambiar el nombre del botón de cambiar a aceptar
    btnAceptar.textContent = 'Aceptar';

    
    document.getElementById('hora-inicio').disabled = false;
    document.getElementById('hora-fin').disabled = false;
    document.getElementById('hora-inicio').value = "";
    document.getElementById('hora-fin').value = "";
    document.getElementById('horas-jornada').style.display = 'none';

    return;
  }else{
  await verificarFechaAsistencia();
  
  const idCuadrilla = cuadrillasSelect.value;
  const empleados = await obtenerEmpleadosCuadrilla(idCuadrilla);
  console.log('Empleados: ',empleados);
  console.log('ID Cuadrilla: ',idCuadrilla);
  console.log(obtenerFechaActualChihuahua());
  if (empleados.length === 0) {
    Swal.fire({
      title: 'Cuadrilla sin empleados',
      text: 'La cuadrilla seleccionada no tiene empleados asignados. Por favor, seleccione otra cuadrilla.',
      icon: 'warning',
      confirmButtonText: 'Aceptar'
    });
    if(tablaContainer.classList.contains('oculto2')){
      tablaEmpleados.style.display = 'none';
    
    }else{
      tablaContainer.classList.add('oculto2');
    }
   
    return;
  }else{

    tablaEmpleadosBody.innerHTML = '';
    empleados.forEach(empleado => {
      console.log('Empleado: ', empleado);
      const row = document.createElement('tr');
      row.classList.add('employees');
      const nombre = `${empleado.nombre} ${empleado.apellido_paterno} ${empleado.apellido_materno}`;
      row.innerHTML = `
        <td>${empleado.nombre} ${empleado.apellido_paterno} ${empleado.apellido_materno}</td>
        <td>
          <label>
            <input type="radio" name="asistencia-${empleado.id}" value="asistencia" data-cuadrilla="${idCuadrilla}" data-nombre="${nombre}" data-id = ${empleado.id}>
          </label>
        </td>
        <td>
          <label>
            <input type="radio" name="asistencia-${empleado.id}" value="inasistencia" data-cuadrilla="${idCuadrilla}" data-nombre="${nombre}" data-id = ${empleado.id}>
          </label>
        </td>
      `;
      tablaEmpleadosBody.appendChild(row);
    });
    const fechaActual = obtenerFechaActualChihuahua();
    const asistenciaTomada = await verificarAsistenciaCuadrilla(idCuadrilla, fechaActual);
    console.log(asistenciaTomada);
    if (asistenciaTomada) {
      // Obtener las asistencias y los datos de los empleados desde la base de datos
      const empleadosConAsistencias = await obtenerAsistenciasEmpleados(idCuadrilla, fechaActual);

      // Convertir el arreglo de empleados con asistencias en un objeto con el ID del empleado como clave
      const asistenciasPorEmpleado = empleadosConAsistencias.reduce((obj, empleado) => {
        obj[empleado.id] = empleado.asistencia;
        return obj;
      }, {});
      const idAsistenciaCuadrilla = await obtenerIdAsistenciaCuadrilla(idCuadrilla, fechaActual);

      const horasJornada = await obtenerHorasJornada(idAsistenciaCuadrilla);
     
      if (horasJornada) {
        document.getElementById('hora-inicio').value = horasJornada.hora_inicio;
        document.getElementById('hora-fin').value = horasJornada.hora_fin;
        document.getElementById('hora-inicio').disabled = true;
        document.getElementById('hora-fin').disabled = true;
      }

      // Obtener los valores de data-idDetalleCuadrilla almacenados en la tabla datos_localstorage
      const idDetallesCuadrilla = await obtenerIdDetallesCuadrilla(idAsistenciaCuadrilla);

      if (idDetallesCuadrilla) {
        idDetallesCuadrilla.forEach(detalle => {
          const radioInasistencia = document.querySelector(`input[type="radio"][name="asistencia-${detalle.id_empleado}"][value="inasistencia"]`);
          const radioAsistencia = document.querySelector(`input[type="radio"][name="asistencia-${detalle.id_empleado}"][value="asistencia"]`);
          radioInasistencia.dataset.idDetalleAsistencia = detalle.id;
          radioInasistencia.dataset.idAsistenciaCuadrilla = idAsistenciaCuadrilla;
          radioAsistencia.dataset.idAsistenciaCuadrilla = idAsistenciaCuadrilla;
        });
      }


      // Reflejar las asistencias en los radiobuttons de los empleados
      reflejarAsistencias(empleadosConAsistencias, asistenciasPorEmpleado);

      // Mostrar los logotipos de justificación en los empleados con inasistencia
      mostrarLogotiposJustificacion(empleadosConAsistencias, asistenciasPorEmpleado);

      const turnoTerminado = await verificarTerminarTurno(idAsistenciaCuadrilla);
      console.log('Turno Terminado: ',turnoTerminado);
      if (turnoTerminado) {
        document.querySelector('.btn-terminar').textContent = 'Editar horas laboradas';
      } else {
        document.querySelector('.btn-terminar').textContent = 'Terminar Turno';
      }


      // Deshabilitar el botón de guardar
      document.querySelector('.btn-guardar').disabled = true;

      const radios = document.querySelectorAll('input[type="radio"]');

      radios.forEach(radio =>{
        radio.disabled = true;
      })

      document.getElementById('btnTerminarTurno').disabled = false;
    } else {
      // Habilitar el botón de guardar
      const horaInicio = document.getElementById('hora-inicio').value;
      const horaFin = document.getElementById('hora-fin').value;
      document.querySelector('.btn-guardar').disabled = false;
      document.getElementById('btnTerminarTurno').disabled = true;
      document.querySelector('.btn-terminar').textContent = 'Terminar Turno';
         
      if ((horaInicio != '' && horaInicio != null) && (horaFin != '' && horaFin != null) && horaFin > horaInicio) {
        document.querySelector('.btn-guardar').disabled = false;
      } else {
        document.querySelector('.btn-guardar').disabled = true;
        
      }
    }

    document.getElementById('horas-jornada').style.display = 'block';

   
    if(tablaContainer.classList.contains('oculto2')){
      tablaContainer.classList.remove('oculto2');

    }

    tablaEmpleados.style.display = 'table';


    
    // Deshabilitar las listas desplegables de proyecto y cuadrilla
    document.getElementById('proyectos-select').disabled = true;
    document.getElementById('cuadrillas-select').disabled = true;

    // Cambiar el nombre del botón de aceptar a cambiar
    btnAceptar.textContent = 'Cambiar';

    }

  }
  
});

// Validar las horas de inicio y fin al cambiar los valores de los inputs
document.getElementById('hora-inicio').addEventListener('change', validarHorasJornada);
document.getElementById('hora-fin').addEventListener('change', validarHorasJornada);


function validarHorasJornada() {
  const horaInicio = document.getElementById('hora-inicio').value;
  const horaFin = document.getElementById('hora-fin').value;
  const btnGuardar = document.querySelector('.btn-guardar');

  if (horaInicio && horaFin && horaFin > horaInicio) {
    btnGuardar.disabled = false;
  } else {
    btnGuardar.disabled = true;
    if (horaFin && horaFin <= horaInicio) {
      Swal.fire('Error', 'La hora de salida no puede ser menor o igual a la hora de entrada', 'error');
    }
  }
}


// Función para mostrar los logotipos de justificación en los empleados con inasistencia
function mostrarLogotiposJustificacion(empleadosConAsistencias, asistenciasPorEmpleado, idAsistenciaCuadrilla) {
  empleadosConAsistencias.forEach(async (empleado, index) => {
    if (empleado.asistencia === 0) {
      const radioInasistencia = document.querySelector(`input[type="radio"][name="asistencia-${empleado.id}"][value="inasistencia"]`);
      const idDetalleAsistencia = radioInasistencia.dataset.idDetalleAsistencia;
      const idAsistenciaCuadrilla = radioInasistencia.dataset.idAsistenciaCuadrilla;

      console.log('idDetalleAsistencia desde mostrarLogotiposJustificacion', idDetalleAsistencia);

      const td = radioInasistencia.closest('td');

      const falta = document.createElement('span');
      falta.innerHTML = `<i data-id="${empleado.id}" data-id-asistencia-cuadrilla="${idAsistenciaCuadrilla}" data-id-detalle-asistencia="${idDetalleAsistencia}" class="material-icons icon-falta">description</i>`;

      falta.addEventListener('click', async e => {
        const idEmpleado = e.target.dataset.id;
        const idDetalleAsistencia = e.target.dataset.idDetalleAsistencia;
        const idAsistenciaCuadrilla = e.target.dataset.idAsistenciaCuadrilla;
        abrirModalJustificacion(idEmpleado, idDetalleAsistencia, idAsistenciaCuadrilla);
      });

      td.appendChild(falta);

      // Obtener las justificaciones desde la base de datos
      const justificaciones = await obtenerJustificaciones(idDetalleAsistencia);
      console.log(justificaciones);

      // Verificar si el ID del detalle de asistencia está en las justificaciones
      const justificacion = justificaciones.find(j => j.id_detalle_asistencia_cuadrilla == idDetalleAsistencia);

      if (justificacion) {
        radioInasistencia.style.backgroundColor = 'orange';
        radioInasistencia.style.borderColor = 'orange';
        falta.style.display = 'none';
      } else {
        // Obtener las faltas desde la base de datos
        const faltas = await obtenerFaltas(idDetalleAsistencia);

        // Verificar si el ID del detalle de asistencia está en las faltas
        const faltaRegistrada = faltas.find(f => f.id_detalle_asistencia_cuadrilla == idDetalleAsistencia);

        if (faltaRegistrada) {
          radioInasistencia.style.backgroundColor = 'red';
          radioInasistencia.style.borderColor = 'red';
          falta.style.display = 'none';
        } else {
          // Obtener el arreglo de faltas pendientes desde la tabla datos_localstorage
          const faltasPendientes = await obtenerFaltasPendientes(idAsistenciaCuadrilla);

          // Verificar si el ID del detalle de asistencia está en las faltas pendientes
          if (faltasPendientes.includes(idDetalleAsistencia)) {
            radioInasistencia.style.backgroundColor = 'red';
            radioInasistencia.style.borderColor = 'red';
            falta.style.display = 'none';
          }
        }
      }
    }
  });
}
// Función para reflejar las asistencias en los radiobuttons de los empleados
function reflejarAsistencias(empleados, asistencias) {
  const radiosAsistencias = document.querySelectorAll('input[type="radio"][value="asistencia"]');
  const radiosInasistencias = document.querySelectorAll('input[type="radio"][value="inasistencia"]');
  console.log('Asistencias: ', asistencias);
  empleados.forEach((empleado, index) => {
    console.log(index);
    const radioAsistencia = radiosAsistencias[index];
    const radioInasistencia = radiosInasistencias[index];
    console.log('Asistencia del empleado: '+empleado.nombre+''+empleado.apellido_paterno+' '+asistencias[empleado.id]);
    if (asistencias[empleado.id] === 1) {
      radioAsistencia.checked = true;
    } else if (asistencias[empleado.id] === 0) {
      radioInasistencia.checked = true;
    }
  });
}


// Función para obtener la fecha de la última asistencia guardada desde la base de datos
async function obtenerFechaUltimaAsistencia(idAsistenciaCuadrilla) {
  try {
    const response = await fetch(`/obtener-fecha-ultima-asistencia/${idAsistenciaCuadrilla}`);
    const data = await response.json();
    return data.fechaUltimaAsistencia;
  } catch (error) {
    console.error('Error al obtener la fecha de la última asistencia:', error);
    return null;
  }
}

// Función para guardar la fecha de la última asistencia en la base de datos
async function guardarFechaUltimaAsistencia(fecha, idAsistenciaCuadrilla) {
  try {
    await fetch('/guardar-fecha-ultima-asistencia', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ llave: `fechaUltimaAsistencia_${idAsistenciaCuadrilla}`, valor: fecha, idAsistenciaCuadrilla: idAsistenciaCuadrilla })
    });
  } catch (error) {
    console.error('Error al guardar la fecha de la última asistencia:', error);
  }
}
// Función para obtener las asistencias de los empleados de una cuadrilla
async function obtenerAsistenciasEmpleados(idCuadrilla, fechaAsistencia) {
  try {
    const response = await fetch(`/obtener-asistencias-empleados/${idCuadrilla}/${fechaAsistencia}`);
    const data = await response.json();
    return data[0];
  } catch (error) {
    console.error('Error al obtener las asistencias de los empleados:', error);
    return [];
  }
}

//Función para guardar el ID de la cuadrilla después de tomar asistencia:
async function guardarAsistenciaCuadrilla(idCuadrilla, idAsistenciaCuadrilla, fechaAsistencia) {
  try {
    await fetch('/guardar-asistencia-cuadrilla', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ llave: `asistenciaCuadrilla_${idAsistenciaCuadrilla}`, valor: idCuadrilla, idAsistenciaCuadrilla: idAsistenciaCuadrilla, fechaAsistencia: fechaAsistencia})
    });
  } catch (error) {
    console.error('Error al guardar la asistencia de la cuadrilla:', error);
  }
}

async function obtenerAsistenciaCuadrilla(idCuadrilla, idAsistenciaCuadrilla) {
  try {
    console.log("ID Cuadrilla: ",idCuadrilla);
    const response = await fetch(`/obtener-asistencia-cuadrilla?idCuadrilla=${idCuadrilla}&idAsistenciaCuadrilla=${idAsistenciaCuadrilla}`);
    const data = await response.json();
    return data.asistenciaCuadrilla;
  } catch (error) {
    console.error('Error al obtener la asistencia de la cuadrilla:', error);
    return null;
  }
}




// Función para verificar si se debe habilitar o inhabilitar el botón de guardar
async function verificarBotonGuardar() {
  const fechaActual = obtenerFechaActualChihuahua();
  const idAsistenciaCuadrilla = await obtenerIdAsistenciaCuadrilla(idCuadrilla, fechaActual);
  const fechaUltimaAsistencia = await obtenerFechaUltimaAsistencia(idAsistenciaCuadrilla);
 
  const botonGuardar = document.querySelector('.btn-guardar');

  if (fechaUltimaAsistencia === fechaActual) {
    botonGuardar.disabled = true;
  } else {
    botonGuardar.disabled = false;
  }
}

async function verificarAsistenciaCuadrilla(idCuadrilla, fechaActual) {
  try {
    
    const fechaAsistencia = obtenerFechaActualChihuahua();
    const idAsistenciaCuadrilla = await obtenerIdAsistenciaCuadrilla(idCuadrilla, fechaAsistencia) || null;
    const fechaUltimaAsistencia = await obtenerFechaUltimaAsistencia(idAsistenciaCuadrilla) || null;
    const asistenciaCuadrilla = await obtenerAsistenciaCuadrilla(idCuadrilla, idAsistenciaCuadrilla) || null;
    console.log('fechaUltimaAsistencia: ',fechaUltimaAsistencia);
    console.log('asistenciaCuadrilla: ',asistenciaCuadrilla);
    if (fechaUltimaAsistencia === fechaActual && asistenciaCuadrilla === idCuadrilla) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error al verificar la asistencia de la cuadrilla:', error);
    return false;
  }
}

//Funcion que compara la fecha actual con la fecha de la última asistencia (esta ultima almacenada en la tabla datos_localstorage)
async function verificarFechaAsistencia() {
  try {
    const idCuadrilla = cuadrillasSelect.value; 
    const fechaActual = obtenerFechaActualChihuahua();
    const fechaUltimaAsistenciaCuadrilla = await obtenerUltimaAsistenciaCuadrilla(idCuadrilla);
    const idAsistenciaCuadrilla = await obtenerIdAsistenciaCuadrilla(idCuadrilla,fechaUltimaAsistenciaCuadrilla);
    const fechaUltimaAsistencia = await obtenerFechaUltimaAsistencia(idAsistenciaCuadrilla);
    console.log('fechaUltimaAsistencia: ',fechaUltimaAsistencia);
    console.log('fechaActual: ',fechaUltimaAsistenciaCuadrilla);
    if (fechaUltimaAsistencia !== fechaActual) {
      await eliminarFechaUltimaAsistencia(idAsistenciaCuadrilla);
      await eliminarAsistenciaCuadrilla(idAsistenciaCuadrilla);
      await eliminarUltimaAsistenciaCuadrilla(idCuadrilla);
      document.getElementById('btnTerminarTurno').disabled = true;
    }
  } catch (error) {
    console.error('Error al verificar la fecha de asistencia:', error);
  }
}

async function eliminarFechaUltimaAsistencia(idAsistenciaCuadrilla) {
  try {
    await fetch(`/eliminar-fecha-ultima-asistencia/${idAsistenciaCuadrilla}`, {
      method: 'DELETE'
    });
  } catch (error) {
    console.error('Error al eliminar la fecha de la última asistencia:', error);
  }
}

async function eliminarAsistenciaCuadrilla(idAsistenciaCuadrilla) {
  try {
    await fetch(`/eliminar-asistencia-cuadrilla/${idAsistenciaCuadrilla}`, {
      method: 'DELETE'
    });
  } catch (error) {
    console.error('Error al eliminar la asistencia de la cuadrilla:', error);
  }
}

async function eliminarUltimaAsistenciaCuadrilla(idCuadrilla){
  try{

    await fetch(`/eliminar-ultima-asistencia-cuadrilla/${idCuadrilla}`, {
      method: 'DELETE'
    });
    
  }catch(error){
    console.error('Error al eliminar la ultima asistencia de la cuadrilla:', error);
  }
}


// Función para obtener las justificaciones desde la base de datos
async function obtenerJustificaciones(idDetalleAsistencia) {
  try {
    const response = await fetch(`/obtener-justificaciones/${idDetalleAsistencia}`);
    const justificaciones = await response.json();
    return justificaciones;
  } catch (error) {
    console.error('Error al obtener las justificaciones:', error);
    return [];
  }
}

// Función para obtener las faltas desde la base de datos
async function obtenerFaltas(idDetalleAsistencia) {
  try {
    const respuesta = await fetch(`/obtener-faltas/${idDetalleAsistencia}`);
    const faltas = await respuesta.json();
    return faltas;
  } catch (error) {
    console.error('Error al obtener las faltas:', error);
    return [];
  }
}

// Función para actualizar el arreglo de justificaciones en la tabla datos_localstorage
async function actualizarJustificaciones(justificaciones, idAsistenciaCuadrilla) {
  try {
    await fetch('/actualizar-justificaciones', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ llave: `justificacionesEmpleados_${idAsistenciaCuadrilla}`, valor: JSON.stringify(justificaciones) })
    });
  } catch (error) {
    console.error('Error al actualizar las justificaciones:', error);
  }
}


// Función para actualizar el arreglo de faltas en la tabla datos_localstorage
async function actualizarFaltas(faltas, idAsistenciaCuadrilla) {
  try {
    await fetch('/actualizar-faltas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ llave: `faltasEmpleados_${idAsistenciaCuadrilla}`, valor: JSON.stringify(faltas) })
    });
  } catch (error) {
    console.error('Error al actualizar las faltas:', error);
  }
}


// Función para obtener las justificaciones existentes desde la tabla datos_localstorage
async function obtenerJustificacionesExistentes(idAsistenciaCuadrilla) {
  try {
    const respuesta = await fetch(`/obtener-justificaciones-existentes/${idAsistenciaCuadrilla}`);
    const justificacionesExistentes = await respuesta.json();
    return justificacionesExistentes.length > 0;
  } catch (error) {
    console.error('Error al obtener las justificaciones existentes:', error);
    return false;
  }
}

// Función para obtener las faltas existentes desde la tabla datos_localstorage
async function obtenerFaltasExistentes(idAsistenciaCuadrilla) {
  try {
    const respuesta = await fetch(`/obtener-faltas-existentes/${idAsistenciaCuadrilla}`);
    const faltasExistentes = await respuesta.json();
    return faltasExistentes.length > 0;
  } catch (error) {
    console.error('Error al obtener las faltas existentes:', error);
    return false;
  }
}

// Función para crear el arreglo de justificaciones en la tabla datos_localstorage
async function crearJustificaciones(justificaciones, idAsistenciaCuadrilla, fecha) {
  try {
    await fetch('/crear-justificaciones', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ llave: `justificacionesEmpleados_${idAsistenciaCuadrilla}`, valor: JSON.stringify(justificaciones), idAsistenciaCuadrilla: idAsistenciaCuadrilla, fecha: fecha })
    });
  } catch (error) {
    console.error('Error al crear las justificaciones:', error);
  }
}

// Función para crear el arreglo de faltas en la tabla datos_localstorage
async function crearFaltas(faltas, idAsistenciaCuadrilla, fecha) {
  try {
    await fetch('/crear-faltas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ llave: `faltasEmpleados_${idAsistenciaCuadrilla}`, valor: JSON.stringify(faltas), idAsistenciaCuadrilla: idAsistenciaCuadrilla, fecha: fecha })
    });
  } catch (error) {
    console.error('Error al crear las faltas:', error);
  }
}


async function obtenerDetallesAsistenciaCuadrilla(idCuadrilla, fechaAsistencia) {
  try {
    const response = await fetch(`/obtener-detalles-asistencia-cuadrilla/${idCuadrilla}/${fechaAsistencia}`);
    const detallesAsistencia = await response.json();
    return detallesAsistencia;
  } catch (error) {
    console.error('Error al obtener los detalles de asistencia de la cuadrilla:', error);
    return [];
  }
}



async function guardarIdDetallesCuadrilla(detallesAsistencia, idAsistenciaCuadrilla, fechaAsistencia) {
  try {
    await fetch('/guardar-id-detalles-cuadrilla', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ llave: `idDetallesCuadrilla_${idAsistenciaCuadrilla}`, valor: JSON.stringify(detallesAsistencia), idAsistenciaCuadrilla: idAsistenciaCuadrilla, fechaAsistencia: fechaAsistencia })
    });
  } catch (error) {
    console.error('Error al guardar los ID de detalles de cuadrilla:', error);
  }
}


async function obtenerIdDetallesCuadrilla(idAsistenciaCuadrilla) {
  try {
    const response = await fetch(`/obtener-id-detalles-cuadrilla/${idAsistenciaCuadrilla}`);
    const data = await response.json();
    return JSON.parse(data.valor);
  } catch (error) {
    console.error('Error al obtener los ID de detalles de cuadrilla:', error);
    return null;
  }
}

async function obtenerIdAsistenciaCuadrilla(idCuadrilla, fechaActual) {
  try {
    const response = await fetch(`/obtener-id-asistencia-cuadrilla/${idCuadrilla}/${fechaActual}`);
    const data = await response.json();
    return data.idAsistenciaCuadrilla;
  } catch (error) {
    console.error('Error al obtener el ID de asistencia de cuadrilla:', error);
    return null;
  }
}

//Funcion para obtener la fecha en formato de Chihuahua
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

async function guardarUltimaAsistenciaCuadrilla(idCuadrilla, fecha, idAsistenciaCuadrilla){
  try{
    await fetch('/guardar-ultima-asistencia-cuadrilla', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ llave: `ultimaAsistenciaCuadrilla_${idCuadrilla}`, valor: fecha, idAsistenciaCuadrilla: idAsistenciaCuadrilla })
    });


  }catch{
    console.error('Error al guardar la ultima asistencia de la cuadrilla:', error);
  }
}


async function obtenerUltimaAsistenciaCuadrilla(idCuadrilla){
  try {
    const response = await fetch(`/obtener-ultima-asistencia-cuadrilla/${idCuadrilla}`);
    const data = await response.json();
    return data.fechaUltimaAsistenciaCuadrilla;
  } catch (error) {
    console.error('Error al obtener el ID de asistencia de cuadrilla:', error);
    return null;
  }
}



//Logica para guardar las asistencias

document.querySelector('.btn-guardar').addEventListener('click', async function() {
  const idCuadrilla = document.getElementById('cuadrillas-select').value;
  
  // Obtener los nombres únicos de los radiobuttons de la cuadrilla seleccionada
  const nombres = new Set();
  const radios = document.querySelectorAll(`input[type="radio"][data-cuadrilla="${idCuadrilla}"]`);
  radios.forEach(radio => {
    nombres.add(radio.name);
  });

  
  const radiosInasistencia = document.querySelectorAll(`input[type="radio"][data-cuadrilla="${idCuadrilla}"][value="inasistencia"]:checked`);
  const todosInasistencia = radiosInasistencia.length === radios.length / 2;

  console.log('radiosInasistencia: ',radiosInasistencia.length);
  

  // Verificar que al menos un radiobutton esté seleccionado por cada empleado
  const todosSeleccionados = Array.from(nombres).every(nombre => {
    const radioButtons = document.querySelectorAll(`input[type="radio"][name="${nombre}"]`);
    return Array.from(radioButtons).some(radio => radio.checked);
  });

  if (!todosSeleccionados) {
    Swal.fire({
      title: 'Campos incompletos',
      text: 'Por favor, seleccione la asistencia o inasistencia de todos los empleados de la cuadrilla.',
      icon: 'warning'
    });
    return;
  }

  if (todosInasistencia) {
    // Si todos los empleados tienen inasistencia
    const idProyecto = document.getElementById('proyectos-select').value;
    const fechaAsistencia = obtenerFechaActualChihuahua();
    const horaInicio = document.getElementById('hora-inicio').value;
    const horaFin = document.getElementById('hora-fin').value;
    
    document.getElementById('loading-overlay').style.display = 'flex';
    document.getElementById('p-animacion').textContent = 'Guardando Asistencia...';
    // Crear la asistencia de cuadrilla
    await fetch('/crear-asistencia-cuadrilla', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        idProyecto,
        idCuadrilla,
        horaInicio,
        horaFin,
        fechaAsistencia
      })
    })
    .then(response => response.json())
    .then(async data => {
      const idAsistenciaCuadrilla = data.id;
      console.log("DataID: ", idAsistenciaCuadrilla);
      // Crear los detalles de asistencia de cuadrilla con inasistencia para todos los empleados
      const detallesAsistencia = Array.from(radiosInasistencia).map(radio => ({
        idAsistenciaCuadrilla,
        idEmpleado: radio.name.split('-')[1],
        asistencia: 0,
        horaEntrada: null
      }));

      await fetch('/crear-detalles-asistencia-cuadrilla', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(detallesAsistencia)
      })
      .then(response => response.json())
      .then(async data => {

          const idAsistenciaCuadrilla = data.idAsistenciaCuadrilla;

          // Obtener los detalles de asistencia de la cuadrilla desde la base de datos
          const detallesAsistencia = await obtenerDetallesAsistenciaCuadrilla(idCuadrilla, fechaAsistencia);

          // Asignar el data-idDetalleCuadrilla a cada radiobutton de inasistencia
          detallesAsistencia.forEach(detalle => {
            const radioInasistencia = document.querySelector(`input[type="radio"][name="asistencia-${detalle.id_empleado}"][value="inasistencia"]`);
            radioInasistencia.dataset.idDetalleAsistencia = detalle.id;
            radioInasistencia.dataset.idAsistenciaCuadrilla = idAsistenciaCuadrilla;
          });

          // Guardar los valores de data-idDetalleCuadrilla en la tabla datos_localstorage
          await guardarIdDetallesCuadrilla(detallesAsistencia, idAsistenciaCuadrilla, fechaAsistencia);

          document.getElementById('loading-overlay').style.display = 'none';

        await Swal.fire({
          title: 'Asistencia Guardada',
          text: 'La asistencia fue registrada exitosamente',
          icon: 'success'
        }).then(async result => {
            // Obtener las asistencias y los datos de los empleados desde la base de datos
            const empleadosConAsistencias = await obtenerAsistenciasEmpleados(idCuadrilla, fechaAsistencia);
            const idAsistenciaCuadrilla = await obtenerIdAsistenciaCuadrilla(idCuadrilla, fechaAsistencia);
            // Convertir el arreglo de empleados con asistencias en un objeto con el ID del empleado como clave
            const asistenciasPorEmpleado = empleadosConAsistencias.reduce((obj, empleado) => {
              obj[empleado.id] = empleado.asistencia;
              return obj;
            }, {});

            console.log('Empleados con Asistencias: ',empleadosConAsistencias);
            // Reflejar las asistencias en los radiobuttons de los empleados
          
            console.log('Asistencias por empleado: ',asistenciasPorEmpleado);
            reflejarAsistencias(empleadosConAsistencias, asistenciasPorEmpleado);

            // Mostrar los logotipos de justificación en los empleados con inasistencia
            mostrarLogotiposJustificacion(empleadosConAsistencias, asistenciasPorEmpleado);

            // Guardar la fecha de la última asistencia en la base de datos
            await guardarFechaUltimaAsistencia(fechaAsistencia, idAsistenciaCuadrilla);

            //Guardar el id de la cuadrilla a la cual se le tomo asistencia
            await guardarAsistenciaCuadrilla(idCuadrilla, idAsistenciaCuadrilla, fechaAsistencia);

            await guardarUltimaAsistenciaCuadrilla(idCuadrilla, fechaAsistencia, idAsistenciaCuadrilla);

            //Inhabilitar los inputs de tipo time de la hora de inicio y la hora de fin
            document.getElementById('hora-inicio').disabled = true;
            document.getElementById('hora-fin').disabled = true;

            // Inhabilitar el botón de guardar
            document.querySelector('.btn-guardar').disabled = true;
            
            const radioButtons = document.querySelectorAll('input[type="radio"]');

            radioButtons.forEach(radio =>{
              radio.disabled = true;
            })
                    
            document.getElementById('btnTerminarTurno').disabled = false;
            
        });
      })
      .catch(error => {
        console.error('Error al crear los detalles de asistencia de cuadrilla:', error);
      });
    })
    .catch(error => {
      console.error('Error al crear la asistencia de cuadrilla:', error);
    });
    return;
  }

  Swal.fire({
    title: '¿Todos los empleados llegaron a tiempo?',
    icon: 'question',
    confirmButtonText: 'Sí',
    cancelButtonText: 'No',
    showCancelButton: true
  }).then(async (result) => {
    if (result.isConfirmed) {
      // Si todos los empleados llegaron a tiempo
      const idProyecto = document.getElementById('proyectos-select').value;
      const idCuadrilla = document.getElementById('cuadrillas-select').value;
      const fechaAsistencia = obtenerFechaActualChihuahua();
      const horaInicio = document.getElementById('hora-inicio').value;
      const horaFin = document.getElementById('hora-fin').value;
      // Obtener las asistencias de los empleados
      const horasEntrada = {};
      const asistencias = {};
      const radios = document.querySelectorAll(`input[type="radio"][data-cuadrilla="${idCuadrilla}"]:checked`);
      radios.forEach(radio => {
        const idEmpleado = radio.name.split('-')[1];
        const asistencia = radio.value === 'asistencia' ? 1 : 0;
        asistencias[idEmpleado] = asistencia;

        if (asistencia === 1) {
          horasEntrada[idEmpleado] = document.getElementById('hora-inicio').value;
        }
      });

      document.getElementById('loading-overlay').style.display = 'flex';
      document.getElementById('p-animacion').textContent = 'Guardando Asistencia...';
      // Crear la asistencia de cuadrilla
      await fetch('/crear-asistencia-cuadrilla', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          idProyecto,
          idCuadrilla,
          horaInicio,
          horaFin,
          fechaAsistencia
        })
      })
      .then(response => response.json())
      .then(async data => {
        
        const idAsistenciaCuadrilla = data.id;
        const horaInicioJornada = document.getElementById('hora-inicio').value
        // Crear los detalles de asistencia de cuadrilla
        const detallesAsistencia = Object.entries(asistencias).map(([idEmpleado, asistencia]) => {
          const horaEntrada = asistencia === 1 ? (horasEntrada[idEmpleado] || horaInicioJornada) : null;
          return {
            idAsistenciaCuadrilla,
            idEmpleado,
            asistencia,
            horaEntrada
          };
        });

        console.log(detallesAsistencia);

        await fetch('/crear-detalles-asistencia-cuadrilla', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(detallesAsistencia)
        })
        .then(response => response.json())
        .then(async data => {

          const idAsistenciaCuadrilla = data.idAsistenciaCuadrilla;

          // Obtener los detalles de asistencia de la cuadrilla desde la base de datos
          const detallesAsistencia = await obtenerDetallesAsistenciaCuadrilla(idCuadrilla, fechaAsistencia);

          // Asignar el data-idDetalleCuadrilla a cada radiobutton de inasistencia
          detallesAsistencia.forEach(detalle => {
            const radioInasistencia = document.querySelector(`input[type="radio"][name="asistencia-${detalle.id_empleado}"][value="inasistencia"]`);
            radioInasistencia.dataset.idDetalleAsistencia = detalle.id;
            radioInasistencia.dataset.idAsistenciaCuadrilla = idAsistenciaCuadrilla;
          });

          // Guardar los valores de data-idDetalleCuadrilla en la tabla datos_localstorage
          const horaInicio = document.getElementById('hora-inicio').value;
          await guardarIdDetallesCuadrilla(detallesAsistencia, idAsistenciaCuadrilla, fechaAsistencia);

          document.getElementById('loading-overlay').style.display = 'none';
          

          Swal.fire({
            title: 'Asistencia Guardada',
            text: `La asistencia se registró a las ${horaInicio}.`,
            icon: 'success'
          }).then(async (result) => {

            // Obtener las asistencias y los datos de los empleados desde la base de datos
            const empleadosConAsistencias = await obtenerAsistenciasEmpleados(idCuadrilla, fechaAsistencia);
            const idAsistenciaCuadrilla = await obtenerIdAsistenciaCuadrilla(idCuadrilla, fechaAsistencia);
            // Convertir el arreglo de empleados con asistencias en un objeto con el ID del empleado como clave
            const asistenciasPorEmpleado = empleadosConAsistencias.reduce((obj, empleado) => {
              obj[empleado.id] = empleado.asistencia;
              return obj;
            }, {});

            console.log('Empleados con Asistencias: ',empleadosConAsistencias);
            // Reflejar las asistencias en los radiobuttons de los empleados
          
            console.log('Asistencias por empleado: ',asistenciasPorEmpleado);
            reflejarAsistencias(empleadosConAsistencias, asistenciasPorEmpleado);

            // Mostrar los logotipos de justificación en los empleados con inasistencia
            mostrarLogotiposJustificacion(empleadosConAsistencias, asistenciasPorEmpleado);

            // Guardar la fecha de la última asistencia en la base de datos
            await guardarFechaUltimaAsistencia(fechaAsistencia, idAsistenciaCuadrilla);


            //Guardar el id de la cuadrilla a la cual se le tomo asistencia
            await guardarAsistenciaCuadrilla(idCuadrilla, idAsistenciaCuadrilla, fechaAsistencia);

            await guardarUltimaAsistenciaCuadrilla(idCuadrilla, fechaAsistencia, idAsistenciaCuadrilla);

             //Inhabilitar los inputs de tipo time de la hora de inicio y la hora de fin
             document.getElementById('hora-inicio').disabled = true;
             document.getElementById('hora-fin').disabled = true;

            // Inhabilitar el botón de guardar
            document.querySelector('.btn-guardar').disabled = true;
            
            const radioButtons = document.querySelectorAll('input[type="radio"]');

            radioButtons.forEach(radio =>{
              radio.disabled = true;
            })
                    
            document.getElementById('btnTerminarTurno').disabled = false;
          });
        })
        .catch(error => {
          console.error('Error al crear los detalles de asistencia de cuadrilla:', error);
        });
      })
      .catch(error => {
        console.error('Error al crear la asistencia de cuadrilla:', error);
      });
    }else if(result.dismiss === Swal.DismissReason.cancel) {
      // Si no todos los empleados llegaron a tiempo, mostrar la modal para establecer horas de entrada
      var modal = document.getElementById('modal');
     

      // Obtener los empleados con asistencia
      const empleadosConAsistencia = [];
      const radios = document.querySelectorAll('input[type="radio"]:checked');
      console.log(radios.length);
      radios.forEach(radio => {
        if (radio.value === 'asistencia') {
          const idEmpleado = radio.name.split('-')[1];
          const empleadoNombre = radio.dataset.nombre;
          empleadosConAsistencia.push({ id: idEmpleado, nombre: empleadoNombre });
          console.log(empleadosConAsistencia);
        }
      });
      console.log(empleadosConAsistencia);
     // Generar el contenido de la modal con los empleados con asistencia
    const modalContent = document.querySelector('.modal-content');

    modalContent.innerHTML = `
      <h2>Seleccione los empleados que llegaron tarde</h2>
      ${empleadosConAsistencia.map(empleado => `
        <div class="empleado">
          <div class="nombres">
            <input type="checkbox" id="empleado-${empleado.id}" name="empleado-${empleado.id}" onchange="toggleInput('empleado-${empleado.id}', 'hora-${empleado.id}')">
            <label for="empleado-${empleado.id}">${empleado.nombre}</label>
          </div>
          <div class="horas">
            <input type="time" id="hora-${empleado.id}" name="hora-${empleado.id}">
          </div>
        </div>
      `).join('')}
      <button id="confirmar">Confirmar</button>
    `;

    // Ocultar los inputs de hora al cargar la modal
    var inputs = document.querySelectorAll('#modal input[type="time"]');
    inputs.forEach(input => {
      input.style.display = "none";
    });

    // Deshabilitar el botón de confirmar al cargar la modal
    document.getElementById('confirmar').disabled = true;

    
   // Habilitar el botón de confirmar cuando se asigne una hora de entrada válida de al menos un empleado
   function toggleConfirmarButton() {
    const checkboxes = document.querySelectorAll('#modal input[type="checkbox"]');
    const timeInputs = document.querySelectorAll('#modal input[type="time"]');
    const horaInicio = document.getElementById('hora-inicio').value;
    const horaFin = document.getElementById('hora-fin').value;
    let horaAsignada = false;
    let horaInvalida = false;
  
    checkboxes.forEach((checkbox, index) => {
      const horaEntrada = timeInputs[index].value;
  
      if (checkbox.checked && horaEntrada && horaEntrada >= horaInicio && horaEntrada < horaFin) {
        horaAsignada = true;
      } else if (checkbox.checked && horaEntrada) {
        horaInvalida = true;
        if (horaEntrada < horaInicio) {
          Swal.fire('Error', 'La hora ingresada debe ser mayor o igual a la hora de inicio de la jornada', 'error');
        } else if (horaEntrada >= horaFin) {
          Swal.fire('Error', 'La hora ingresada debe ser menor a la hora de fin de la jornada', 'error');
        }
      }
    });
  
    document.getElementById('confirmar').disabled = !horaAsignada || horaInvalida;
  }
    // Agregar evento onchange a los checkboxes y los inputs de hora
    const checkboxes = document.querySelectorAll('#modal input[type="checkbox"]');
    const timeInputs = document.querySelectorAll('#modal input[type="time"]');

    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', toggleConfirmarButton);
    });

    timeInputs.forEach(input => {
      input.addEventListener('change', toggleConfirmarButton);
    });


    modal.style.display = 'block';
      // Evento de clic en el botón de confirmación de la modal
      document.getElementById('confirmar').addEventListener('click', async function() {
        const idProyecto = document.getElementById('proyectos-select').value;
        const idCuadrilla = document.getElementById('cuadrillas-select').value;
        const fechaAsistencia = obtenerFechaActualChihuahua(); // Fecha actual en formato YYYY-MM-DD
        const horaInicio = document.getElementById('hora-inicio').value;
        const horaFin = document.getElementById('hora-fin').value;
        // Obtener las asistencias y horas de entrada de los empleados
        const asistencias = {};
        const horasEntrada = {};
        const radios = document.querySelectorAll('input[type="radio"]:checked');
        radios.forEach(radio => {
          const idEmpleado = radio.name.split('-')[1];
          const asistencia = radio.value === 'asistencia' ? 1 : 0;
          asistencias[idEmpleado] = asistencia;

          if (asistencia === 1) {
            const horaEntrada = document.getElementById(`hora-${idEmpleado}`).value || document.getElementById('hora-inicio').value;
            horasEntrada[idEmpleado] = horaEntrada;
          }
        });

        document.getElementById('loading-overlay').style.display = 'flex';
        document.getElementById('p-animacion').textContent = 'Guardando Asistencia...'

        // Crear la asistencia de cuadrilla
        await fetch('/crear-asistencia-cuadrilla', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            idProyecto,
            idCuadrilla,
            horaInicio,
            horaFin,
            fechaAsistencia
          })
        })
        .then(response => response.json())
        .then(async data => {
          const idAsistenciaCuadrilla = data.id;
          const horaInicioJornada = document.getElementById('hora-inicio').value;
          // Crear los detalles de asistencia de cuadrilla
          const detallesAsistencia = Object.entries(asistencias).map(([idEmpleado, asistencia]) => {
            const horaEntrada = asistencia === 1 ? (horasEntrada[idEmpleado] || horaInicioJornada) : null;
            return {
              idAsistenciaCuadrilla,
              idEmpleado,
              asistencia,
              horaEntrada
            };
          });

          await  fetch('/crear-detalles-asistencia-cuadrilla', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(detallesAsistencia)
          })
          .then(response => response.json())
          .then(async data => {

            const idAsistenciaCuadrilla = data.idAsistenciaCuadrilla;

            // Obtener los detalles de asistencia de la cuadrilla desde la base de datos
            const detallesAsistencia = await obtenerDetallesAsistenciaCuadrilla(idCuadrilla, fechaAsistencia);
  
            // Asignar el data-idDetalleCuadrilla a cada radiobutton de inasistencia
            detallesAsistencia.forEach(detalle => {
              const radioInasistencia = document.querySelector(`input[type="radio"][name="asistencia-${detalle.id_empleado}"][value="inasistencia"]`);
              radioInasistencia.dataset.idDetalleAsistencia = detalle.id;
              radioInasistencia.dataset.idAsistenciaCuadrilla = idAsistenciaCuadrilla;
            });
  
            // Guardar los valores de data-idDetalleCuadrilla en la tabla datos_localstorage
            await guardarIdDetallesCuadrilla(detallesAsistencia, idAsistenciaCuadrilla, fechaAsistencia);

            document.getElementById('loading-overlay').style.display = 'none';
            
            Swal.fire({
              title: 'Asistencia Guardada',
              text: 'La asistencia se registró correctamente',
              icon: 'success'
            }).then(async (result) => {
             // Obtener las asistencias y los datos de los empleados desde la base de datos
             const empleadosConAsistencias = await obtenerAsistenciasEmpleados(idCuadrilla, fechaAsistencia);
             const idAsistenciaCuadrilla = await obtenerIdAsistenciaCuadrilla(idCuadrilla, fechaAsistencia);
             // Convertir el arreglo de empleados con asistencias en un objeto con el ID del empleado como clave
             const asistenciasPorEmpleado = empleadosConAsistencias.reduce((obj, empleado) => {
               obj[empleado.id] = empleado.asistencia;
               return obj;
             }, {});
 
             console.log('Empleados con Asistencias: ',empleadosConAsistencias);
             // Reflejar las asistencias en los radiobuttons de los empleados
           
             console.log('Asistencias por empleado: ',asistenciasPorEmpleado);
             reflejarAsistencias(empleadosConAsistencias, asistenciasPorEmpleado);
 
             // Mostrar los logotipos de justificación en los empleados con inasistencia
             mostrarLogotiposJustificacion(empleadosConAsistencias, asistenciasPorEmpleado);
 
             // Guardar la fecha de la última asistencia en la base de datos
             await guardarFechaUltimaAsistencia(fechaAsistencia, idAsistenciaCuadrilla);
 
             //Guardar el id de la cuadrilla a la cual se le tomo asistencia
             await guardarAsistenciaCuadrilla(idCuadrilla, idAsistenciaCuadrilla, fechaAsistencia);

            await guardarUltimaAsistenciaCuadrilla(idCuadrilla, fechaAsistencia, idAsistenciaCuadrilla);

              //Inhabilitar los inputs de tipo time de la hora de inicio y la hora de fin
            document.getElementById('hora-inicio').disabled = true;
            document.getElementById('hora-fin').disabled = true;
 
             // Inhabilitar el botón de guardar
             document.querySelector('.btn-guardar').disabled = true;
             
             const radioButtons = document.querySelectorAll('input[type="radio"]');
 
             radioButtons.forEach(radio =>{
               radio.disabled = true;
             })
                     
             document.getElementById('btnTerminarTurno').disabled = false;
              
            });
          })
          .catch(error => {
            console.error('Error al crear los detalles de asistencia de cuadrilla:', error);
          });
        })
        .catch(error => {
          console.error('Error al crear la asistencia de cuadrilla:', error);
        });

        modal.style.display = 'none';
      
      });
    }else{
      return;
    }
  });
    // Verificar al cargar la página si se debe habilitar o inhabilitar el botón de guardar
    window.addEventListener('load', verificarBotonGuardar);
});

// Función para mostrar u ocultar los inputs de hora de entrada
function toggleInput(checkboxId, inputId) {
  var checkbox = document.getElementById(checkboxId);
  var input = document.getElementById(inputId);
  input.style.display = checkbox.checked ? 'block' : 'none';
}


        ///Función para abrir la pantalla modal de Justificación
        function abrirModalJustificacion(idEmpleado, idDetalleAsistencia, idAsistenciaCuadrilla) {
          const modal3 = document.getElementById('modal3');
          modal3.style.display = 'block';
          const textarea = document.getElementById('descripcion');
          textarea.disabled = true;
          btn_Terminar.dataset.id = idEmpleado;
          btn_Terminar.dataset.idDetalleAsistencia = idDetalleAsistencia;
          btn_Terminar.dataset.idAsistenciaCuadrilla = idAsistenciaCuadrilla;
          console.log('idDetalleAsistencia: ',idDetalleAsistencia);
          }


        //Mostrar u ocultar los inputs de la hora de llegada
        function toggleInput(checkboxId,id) {
            var input = document.getElementById(id);
            var checkbox = document.getElementById(checkboxId); 
            if (checkbox.checked) {
            input.style.display = "block";
            } else {
            input.style.display = "none";
            }
        }




/////Checkbox Justificación


// Obtener elementos
const checkJustificado = document.getElementById('justificada');
const checkNoJustificado = document.getElementById('no-justificada');
const textarea = document.getElementById('descripcion');

checkJustificado.addEventListener('click', alternarChecks);
checkNoJustificado.addEventListener('click', alternarChecks);


// Controlar estado  
function alternarChecks(evento) {

  const check = evento.target;
  check.checked = true; 

  if(check === checkJustificado ) {  
    checkNoJustificado.checked = false;
    textarea.disabled = false;

  } else if(check === checkNoJustificado) {
    checkJustificado.checked = false;
    textarea.disabled = true;
    textarea.value = "";
  
  }

}

        ///Si alguno de los checkboxes no esta seleccionado deshabilitar el boton de Terminar

        // Agregar evento click a checkboxes
        const justificado = document.getElementById('justificada');
        const noJustificado = document.getElementById('no-justificada');

        justificado.addEventListener("click", habilitarBtn);
        noJustificado.addEventListener("click", habilitarBtn);

        const btn_Terminar = document.querySelector('#modal3 button');
        btn_Terminar.disabled = true;
        const area = document.querySelector("#descripcion");
        area.addEventListener("keyup", validarTextArea);

        function habilitarBtn(evento) {

          const check = evento.target; 
          check.checked = true;

        if(check === justificado){
          validarTextArea();
        }else if(check === noJustificado){
          btn_Terminar.disabled = false;
        }
      }

      function validarTextArea() {

        if(textarea.value.trim().length > 0) {  
          btn_Terminar.disabled = false;
      
        } else {
          btn_Terminar.disabled = true;
        }
      
      }

//////////////Abrir Explorador de Archivos Adjuntar Evidencia

// Función para cambiar el logo y la etiqueta después de cargar un archivo
function cambiarIconoEtiqueta() {
  adjuntarIcono.textContent = 'edit';
  adjuntarEtiqueta.textContent = 'Cambiar Evidencia';
}

// Detectar si el sistema se está utilizando en un dispositivo móvil
function esMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Abrir el modal de selección de evidencia en dispositivos móviles
document.getElementById('adjuntar').addEventListener('click', () => {
  if (esMobileDevice()) {
    document.getElementById('modal-evidencia').style.display = 'block';
  } else {
    document.getElementById('file-input').click();
  }
});

// Manejar la selección de subir archivo en el modal de evidencia
document.getElementById('opcion-archivo').addEventListener('click', () => {
  document.getElementById('file-input').click();
  document.getElementById('modal-evidencia').style.display = 'none';
});


document.getElementById('opcion-fotografia').addEventListener('click', () => {
  const videoElement = document.createElement('video');
  const canvasElement = document.createElement('canvas');
  const captureButton = document.createElement('button');
  captureButton.textContent = 'Capturar';
  
  navigator.mediaDevices.getUserMedia({ video: true })
    .then((stream) => {
      videoElement.srcObject = stream;
      videoElement.play();
      
      // Mostrar la vista previa de la cámara
      document.body.appendChild(videoElement);
      document.body.appendChild(captureButton);
      
      captureButton.addEventListener('click', () => {
        canvasElement.width = videoElement.videoWidth;
        canvasElement.height = videoElement.videoHeight;
        canvasElement.getContext('2d').drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
        
        // Obtener la fotografía capturada como un archivo Blob
        canvasElement.toBlob((blob) => {
          fotoCapturada = new File([blob], 'fotografia.png', { type: 'image/png' });
          cambiarIconoEtiqueta(); // Cambiar el logo y la etiqueta después de tomar la fotografía
        }, 'image/png');
        
        // Limpiar los elementos de vista previa y captura
        document.body.removeChild(videoElement);
        document.body.removeChild(captureButton);
        stream.getTracks().forEach((track) => track.stop());
      });
    })
    .catch((error) => {
      console.error('Error al acceder a la cámara:', error);
    });

  document.getElementById('modal-evidencia').style.display = 'none';
});

document.getElementById('file-input').addEventListener('change', (event) => {
  const file = event.target.files[0];
  
  // Validar el tipo de archivo
  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
  
  if (!allowedTypes.includes(file.type)) {
    alert('Tipo de archivo no permitido. Por favor, selecciona una imagen, PDF, Word o Excel.');
    event.target.value = ''; // Limpiar el input de archivo
    return;
  }
  
  // Cambiar el logo y la etiqueta después de cargar un archivo válido
  cambiarIconoEtiqueta();
  console.log('Archivo seleccionado:', file);
});

        /////Mensaje de Justificación
        btn_Terminar.addEventListener('click', async e => {
          const idEmpleado = e.target.dataset.id;
          const idDetalleAsistencia = e.target.dataset.idDetalleAsistencia;
          const radios = document.querySelectorAll(`input[type="radio"][data-id-detalle-asistencia="${idDetalleAsistencia}"][value="inasistencia"]`);
          const motivo = textarea.value;
          const fecha = obtenerFechaActualChihuahua();
        
          // Obtener el id_asistencia_cuadrilla correspondiente al detalle de asistencia
          const idAsistenciaCuadrilla = e.target.dataset.idAsistenciaCuadrilla;
          if (justificado.checked) {
            const formData = new FormData();
            formData.append('idDetalleAsistencia', idDetalleAsistencia);
            formData.append('motivo', motivo);
            formData.append('idAsistenciaCuadrilla', idAsistenciaCuadrilla);

            if (fotoCapturada) {
              formData.append('evidencia', fotoCapturada);
            } else {
              const fileInput = document.getElementById('file-input');
              if (fileInput.files.length > 0) {
                formData.append('evidencia', fileInput.files[0]);
              }
            }

            try {
              
              // Mostrar la animación de carga
              document.getElementById('loading-overlay').style.display = 'flex';
              document.getElementById('p-animacion').textContent = 'Justificando Falta...';
              const respuesta = await fetch('/justificarFaltasDiarias', {
                method: 'POST',
                body: formData
              });

              // Ocultar la animación de carga
              document.getElementById('loading-overlay').style.display = 'none';
        
              if (respuesta.ok) {
                Swal.fire({
                  title: 'Acción Realizada',
                  text: 'Falta Justificada',
                  icon: 'success'
                }).then(async () => {
                  // Obtener las justificaciones desde la base de datos
                  const justificaciones = await obtenerJustificaciones(idDetalleAsistencia);
        
                  // Verificar si el arreglo de justificaciones existe en la tabla datos_localstorage
                  const justificacionesExistentes = await obtenerJustificacionesExistentes(idAsistenciaCuadrilla);
        
                  if (justificacionesExistentes) {
                    // Actualizar el arreglo de justificaciones en la tabla datos_localstorage
                    await actualizarJustificaciones(justificaciones, idAsistenciaCuadrilla);
                  } else {
                    // Crear el arreglo de justificaciones en la tabla datos_localstorage
                    await crearJustificaciones(justificaciones, idAsistenciaCuadrilla, fecha);
                  }
                  fotoCapturada = null;
                  adjuntarIcono.textContent = 'attach_file';
                  adjuntarEtiqueta.textContent = 'Adjuntar Evidencia';
                  document.getElementById('file-input').value = '';
                  modal3.style.display = 'none';
                  radios.forEach(radio => {
                    if (radio.dataset.idDetalleAsistencia == idDetalleAsistencia && radio.value == 'inasistencia') {
                      radio.style.backgroundColor = 'orange';
                      radio.style.borderColor = 'orange';
                    }
                  });
        
                  checksModal3.forEach(good => {
                    good.checked = false;
                  });
        
                  textarea.value = "";
                  btn_Terminar.disabled = true;
        
                  const inputIcons = document.querySelectorAll('.icon-falta');
                  inputIcons.forEach(input => {
                    if (input.dataset.idDetalleAsistencia === idDetalleAsistencia) {
                      input.style.display = 'none';
                    }
                  });
                });
              } else {
                console.error('Ha ocurrido un error.');
              }
            } catch (err) {
              // Ocultar la animación de carga en caso de error
              document.getElementById('loading-overlay').style.display = 'none';
              console.error(err);
            }
          } else if (noJustificado.checked) {
            try {
              const respuesta = await fetch('/establecerFaltas', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ idDetalleAsistencia })
              });
        
              if (respuesta.ok) {
                Swal.fire({
                  title: 'Acción Realizada',
                  text: 'Falta no Justificada',
                  icon: 'success'
                }).then(async () => {
                  // Obtener las faltas desde la base de datos
                  const faltas = await obtenerFaltas(idDetalleAsistencia);
        
                  // Verificar si el arreglo de faltas existe en la tabla datos_localstorage
                  const faltasExistentes = await obtenerFaltasExistentes(idAsistenciaCuadrilla);
        
                  if (faltasExistentes) {
                    // Actualizar el arreglo de faltas en la tabla datos_localstorage
                    await actualizarFaltas(faltas, idAsistenciaCuadrilla);
                  } else {
                    // Crear el arreglo de faltas en la tabla datos_localstorage
                    await crearFaltas(faltas, idAsistenciaCuadrilla, fecha);
                  }
        
                  modal3.style.display = 'none';
                  radios.forEach(radio => {
                    if (radio.dataset.idDetalleAsistencia == idDetalleAsistencia && radio.value == 'inasistencia') {
                      radio.style.backgroundColor = 'red';
                      radio.style.borderColor = 'red';
                    }
                  });
        
                  checksModal3.forEach(good => {
                    good.checked = false;
                  });
        
                  textarea.value = "";
                  btn_Terminar.disabled = true;
        
                  const inputIcons = document.querySelectorAll('.icon-falta');
                  inputIcons.forEach(input => {
                    if (input.dataset.idDetalleAsistencia === idDetalleAsistencia) {
                      input.style.display = 'none';
                    }
                  });
        
                  
                });
              } else {
                console.error('Ha ocurrido un error.');
              }
            } catch (err) {
              console.error(err);
            }
          }
        
        });


      // Función para guardar el registro de terminar turno en la tabla datos_localstorage
        async function guardarTerminarTurno(idAsistenciaCuadrilla) {
          const fechaHoy = obtenerFechaActualChihuahua();
          
          try {
            await fetch('/guardar-terminar-turno', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ idAsistenciaCuadrilla, fechaHoy })
            });
          } catch (error) {
            console.error('Error al guardar el registro de terminar turno:', error);
          }
        }




        // Evento de clic en el botón de terminar turno
document.querySelector('.btn-terminar').addEventListener('click', async function() {

  const fecha = obtenerFechaActualChihuahua();
 
  if (this.textContent === 'Editar horas laboradas') {
    mostrarModalEditarHorasLaboradas();
  }else{

  const logosJustificacion = Array.from(document.querySelectorAll('.icon-falta')).filter(logo => logo.offsetParent !== null);
  console.log('Longitud Logos Justificacion: ',logosJustificacion.length);
  if (logosJustificacion.length > 0) {
    const result = await Swal.fire({
      title: 'Aún hay faltas sin justificar/no justificar',
      text: '¿Desea hacerlo después?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    });

    if (result.isConfirmed) {
      const idCuadrilla = document.getElementById('cuadrillas-select').value;
      const fechaAsistencia = obtenerFechaActualChihuahua();
      const idAsistenciaCuadrilla = await obtenerIdAsistenciaCuadrilla(idCuadrilla, fechaAsistencia);
      const faltasPendientes = Array.from(logosJustificacion).map(logo => logo.dataset.idDetalleAsistencia);
      console.log('Faltas pendientes: ',faltasPendientes);

      await crearFaltasPendientes(idAsistenciaCuadrilla, faltasPendientes, fecha);

      logosJustificacion.forEach(logo => {
        const radioInasistencia = logo.closest('td').querySelector('input[type="radio"][value="inasistencia"]');
        radioInasistencia.style.backgroundColor = 'red';
        radioInasistencia.style.borderColor = 'red';
        logo.style.display = 'none';
      });
    } else {
      return;
    }
  }

  const empleadosConAsistencia = obtenerEmpleadosConAsistencia();

  if (empleadosConAsistencia.length === 0) {
    Swal.fire({
      title: 'No es posible establecer horas laboradas',
      text: 'Todos los empleados tuvieron falta',
      icon: 'warning'
    });
    return;
  }

  const horaInicio = document.getElementById('hora-inicio').value;
  const horaFin = document.getElementById('hora-fin').value;
  const result = await Swal.fire({
    title: '¿Desea establecer las horas laboradas de forma personalizada?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí',
    cancelButtonText: 'No'
  });

  if (result.isConfirmed) {
    mostrarModalHorasLaboradas(horaInicio, horaFin);
  } else if(result.dismiss === Swal.DismissReason.cancel) {
    const idCuadrilla = document.getElementById('cuadrillas-select').value;
    const fechaAsistencia = obtenerFechaActualChihuahua();
    const idAsistenciaCuadrilla = await obtenerIdAsistenciaCuadrilla(idCuadrilla, fechaAsistencia);
    const horaFin = document.getElementById('hora-fin').value;
    await establecerHorasLaboradasDefault(horaFin);
    await guardarTerminarTurno(idAsistenciaCuadrilla);
    await Swal.fire('Horas laboradas establecidas', 'A todos los empleados se les asignaron 8 horas', 'success');
    document.querySelector('.btn-terminar').textContent = 'Editar horas laboradas';
  }else{
    return;
  }

   

  }
});

async function obtenerDetallesAsistencia(idAsistenciaCuadrilla) {
  try {
    const response = await fetch(`/obtener-detalles-asistencia/${idAsistenciaCuadrilla}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener los detalles de asistencia:', error);
    return [];
  }
}

// Función para mostrar la modal de asignar horas laboradas
async function mostrarModalHorasLaboradas(horaFin) {
  const empleadosConAsistencia = obtenerEmpleadosConAsistencia();
  const modalContent = document.getElementById('empleados-horas-laboradas');
  modalContent.innerHTML = '';

  const idCuadrilla = document.getElementById('cuadrillas-select').value;
  const fechaAsistencia = obtenerFechaActualChihuahua();
  const idAsistenciaCuadrilla = await obtenerIdAsistenciaCuadrilla(idCuadrilla, fechaAsistencia);

  const detallesAsistencia = await obtenerDetallesAsistencia(idAsistenciaCuadrilla);

  empleadosConAsistencia.forEach(empleado => {
    const detalleAsistencia = detallesAsistencia.find(detalle => detalle.id_empleado == empleado.id);
    const horaEntrada = detalleAsistencia ? detalleAsistencia.hora_entrada : null;
    console.log('horaEntrada: ',horaEntrada);
    const horaFin = document.getElementById('hora-fin').value;
    console.log('horaFin: ',horaFin);
    const horasLaboradas = calcularHorasLaboradas(horaEntrada, horaFin);
    console.log(horasLaboradas);
    const div = document.createElement('div');
    div.classList.add('empleado');
    div.innerHTML = `
      <input type="checkbox" id="check-${empleado.id}" data-id="${empleado.id}">
      <label for="check-${empleado.id}">${empleado.nombre}</label>
      <input type="number" id="horas-${empleado.id}" value="${horasLaboradas}" min="1" max="24" disabled>
    `;
    modalContent.appendChild(div);

    const checkbox = div.querySelector(`input[type="checkbox"]`);
    const horasInput = div.querySelector(`input[type="number"]`);

    checkbox.addEventListener('change', function() {
      horasInput.disabled = !this.checked;
      
      if (horasInput.disabled) {
        horasInput.value = horasLaboradas;
      }
      validarBotonTerminar();
    });
  });

  document.getElementById('modal-horas-laboradas').style.display = 'block';
}


function calcularHorasLaboradas(horaEntrada, horaFin) {
  //const [horaInicioHora, horaInicioMinutos] = horaInicio.split(':');
  const [horaEntradaHora, horaEntradaMinutos] = horaEntrada.split(':');
  const [horaFinHora, horaFinMinutos] = horaFin.split(':');

  //const horaInicioDecimal = parseInt(horaInicioHora) + parseInt(horaInicioMinutos) / 60;
  const horaEntradaDecimal = parseInt(horaEntradaHora) + parseInt(horaEntradaMinutos) / 60;
  const horaFinDecimal = parseInt(horaFinHora) + parseInt(horaFinMinutos) / 60;

  const horasLaboradas = Math.floor(horaFinDecimal - horaEntradaDecimal);

  return horasLaboradas;
}


// Función para obtener los empleados con asistencia
function obtenerEmpleadosConAsistencia() {
  const empleados = [];
  const radiosAsistencia = document.querySelectorAll(`input[type="radio"][value="asistencia"]:checked`);

  radiosAsistencia.forEach(radio => {
    if (radio.checked) {
      const idEmpleado = radio.name.split('-')[1];
      console.log(idEmpleado);
      const nombre = radio.parentNode.parentNode.previousElementSibling.textContent.trim();
      empleados.push({ id: idEmpleado, nombre: nombre, idAsistenciaCuadrilla: radio.dataset.idAsistenciaCuadrilla});
    }
  });

  console.log(empleados);
  return empleados;
}



// Función para validar el botón de terminar en la modal de asignar horas laboradas
function validarBotonTerminar() {
  const checkboxes = document.querySelectorAll('#modal-horas-laboradas input[type="checkbox"]:checked');
  const horasInputs = document.querySelectorAll('#modal-horas-laboradas input[type="number"]');
  const btnTerminar = document.getElementById('btn-terminar-horas-laboradas');

  let valoresValidos = true;
  let horas = 0;
  horasInputs.forEach(input => {
   
    console.log("Un Input de tipo number");
    input.addEventListener('input', ()=>{
        horas = input.value;
      if(horas < 1 || horas > 24 || (input.value  == 0 || input.value  == null || input.value  == undefined)){
        valoresValidos = false;
        btnTerminar.disabled = checkboxes.length === 0 || !valoresValidos;
        
      }else{
        valoresValidos = true;
        btnTerminar.disabled = checkboxes.length === 0 || !valoresValidos;
      }
    })

    

    if (input.value < 1 || input.value > 24 || (input.value == null || input.value == '')) {
      valoresValidos = false;
      btnTerminar.disabled = checkboxes.length === 0 || !valoresValidos;
    }
  });

  

  btnTerminar.disabled = checkboxes.length === 0 || !valoresValidos;
}


// Evento de clic en el botón de terminar de la modal de asignar horas laboradas
document.getElementById('btn-terminar-horas-laboradas').addEventListener('click', async function() {
  const horasLaboradas = {};
  const empleadosConAsistencia = obtenerEmpleadosConAsistencia();
  const idCuadrilla = document.getElementById('cuadrillas-select').value;
  const fechaAsistencia = obtenerFechaActualChihuahua();
  const idAsistenciaCuadrilla = await obtenerIdAsistenciaCuadrilla(idCuadrilla, fechaAsistencia);

  const detallesAsistencia = await obtenerDetallesAsistencia(idAsistenciaCuadrilla);

  empleadosConAsistencia.forEach(empleado => {
    const checkbox = document.getElementById(`check-${empleado.id}`);
    const horasInput = document.getElementById(`horas-${empleado.id}`);
    const detalleAsistencia = detallesAsistencia.find(detalle => detalle.id_empleado == empleado.id);
    const horaEntrada = detalleAsistencia ? detalleAsistencia.hora_entrada : null;
    const horaFin = document.getElementById('hora-fin').value
    const horasCalculadas = calcularHorasLaboradas(horaEntrada, horaFin);

    if (checkbox.checked) {
      horasLaboradas[empleado.id] = parseInt(horasInput.value);
    } else {
      horasLaboradas[empleado.id] = horasCalculadas;
    }
  });

  await actualizarHorasLaboradas(horasLaboradas, idAsistenciaCuadrilla);
  await guardarTerminarTurno(idAsistenciaCuadrilla);
  await Swal.fire('Horas laboradas establecidas', '', 'success');
  document.querySelector('.btn-terminar').textContent = 'Editar horas laboradas';
  document.getElementById('modal-horas-laboradas').style.display = 'none';
});


// Evento de clic en el botón de cancelar de la modal de asignar horas laboradas
document.getElementById('btn-cancelar-horas-laboradas').addEventListener('click', function() {
  const checkboxes = document.querySelectorAll('#modal-horas-laboradas input[type="checkbox"]');
  const horasInputs = document.querySelectorAll('#modal-horas-laboradas input[type="number"]');

  checkboxes.forEach(checkbox => {
    checkbox.checked = false;
  });

  horasInputs.forEach(input => {
    input.value = '8';
    input.disabled = true;
  });

  document.getElementById('btn-terminar-horas-laboradas').disabled = true;
  document.getElementById('modal-horas-laboradas').style.display = 'none';
});

// Función para actualizar las horas laboradas en la base de datos
async function actualizarHorasLaboradas(horasLaboradas, idAsistenciaCuadrilla) {
  try {
    await fetch('/actualizar-horas-laboradas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ horasLaboradas: horasLaboradas, idAsistenciaCuadrilla: idAsistenciaCuadrilla })
    });
  } catch (error) {
    console.error('Error al actualizar las horas laboradas:', error);
  }
}

// Función para establecer las horas laboradas por defecto
async function establecerHorasLaboradasDefault(horaFin) {
  const idCuadrilla = document.getElementById('cuadrillas-select').value;
  const fechaAsistencia = obtenerFechaActualChihuahua();
  const idAsistenciaCuadrilla = await obtenerIdAsistenciaCuadrilla(idCuadrilla, fechaAsistencia);
  const empleadosConAsistencia = obtenerEmpleadosConAsistencia();
  const horasLaboradas = {};

  const detallesAsistencia = await obtenerDetallesAsistencia(idAsistenciaCuadrilla);

  empleadosConAsistencia.forEach(empleado => {
    const detalleAsistencia = detallesAsistencia.find(detalle => detalle.id_empleado == empleado.id);
    const horaEntrada = detalleAsistencia ? detalleAsistencia.hora_entrada : null;
    horasLaboradas[empleado.id] = calcularHorasLaboradas(horaEntrada, horaFin);
  });

  await actualizarHorasLaboradas(horasLaboradas, idAsistenciaCuadrilla);
}

// Función para crear el registro de faltas pendientes en la tabla datos_localstorage
async function crearFaltasPendientes(idAsistenciaCuadrilla, faltasPendientes, fecha) {
  try {
    await fetch('/crear-faltas-pendientes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ idAsistenciaCuadrilla: idAsistenciaCuadrilla, faltasPendientes: faltasPendientes, fecha: fecha })
    });
  } catch (error) {
    console.error('Error al crear el registro de faltas pendientes:', error);
  }
}

// Evento de clic en el botón de editar horas laboradas
document.querySelector('.btn-terminar').addEventListener('click', function() {
  if (this.textContent === 'Editar horas laboradas') {
    mostrarModalEditarHorasLaboradas();
  }
});

// Función para mostrar la modal de editar horas laboradas
async function mostrarModalEditarHorasLaboradas() {
  const empleadosConAsistencia = obtenerEmpleadosConAsistencia();
  const horasLaboradas = await obtenerHorasLaboradas();
  const modalContent = document.getElementById('empleados-editar-horas-laboradas');
  modalContent.innerHTML = '';

  empleadosConAsistencia.forEach(empleado => {
    const div = document.createElement('div');
    div.classList.add('empleado');
    div.innerHTML = `
      <div class="nombres">
        <label>${empleado.nombre}</label>
      </div>
      <div class="horas">
        <input type="number" id="horas-editar-${empleado.id}" value="${horasLaboradas[empleado.id]}" min="1" max="24" disabled>
        <span class="material-icons editar-horas" data-id="${empleado.id}">edit</span>
      </div>
    `;
    modalContent.appendChild(div);


  });

  document.getElementById('modal-editar-horas-laboradas').style.display = 'block';
  createPagination();
  showPage(currentPage);
}

// Función para obtener las horas laboradas desde la base de datos
async function obtenerHorasLaboradas() {
  try {
    const response = await fetch('/obtener-horas-laboradas');
    const data = await response.json();
    return data.horasLaboradas;
  } catch (error) {
    console.error('Error al obtener las horas laboradas:', error);
    return {};
  }
}

let horasEditadas = [];

// Función para validar el botón de terminar en la modal de editar horas laboradas
function validarBotonTerminarEditar() {
  const horasInputs = document.querySelectorAll('#modal-editar-horas-laboradas input[type="number"]');
  const iconosDone = document.querySelectorAll('#modal-editar-horas-laboradas span');
  let done = 0;
  let validarHoras = true;
  let inputsBad = 0;
  const horasEditadas = JSON.parse(localStorage.getItem('horasEditadas')) || [];
  const btnTerminar = document.getElementById('btn-terminar-editar-horas-laboradas');
  iconosDone.forEach(icono =>{
    if(icono.textContent == 'done'){
      console.log('Se ha encontrado un logo done');
      done++;
    }
  })

  horasInputs.forEach(input =>{
    console.log('Valor Input: ',input.value);
     
    if(input.value < 1 || input.value > 24 || (input.value == null || input.value == undefined || input.value == '')){
      
          inputsBad++;    
    }
  });

  
  btnTerminar.disabled = horasEditadas.length === 0 || done > 0 || inputsBad > 0;
}


// Evento de clic en el icono de editar horas
document.addEventListener('click', function(e) {
  
  if (e.target.classList.contains('editar-horas') && e.target.classList.contains('editar-horas')) {
    const horasInput = e.target.previousElementSibling;
    const idEmpleado = horasInput.id.split('-')[2];

    if (e.target.textContent == 'edit') {
      horasInput.disabled = false;
      e.target.textContent = 'done';
    } else {
      horasInput.disabled = true;
      e.target.textContent= 'edit';
      
      const horas = parseInt(horasInput.value);
      const index = horasEditadas.findIndex(item => item.idEmpleado === idEmpleado);
      
      if (index !== -1) {
        horasEditadas[index].horas = horas;
      } else {
        horasEditadas.push({ idEmpleado, horas });
      }
      validarBotonTerminarEditar();
      localStorage.setItem('horasEditadas', JSON.stringify(horasEditadas));
    }

    validarBotonTerminarEditar();
  }
});

// Evento de clic en el botón de terminar de la modal de editar horas laboradas
document.getElementById('btn-terminar-editar-horas-laboradas').addEventListener('click', async function() {
  const horasLaboradas = {};
  const horasInputs = document.querySelectorAll('#modal-editar-horas-laboradas input[type="number"]');

  horasInputs.forEach(input => {
    const idEmpleado = input.id.split('-')[2];
    const horas = parseInt(input.value);
    horasLaboradas[idEmpleado] = horas;
  });

  const radioAsistencia = document.querySelector(`input[type="radio"][value="asistencia"]:checked`);
  const idCuadrilla = document.getElementById('cuadrillas-select').value;
  const fechaAsistencia = obtenerFechaActualChihuahua();
  const idAsistenciaCuadrilla = await obtenerIdAsistenciaCuadrilla(idCuadrilla, fechaAsistencia);


  await actualizarHorasLaboradas(horasLaboradas, idAsistenciaCuadrilla);
  await Swal.fire('Se han modificado las horas laboradas', '', 'success')
  .then( () =>{
    localStorage.removeItem('horasEditadas');
    document.getElementById('modal-editar-horas-laboradas').style.display = 'none';
    const btnTerminar = document.getElementById('btn-terminar-editar-horas-laboradas');
    btnTerminar.disabled = true;
  })
});

// Evento de clic en el botón de cancelar de la modal de editar horas laboradas
document.getElementById('btn-cancelar-editar-horas-laboradas').addEventListener('click', function() {
  document.getElementById('modal-editar-horas-laboradas').style.display = 'none';
  const btnTerminar = document.getElementById('btn-terminar-editar-horas-laboradas');
  btnTerminar.disabled = true;
  localStorage.removeItem('horasEditadas');
});


async function obtenerFaltasPendientes(idAsistenciaCuadrilla) {
  try {
    const response = await fetch(`/obtener-faltas-pendientes/${idAsistenciaCuadrilla}`);
    const data = await response.json();
    return data.faltasPendientes || [];
  } catch (error) {
    console.error('Error al obtener las faltas pendientes:', error);
    return [];
  }
}


//Paginacion Modal de editar horas laboradas

let currentPage = 1;
const itemsPerPage = 3;

function showPage(page) {
  const empleados = document.querySelectorAll('#empleados-editar-horas-laboradas .empleado');
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  empleados.forEach((empleado, index) => {
    if (index >= startIndex && index < endIndex) {
      empleado.style.display = 'flex';
    } else {
      empleado.style.display = 'none';
    }
  });
}

function createPagination() {
  const empleados = document.querySelectorAll('#empleados-editar-horas-laboradas .empleado');
  const totalPages = Math.ceil(empleados.length / itemsPerPage);
  const paginationContainer = document.getElementById('pagination-editar-horas-laboradas');
  paginationContainer.innerHTML = '';

  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement('button');
    button.textContent = i;
    button.addEventListener('click', () => {
      currentPage = i;
      showPage(currentPage);
    });
    paginationContainer.appendChild(button);
  }
}


   

    

////////////////////////////////////////////////////// Fecha Actual


var fecha = new Date(); 
var dia = fecha.getDate();
var mes = fecha.getMonth() + 1; 
var ano = fecha.getFullYear();

if(dia < 10) {
dia = '0' + dia; 
} 

if(mes < 10) {
mes = '0' + mes
} 

fecha = ano + '-' + mes + '-' + dia;
document.getElementById("fechaActual").value = fecha;
document.getElementById("fechaSemana").value = fecha;


///////////////////////////////////////////////////  Fecha por Semana

// Tabla 1
const fechaInicio = obtenerInicioSemana();
const fechaFin = obtenerFinSemana();


const labelFecha = document.getElementById("fechaActual2");

labelFecha.innerText = `${fechaInicio} - ${fechaFin}`


function obtenerInicioSemana() {

  const hoy = new Date();
  hoy.setDate(hoy.getDate() - hoy.getDay() + 1);

  return formatearFecha(hoy);
}

function obtenerFinSemana() {
  
  const hoy = new Date();
  const diaSemana = hoy.getDay();
  
  const fechaFin = new Date(hoy);
  fechaFin.setDate(hoy.getDate() + (6 - diaSemana));

  return formatearFecha(fechaFin); 
}

function formatearFecha(fecha) {

  let dia = fecha.getDate().toString().padStart(2, "0");
  let mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
  let year = fecha.getFullYear();

  return `${dia}/${mes}/${year}`;  
}


/////Tabla 2
const fechaInicio2 = obtenerInicioSemana2();
const fechaFin2 = obtenerFinSemana2();


const labelFecha2 = document.getElementById("fechasemana2");

labelFecha2.innerText = `${fechaInicio2} - ${fechaFin2}`


function obtenerInicioSemana2() {

  const hoy2 = new Date();
  hoy2.setDate(hoy2.getDate() - hoy2.getDay() + 1);

  return formatearFecha2(hoy2);
}

function obtenerFinSemana2() {
  
  const hoy2 = new Date();
  const diaSemana2 = hoy2.getDay();
  
  const fechaFin2 = new Date(hoy2);
  fechaFin2.setDate(hoy2.getDate() + (6 - diaSemana2));

  return formatearFecha2(fechaFin2); 
}

function formatearFecha2(fecha2) {

  let dia2 = fecha2.getDate().toString().padStart(2, "0");
  let mes2 = (fecha2.getMonth() + 1).toString().padStart(2, "0");
  let year2 = fecha2.getFullYear();

  return `${dia2}/${mes2}/${year2}`;  
}



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
