const sideMenu = document.querySelector("aside");



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

//Pestaña Nomina
const Nomina = document.getElementById('nomina');

Nomina.addEventListener('click', () => {
    window.location.href = 'nomina.html';
});

//Pestaña Bitacora
const Bitacora = document.getElementById('bitacora');

Bitacora.addEventListener('click', () => {
    window.location.href = 'bitacora.html';
});


//Pestaña Usuarios
const usuarios = document.getElementById("usuarios");

usuarios.addEventListener("click", () => {
  window.location.href = "usuarios.html"; 
});


/////////////////////////////////////////////////

const projectFolders = document.querySelectorAll('.project-folder');
const projectDetails = document.querySelector('.project-details');
const notesContainer = document.querySelector('.notes-container');
const backButton = document.querySelector('.back-button');
const addNoteContainer = document.querySelector('.add-note-container');
const addNoteBtn = document.querySelector('.add-note');
const addNoteOptions = document.querySelector('.add-note-options');
const addOptionIcon = document.querySelector('.add-option-icon');
const optionIcons = document.querySelector('.option-icons');



///Funcion de flecha hacia atras
function updateBackButton() {
  const firstVisibleNote = notesContainer.querySelector('.note:not([style*="display: none"])');
  const existingBackButton = notesContainer.querySelector('.back-button-note');

  if (firstVisibleNote) {
    const titleContainer = firstVisibleNote.querySelector('.title-container');

    if (titleContainer) {
      if (existingBackButton && existingBackButton.parentNode !== titleContainer) {
        existingBackButton.remove();
      }

      if (!titleContainer.querySelector('.back-button-note')) {
        const newBackButton = document.createElement('span');
        newBackButton.classList.add('material-icons', 'back-button-note');
        newBackButton.textContent = 'arrow_back';
        newBackButton.addEventListener('click', (event) => {
          event.stopPropagation();
          projectDetails.style.display = 'none';
          document.querySelector('.project-folders').style.display = 'flex';
          while (notesContainer.firstChild) {
            notesContainer.removeChild(notesContainer.firstChild);
          }
          selectedNoteElement = null;
          addNoteContainer.style.display = 'none';
          editNoteContainer.style.display = 'none';
        });
        titleContainer.insertBefore(newBackButton, titleContainer.firstChild);
      }
    }
  } else {
    if (existingBackButton) {
      existingBackButton.remove();
    }
  }
}


projectFolders.forEach(folder => {
  const folderIcon = folder.querySelector('.folder-icon');

  folder.addEventListener('click', () => {
    // Ocultar todos los recuadros de proyectos
    document.querySelector('.project-folders').style.display = 'none';

    // Mostrar el área de detalles del proyecto
    projectDetails.style.display = 'block';

    // Obtener el nombre del proyecto seleccionado
    const projectName = folder.dataset.project;

    const notes = [
      { title: 'Nota del dia', content: 'Aqui estamos', createdDate: '5/17/2024' },
      { title: 'Construccion', content: 'Bien construida', createdDate: '5/19/2024' },
      { title: 'Daño al material', content: 'Me robaron más bien', createdDate: '5/19/2024' },
      { title: 'Se dejó material', content: 'La carrucha y la pala', createdDate: '5/18/2024' },
      { title: 'Nota de ejemplo', content: 'Aqui se escribe y se coloca lo que quieras', createdDate: '5/28/2024' },
      // Agrega más notas de ejemplo si es necesario
    ];

    const dateGroups = {};

    notes.forEach(note => {
      const date = note.createdDate;
      if (!dateGroups[date]) {
        dateGroups[date] = [];
      }
      dateGroups[date].push(note);
    });
  
    const today = new Date().toLocaleDateString();
    const yesterday = new Date(Date.now() - 86400000).toLocaleDateString();
  
    let isFirstNote = true;
  
    // Agregar separación manual con el texto "Ayer" si hay notas de ayer
    if (dateGroups[yesterday]) {
      const yesterdaySeparator = createDateSeparator(yesterday);
      notesContainer.appendChild(yesterdaySeparator);
  
      dateGroups[yesterday].forEach((note, index) => {
        const noteElement = createNoteElement(note.title, note.content, note.createdDate, yesterday);
        notesContainer.appendChild(noteElement);
        isFirstNote = false;
      });
    }
  
    // Ordenar las notas por fecha descendente excluyendo "Ayer"
    const sortedDatesWithoutYesterday = Object.keys(dateGroups)
      .filter(date => date !== yesterday)
      .sort((a, b) => new Date(b) - new Date(a));
  
    sortedDatesWithoutYesterday.forEach((date, index) => {
      const separator = createDateSeparator(date);
      notesContainer.appendChild(separator);
  
      dateGroups[date].forEach((note, noteIndex) => {
        const noteElement = createNoteElement(note.title, note.content, note.createdDate);
        notesContainer.appendChild(noteElement);
        isFirstNote = false;
      });
    });    
    updateBackButton();
  });

  folder.addEventListener('mouseenter', () => {
    folderIcon.textContent = 'folder_open';
  });

  folder.addEventListener('mouseleave', () => {
    folderIcon.textContent = 'folder';
  });
});


