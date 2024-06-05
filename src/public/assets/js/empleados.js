const sideMenu = document.querySelector("aside");
const title = document.getElementById('titulo');
const btnGuardar = document.querySelector('.btn-guardar');
const formulario = document.getElementById('formulario');
const logo = document.querySelectorAll('#logo');
const modal2 = document.getElementById('modal2');
let editando = false;
var inputs = document.querySelectorAll('input[type="text"]:not(.opcional)');
var inputsModal1 = document.querySelectorAll('.modal1');
var campos = document.querySelectorAll('input[type="text"]');
var button = document.querySelector('button[type="submit"]');
const checks = Array.from(document.querySelectorAll("#modal input[type=checkbox]"));
const puesto = document.getElementById('puesto');
const si = document.getElementById('si');
const no = document.getElementById('no');
const ineInput = document.getElementById('ine-input');
const inePreview = document.getElementById('ine-preview');
const ineFilename = document.getElementById('ine-filename');
let infonavit = null;
let ine = null;
let nss = null;





//////Cuando se le da click en el icono de la credencial en la Tabla

logo.forEach(ine => {
  ine.addEventListener('click', async () => {
    const empleadoId = ine.dataset.id; // Obtener el ID del empleado desde el atributo data-id del logo

    try {
      const response = await fetch(`/obtener-empleado/${empleadoId}`);
      const data = await response.json();

      if (response.ok) {
        const ineFileId = data.empleado.ine_file_id;

        if (ineFileId) {
          const imgElement = document.createElement('img');
          imgElement.src = `/imagen-proxy?fileId=${ineFileId}`;
          imgElement.classList.add('credencial-imagen');

          const modalContent = document.querySelector('#modal2 .modal-content');
          modalContent.innerHTML = ''; // Limpiar contenido anterior
          modalContent.appendChild(imgElement);
        } else {
          const mensaje = document.createElement('p');
          mensaje.textContent = 'No se encontró una credencial para este empleado.';
          mensaje.classList.add('credencial-mensaje');

          const modalContent = document.querySelector('#modal2 .modal-content');
          modalContent.innerHTML = ''; // Limpiar contenido anterior
          modalContent.appendChild(mensaje);
        }

        modal2.style.display = 'block';
      } else {
        console.error('Error al obtener la información del empleado:', data.message);
      }
    } catch (error) {
      console.error('Error al obtener la información del empleado:', error);
    }
  });
});


