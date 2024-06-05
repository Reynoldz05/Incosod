const sideMenu = document.querySelector("aside");
const menuBtn = document.querySelector("#menu-btn");
const closeBtn = document.querySelector("#close-btn");
const themeToggler = document.querySelector(".theme-toggler");
const formSemanal = document.querySelector('.form-asistencia-semanal');
const radios = document.querySelectorAll('.check');
const asistencias_semanales = {};
const asistenciasSemanalesModificadas = {};
const horas = {};
const btnGuardar = document.querySelector('.btn-guardar')
const btnTerminar = document.querySelector('.btn-terminar');
const btn_Terminar = document.querySelector('#modal3 button');
const checksHoras = document.querySelectorAll('#modal input[type="checkbox"]');
const checkedChecks = document.querySelectorAll('input[type="checkbox"]:checked');
const checksModal3 = document.querySelectorAll('#modal3 input[type="checkbox"]');
const  modal = document.getElementById('modal');
const modal3 = document.getElementById("modal3");
let iconosFalta = [];
let hoy = new Date();
let cont = 0;
const btn_extra = document.getElementById('btn-extra');              
hoy = Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(hoy);

var checkboxes = document.querySelectorAll('#modal2 input[type="checkbox"]');
var inputs = document.querySelectorAll('#modal2 input[type="text"]');
const modal2 = document.getElementById('modal2');
const checksModal = document.querySelectorAll('#modal input[type="checkbox"]');
const tabla = document.querySelector('#modal table');
const inputsNumero = tabla.querySelectorAll('input[type="number"]');
const checkJustificado = document.getElementById('justificada');
const checkNoJustificado = document.getElementById('no-justificada');
const textarea = document.getElementById('descripcion');
const justificado = document.getElementById('justificada');
const noJustificado = document.getElementById('no-justificada');

let FI = 0;
let FF = 0;
//Variable de DB correspondiente a Horas Semanales Asignadas
let HSA = "";
//Variable de DB Justificaciones Semanales 
let JS = [];
//Variable de DB correspondiente a Faltas Semanales
let FS = [];




async function fetchFechaInicio() {
    try{
      const respuesta = await fetch('/sincronizar-data?llave=fechaInicio');
    
      const datos = await respuesta.json();
      
      if(datos){
      
        const {valor} = datos;
    
        console.log("Fecha inicio: "+valor);
    
        FI = valor;
    
      } else {
      
        console.error('No se encontró dato');
      
      }
    } catch (err) {

      console.error(err);
    }
  

  }


  async function fetchFechaFin() {
    try{
      const respuesta = await fetch('/sincronizar-data?llave=fechaFin');
    
      const datos = await respuesta.json();
      
      if(datos){
      
        const {valor} = datos;
    
        console.log("Fecha fin: "+valor);
    
        FF = valor;
    
      } else {
      
        console.error('No se encontró dato');
      
      }
    } catch (err) {

      console.error(err);
    }
  

  }


  async function fetchHorasSemanalesAsignadas() {

    try{
      const respuesta = await  fetch('/sincronizar-data?llave=HorasSemanalesAsignadas');
      const datos = await respuesta.json();

      if(datos){
        const {valor} =  datos;

        console.log("Horas Semanales Asignadas: "+valor);
        HSA = valor;
      }else {
      
        console.error('No se encontró dato');
      
      }


    }catch(err){
      console.error(err);
    }

  }


  async function fetchJustificacionesSemanales(){

    try{

      const respuesta =  await fetch('/sincronizar-data?llave=JustificacionesSemanales');
      const datos = await respuesta.json();

      if(datos){
        const {valor} = datos;
        JS = JSON.parse(valor);
      }else{
        console.error('No se encontró dato');
      }

    }catch(err){
      console.error(err);
    }

  }

  async function fetchFaltasSemanales(){

    try{

      const respuesta =  await fetch('/sincronizar-data?llave=FaltasSemanales');
      const datos = await respuesta.json();

      if(datos){
        const {valor} = datos;
        FS = JSON.parse(valor);
      }else{
        console.error('No se encontró dato');
      }

    }catch(err){
      console.error(err);
    }

  }


  ////Función para poner la descripción de la falta

function mostrarIconoSemanal() {

    // Obtener los radios deshabilitados 
    const deshabilitados = document.querySelectorAll('input[type="radio"]:not(:checked)');
    
    
    deshabilitados.forEach(radio => {
    const idEmpleado = radio.dataset.id;
    const dia = radio.dataset.dia;
      const td = radio.closest('td');
          
      const falta = document.createElement('span');
      falta.innerHTML = '<i data-id="'+idEmpleado+'" data-dia="'+dia+'" class="material-icons icon-falta">description</i>';

      iconosFalta.push(falta); 

      falta.addEventListener('click', ()=>{
        abrirModalJustificacion(idEmpleado, dia);

    

      });

      td.appendChild(falta);

      const logosJustify = document.querySelectorAll('.icon-falta');
      

        logosJustify.forEach(logo => {
            const idLogo = logo.dataset.id;
            const dia = logo.dataset.dia;

            if (JS.length > 0) {
                // Filtrar los objetos que contengan el idEmpleado igual al idLogo
                const justificacionesEmpleado = JS.filter(justificacion => justificacion.idEmpleado === idLogo);
              
                // Iterar sobre cada justificación del empleado
                justificacionesEmpleado.forEach(justificacion => {
                  // Comprobar si el día de la justificación coincide con la variable dia
                  if (justificacion.dia === dia) {
                    // Establecer el background color del radio de color naranja
                    if (radio.dataset.id == idLogo && radio.dataset.dia == dia) {
                      radio.style.backgroundColor = 'orange';
                      logo.style.display = 'none';
                    }
                  }
                });
              }

              if (FS.length > 0) {
                // Filtrar los objetos que contengan el idEmpleado igual al idLogo
                const faltasEmpleado = FS.filter(falta => falta.idEmpleado === idLogo);
              
                // Iterar sobre cada justificación del empleado
                faltasEmpleado.forEach(falta => {
                  // Comprobar si el día de la justificación coincide con la variable dia
                  if (falta.dia === dia) {
                    // Establecer el background color del radio de color naranja
                    if (radio.dataset.id == idLogo && radio.dataset.dia == dia) {
                      radio.style.backgroundColor = 'red';
                      logo.style.display = 'none';
                    }
                  }
                });
              }

        });
        
    });
  
  }


  function habilitarFila(fila) {
    fila.querySelectorAll('input[type="number"]')
    .forEach(input => {
        if(input.dataset.asistencia == 1 && input.dataset.entrada == '10:00'){
        input.disabled = false; 
        input.readOnly = false;
        input.value = 0;
     }else{
        input.disabled = true;
        input.value = "";
     }
        
    });

}