addNoteBtn.addEventListener('click', () => {
  notesContainer.style.display = 'none';
  addNoteContainer.style.display = 'block'; // Mostrar el contenedor de agregar nota
  editNoteContainer.style.display = 'none'; // Ocultar el contenedor de modificar nota
  addNoteBtn.style.display = 'none';
  addOptionIcon.style.display = 'flex';
  selectedNoteElement = null;
});

backButton.addEventListener('click', () => {
  addNoteContainer.style.display = 'none'; 
  selectedNoteElement = null; 
  notesContainer.style.display = 'block'; 
  addNoteBtn.style.display = 'flex'; 

  // Obtener la primera nota en el contenedor de notas
  const firstNote = notesContainer.firstElementChild;

  // Verificar si la primera nota existe y no tiene la flecha de retroceso
  if (firstNote && !firstNote.querySelector('.back-button-note')) {
    const titleContainer = firstNote.querySelector('.title-container');
    
    // Verificar si titleContainer existe antes de insertar la flecha de retroceso
    if (titleContainer) {
      const backButton = document.createElement('span');
      backButton.classList.add('material-icons', 'back-button-note');
      backButton.textContent = 'arrow_back';
      backButton.addEventListener('click', () => {
        projectDetails.style.display = 'none';
        document.querySelector('.project-folders').style.display = 'flex';
        while (notesContainer.firstChild) {
          notesContainer.removeChild(notesContainer.firstChild);
        }
      });
      titleContainer.insertBefore(backButton, titleContainer.firstChild);
    }
  }

   // Limpiar los campos de título y descripción
   noteTitleInput.value = '';
   noteDescriptionInput.value = '';
 
   // Eliminar los elementos agregados (tabla, lista o imagen)
   const noteTable = noteDescription.querySelector('.note-table');
   if (noteTable) {
     noteTable.remove();
     isTableCreated = false;
   }
 
   const noteImages = noteDescription.querySelectorAll('.note-image');
   noteImages.forEach(image => image.remove());

   // Cerrar las opciones
  addOptionIcon.classList.remove('rotate');
  optionIcons.classList.remove('show');
  addOptionIcon.textContent = 'add';
});


addOptionIcon.addEventListener('click', () => {
  addOptionIcon.classList.toggle('rotate');
  optionIcons.classList.toggle('show');
  
  if (optionIcons.classList.contains('show')) {
    setTimeout(() => {
      addOptionIcon.textContent = 'close';
    }, 150);
  } else {
    setTimeout(() => {
      addOptionIcon.textContent = 'add';
    }, 150);
  }
});

//////Creación de notas, tabla
const tableOption = document.getElementById('table-option');
const noteDescription = document.querySelector('.note-description');
const noteDescriptionInput = document.querySelector('.note-description-input');
const tablePopover = document.querySelector('.table-popover');
const deleteTableOption = document.getElementById('delete-table');

let isTableCreated = false;
let isPopoverVisible = false;

