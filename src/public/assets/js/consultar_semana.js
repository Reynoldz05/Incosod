const sideMenu = document.querySelector("aside");
const menuBtn = document.querySelector("#menu-btn");
const closeBtn = document.querySelector("#close-btn");
const themeToggler = document.querySelector(".theme-toggler");
const btnEliminar = document.querySelectorAll(".eliminarAsistenciaSemanal");



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


  async function abrirEliminar(e){

    e.preventDefault();

    const idAsistencia = e.target.dataset.id;

    const fechaInicio = Date.parse(e.target.dataset.inicio, "dd 'de' MMMM 'de' yyyy");
    const fechaIncioFormateada = new Intl.DateTimeFormat('en-CA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).format(fechaInicio);

    const fechaFin = Date.parse(e.target.dataset.fin, "dd 'de' MMMM 'de' yyyy");
    const fechaFinFormateada = new Intl.DateTimeFormat('en-CA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).format(fechaFin);

   
      try{

        Swal.fire({
            title: "¿Estas seguro?",
            text: "Esta acción es irreversible!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Eliminar asistencia"
        }).then(async (result) =>{

            if (result.isConfirmed){

                if(fechaIncioFormateada == FI && fechaFinFormateada == FF){
                    

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

                await fetch(`/deleteAsistenciaSemanal/${idAsistencia}` ,{
                    method: 'DELETE'
                },
                
                Swal.fire({
                    title: "Borrado!",
                    text: "La asistencia se ha eliminado exitosamente.",
                    icon: "success"
                }).then(() => {
                    
                    window.location.reload();
                 })
                
                
                );


            }
        
        });


      }catch(err){
        console.error(err);
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



/////BOTON OJO
const eyes = document.querySelectorAll('.visibility');

eyes.forEach(ojo =>{
    ojo.addEventListener('click', () =>{
        window.location.href = 'registro_semanal.html'
    });

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
document.getElementById("fechaActual").value = fecha;

(async () =>{

await fetchFechaInicio();
await fetchFechaFin();
await fetchHorasSemanalesAsignadas();
await fetchJustificacionesSemanales();
await fetchFaltasSemanales();

////Eliminar Asistencia Semanal

btnEliminar.forEach(btn =>{

    btn.addEventListener('click', abrirEliminar);

});
})(); 




    