function limpiarFila(fila) {
    fila.querySelectorAll('input[type="number"]')
    .forEach(input =>{
        if(input.dataset.asistencia == 1 && input.dataset.entrada == '10:00'){
            input.readOnly = true;
            input.value = 0;
            input.disabled = false;
            
        }else{
            input.disabled = true;
            input.value = "";
        }
    });  
}

function toggleCheck(event) {
    const checkbox = event.target;
    console.log(checkbox.id);
    const fila = checkbox.parentElement.parentElement;
    
    if(checkbox.checked) {
        cont++;
        habilitarFila(fila);
       
    } else {
        cont--;
        limpiarFila(fila); 
       
    }

    if(cont > 0){
        btn_extra.disabled = false;
    }else{
        btn_extra.disabled = true;
    }

    }

    function aplicarAccionesFilas() {
        const filas = modal.querySelectorAll('.tr-hrs'); // Obtener todas las filas de la tabla del modal
        console.log("Cantidad de filas: "+filas.length);
        filas.forEach(fila => {
          const checkbox = fila.querySelector('input[type="checkbox"]');
          
          if (checkbox.checked) {
            cont++;
            habilitarFila(fila);
          } else {
            cont--;
            limpiarFila(fila);
          }

        });
        
        if(cont > 0){
            btn_extra.disabled = false;
        }else{
            btn_extra.disabled = true;
        }

        cont = 0;
      }

    


    function habilitarHora(idEmpleado, dia) {
        const horaInput = document.getElementById(`hora-${idEmpleado}-${dia}`);
        horaInput.disabled = false;
    }
    
    function deshabilitarHora(idEmpleado, dia) {
        const horaInput = document.getElementById(`hora-${idEmpleado}-${dia}`);
        horaInput.disabled = true;
    }


    ///Funcion para abrir el modal
function abrirModalJustificacion(id, dia) {

    modal3.style.display = "block";
    const textarea = document.getElementById('descripcion');
    textarea.disabled = true;

    const idEmpleado = id;
    btn_Terminar.dataset.id = idEmpleado;
    btn_Terminar.dataset.dia = dia;
  
  }

  //Mostrar u ocultar los inputs de la hora de llegada
  function toggleInput(checkboxId,...ids) {
    var checkbox = document.getElementById(checkboxId); 
    ids.forEach(id => {
      var input = document.getElementById(id);
      if (checkbox.checked) {
        input.style.display = "block";
      } else {
        input.style.display = "none";
      }
    });
  }

  // Controlar estado  
function alternarChecks(evento) {

    const check = evento.target;
    check.checked = true; 
  
    if(check === checkJustificado ) {  
      checkNoJustificado.checked = false;
      btn_Terminar.disabled = true;
      textarea.disabled = false;
  
    } else if(check === checkNoJustificado) {
      checkJustificado.checked = false;
      btn_Terminar.disabled = false;
      textarea.disabled = true;
      textarea.value = "";
    
    }
  
  }


  
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


////Paginacion

var rowsPerPage = 10;
var currentPage = 1;

function paginate() {
    var table = document.querySelector('table tbody');
    var rows = table.querySelectorAll('tr');
    var totalPages = Math.ceil(rows.length / rowsPerPage);

    // Oculta todas las filas
    for (var i = 0; i < rows.length; i++) {
        rows[i].style.display = 'none';
    }

    // Muestra solo las filas para la página actual
    for (var i = (currentPage - 1) * rowsPerPage; i < currentPage * rowsPerPage && i < rows.length; i++) {
        rows[i].style.display = '';
    }

    // Crea los botones de paginación
var pagination = document.querySelector('#pagination');
pagination.innerHTML = '';
for (var i = 1; i <= totalPages; i++) {
    var btn = document.createElement('button');
    btn.textContent = i;
    btn.addEventListener('click', function(e) {
        currentPage = parseInt(e.target.textContent);
        paginate();
    });
    // Añade la clase 'boton-activo' al botón de la página actual
    if (i === currentPage) {
        btn.classList.add('boton-activo');
    }
    pagination.appendChild(btn);
}

    // Crea el botón de "Página anterior"
    var prevPageBtn = document.createElement('button');
    prevPageBtn.textContent = 'Página anterior';
    prevPageBtn.addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            paginate();
        }
    });
    pagination.insertBefore(prevPageBtn, pagination.firstChild);

    // Muestra u oculta el botón de "Página anterior"
    prevPageBtn.style.display = (currentPage === 1) ? 'none' : 'inline-block';

    // Añade el botón de "Última página"
    var lastPageBtn = document.createElement('button');
    lastPageBtn.textContent = 'Última página';
    lastPageBtn.addEventListener('click', function() {
        currentPage = totalPages;
        paginate();
    });
    pagination.appendChild(lastPageBtn);
}


// Llama a la función al cargar la página
window.onload = paginate;

var rowsPerPageHoras = 5;
currentPage = 1;

function paginacionModalHoras() {
    
    var rows = document.querySelectorAll('.tr-hrs');
    var totalPages = Math.ceil(rows.length / rowsPerPageHoras);

    // Oculta todas las filas
    for (var i = 0; i < rows.length; i++) {
        rows[i].style.display = 'none';
    }

    // Muestra solo las filas para la página actual
    for (var i = (currentPage - 1) * rowsPerPageHoras; i < currentPage * rowsPerPageHoras && i < rows.length; i++) {
        rows[i].style.display = '';
    }

        // Crea los botones de paginación
    var pagination = document.querySelector('#paginationModalHoras');
    pagination.innerHTML = '';
    for (var i = 1; i <= totalPages; i++) {
        var btn = document.createElement('button');
        btn.textContent = i;
        btn.addEventListener('click', function(e) {
            currentPage = parseInt(e.target.textContent);
            paginacionModalHoras();
        });
        // Añade la clase 'boton-activo' al botón de la página actual
        if (i === currentPage) {
            btn.classList.add('boton-activo');
        }
        pagination.appendChild(btn);
    }

        // Crea el botón de "Página anterior"
        var prevPageBtn = document.createElement('button');
        prevPageBtn.textContent = 'Página anterior';
        prevPageBtn.addEventListener('click', function() {
            if (currentPage > 1) {
                currentPage--;
                paginacionModalHoras();
            }
        });
        pagination.insertBefore(prevPageBtn, pagination.firstChild);

        // Muestra u oculta el botón de "Página anterior"
        prevPageBtn.style.display = (currentPage === 1) ? 'none' : 'inline-block';

        // Añade el botón de "Última página"
        var lastPageBtn = document.createElement('button');
        lastPageBtn.textContent = 'Última página';
        lastPageBtn.addEventListener('click', function() {
            currentPage = totalPages;
            paginacionModalHoras();
        });
        pagination.appendChild(lastPageBtn);
}


