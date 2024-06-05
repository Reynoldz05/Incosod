
    /**************************************************  APARTADO DE VARIABLES ***************************************************/
const sideMenu = document.querySelector("aside");
const menuBtn = document.querySelector("#menu-btn");
const closeBtn = document.querySelector("#close-btn");
const themeToggler = document.querySelector(".theme-toggler");
const asistencias = {};
const horarios = {};
const horas = {};
let justificaciones = [];
let faltas = [];
let asistenciaRadios = [];
let divRemovidos = {};
const btnguardar = document.querySelector('.btn-guardar');
const btnTerminar = document.querySelector('.btn-terminar');
const btn_Terminar = document.querySelector('#modal3 button');
const btnConfirmar = document.getElementById('confirmar-turno');
const radios = document.querySelectorAll('.radio-btn');
const faltaIconos = [];
const  modal2 = document.getElementById('modal2');
var checkboxes = document.querySelectorAll('#modal input[type="checkbox"]');
var inputs = document.querySelectorAll('#modal input[type="text"]');
const checksModal2 = document.querySelectorAll('#modal2 input[type="checkbox"]');
const numerosModal2 = document.querySelectorAll('#modal2 input[type="number"]');
const checksModal3 = document.querySelectorAll('#modal3 input[type="checkbox"]');

    let value = 0;
    let horasAsignadas = "";
    let justificacionesDiarias = [];
    let faltasDiarias = [];
    async function fetchFechaModificacion() {
      try{
        const respuesta = await fetch('/sincronizar-data?llave=fechaModificacion');
      
        const datos = await respuesta.json();
        
        if(datos){
        
          const {valor} = datos;
      
          console.log("Fecha modificacion: "+valor);
      
          value = valor;
      
        } else {
        
          console.error('No se encontró dato');
        
        }
      } catch (err) {

        console.error(err);
      }
    

    }

    async function fetchHorasAsignadas() {

      try{
        const respuesta = await  fetch('/sincronizar-data?llave=HorasAsignadas');
        const datos = await respuesta.json();

        if(datos){
          const {valor} =  datos;

          console.log("Horas Asignadas: "+valor);
          horasAsignadas = valor;
        }else {
        
          console.error('No se encontró dato');
        
        }


      }catch(err){
        console.error(err);
      }

    }

    async function fetchJustificaciones(){

      try{

        const respuesta =  await fetch('/sincronizar-data?llave=Justificaciones');
        const datos = await respuesta.json();

        if(datos){
          const {valor} = datos;
          justificacionesDiarias = JSON.parse(valor);
        }else{
          console.error('No se encontró dato');
        }

      }catch(err){
        console.error(err);
      }

    }


    async function fetchFaltas(){

      try{

        const respuesta =  await fetch('/sincronizar-data?llave=Faltas');
        const datos = await respuesta.json();

        if(datos){
          const {valor} = datos;
          console.log(valor);
          faltasDiarias = JSON.parse(valor);
          
        }else{
          console.error('No se encontró dato');
        }

      }catch(err){
        console.error(err);
      }

    }


     ///Habilitar los botones de horas extra

  function toggleHorasExtra(checkboxID, inputHoraID) {
    const inputHoras = document.getElementById(inputHoraID);
  
    const checkbox = document.getElementById(checkboxID);
    if(checkbox.checked) {
        inputHoras.style.display = 'block';
    } else {
        inputHoras.style.display = 'none'; 
    }
  
    }


       //Mostrar u ocultar los inputs de la hora de llegada
       function toggleInput(checkboxId,id) {
        var input = document.getElementById(id);
        var checkbox = document.getElementById(checkboxId); 
        input.style.display = "none";
        if (checkbox.checked) {
        input.style.display = "block";
        } else {
        input.style.display = "none";
        input.value = "";
        }
    }

    function mostrarIconoPagina() {

      // Recorre la tabla buscando radios de inasistencia
      const inasistencias = document.querySelectorAll('input[value="0"]');
      
      inasistencias.forEach(radio => {

          if(radio.checked) {
            const idEmpleado = radio.id;
            const td = radio.closest('td');

            const falta = document.createElement('span');
            falta.innerHTML = '<i data-id="'+idEmpleado+'" class="material-icons icon-falta">description</i>';

            falta.addEventListener('click', e => {
              const idIcono = e.target.dataset.id;
              abrirModalJustificacion(idEmpleado, idIcono); 

            });

            faltaIconos.push(falta);
              
            td.appendChild(falta);

            const logosJustify = document.querySelectorAll('.icon-falta');

          //Recorre cada uno de los logotipos para identificar si la falta fue justificada para posteriormente colocar un background color orange al radio 
            logosJustify.forEach(logo =>{

                const idLogo = logo.dataset.id;
              //Detectar si hay un arreglo de justificaciones en el local storage  
               if(justificacionesDiarias != 0 && justificacionesDiarias != undefined && justificacionesDiarias != null){
                const arreglo = justificacionesDiarias;
              //Condicion que evalúa si el arreglo de justificaciones contiene el id del logo de justificaciones
                  if(arreglo.includes(idLogo)){
                    radios.forEach(radio =>{
                      //Si el arreglo de justificaciones contiene el id del radio y si el radio corresponde a un radio de inasistencia
                      if(arreglo.includes(radio.id) && radio.dataset.asistencia == 'inasistencia'){
                        radio.style.backgroundColor= 'orange';
                        radio.style.borderColor = 'orange';
                        logo.style.display = 'none';
                      }
                    });
                   
                  }
               }
               //Condicion que evalúa si existe un array de faltas dentro del local storage
               if(faltasDiarias != 0 && faltasDiarias != undefined && faltasDiarias != null){
                const arregloFaltas = faltasDiarias;
                //Evalúa si dentro del arreglo de faltas se encuentra el id del logo de justificacion
                if(arregloFaltas.includes(idLogo)){
                radios.forEach(radio =>{
                  //Evalúa si dentro del arreglo de faltas se encuentra el id del radio button y también si el radio button corresponde al de inasistencia
                  if(arregloFaltas.includes(radio.id) && radio.dataset.asistencia == 'inasistencia'){
                    radio.style.backgroundColor= 'red';
                    radio.style.borderColor = 'red';
                    logo.style.display = 'none';
                  }
                  
                });
               
              }
              
              
              }

            });
         
        
          }
        
        });
    
    }

     ///Función para abrir la pantalla modal de Justificación
     function abrirModalJustificacion(id, idIcon) {

      const modal3 = document.getElementById('modal3');
      modal3.style.display = 'block';
      const textarea = document.getElementById('descripcion');
      textarea.disabled = true;
      const idEmpleado = id;
      btn_Terminar.dataset.id = idEmpleado;

      const inputsSpanFaltas = document.querySelectorAll('.icon-falta');
      inputsSpanFaltas.forEach(input =>{
        
      });

     
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


//PAGINACION MODAL DE ESTABLECER HORARIOS DE LLEGADA DE LOS EMPLEADOS

var divsPerPage = 3;
var paginaActual = 1;
function paginacionModalEntrada(){
var divs = document.querySelectorAll('.empleadoModal');
var totalPages = Math.ceil(divs.length / divsPerPage);

 // Oculta todas las filas
 for (var i = 0; i < divs.length; i++) {
  divs[i].style.display = 'none';
}

// Muestra solo las filas para la página actual
for (var i = (paginaActual - 1) * divsPerPage; i < paginaActual * divsPerPage && i < divs.length; i++) {
  divs[i].style.display = '';
}

// Crea los botones de paginación
var pagination = document.querySelector('#paginationModalEntrada');
pagination.innerHTML = '';
for (var i = 1; i <= totalPages; i++) {
var btn = document.createElement('button');
btn.textContent = i;
btn.addEventListener('click', function(e) {
  paginaActual = parseInt(e.target.textContent);
  paginacionModalEntrada();
});
// Añade la clase 'boton-activo' al botón de la página actual
if (i === paginaActual) {
  btn.classList.add('boton-activo');
}
pagination.appendChild(btn);
}

// Crea el botón de "Página anterior"
var prevPageBtn = document.createElement('button');
prevPageBtn.textContent = 'Página anterior';
prevPageBtn.addEventListener('click', function() {
  if (paginaActual > 1) {
      paginaActual--;
      paginacionModalEntrada();
  }
});
pagination.insertBefore(prevPageBtn, pagination.firstChild);

// Muestra u oculta el botón de "Página anterior"
prevPageBtn.style.display = (paginaActual === 1) ? 'none' : 'inline-block';

// Añade el botón de "Última página"
var lastPageBtn = document.createElement('button');
lastPageBtn.textContent = 'Última página';
lastPageBtn.addEventListener('click', function() {
paginaActual = totalPages;
  paginacionModalEntrada();
});
pagination.appendChild(lastPageBtn);

}

divsPerPage = 3;
paginaActual = 1;

function paginacionModalHoras(){
  var divs = document.querySelectorAll('.employeesModal');
  var totalPages = Math.ceil(divs.length / divsPerPage);
  
   // Oculta todas las filas
   for (var i = 0; i < divs.length; i++) {
    divs[i].style.display = 'none';
  }
  
  // Muestra solo las filas para la página actual
  for (var i = (paginaActual - 1) * divsPerPage; i < paginaActual * divsPerPage && i < divs.length; i++) {
    divs[i].style.display = '';
  }
  
  // Crea los botones de paginación
  var pagination = document.querySelector('#paginationModalHoras');
  pagination.innerHTML = '';
  for (var i = 1; i <= totalPages; i++) {
  var btn = document.createElement('button');
  btn.textContent = i;
  btn.addEventListener('click', function(e) {
    paginaActual = parseInt(e.target.textContent);
    paginacionModalHoras();
  });
  // Añade la clase 'boton-activo' al botón de la página actual
  if (i === paginaActual) {
    btn.classList.add('boton-activo');
  }
  pagination.appendChild(btn);
  }
  
  // Crea el botón de "Página anterior"
  var prevPageBtn = document.createElement('button');
  prevPageBtn.textContent = 'Página anterior';
  prevPageBtn.addEventListener('click', function() {
    if (paginaActual > 1) {
        paginaActual--;
        paginacionModalHoras();
    }
  });
  pagination.insertBefore(prevPageBtn, pagination.firstChild);
  
  // Muestra u oculta el botón de "Página anterior"
  prevPageBtn.style.display = (paginaActual === 1) ? 'none' : 'inline-block';
  
  // Añade el botón de "Última página"
  var lastPageBtn = document.createElement('button');
  lastPageBtn.textContent = 'Última página';
  lastPageBtn.addEventListener('click', function() {
  paginaActual = totalPages;
    paginacionModalHoras();
  });
  pagination.appendChild(lastPageBtn);
  
  }



(async () =>{


  await fetchFechaModificacion();
  await fetchHorasAsignadas();
  await fetchJustificaciones();
  await fetchFaltas();
  

function generateDateString(date = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date);
}

const hoy = String(generateDateString());
console.log("Dato global DB: "+value);
console.log("Dato global horas asignadas: "+horasAsignadas);
console.log("Array de Justificaciones desde DB: "+justificacionesDiarias);
console.log("Array de faltas diarias desde DB: "+faltasDiarias);

 //Evalúa si la fecha correspondiente al item de fechaModificacion es igual a la fecha actual 
 if((value != 0 && value != undefined) && value == hoy ) {
    //Evalúa si existe un elemento denominado como HorasAsignadas dentro del local storage
    if(horasAsignadas == 'Asignado'){
      btnTerminar.style.display = 'none';
    }else{
      btnTerminar.style.display = '';
    }

  

  btnguardar.disabled = true;
  btnTerminar.disabled = false;
  const iconsJustify = document.querySelectorAll('.icon-falta');
  console.log(iconsJustify.length);
  radios.forEach(radio =>{
    
    iconsJustify.forEach(icon =>{
      const idIcon = radio.id;
      console.log(iconsJustify.length);
      if(localStorage.getItem('Asistencia "'+idIcon+'"')){
        icon.style.display = 'none';
     }
   });
   radio.disabled = true;
   });
  fetch('/asistencias?fecha=' + hoy)
  .then(response => response.json())
   .then(data => {
      
       const result = [];
       data.forEach(asistencia => {

           result.push(asistencia['asistencia']);
       
     });
        
       pintarAsistencias(result);
   });

  function pintarAsistencias(asistencias){
   
   const empleados = document.querySelectorAll('.employees');
   const radios_asistencias = document.querySelectorAll('.asistencia');
   const radios_inasistencias = document.querySelectorAll('.inasistencia');
   let buttons_asistencias = [];
   let buttons_inasistencias = [];
   radios_asistencias.forEach(radio_as =>{
       buttons_asistencias.push(radio_as);
   });

   radios_inasistencias.forEach(radio_in =>{
       buttons_inasistencias.push(radio_in);
   });

   
       for(let j = 0; j<empleados.length; j++){
           if(asistencias[j] === 1){
                   buttons_asistencias[j].checked = true;
               }else if(asistencias[j] === 0){
                   buttons_inasistencias[j].checked = true;
               }

               
       }
      
       mostrarIconoPagina(); 
  }

 

  btnTerminar.addEventListener('click', function(e) {
    e.preventDefault();
    const idAsistencia = e.target.dataset.id;
    const logosJustify = document.querySelectorAll('.icon-falta:not([style*="display: none"])');
    console.log('Logos justificacion: '+logosJustify.length);

      //Ejecutar en caso de que no se hayan terminado de justificar/no justificar todas las faltas 

      if(logosJustify.length > 0){

        Swal.fire({
          title: 'Aun quedan faltas sin justificar. Desea establecerlas como no justificadas?',
          icon: 'question',
          confirmButtonText: 'Sí',
          cancelButtonText: 'No',
          showCancelButton: true
      }).then(async result => {

        if (result.isConfirmed){
          const faltasDia = [];
          logosJustify.forEach(async logo => {

            const idEmpleado = logo.dataset.id;

            radios.forEach(radio =>{

              if(radio.id == idEmpleado && radio.dataset.asistencia == 'inasistencia'){
                radio.style.backgroundColor= 'red';
                radio.style.borderColor = 'red';
              }

            });

            faltasDia.push(idEmpleado);

            if(logo.dataset.id == idEmpleado){
              logo.style.display = 'none';
          }
           

          })

          if(faltasDiarias != null && faltasDiarias != undefined && faltasDiarias.length > 0){
            faltasDiarias.push(...faltasDia);
          }else{
          faltasDiarias = faltasDia;
          }

          const datos = {
            llave: 'Faltas',
            valor: JSON.stringify(faltasDiarias)

          }

          if(faltasDiarias.length > faltasDia.length){
            await fetch("/updateItem", {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify(datos)
            });
          }else{
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


      }).then(async () =>{

        Swal.fire({
          title: '¿Horas extra?',
          icon: 'question',
          confirmButtonText: 'Sí',
          cancelButtonText: 'No',
          showCancelButton: true
      }).then(async result => {
          if(result.isConfirmed){
             
              modal2.style.display = 'block';
        
              const horasExtra = document.querySelectorAll('#modal2 input[type="number"]');
              
              horasExtra.forEach(input => {
                  input.style.display = 'none';  
                });

              paginacionModalHoras();
              
               

          }else if(result.dismiss === Swal.DismissReason.cancel){

              try{  

                const respuesta = await fetch('/terminarTurnoDiarioNormal', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({idAsistencia})
            
              });

              if(respuesta.ok){
                Swal.fire({
                  title: 'La Jordana Terminó',
                  text: 'Todos los empleados realizaron 8 horas de trabajo',
                  icon: 'success'
                }).then(async () =>{
                  localStorage.setItem('HorasAsignadas', 'Asignado');

                  /**************************************************SINCRONIZACION LOCALSTORAGE-DB****************************************************** */
                  //Preparando los datos que se almacenaron previamente en el localStorage para almacenarlos en la base de datos
                  const datos = {
                    llave: 'HorasAsignadas',
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
                console.error('Hay algun error..');
              }
    


              }catch(err){
                res.status(500).json({mensaje: err.message});
              }
             
          }else{
            modal2.style.display = 'none';
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
    }).then(async result => {
        if(result.isConfirmed){
           
            modal2.style.display = 'block';
      
            const horasExtra = document.querySelectorAll('#modal2 input[type="number"]');
            
            horasExtra.forEach(input => {
                input.style.display = 'none';  
              });

            paginacionModalHoras();
            
             

        }else if(result.dismiss === Swal.DismissReason.cancel){

            try{  

              const respuesta = await fetch('/terminarTurnoDiarioNormal', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({idAsistencia})
          
            });

            if(respuesta.ok){
              Swal.fire({
                title: 'La Jordana Terminó',
                text: 'Todos los empleados realizaron 8 horas de trabajo',
                icon: 'success'
              }).then(async () =>{
                localStorage.setItem('HorasAsignadas', 'Asignado');

                /**************************************************SINCRONIZACION LOCALSTORAGE-DB****************************************************** */
                //Preparando los datos que se almacenaron previamente en el localStorage para almacenarlos en la base de datos
                const datos = {
                  llave: 'HorasAsignadas',
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
              console.error('Hay algun error..');
            }
  


            }catch(err){
              res.status(500).json({mensaje: err.message});
            }
           
        }else{
          modal2.style.display = 'none';
        }
        
      })



    }


  });

    
  btnConfirmar.disabled = true;
 
  checksModal2.forEach(check =>{
    
  function habilitarBoton() {
    const checksModal2checked = document.querySelectorAll('#modal2 input[type="checkbox"]:checked');
    console.log(checksModal2checked.length);
    if(checksModal2checked.length > 0){
        btnConfirmar.disabled = false;
    }else{
      btnConfirmar.disabled = true;
    }

   
  }
    check.addEventListener('click', habilitarBoton);
  })

  


  /******************************************BOTON PARA CONFIRMAR HORAS EXTRA ESTABLECIDAS*******************************************************/
  btnConfirmar.addEventListener('click', async function(e){

      e.preventDefault();
      const idAsistencia = e.target.dataset.id;
      const inputs = document.querySelectorAll('input[type="number"]');
     

      inputs.forEach(input =>{
        const idEmpleado = input.name;
          let hora = 0;
          if(input.style.display == 'block'){
            hora = parseInt(input.value)+8;
          }else{
            hora = 8;
          }

          horas[idEmpleado] = hora;
          
      });

    try{
      const respuesta = await fetch('/terminarTurnoDiarioCustom', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({idAsistencia,horas})
  
    });

    if(respuesta.ok){
      Swal.fire({
        title: 'Horas Extra Asignadas',
        text: 'Se les asignó Horas Extra a los Trabajadores',
        icon: 'success'
    }).then(async () =>{
        btnConfirmar.disabled = true; 

        checksModal2.forEach(check => {
            check.checked = false;
          });

        numerosModal2.forEach(num => {
        num.value = 1;
        });
      
        modal2.style.display = "none";
        localStorage.setItem('HorasAsignadas', 'Asignado');

        /**************************************************SINCRONIZACION LOCALSTORAGE-DB****************************************************** */
                  //Preparando los datos que se almacenaron previamente en el localStorage para almacenarlos en la base de datos
                  const datos = {
                    llave: 'HorasAsignadas',
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
      console.error('Hay algun error..');
    }

    }catch(err){
      res.status(500).json({mensaje: err.message});
    }

      
  });



}


if((value == 0 || value == undefined) || value != hoy) {
   //Eliminar el item de fechaModificacion de la tabla del localstorage 
   const llave1 = "fechaModificacion";

   await fetch(`/deleteItem/${llave1}`, {
     method: "DELETE" 
   })
   .then(res => {
     // Verificar que se eliminó
     if(res.ok) {
       console.log("Item fechaModifiacion eliminado");
     
     }
   })

   //Eliminar el item de Horas Asignadas de la tabla del localstorage 

   const llave2 = "HorasAsignadas";

   await fetch(`/deleteItem/${llave2}`, {
   method: "DELETE" 
   })
   .then(res => {
   // Verificar que se eliminó
   if(res.ok) {
       console.log("Item HorasAsignadas eliminado");
     
   }
   })


   const llave3 = "Justificaciones";

   await fetch(`/deleteItem/${llave3}`, {
     method: "DELETE" })
     .then(res => {
   // Verificar que se eliminó
     if(res.ok) {
       console.log("Item Justificaciones eliminado");
                           
     }
     })


     const llave4 = "Faltas";
     await fetch(`/deleteItem/${llave4}`, {
     method: "DELETE" 
     }).then(res => {
     // Verificar que se eliminó
     if(res.ok) {
       console.log("Item Faltas eliminado");
     }
     })


     if(localStorage.getItem('DivsRemovidos')){
       localStorage.removeItem('DivsRemovidos');
   }

   if(localStorage.getItem('ArrayAsistencias')){
       localStorage.removeItem('ArrayAsistencias');
   }


   btnguardar.disabled = false;

}   


const formAsistencia = document.querySelector('.form-asistencia');

formAsistencia.addEventListener('submit', async e => {
  e.preventDefault();

  let totalradios = 0;
  let contador = 0;

  totalradios = radios.length;


// Iterar cada radio 
  radios.forEach(radio => {

  if(radio.checked) {
      contador++;
      
  }

});

if(contador < (totalradios/2)) {
  
  Swal.fire({
      title: 'Error',
      text: 'Faltan campos por completar',
      icon: 'error'
  });
  
}else{
  
  if(!localStorage.getItem('ArrayAsistencias')){
  const radiosAsistencia = document.querySelectorAll('.asistencia');

  radiosAsistencia.forEach(radioA =>{
    if(radioA.checked){
        asistenciaRadios.push(radioA.id)
    }
  });

  localStorage.setItem('ArrayAsistencias', JSON.stringify(asistenciaRadios));



  const arrayAsistencias = JSON.parse(localStorage.getItem('ArrayAsistencias'));
    const divsAsistencias = document.querySelectorAll('.empleadoModal');
    
    divsAsistencias.forEach(div =>{
      if(!arrayAsistencias.includes(div.dataset.id)){
        const copia = div.cloneNode(true);
        const copiaHtml = copia.outerHTML;
        divRemovidos[div.dataset.id] = copiaHtml;
        
        div.remove();
      }
  });
  
  localStorage.setItem('DivsRemovidos', JSON.stringify(divRemovidos));
  
  }else{

    localStorage.removeItem('ArrayAsistencias');
    asistenciaRadios = [];
    divRemovidos = {};
    const modalPadre = document.querySelector('.modal-content');
    const radiosAsistencia = document.querySelectorAll('.asistencia');

    radiosAsistencia.forEach(radioA =>{
      if(radioA.checked){
          asistenciaRadios.push(radioA.id);
      }
    });

    localStorage.setItem('ArrayAsistencias', JSON.stringify(asistenciaRadios));


    const arrayAsistencias = JSON.parse(localStorage.getItem('ArrayAsistencias'));
    const divsAsistencias = document.querySelectorAll('.empleadoModal');
    let removidos = JSON.parse(localStorage.getItem('DivsRemovidos')) || {};  

divsAsistencias.forEach(div => {
  if (!arrayAsistencias.includes(div.dataset.id)) {
    const copia = div.cloneNode(true);
    const copiaHtml = copia.outerHTML;
    removidos[div.dataset.id] = copiaHtml;

    div.remove();
  }

  const id = div.dataset.id;
  if (removidos[id]) {
    console.log(removidos[id]);
  }

  Object.keys(removidos).forEach(id => {
    if (arrayAsistencias.includes(id)) {
      const elementoString = removidos[id];

      modalPadre.insertAdjacentHTML('beforeend', elementoString);

      delete removidos[id];
    }
  });
});

localStorage.removeItem('DivsRemovidos');
localStorage.setItem('DivsRemovidos', JSON.stringify(removidos));


  }

  Swal.fire({
    title: '¿Todos los empleados llegaron a tiempo?',
    icon: 'question',
    confirmButtonText: 'Sí',
    cancelButtonText: 'No',
    showCancelButton: true
}).then(async result => {
 if (result.isConfirmed) {

  const seleccionados = document.querySelectorAll('input[type="radio"]:checked');
  seleccionados.forEach(seleccionado =>{

      const idEmpleado = seleccionado.id;
      const valor = seleccionado.value;

      asistencias[idEmpleado] = valor;
      

  });

  try{
    const respuesta = await fetch('/crearAsistencia', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(asistencias)

  });

    if(respuesta.ok){
      Swal.fire({
        title: 'Asistencia Guardada',
        text: 'La asistencia se registró a las 10:00',
        icon: 'success'
      }).then( async () => {
          
            radios.forEach(radio =>{
              radio.disabled = true;
          });

          window.location.href = "/asistenciaPost";
        
          
      function generateDateString(date = new Date()) {
        return new Intl.DateTimeFormat('en-CA', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        }).format(date);
      }
    const hoy = String(generateDateString());
    console.log(hoy);

    
    
    /**************************************************SINCRONIZACION LOCALSTORAGE-DB****************************************************** */
    //Preparando los datos que se almacenaron previamente en el localStorage para almacenarlos en la base de datos
    const datos = {
      llave: 'fechaModificacion',
      valor: hoy
    }
    
    
    //Mandar a llamar la ruta POST para almacenar los datos dentro de la base de datos
    await fetch('/crearItem', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"        
      },
      body: JSON.stringify(datos)
    });


  // Comparar fechas  


  if(value == hoy) {
    btnguardar.disabled = true;
  }


  if(fechaModificacion != hoy) {
    /******************************************ELIMINANDO ITEM FECHAMODIFICACION TANTO DEL LOCALSTORAGE COMO DE LA DB********************************************************* */
    const llave = "fechaModificacion";

    await fetch(`/deleteItem/${llave}`, {
      method: "DELETE" 
    })
    .then(res => {
      // Verificar que se eliminó
      if(res.ok) {
        console.log("Item fechaModifiacion eliminado");
        
        // Quitar item del localStorage
        localStorage.removeItem('fechaModificacion'); 
      }
    })
      btnguardar.disabled = false;
  }   

       
        
      });  
    }else{
      console.log('Ha ocurrido un error.');
    }
    

  }catch(err){
    res.status(500).json({mensaje: err.message});
  }


       
  }else if(result.dismiss === Swal.DismissReason.cancel){
   

    var inputs = document.querySelectorAll('#modal input[type="time"]');
    
    inputs.forEach(input => {
    input.style.display = "none";
    });
    
    document.getElementById('modal').style.display = 'block';
   
    paginacionModalEntrada();


  }else{
    modal.style.display = 'none';
  }

  
});

}
 

});


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



// Cuando el usuario da click afuera de la pantalla modal


window.onclick = (e) => {
    if (e.target === modal) { 

        inputs.forEach(input => {
            input.value = "";
          });

        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
          });

          document.getElementById("confirmar").disabled = true;

        modal.style.display = "none";
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
    if (e.target === modal3){
        modal3.style.display = "none";

        checksModal3.forEach(good => {
            good.checked = false;
        });

        btn_Terminar.disabled = true;
    }
}



        // Desactivar el boton mientras no exista algun input de la hora ingresada
        document.getElementById("confirmar").disabled = true;

        var inputs = document.querySelectorAll('#modal input[type="time"]');

        inputs.forEach(function(input) {

        input.addEventListener('input', function() { 

            if(this.value !== "") {
            document.getElementById("confirmar").disabled = false;
            } else {
             
            var todosVacios = Array.from(inputs).every(x => x.value.length === 0);  
            
            if(todosVacios) {
                document.getElementById("confirmar").disabled = true;  
            }
            }

        });

        });

        ///Mensaje de confirmación de Asistencia 
        document.getElementById('confirmar').addEventListener('click', async function() {
          var inputs = document.querySelectorAll('#modal input[type="time"]');
          
          const seleccionados = document.querySelectorAll('input[type="radio"]:checked');
          seleccionados.forEach(seleccionado =>{

          const idEmpleado = seleccionado.id;
          const valor = seleccionado.value;

          asistencias[idEmpleado] = valor;
            

          });

          inputs.forEach(input=>{
      
            const idEmpleado = input.name;
            let hora = '';

            if(input.value != ''){
              hora = input.value;
            }else{
              hora = '10:00'
            }
      
            horarios[idEmpleado] = hora;
          
          });

          try{
            const respuesta = await fetch('/crearAsistenciaTardia', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({asistencias,horarios})
        
          });

          if(respuesta.ok){
            Swal.fire({
              title: 'Asistencia Guardada',
              text: 'La asistencia se registró correctamente',
              icon: 'success'
            }).then(async() =>{
              
              
          function generateDateString(date = new Date()) {
            return new Intl.DateTimeFormat('en-CA', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit'
            }).format(date);
          }
          const hoy = String(generateDateString());
         

          /**************************************************SINCRONIZACION LOCALSTORAGE-DB****************************************************** */
          //Preparando los datos que se almacenaron previamente en el localStorage para almacenarlos en la base de datos
          const datos = {
            llave: 'fechaModificacion',
            valor: hoy
          }
          
          
          //Mandar a llamar la ruta POST para almacenar los datos dentro de la base de datos
          await fetch('/crearItem', {
            method: "POST",
            headers: {
              "Content-Type": "application/json"        
            },
            body: JSON.stringify(datos)
          });

              mostrarIconoPagina();
              window.location.href = "/asistenciaPost"; 

              //Devolver todos los datos a su estado original
              document.getElementById("confirmar").disabled = true;
              inputs.forEach(input => {

                  input.value = "";
                });
      
              checkboxes.forEach(checkbox => {
                  checkbox.checked = false;
                });
                
              modal.style.display = "none";

              ///Deshabilitar los radio button y mensaje en la parte inferior
              radios.forEach(radio =>{
                radio.disabled = true;
            });
            
      

           


            });
          }else{
            console.error('Ha ocurrido un error.');
          }

          }catch(err){
            res.status(500).json({mensaje: err.message});
          }

                      

          // Comparar fechas  
        
          if(value == hoy) {
            btnguardar.disabled = true;
          }
        
        
          if(value != hoy) {
            /******************************************ELIMINANDO ITEM FECHAMODIFICACION TANTO DEL LOCALSTORAGE COMO DE LA DB********************************************************* */
            const llave = "fechaModificacion";

            await fetch(`/deleteItem/${llave}`, {
              method: "DELETE" 
            })
            .then(res => {
              // Verificar que se eliminó
              if(res.ok) {
                console.log("Item fechaModifiacion eliminado");
              }
            })
              btnguardar.disabled = false;
          }   
              
             
        });


              

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
document.getElementById('adjuntar').addEventListener('click', () => {
  document.getElementById('file-input').click();
});

        /////Mensaje de Justificación
        btn_Terminar.addEventListener('click', async e =>{

            const idEmpleado = e.target.dataset.id
            const fechaHoy = hoy;
            const motivo = textarea.value;
          if(justificado.checked){
            
            try{
              const respuesta = await fetch('/justificarFaltasDiarias', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({idEmpleado, fechaHoy, motivo})
          
            });

              if(respuesta.ok){
                Swal.fire({
                  title: 'Acción Realizada',
                  text: 'Falta Justificada',
                  icon: 'success'
              }).then(async () => {
              
                justificaciones.push(idEmpleado);
                //Sustituir por el arreglo que esta en la base de datos
                if(justificacionesDiarias != 0 && justificacionesDiarias != undefined && justificacionesDiarias != null && justificacionesDiarias != [] ){
                  justificaciones.push(...justificacionesDiarias);
                

                   //*****************************MODIFICACION DEL ARREGLO JUSTIFICACIONES TANTO EN EL LOCALSTORAGE COMO EN LA DB************************************************************* */

                      const datos = {
                        llave: "Justificaciones",
                        valor: JSON.stringify(justificaciones)
                    }
                    
                    await fetch("/updateItem", {
                      method: "POST",
                      headers: {
                          "Content-Type": "application/json"        
                      },
                      body: JSON.stringify(datos)
                    })  


                  /*Modificar el arreglo de justificaciones en la base de datos*/
                  modal3.style.display = 'none';
                  radios.forEach(radio =>{

                    if(radio.id == idEmpleado && radio.dataset.asistencia == 'inasistencia'){
                      radio.style.backgroundColor= 'orange';
                      radio.style.borderColor = 'orange';
                    }
  
                  });
                }else{
        
                //*****************************SINCRONIZACION DEL ARREGLO JUSTIFICACIONES TANTO EN EL LOCALSTORAGE COMO EN LA DB************************************************************* */
                
                const datos = {
                  llave: "Justificaciones",
                  valor: JSON.stringify(justificaciones)
               }
               
               await fetch("/crearItem", {
                 method: "POST",
                 headers: {
                    "Content-Type": "application/json"        
                 },
                 body: JSON.stringify(datos)
               })  


                modal3.style.display = 'none';
                
                radios.forEach(radio =>{

                  if(radio.id == idEmpleado && radio.dataset.asistencia == 'inasistencia'){
                    radio.style.backgroundColor= 'orange';
                    radio.style.borderColor = 'orange';
                  }

                });

              }
              checksModal3.forEach(good => {
                  good.checked = false;
              });
      
              textarea.value = "";
              btn_Terminar.disabled = true;

              const inputIcons = document.querySelectorAll('.icon-falta');

              inputIcons.forEach(input=>{
                  if(input.dataset.id === idEmpleado){
                      input.style.display = 'none';
                  }
              });

              window.location.reload();

              });
                

              }else{
                console.error('Ha ocurrido un error.');
              }
            }catch(err){
              res.status(500).json({mensaje: err.message});
            }
            


          }else if(noJustificado.checked){

              try{
                const respuesta = await fetch('/establecerFaltas', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({idEmpleado, fechaHoy})
            
              });

              if(respuesta.ok){
                    Swal.fire({
                      title: 'Acción Realizada',
                      text: 'Falta no Justificada',
                      icon: 'success'
                  }).then( async () =>{
        
                      faltas.push(idEmpleado);
                        if(faltasDiarias != 0 && faltasDiarias != undefined && faltasDiarias != null && faltasDiarias != []){
                          faltas.push(...faltasDiarias);
        
                          //*****************************MODIFICACION DEL ARREGLO FALTAS TANTO EN EL LOCALSTORAGE COMO EN LA DB************************************************************* */
                          
                            const datos = {
                              llave: "Faltas",
                              valor: JSON.stringify(faltas)
                          }
                          
                          await fetch("/updateItem", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"        
                            },
                            body: JSON.stringify(datos)
                          })  
        
        
                          
                          modal3.style.display = 'none';
                          radios.forEach(radio =>{
        
                            if(radio.id == idEmpleado && radio.dataset.asistencia == 'inasistencia'){
                              radio.style.backgroundColor= 'red';
                              radio.style.borderColor = 'red';
                            }
          
                          });
                        }else{
                      
                          //*****************************SINCRONIZACION DEL ARREGLO FALTAS TANTO EN EL LOCALSTORAGE COMO EN LA DB************************************************************* *
                          const datos = {
                            llave: "Faltas",
                            valor: JSON.stringify(faltas) 
                        }
                        
                        await fetch("/crearItem", {
                          method: "POST",
                          headers: {
                              "Content-Type": "application/json"        
                          },
                          body: JSON.stringify(datos)
                        })  
                        
                        modal3.style.display = 'none';
                        
                        radios.forEach(radio =>{
        
                          if(radio.id == idEmpleado && radio.dataset.asistencia == 'inasistencia'){
                            radio.style.backgroundColor= 'red';
                            radio.style.borderColor = 'red';
                          }
                        });
        
                      }
                
                    
                    modal3.style.display = 'none';
                    const inputIcons = document.querySelectorAll('.icon-falta');
        
                      inputIcons.forEach(input=>{
                          if(input.dataset.id === idEmpleado){
                              input.style.display = 'none';
                          }
                      });
          
                  checksModal3.forEach(good => {
                      good.checked = false;
                  });
          
                  textarea.value = "";
          
                  btn_Terminar.disabled = true;
                  
                  window.location.reload();
                
        
                  });
              }else{
                console.error('Ha ocurrido un error.');
              }
     
              }catch(err){
                console.error(err);
              }

        
          }
          
        });




//FECHA ACTUAL
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