// Ventana Modal Guardar
    var modal = document.getElementById("modal");

    // Get the button that opens the modal
    var btn = document.getElementById('btnAgregar');


    function restablecerFormulario() {
      const btn = document.querySelector('.btn');
      inePreview.src = '/images/logo_credencial.jpeg';
      title.textContent = 'Nuevo Empleado';
      btn.disabled = true;
      editando = false;
      if (btn.classList.contains('btn-modificar')) {
        btn.classList.remove('btn-modificar');
      }
      document.getElementById('inputPuesto').value = '';
      checks.forEach(check => {
        check.checked = false;
      });
      campos.forEach(input => {
        input.value = "";
      });
      btn.textContent = 'Guardar';
      
      formulario.addEventListener('submit', guardarEmpleado);
      
     
      
      // Restablecer el estado del input de tipo file
      ineInput.value = null;
    }


    // When the user clicks on the button, open the modal
    btn.addEventListener('click', ()=>{
      restablecerFormulario();
      modal.style.display = "block";
    })
   

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
        restablecerFormulario();
    }if (event.target == modal2){
        modal2.style.display = "none";
    }
}



    ////Intercambio entre checkboxes
    si.addEventListener('click', () => {
        if(si.checked == true){
            no.checked = false;
        }
    });

    no.addEventListener('click', () => {
        if(no.checked == true){
            si.checked = false;
        }
    });


    
    btnGuardar.disabled = true;

    
    let inputsPuestoSueldo = false;
   
    function validarInputs() {
      let vacios = 0;
      inputsModal1.forEach(input => {
        
        if(input.id != 'inputPuesto'){
          if (input.value.trim() == '') {
            vacios++;
          }
        }
        
        if(vacios == 0){
          btnGuardar.disabled = false;
        }else{
          btnGuardar.disabled = true;
        }
        console.log(inputs.length);
      });

      
    }
    

    inputsModal1.forEach(input =>{
      input.addEventListener('input', function(){
            validarInputs();
    })
  })


    ineInput.addEventListener('change', function(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
          inePreview.src = e.target.result;
          inePreview.style.display = 'block';
        };
        reader.readAsDataURL(file);
        ineFilename.textContent = '';
      }
    });
    
    document.querySelector('.ine-container').addEventListener('click', (event) => {
      if (event.target.id === 'ine-input') {
        return;
      }
    
      if (event.target.tagName === 'LABEL' || event.target.id === 'ine-preview') {
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
          // El usuario está utilizando un dispositivo móvil
          event.preventDefault(); // Evita que se abra el explorador de archivos
          mostrarModalFotografia();
        }
      }
    });
    

      function mostrarModalFotografia() {
        
        const modalFotografia = document.getElementById('modal-fotografia');
        modalFotografia.style.display = 'block';
        
        const opcionGaleria = document.getElementById('opcion-galeria');
        const opcionCamara = document.getElementById('opcion-camara');
      
        opcionGaleria.addEventListener('click', () => {
          modalFotografia.style.display = 'none';
          ineInput.click();
        }, { once: true }); // Agrega la opción { once: true }
      
      
        opcionCamara.addEventListener('click', () => {
          modalFotografia.style.display = 'none';
          tomarFotografia();
        }, { once: true }); // Agrega la opción { once: true }
      }


      function tomarFotografia() {
        // Verificar si el navegador admite la API de Media Devices
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
              // Crear un elemento de video para mostrar la vista previa de la cámara
              const videoElement = document.createElement('video');
              videoElement.srcObject = stream;
              videoElement.play();
      
              // Crear un contenedor para el video y el botón de captura
              const contenedorCamara = document.createElement('div');
              contenedorCamara.classList.add('contenedor-camara');
              contenedorCamara.appendChild(videoElement);
      
              // Crear un botón para capturar la imagen
              const botonCapturar = document.createElement('button');
              botonCapturar.textContent = 'Capturar';
              botonCapturar.classList.add('boton-capturar');
              contenedorCamara.appendChild(botonCapturar);
      
              // Agregar el contenedor de la cámara al body
              document.body.appendChild(contenedorCamara);
      
              // Especificar las dimensiones deseadas de la imagen
              const maxWidth = 800; // Ancho deseado de la imagen
              const maxHeight = 600; // Altura deseada de la imagen
      
              // Evento de clic en el botón de captura
              botonCapturar.addEventListener('click', () => {
                // Crear un canvas con las dimensiones especificadas
                const canvasElement = document.createElement('canvas');
                canvasElement.width = maxWidth;
                canvasElement.height = maxHeight;
                const context = canvasElement.getContext('2d');
      
                // Calcular las proporciones de la imagen
                const videoWidth = videoElement.videoWidth;
                const videoHeight = videoElement.videoHeight;
                const aspectRatio = videoWidth / videoHeight;
      
                let newWidth = maxWidth;
                let newHeight = maxHeight;
      
                if (aspectRatio > maxWidth / maxHeight) {
                  newHeight = maxWidth / aspectRatio;
                } else {
                  newWidth = maxHeight * aspectRatio;
                }
      
                // Dibujar la imagen en el canvas con las proporciones ajustadas
                context.drawImage(videoElement, (maxWidth - newWidth) / 2, (maxHeight - newHeight) / 2, newWidth, newHeight);
      
                // Obtener la URL de la imagen desde el canvas
                const imageUrl = canvasElement.toDataURL('image/jpeg');
      
                // Detener la transmisión de video
                stream.getTracks().forEach(track => track.stop());
      
                // Crear un objeto File a partir de la URL de la imagen capturada
                fetch(imageUrl)
                .then(res => res.blob())
                .then(blob => {
                  const file = new File([blob], 'imagen_capturada.jpg', { type: 'image/jpeg' });
                  const dataTransfer = new DataTransfer();
                  dataTransfer.items.add(file);
                  ineInput.files = dataTransfer.files;

                  // Eliminar el contenedor de la cámara
                  contenedorCamara.remove();

                  // Mostrar la vista previa de la imagen capturada en el elemento inePreview con las dimensiones originales
                  const inePreview = document.getElementById('ine-preview');
                  const reader = new FileReader();
                  reader.onload = function(e) {
                    inePreview.src = e.target.result;
                    inePreview.style.display = 'block';
                  };
                  reader.readAsDataURL(file);
                });
              });
            })
            .catch(error => {
              console.error('Error al acceder a la cámara:', error);
            });
        } else {
          console.error('La API de Media Devices no es compatible con este navegador.');
        }
      }



//Seccion de Puestos

