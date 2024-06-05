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

//////////////////////////// Obtener elementos del DOM
const agregarUsuarioBtn = document.getElementById('agregar-usuario');
const modalAgregar = document.getElementById('modal-agregar-usuario');
const modalInfo = document.getElementById('modal-info-usuario');
const cancelarBtns = document.querySelectorAll('.cancelar');
const usuariosSection = document.querySelector('.usuarios-section');


async function obtenerUsuarios() {
  try {
    const respuesta = await fetch('/obtener-usuarios');
    const usuarios = await respuesta.json();
    generarTarjetasUsuarios(usuarios);
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
  }
}

// Llamar a la función obtenerUsuarios() al cargar la página
document.addEventListener('DOMContentLoaded', obtenerUsuarios);

// Abrir la modal al hacer clic en "Agregar Usuario"
agregarUsuarioBtn.addEventListener('click', () => {
  document.getElementById('modal-agregar-usuario').style.display = 'block';
  mostrarEmpleadosDebounced(); // Llamada a la función para cargar los empleados disponibles
});

const btnCancelarAgregar = document.getElementById('btnCancelarAgregar');

btnCancelarAgregar.addEventListener('click', ()=>{
  resetearCampos();
  const btnGuardar = document.getElementById('btnGuardar');
  btnGuardar.disabled = true;
})

// Cerrar la modal al hacer clic en "Cancelar"
cancelarBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    modalAgregar.style.display = 'none';
    resetearCampos();
  });
});

// Cerrar la modal al hacer clic fuera de ella
window.addEventListener('click', (event) => {
  if (event.target === modalAgregar) {
    const btnGuardar = document.getElementById('btnGuardar');
    btnGuardar.disabled = true;
    modalAgregar.style.display = 'none';
    resetearCampos();
  }
  if (event.target === modalInfo) {
    modalInfo.style.display = 'none';
    const inputs = Array.from(modalInfo.querySelectorAll('input'));
    const mensajeErrorPassword = document.getElementById('password-match-error-info');
    const mensajeErrorAlias = document.getElementById('error-alias');
    if(mensajeErrorPassword){
      mensajeErrorPassword.textContent = '';
    }

    if(mensajeErrorAlias){
      mensajeErrorAlias.textContent = '';
    }
    inputs.forEach(input => {
      input.disabled = true;
    });
    const confirmIcons = document.querySelectorAll('.confirm-icon');
    
    if(confirmIcons){
      confirmIcons.forEach(icon => {
          icon.textContent = 'edit';
          icon.classList.remove('confirm-icon');
          icon.classList.add('edit-icon');
      });
    }
    
  }
});


function resetearCampos() {
  document.getElementById('empleado').value = '';
  document.getElementById('empleado').dataset.empleadoId = '';
  document.getElementById('alias').value = '';
  document.getElementById('contraseña').value = '';
  document.getElementById('confirmar-contraseña').value = '';
  document.getElementById('foto-perfil').value = '';
  document.getElementById('password-match-error').textContent = '';
  document.getElementById('mensaje-empleado').textContent = '';
}

// Función para agregar un nuevo usuario
function agregarUsuario(nombre, alias, contraseña, fotoPerfil) {
  const usuarioBlock = document.createElement('div');
  usuarioBlock.classList.add('usuario-block');

  
  let imagenPerfil = '/images/foto-perfil3.jpg'; // Imagen predeterminada

  if (fotoPerfil) {
    // Si el usuario tiene una imagen de perfil, obtener la URL de la imagen desde Google Drive
    const imageUrl = `/imagen-proxy?fileId=${fotoPerfil}`;
    imagenPerfil = imageUrl;
  }


  usuarioBlock.innerHTML = `
    <img src="${imagenPerfil}" alt="Foto de perfil" class="foto-perfil">
    <p class="alias">${alias}</p>
    <span class="info-usuario material-icons">info</span>
  `;
  usuariosSection.appendChild(usuarioBlock);
}

