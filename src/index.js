import express from 'express'
import fs from 'fs';
import { engine } from 'express-handlebars'
import morgan from 'morgan';
import {join, dirname} from 'path'
import { fileURLToPath } from 'url';
import nunjucks from 'nunjucks'; 
import path from 'path';
import { google } from 'googleapis';
import multer from 'multer';
import stream from 'stream';
import pool from './database.js'
import empleadosRoutes from './routes/empleados.routes.js';
import asistenciasRoutes from './routes/asistencias.routes.js';
import localStorageRoutes from './routes/localStorage.routes.js';
import proyectoRoutes from  './routes/proyecto.routes.js';
import usuariosRoutes from './routes/usuarios.routes.js';
import eliminarAsistenciasRouter from './routes/eliminarAsistencias.routes.js';
import bcrypt from 'bcrypt';
import session, { Session } from 'express-session';
import flash from 'connect-flash';

//Initialization
const app = express();
const upload = multer();
const __dirname = dirname(fileURLToPath(import.meta.url));

/*API de Google Drive*/
const KEYFILEPATH = path.join(__dirname, "credenciales.json");
const SCOPES = ["https://www.googleapis.com/auth/drive"];

const oauth2Client = new google.auth.GoogleAuth({
    keyFile: KEYFILEPATH,
    scopes: SCOPES,
});


//Settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html'); 
app.engine('html', nunjucks.render); 


//Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false}));
app.use(express.json());


//Routes
app.get('/index', (req, res) => {
    res.render('index'); // Busca index.html
  });

app.get('/login', (req, res) =>{
  res.render('login');
})

 
  app.use(empleadosRoutes);
  app.use(asistenciasRoutes);
  app.use(eliminarAsistenciasRouter);
  app.use(localStorageRoutes);
  app.use(proyectoRoutes);
  app.use(usuariosRoutes);
  

//Public files
app.use(express.static(join(__dirname, 'public/assets')));

//Run Server
app.listen(app.get('port'), ()=>
    console.log('Server listening on port: ', app.get('port')));

app.use(session({
    secret: 'secreto', // Cambia esto por una cadena secreta más segura
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: null, // Establece maxAge en null para eliminar la cookie cuando se cierre el navegador
        httpOnly: true, // La cookie solo será accesible por el servidor. NOTA: CAMBIAR A TRUE
        secure: false, // Cambiar a true si se utiliza HTTPS
    },
}));

// Ruta para cerrar sesión
app.get('/logout', (req, res) => {
  // Modificar las opciones de la cookie en la ruta de cierre de sesión
  console.log('Cookie: ',req.session.cookie);
  req.session.cookie.expires = new Date(0);
  req.session.cookie.maxAge = 0;

  
  req.session.destroy((err) => {
      if (err) {
          console.error('Error al cerrar sesión:', err);
      }
      res.redirect('/login');
  });
});

app.use(flash());


app.get('/nomina', (req, res) =>{

  res.render('nomina');

});



/*       Rutas correspondientes al login del sistema             */

// Rutas de inicio de sesión
app.post('/login/administrador', async (req, res) => {
  try {
      const { usuario, password } = req.body;

      console.log('Usuario: ',usuario);
      console.log('Password: ',password);
      if (!usuario || !password) {
          return res.status(400).json({ message: 'Ingrese un usuario y una contraseña' });
      }

      const [rows] = await pool.query('SELECT * FROM administradores WHERE user = ?', [usuario]);
      console.log('Rows: ',rows);
      if (rows.length === 0) {
          return res.status(401).json({ message: 'Datos inválidos' });
      }

      const administrador = rows[0];
      const passwordMatch = password === administrador.password;

      if (!passwordMatch) {
          return res.status(401).json({ message: 'Datos inválidos' });
      }

      req.session.administrador = administrador;
      req.session.user = {
        id: administrador.id,
        role: 'admin',
    };
      res.status(200).json({ message: 'Ha iniciado sesión exitosamente' });
  } catch (error) {
      console.error('Error al iniciar sesión como administrador:', error);
      res.status(500).json({ message: 'Error al iniciar sesión' });
  }
});