// Obtener elementos del DOM
const tabEmpleados = document.getElementById('tab-empleados');
const tabPuestos = document.getElementById('tab-puestos');
const tabPanes = document.querySelectorAll('.tab-pane');
const tabButtons = document.querySelectorAll('.tab-button');
const btnAddPuesto = document.querySelector('.btn-add-puesto');
const modalCrearPuesto = document.getElementById('modal-crear-puesto');
const formCrearPuesto = document.getElementById('form-crear-puesto');
const inputPuesto = document.getElementById('puesto');
const inputSueldo = document.getElementById('sueldo');
const btnGuardarPuesto = document.getElementById('btn-guardar-puesto');
const puestoInput = document.getElementById('inputPuesto');


// Función para mostrar la pestaña seleccionada
function mostrarPestana(pestana) {
  tabPanes.forEach((pane) => pane.classList.remove('active'));
  pestana.classList.add('active');

  // Remover la clase 'active' de todos los botones de pestaña
  tabButtons.forEach((button) => button.classList.remove('active'));

  // Agregar la clase 'active' al botón de la pestaña seleccionada
  if (pestana === tabPanes[0]) {
    tabEmpleados.classList.add('active');
  } else if (pestana === tabPanes[1]) {
    tabPuestos.classList.add('active');
  }

  // Cerrar la barra de búsqueda en ambas pestañas
  searchInputEmpleados.classList.remove('active');
  arrowIconEmpleados.classList.remove('open');
  searchInputPuestos.classList.remove('active');
  arrowIconPuestos.classList.remove('open');

  // Restablecer el valor de búsqueda en ambas pestañas
  searchInputEmpleados.value = '';
  searchInputPuestos.value = '';

  // Mostrar todas las filas de la tabla en ambas pestañas
  empleadosTableRows.forEach(function(row) {
    row.style.display = '';
  });
  puestosTableRows.forEach(function(row) {
    row.style.display = '';
  });
}

if(localStorage.getItem('Puesto Modificado')){
  mostrarPestana(tabPanes[1]);
  cargarPuestos();
  localStorage.removeItem('Puesto Modificado');
}

// Evento de clic en la pestaña Empleados
tabEmpleados.addEventListener('click', () => {
  mostrarPestana(tabPanes[0]);
});

// Evento de clic en la pestaña Puestos
tabPuestos.addEventListener('click', () => {
  mostrarPestana(tabPanes[1]);
  cargarPuestos();
});

let Puestos = [];

