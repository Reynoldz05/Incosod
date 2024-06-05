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

//Pestaña Nomina
const Nomina = document.getElementById('nomina');

Nomina.addEventListener('click', () => {
    window.location.href = 'nomina.html';
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



//Pestaña Usuarios
const usuarios = document.getElementById("usuarios");

usuarios.addEventListener("click", () => {
  window.location.href = "usuarios.html"; 
});


// Función para restablecer el estado de las tarjetas
function resetCardFlip() {
  const cards = document.querySelectorAll('.empleado-card');
  cards.forEach(card => {
      card.classList.remove('flipped');
  });
}

//Función para que el valor del sueldo general no lo puedan escribir a menor de 100
function validarValor(input) {
  if (input.value < 100) {
      input.value = 100;
  }
}

////Exportación de pdf
const Documentpdf = document.querySelectorAll('#pdf-icon');
Documentpdf.forEach(pdf => {
  pdf.addEventListener('click', function(){
    var doc = new jsPDF();
    doc.text('Hello world!', 10, 10);
    doc.save('sample.pdf');
  });
});

////Exportación de xls
const Documentxls = document.querySelectorAll( '#excel-icon' );
Documentxls.forEach(excel => {
  excel.addEventListener('click', function() {
    // Crear un nuevo libro de trabajo (workbook)
    var workbook = XLSX.utils.book_new();

    // Crear una nueva hoja de cálculo (worksheet)
    var worksheet = XLSX.utils.aoa_to_sheet([['Hello World']]);

    // Agregar la hoja de cálculo al libro de trabajo
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // Generar el archivo Excel
    var excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    // Crear un Blob a partir del buffer
    var blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    // Crear un enlace de descarga
    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'sample.xlsx';
    link.click();
  });
});



////////Interacción de puestos y tarjetas
const cantidadEmpleados = document.getElementById('contenedor-empleados');
const sueldoGeneral = document.getElementById('contenedor-sueldo');
const cardAlbanil = document.getElementById('card-albanil');
const cardAlbanil2 = document.getElementById('card-albanil2');
const cardMaestro = document.getElementById('card-maestro');
const puestoSelect = document.getElementById('puesto-select');
const cantidadEmpleadosNumber = document.getElementById('cantidad-empleados-number');
const sueldoInput = document.getElementById('sueldo-input');

cantidadEmpleados.style.display = 'none';
sueldoGeneral.style.display = 'none';
cardAlbanil.style.display = 'none';
cardAlbanil2.style.display = 'none';
cardMaestro.style.display = 'none';

puestoSelect.addEventListener('change', ()=>{
  const selectedPuesto = puestoSelect.value;

  resetCardFlip();

  if (selectedPuesto === ''){
    cantidadEmpleados.style.display = 'none';
    sueldoGeneral.style.display = 'none';
    cardAlbanil.style.display = 'none';
    cardAlbanil2.style.display = 'none';
    cardMaestro.style.display = 'none';
  }
  if (selectedPuesto === 'albañil'){
    cantidadEmpleados.style.display = 'block';
    cantidadEmpleadosNumber.textContent = '2';
    sueldoGeneral.style.display = 'block';
    sueldoInput.value = '10000';
    cardAlbanil.style.display = 'block';
    cardAlbanil2.style.display = 'block';
    cardMaestro.style.display = 'none';
  }
  if (selectedPuesto === 'maestro'){
    cantidadEmpleados.style.display = 'block';
    cantidadEmpleadosNumber.textContent = '1';
    sueldoGeneral.style.display = 'block';
    sueldoInput.value = '20000';
    cardAlbanil.style.display = 'none';
    cardAlbanil2.style.display = 'none';
    cardMaestro.style.display = 'block';
  }
});

////Boton de editar el sueldo general
const GeneralSueldo = document.getElementById('sueldo-input');
const botonEditar = document.getElementById('btn-edit');

GeneralSueldo.disabled = true;

botonEditar.addEventListener('click', () => {
    if(botonEditar.textContent == 'edit'){
      GeneralSueldo.disabled = false;
      botonEditar.textContent = 'done';
      GeneralSueldo.style.color = 'black';
    }else{
      botonEditar.textContent = 'edit';
      GeneralSueldo.disabled = true;
      GeneralSueldo.style.color = 'gray';
    }
});

//////////////Boton de Guardar

const btnGuardar = document.querySelectorAll('#save-icon');
const downloadIcons = document.querySelectorAll('#download-icon');
const tarjetas = document.querySelectorAll('.empleado-card');

tarjetas.forEach(tarjeta => {
  tarjeta.classList.add('no-flip');
  tarjeta.color = 'red';
});

function deshabilitar(tarjeta) {
  const horasTrabajadas = tarjeta.querySelector('.empleado-info:nth-child(4) .horas-extra');
  const infonavit = tarjeta.querySelector('.empleado-info:nth-child(5) .infonavit');
  horasTrabajadas.disabled = true;
  infonavit.disabled = true;
}

function habilitar(tarjeta) {
  const horasTrabajadas = tarjeta.querySelector('.empleado-info:nth-child(4) .horas-extra');
  const infonavit = tarjeta.querySelector('.empleado-info:nth-child(5) .infonavit');
  horasTrabajadas.disabled = false;
  infonavit.disabled = false;
}

function habilitarDescargas(tarjeta) {
  tarjeta.classList.remove('no-flip');
}

function deshabilitarDescargas(tarjeta) {
  tarjeta.classList.add('no-flip');
}


btnGuardar.forEach(guardar => {
  guardar.addEventListener('click', ()=>{
    const tarjeta = guardar.closest('.empleado-card');
    if(guardar.textContent == 'save'){
      Swal.fire({
        title: 'Éxito!',
        text: 'Datos Guardados',
        icon: 'success'
      }).then((result) => {
        if (result.isConfirmed) {
          guardar.textContent = 'edit';
          deshabilitar(tarjeta);
          habilitarDescargas(tarjeta);
        }
      });
    }else{
      guardar.textContent = 'save';
      habilitar(tarjeta);
      deshabilitarDescargas(tarjeta);
    }
  });
});




////Vuelta de las tarjetas boton de Descargas
const btnFlips = document.querySelectorAll('.btn-flip');

downloadIcons.forEach(icon => {
  icon.addEventListener('click', () => {
    const tarjeta = icon.closest('.empleado-card');
    if (!tarjeta.classList.contains('no-flip')) {
      tarjeta.classList.add('flipped');
    }
  });
});

btnFlips.forEach(btn => {
    btn.addEventListener('click', () => {
        btn.closest('.empleado-card').classList.remove('flipped');
    });
});


//////////////////////////////////////Calcular el total por Empleado

// Función para calcular el descuento de infonavit
function calcularInfonavit(sueldoAcumulado, infonavit) {
  return sueldoAcumulado * (infonavit / 100);
}

// Función para calcular el sueldo acumulado
function calcularSueldoAcumulado(sueldo, horasExtra, valorHoraExtra) {
  const totalHorasExtra = horasExtra * valorHoraExtra;
  return sueldo + totalHorasExtra;
}

// Función para calcular el total
function calcularTotal(sueldoAcumulado, infonavit) {
  const descuentoInfonavit = calcularInfonavit(sueldoAcumulado, infonavit);
  return sueldoAcumulado - descuentoInfonavit;
}

// Función para actualizar el total en la tarjeta
function actualizarTotal(card, total) {
  const totalElement = card.querySelector('.empleado-total .total-container p');
  totalElement.textContent = `$${Math.round(total)}`;
}

// Event listener para los inputs de horas extra e infonavit
const empleadoCards = document.querySelectorAll('.empleado-card');
empleadoCards.forEach(card => {
    const horasExtraInput = card.querySelector('.empleado-info:nth-child(4) .horas-extra');
    const infonavitInput = card.querySelector('.empleado-info:nth-child(5) .infonavit');

    const horasExtraSymbol = horasExtraInput.parentElement.querySelector('.symbol');
    horasExtraSymbol.style.display = horasExtraInput.value !== '' ? 'inline' : 'none';
    const infonavitSymbol = infonavitInput.parentElement.querySelector('.symbol');
    infonavitSymbol.style.display = infonavitInput.value !== '' ? 'inline' : 'none';

    const calcularTotalCard = () => {
        const sueldoText = card.querySelector('.empleado-info:nth-child(3) p').textContent;
        const sueldo = parseFloat(sueldoText.replace('$', '').replace(',', ''));
        const horasExtra = parseFloat(horasExtraInput.value) || 0;
        const valorHoraExtraText = card.querySelector('.empleado-info:nth-child(4) h3').textContent;
        const valorHoraExtra = parseFloat(valorHoraExtraText);
        const infonavit = parseFloat(infonavitInput.value) || 0;

        const sueldoAcumulado = calcularSueldoAcumulado(sueldo, horasExtra, valorHoraExtra);
        const total = calcularTotal(sueldoAcumulado, infonavit);
        actualizarTotal(card, total);
    };

    if (horasExtraInput) {
        horasExtraInput.addEventListener('input', () => {
            if (horasExtraSymbol) {
                horasExtraSymbol.style.display = horasExtraInput.value !== '' ? 'inline' : 'none';
            }
            calcularTotalCard();
        });
    }

    if (infonavitInput) {
        infonavitInput.addEventListener('input', () => {
            if (infonavitSymbol) {
                infonavitSymbol.style.display = infonavitInput.value !== '' ? 'inline' : 'none';
            }
            calcularTotalCard();
        });
    }
});

/////////////////////////Pantalla Modal

let accumulatedSubtotal = 0;

// Obtener elementos de la modal
const loanModal = document.getElementById('loanModal');
const loanAmount = document.getElementById('loanAmount');
const loanSubtotal = document.getElementById('loanSubtotal');
const confirmLoan = document.getElementById('confirmLoan');
const closeModal = document.getElementById('closeModal');

// Abrir la modal al hacer clic en el icono de préstamo
const loanIcons = document.querySelectorAll('#loan-icon');
loanIcons.forEach(icon => {
  icon.addEventListener('click', () => {
    loanModal.style.display = 'block';
    loanAmount.value = '';
    loanSubtotal.textContent = accumulatedSubtotal.toFixed(2);
  });
});

// Cerrar la modal al hacer clic en la 'x'
closeModal.addEventListener('click', () => {
  loanModal.style.display = 'none';
});

// Actualizar el subtotal al ingresar una cantidad de préstamo
loanAmount.addEventListener('input', () => {
  const amount = parseFloat(loanAmount.value) || 0;
  const subtotal = accumulatedSubtotal + amount;
  loanSubtotal.textContent = subtotal.toFixed(2);
});

// Confirmar el préstamo al hacer clic en el botón de confirmación
confirmLoan.addEventListener('click', () => {
  const amount = parseFloat(loanAmount.value) || 0;
  accumulatedSubtotal += amount;
  loanSubtotal.textContent = accumulatedSubtotal.toFixed(2);
  loanModal.style.display = 'none';
});