// Función para alternar la visibilidad de la contraseña
function togglePasswordVisibility(inputId, iconId) {
  const passwordInput = document.getElementById(inputId);
  const icono = document.getElementById(iconId);
  
  if (passwordInput && icono) {
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      icono.textContent = 'visibility_off';
    } else {
      passwordInput.type = 'password';
      icono.textContent = 'visibility';
    }
  } 
}

function validarConfirmarContraseña() {
  const contraseña = document.getElementById('contraseña').value;
  const confirmarContraseña = document.getElementById('confirmar-contraseña').value;
  const passwordMatchError = document.getElementById('password-match-error');

  if (contraseña !== confirmarContraseña) {
    passwordMatchError.textContent = 'Las contraseñas no coinciden.';
  } else {
    passwordMatchError.textContent = '';
  }

  validarFormulario();
}

function validarFormulario() {
  const botonGuardar = document.querySelector('button[type="submit"]');
  const esValido = validarCampos();

  if (esValido) {
    botonGuardar.disabled = false;
  } else {
    botonGuardar.disabled = true;
  }
}

function validarCampos() {
  const empleado = document.getElementById('empleado').value;
  const empleadoId = document.getElementById('empleado').dataset.empleadoId;
  const alias = document.getElementById('alias').value;
  const contraseña = document.getElementById('contraseña').value;
  const confirmarContraseña = document.getElementById('confirmar-contraseña').value;
  const passwordMatchError = document.getElementById('password-match-error');
  const mensajeEmpleado = document.getElementById('mensaje-empleado');

  let esValido = true;

  if (!empleadoId) {
    mensajeEmpleado.textContent = 'Por favor, seleccione un empleado válido de la lista.';
    esValido = false;
  } else {
    mensajeEmpleado.textContent = '';
  }

  if (contraseña !== confirmarContraseña) {
    passwordMatchError.textContent = 'Las contraseñas no coinciden.';
    esValido = false;
  } else {
    passwordMatchError.textContent = '';
  }

  return esValido;
}