// Función para cargar los puestos desde el backend
async function cargarPuestos() {
  try {
    const response = await fetch('/puestos');
    const data = await response.json();
    const puestos = data.puestos;
    Puestos = puestos;
    console.log(puestos);
    const tablaPuestos = document.getElementById('tabla-puestos');
    const tbody = tablaPuestos.querySelector('tbody');
    tbody.innerHTML = '';

    puestos.forEach((puesto) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${puesto.puesto}</td>
        <td>$${puesto.sueldo}</td>
        <td>${formatearFecha(puesto.fecha_agregado)}</td>
        <td>
          <button class="btn-editar" data-id="${puesto.id}">✏️</button>
          <button class="btn-eliminar" data-id="${puesto.id}">🗑</button>
        </td>
      `;
      tbody.appendChild(row);
    });

    // Agregar eventos de clic a los botones de edición
    const botonesEditar = document.querySelectorAll('.btn-editar');
    botonesEditar.forEach((boton) => {
      boton.addEventListener('click', abrirModalEditarPuesto);
    });

    // Agregar eventos de clic a los botones de eliminación
    const botonesEliminar = document.querySelectorAll('.btn-eliminar');
    botonesEliminar.forEach((boton) => {
      boton.addEventListener('click', confirmarEliminarPuesto);
    });
  } catch (error) {
    console.error('Error al cargar los puestos:', error);
  }
}

// Función para formatear la fecha en el formato deseado
function formatearFecha(fecha) {
  const [year, month, day] = fecha.split('-');
  const fechaAgregado = new Date(year, month - 1, day);
  const opcionesFecha = { day: '2-digit', month: 'long', year: 'numeric' };
  return fechaAgregado.toLocaleDateString('es-ES', opcionesFecha);
}

// Evento de clic en el botón Agregar Puesto
btnAddPuesto.addEventListener('click', () => {
  modalCrearPuesto.style.display = 'block';
});

// Evento de clic fuera de la modal para cerrarla
window.addEventListener('click', (event) => {
  const modalEditarPuesto = document.getElementById('modal-editar-puesto');
  if (event.target === modalCrearPuesto) {
    cerrarModalCrearPuesto();
  }
  if(event.target === modalEditarPuesto ){
    cerrarModalEditarPuesto();
  }
});

// Función para cerrar la modal de Crear Puesto
function cerrarModalCrearPuesto() {
  modalCrearPuesto.style.display = 'none';
  formCrearPuesto.reset();
  btnGuardarPuesto.disabled = true;
}

// Evento de cambio en los campos de la modal de Crear Puesto
formCrearPuesto.addEventListener('input', () => {
  btnGuardarPuesto.disabled = !(inputPuesto.value && inputSueldo.value);
});


// Evento de envío del formulario de Crear Puesto
formCrearPuesto.addEventListener('submit', async (event) => {
  event.preventDefault();

  const puesto = inputPuesto.value;
  const sueldo = parseFloat(inputSueldo.value);

  try {
    const response = await fetch('/puestos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ puesto, sueldo }),
    });

    if (response.ok) {
      Swal.fire({
        title: 'Datos Guardados',
        text: 'El puesto se ha registrado correctamente',
        icon: 'success'
      }).then( () =>{
        cerrarModalCrearPuesto();
        cargarPuestos();
      });
    
    } else {
      console.error('Error al crear el puesto');
    }
  } catch (error) {
    console.error('Error al crear el puesto:', error);
  }
});



// Función para abrir la modal de editar puesto
function abrirModalEditarPuesto(event) {
  const puestoId = event.target.dataset.id;
  const puesto = Puestos.find((p) => p.id === parseInt(puestoId));

  document.getElementById('puesto-editar').value = puesto.puesto;
  document.getElementById('sueldo-editar').value = puesto.sueldo;
  const btnModificarPuesto = document.getElementById('btn-modificar-puesto');
  // Habilitar el botón de modificar inicialmente
  btnModificarPuesto.disabled = false;
  document.getElementById('puesto-editar').addEventListener('input', validarCamposEditar);
  document.getElementById('sueldo-editar').addEventListener('input', validarCamposEditar);

  const modalEditarPuesto = document.getElementById('modal-editar-puesto');
  modalEditarPuesto.dataset.id = puestoId;
  modalEditarPuesto.style.display = 'block';

  document.getElementById('btn-modificar-puesto').addEventListener('click', modificarPuesto);
}

// Función para validar los campos de la modal de editar puesto
function validarCamposEditar() {
  const inputPuestoEditar = document.getElementById('puesto-editar');
  const inputSueldoEditar = document.getElementById('sueldo-editar');
  const btnModificarPuesto = document.getElementById('btn-modificar-puesto');

  if (inputPuestoEditar.value.trim() === '' || inputSueldoEditar.value.trim() === '') {
    btnModificarPuesto.disabled = true;
  } else {
    btnModificarPuesto.disabled = false;
  }
}

// Función para modificar un puesto
async function modificarPuesto(event) {
  event.preventDefault();

  const puestoId = document.getElementById('modal-editar-puesto').dataset.id;
  const puesto = document.getElementById('puesto-editar').value;
  const sueldo = parseFloat(document.getElementById('sueldo-editar').value);

  try {
    const response = await fetch(`/puestos/${puestoId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ puesto, sueldo }),
    });

    if (response.ok) {
      Swal.fire('Exito', 'El puesto ha sido modificado correctamente.', 'success').then( ()=>{
        cerrarModalEditarPuesto();
        localStorage.setItem('Puesto Modificado', 'Puesto');
        window.location.reload();
      })
    } else {
      console.error('Error al modificar el puesto');
    }
  } catch (error) {
    console.error('Error al modificar el puesto:', error);
  }
}

// Función para cerrar la modal de editar puesto
function cerrarModalEditarPuesto() {
  const modalEditarPuesto = document.getElementById('modal-editar-puesto');
  modalEditarPuesto.style.display = 'none';
  modalEditarPuesto.removeAttribute('data-id');
}