tableOption.addEventListener('click', () => {
  if (!isTableCreated) {
    const table = document.createElement('table');
    table.classList.add('note-table');

    const numColumns = Math.floor(noteDescription.offsetWidth / 100);
    const numRows = 2;

    for (let i = 0; i < numRows; i++) {
      const row = document.createElement('tr');
      for (let j = 0; j < numColumns; j++) {
        const cell = document.createElement('td');
        cell.contentEditable = true;
        row.appendChild(cell);
      }
      table.appendChild(row);
    }

    noteDescription.appendChild(table);
    noteDescriptionInput.style.display = 'block';
    noteDescriptionInput.focus();
    noteDescriptionInput.setSelectionRange(noteDescriptionInput.value.length, noteDescriptionInput.value.length);

    table.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        const currentCell = event.target;
        const currentRow = currentCell.parentNode;
        const currentRowIndex = Array.from(table.rows).indexOf(currentRow);
        const currentCellIndex = Array.from(currentRow.cells).indexOf(currentCell);

        if (currentRowIndex === table.rows.length - 1 && currentCellIndex === currentRow.cells.length - 1) {
          event.preventDefault();
          const newRow = table.insertRow();
          for (let i = 0; i < numColumns; i++) {
            const cell = newRow.insertCell();
            cell.contentEditable = true;
          }
          newRow.cells[0].focus();
        }
      }
    });

    isTableCreated = true;
  } else {
    if (isPopoverVisible) {
      tablePopover.style.display = 'none';
      isPopoverVisible = false;
    } else {
      tablePopover.style.display = 'block';
      isPopoverVisible = true;
    }
  }
});

document.addEventListener('click', (event) => {
  if (isPopoverVisible && !tablePopover.contains(event.target) && event.target !== tableOption) {
    tablePopover.style.display = 'none';
    isPopoverVisible = false;
  }
});

deleteTableOption.addEventListener('click', (event) => {
  event.stopPropagation();
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'La tabla se eliminará permanentemente.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      const table = noteDescription.querySelector('.note-table');
      table.remove();
      noteDescriptionInput.style.display = 'block';
      tablePopover.style.display = 'none';
      isTableCreated = false;
      Swal.fire(
        '¡Eliminado!',
        'La tabla ha sido eliminada.',
        'success'
      );
    }
  });
});

//////// Creación de notas, lista

const listOption = document.getElementById('list-option');

listOption.addEventListener('click', () => {
  const listItems = noteDescriptionInput.value.split('\n');
  const newListItems = listItems.map((item, index) => {
    if (item.startsWith(index + 1 + '.')) {
      return item;
    } else {
      return index + 1 + '. ' + item;
    }
  });
  noteDescriptionInput.value = newListItems.join('\n');
  noteDescriptionInput.focus();
  noteDescriptionInput.setSelectionRange(noteDescriptionInput.value.length, noteDescriptionInput.value.length);
});

noteDescriptionInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    const cursorPosition = noteDescriptionInput.selectionStart;
    const textBeforeCursor = noteDescriptionInput.value.substring(0, cursorPosition);
    const textAfterCursor = noteDescriptionInput.value.substring(cursorPosition);
    const listItems = textBeforeCursor.split('\n');
    const lastListItem = listItems[listItems.length - 1];

    if (lastListItem.match(/^\d+\.\s/)) {
      const nextNumber = parseInt(lastListItem.split('.')[0]) + 1;
      const newListItem = nextNumber + '. ';
      noteDescriptionInput.value = textBeforeCursor + '\n' + newListItem + textAfterCursor;
      noteDescriptionInput.selectionStart = textBeforeCursor.length + newListItem.length + 1;
      noteDescriptionInput.selectionEnd = noteDescriptionInput.selectionStart;
      event.preventDefault();
    }
  } else if (event.key === 'Backspace') {
    const cursorPosition = noteDescriptionInput.selectionStart;
    const textBeforeCursor = noteDescriptionInput.value.substring(0, cursorPosition);
    const listItems = textBeforeCursor.split('\n');
    const lastListItem = listItems[listItems.length - 1];

    if (lastListItem.match(/^\d+\.\s$/)) {
      noteDescriptionInput.value = textBeforeCursor.substring(0, textBeforeCursor.length - lastListItem.length) + noteDescriptionInput.value.substring(cursorPosition);
      noteDescriptionInput.selectionStart = cursorPosition - lastListItem.length;
      noteDescriptionInput.selectionEnd = noteDescriptionInput.selectionStart;
      event.preventDefault();
    }
  }
});


//// Creación de notas, imagen
const imageInput = document.getElementById('image-input');

imageInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = (event) => {
    const imageUrl = event.target.result;
    const imageElement = createImageElement(imageUrl);
    noteDescription.appendChild(imageElement);
  };

  reader.readAsDataURL(file);
});