var rowsPerPageHorarios = 5;
currentPage = 1;

function paginacionModalHorarios() {
    
    var rows = document.querySelectorAll('.empleado-horas');
    var totalPages = Math.ceil(rows.length / rowsPerPageHorarios);

    // Oculta todas las filas
    for (var i = 0; i < rows.length; i++) {
        rows[i].style.display = 'none';
    }

    // Muestra solo las filas para la página actual
    for (var i = (currentPage - 1) * rowsPerPageHorarios; i < currentPage * rowsPerPageHorarios && i < rows.length; i++) {
        rows[i].style.display = '';
    }

        // Crea los botones de paginación
    var pagination = document.querySelector('#paginationModalHorarios');
    pagination.innerHTML = '';
    for (var i = 1; i <= totalPages; i++) {
        var btn = document.createElement('button');
        btn.textContent = i;
        btn.addEventListener('click', function(e) {
            currentPage = parseInt(e.target.textContent);
            paginacionModalHorarios();
        });
        // Añade la clase 'boton-activo' al botón de la página actual
        if (i === currentPage) {
            btn.classList.add('boton-activo');
        }
        pagination.appendChild(btn);
    }

        // Crea el botón de "Página anterior"
        var prevPageBtn = document.createElement('button');
        prevPageBtn.textContent = 'Página anterior';
        prevPageBtn.addEventListener('click', function() {
            if (currentPage > 1) {
                currentPage--;
                paginacionModalHorarios();
            }
        });
        pagination.insertBefore(prevPageBtn, pagination.firstChild);

        // Muestra u oculta el botón de "Página anterior"
        prevPageBtn.style.display = (currentPage === 1) ? 'none' : 'inline-block';

        // Añade el botón de "Última página"
        var lastPageBtn = document.createElement('button');
        lastPageBtn.textContent = 'Última página';
        lastPageBtn.addEventListener('click', function() {
            currentPage = totalPages;
            paginacionModalHorarios();
        });
        pagination.appendChild(lastPageBtn);
}




