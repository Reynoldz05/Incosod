// Obtener elementos del DOM
const nombreCuadrillaElement = document.getElementById('nombre-cuadrilla');
const tablaDetalleAsistencias = document.getElementById('tabla-detalle-asistencias');
const modal = document.getElementById('modal');
const modal2 = document.getElementById('modal2');
// Obtener los parámetros de la URL
const urlParams = new URLSearchParams(window.location.search);
const idAsistenciaCuadrilla = urlParams.get('idAsistenciaCuadrilla');
const nombreCuadrilla = urlParams.get('nombreCuadrilla');
const adjuntarIcono = document.getElementById('adjuntar');
const adjuntarEtiqueta = document.getElementById('adjuntar-etiqueta');
let fotoCapturada = null;

console.log(idAsistenciaCuadrilla);
// Mostrar el nombre de la cuadrilla en el título
nombreCuadrillaElement.textContent = nombreCuadrilla;


window.onclick = (e) => {
    if (e.target === modal) { 
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
          });

        modal.style.display = "none";
    }
    if (e.target === modal2){
        modal2.style.display = "none";
    }
    
}

// Función para obtener el detalle de asistencias de la cuadrilla
async function obtenerDetalleAsistenciasCuadrilla(idAsistenciaCuadrilla) {
    try {
        const response = await fetch(`/obtener-detalle-asistencias-cuadrilla/${idAsistenciaCuadrilla}`);
        const detalleAsistencias = await response.json();
        return detalleAsistencias;
    } catch (error) {
        console.error('Error al obtener el detalle de asistencias de la cuadrilla:', error);
    }
}