function createImageElement(imageUrl) {
  const imageContainer = document.createElement('div');
  imageContainer.classList.add('note-image');

  const image = document.createElement('img');
  image.src = imageUrl;

  const removeButton = document.createElement('span');
  removeButton.classList.add('remove-image');
  removeButton.innerHTML = '&times;';
  removeButton.addEventListener('click', () => {
    imageContainer.remove();
  });

  imageContainer.appendChild(image);
  imageContainer.appendChild(removeButton);

  return imageContainer;
}

// Funcion para el boton de Done de la nueva nota a crear
const doneIcon = document.querySelector('.done-icon');
const generatedNotesContainer = document.querySelector('.generated-notes-container');
const noteTitleInput = document.querySelector('.note-title-input');

if (doneIcon) {
  doneIcon.addEventListener('click', () => {
    const title = noteTitleInput.value;
    const content = noteDescriptionInput.value;
    const currentDate = new Date().toLocaleDateString();

    if (selectedNoteElement !== null) {
      // Eliminar la nota original
      const originalNote = selectedNoteElement.element;
      const originalDateSeparator = originalNote.previousElementSibling;
      originalNote.remove();

      // Verificar si la sección de la nota original está vacía y eliminar el separador si es necesario
      if (originalDateSeparator && originalDateSeparator.classList.contains('date-separator')) {
        const notesInOriginalSection = Array.from(originalDateSeparator.parentNode.children).filter(
          (child) =>
            child.nodeType === Node.ELEMENT_NODE &&
            child.classList.contains('note') &&
            child.previousElementSibling === originalDateSeparator
        );

        if (notesInOriginalSection.length === 0) {
          originalDateSeparator.remove();
        } 
      }

      // Crear una nueva nota con la fecha actual después de modificar una nota existente
      const newNote = createNoteElement(title, content, currentDate);
      const currentDateSeparator = notesContainer.querySelector(`.date-separator[data-date="${currentDate}"]`);

      if (currentDateSeparator) {
        currentDateSeparator.parentNode.insertBefore(newNote, currentDateSeparator.nextSibling);
      } else {
        const separator = createDateSeparator(currentDate);
        notesContainer.insertBefore(separator, notesContainer.firstChild);
        notesContainer.insertBefore(newNote, separator.nextSibling);
      }
    } else {
      // Crear una nueva nota
      const newNote = createNoteElement(title, content, currentDate);

      // Verificar si ya existe un separador para la fecha actual
      const currentDateSeparator = notesContainer.querySelector(`.date-separator[data-date="${currentDate}"]`);
    
      if (currentDateSeparator) {
        // Si ya existe un separador para la fecha actual, insertar la nueva nota después de él
        currentDateSeparator.parentNode.insertBefore(newNote, currentDateSeparator.nextSibling);
      } else {
        // Si no existe un separador para la fecha actual, insertar el separador y la nueva nota al principio
        const separator = createDateSeparator(currentDate);
        notesContainer.insertBefore(separator, notesContainer.firstChild);
        notesContainer.insertBefore(newNote, separator.nextSibling);
      }
      updateBackButton();
    }

    addNoteContainer.style.display = 'none';
    notesContainer.style.display = 'block';
    addNoteBtn.style.display = 'flex';

    noteTitleInput.value = '';
    noteDescriptionInput.value = '';

     // Eliminar los elementos agregados (tabla, lista o imagen)
    const noteTable = noteDescription.querySelector('.note-table');
    if (noteTable) {
      noteTable.remove();
      isTableCreated = false;
    }

    const noteImages = noteDescription.querySelectorAll('.note-image');
    noteImages.forEach(image => image.remove());

    // Cerrar las opciones
    addOptionIcon.classList.remove('rotate');
    optionIcons.classList.remove('show');
    addOptionIcon.textContent = 'add';

    selectedNoteElement = null; // Restablecer selectedNoteElement a null

  });
}