(async () =>{

////////////////////////////////////////// Resto del codigo ///////////////////////////////////////////////////////////////////////

await fetchFechaInicio();
await fetchFechaFin();
await fetchHorasSemanalesAsignadas();
await fetchJustificacionesSemanales();
await fetchFaltasSemanales();



console.log("Fecha Inicio desde DB: "+FI);
console.log("Fecha Fin desde DB: "+FF);



radios.forEach(radio => {

    const dia = radio.dataset.dia;
    const idEmpleado = radio.dataset.id;
  
    deshabilitarHora(idEmpleado, dia); 
  
  });

 

if((FI != 0 && FI != undefined) && (FF != 0 && FF != undefined) && hoy>= FI && hoy<= FF){
   
            
            if(HSA == "Asignado"){
                btnTerminar.style.display = 'none';
            }else{
                btnTerminar.style.display = '';
            }

        
            const btn_extra = document.getElementById('btn-extra');
            btn_extra.disabled = true;
            const inputNumbers = document.querySelectorAll('input[type="number"]');

            inputNumbers.forEach(input =>{
                if(input.dataset.asistencia == 1 && input.dataset.entrada == '10:00'){
                    input.readOnly = true;
                    input.disabled = false;
                    input.value = 0;
                
                }else{
                    input.disabled = true;
                    input.value = "";
                }
            });

            
            
            checksHoras.forEach(check =>{
                check.addEventListener("click", toggleCheck);
                });
  

            const inicioSemana =  FI;
            const finSemana =  FF;
            btnGuardar.disabled = true;
            radios.forEach(radio =>{
                radio.disabled = true;
            });
 
            fetch(`/asistenciasSemanalesRadios?fecha_inicio=${inicioSemana}&fecha_fin=${finSemana}`)
            .then(res => res.json())
            .then(data =>{
                data.forEach(asistenciaSemanal=>{
                    const lunes = asistenciaSemanal.asistencia_lunes;
                    const martes = asistenciaSemanal.asistencia_martes;
                    const miercoles = asistenciaSemanal.asistencia_miercoles;
                    const jueves = asistenciaSemanal.asistencia_jueves;
                    const viernes = asistenciaSemanal.asistencia_viernes;
                    const sabado = asistenciaSemanal.asistencia_sabado;

                    const radioLunes = document.getElementById(`radio-lunes-${asistenciaSemanal.id_empleado}`);
                    if(lunes === 1){
                        radioLunes.checked = true;
                    }else{
                        radioLunes.checked = false;
                    }
                    const radioMartes = document.getElementById(`radio-martes-${asistenciaSemanal.id_empleado}`);
                    if(martes === 1){
                        radioMartes.checked = true;
                    }else{
                        radioMartes.checked = false;
                    }
                    const radioMiercoles = document.getElementById(`radio-miercoles-${asistenciaSemanal.id_empleado}`);
                    if(miercoles === 1){
                        radioMiercoles.checked = true;
                    }else{
                        radioMiercoles.checked = false;
                    }
                    const radioJueves = document.getElementById(`radio-jueves-${asistenciaSemanal.id_empleado}`);
                    if(jueves === 1){
                        radioJueves.checked = true;
                    }else{
                        radioJueves.checked = false;
                    }
                    const radioViernes = document.getElementById(`radio-viernes-${asistenciaSemanal.id_empleado}`);
                    if(viernes === 1){
                        radioViernes.checked = true;
                    }else{
                        radioViernes.checked = false;
                    }
                    const radioSabado = document.getElementById(`radio-sabado-${asistenciaSemanal.id_empleado}`);
                    if(sabado === 1){
                        radioSabado.checked = true;
                    }else{
                        radioSabado.checked = false;
                    }
                    

                });
                mostrarIconoSemanal();
                
            }).catch(error =>{
                console.error(error);
            });


            
                //Boton de Terminar Turno

                btnTerminar.addEventListener('click', function(e) {
                    e.preventDefault();
                    const idAsistencia = e.target.dataset.id;
                    const logosJustify = document.querySelectorAll('.icon-falta:not([style*="display: none"])');
                    const deshabilitados = document.querySelectorAll('input[type="radio"]:not(:checked)');
                
                    
                    if(logosJustify.length > 0){
                        
                        Swal.fire({
                            title: 'Aun quedan faltas sin justificar. Desea establecerlas como no justificadas?',
                            icon: 'question',
                            confirmButtonText: 'Sí',
                            cancelButtonText: 'No',
                            showCancelButton: true
                        }).then( async result =>{
                            if (result.isConfirmed) {
                                const faltasDia = [];
                              
                                logosJustify.forEach(async logo => {
                                  const idEmpleado = logo.dataset.id;
                                  const dia = logo.dataset.dia;
                                  const deshabilitados = document.querySelectorAll('input[type="radio"]:not(:checked)');
                              
                                  let faltaDia = {
                                    idEmpleado: idEmpleado,
                                    dia: dia
                                  };
                              
                                  faltasDia.push(faltaDia);
                              
                                  deshabilitados.forEach(radio => {
                                    if (radio.dataset.id == idEmpleado && radio.dataset.dia == dia) {
                                      radio.style.backgroundColor = 'red';
                                      radio.style.borderColor = 'red';
                                    }
                                  });
                              
                                  const inputIcons = document.querySelectorAll('.icon-falta');
                              
                                  inputIcons.forEach(input => {
                                    if (input.dataset.id == idEmpleado && input.dataset.dia == dia) {
                                      input.style.display = 'none';
                                    }
                                  });
                              
                                  logo.style.display = "none";
                                });
                              
                                if (FS !== null && FS !== undefined && FS.length > 0) {
                                  FS = FS.concat(faltasDia);
                                } else {
                                  FS = faltasDia;
                                }
                              
                                const datos = {
                                  llave: "FaltasSemanales",
                                  valor: JSON.stringify(FS)
                                };
                              
                                if (FS.length > faltasDia.length) {
                                  await fetch("/updateItem", {
                                    method: "POST",
                                    headers: {
                                      "Content-Type": "application/json"
                                    },
                                    body: JSON.stringify(datos)
                                  });
                                } else {
                                  await fetch("/crearItem", {
                                    method: "POST",
                                    headers: {
                                      "Content-Type": "application/json"
                                    },
                                    body: JSON.stringify(datos)
                                  });
                                }
                              }else{
                                return Promise.reject();
                            }
                        }).then( async ()=>{

                            Swal.fire({
                                title: '¿Horas extra?',
                                icon: 'question',
                                confirmButtonText: 'Sí',
                                cancelButtonText: 'No',
                                showCancelButton: true
                            }).then( async result => {
                                if(result.isConfirmed){
                                const fila = document.querySelectorAll('input[type="number"]');
                                fila.forEach(fila =>{
                                        fila.disabled = true;
                                });

                                
                                modal.style.display = "block";
                                
                                aplicarAccionesFilas();
                                paginacionModalHoras();
                                
        
                                }else if(result.dismiss === Swal.DismissReason.cancel){
                                    
                                    try{
                                        const respuesta = await fetch('/terminarTurnoSemanalNormal', {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'application/json'
                                            },
                                            body: JSON.stringify({idAsistencia})
                                      
                                        });
        
                                        if(respuesta.ok){
                                            Swal.fire({
                                                title: 'La Semana Laboral Terminó',
                                                text: 'Se han registrado las horas laboradas de los empleados durante la semana',
                                                icon: 'success'
                                              }).then(async () =>{
                                            
                                                /**************************************************SINCRONIZACION LOCALSTORAGE-DB****************************************************** */
                                                //Preparando los datos que se almacenaron previamente en el localStorage para almacenarlos en la base de datos
                                                const datos = {
                                                    llave: 'HorasSemanalesAsignadas',
                                                    valor: 'Asignado'
                                                }
                                                
                                                
                                                //Mandar a llamar la ruta POST para almacenar los datos dentro de la base de datos
                                                await fetch('/crearItem', {
                                                    method: "POST",
                                                    headers: {
                                                    "Content-Type": "application/json"        
                                                    },
                                                    body: JSON.stringify(datos)
                                                });


                                                btnTerminar.style.display = 'none';
                                    
                                              });
                                        }else{
                                            console.error('Existe algun error, favor de revisar');
                                        }
        
        
                                    }catch(err){
                                        console.error(err);
                                    }
        
                                }else{
                                    modal.style.display = "none";
                                }
                                
                            })


                        })
                    
                    
                    }else{

                
                    Swal.fire({
                        title: '¿Horas extra?',
                        icon: 'question',
                        confirmButtonText: 'Sí',
                        cancelButtonText: 'No',
                        showCancelButton: true
                    }).then( async result => {
                        if(result.isConfirmed){
                        const fila = document.querySelectorAll('input[type="number"]');
                        fila.forEach(fila =>{
                                fila.disabled = true;
                        });

                        modal.style.display = "block";
                        paginacionModalHoras();
                        aplicarAccionesFilas();

                        }else if(result.dismiss === Swal.DismissReason.cancel){
                            
                            try{
                                const respuesta = await fetch('/terminarTurnoSemanalNormal', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({idAsistencia})
                              
                                });

                                if(respuesta.ok){
                                    Swal.fire({
                                        title: 'La Semana Laboral Terminó',
                                        text: 'Se han registrado las horas laboradas de los empleados durante la semana',
                                        icon: 'success'
                                      }).then(async () =>{
                                
                                        /**************************************************SINCRONIZACION LOCALSTORAGE-DB****************************************************** */
                                                //Preparando los datos que se almacenaron previamente en el localStorage para almacenarlos en la base de datos
                                                const datos = {
                                                    llave: 'HorasSemanalesAsignadas',
                                                    valor: 'Asignado'
                                                }
                                                
                                                
                                                //Mandar a llamar la ruta POST para almacenar los datos dentro de la base de datos
                                                await fetch('/crearItem', {
                                                    method: "POST",
                                                    headers: {
                                                    "Content-Type": "application/json"        
                                                    },
                                                    body: JSON.stringify(datos)
                                                });


                                        btnTerminar.style.display = 'none';
                            
                                      });
                                }else{
                                    console.error('Existe algun error, favor de revisar');
                                }


                            }catch(err){
                                console.error(err);
                            }

                        }else{
                            modal.style.display = "none";
                        }
                        
                    })

                
                 }

                });

                    


                    // Boton que confirma las horas extra asignadas de forma personalizada
                    document.getElementById('btn-extra').addEventListener('click', async function(e) {
                       
                         e.preventDefault();
                        const idAsistencia = e.target.dataset.id;
                        const inputs = document.querySelectorAll('input[type="number"]');

                        inputs.forEach(input =>{
                            //Obtenermos el id del empleado llamando a la propiedad name del input
                            const idEmpleado = input.name;
                            
                            const value = input.value;


                            if(input.disabled == false && value > 0){
                                
                                    // Crear un objeto para almacenar los horarios del empleado
                                if (!horas[idEmpleado]) {
                                    horas[idEmpleado] = {
                                        lunes: '',
                                        martes: '',
                                        miercoles: '',
                                        jueves: '',
                                        viernes: '',
                                        sabado: ''
                                    };
                                }

                                // Establecer el horario en el objeto de horarios
                                const dia = input.dataset.dia;
                                horas[idEmpleado][dia] = parseInt(value) + 8;
                            
                            
                            
                            }else if((input.disabled == false && input.value == 0) || (input.readOnly == true && input.value == 0)){
                            
                                
                                    if (!horas[idEmpleado]) {
                                        horas[idEmpleado] = {
                                            lunes: '',
                                            martes: '',
                                            miercoles: '',
                                            jueves: '',
                                            viernes: '',
                                            sabado: ''
                                        };
                                    }
                                    const dia = input.dataset.dia;
                                    horas[idEmpleado][dia] = 8;

                            }else{
                                if (!horas[idEmpleado]) {
                                    horas[idEmpleado] = {
                                        lunes: '',
                                        martes: '',
                                        miercoles: '',
                                        jueves: '',
                                        viernes: '',
                                        sabado: ''
                                    };
                                }
                                const dia = input.dataset.dia;
                                horas[idEmpleado][dia] = null;


                            }
                        });

                        try{
                            const respuesta = await fetch('/terminarTurnoSemanalCustom', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({idAsistencia,horas})
                          
                            });

                            if(respuesta.ok){
                                Swal.fire({
                                    title: 'Horas Extra Registradas',
                                    text: 'Se registraron las horas extra de la semana',
                                    icon: 'success'
                                }).then(async () =>{
                                    
                                    modal.style.display = 'none';

                                    checksModal.forEach(checkbox => {
                                        checkbox.checked = false;
                                    });

                                    inputsNumero.forEach(input => {
                                        input.value = '';
                                    })
                                
        
                                    /**************************************************SINCRONIZACION LOCALSTORAGE-DB****************************************************** */
                                                //Preparando los datos que se almacenaron previamente en el localStorage para almacenarlos en la base de datos
                                                const datos = {
                                                    llave: 'HorasSemanalesAsignadas',
                                                    valor: 'Asignado'
                                                }
                                                
                                                
                                                //Mandar a llamar la ruta POST para almacenar los datos dentro de la base de datos
                                                await fetch('/crearItem', {
                                                    method: "POST",
                                                    headers: {
                                                    "Content-Type": "application/json"        
                                                    },
                                                    body: JSON.stringify(datos)
                                                });


                                    btnTerminar.style.display = 'none';
                                  
                                })
                            }else{
                                console.error('Existe algun error. Favor de revisarlo');
                            }
                            

                        }catch(err){
                            console.error("Existe un error: "+err);
                        }

                        
                    });

    }else if((FI != 0 && FI != undefined) && (FF != 0 && FF != undefined) && !(hoy>= FI && hoy<= FF)){
            
            btnGuardar.disabled = false;
            
            const llave1 = "fechaInicio";

            await fetch(`/deleteItem/${llave1}`, {
            method: "DELETE" 
            })
            .then(res => {
            // Verificar que se eliminó
            if(res.ok) {
                console.log("Item fechaInicio eliminado");
                    
            }
            })

            const llave2 = "fechaFin";

            await fetch(`/deleteItem/${llave2}`, {
            method: "DELETE" 
            })
            .then(res => {
            // Verificar que se eliminó
            if(res.ok) {
                console.log("Item fechaFin eliminado");
                    
            }
            })

            if(HSA == "Asignado"){
                const llave = "HorasSemanalesAsignadas";

                await fetch(`/deleteItem/${llave}`, {
                method: "DELETE" 
                })
                .then(res => {
                // Verificar que se eliminó
                if(res.ok) {
                    console.log("Item HorasSemanalesAsignadas eliminado");
            
                }
                })
            }

            if(JS.length > 0){
                const llave = "JustificacionesSemanales";

                await fetch(`/deleteItem/${llave}`, {
                method: "DELETE" 
                })
                .then(res => {
                // Verificar que se eliminó
                if(res.ok) {
                    console.log("Item JustificacionesSemanales eliminado");
                    
                }
                })
            }

            if(FS.length > 0){
                const llave = "FaltasSemanales";

                await fetch(`/deleteItem/${llave}`, {
                method: "DELETE" 
                })
                .then(res => {
                // Verificar que se eliminó
                if(res.ok) {
                    console.log("Item FaltasSemanales eliminado");
                    
               
                }
                })
            }






    
    }
        