// Función para mostrar el detalle de asistencias en la tabla
function mostrarDetalleAsistencias(detalleAsistencias) {
    tablaDetalleAsistencias.innerHTML = '';
    console.log(detalleAsistencias);


    detalleAsistencias.forEach(detalle => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${detalle.nombre} ${detalle.apellido_paterno} ${detalle.apellido_materno}</td>
            <td>
                ${detalle.estado}
                ${detalle.estado === 'Falta Justificada' ? `
                    <span class="icons">
                        <span id="visibility" class="material-icons icon-justificada" data-id="${detalle.id_detalle}">visibility</span>
                    </span>
                ` : ''}
                ${detalle.estado === 'Falta Pendiente' ? `
                    <span class="icons">
                        <span id="description" class="material-icons icon-falta" data-id="${detalle.id_detalle}">description</span>
                    </span>
                ` : ''}
            </td>
            <td>${formatearFecha(detalle.fecha_asistencia)}</td>
            <td>${detalle.hora_entrada ? formatearHora(detalle.hora_entrada) : 'No asistió'}</td>
            <td>${detalle.horas_laboradas ? `${detalle.horas_laboradas} horas` : 'No asistió'}</td>
            <td>${detalle.horas_extra}</td>
        `;
        tablaDetalleAsistencias.appendChild(row);
    });
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

// Función para calcular las horas extra
function calcularHorasExtra(horaInicio, horaFin, horasLaboradas) {
    const [horasInicio, minutosInicio] = horaInicio.split(':');
    const [horasFin, minutosFin] = horaFin.split(':');

    const inicioMinutos = parseInt(horasInicio) * 60 + parseInt(minutosInicio);
    const finMinutos = parseInt(horasFin) * 60 + parseInt(minutosFin);

    const diferenciaMinutos = finMinutos - inicioMinutos;
    const diferenciaHoras = Math.floor(diferenciaMinutos / 60);

    if (horasLaboradas > diferenciaHoras) {
        const horasExtra = horasLaboradas - diferenciaHoras;
        return `${horasExtra} horas`;
    } else {
        return 'No aplica';
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
  
  /*
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
  });//*/
  
  /*
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
  });//*/
  
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


// Función para abrir el modal de justificación
function abrirModalJustificacion(idDetalle) {
    const modal = document.getElementById('modal');
    const descripcionTextarea = document.getElementById('descripcion');
    const justificadaCheckbox = document.getElementById('justificada');
    const noJustificadaCheckbox = document.getElementById('no-justificada');
    const terminarButton = document.getElementById('terminar');

    // Limpiar los campos del modal
    descripcionTextarea.value = '';
    justificadaCheckbox.checked = false;
    noJustificadaCheckbox.checked = false;
    descripcionTextarea.disabled = true;
    terminarButton.disabled = true;

    // Agregar event listeners a los checkboxes
    justificadaCheckbox.addEventListener('change', () => {
        noJustificadaCheckbox.checked = false;
        descripcionTextarea.disabled = !justificadaCheckbox.checked;
        terminarButton.disabled = !justificadaCheckbox.checked && !noJustificadaCheckbox.checked;
    });

    noJustificadaCheckbox.addEventListener('change', () => {
        justificadaCheckbox.checked = false;
        descripcionTextarea.disabled = true;
        terminarButton.disabled = !justificadaCheckbox.checked && !noJustificadaCheckbox.checked;
    });

    // Agregar event listener al ícono de adjuntar evidencia
    const adjuntarIcono = document.getElementById('adjuntar');
    const adjuntarEtiqueta = document.getElementById('adjuntar-etiqueta');

    adjuntarIcono.addEventListener('click', (event) => {
        event.stopPropagation();
        if (esMobileDevice()) {
            mostrarModalEvidencia();
        }else {
            document.getElementById('file-input').click();
          }
    });

    // Agregar event listener al botón de terminar
    terminarButton.addEventListener('click', () => {
        const motivo = descripcionTextarea.value;
        const esJustificada = justificadaCheckbox.checked;

        // Realizar la lógica para guardar la justificación o la falta no justificada
        if (esJustificada) {
            const formData = new FormData();
            formData.append('idDetalleAsistencia', idDetalle);
            formData.append('motivo', motivo);
            
            if (fotoCapturada) {
              formData.append('evidencia', fotoCapturada);
            } else {
              const fileInput = document.getElementById('file-input');
              if (fileInput.files.length > 0) {
                formData.append('evidencia', fileInput.files[0]);
              }
            }
            guardarJustificacion(idDetalle);
        } else {
            guardarFaltaNoJustificada(idDetalle);
        }

        // Cerrar el modal
        modal.style.display = 'none';
    });


    // Mostrar el modal
    modal.style.display = 'block';
}

function mostrarModalEvidencia() {
    const modalEvidencia = document.getElementById('modal-evidencia');
    modalEvidencia.style.display = 'block';

    const opcionArchivo = document.getElementById('opcion-archivo');
    const opcionFotografia = document.getElementById('opcion-fotografia');

    if(adjuntarIcono){
    opcionArchivo.addEventListener('click', () => {
        document.getElementById('file-input').click();
        modalEvidencia.style.display = 'none';
    },{ once: true });

    opcionFotografia.addEventListener('click', () => {
        modalEvidencia.style.display = 'none';
        tomarFotografia();
    },{ once: true });
}
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
                const file = new File([blob], 'fotografia.jpg', { type: 'image/jpeg' });
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                document.getElementById('file-input').files = dataTransfer.files;
  
                // Eliminar el contenedor de la cámara
                contenedorCamara.remove();
  
                // Cambiar el ícono y la etiqueta de adjuntar evidencia
                cambiarIconoEtiqueta();
              });
          });
        })
        .catch(error => {
          console.error('Error al acceder a la cámara:', error);
          // Mostrar un mensaje de error al usuario
          Swal.fire({
            title: 'Error',
            text: 'No se pudo acceder a la cámara. Por favor, verifica los permisos y asegúrate de que la cámara esté disponible.',
            icon: 'error'
          });
        });
    } else {
      console.error('La API de MediaDevices no es compatible con este navegador.');
      // Mostrar un mensaje de error al usuario
      Swal.fire({
        title: 'Error',
        text: 'Tu navegador no admite el acceso a la cámara.',
        icon: 'error'
      });
    }
  }

// Función para guardar la justificación
async function guardarJustificacion(idDetalle) {
    try {
      const motivo = document.getElementById('descripcion').value;
      const justificadaCheckbox = document.getElementById('justificada');
      const formData = new FormData();
      const fileInput = document.getElementById('file-input');
      formData.append('idDetalleAsistencia', idDetalle);
      formData.append('motivo', motivo);
  
      if (justificadaCheckbox.checked) {
        if (fileInput.files.length > 0) {
          formData.append('evidencia', fileInput.files[0]);
        }
      }
  
      // Mostrar la animación de carga
      document.getElementById('loading-overlay').style.display = 'flex';
  
      const response = await fetch('/justificarFaltasDiarias', {
        method: 'POST',
        body: formData
      });
  
      // Ocultar la animación de carga
      document.getElementById('loading-overlay').style.display = 'none';
  
      if (response.ok) {
        Swal.fire({
          title: 'Acción Realizada',
          text: 'Falta Justificada',
          icon: 'success'
        }).then(async () => {
          // Restablecer los campos de evidencia y cerrar el modal
          fileInput.value = '';
          adjuntarIcono.textContent = 'edit';
        adjuntarEtiqueta.textContent = 'Cambiar Evidencia';
          
  
          // Actualizar la tabla de detalle de asistencias
          const detalleAsistencias = await obtenerDetalleAsistenciasCuadrilla(idAsistenciaCuadrilla);
          mostrarDetalleAsistencias(detalleAsistencias);
          document.getElementById('modal').style.display = 'none';
        });
      } else {
        console.error('Error al guardar la justificación');
      }
    } catch (error) {
      console.error('Error al guardar la justificación:', error);
    }
  }




// Función para guardar la falta no justificada
async function guardarFaltaNoJustificada(idDetalleAsistencia) {
    try {
        const response = await fetch('/establecerFaltas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ idDetalleAsistencia })
        });

        if (response.ok) {
            // Actualizar la tabla de detalle de asistencias
            const detalleAsistencias = await obtenerDetalleAsistenciasCuadrilla(idAsistenciaCuadrilla);
            mostrarDetalleAsistencias(detalleAsistencias);
        } else {
            console.error('Error al guardar la falta no justificada');
        }
    } catch (error) {
        console.error('Error al guardar la falta no justificada:', error);
    }
}

// Función para abrir el modal de información de la justificación
async function abrirModalInformacionJustificacion(idDetalle) {
    console.log('idDetalle: ',idDetalle);
    const modal = document.getElementById('modal2');
    const descripcionTextarea = document.getElementById('descripcion2');
    const verEvidenciaLink = document.getElementById('ver-evidencia');
    const verLabelEvidencia = document.getElementById('ver-evidencia-label');
    
  
    // Obtener la información de la justificación desde el servidor
    await obtenerInformacionJustificacion(idDetalle)
      .then(informacion => {
        console.log("Informacion: ",informacion);
        console.log("Motivo: ",informacion.motivo);
        console.log("Evidencia: ",informacion.evidencia);
        // Mostrar la información en el modal
        descripcionTextarea.value = informacion.motivo;
  
        if (informacion.evidencia) {
          verEvidenciaLink.style.display = 'inline-block';
          verEvidenciaLink.parentElement.addEventListener('click', () => {
            window.open(informacion.evidencia, '_blank');
          });
        } else {
          verEvidenciaLink.style.display = 'none';
          verLabelEvidencia.style.display = 'none';
        }
  
        // Mostrar el modal
        modal.style.display = 'block';
      })
      .catch(error => {
        console.error('Error al obtener la información de la justificación:', error);
      });
  }

// Función para obtener la información de la justificación desde el servidor
async function obtenerInformacionJustificacion(idDetalleAsistencia) {
    try {
        const response = await fetch(`/obtener-justificaciones-info/${idDetalleAsistencia}`);
        const informacion = await response.json();
        return informacion; // Devuelve el primer elemento del array de justificaciones
    } catch (error) {
        console.error('Error al obtener la información de la justificación:', error);
    }
}



// Cargar el detalle de asistencias al cargar la página
document.addEventListener('DOMContentLoaded', async () => {
    const detalleAsistencias = await obtenerDetalleAsistenciasCuadrilla(idAsistenciaCuadrilla);
    mostrarDetalleAsistencias(detalleAsistencias);

    // Agregar event listeners a los iconos de justificación y falta pendiente
    tablaDetalleAsistencias.addEventListener('click', (event) => {
        if (event.target.classList.contains('icon-justificada')) {
            const idDetalle = event.target.dataset.id;
            abrirModalInformacionJustificacion(idDetalle);
        } else if (event.target.classList.contains('icon-falta')) {
            const idDetalle = event.target.dataset.id;
            abrirModalJustificacion(idDetalle);
        }
    });
});