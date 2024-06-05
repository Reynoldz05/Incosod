const sideMenu = document.querySelector("aside");
const menuBtn = document.querySelector("#menu-btn");
const closeBtn = document.querySelector("#close-btn");
const themeToggler = document.querySelector(".theme-toggler");
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
const modal = document.getElementById('modal');
const checksModal = document.querySelectorAll('#modal input[type="checkbox"]');


modal.style.display = 'none';


window.onclick = (e) => {

    if (e.target === modal) {
        modal.style.display = "none";
        
        checksModal.forEach(check => {
            check.disabled = true; 
          });

    }
    
}

const ver = document.querySelectorAll("#visibility");


ver.forEach(ojo => {
    
    ojo.addEventListener('click', e => {
        const idDetalle = e.target.dataset.id;
        const dia = e.target.dataset.dia;
        abrirModal(idDetalle, dia);
    })
});


async function abrirModal(idDetalle, dia) {
    let Motivo = "";
    const textarea = document.getElementById('descripcion');

    async function fetchJustificacionesSemanales() {
        try{
          const respuesta = await fetch(`/obtenerJustificacionesSemanales?idDetalle=${idDetalle}&&dia=${dia}`);
        
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

      await fetchJustificacionesSemanales();

      

    console.log("idDetalle desde la funcion abrirModal: "+idDetalle);
    console.log("dia desde la funcion abrirModal: "+dia);
    textarea.value = Motivo;
    modal.style.display = 'block';
    textarea.disabled = true;
    checksModal.forEach(check => {
        check.disabled = true; 
      });
    
}






////////////////////////////          Seccion de los tabs de seleccion 

// Obtener todos los botones de las pestañas
const tabButtons = document.querySelectorAll('.tab-button');

// Agregar evento de clic a cada botón de pestaña
tabButtons.forEach(button => {
  button.addEventListener('click', () => {
    // Obtener el ID de la pestaña correspondiente al botón
    const tabId = button.getAttribute('data-tab');

    // Remover la clase "active" de todos los botones y pestañas
    tabButtons.forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));

    // Agregar la clase "active" al botón y pestaña correspondientes
    button.classList.add('active');
    document.getElementById(tabId).classList.add('active');
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

    