//Mostrar sidebar
menuBtn.addEventListener('click', () =>{
    
    sideMenu.classList.add('show-sidebar');
});

//Ocultar sidebar
closeBtn.addEventListener('click', () =>{
    
    sideMenu.classList.remove('show-sidebar');
});

//Cambiar tema
themeToggler.addEventListener('click', ()=>{document.body.classList.toggle('dark-theme-variables');

    themeToggler.querySelector('span:nth-child(1)').classList.toggle('active');
    themeToggler.querySelector('span:nth-child(2)').classList.toggle('active');

});



//Codigo que determina el estado de los radiobuttons (checked or not checked)
radios.forEach(radio =>{
    const dia = radio.dataset.dia;
    const idEmpleado = radio.dataset.id;
    let estadoRadios = false;
    radio.addEventListener('click', ()=>{
        radio.checked = estadoRadios;
        console.log(estadoRadios);
        if(radio.checked) {
            radio.checked = false;
            estadoRadios = false;
          } else {
            radio.checked = true; 
            estadoRadios = true;
          }

        if(estadoRadios == true){
            radio.dataset.estado = 'activo';
            habilitarHora(idEmpleado, dia);
        }else{
            radio.dataset.estado = 'inactivo';
            deshabilitarHora(idEmpleado, dia); 
        }

          return estadoRadios;
    });



});