// Función para confirmar la eliminación de un puesto
function confirmarEliminarPuesto(event) {
  const puestoId = event.target.dataset.id;
  const puesto = Puestos.find((p) => p.id === parseInt(puestoId));

  Swal.fire({
    title: '¿Estás seguro?',
    text: `¿Deseas eliminar el puesto "${puesto.puesto}"?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
  }).then((result) => {
    if (result.isConfirmed) {
      eliminarPuesto(puestoId);
    }
  });
}

// Función para eliminar un puesto
async function eliminarPuesto(puestoId) {
  try {
    const response = await fetch(`/puestos/${puestoId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      Swal.fire('Eliminado', 'El puesto ha sido eliminado correctamente.', 'success');
      cargarPuestos();
    } else {
      console.error('Error al eliminar el puesto');
    }
  } catch (error) {
    console.error('Error al eliminar el puesto:', error);
  }
}


//Seccion del campo de sugerencias de puestos:

function debounce(func, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

async function mostrarPuestos() {
  try {
    const respuesta = await fetch('/obtener-puestos');
    const datos = await respuesta.json();

    if (datos) {
      const puestoInput = document.getElementById('inputPuesto');
      const sugerenciasDiv = document.getElementById('sugerencias');
      const mensajePuesto = document.getElementById('mensaje-puesto');
      const salarioInput = document.getElementById('salarioPuesto');
      //Desde aqui
      let puestosFiltrados = [];
      let puestosVisibles = 0;
      const puestosPorCarga = 3;

      const mostrarSugerenciasPuestos = () => {
        const puestoIngresado = puestoInput.value.trim().toLowerCase();
        sugerenciasDiv.innerHTML = '';
        puestosVisibles = 0;
      
        if (puestoIngresado === '') {
          mensajePuesto.textContent = '';
          sugerenciasDiv.style.display = 'none';
          salarioInput.value = '';
          validarInputs();
          return;
        }
      
        puestosFiltrados = datos.puestos.filter(puesto => {
          return puesto.puesto.toLowerCase().includes(puestoIngresado);
        });
      
        if (puestosFiltrados.length > 0) {
          mostrarSugerencias();
          sugerenciasDiv.style.display = 'block';
          mensajePuesto.textContent = '';
        } else {
          sugerenciasDiv.style.display = 'none';
          mensajePuesto.textContent = 'No se encontró ningún puesto con ese nombre.';
          salarioInput.value = '';
        }
      
        // Verificar si el puesto ingresado coincide con algún puesto existente
        const puestoEncontrado = datos.puestos.find(puesto => {
          return puesto.puesto.toLowerCase() === puestoIngresado;
        });
      
        if (puestoEncontrado) {
          salarioInput.value = parseFloat(puestoEncontrado.sueldo).toFixed(2);
        } else {
          salarioInput.value = '';
        }

        validarInputs();
      };

      const mostrarSugerencias = () => {
        const inicio = puestosVisibles;
        const fin = inicio + puestosPorCarga;
        const puestosAMostrar = puestosFiltrados.slice(inicio, fin);

        puestosAMostrar.forEach(puesto => {
          // Verificar si el puesto ya ha sido agregado
          const puestoExistente = Array.from(sugerenciasDiv.children).find(sugerencia => {
            return sugerencia.dataset.puestoId === puesto.id.toString();
          });

          if (!puestoExistente) {
            const sugerencia = document.createElement('div');
            sugerencia.textContent = puesto.puesto;
            sugerencia.dataset.puestoId = puesto.id;
            sugerencia.dataset.sueldo = puesto.sueldo;
            sugerencia.addEventListener('click', function () {
              puestoInput.value = this.textContent;
              puestoInput.dataset.puestoId = this.dataset.puestoId;
              salarioInput.value = parseFloat(this.dataset.sueldo).toFixed(2);
              sugerenciasDiv.innerHTML = '';
              sugerenciasDiv.style.display = 'none';
              mensajePuesto.textContent = '';
            });
            sugerenciasDiv.appendChild(sugerencia);
          }
        });

        puestosVisibles += puestosAMostrar.length;

        if (puestosVisibles < puestosFiltrados.length) {
          sugerenciasDiv.style.overflowY = 'scroll';
        } else {
          sugerenciasDiv.style.overflowY = 'auto';
        }
      };

      const cargarSugerencias = () => {
        if (puestosVisibles < puestosFiltrados.length) {
          mostrarSugerencias();
        }
      };

      const mostrarSugerenciasDebounced = debounce(mostrarSugerenciasPuestos, 300);

      puestoInput.addEventListener('input', () => {
        mostrarSugerenciasDebounced();
        verificarPuestoSeleccionado();
      });
      
      const verificarPuestoSeleccionado = () => {
        const puestoIngresado = puestoInput.value.trim().toLowerCase();
        const puestoEncontrado = datos.puestos.find(puesto => {
          return puesto.puesto.toLowerCase() === puestoIngresado;
        });
      
        if (!puestoEncontrado) {
          salarioInput.value = '';
        }
      };

      sugerenciasDiv.addEventListener('scroll', function () {
        const scrollTop = this.scrollTop;
        const scrollHeight = this.scrollHeight;
        const clientHeight = this.clientHeight;

        if (scrollTop + clientHeight >= scrollHeight) {
          cargarSugerencias();
        }
      });

      puestoInput.addEventListener('click', function () {
        if (sugerenciasDiv.innerHTML !== '') {
          sugerenciasDiv.style.display = 'block';
        }
      });

      document.addEventListener('click', function (event) {
        if (!puestoInput.contains(event.target) && !sugerenciasDiv.contains(event.target)) {
          sugerenciasDiv.style.display = 'none';
        }
      });



            
      function validarCampos() {
      
        const puestoInput = document.getElementById('inputPuesto');
        const sueldo = document.getElementById('salarioPuesto');
       
      
        if ((puestoInput.value.trim() !== '') && (sueldo.value.trim() !== '')) {
          const puestoSeleccionado = datos.puestos.find(puesto => {
            return puesto.puesto.toLowerCase() === puestoInput.value.trim().toLowerCase();
          });
      
          if (puestoSeleccionado) {
            inputsPuestoSueldo = true;
          }else{
            inputsPuestoSueldo = false;
          }
        }
      
        console.log('Campos Llenos: ', camposLlenos);
        console.log('Inputs Sueldo Puesto: ', inputsPuestoSueldo);
        return inputsPuestoSueldo;
      }

      

      puestoInput.addEventListener("change", validarInputs);

      // Llamar a validarCampos() cuando se seleccione una sugerencia de puesto
      sugerenciasDiv.addEventListener('click', (event) => {
        if (event.target.classList.contains('sugerencia')) {
          validarInputs();
        }
      });

      // Llamar a validarCampos() cuando se cierre la lista desplegable
      document.addEventListener('click', (event) => {
        if (!puestoInput.contains(event.target) && !sugerenciasDiv.contains(event.target)) {
          validarInputs();
        }
      });
    } else {
      console.error('No se encontraron puestos disponibles.');
    }
  } catch (err) {
    console.error('Hay un error en la función mostrarPuestos:', err);
  }
}

// Llamar a la función mostrarPuestos cuando el usuario hace clic en el campo de entrada de texto de los puestos
puestoInput.addEventListener('click', function () {
  mostrarPuestos();
});





// Agregar listener de click

formulario.addEventListener('submit', guardarEmpleado);

async function guardarEmpleado(e) {
    e.preventDefault();
  
    const nombre = document.getElementById('nombre').value;
    const apellido_paterno = document.getElementById('apellido_paterno').value;
    const apellido_materno = document.getElementById('apellido_materno').value;
    const telefono = document.getElementById('telefono').value;
    const puestoInput = document.getElementById('inputPuesto');
    const puestoId = puestoInput.dataset.puestoId;
  
    if (si.checked) {
      infonavit = 'Si';
    } else if (no.checked) {
      infonavit = 'No';
    } else if (si.checked == false && no.checked == false) {
      infonavit = null;
    }
  
    if (document.getElementById('nss').value == '') {
      nss = null;
    } else {
      nss = document.getElementById('nss').value;
    }
  
    const salario = document.getElementById('salarioPuesto').value;
  
    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('apellido_paterno', apellido_paterno);
    formData.append('apellido_materno', apellido_materno);
    formData.append('telefono', telefono);
    formData.append('id_puesto', puestoId);
    formData.append('nss', nss);
    formData.append('infonavit', infonavit);
    formData.append('salario', salario);
  
    const ineFile = document.getElementById('ine-input').files[0];
    if (ineFile) {
      const uniqueFilename = `${Date.now()}_${ineFile.name}`;
      formData.append('ine', ineFile, uniqueFilename);
    }
  
    try {
      // Mostrar la animación de carga
      document.getElementById('loading-overlay').style.display = 'flex';
      const respuesta = await fetch('/crear', {
        method: 'POST',
        body: formData
      });

      // Ocultar la animación de carga
      document.getElementById('loading-overlay').style.display = 'none';
  
      if (respuesta.ok) {
        Swal.fire({
          title: 'Datos Guardados',
          text: 'El empleado se ha registrado',
          icon: 'success'
        }).then(() => {
          // Cerrar modal aquí
          modal.style.display = 'none';
          // Restaurar título por defecto
          title.textContent = 'Nuevo Empleado';
          window.location.reload();
        });
      }
    } catch (error) {
      // Ocultar la animación de carga
      document.getElementById('loading-overlay').style.display = 'none';
      Swal.fire({
        title: 'Error',
        text: 'Ocurrió un error al guardar el empleado',
        icon: 'error'
      });
    }
  }

    //Logica de modificacion de datos

    const btnEdit = document.querySelectorAll('.btn-edit');

    btnEdit.forEach(btnE => {

        btnE.addEventListener('click', abrirModalEditar);
      
      });

      function abrirModalEditar(e){

        formulario.removeEventListener('submit', guardarEmpleado);
        e.preventDefault();
        localStorage.setItem('Modificar', 'modificar');
        editando = true;
         //Cambiar el titulo
         const btn = document.getElementById('btnGM');
         
        if(localStorage.getItem('Modificar') && btn.disabled == true){
          
          btn.disabled = false;
        }
        console.log('BTNDISABLED = ',btn.disabled);
         btn.classList.add('btn-modificar');
         btn.classList.remove('btn-guardar');
         title.textContent = 'Modificar Empleado';
         const btnModificar = document.querySelector('.btn-modificar');
         btnModificar.textContent = 'Modificar';
        // Abre la ventana modal
        modal.style.display = "block";
        
       
        try{
            
            const idEmpleado = e.target.dataset.id;
            fetch(`/edit/${idEmpleado}`)
            .then(res => res.json()).catch(err => {
                console.error(err); 
              })
            .then(data => {
              let { nombre, apellido_paterno, apellido_materno, telefono, id_puesto, NSS, infonavit, salario, ine_file_id } = data.empleado;

               // Verificar si existe una imagen del INE en la base de datos
              if (ine_file_id) {
                // Obtener la imagen desde Google Drive y mostrarla en el preview
                const inePreview = document.getElementById('ine-preview');
                inePreview.src = `/imagen-proxy?fileId=${ine_file_id}`;
                inePreview.style.display = 'block';
              } else {
                // Mostrar la imagen por defecto en el preview
                const inePreview = document.getElementById('ine-preview');
                inePreview.src = '/images/logo_credencial.jpeg';
                inePreview.style.display = 'block';
              }


            // Inyectar valores en los campos del modal
            document.getElementById('nombre').value = nombre
            document.getElementById('apellido_paterno').value = apellido_paterno
            document.getElementById('apellido_materno').value = apellido_materno
            document.getElementById('telefono').value = telefono
            const puestoSeleccionado = data.empleado.puesto;
            document.getElementById('inputPuesto').value = puestoSeleccionado;
            document.getElementById('inputPuesto').dataset.puestoId = id_puesto;

            document.getElementById('nss').value = NSS;

            if((infonavit != '' && infonavit != null)){
                
                if(infonavit.toLowerCase() == 'si'){
                    si.checked = true;
                }else if(infonavit.toLowerCase() == 'no'){
                    no.checked = true;
                }
               
           
            }else{
                si.checked = false;
                no.checked = false;
            }
           
            document.getElementById('salarioPuesto').value = salario.toFixed(2);;
            btnModificar.addEventListener('click', modificarEmpleado);

            window.onclick = function(event){
              if (event.target == modal) {
                btnModificar.removeEventListener('click', modificarEmpleado);
                localStorage.removeItem('Modificar');
                modal.style.display = "none";
                restablecerFormulario();
            }if (event.target == modal2){
              modal2.style.display = "none";
            }
              
              
            }

            async function modificarEmpleado(e){
            
        
            e.preventDefault();
            

            const nombre = document.getElementById('nombre').value;
            const apellido_paterno = document.getElementById('apellido_paterno').value;
            const apellido_materno = document.getElementById('apellido_materno').value;
            const telefono = document.getElementById('telefono').value;
            const puestoInput = document.getElementById('inputPuesto');
            const id_puesto = puestoInput.dataset.puestoId;
            if(si.checked) {
                infonavit = 'Si';
            }else if (no.checked){
                infonavit = 'No';
            }else if(!(si.checked) && !(no.checked)) {
                infonavit = null;
            }

            if(document.getElementById('nss').value != '' && document.getElementById('nss').value != null){
                nss = document.getElementById('nss').value;
            }else{
                nss = null;
            }
            const salario = document.getElementById('salarioPuesto').value;
            const ineFile = document.getElementById('ine-input').files[0];
            const idFolder = data.empleado.id_folder;

            const formData = new FormData();
            formData.append('nombre', nombre);
            formData.append('apellido_paterno', apellido_paterno);
            formData.append('apellido_materno', apellido_materno);
            formData.append('telefono', telefono);
            formData.append('id_puesto', id_puesto);
            formData.append('nss', nss);
            formData.append('infonavit', infonavit);
            formData.append('salario', salario);

            if (ineFile) {
              formData.append('ine', ineFile);
              formData.append('id_folder', idFolder);
            }

            document.getElementById('loading-overlay').style.display = 'flex';
            document.getElementById('p-animacion').textContent = 'Modificando Empleado...';

            const respuesta = await fetch(`/edit/${idEmpleado}`, {
              method: 'POST',
              body: formData
            });

            document.getElementById('loading-overlay').style.display = 'none';

            if(respuesta.ok){
                Swal.fire({
                    title: 'Datos Modificados',
                    text: 'El empleado se ha modificado',
                    icon: 'success'
                 }).then(() => {
                    // Cerrar modal aquí  
                     modal.style.display = 'none';
               
                    // Restaurar título por defecto
                    title.textContent = 'Nuevo Empleado';
               
                    editando = false;
                    // Deshabilitar el botón de guardar
                    button.disabled = true;
                    btn.classList.add('btn-guardar');
                    btn.classList.remove('btn-modificar');
                    btnModificar.removeEventListener('click', modificarEmpleado);
                    formulario.addEventListener('submit', guardarEmpleado);
                    window.location.reload();
                 });

            }
            
            btn.classList.add('btn-guardar');
            btn.classList.remove('btn-modificar');
            btn.removeEventListener('click', modificarEmpleado);

        }

            button.disabled = false;

            }).catch(err => {
                console.error(err); 
              })           
            
        

        }catch(err){
          document.getElementById('loading-overlay').style.display = 'none';
            console.err(err);
        }



      }

      const btnDelete = document.querySelectorAll('.btn-delete');

btnDelete.forEach(btn => {
  btn.addEventListener('click', abrirEliminar);
});

async function abrirEliminar(e) {
  const idEmpleado = e.target.dataset.id;

  try {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción es irreversible!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Eliminar empleado!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        document.getElementById('loading-overlay').style.display = 'flex';
        document.getElementById('p-animacion').textContent = 'Eliminando Empleado...';
        const respuesta = await fetch(`/delete/${idEmpleado}`, {
          method: 'DELETE'
        });

        document.getElementById('loading-overlay').style.display = 'none';

        if (respuesta.ok) {
          Swal.fire({
            title: "Borrado!",
            text: "El empleado ha sido eliminado correctamente.",
            icon: "success"
          }).then(() => {
            window.location.reload();
          });
        } else {
          Swal.fire({
            title: "Error!",
            text: "Hubo un problema al eliminar el empleado.",
            icon: "error"
          });
        }
      }
    });
  } catch (err) {
    console.error(err);
  }
}