function generarTarjetasUsuarios(usuarios) {
  const usuariosSection = document.querySelector('.usuarios-section');
  usuariosSection.innerHTML = '';

  usuarios.forEach(usuario => {
    
    const usuarioBlock = document.createElement('div');
    usuarioBlock.classList.add('usuario-block');

    let imagenPerfil = '/images/foto-perfil3.jpg'; // Imagen predeterminada

    if (usuario.fotoPerfil) {
      // Si el usuario tiene una imagen de perfil, obtener la URL de la imagen desde Google Drive
      const imageUrl = `/imagen-proxy?fileId=${usuario.fotoPerfil}`;
      imagenPerfil = imageUrl;
    }

    usuarioBlock.innerHTML = `
    <div class="eliminar-usuario" data-id="${usuario.id_empleado}" data-alias="${usuario.alias}">
      <i class="fas fa-trash-alt"></i>
    </div>
    <img src="${imagenPerfil}" alt="Foto de perfil" class="foto-perfil">
    <p class="alias">${usuario.alias}</p>
    <span class="info-usuario material-icons" data-id-empleado="${usuario.id_empleado}">info</span>
  `;

    usuariosSection.appendChild(usuarioBlock);
  });


  // Agregar evento de clic al logo de bote de basura
  const eliminarUsuarioIcons = document.querySelectorAll('.eliminar-usuario');
  eliminarUsuarioIcons.forEach(icon => {
    icon.addEventListener('click', () => {
      const empleadoId = icon.dataset.id;
      const alias = icon.dataset.alias;

      Swal.fire({
        title: '¿Estás seguro?',
        text: `¿Deseas eliminar al usuario "${alias}"?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      }).then(async (result) => {
        if (result.isConfirmed) {
          await eliminarUsuario(empleadoId, alias);
        }
      });
    });
  });



}



async function eliminarUsuario(empleadoId, alias) {
  try {
    // Mostrar la animación de carga
    document.getElementById('loading-overlay').style.display = 'flex';
    document.getElementById('p-animacion').textContent = 'Eliminando Usuario...';
    const respuesta = await fetch(`/eliminar-usuario/${empleadoId}`, {
      method: 'DELETE'
    });

    document.getElementById('loading-overlay').style.display = 'none';
    document.getElementById('p-animacion').textContent = 'Creando Usuario...';

    if (respuesta.ok) {
      Swal.fire(
        '¡Eliminado!',
        `El usuario "${alias}" ha sido eliminado exitosamente.`,
        'success'
      ).then(() => {
        // Actualizar la lista de usuarios después de la eliminación
        obtenerUsuarios();
      });
    } else {
      Swal.fire(
        'Error',
        'Hubo un problema al eliminar el usuario. Por favor, intenta nuevamente.',
        'error'
      );
    }
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
    Swal.fire(
      'Error',
      'Hubo un problema al eliminar el usuario. Por favor, intenta nuevamente.',
      'error'
    );
  }
}



function debounce(func, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}


async function mostrarEmpleados() {
  try {
    const respuesta = await fetch('/mostrar-empleados-disponibles');
    const datos = await respuesta.json();

    if (datos) {
      const empleadoInput = document.getElementById('empleado');
      const sugerenciasDiv = document.getElementById('sugerencias');
      const mensajeEmpleado = document.getElementById('mensaje-empleado');

      let empleadosFiltrados = [];

      empleadoInput.addEventListener('input', function () {
        const nombreIngresado = this.value.trim().toLowerCase();
        sugerenciasDiv.innerHTML = '';

        if (nombreIngresado === '') {
          mensajeEmpleado.textContent = '';
          sugerenciasDiv.style.display = 'none';
          return;
        }

        empleadosFiltrados = datos.empleados.filter(empleado => {
          const nombreCompleto = `${empleado.nombre} ${empleado.apellido_paterno} ${empleado.apellido_materno}`.toLowerCase();
          return nombreCompleto.includes(nombreIngresado);
        });

        if (empleadosFiltrados.length > 0) {
          mostrarSugerencias(empleadosFiltrados);
          sugerenciasDiv.style.display = 'block';
          mensajeEmpleado.textContent = '';
        } else {
          sugerenciasDiv.style.display = 'none';
          mensajeEmpleado.textContent = 'No hay ningún empleado encargado con ese nombre o el empleado encargado que busca ya tiene asignado un usuario.';
        }
    
        // Validar si se ha seleccionado un empleado válido
        const empleadoSeleccionado = empleadosFiltrados.find(empleado => {
          const nombreCompleto = `${empleado.nombre} ${empleado.apellido_paterno} ${empleado.apellido_materno}`.toLowerCase();
          return nombreCompleto === nombreIngresado;
        });
    
        if (empleadoSeleccionado) {
          empleadoInput.dataset.empleadoId = empleadoSeleccionado.id;
          mensajeEmpleado.textContent = '';
        } else {
          empleadoInput.dataset.empleadoId = '';
          mensajeEmpleado.textContent = 'Por favor, seleccione un empleado válido de la lista.';
        }
      });

      function mostrarSugerencias(empleados) {
        sugerenciasDiv.innerHTML = '';

        empleados.forEach(empleado => {
          const sugerencia = document.createElement('div');
          sugerencia.textContent = `${empleado.nombre} ${empleado.apellido_paterno} ${empleado.apellido_materno}`;
          sugerencia.dataset.empleadoId = empleado.id;
          sugerencia.addEventListener('click', function () {
            empleadoInput.value = this.textContent;
            empleadoInput.dataset.empleadoId = this.dataset.empleadoId;
            sugerenciasDiv.innerHTML = '';
            sugerenciasDiv.style.display = 'none';
            mensajeEmpleado.textContent = '';
          });
          sugerenciasDiv.appendChild(sugerencia);
        });
      }

      sugerenciasDiv.addEventListener('scroll', function () {
        const scrollTop = this.scrollTop;
        const scrollHeight = this.scrollHeight;
        const clientHeight = this.clientHeight;

        if (scrollTop + clientHeight >= scrollHeight) {
          mostrarSugerencias(empleadosFiltrados);
        }
      });

      empleadoInput.addEventListener('click', function () {
        if (sugerenciasDiv.innerHTML !== '') {
          sugerenciasDiv.style.display = 'block';
        }
      });

      document.addEventListener('click', function (event) {
        if (!empleadoInput.contains(event.target) && !sugerenciasDiv.contains(event.target)) {
          sugerenciasDiv.style.display = 'none';
        }
      });
    } else {
      console.error('No se encontraron empleados disponibles.');
    }
  } catch (err) {
    console.error('Hay un error en la función mostrarEmpleados:', err);
  }
}

const mostrarEmpleadosDebounced = debounce(mostrarEmpleados, 300);


// Manejar el envío del formulario de agregar
const formularioUsuario = document.querySelector('form');
formularioUsuario.addEventListener('submit', async (event) => {
  event.preventDefault();

  const nombre = document.getElementById('empleado').value;
  const idEmpleado = document.getElementById('empleado').dataset.empleadoId;
  const alias = document.getElementById('alias').value;
  const contraseña = document.getElementById('contraseña').value;
  const confirmarContraseña = document.getElementById('confirmar-contraseña').value;
  const fotoPerfil = document.getElementById('foto-perfil').files[0];

  if (contraseña !== confirmarContraseña) {
    const passwordMatchError = document.getElementById('password-match-error');
    passwordMatchError.textContent = 'Las contraseñas no coinciden';
    return;
  }

  try {
    const formData = new FormData();
    formData.append('idEmpleado', idEmpleado);
    formData.append('alias', alias);
    formData.append('password', contraseña);
    if (fotoPerfil) {
      formData.append('fotoPerfil', fotoPerfil);
    }

      // Mostrar la animación de carga
      document.getElementById('loading-overlay').style.display = 'flex';

    const respuesta = await fetch('/guardar-usuario', {
      method: 'POST',
      body: formData
    });

    // Ocultar la animación de carga
    document.getElementById('loading-overlay').style.display = 'none';

    if (respuesta.ok) {
      swal("¡Buen trabajo!", "El usuario ha sido creado exitosamente!", "success").then( async ()=>{
        await obtenerUsuarios();
        formularioUsuario.reset();
        document.getElementById('password-match-error').textContent = '';
        document.getElementById('foto-error').textContent = '';
        modalAgregar.style.display = 'none';

      })
     
    } else {
      console.error('Error al guardar el usuario');
    }
  } catch (error) {
    // Ocultar la animación de carga en caso de error
    document.getElementById('loading-overlay').style.display = 'none';
    console.error('Error al guardar el usuario:', error);
  }
});

function estadoBtnModificar(){
    const logotiposConfirmar = document.querySelectorAll('.confirm-icon').length;
    const btnModificar = document.getElementById('modificar');
    if(logotiposConfirmar > 0){
      btnModificar.disabled = true;
    }else{
      btnModificar.disabled = false;
    }
  
}


const contraseñaInput = document.getElementById('contraseña-info');
const confirmarContraseñaInput = document.getElementById('confirmar-contraseña-info');

contraseñaInput.addEventListener('input', validarContraseñas);
confirmarContraseñaInput.addEventListener('input', validarContraseñas);

// Manejar la edición de un usuario existente
usuariosSection.addEventListener('click', async (event) => {
  if (event.target.classList.contains('info-usuario')) {
    const usuarioBlock = event.target.closest('.usuario-block');
    const idEmpleado = event.target.dataset.idEmpleado;

    try {
      const respuesta = await fetch(`/obtener-datos-usuario/${idEmpleado}`);
      const usuario = await respuesta.json();
      
      document.getElementById('nombre-info').value = `${usuario.nombre} ${usuario.apellido_paterno} ${usuario.apellido_materno}`;
      document.getElementById('alias-info').value = usuario.alias;
      document.getElementById('contraseña-info').value = ''; // Campo de contraseña vacío
      document.getElementById('confirmar-contraseña-info').value = ''; // Campo de confirmar contraseña vacío
      document.getElementById('modificar').dataset.idEmpleado = idEmpleado;
      document.getElementById('modal-info-usuario').style.display = 'block';
    } catch (error) {
      console.error('Error al obtener los datos del usuario:', error);
    }
  }
});


const editAlias = document.getElementById('edit-alias');
const inputAlias = document.getElementById('alias-info');
editAlias.addEventListener('click', (event)=>{
  const errorMessage = document.getElementById('error-alias');
    if(event.target.classList.contains('edit-icon')){
      inputAlias.disabled = false;
      event.target.textContent = 'check';
      event.target.classList.remove('edit-icon');
      event.target.classList.add('confirm-icon');
      errorMessage.textContent = '';
      inputAlias.addEventListener('input', (event) =>{
        if(event.target.value === ''){
          errorMessage.textContent = 'El campo alias no puede ir vacio';
          event.target.style.pointerEvents = 'none';
          return;
        }else{
          errorMessage.textContent = '';
          event.target.style.pointerEvents = 'auto';
        }
    });
    
    }else if (event.target.classList.contains('confirm-icon')){

        inputAlias.disabled = true;
        
        event.target.textContent = 'edit';
        event.target.classList.add('edit-icon');
        event.target.classList.remove('confirm-icon');
    
    }
    estadoBtnModificar();
})

const contraseñaWrapper = document.getElementById('edit-password');

contraseñaWrapper.addEventListener('click', (event) => {
  const visibilityIcon = document.getElementById('visible-info');
  const visibilityIconConfirmar = document.getElementById('visible-info-confirmar');
  const errorMessage = document.querySelector('#password-match-error');

  if (event.target.classList.contains('edit-icon')) {
    console.log('Edit Icon');
    contraseñaInput.disabled = false;
    confirmarContraseñaInput.disabled = false;
    visibilityIcon.style.pointerEvents = 'auto';
    visibilityIconConfirmar.style.pointerEvents = 'auto';
    event.target.textContent = 'check';
    event.target.classList.remove('edit-icon');
    event.target.classList.add('confirm-icon');
    errorMessage.textContent = '';
  } else if (event.target.classList.contains('confirm-icon')) {
    console.log('Confirm Icon');
    if (contraseñaInput.value.trim() === '' || confirmarContraseñaInput.value.trim() === '') {
      errorMessage.textContent = 'Los campos de contraseña no pueden estar vacíos.';
      event.target.style.pointerEvents = 'none';
      return;
    } else if (contraseñaInput.value !== confirmarContraseñaInput.value) {
      errorMessage.textContent = 'Las contraseñas no coinciden.';
      event.target.style.pointerEvents = 'none';
      return;
    } else {
      contraseñaInput.disabled = true;
      confirmarContraseñaInput.disabled = true;
      visibilityIcon.style.pointerEvents = 'none';
      visibilityIconConfirmar.style.pointerEvents = 'none';
      event.target.textContent = 'edit';
      event.target.classList.add('edit-icon');
      event.target.classList.remove('confirm-icon');
      event.target.style.removeProperty('pointer-events');
      errorMessage.textContent = '';
      validarCamposHabilitados();
    }
  }

  estadoBtnModificar();
});


const inputSeleccionarImagen = document.getElementById('foto-perfil-info');
const editImagen = document.getElementById('edit-foto');

editImagen.addEventListener('click', (event) =>{

    if(event.target.classList.contains('edit-icon')){
        inputSeleccionarImagen.disabled = false;
        event.target.textContent = 'check';
        event.target.classList.remove('edit-icon');
        event.target.classList.add('confirm-icon');
    }else if(event.target.classList.contains('confirm-icon')){
      inputSeleccionarImagen.disabled = true;
        event.target.textContent = 'edit';
        event.target.classList.remove('confirm-icon');
        event.target.classList.add('edit-icon');
    }
    estadoBtnModificar();
}); 


function validarCamposHabilitados() {
  const inputs = Array.from(modalInfoUsuario.querySelectorAll('input'));
  const botonModificar = document.getElementById('modificar');

  const algunCampoHabilitado = inputs.some(input => !input.disabled);

  if (algunCampoHabilitado) {
    botonModificar.disabled = true;
  } else {
    botonModificar.disabled = false;
  }
}

function validarContraseñas() {
  const contraseña = document.getElementById('contraseña-info').value;
  const confirmarContraseña = document.getElementById('confirmar-contraseña-info').value;
  const errorMessage = document.getElementById('password-match-error-info');
  const botonModificar = document.getElementById('modificar');
  const confirmIcon = document.querySelector('.confirm-icon');
  if(contraseña === '' || confirmarContraseña == ''){
    errorMessage.textContent = 'Los campos no pueden ir vacíos.';
    botonModificar.disabled = true;
    confirmIcon.style.pointerEvents = 'none';
    return;
  }else if (contraseña !== confirmarContraseña) {
    errorMessage.textContent = 'Las contraseñas no coinciden.';
    botonModificar.disabled = true;
    confirmIcon.style.pointerEvents = 'none';
    return;
  }else {
    confirmIcon.style.pointerEvents = 'auto';
    errorMessage.textContent = '';
    botonModificar.disabled = false;
    validarCamposHabilitados();
  }
}

const editIcons = document.querySelectorAll('.edit-icon');
const modalInfoUsuario = document.getElementById('modal-info-usuario');

// Manejar el envío del formulario
document.getElementById('modificar').addEventListener('click', async (event) => {
  event.preventDefault();

  const idEmpleado = event.target.dataset.idEmpleado;
  const alias = document.getElementById('alias-info').value;
  const contraseña = document.getElementById('contraseña-info').value;
  const fotoPerfil = document.getElementById('foto-perfil-info').files[0];

  try {
    const formData = new FormData();
    formData.append('idEmpleado', idEmpleado);
    formData.append('alias', alias);
    formData.append('password', contraseña);
    if (fotoPerfil) {
      formData.append('fotoPerfil', fotoPerfil);
    }

    // Mostrar la animación de carga
    document.getElementById('loading-overlay').style.display = 'flex';
    document.getElementById('p-animacion').textContent = 'Modificando Usuario...';

    const respuesta = await fetch('/modificar-usuario', {
      method: 'PUT',
      body: formData
    });
    // Ocultar la animación de carga
    document.getElementById('loading-overlay').style.display = 'none';
    document.getElementById('p-animacion').textContent = 'Creando Usuario...';
    if (respuesta.ok) {
      Swal.fire('Éxito', 'El usuario ha sido modificado correctamente', 'success')
        .then(() => {
          //Limpiar todos los inputs de la modal
          document.getElementById('alias-info').value = '';
          // Limpiar el input de la foto de perfil
          document.getElementById('foto-perfil-info').value = '';

          // Cerrar la modal y actualizar la lista de usuarios
          modalInfoUsuario.style.display = 'none';
          obtenerUsuarios();
        });
    } else {
      Swal.fire('Error', 'Hubo un problema al modificar el usuario', 'error');
    }
  } catch (error) {
    // Ocultar la animación de carga en caso de error
    document.getElementById('loading-overlay').style.display = 'none';
    console.error('Error al modificar el usuario:', error);
    Swal.fire('Error', 'Hubo un problema al modificar el usuario', 'error');
    
  }
});