//Dar de alta asistencia semanal
formSemanal.addEventListener('submit', async e =>{

        e.preventDefault();

        Swal.fire({
            title: '¿Todos los empleados llegaron a tiempo?',
            icon: 'question',
            confirmButtonText: 'Sí',
            cancelButtonText: 'No',
            showCancelButton: true
        }).then( async result => {

         if (result.isConfirmed) {

                radios.forEach(radio =>{
                    const idEmpleado = radio.dataset.id;
                    console.log(idEmpleado);
                    console.log(asistencias_semanales[idEmpleado]);  
                    if(!asistencias_semanales[idEmpleado]) {
                        asistencias_semanales[idEmpleado] = [];
                    }
                    
                    const registroAsistencia = {
                        dia: radio.dataset.dia,
                        valorAsistencia: radio.checked ? 1 : 0
                    };
                    console.log(registroAsistencia);
                    
                    asistencias_semanales[idEmpleado].push(registroAsistencia);
        
        
                });


            try{
                
                        const respuesta = await fetch('/crearAsistenciaSemanal', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({asistencias_semanales})
        
                    
        
                    });
        
                    if(respuesta.ok){
                        Swal.fire({
                            title: 'Asistencia Guardada',
                            text: 'Todas las asistencias de la semana se registraron a las 10:00',
                            icon: 'success'
                        }).then(async () => {
                            
                            
                            radios.forEach(radio =>{
                                radio.disabled = true;
                            });
                           
                
                            let hoy = new Date();

                        const diaSemana = hoy.getDay();
                    
                        const fechaInicio = new Date(
                            hoy.getFullYear(),
                            hoy.getMonth(),
                            hoy.getDate() - diaSemana + 1
                    
                            );
                    
                            const fechaFin = new Date (
                                fechaInicio.getFullYear(),
                                fechaInicio.getMonth(),
                                fechaInicio.getDate() + 5
                            );
                    
                            hoy = Intl.DateTimeFormat('en-CA', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit'
                            }).format(hoy);
                    
                            const inicioSemana = Intl.DateTimeFormat('en-CA', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit'
                            }).format(fechaInicio);
                            
                            const finSemana = Intl.DateTimeFormat('en-CA', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit'
                            }).format(fechaFin);
                    
                           
                            
                            /**************************************************SINCRONIZACION LOCALSTORAGE-DB****************************************************** */
                            //Preparando los datos que se almacenaron previamente en el localStorage para almacenarlos en la base de datos
                            const datos1 = {
                                llave: 'fechaInicio',
                                valor: inicioSemana
                            }
                            
                            
                            //Mandar a llamar la ruta POST para almacenar los datos dentro de la base de datos
                            await fetch('/crearItem', {
                                method: "POST",
                                headers: {
                                "Content-Type": "application/json"        
                                },
                                body: JSON.stringify(datos1)
                            });


                             /**************************************************SINCRONIZACION LOCALSTORAGE-DB****************************************************** */
                            //Preparando los datos que se almacenaron previamente en el localStorage para almacenarlos en la base de datos
                            const datos2 = {
                                llave: 'fechaFin',
                                valor: finSemana
                            }
                            
                            
                            //Mandar a llamar la ruta POST para almacenar los datos dentro de la base de datos
                            await fetch('/crearItem', {
                                method: "POST",
                                headers: {
                                "Content-Type": "application/json"        
                                },
                                body: JSON.stringify(datos2)
                            });
  
                            
                            if(hoy>= inicioSemana && hoy<= finSemana){
                                btnGuardar.disabled = true;
                            }else{
                                //Apartado de remover elementos de la tabla del localstorage
                          
                                btnGuardar.disabled = false;
            
                                //Eliminar registros de la tabla de localstorage




                            }
                            mostrarIconoSemanal();
                            window.location.href = "/asistenciaSemanalPost";
                        

                            
                        });
                    }
        
            }catch(err){
                    res.status(500).json({mensaje: err.message});
                }


               
          }else if(result.dismiss === Swal.DismissReason.cancel){
           
            
            var inputs = document.querySelectorAll('#modal2 input[type="time"]');
            inputs.forEach(input => {
            input.style.display = "none";
            });
            
            modal2.style.display = 'block';
            paginacionModalHorarios();
      
          }else{
            modal2.style.display = 'none';
          }
        });
    

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