/* lOGICA DEL FILTRO */

document.addEventListener('DOMContentLoaded', function() {
  var searchInput = document.getElementById('searchInput');
  var tableRows = document.querySelectorAll('table tbody tr');

  searchInput.addEventListener('input', function() {
    var searchTerm = this.value.toLowerCase();

    tableRows.forEach(function(row) {
      var nombre = row.querySelector('td:first-child').textContent.toLowerCase();

      if (nombre.includes(searchTerm)) {
        row.style.display = ''; // Mostrar la fila si coincide con el término de búsqueda
      } else {
        row.style.display = 'none'; // Ocultar la fila si no coincide con el término de búsqueda
      }
    });
  });
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






/* ================================= FILTRO ============================== */

const searchInputEmpleados = document.getElementById('searchInput');
const searchIconEmpleados = document.querySelector('.empleados-search-container .search-icon');
const arrowIconEmpleados = document.querySelector('.empleados-search-container .arrow-icon');
const empleadosTableRows = document.querySelectorAll('table tbody tr');

const searchInputPuestos = document.getElementById('searchInputPuestos');
const searchIconPuestos = document.querySelector('.puestos-search-container .search-icon');
const arrowIconPuestos = document.querySelector('.puestos-search-container .arrow-icon');
const puestosTableRows = document.querySelectorAll('#tabla-puestos tbody tr');

function initSearchContainer(searchInput, searchIcon, arrowIcon, tableRows) {
  searchIcon.addEventListener('click', function() {
    searchInput.classList.toggle('active');
    arrowIcon.classList.toggle('open');
    
    if (searchInput.classList.contains('active')) {
      setTimeout(function() {
        searchInput.focus();
      }, 300);
    } else {
      searchInput.blur();
    }
  });

  searchInput.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();

    tableRows.forEach(function(row) {
      const nombre = row.querySelector('td:first-child').textContent.toLowerCase();

      if (nombre.includes(searchTerm)) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  });
}

initSearchContainer(searchInputEmpleados, searchIconEmpleados, arrowIconEmpleados, empleadosTableRows);
initSearchContainer(searchInputPuestos, searchIconPuestos, arrowIconPuestos, puestosTableRows);
/*

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

    

*/