app.post('/login/usuario', async (req, res) => {
  try {

    

      const { usuario, password } = req.body;

      if (!usuario || !password) {
          return res.status(400).json({ message: 'Ingrese un usuario y una contraseña' });
      }

      const [rows] = await pool.query('SELECT * FROM usuarios WHERE alias = ?', [usuario]);

      if (rows.length === 0) {
          return res.status(401).json({ message: 'Datos inválidos' });
      }

      const user = rows[0];
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
          return res.status(401).json({ message: 'Datos inválidos' });
      }

      req.session.usuario = user;
      req.session.user = {
        id: user.id,
        id_empleado: user.id_empleado,
        role: 'user',
    };

      res.status(200).json({ message: 'Ha iniciado sesión exitosamente' });
  } catch (error) {
      console.error('Error al iniciar sesión como usuario:', error);
      res.status(500).json({ message: 'Error al iniciar sesión' });
  }
});

// Middleware para verificar si hay una sesión iniciada
const requireLogin = (req, res, next) => {
  if (!req.session.user) {
      return res.redirect('/login');
  }
  next();
};

// Rutas protegidas que requieren inicio de sesión
app.get('/', requireLogin, (req, res) => {
  if (req.session.user.role === 'admin') {
      res.render('index');
  } else {
      const userId = req.session.user.id_empleado;
      res.render('index2', {userId});
  }
});









/********************CREANDO RUTAS QUE ESTAN VINCULADAS CON SUBIDA CONSULTA ELIMINACION DE ARCHIVOS DENTRO DE GOOGLE DRIVE************************/

//Ruta para crear empleados con una imagen agregada por el usuario
const drive = google.drive({ version: 'v3', auth:oauth2Client });