///Cuando el usuario da click fuera de la pantalla modal
window.onclick = (e) => {
    
    if(e.target === modal){
        checksModal.forEach(checkbox => {
            checkbox.checked = false;
          });

          inputsNumero.forEach(input => {
            input.value = '';
          })


        modal.style.display = "none";   
    }

    if(e.target === modal2){
        inputs.forEach(input => {
          input.value = "";
        });
  
      checkboxes.forEach(checkbox => {
          checkbox.checked = false;
        });
  
        document.getElementById('confirmar').disabled = true;
  
      modal2.style.display = "none";
      }

    if (e.target === modal3){
        modal3.style.display = "none";

        checksModal3.forEach(good => {
          good.checked = false;
        });
       
        textarea.disabled = true;
        textarea.value = "";
        btn_Terminar.disabled = true;


    }
}



  // Desactivar el boton mientras no exista algun input de la hora ingresada
    document.getElementById("confirmar").disabled = true;

    var inputs = document.querySelectorAll('#modal2 input[type="time"]');


    inputs.forEach(function(input) {
    
    input.addEventListener('input', function() { 
    
      if(this.value !== "") {
      document.getElementById("confirmar").disabled = false;
      } else {
       
      var todosVacios = Array.from(inputs).every(x => x.value === "");  
      
      if(todosVacios) {
          document.getElementById("confirmar").disabled = true;  
      }
      }
    
    });
    
    });
    
    
            ///Mensaje de confirmación de Asistencia una vez se establezcan los horarios de entrada personalizados 
            document.getElementById('confirmar').addEventListener('click', async function() {
            

                    radios.forEach(radio =>{
                        const idEmpleado = radio.dataset.id;
                        console.log(idEmpleado);
                        console.log(asistencias_semanales[idEmpleado]);  
                        if(!asistencias_semanales[idEmpleado]) {
                            asistencias_semanales[idEmpleado] = [];
                        }
                        
                        const registroAsistencia = {
                            dia: radio.dataset.dia,
                            valorAsistencia: radio.checked ? 1 : 0
                        };
                        console.log(registroAsistencia);
                        
                        asistencias_semanales[idEmpleado].push(registroAsistencia);
            
            
                    });
                    
                    // Selecciona todos los inputs de tiempo con la clase "input-time"
                    const inputs = document.querySelectorAll('.input-time');

                    // Inicializa un objeto para agrupar los horarios de cada idEmpleado
                    const horarios = {};

                    // Iterar sobre cada input de tiempo
                    inputs.forEach(input => {
                        // Obtener el valor del input
                        const value = input.value;

                        // Obtener el idEmpleado del input
                        const idEmpleado = input.dataset.name;

                        // Si el valor del input no está vacío
                        if (value !== '') {
                            // Crear un objeto para almacenar los horarios del empleado
                            if (!horarios[idEmpleado]) {
                                horarios[idEmpleado] = {
                                    lunes: '',
                                    martes: '',
                                    miercoles: '',
                                    jueves: '',
                                    viernes: '',
                                    sabado: ''
                                };
                            }

                            // Establecer el horario en el objeto de horarios
                            const dia = input.dataset.dia;
                            horarios[idEmpleado][dia] = value;
                        } else if(input.disabled && value === ''){
                            if (!horarios[idEmpleado]) {
                                horarios[idEmpleado] = {
                                    lunes: '',
                                    martes: '',
                                    miercoles: '',
                                    jueves: '',
                                    viernes: '',
                                    sabado: ''
                                };
                            }
                            const dia = input.dataset.dia;
                            horarios[idEmpleado][dia] = '';
                        }
                        else {
                            // Si el valor del input está vacío, establecer el horario en 10:00
                            if (!horarios[idEmpleado]) {
                                horarios[idEmpleado] = {
                                    lunes: '',
                                    martes: '',
                                    miercoles: '',
                                    jueves: '',
                                    viernes: '',
                                    sabado: ''
                                };
                            }
                            const dia = input.dataset.dia;
                            horarios[idEmpleado][dia] = '10:00';
                        }
                    });

                  const objetos = {
                    asistencias_semanales: {asistencias_semanales},
                    horarios: {horarios}
                  }


                
                    try{
                        const respuesta = await fetch('/crearAsistenciaSemanalTardia' ,{
        
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(objetos)
                        });


                    if(respuesta.ok){
                        Swal.fire({
                            title: 'Asistencia Guardada',
                            text: 'La asistencia semanal se ha registrado correctamente',
                            icon: 'success'
                        }).then( async () => {
                            
                            radios.forEach(radio =>{
                                radio.disabled = true;
                            });   
                            
                            let hoy = new Date();

                            const diaSemana = hoy.getDay();
                        
                            const fechaInicio = new Date(
                                hoy.getFullYear(),
                                hoy.getMonth(),
                                hoy.getDate() - diaSemana + 1
                        
                                );
                        
                                const fechaFin = new Date (
                                    fechaInicio.getFullYear(),
                                    fechaInicio.getMonth(),
                                    fechaInicio.getDate() + 5
                                );
                        
                                hoy = Intl.DateTimeFormat('en-CA', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit'
                                }).format(hoy);
                        
                                const inicioSemana = Intl.DateTimeFormat('en-CA', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit'
                                }).format(fechaInicio);
                                
                                const finSemana = Intl.DateTimeFormat('en-CA', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit'
                                }).format(fechaFin);
                        
            
                                
                            /**************************************************SINCRONIZACION LOCALSTORAGE-DB****************************************************** */
                            //Preparando los datos que se almacenaron previamente en el localStorage para almacenarlos en la base de datos
                            const datos1 = {
                                llave: 'fechaInicio',
                                valor: inicioSemana
                            }
                            
                            
                            //Mandar a llamar la ruta POST para almacenar los datos dentro de la base de datos
                            await fetch('/crearItem', {
                                method: "POST",
                                headers: {
                                "Content-Type": "application/json"        
                                },
                                body: JSON.stringify(datos1)
                            });


                             /**************************************************SINCRONIZACION LOCALSTORAGE-DB****************************************************** */
                            //Preparando los datos que se almacenaron previamente en el localStorage para almacenarlos en la base de datos
                            const datos2 = {
                                llave: 'fechaFin',
                                valor: finSemana
                            }
                            
                            
                            //Mandar a llamar la ruta POST para almacenar los datos dentro de la base de datos
                            await fetch('/crearItem', {
                                method: "POST",
                                headers: {
                                "Content-Type": "application/json"        
                                },
                                body: JSON.stringify(datos2)
                            });
                        
                        
                                if(hoy>= inicioSemana && hoy<=finSemana){
                                    btnGuardar.disabled = true;
                                    
                                }
                                window.location.href = "/asistenciaSemanalPost";
                                
                                
                        });
                    }

                    }catch(err){
                        res.status(500).json({mensaje: err.message});
                    }

                    

                //Devolver todos los datos a su estado original
                  document.getElementById("confirmar").disabled = true;
                  inputs.forEach(input => {
                      input.value = "";
                    });
          
                  checkboxes.forEach(checkbox => {
                      checkbox.checked = false;
                    });
          
                  modal2.style.display = "none";
    
    
                  mostrarIconoSemanal(); 
                 
         
               
          });
    

checkJustificado.addEventListener('click', alternarChecks);
checkNoJustificado.addEventListener('click', alternarChecks);
justificado.addEventListener("click", habilitarBtn);
noJustificado.addEventListener("click", habilitarBtn);

        
        btn_Terminar.disabled = true;
        const area = document.querySelector("#descripcion");
        area.addEventListener("keyup", validarTextArea);


//////////////Abrir Explorador de Archivos Adjuntar Evidencia
document.getElementById('adjuntar').addEventListener('click', () => {
  document.getElementById('file-input').click();
});