// Funcion para el separador de fechas
function createDateSeparator(date) {
  const separator = document.createElement('div');
  separator.classList.add('date-separator');
  separator.setAttribute('data-date', date);

  const line = document.createElement('div');
  line.classList.add('separator-line');

  const dateText = document.createElement('span');
  const today = new Date().toLocaleDateString();
  const yesterday = new Date(Date.now() - 86400000).toLocaleDateString();
  dateText.textContent = date === today ? 'Hoy' : (date === yesterday ? 'Ayer' : date);

  separator.appendChild(line);
  separator.appendChild(dateText);
  separator.appendChild(line.cloneNode());

  return separator;
}

let selectedNoteElement = null;

// Función para crear un elemento de nota
function createNoteElement(title, content, createdDate) {
  const noteElement = document.createElement('div');
  noteElement.classList.add('note');

  const titleContainer = document.createElement('div');
  titleContainer.classList.add('title-container');

  const titleElement = document.createElement('h3');
  titleElement.textContent = title;

  titleContainer.appendChild(titleElement);

  const contentElement = document.createElement('p');
  contentElement.textContent = content;

  const dateElement = document.createElement('p');
  dateElement.classList.add('note-date');
  dateElement.textContent = createdDate;

  noteElement.appendChild(titleContainer);
  noteElement.appendChild(dateElement);
  noteElement.appendChild(contentElement);

  noteElement.addEventListener('click', () => {
    notesContainer.style.display = 'none';
    editNoteContainer.style.display = 'block';
    addNoteBtn.style.display = 'none';
    editNoteTitleInput.value = title;
    editNoteDescriptionInput.value = content;
    selectedNoteElement = { element: noteElement, originalDate: createdDate };
  });
  updateBackButton();
  console.log('Título de la primera nota:', title);

  return noteElement;
}


// Lógica para guardar una nota modificada
const editNoteContainer = document.querySelector('.edit-note-container');
const editNoteTitleInput = document.querySelector('.edit-note-title-input');
const editNoteDescriptionInput = document.querySelector('.edit-note-description-input');
const editDoneIcon = document.querySelector('.edit-done-icon');
const editAddOptionIcon = document.querySelector('.edit-add-option-icon');
const editOptionIcons = document.querySelector('.edit-option-icons');
const editTableOption = document.getElementById('edit-table-option');
const editListOption = document.getElementById('edit-list-option');
const editImageInput = document.getElementById('edit-image-input');
const editNoteDescription = document.querySelector('.edit-note-description');
const editTablePopover = document.querySelector('.edit-table-popover');
const editDeleteTableOption = document.getElementById('edit-delete-table');


if (editDoneIcon) {
  editDoneIcon.addEventListener('click', () => {
    const title = editNoteTitleInput.value;
    const content = editNoteDescriptionInput.value;
    const currentDate = new Date().toLocaleDateString();

    if (selectedNoteElement !== null) {
      const originalNote = selectedNoteElement.element;
      const originalDateSeparator = originalNote.previousElementSibling;
      originalNote.remove();

      if (originalDateSeparator && originalDateSeparator.classList.contains('date-separator')) {
        const notesInOriginalSection = Array.from(originalDateSeparator.parentNode.children).filter(
          (child) =>
            child.nodeType === Node.ELEMENT_NODE &&
            child.classList.contains('note') &&
            child.previousElementSibling === originalDateSeparator
        );

        if (notesInOriginalSection.length === 0) {
          originalDateSeparator.remove();
        }
      }
      const newNote = createNoteElement(title, content, currentDate);
      const currentDateSeparator = notesContainer.querySelector(`.date-separator[data-date="${currentDate}"]`);
      

      if (currentDateSeparator) {
        currentDateSeparator.parentNode.insertBefore(newNote, currentDateSeparator.nextSibling);
      } else {
        const separator = createDateSeparator(currentDate);
        notesContainer.insertBefore(separator, notesContainer.firstChild);
        notesContainer.insertBefore(newNote, separator.nextSibling);
      }
      updateBackButton();
    }

    editNoteContainer.style.display = 'none';
    notesContainer.style.display = 'block';
    addNoteBtn.style.display = 'flex';

    editNoteTitleInput.value = '';
    editNoteDescriptionInput.value = '';

     // Eliminar los elementos agregados (tabla, lista o imagen)
    const editNoteTable = editNoteDescription.querySelector('.edit-note-table');
    if (editNoteTable) {
      editNoteTable.remove();
      editIsTableCreated = false;
    }

    const editNoteImages = editNoteDescription.querySelectorAll('.note-image');
    editNoteImages.forEach(image => image.remove());

    // Cerrar las opciones
    editAddOptionIcon.classList.remove('rotate');
    editOptionIcons.classList.remove('show');
    editAddOptionIcon.textContent = 'add';

    selectedNoteElement = null;
  });
}