app.post('/crear', upload.single('ine'), async (req, res) => {
  try {
    function generateDateString(date = new Date()) {
      return new Intl.DateTimeFormat('en-CA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).format(date);
    }

    const fecha_creacion = String(generateDateString());
    const { nombre, apellido_paterno, apellido_materno, telefono, id_puesto, nss, infonavit, salario } = req.body;
    const file = req.file;

    // Crear el empleado en la base de datos
    const [result] = await pool.query(
      `INSERT INTO empleados (nombre, apellido_paterno, apellido_materno, telefono, id_puesto, nss, infonavit, salario, fecha_creacion)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [nombre, apellido_paterno, apellido_materno, telefono, id_puesto, nss, infonavit, salario, fecha_creacion]
    );
    
    const empleadoId = result.insertId;
    const empleadoNombre = `${nombre}  ${apellido_paterno}  ${apellido_materno}`;

    

    if (file) {

      const folderName = `${empleadoId}-${empleadoNombre}`;

      const folderMetaData = {
        name: folderName,
        mimeType:  'application/vnd.google-apps.folder',
        //Sustituir por el ID de la carpeta de la nueva carpeta correspondiente a la nueva cuenta de drive
        parents: ["1VCWq65P2AG-jEqFpNK4G6ePPn_l-O19i"],
      }

      const folder = await drive.files.create({
        resource: folderMetaData,
        fields: 'id',
      });

      const folderId = folder.data.id;

      const fileMetaData = {
        name: file.originalname,
        parents: [folderId]
      };

      const bufferStream = new stream.PassThrough();
      bufferStream.end(file.buffer);

      const { data } = await google.drive({ version: 'v3', auth:oauth2Client }).files.create({
        media: {
          mimeType: file.mimetype,
          body: bufferStream,
        },
        requestBody: fileMetaData,
        fields: 'id',
      });

      const ineFileId = data.id;


      // Guardar el ID del archivo en la base de datos asociado al empleado
      await pool.query(
        `UPDATE empleados SET id_folder = ?, ine_file_id = ? WHERE id = ?`,
        [folderId, ineFileId, empleadoId]
      );

    }else{
      const folderName = `${empleadoId}-${empleadoNombre}`;

      const folderMetaData = {
        name: folderName,
        mimeType:  'application/vnd.google-apps.folder',
        //Sustituir por el ID de la carpeta de la nueva carpeta correspondiente a la nueva cuenta de drive
        parents: ["1VCWq65P2AG-jEqFpNK4G6ePPn_l-O19i"],
      }

      const folder = await drive.files.create({
        resource: folderMetaData,
        fields: 'id',
      });

      const folderId = folder.data.id;

      await pool.query(
        `UPDATE empleados SET id_folder = ? WHERE id = ?`,
        [folderId, empleadoId]
      );
    }

    res.status(200).json({ message: 'Empleado creado exitosamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al crear el empleado' });
  }
});


////////////Ruta para la modificacion de datos de empleados

app.post('/edit/:id', upload.single('ine'), async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido_paterno, apellido_materno, telefono, id_puesto, nss, infonavit, salario } = req.body;
    const file = req.file;

    // Obtener el empleado actual de la base de datos
    const [empleadoActual] = await pool.query('SELECT * FROM empleados WHERE id = ?', [id]);

    if (!empleadoActual) {
      return res.status(404).json({ message: 'Empleado no encontrado' });
    }

    // Generar la fecha de modificación
    function generateDateString(date = new Date()) {
      return new Intl.DateTimeFormat('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
    }

    // Actualizar los datos del empleado en la base de datos
    await pool.query(
      'UPDATE empleados SET nombre = ?, apellido_paterno = ?, apellido_materno = ?, telefono = ?, id_puesto = ?, nss = ?, infonavit = ?, salario = ? WHERE id = ?',
      [nombre, apellido_paterno, apellido_materno, telefono, id_puesto, nss, infonavit, salario, id]
    );

    const empleadoNombre = `${nombre} ${apellido_paterno} ${apellido_materno}`;
    const folderId = empleadoActual[0].id_folder;

    // Verificar si el nombre del empleado ha cambiado
    if (empleadoNombre !== `${empleadoActual[0].nombre} ${empleadoActual[0].apellido_paterno} ${empleadoActual[0].apellido_materno}`) {
      // Cambiar el nombre de la carpeta en Google Drive
      const folderMetadata = {
        name: `${id}-${empleadoNombre}`,
      };

      await drive.files.update({
        fileId: folderId,
        requestBody: folderMetadata,
      });
    }

    if (file) {
      if (file && empleadoActual[0].ine_file_id) {
        // Eliminar la imagen anterior del INE de Google Drive
        await drive.files.delete({
          fileId: empleadoActual[0].ine_file_id,
        });
      }

      const fileMetaData = {
        name: file.originalname,
        parents: [folderId],
      };

      const bufferStream = new stream.PassThrough();
      bufferStream.end(file.buffer);

      const { data } = await google.drive({ version: 'v3', auth: oauth2Client }).files.create({
        media: {
          mimeType: file.mimetype,
          body: bufferStream,
        },
        requestBody: fileMetaData,
        fields: 'id',
      });

      const ineFileId = data.id;

      // Actualizar el ID del archivo en la base de datos asociado al empleado
      await pool.query('UPDATE empleados SET ine_file_id = ? WHERE id = ?', [ineFileId, id]);
    }

    res.status(200).json({ message: 'Empleado modificado exitosamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al modificar el empleado' });
  }
});

////////////////////////////////////////////RUTA PARA LA ELIMINACION DE EMPLEADOS

app.delete('/delete/:id', async (req, res) =>{
  try {
    const { id } = req.params;

    // Obtener el empleado de la base de datos
    const [empleado] = await pool.query('SELECT * FROM empleados WHERE id = ?', [id]);

    if (empleado.length === 0) {
      return res.status(404).json({ message: 'Empleado no encontrado' });
    }

    const folderId = empleado[0].id_folder;

    // Eliminar la carpeta de Google Drive
    await drive.files.delete({
      fileId: folderId,
    });

    // Eliminar el empleado de la base de datos
    await pool.query('DELETE FROM empleados WHERE id = ?', [id]);

    res.status(200).json({ message: 'Empleado eliminado exitosamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al eliminar el empleado' });
  }
})


/***************************************** SECCION DE LA CACHE ************************** */

const cacheDirectory = path.join(__dirname, 'cache');

// Verificar si el directorio de caché existe, si no, crearlo
if (!fs.existsSync(cacheDirectory)) {
  fs.mkdirSync(cacheDirectory);
}

app.get('/imagen-proxy', async (req, res) => {
  try {
    const imageFileId = req.query.fileId;
    const cacheFilePath = path.join(cacheDirectory, `${imageFileId}.jpg`);

    // Verificar si la imagen está en caché
    if (fs.existsSync(cacheFilePath)) {
      // Servir la imagen desde la caché
      res.sendFile(cacheFilePath);
    } else {
      // Obtener la imagen desde Google Drive
      const drive = google.drive({ version: 'v3', auth: oauth2Client });
      const response = await drive.files.get({
        fileId: imageFileId,
        alt: 'media',
      }, { responseType: 'stream' });

      // Guardar la imagen en caché
      const cacheStream = fs.createWriteStream(cacheFilePath);
      response.data.pipe(cacheStream);

      // Esperar a que la imagen se guarde en caché antes de servirla
      cacheStream.on('finish', () => {
        res.setHeader('Content-Type', response.headers['content-type']);
        res.sendFile(cacheFilePath);
      });
    }
  } catch (error) {
    console.error('Error al obtener la imagen desde Google Drive:', error);
    res.status(500).send('Error al obtener la imagen');
  }
});


/**********************************************SECCION DE RUTAS PARA EL MODULO DE PROYECTOS************************************ */


//Ruta para crear una carpeta e insertar una imagen cuando se crea un proyecto

app.post('/guardar-proyecto', upload.single('imagen'), async (req, res) => {
  try {
    const { nombreProyecto, encargadoId, fechaInicio, fechaFin, presupuestoInicial, descripcion, cuadrillas, empleadosAsignados } = req.body;
    const file = req.file;

    // Crear la carpeta del proyecto en Google Drive
    const folderName = nombreProyecto;
    const folderMetaData = {
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
      parents: ["1iUjpvmFwNf1oJdTvo7S4XFE46VM9C0mF"],
    };
    const folder = await drive.files.create({
      resource: folderMetaData,
      fields: 'id',
    });
    const folderId = folder.data.id;

    // Crear la carpeta de asistencias dentro de la carpeta del proyecto
    const asistenciasFolderMetaData = {
      name: 'asistencias',
      mimeType: 'application/vnd.google-apps.folder',
      parents: [folderId],
    };
    const asistenciasFolder = await drive.files.create({
      resource: asistenciasFolderMetaData,
      fields: 'id',
    });
    const asistenciasFolderId = asistenciasFolder.data.id;

    let imageFileId = null;

    // Subir la imagen a la carpeta del proyecto (solo si se seleccionó una imagen)
    if (file) {
      const fileMetaData = {
        name: `fondo-${nombreProyecto}`,
        parents: [folderId]
      };
      const bufferStream = new stream.PassThrough();
      bufferStream.end(file.buffer);
      const imageFile = await google.drive({ version: 'v3', auth: oauth2Client }).files.create({
        media: {
          mimeType: file.mimetype,
          body: bufferStream,
        },
        requestBody: fileMetaData,
        fields: 'id',
      });
      imageFileId = imageFile.data.id;
    }

    // Insertar el proyecto en la base de datos
    const [result] = await pool.query(
      `INSERT INTO proyectos (nombre, id_empleado, fecha_inicio, fecha_fin, presupuesto_inicial, presupuesto_actual, descripcion, id_carpeta, id_imagen, id_carpeta_asistencias)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [nombreProyecto, encargadoId, fechaInicio, fechaFin, presupuestoInicial, 0, descripcion, folderId, imageFileId, asistenciasFolderId]
    );
    const proyectoId = result.insertId;

    // Insertar las cuadrillas en la base de datos
    for (const cuadrilla of JSON.parse(cuadrillas)) {
      // Crear la carpeta de asistencias para la cuadrilla
      const cuadrillaAsistenciasFolderMetaData = {
        name: `asistencias_${cuadrilla}`,
        mimeType: 'application/vnd.google-apps.folder',
        parents: [asistenciasFolderId],
      };
      const cuadrillaAsistenciasFolder = await drive.files.create({
        resource: cuadrillaAsistenciasFolderMetaData,
        fields: 'id',
      });
      const cuadrillaAsistenciasFolderId = cuadrillaAsistenciasFolder.data.id;

      const [cuadrillaResult] = await pool.query(
        `INSERT INTO cuadrillas (id_proyecto, nombre, id_carpeta_asistencias)
        VALUES (?, ?, ?)`,
        [proyectoId, cuadrilla, cuadrillaAsistenciasFolderId]
      );
      const cuadrillaId = cuadrillaResult.insertId;
      console.log("cuadrilla: ", cuadrilla);
      // Insertar los empleados asignados a la cuadrilla en la base de datos
      const empleadosCuadrilla = JSON.parse(empleadosAsignados)[cuadrilla];
      for (const empleadoId of empleadosCuadrilla) {
        await pool.query(
          `INSERT INTO detalle_cuadrillas (id_cuadrilla, id_empleado)
          VALUES (?, ?)`,
          [cuadrillaId, empleadoId]
        );
      }
    }

    const contratistas = JSON.parse(req.body.contratistas || '[]');
    function generateDateString(date = new Date()) {
      return new Intl.DateTimeFormat('en-CA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).format(date);
    }
    const fecha_agregado = String(generateDateString());
    for (const contratista of contratistas) {
      const { nombre, sueldo } = contratista;
      await pool.query(
        `INSERT INTO contratistas (id_proyecto, nombre, sueldo, fecha_agregado)
        VALUES (?, ?, ?, ?)`,
        [proyectoId, nombre, sueldo, fecha_agregado]
      );
    }

    // Después de insertar el proyecto en la base de datos
    const [proyectoResult] = await pool.query(
      `SELECT p.id, p.nombre, p.fecha_inicio, p.fecha_fin, p.id_imagen
      FROM proyectos p
      WHERE p.id = ?`,
      [proyectoId]
    );

    const proyecto = proyectoResult[0];

    function generarTarjetaProyecto(proyecto) {
      const { id, nombre, fecha_inicio, fecha_fin, id_imagen } = proyecto;
    
      const fechaIFormateada = new Date(fecha_inicio).toLocaleDateString();
      const fechaFFormateada = new Date(fecha_fin).toLocaleDateString();
    
      let imagenUrl = '/images/empleados.jpg'; // Imagen predeterminada
    
      if (id_imagen) {
        // Si el proyecto tiene una imagen asociada, obtener la URL de la imagen desde Google Drive
        const imageUrl = `https://drive.google.com/uc?id=${id_imagen}`;
        imagenUrl = imageUrl;
      }
    
      const tarjetaHtml = `
        <div class="tarjeta-proyecto" data-proyecto-id="${id}" style="background-image: url(${imagenUrl});">
          <div class="overlay"></div>
          <span class="material-icons">construction</span>
          <div class="middle">
            <div class="left">
              <h3>${nombre}</h3>
              <h2>Fecha de Inicio: ${fechaIFormateada}</h2>
              <h2>Fecha de Finalización: ${fechaFFormateada}</h2>
            </div>
          </div>
        </div>
      `;
    
      return tarjetaHtml;

    }
   
  
    const tarjetaHtml = generarTarjetaProyecto(proyecto);

    res.json({ success: true, proyecto });
  } catch (error) {
    console.error('Error al guardar el proyecto:', error);
    res.status(500).json({ success: false, message: 'Error al guardar el proyecto' });
  }
});






/******************************************************SECCION DE RUTAS DEL MODULO DE ASISTENCIAS***************************************************** */

////////////////////////Ruta encargada de dar de alta el registro de asistencia dentro de la tabla de asistencias_cuadrilla
app.post('/crear-asistencia-cuadrilla', async (req, res) => {
  try {
    const { idProyecto, idCuadrilla, horaInicio, horaFin, fechaAsistencia } = req.body;

    // Obtener el ID de la carpeta de asistencias correspondiente a la cuadrilla
    const [cuadrillaResult] = await pool.query(
      'SELECT id_carpeta_asistencias FROM cuadrillas WHERE id = ?',
      [idCuadrilla]
    );

    if (cuadrillaResult.length === 0) {
      throw new Error('No se encontró la cuadrilla especificada');
    }

    const idCarpetaAsistenciasCuadrilla = cuadrillaResult[0].id_carpeta_asistencias;

    // Crear la carpeta de asistencias para la fecha especificada
    const fechaFormateada = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '_');
    const nombreCarpetaAsistencia = `asistencias_${fechaFormateada}`;

    const carpetaAsistenciaMetadata = {
      name: nombreCarpetaAsistencia,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [idCarpetaAsistenciasCuadrilla],
    };

    const carpetaAsistencia = await drive.files.create({
      resource: carpetaAsistenciaMetadata,
      fields: 'id',
    });

    const idCarpetaAsistencia = carpetaAsistencia.data.id;

    // Crear la subcarpeta de justificaciones dentro de la carpeta de asistencias
    const nombreCarpetaJustificaciones = 'justificaciones';

    const carpetaJustificacionesMetadata = {
      name: nombreCarpetaJustificaciones,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [idCarpetaAsistencia],
    };

    const carpetaJustificaciones = await drive.files.create({
      resource: carpetaJustificacionesMetadata,
      fields: 'id',
    });

    const idCarpetaJustificaciones = carpetaJustificaciones.data.id;

    // Insertar la asistencia de cuadrilla en la base de datos con los IDs de las carpetas
    const [result] = await pool.query(
      'INSERT INTO asistencias_cuadrilla (id_proyecto, id_cuadrilla, hora_inicio, hora_fin, fecha_asistencia, id_carpeta_asistencias, id_carpeta_justificaciones) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [idProyecto, idCuadrilla, horaInicio, horaFin, fechaAsistencia, idCarpetaAsistencia, idCarpetaJustificaciones]
    );

    const idAsistenciaCuadrilla = result.insertId;
    console.log("IdAsistenciaCuadrilla: ", idAsistenciaCuadrilla);
    res.json({ id: idAsistenciaCuadrilla });
  } catch (error) {
    console.error('Error al crear la asistencia de cuadrilla:', error);
    res.status(500).json({ error: 'Error al crear la asistencia de cuadrilla' });
  }
});




////////////////////////Ruta que se encarga de almacenar las justificaciones de las cuadrillas
async function obtenerEmpleadoPorIdDetalleAsistencia(idDetalleAsistencia) {
  const [rows] = await pool.query(
    `SELECT e.nombre, e.apellido_paterno, e.apellido_materno
     FROM empleados e
     INNER JOIN detalle_asistencias_cuadrilla dac ON e.id = dac.id_empleado
     WHERE dac.id = ?`,
    [idDetalleAsistencia]
  );

  return rows[0];
}
app.post('/justificarFaltasDiarias', upload.single('evidencia'), async (req, res) => {
  try {
    const { idDetalleAsistencia, motivo, idAsistenciaCuadrilla } = req.body;
    const file = req.file;

    console.log('Id Detalle Asistencia: ', idDetalleAsistencia);
    console.log('File: ', file);

    let evidenciaUrl = null;

    if (file) {
      // Generar el nombre del archivo de evidencia
      const empleado = await obtenerEmpleadoPorIdDetalleAsistencia(idDetalleAsistencia);
      console.log('Empleado: ', empleado);

      const fechaActual = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '_');
      const nombreArchivo = `Evidencia-${fechaActual}-${empleado.nombre}_${empleado.apellido_paterno}_${empleado.apellido_materno}`;

      // Obtener el ID de la carpeta de justificaciones correspondiente a la asistencia de cuadrilla
      const [asistenciaCuadrillaResult] = await pool.query(
        'SELECT id_carpeta_justificaciones FROM asistencias_cuadrilla WHERE id = ?',
        [idAsistenciaCuadrilla]
      );

      if (asistenciaCuadrillaResult.length === 0) {
        throw new Error('No se encontró la asistencia de cuadrilla especificada');
      }

      const folderId = asistenciaCuadrillaResult[0].id_carpeta_justificaciones;

      // Subir el archivo a Google Drive
      const fileMetaData = {
        name: nombreArchivo,
        parents: [folderId]
      };

      const bufferStream = new stream.PassThrough();
      bufferStream.end(file.buffer);

      const { data } = await google.drive({ version: 'v3', auth: oauth2Client }).files.create({
        media: {
          mimeType: file.mimetype,
          body: bufferStream,
        },
        requestBody: fileMetaData,
        fields: 'id',
      });

      evidenciaUrl = `https://drive.google.com/file/d/${data.id}/view?usp=sharing`;
    }

    // Insertar la justificación en la tabla justificaciones_diarias_cuadrilla
    await pool.query(
      'INSERT INTO justificaciones_diarias_cuadrilla (id_detalle_asistencia_cuadrilla, motivo, evidencia) VALUES (?, ?, ?)',
      [idDetalleAsistencia, motivo, evidenciaUrl]
    );

    res.sendStatus(200);
  } catch (error) {
    console.error('Error al justificar la falta:', error);
    res.status(500).json({ error: 'Error al justificar la falta' });
  }
});


