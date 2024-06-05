let signup = document.querySelector('#signup');
let signin = document.querySelector('#signin');
let body = document.querySelector('body');

signup.onclick = function() {
  body.classList.add('signup');
};

signin.onclick = function() {
  body.classList.remove('signup');
};

/* -------------------- Mode Toogle --------------- */


/* Logica para inicio de sesion de administradores */

document.addEventListener('DOMContentLoaded', () => {
    const signinForm = document.getElementById('signinForm');
    const signupForm = document.getElementById('signupForm');
  
    signinForm.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      const usuario = signinForm.elements['usuario'].value;
      const password = signinForm.elements['password'].value;
  
      if (!usuario || !password) {
        showErrorAlert('Ingrese un usuario y una contraseña');
        return;
      }
  
      try {
        const response = await fetch('/login/administrador', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ usuario, password })
        });
  
        const data = await response.json();
  
        if (response.ok) {
          showSuccessAlert(data.message, () => {
            window.location.href = '/';
          });
        } else {
          showErrorAlert(data.message);
        }
      } catch (error) {
        console.error('Error al iniciar sesión como administrador:', error);
        showErrorAlert('Error al iniciar sesión');
      }
    });
  
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      const usuario = signupForm.elements['usuario'].value;
      const password = signupForm.elements['password'].value;
  
      if (!usuario || !password) {
        showErrorAlert('Ingrese un usuario y una contraseña');
        return;
      }
  
      try {
        const response = await fetch('/login/usuario', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ usuario, password })
        });
  
        const data = await response.json();
  
        if (response.ok) {
          showSuccessAlert(data.message, () => {
            window.location.href = '/';
          });
        } else {
          showErrorAlert(data.message);
        }
      } catch (error) {
        console.error('Error al iniciar sesión como usuario:', error);
        showErrorAlert('Error al iniciar sesión');
      }
    });
  });
  
  function showSuccessAlert(message, callback) {
    Swal.fire({
      icon: 'success',
      title: 'Éxito',
      text: message,
      position: 'top-end',
      toast: true,
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
      didOpen: () => {
        Swal.hideLoading();
      },
      didClose: () => {
        if (callback) {
          callback();
        }
      }
    });
  }
  
function showErrorAlert(message) {
  Swal.fire({
    icon: 'error',
    title: 'Error',
    text: message,
    position: 'top-end',
    toast: true,
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: () => {
      Swal.hideLoading();
    }
  });
}


/* Bloquear tab */

document.addEventListener('keydown', function(event) {
  if (event.key === 'Tab') {
      var signinForm = document.getElementById('signinForm');
      var signupForm = document.getElementById('signupForm');

      if (!signupForm.classList.contains('active')) {
          var focusableElements = signinForm.querySelectorAll('input, a');
          var lastFocusableElement = focusableElements[focusableElements.length - 1];

          if (event.shiftKey && document.activeElement === focusableElements[0]) {
              event.preventDefault();
              lastFocusableElement.focus();
          } else if (!event.shiftKey && document.activeElement === lastFocusableElement) {
              event.preventDefault();
              focusableElements[0].focus();
          }
      }
  }
});

function toggleForm() {
  var signinForm = document.getElementById('signinForm');
  var signupForm = document.getElementById('signupForm');

  if (signupForm.classList.contains('active')) {
      signupForm.classList.remove('active');
      signinForm.classList.add('active');
  } else {
      signinForm.classList.remove('active');
      signupForm.classList.add('active');
  }
}

/* Logica para inicio de sesion de usuarios */