editAddOptionIcon.addEventListener('click', () => {
  editAddOptionIcon.classList.toggle('rotate');
  editOptionIcons.classList.toggle('show');
  
  if (editOptionIcons.classList.contains('show')) {
    setTimeout(() => {
      editAddOptionIcon.textContent = 'close';
    }, 150);
  } else {
    setTimeout(() => {
      editAddOptionIcon.textContent = 'add';
    }, 150);
  }
});

editDoneIcon.addEventListener('click', () => {
  const title = editNoteTitleInput.value;
  const content = editNoteDescriptionInput.value;
  const currentDate = new Date().toLocaleDateString();

  if (selectedNoteElement !== null) {
    const originalNote = selectedNoteElement.element;
    const originalDateSeparator = originalNote.previousElementSibling;
    originalNote.remove();

    if (originalDateSeparator && originalDateSeparator.classList.contains('date-separator')) {
      const notesInOriginalSection = Array.from(originalDateSeparator.parentNode.children).filter(
        (child) =>
          child.nodeType === Node.ELEMENT_NODE &&
          child.classList.contains('note') &&
          child.previousElementSibling === originalDateSeparator
      );

      if (notesInOriginalSection.length === 0) {
        originalDateSeparator.remove();
      }
    }

    const newNote = createNoteElement(title, content, true, currentDate);
    const currentDateSeparator = notesContainer.querySelector(`.date-separator[data-date="${currentDate}"]`);

    if (currentDateSeparator) {
      currentDateSeparator.parentNode.insertBefore(newNote, currentDateSeparator.nextSibling);
    } else {
      const separator = createDateSeparator(currentDate);
      notesContainer.insertBefore(separator, notesContainer.firstChild);
      notesContainer.insertBefore(newNote, separator.nextSibling);
    }
  }

  editNoteContainer.style.display = 'none';
  notesContainer.style.display = 'block';
  addNoteBtn.style.display = 'flex';

  editNoteTitleInput.value = '';
  editNoteDescriptionInput.value = '';

  selectedNoteElement = null;
});

const editBackButton = document.querySelector('.edit-note-container .back-button');

editBackButton.addEventListener('click', () => {
  editNoteContainer.style.display = 'none';
  notesContainer.style.display = 'block';
  addNoteBtn.style.display = 'flex';

  if (selectedNoteElement) {
    const originalNote = selectedNoteElement.element;
    const titleElement = originalNote.querySelector('h3');
    const contentElement = originalNote.querySelector('p');

    // Restaurar el título y contenido originales de la nota
    editNoteTitleInput.value = titleElement.textContent;
    editNoteDescriptionInput.value = contentElement.textContent;

    // Eliminar los elementos agregados (tabla, lista o imagen)
    const editNoteTable = editNoteDescription.querySelector('.edit-note-table');
    if (editNoteTable) {
      editNoteTable.remove();
      editIsTableCreated = false;
    }

    const editNoteImages = editNoteDescription.querySelectorAll('.note-image');
    editNoteImages.forEach(image => image.remove());
  }

  // Cerrar las opciones
  editAddOptionIcon.classList.remove('rotate');
  editOptionIcons.classList.remove('show');
  editAddOptionIcon.textContent = 'add';
  
  selectedNoteElement = null;
});

///Opciones de la parte de editar
let editIsTableCreated = false;
let editIsPopoverVisible = false;