//////////////////////////////// Ruta que se encarga de eliminar asistencias

app.delete('/eliminar-asistencia/:idAsistencia/:fechasCoinciden/:fechaHoy', async (req, res) => {
  try {
    const { idAsistencia, fechasCoinciden, fechaHoy } = req.params;

    // Obtener el valor del campo id_carpeta_asistencias de la tabla asistencias_cuadrilla
    const [asistenciaResult] = await pool.query(`
      SELECT id_carpeta_asistencias
      FROM asistencias_cuadrilla
      WHERE id = ?
    `, [idAsistencia]);

    if (asistenciaResult.length === 0) {
      return res.status(404).json({ error: 'Asistencia no encontrada' });
    }

    const idCarpetaAsistencias = asistenciaResult[0].id_carpeta_asistencias;

    // Eliminar la carpeta de Google Drive correspondiente al id_carpeta_asistencias
    await drive.files.delete({
      fileId: idCarpetaAsistencias,
    });

    // Eliminar el registro de asistencia de la tabla asistencias_cuadrilla
    await pool.query(`
      DELETE FROM asistencias_cuadrilla
      WHERE id = ?
    `, [idAsistencia]);

    if (fechasCoinciden) {
      await pool.query(`
        DELETE FROM datos_localstorage
        WHERE id_asistencia_cuadrilla = ? AND fecha = ?
      `, [idAsistencia, fechaHoy]);
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('Error al eliminar la asistencia:', error);
    res.status(500).json({ error: 'Error al eliminar la asistencia' });
  }
});







/**********************************************************SECCION DE LAS RUTAS DEL MODULO DE USUARIOS******************************************** */


////////////////////////////////Ruta que se encarga de almacenar los usuarios

app.post('/guardar-usuario', upload.single('fotoPerfil'), async (req, res) => {
  try {
    const { idEmpleado, alias, password } = req.body;
    const file = req.file;

    const saltRounds = 10;
    const passwordEncriptada = await bcrypt.hash(password, saltRounds);

    let fotoPerfilId = null;
    let folderId = null;

    if (file) {
      const fechaActual = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' }).replace(/\//g, '_');
      const nombreArchivo = `${alias}_foto-perfil_${fechaActual}`;

      //Sustituir por el ID de la carpeta de la nueva carpeta correspondiente a la nueva cuenta de drive
      const carpetaPadreId = '1SlBNmI-qh8sjtL_LkLRPnlNJBzYZMKIm';

      // Crear la carpeta del usuario
      const folderMetaData = {
        name: alias,
        mimeType: 'application/vnd.google-apps.folder',
        parents: [carpetaPadreId]
      };
      const folder = await drive.files.create({
        resource: folderMetaData,
        fields: 'id'
      });
      folderId = folder.data.id;

      // Subir la imagen de perfil a la carpeta del usuario
      const fileMetaData = {
        name: nombreArchivo,
        parents: [folderId]
      };
      const bufferStream = new stream.PassThrough();
      bufferStream.end(file.buffer);
      const imageFile = await drive.files.create({
        media: {
          mimeType: file.mimetype,
          body: bufferStream,
        },
        requestBody: fileMetaData,
        fields: 'id',
      });
      fotoPerfilId = imageFile.data.id;
    }else{
      //Sustituir por el ID de la carpeta de la nueva carpeta correspondiente a la nueva cuenta de drive
      const carpetaPadreId = '1SlBNmI-qh8sjtL_LkLRPnlNJBzYZMKIm';

      // Crear la carpeta del usuario
      const folderMetaData = {
        name: alias,
        mimeType: 'application/vnd.google-apps.folder',
        parents: [carpetaPadreId]
      };
      const folder = await drive.files.create({
        resource: folderMetaData,
        fields: 'id'
      });
      folderId = folder.data.id;

    }

    const query = 'INSERT INTO usuarios (id_empleado, alias, password, foto_perfil, id_carpeta) VALUES (?, ?, ?, ?, ?)';
    const values = [idEmpleado, alias, passwordEncriptada, fotoPerfilId, folderId];

    await pool.query(query, values);
    res.json({ message: 'Usuario guardado exitosamente' });
  } catch (error) {
    console.error('Error al guardar el usuario:', error);
    res.status(500).json({ error: 'Error al guardar el usuario' });
  }
});


///////////////////////////////////////////////Modificar Usuario

app.put('/modificar-usuario', upload.single('fotoPerfil'), async (req, res) => {
  try {
    const { idEmpleado, alias, password } = req.body;
    const file = req.file;

    let fotoPerfilId = null;

    // Obtener el ID de la carpeta del usuario a partir del idEmpleado
    const [result] = await pool.query('SELECT id_carpeta FROM usuarios WHERE id_empleado = ?', [idEmpleado]);
    const folderId = result[0].id_carpeta;

    // Obtener el ID de la foto de perfil actual del usuario
    const [fotoPerfilResult] = await pool.query('SELECT foto_perfil FROM usuarios WHERE id_empleado = ?', [idEmpleado]);
    const fotoPerfilActualId = fotoPerfilResult[0].foto_perfil;

    if (file) {
      // Eliminar la foto de perfil anterior de Google Drive (si existe)
      if (fotoPerfilActualId) {
        await drive.files.delete({
          fileId: fotoPerfilActualId,
        });
      }

      // Subir la nueva imagen a Google Drive y obtener su ID
      const fileMetaData = {
        name: file.originalname,
        parents: [folderId]
      };

      const bufferStream = new stream.PassThrough();
      bufferStream.end(file.buffer);

      const imageFile = await drive.files.create({
        media: {
          mimeType: file.mimetype,
          body: bufferStream,
        },
        requestBody: fileMetaData,
        fields: 'id',
      });

      fotoPerfilId = imageFile.data.id;
    }

    const saltRounds = 10;
    const passwordEncriptada = await bcrypt.hash(password, saltRounds);

    if (file && password) {
      const query = 'UPDATE usuarios SET alias = ?, password = ?, foto_perfil = ? WHERE id_empleado = ?';
      const values = [alias, passwordEncriptada, fotoPerfilId, idEmpleado];
      await pool.query(query, values);
    } else if (file) {
      const query = 'UPDATE usuarios SET alias = ?, foto_perfil = ? WHERE id_empleado = ?';
      const values = [alias, fotoPerfilId, idEmpleado];
      await pool.query(query, values);
    } else if (password) {
      const query = 'UPDATE usuarios SET alias = ?, password = ? WHERE id_empleado = ?';
      const values = [alias, passwordEncriptada, idEmpleado];
      await pool.query(query, values);
    } else {
      const query = 'UPDATE usuarios SET alias = ? WHERE id_empleado = ?';
      const values = [alias, idEmpleado];
      await pool.query(query, values);
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('Error al modificar el usuario:', error);
    res.status(500).json({ error: 'Error al modificar el usuario' });
  }
});



/////////////////////////////////////// Eliminar Usuario

app.delete('/eliminar-usuario/:empleadoId', async (req, res) => {
  try {
    const empleadoId = req.params.empleadoId;

    // Obtener el ID de la carpeta del usuario a partir del empleadoId
    const [result] = await pool.query('SELECT id_carpeta FROM usuarios WHERE id_empleado = ?', [empleadoId]);

    if (result.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const folderId = result[0].id_carpeta;

    // Eliminar la carpeta de Google Drive
    await drive.files.delete({
      fileId: folderId,
    });

    // Eliminar el usuario de la base de datos
    await pool.query('DELETE FROM usuarios WHERE id_empleado = ?', [empleadoId]);

    res.sendStatus(200);
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
    res.status(500).json({ error: 'Error al eliminar el usuario' });
  }
});