// Codigo que hace que almacenemos las faltas justificadas/no justificadas 
  /////Mensaje de Justificación
  btn_Terminar.addEventListener('click', async e =>{
    e.preventDefault();

    const dia = e.target.dataset.dia;
    const idEmpleado = e.target.dataset.id;
    const fechaInicio = FI;
    const fechaFin = FF;
    const motivo = textarea.value;

    if(justificado.checked){

        try{
            const respuesta = await fetch('/justificarFaltasSemanales', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({idEmpleado, dia, fechaInicio, fechaFin, motivo})
          
            });

            if(respuesta.ok){
                Swal.fire({
                    title: 'Acción Realizada',
                    text: 'Falta Justificada',
                    icon: 'success'
                }).then(async () =>{
                    const deshabilitados = document.querySelectorAll('input[type="radio"]:not(:checked)');
                    // Obtener el objeto de justificaciones almacenado en el localstorage
                    let justificacionesSemanales = {};

                    // Crear un objeto de justificacion para el dia actual
                    let justificacionDia = {
                        idEmpleado: idEmpleado,
                        dia: dia,
                        fechaInicio: fechaInicio,
                        fechaFin: fechaFin,
                        motivo: motivo
                    };

                    const empleadoIndex = JS.findIndex(empleado => empleado.idEmpleado === idEmpleado);


                    // Verificar si el item ya existe en el localstorage
                    if (empleadoIndex !== -1) {
                        // Modificar el objeto de justificaciones
                        JS.splice(empleadoIndex + 1, 0, justificacionDia);

                        const datos = {
                            llave: "JustificacionesSemanales",
                            valor: JSON.stringify(JS)
                        }
                        
                        await fetch("/updateItem", {
                          method: "POST",
                          headers: {
                              "Content-Type": "application/json"        
                          },
                          body: JSON.stringify(datos)
                        })  

                        deshabilitados.forEach(radio =>{

                            if(radio.dataset.id == idEmpleado && radio.dataset.dia == dia){
                                radio.style.backgroundColor= 'orange';
                                radio.style.borderColor = 'orange';
                            }


                        });


                    }else if(empleadoIndex === -1 && JS !== null && JS !== undefined && JS.length > 0 ){ 

                        console.log("Se ha agregado otro empleado al objeto");
                         JS.push(justificacionDia)

                         const datos = {
                            llave: "JustificacionesSemanales",
                            valor: JSON.stringify(JS)
                        }
                        
                        await fetch("/updateItem", {
                          method: "POST",
                          headers: {
                              "Content-Type": "application/json"        
                          },
                          body: JSON.stringify(datos)
                        })  


                    }else {
                        // Crear un nuevo objeto de justificaciones
                        justificacionesSemanales[idEmpleado] = [justificacionDia];

                        //*****************************MODIFICACION DEL ARREGLO JUSTIFICACIONES TANTO EN EL LOCALSTORAGE COMO EN LA DB************************************************************* */

                        const datos = {
                            llave: "JustificacionesSemanales",
                            valor: JSON.stringify(justificacionesSemanales[idEmpleado])
                         }
                         
                         await fetch("/crearItem", {
                           method: "POST",
                           headers: {
                              "Content-Type": "application/json"        
                           },
                           body: JSON.stringify(datos)
                         })  
          
                        
                    }


                    deshabilitados.forEach(radio =>{

                        if(radio.dataset.id == idEmpleado && radio.dataset.dia == dia){
                            radio.style.backgroundColor= 'orange';
                            radio.style.borderColor = 'orange';
                        }

                    });

                    const inputIcons = document.querySelectorAll('.icon-falta');

                    inputIcons.forEach(input=>{
                        if(input.dataset.id == idEmpleado && input.dataset.dia == dia){
                            input.style.display = 'none';
                        }
                });
                    window.location.reload();

                });


                
            }
        }catch(err){
            console.error("Ha ocurrido un error: "+err);
        }



    }else if(noJustificado.checked){
        Swal.fire({
            title: 'Acción Realizada',
            text: 'Falta no Justificada',
            icon: 'success'
        }).then( async () =>{

            const deshabilitados = document.querySelectorAll('input[type="radio"]:not(:checked)');
                    // Obtener el objeto de justificaciones almacenado en el localstorage
                    let faltasSemanales =  {};

                    // Crear un objeto de justificacion para el dia actual
                    let faltaDia = {
                        idEmpleado: idEmpleado,
                        dia: dia
                    };



                    const empleadoIndex = FS.findIndex(empleado => empleado.idEmpleado === idEmpleado);


                    // Verificar si el item ya existe en el localstorage
                    if (empleadoIndex !== -1) {
                        // Modificar el objeto de justificaciones
                        FS.splice(empleadoIndex + 1, 0, faltaDia);

                        const datos = {
                            llave: "FaltasSemanales",
                            valor: JSON.stringify(FS)
                        }
                        
                        await fetch("/updateItem", {
                          method: "POST",
                          headers: {
                              "Content-Type": "application/json"        
                          },
                          body: JSON.stringify(datos)
                        })  

                       


                    }else if(empleadoIndex === -1 && FS !== null && FS !== undefined && FS.length > 0){ 

                        console.log("Se ha agregado otro empleado al objeto");
                         FS.push(faltaDia)

                         const datos = {
                            llave: "FaltasSemanales",
                            valor: JSON.stringify(FS)
                        }
                        
                        await fetch("/updateItem", {
                          method: "POST",
                          headers: {
                              "Content-Type": "application/json"        
                          },
                          body: JSON.stringify(datos)
                        })  


                    }else {
                        // Crear un nuevo objeto de justificaciones
                        faltasSemanales[idEmpleado] = [faltaDia];

                        //*****************************MODIFICACION DEL ARREGLO JUSTIFICACIONES TANTO EN EL LOCALSTORAGE COMO EN LA DB************************************************************* */

                        const datos = {
                            llave: "FaltasSemanales",
                            valor: JSON.stringify(faltasSemanales[idEmpleado])
                         }
                         
                         await fetch("/crearItem", {
                           method: "POST",
                           headers: {
                              "Content-Type": "application/json"        
                           },
                           body: JSON.stringify(datos)
                         })  
                        
                        }

                        deshabilitados.forEach(radio =>{

                            if(radio.dataset.id == idEmpleado && radio.dataset.dia == dia){
                                radio.style.backgroundColor= 'red';
                                radio.style.borderColor = 'red';
                            }


                        });

                        const inputIcons = document.querySelectorAll('.icon-falta');

                        inputIcons.forEach(input=>{
                            if(input.dataset.id == idEmpleado && input.dataset.dia == dia){
                                input.style.display = 'none';
                            }
                        });

                        window.location.reload();    

        });

        
    }


    modal3.style.display = 'none';

    checksModal3.forEach(good => {
        good.checked = false;
    });

    textarea.value = "";

    btn_Terminar.disabled = true;


  });

  
    //FECHA ACTULA
    var fecha = new Date(); // obtiene la fecha actual
    var dia = fecha.getDate();
    var mes = fecha.getMonth() + 1; // los meses en JavaScript empiezan desde 0
    var ano = fecha.getFullYear();

    if(dia < 10) {
    dia = '0' + dia; // añade un cero si el día es menor que 10
    } 

    if(mes < 10) {
    mes = '0' + mes // añade un cero si el mes es menor que 10
    } 

    fecha = ano + '-' + mes + '-' + dia;

})();    