editTableOption.addEventListener('click', () => {
  if (!editIsTableCreated) {
    const table = document.createElement('table');
    table.classList.add('edit-note-table');

    const numColumns = Math.floor(editNoteDescription.offsetWidth / 100);
    const numRows = 2;

    for (let i = 0; i < numRows; i++) {
      const row = document.createElement('tr');
      for (let j = 0; j < numColumns; j++) {
        const cell = document.createElement('td');
        cell.contentEditable = true;
        row.appendChild(cell);
      }
      table.appendChild(row);
    }

    editNoteDescription.appendChild(table);
    editNoteDescriptionInput.style.display = 'block';
    editNoteDescriptionInput.focus();
    editNoteDescriptionInput.setSelectionRange(editNoteDescriptionInput.value.length, editNoteDescriptionInput.value.length);

    table.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        const currentCell = event.target;
        const currentRow = currentCell.parentNode;
        const currentRowIndex = Array.from(table.rows).indexOf(currentRow);
        const currentCellIndex = Array.from(currentRow.cells).indexOf(currentCell);
    
        if (currentRowIndex === table.rows.length - 1 && currentCellIndex === currentRow.cells.length - 1) {
          event.preventDefault();
          const newRow = table.insertRow();
          for (let i = 0; i < numColumns; i++) {
            const cell = newRow.insertCell();
            cell.contentEditable = true;
          }
          newRow.cells[0].focus();
        }
      }
    });

    editIsTableCreated = true;
  } else {
    if (editIsPopoverVisible) {
      editTablePopover.style.display = 'none';
      editIsPopoverVisible = false;
    } else {
      editTablePopover.style.display = 'block';
      editIsPopoverVisible = true;
    }
  }
});

document.addEventListener('click', (event) => {
  if (editIsPopoverVisible && !editTablePopover.contains(event.target) && event.target !== editTableOption) {
    editTablePopover.style.display = 'none';
    editIsPopoverVisible = false;
  }
});

editDeleteTableOption.addEventListener('click', (event) => {
  event.stopPropagation();
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'La tabla se eliminará permanentemente.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      const table = editNoteDescription.querySelector('.edit-note-table');
      table.remove();
      editNoteDescriptionInput.style.display = 'block';
      editTablePopover.style.display = 'none';
      editIsTableCreated = false;
      Swal.fire(
        '¡Eliminado!',
        'La tabla ha sido eliminada.',
        'success'
      );
    }
  });
});

editListOption.addEventListener('click', () => {
  const listItems = editNoteDescriptionInput.value.split('\n');
  const newListItems = listItems.map((item, index) => {
    if (item.startsWith(index + 1 + '.')) {
      return item;
    } else {
      return index + 1 + '. ' + item;
    }
  });
  editNoteDescriptionInput.value = newListItems.join('\n');
  editNoteDescriptionInput.focus();
  editNoteDescriptionInput.setSelectionRange(editNoteDescriptionInput.value.length, editNoteDescriptionInput.value.length);
});

editNoteDescriptionInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    const cursorPosition = editNoteDescriptionInput.selectionStart;
    const textBeforeCursor = editNoteDescriptionInput.value.substring(0, cursorPosition);
    const textAfterCursor = editNoteDescriptionInput.value.substring(cursorPosition);
    const listItems = textBeforeCursor.split('\n');
    const lastListItem = listItems[listItems.length - 1];

    if (lastListItem.match(/^\d+\.\s/)) {
      const nextNumber = parseInt(lastListItem.split('.')[0]) + 1;
      const newListItem = nextNumber + '. ';
      editNoteDescriptionInput.value = textBeforeCursor + '\n' + newListItem + textAfterCursor;
      editNoteDescriptionInput.selectionStart = textBeforeCursor.length + newListItem.length + 1;
      editNoteDescriptionInput.selectionEnd = editNoteDescriptionInput.selectionStart;
      event.preventDefault();
    }
  } else if (event.key === 'Backspace') {
    const cursorPosition = editNoteDescriptionInput.selectionStart;
    const textBeforeCursor = editNoteDescriptionInput.value.substring(0, cursorPosition);
    const listItems = textBeforeCursor.split('\n');
    const lastListItem = listItems[listItems.length - 1];

    if (lastListItem.match(/^\d+\.\s$/)) {
      editNoteDescriptionInput.value = textBeforeCursor.substring(0, textBeforeCursor.length - lastListItem.length) + editNoteDescriptionInput.value.substring(cursorPosition);
      editNoteDescriptionInput.selectionStart = cursorPosition - lastListItem.length;
      editNoteDescriptionInput.selectionEnd = editNoteDescriptionInput.selectionStart;
      event.preventDefault();
    }
  }
});

editImageInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = (event) => {
    const imageUrl = event.target.result;
    const imageElement = createImageElement(imageUrl);
    editNoteDescription.appendChild(imageElement);
  };

  reader.readAsDataURL(file);
});
