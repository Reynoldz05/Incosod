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

///////////////////////Tarjetas//////////////////

// Obtener tarjetas
const tarjetas = document.querySelectorAll('.insights > div');

// Recorrer cada una
tarjetas.forEach(tarjeta => {

  tarjeta.addEventListener('click', () => {
    
    if(tarjeta.classList.contains('empleados')) {
        window.location.href = 'asistencia.html';
    }
    
    if(tarjeta.classList.contains('asistencias')) {
        window.location.href = 'asistencia_semana.html';
    }

    if(tarjeta.classList.contains('inasistencias')) {
        window.location.href = '/asistencias-proyectos';
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



//Asistencia    
document.querySelector('.btn-guardar').addEventListener('click', function() {


    // Deshabilita los radiobuttons
    var radios = document.querySelectorAll('.radio-btn');
    for (var i = 0; i < radios.length; i++) {
        if (!radios[i].checked) {
            radios[i].disabled = true;
        }
    }

    // Muestra la barra de notificaciones
    var notificationBar = document.querySelector('#notification-bar');
    notificationBar.textContent = 'Los datos se han guardado correctamente';
    notificationBar.style.display = 'block';

    // Oculta la barra de notificaciones después de 3 segundos
    setTimeout(function() {
        notificationBar.style.display = 'none';
    }, 3000);
});

document.querySelector('.btn-modificar').addEventListener('click', function() {
    // Habilita los radiobuttons
    var radios = document.querySelectorAll('.radio-btn');
    for (var i = 0; i < radios.length; i++) {
        radios[i].disabled = false;
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
    document.getElementById("fechaActual").value = fecha;

    