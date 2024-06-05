const ver = document.querySelectorAll("#visibility");
const descripciones = document.querySelectorAll('#description');
const btn_Terminar = document.querySelector('#modal button');
btn_Terminar.disabled = true;

// Cuando el usuario da click afuera de la pantalla modal
const modal = document.getElementById('modal');
const checksModal = document.querySelectorAll('#modal input[type="checkbox"]');


const modal2 = document.getElementById('modal2');
const checksModal2 = modal2.querySelectorAll('#modal2 input[type="checkbox"]');

modal.style.display = 'none';
modal2.style.display = 'none';

window.onclick = (e) => {
    if (e.target === modal) { 
        modal.style.display = "none";

        checksModal.forEach(good => {
          good.checked = false;
        });

        btn_Terminar.disabled = true;
    }
    if (e.target === modal2) {
        modal2.style.display = "none";
        
        checksModal2.forEach(check => {
            check.disabled = true; 
          });

    }
    
}



function abrirModalJustificacion(id, idAsistencia, fecha) {

    modal.style.display = 'block';
    const textarea = document.getElementById('descripcion');
    textarea.disabled = true;

    const idEmpleado = id;
    btn_Terminar.dataset.id = idEmpleado;
    btn_Terminar.dataset.asistencia = idAsistencia;
    btn_Terminar.dataset.fecha = fecha;
   
  }



descripciones.forEach(descripcion => {
    
    descripcion.addEventListener('click', e => {
        const idIcono = e.target.dataset.id;
        const idAsistencia = e.target.dataset.asistencia;
        const fecha = e.target.dataset.fecha;
        const fechaObjeto = new Date(fecha);
        const fechaFormateada = fechaObjeto.toISOString().split("T")[0];
        abrirModalJustificacion(idIcono, idAsistencia, fechaFormateada);
  
    });
  
  });




/////Checkboxes

const checkJustificado = document.getElementById('justificada');
const checkNoJustificado = document.getElementById('no-justificada');
const textarea = document.getElementById('descripcion');

checkJustificado.addEventListener('click', alternarChecks);
checkNoJustificado.addEventListener('click', alternarChecks);

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

const justificado = document.getElementById('justificada');
const noJustificado = document.getElementById('no-justificada');

justificado.addEventListener("click", habilitarBtn);
noJustificado.addEventListener("click", habilitarBtn);


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

function generateDateString(date = new Date()) {
    return new Intl.DateTimeFormat('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(date);
  }


const hoy = String(generateDateString());

//////////////Abrir Explorador de Archivos Adjuntar Evidencia
document.getElementById('adjuntar').addEventListener('click', () => {
document.getElementById('file-input').click();
});

      /////Mensaje de Justificación
      btn_Terminar.addEventListener('click', async e =>{
        const idEmpleado = e.target.dataset.id
        const fechaHoy = e.target.dataset.fecha;
        const motivo = textarea.value;
        console.log(idEmpleado);
        console.log(fechaHoy);
        console.log(motivo);
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
                    }).then( () => {

                        modal.style.display = 'none';

                        const inputIcons = document.querySelectorAll('.icon-falta');
        
                        inputIcons.forEach(input=>{
                            if(input.dataset.empleado === idEmpleado){
                                input.style.display = 'none';
                            }
                        });

                        checksModal.forEach(good => {
                          good.checked = false;
                        });
              
                        textarea.value = "";
              
                        btn_Terminar.disabled = true 
                        window.location.reload();

                    })

                }


            }catch(err){
                console.error(err);
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
                    }).then( () =>{
                        modal.style.display = 'none';

                        const inputIcons = document.querySelectorAll('.icon-falta');
        
                        inputIcons.forEach(input=>{
                            if(input.dataset.empleado === idEmpleado){
                                input.style.display = 'none';
                            }
                        });

        
                        checksModal.forEach(good => {
                          good.checked = false;
                        });
              
                        textarea.value = "";
              
                        btn_Terminar.disabled = true 
                        window.location.reload();
        
                    })
                }else{
                    console.error('Ha ocurrido un error.');
                }
            }catch(err){
                console.error(err);
            }

            
        }

      });


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


 async function abrirModalVer(idDetalle) {
    let Motivo = "";
    const textArea = document.getElementById("descripcion2");
    async function fetchJustificaciones() {
        try{
          const respuesta = await fetch(`/obtenerJustificacionesDiarias?idDetalle=${idDetalle}`);
        
          const datos = await respuesta.json();
          
          if(datos){
            console.log(datos);
            const {motivo} = datos;
            
            console.log("Motivo: "+motivo);
        
            Motivo = motivo;
        
          } else {
            console.error('No se encontró dato');
          
          }
        } catch (err) {
  
          console.error(err);
        }
      
  
      }

      await fetchJustificaciones();

      console.log("Valor de motivo obtenido desde el fetch a justificaciones: "+Motivo);

      textArea.value = Motivo;

    modal2.style.display = 'block';
    const textarea2 = document.getElementById('descripcion2');
    textarea2.disabled = true;
    checksModal2.forEach(check => {
        check.disabled = true; 
      });
    
}

ver.forEach(ojo => {
    ojo.addEventListener('click', e => {
        const idDetalle = e.target.dataset.id;
        console.log(idDetalle);
        abrirModalVer(idDetalle);
    })
});
 

//FECHA ACTUAL
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



