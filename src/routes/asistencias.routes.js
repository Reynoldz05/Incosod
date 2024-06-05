import {Router} from 'express'
import pool from '../database.js'


const router = Router();

router.get('/registrar-asistencias', async(req, res) =>{

  res.render('asistencia_registrar');


});

router.get('/registrar-asistencias-usuarios/:idUser', async(req, res) =>{

    const { idUser } = req.params;

    res.render('asistencia_proyecto_usuarios', {idUser: idUser});

})

router.get('/mostrarAsistenciasUsuarios/:idUser', async(req, res) =>{

  const {idUser} = req.params;

  res.render('vista_asistencias_cuadrillas', {idUser: idUser});

})

router.get('/asistencias-proyectos', async(req, res) =>{

  res.render('asistencia_proyecto');

});


router.get('/mostrarDetallesAsistenciasCuadrillas', async(req, res) => {
  
  const { idAsistenciaCuadrilla, nombreCuadrilla } = req.query;

  res.render('vista_detalles_asistencia_cuadrilla', { idAsistenciaCuadrilla, nombreCuadrilla });
});


/*******************RUTAS CORRESPONDIENTES A LAS ASISTENCIAS POR CUADRILLAS *********************************************/

// Ruta /crear-detalles-asistencia-cuadrilla
router.post('/crear-detalles-asistencia-cuadrilla', async (req, res) => {
  try {
    const detallesAsistencia = req.body;
    const valores = detallesAsistencia.map(detalle => [
      detalle.idAsistenciaCuadrilla,
      detalle.idEmpleado,
      detalle.asistencia,
      detalle.horaEntrada
    ]);

    console.log(detallesAsistencia);

    const [result] = await pool.query(
      'INSERT INTO detalle_asistencias_cuadrilla (id_asistencia_cuadrilla, id_empleado, asistencia, hora_entrada) VALUES ?',
      [valores]
    );

    const idDetalle = result.insertId;

    // Obtener el id_asistencia_cuadrilla del primer detalle de asistencia
    const idAsistenciaCuadrilla = detallesAsistencia[0].idAsistenciaCuadrilla;

    res.json({ idAsistenciaCuadrilla: idAsistenciaCuadrilla });
  } catch (error) {
    console.error('Error al crear los detalles de asistencia de cuadrilla:', error);
    res.status(500).json({ error: 'Error al crear los detalles de asistencia de cuadrilla' });
  }
});




// Ruta para obtener las asistencias de los empleados de una cuadrilla
router.get('/obtener-asistencias-empleados/:idCuadrilla/:fechaAsistencia', async (req, res) => {
  try {
    const { idCuadrilla, fechaAsistencia } = req.params;
    const asistencias = await pool.query(`
    SELECT e.id, e.nombre, e.apellido_paterno, e.apellido_materno, COALESCE(dac.asistencia, -1) AS asistencia
      FROM empleados e
      LEFT JOIN detalle_cuadrillas dc ON e.id = dc.id_empleado
      LEFT JOIN cuadrillas c ON dc.id_cuadrilla = c.id
      LEFT JOIN asistencias_cuadrilla ac ON c.id = ac.id_cuadrilla
      LEFT JOIN detalle_asistencias_cuadrilla dac ON ac.id = dac.id_asistencia_cuadrilla AND e.id = dac.id_empleado
      WHERE c.id = ? AND ac.fecha_asistencia = ? ORDER BY e.id ASC`, [idCuadrilla,  fechaAsistencia]);
    res.json(asistencias);
  } catch (error) {
    console.error('Error al obtener las asistencias de los empleados:', error);
    res.status(500).json({ error: 'Error al obtener las asistencias de los empleados' });
  }
});


router.get('/obtener-horas-jornada/:idAsistenciaCuadrilla', async (req, res) => {
  try {
    const { idAsistenciaCuadrilla } = req.params;
    const [rows] = await pool.query(
      'SELECT hora_inicio, hora_fin FROM asistencias_cuadrilla WHERE id = ?',
      [idAsistenciaCuadrilla]
    );
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.json(null);
    }
  } catch (error) {
    console.error('Error al obtener las horas de la jornada:', error);
    res.status(500).json({ error: 'Error al obtener las horas de la jornada' });
  }
});



router.post('/establecerFaltas', async (req, res) => {
  try {
    const { idDetalleAsistencia } = req.body;

    // Insertar la falta en la tabla faltas_diarias_cuadrilla
    await pool.query(
      'INSERT INTO faltas_diarias_cuadrilla (id_detalle_asistencia_cuadrilla) VALUES (?)',
      [idDetalleAsistencia]
    );

    res.sendStatus(200);
  } catch (error) {
    console.error('Error al establecer la falta:', error);
    res.status(500).json({ error: 'Error al establecer la falta' });
  }
});


router.get('/obtener-justificaciones/:idDetalleAsistencia', async (req, res) => {
  try {
    const { idDetalleAsistencia } = req.params;
    const [rows] = await pool.query(
      `SELECT id_detalle_asistencia_cuadrilla, motivo, evidencia FROM justificaciones_diarias_cuadrilla WHERE id_detalle_asistencia_cuadrilla = ?`,
      [idDetalleAsistencia]
    );

    if (rows.length > 0) {
      console.log(rows);
      res.json(rows);
    } else {
      res.json([{ id_detalle_asistencia_cuadrilla: null, motivo: '', evidencia: null }]);
    }
  } catch (error) {
    console.error('Error al obtener las justificaciones:', error);
    res.status(500).json({ error: 'Error al obtener las justificaciones' });
  }
});


router.get('/obtener-justificaciones-info/:idDetalleAsistencia', async (req, res) => {
  try {
    const { idDetalleAsistencia } = req.params;
    const [rows] = await pool.query(
      `SELECT id_detalle_asistencia_cuadrilla, motivo, evidencia FROM justificaciones_diarias_cuadrilla WHERE id_detalle_asistencia_cuadrilla = ?`,
      [idDetalleAsistencia]
    );

    if (rows.length > 0) {
      console.log(rows);
      res.json(rows[0]);
    } else {
      res.json({ id_detalle_asistencia_cuadrilla: null, motivo: '', evidencia: null });
    }
  } catch (error) {
    console.error('Error al obtener las justificaciones:', error);
    res.status(500).json({ error: 'Error al obtener las justificaciones' });
  }
});






router.get('/obtener-faltas/:idDetalleAsistencia', async (req, res) => {
  try {
    const { idDetalleAsistencia } = req.params;
    // Obtener todas las faltas desde la tabla faltas_diarias_cuadrilla
    const [rows] = await pool.query(`SELECT * FROM faltas_diarias_cuadrilla WHERE id_detalle_asistencia_cuadrilla = ?`, [idDetalleAsistencia]);
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener las faltas:', error);
    res.status(500).json({ error: 'Error al obtener las faltas' });
  }
});



router.post('/actualizar-justificaciones', async (req, res) => {
  try {
    const { llave, valor } = req.body;

    // Actualizar el arreglo de justificaciones en la tabla datos_localstorage
    await pool.query(
      'UPDATE datos_localstorage SET valor = ? WHERE llave = ?',
      [valor, llave]
    );

    res.sendStatus(200);
  } catch (error) {
    console.error('Error al actualizar las justificaciones:', error);
    res.status(500).json({ error: 'Error al actualizar las justificaciones' });
  }
});



router.post('/actualizar-faltas', async (req, res) => {
  try {
    const { llave, valor } = req.body;

    // Actualizar el arreglo de faltas en la tabla datos_localstorage
    await pool.query(
      'UPDATE datos_localstorage SET valor = ? WHERE llave = ?',
      [valor, llave]
    );

    res.sendStatus(200);
  } catch (error) {
    console.error('Error al actualizar las faltas:', error);
    res.status(500).json({ error: 'Error al actualizar las faltas' });
  }
});



router.get('/obtener-justificaciones-existentes/:idAsistenciaCuadrilla', async (req, res) => {
  try {
    const { idAsistenciaCuadrilla } = req.params;
    // Obtener el arreglo de justificaciones desde la tabla datos_localstorage
    const [rows] = await pool.query(
      `SELECT valor FROM datos_localstorage WHERE llave = "justificacionesEmpleados_${idAsistenciaCuadrilla}"`
    );
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener las justificaciones existentes:', error);
    res.status(500).json({ error: 'Error al obtener las justificaciones existentes' });
  }
});




router.get('/obtener-faltas-existentes/:idAsistenciaCuadrilla', async (req, res) => {
  try {
    const { idAsistenciaCuadrilla } = req.params;
    // Obtener el arreglo de faltas desde la tabla datos_localstorage
    const [rows] = await pool.query(
      `SELECT valor FROM datos_localstorage WHERE llave = "faltasEmpleados_${idAsistenciaCuadrilla}"`
    );
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener las faltas existentes:', error);
    res.status(500).json({ error: 'Error al obtener las faltas existentes' });
  }
});




router.post('/crear-justificaciones', async (req, res) => {
  try {
    const { llave, valor, idAsistenciaCuadrilla, fecha } = req.body;

    // Insertar el arreglo de justificaciones en la tabla datos_localstorage
    await pool.query(
      'INSERT INTO datos_localstorage (llave, valor, id_asistencia_cuadrilla, fecha) VALUES (?, ?, ?, ?)',
      [llave, valor, idAsistenciaCuadrilla, fecha]
    );

    res.sendStatus(200);
  } catch (error) {
    console.error('Error al crear las justificaciones:', error);
    res.status(500).json({ error: 'Error al crear las justificaciones' });
  }
});



router.post('/crear-faltas', async (req, res) => {
  try {
    const { llave, valor, idAsistenciaCuadrilla, fecha } = req.body;

    // Insertar el arreglo de faltas en la tabla datos_localstorage
    await pool.query(
      'INSERT INTO datos_localstorage (llave, valor, id_asistencia_cuadrilla, fecha) VALUES (?, ?, ?, ?)',
      [llave, valor, idAsistenciaCuadrilla, fecha]
    );

    res.sendStatus(200);
  } catch (error) {
    console.error('Error al crear las faltas:', error);
    res.status(500).json({ error: 'Error al crear las faltas' });
  }
});


router.get('/obtener-detalles-asistencia-cuadrilla/:idCuadrilla/:fechaAsistencia', async (req, res) => {
  try {
    const { idCuadrilla, fechaAsistencia } = req.params;
    const [rows] = await pool.query(`
      SELECT dac.id, dac.id_empleado
      FROM detalle_asistencias_cuadrilla dac
      INNER JOIN asistencias_cuadrilla ac ON dac.id_asistencia_cuadrilla = ac.id
      WHERE ac.id_cuadrilla = ? AND ac.fecha_asistencia = ?
    `, [idCuadrilla, fechaAsistencia]);
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener los detalles de asistencia de la cuadrilla:', error);
    res.status(500).json({ error: 'Error al obtener los detalles de asistencia de la cuadrilla' });
  }
});



router.post('/guardar-id-detalles-cuadrilla', async (req, res) => {
  try {
    const { llave, valor, idAsistenciaCuadrilla, fechaAsistencia } = req.body;
    await pool.query(
      'INSERT INTO datos_localstorage (llave, valor, id_asistencia_cuadrilla, fecha) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE valor = ?',
      [llave, valor, idAsistenciaCuadrilla, fechaAsistencia, valor]
    );
    res.sendStatus(200);
  } catch (error) {
    console.error('Error al guardar los ID de detalles de cuadrilla:', error);
    res.status(500).json({ error: 'Error al guardar los ID de detalles de cuadrilla' });
  }
});




router.get('/obtener-id-detalles-cuadrilla/:idAsistenciaCuadrilla', async (req, res) => {
  try {
    const { idAsistenciaCuadrilla } = req.params;
    const [rows] = await pool.query(
      'SELECT valor FROM datos_localstorage WHERE llave = ?',
      [`idDetallesCuadrilla_${idAsistenciaCuadrilla}`]
    );
    res.json(rows[0] || { valor: null });
  } catch (error) {
    console.error('Error al obtener los ID de detalles de cuadrilla:', error);
    res.status(500).json({ error: 'Error al obtener los ID de detalles de cuadrilla' });
  }
});



router.get('/obtener-id-asistencia-cuadrilla/:idCuadrilla/:fechaActual', async (req, res) => {
  try {
    const { idCuadrilla, fechaActual } = req.params;

    const [rows] = await pool.query(
      'SELECT id FROM asistencias_cuadrilla WHERE id_cuadrilla = ? AND fecha_asistencia = ?',
      [idCuadrilla, fechaActual]
    );

    if (rows.length > 0) {
      const idAsistenciaCuadrilla = rows[0].id;
      res.json({ idAsistenciaCuadrilla: idAsistenciaCuadrilla });
    } else {
      res.json({ idAsistenciaCuadrilla: null });
    }
  } catch (error) {
    console.error('Error al obtener el ID de asistencia de cuadrilla:', error);
    res.status(500).json({ error: 'Error al obtener el ID de asistencia de cuadrilla' });
  }
});



router.post('/actualizar-horas-laboradas', async (req, res) => {
  try {
    const { horasLaboradas, idAsistenciaCuadrilla } = req.body;

    // Iterar sobre las horas laboradas y actualizar en la base de datos
    for (const idEmpleado in horasLaboradas) {
      const horas = horasLaboradas[idEmpleado];
      await pool.query(
        'UPDATE detalle_asistencias_cuadrilla SET horas_laboradas = ? WHERE id_empleado = ? AND id_asistencia_cuadrilla = ?',
        [horas, idEmpleado, idAsistenciaCuadrilla]
      );
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('Error al actualizar las horas laboradas:', error);
    res.status(500).json({ error: 'Error al actualizar las horas laboradas' });
  }
});




router.post('/crear-faltas-pendientes', async (req, res) => {
  try {
    const { idAsistenciaCuadrilla, faltasPendientes, fecha } = req.body;

    // Insertar el registro de faltas pendientes en la tabla datos_localstorage
    await pool.query(
      'INSERT INTO datos_localstorage (llave, valor, id_asistencia_cuadrilla, fecha) VALUES (?, ?, ?, ?)',
      [`faltasPendientes_${idAsistenciaCuadrilla}`, JSON.stringify(faltasPendientes), idAsistenciaCuadrilla, fecha]
    );

    res.sendStatus(200);
  } catch (error) {
    console.error('Error al crear el registro de faltas pendientes:', error);
    res.status(500).json({ error: 'Error al crear el registro de faltas pendientes' });
  }
});




router.get('/obtener-horas-laboradas', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id_empleado, horas_laboradas FROM detalle_asistencias_cuadrilla'
    );

    const horasLaboradas = {};
    rows.forEach(row => {
      horasLaboradas[row.id_empleado] = row.horas_laboradas;
    });

    res.json({ horasLaboradas: horasLaboradas });
  } catch (error) {
    console.error('Error al obtener las horas laboradas:', error);
    res.status(500).json({ error: 'Error al obtener las horas laboradas' });
  }
});


router.get('/obtener-faltas-pendientes/:idAsistenciaCuadrilla', async (req, res) => {
  try {
    const { idAsistenciaCuadrilla } = req.params;
    const [rows] = await pool.query(
      'SELECT valor FROM datos_localstorage WHERE llave = ?',
      [`faltasPendientes_${idAsistenciaCuadrilla}`]
    );

    if (rows.length > 0) {
      const faltasPendientes = JSON.parse(rows[0].valor);
      res.json({ faltasPendientes });
    } else {
      res.json({ faltasPendientes: [] });
    }
  } catch (error) {
    console.error('Error al obtener las faltas pendientes:', error);
    res.status(500).json({ error: 'Error al obtener las faltas pendientes' });
  }
});


router.post('/guardar-terminar-turno', async (req, res) => {
  try {
    const { idAsistenciaCuadrilla, fechaHoy } = req.body;

    // Verificar si ya existe un registro para la asistencia de cuadrilla en la tabla datos_localstorage
    const [rows] = await pool.query(
      'SELECT COUNT(*) AS count FROM datos_localstorage WHERE llave = ?',
      [`terminarTurno_${idAsistenciaCuadrilla}`]
    );

    if (rows[0].count > 0) {
      // Si ya existe un registro, actualizar la fecha
      await pool.query(
        'UPDATE datos_localstorage SET valor = ? WHERE llave = ?',
        [fechaHoy, `terminarTurno_${idAsistenciaCuadrilla}`]
      );
    } else {
      // Si no existe un registro, insertar uno nuevo
      await pool.query(
        'INSERT INTO datos_localstorage (llave, valor, id_asistencia_cuadrilla, fecha) VALUES (?, ?, ?, ?)',
        [`terminarTurno_${idAsistenciaCuadrilla}`, fechaHoy, idAsistenciaCuadrilla, fechaHoy]
      );
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('Error al guardar el registro de terminar turno:', error);
    res.status(500).json({ error: 'Error al guardar el registro de terminar turno' });
  }
});


router.get('/verificar-terminar-turno/:idAsistenciaCuadrilla', async (req, res) => {
  try {
    const { idAsistenciaCuadrilla } = req.params;

    // Verificar si existe un registro de terminar turno para la asistencia de cuadrilla en la tabla datos_localstorage
    const [rows] = await pool.query(
      'SELECT COUNT(*) AS count FROM datos_localstorage WHERE llave = ?',
      [`terminarTurno_${idAsistenciaCuadrilla}`]
    );

    const terminado = rows[0].count > 0;

    res.json({ terminado });
  } catch (error) {
    console.error('Error al verificar si se ha terminado el turno:', error);
    res.status(500).json({ error: 'Error al verificar si se ha terminado el turno' });
  }
});

router.get('/obtener-detalles-asistencia/:idAsistenciaCuadrilla', async (req, res) => {
  try {
    const { idAsistenciaCuadrilla } = req.params;

    const [rows] = await pool.query(
      'SELECT id_empleado, hora_entrada FROM detalle_asistencias_cuadrilla WHERE id_asistencia_cuadrilla = ?',
      [idAsistenciaCuadrilla]
    );

    res.json(rows);
  } catch (error) {
    console.error('Error al obtener los detalles de asistencia:', error);
    res.status(500).json({ error: 'Error al obtener los detalles de asistencia' });
  }
});



/***************************************Seccion de rutas que muestra los detalles de las asistencias ya tomadas de las cuadrillas ************/


router.get('/obtener-proyectos-con-asistencias', async (req, res) => {
  try {
      const [proyectos] = await pool.query(`
          SELECT DISTINCT p.id, p.nombre
          FROM proyectos p
          INNER JOIN asistencias_cuadrilla ac ON p.id = ac.id_proyecto
      `);
      res.json(proyectos);
  } catch (error) {
      console.error('Error al obtener los proyectos con asistencias:', error);
      res.status(500).json({ error: 'Error al obtener los proyectos con asistencias' });
  }
});

router.get('/obtener-proyectos-con-asistencias-usuarios/:idUser', async (req, res) => {

  const { idUser } = req.params;
  try {
      const [proyectos] = await pool.query(`
          SELECT DISTINCT p.id, p.nombre
          FROM proyectos p
          INNER JOIN asistencias_cuadrilla ac ON p.id = ac.id_proyecto
          WHERE p.id_empleado = ?
      `, [idUser]);
      res.json(proyectos);
  } catch (error) {
      console.error('Error al obtener los proyectos con asistencias:', error);
      res.status(500).json({ error: 'Error al obtener los proyectos con asistencias' });
  }
});


router.get('/obtener-cuadrillas-con-asistencias/:idProyecto', async (req, res) => {
  try {
      const { idProyecto } = req.params;
      const [cuadrillas] = await pool.query(`
          SELECT DISTINCT c.id, c.nombre
          FROM cuadrillas c
          INNER JOIN asistencias_cuadrilla ac ON c.id = ac.id_cuadrilla
          WHERE c.id_proyecto = ?
      `, [idProyecto]);
      res.json(cuadrillas);
  } catch (error) {
      console.error('Error al obtener las cuadrillas con asistencias:', error);
      res.status(500).json({ error: 'Error al obtener las cuadrillas con asistencias' });
  }
});

router.get('/obtener-asistencias-cuadrilla/:idProyecto/:idCuadrilla', async (req, res) => {
  try {
      const { idProyecto, idCuadrilla } = req.params;
      const [asistencias] = await pool.query(`
          SELECT ac.id, ac.fecha_asistencia, ac.hora_inicio, ac.hora_fin,
                 (SELECT COUNT(*) FROM detalle_asistencias_cuadrilla dac WHERE dac.id_asistencia_cuadrilla = ac.id AND dac.asistencia = 1) AS total_asistencias,
                 (SELECT COUNT(*) FROM detalle_asistencias_cuadrilla dac WHERE dac.id_asistencia_cuadrilla = ac.id AND dac.asistencia = 0) AS total_inasistencias
          FROM asistencias_cuadrilla ac
          WHERE ac.id_proyecto = ? AND ac.id_cuadrilla = ?
      `, [idProyecto, idCuadrilla]);
      res.json(asistencias);
  } catch (error) {
      console.error('Error al obtener las asistencias de la cuadrilla:', error);
      res.status(500).json({ error: 'Error al obtener las asistencias de la cuadrilla' });
  }
});


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
router.get('/obtener-detalle-asistencias-cuadrilla/:idAsistenciaCuadrilla', async (req, res) => {
  try {
    const { idAsistenciaCuadrilla } = req.params;
    console.log(idAsistenciaCuadrilla);
    const [detalleAsistencias] = await pool.query(`
        SELECT dac.id AS id_detalle, e.nombre, e.apellido_paterno, e.apellido_materno,
            CASE
                WHEN jdc.id IS NOT NULL THEN 'Falta Justificada'
                WHEN fdc.id IS NOT NULL THEN 'Falta No Justificada'
                WHEN dac.asistencia = 0 THEN 'Falta Pendiente'
                ELSE 'Asistencia'
            END AS estado,
            ac.fecha_asistencia,
            dac.hora_entrada,
            dac.horas_laboradas
        FROM detalle_asistencias_cuadrilla dac
        INNER JOIN empleados e ON dac.id_empleado = e.id
        INNER JOIN asistencias_cuadrilla ac ON dac.id_asistencia_cuadrilla = ac.id
        LEFT JOIN justificaciones_diarias_cuadrilla jdc ON dac.id = jdc.id_detalle_asistencia_cuadrilla
        LEFT JOIN faltas_diarias_cuadrilla fdc ON dac.id = fdc.id_detalle_asistencia_cuadrilla
        WHERE ac.id = ?
    `, [idAsistenciaCuadrilla]);

      console.log('detalle asistencias cuadrilla: ',detalleAsistencias);

      // Obtener la hora de inicio y hora de fin de la asistencia de la cuadrilla
      const [asistenciaCuadrilla] = await pool.query(`
      SELECT hora_inicio, hora_fin
      FROM asistencias_cuadrilla
      WHERE id = ?
  `, [idAsistenciaCuadrilla]);
      
    console.log('Asistencia Cuadrilla: ',asistenciaCuadrilla[0]);
     // Calcular las horas extra para cada detalle de asistencia
      const detalleAsistenciasConHorasExtra = detalleAsistencias.map(detalle => {
        console.log(detalle);
        const { hora_inicio, hora_fin } = asistenciaCuadrilla[0];
        console.log('hora inicio: ',hora_inicio);
        console.log('hora fin: ',hora_fin);
        console.log('horas laboradas: ',detalle.horas_laboradas);
        const horasExtra = calcularHorasExtra(hora_inicio, hora_fin, detalle.horas_laboradas);
        return { ...detalle, horas_extra: horasExtra };
    });
      res.json(detalleAsistenciasConHorasExtra);
  } catch (error) {
      console.error('Error al obtener el detalle de asistencias de la cuadrilla:', error);
      res.status(500).json({ error: 'Error al obtener el detalle de asistencias de la cuadrilla' });
  }
});

/*
router.delete('/eliminar-asistencia/:idAsistencia/:fechasCoinciden/:fechaHoy', async (req, res) => {
  try {
    const { idAsistencia, fechasCoinciden, fechaHoy } = req.params;

    // Eliminar el registro de asistencia de la tabla asistencias_cuadrilla
    await pool.query(`
      DELETE FROM asistencias_cuadrilla
      WHERE id = ?
    `, [idAsistencia]);

    if(fechasCoinciden){
      await pool.query(`DELETE FROM datos_localstorage WHERE id_asistencia_cuadrilla = ? AND  fecha = ?`, [idAsistencia, fechaHoy]);
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('Error al eliminar la asistencia:', error);
    res.status(500).json({ error: 'Error al eliminar la asistencia' });
  }
});*/


























/********************************************************** RUTAS CORRESPONDIENTES A LAS ASISTENCIAS DIARIAS ********************************************************************************************** */
router.get('/crearAsistencia', async(req, res) =>{
    try{
        const [result] = await pool.query('SELECT * FROM empleados');
        res.render('asistencia', {empleados: result});

    }catch(err){
        //Aqui obtenemos todos los errores o excepciones que se obtengan en formato json
        res.status(500).json({message:err.message});
    }
});

router.get('/asistenciaPost', async(req, res) =>{
    try{
        const [result_fecha] = await pool.query('SELECT fecha_asistencia FROM asistencias');
        const total_registros = result_fecha.length;
        const fecha = Intl.DateTimeFormat('en-CA', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          }).format(result_fecha[total_registros-1].fecha_asistencia);
          console.log(fecha);
        const [empleados] = await pool.query(`SELECT * FROM empleados WHERE fecha_creacion < ?`, [fecha]);
        const [asistencias] = await pool.query(`SELECT id FROM asistencias WHERE fecha_asistencia = ?`, [fecha]);
        const [empleadosAsistidos] = await pool.query(`SELECT e.id, e.nombre, e.apellido_paterno, da.id AS id_detalle FROM empleados e INNER JOIN detalle_asistencias da ON da.id_empleado = e.id
        INNER JOIN asistencias a ON a.id = da.id_asistencia WHERE da.asistencia = 1 AND da.hora_entrada = '10:00' AND a.fecha_asistencia = ?`, [fecha]);

        const resultado = {
            empleados,
            asistencias,
            empleadosAsistidos
        }

        res.render('asistencia', resultado);

    }catch(err){
        //Aqui obtenemos todos los errores o excepciones que se obtengan en formato json
        res.status(500).json({message:err.message});
    }



});

router.post('/crearAsistencia', async(req, res) =>{

    try{
        function generateDateString(date = new Date()) {
            return new Intl.DateTimeFormat('en-CA', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit'
            }).format(date);
          }
        const fecha_asistencia = String(generateDateString());
        const [result] = await pool.query(`INSERT INTO asistencias SET fecha_asistencia = '${fecha_asistencia}'`);
        const idAsistencia = result.insertId;
        const horaEntrada = "10:00";
        const fechaHora = Date.parse(`01/01/2023 ${horaEntrada}`);
        const fechaHoraFormateada = new Date(fechaHora);
        const fechaFinal = Intl.DateTimeFormat('es-ES', {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
          }).format(fechaHoraFormateada);
          console.log(fechaFinal);
        const asistencias = req.body;
        for(let idEmpleado in asistencias){
            const asistencia = asistencias[idEmpleado];
            let hora = (asistencia == 1) ? `'${horaEntrada}'` : "''";
            await pool.query(`INSERT INTO detalle_asistencias (id_asistencia, id_empleado, asistencia, hora_entrada) VALUES(${idAsistencia}, ${idEmpleado}, ${asistencia}, ${hora})`);
        }
       
        

    }catch(err){
        res.status(500).json({message:err.message});
    }

    res.redirect('/asistenciaPost');

});

router.post('/crearAsistenciaTardia', async(req, res) =>{

    try{
        function generateDateString(date = new Date()) {
            return new Intl.DateTimeFormat('en-CA', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit'
            }).format(date);
          }
        const fecha_asistencia = String(generateDateString());
        const [result] = await pool.query(`INSERT INTO asistencias SET fecha_asistencia = '${fecha_asistencia}'`);
        const idAsistencia = result.insertId;
        const {asistencias,horarios} = req.body;
        console.log(asistencias);
        console.log(horarios);
        for(let idEmpleado in asistencias){
            const asistencia = asistencias[idEmpleado];
            console.log(asistencia);
            const hora = horarios[idEmpleado];   
            console.log(hora);
            await pool.query(`INSERT INTO detalle_asistencias (id_asistencia, id_empleado, asistencia, hora_entrada) VALUES(${idAsistencia}, ${idEmpleado}, ${asistencia}, '${hora}')`);
            await pool.query(`UPDATE detalle_asistencias SET hora_entrada = '' WHERE id_asistencia = ${idAsistencia} AND id_empleado = ${idEmpleado} AND asistencia = 0`);
        }
        res.render('asistencia');
        

    }catch(err){
        res.status(500).json({message:err.message});
    }

});

router.post('/terminarTurnoDiarioNormal', async (req, res) => {

    try {
   
     const {idAsistencia} = req.body;
     
     // 1. Obtener registros del día
     const [registrosDia] = await pool.query(`
       SELECT *
       FROM detalle_asistencias
       WHERE id_asistencia = ? AND asistencia = 1
     `, [idAsistencia]);
   
     // 2. Iterar cada registro  
     for(let registro of registrosDia) {
   
       const horaEntrada = registro.hora_entrada; // Ej. '10:30'
       const horaSalida = '18:00'; // Fin de jornada

       const horaInicio = Date.parse(`01/01/2023 ${horaEntrada}`);  
        const horaFin = Date.parse(`01/01/2023 ${horaSalida}`);
   
      // Calcular diferencia  
        const diffHoras = (horaFin - horaInicio) / 3600 / 1000;

        // Redondear a entero
        const horasEnteras = Math.round(diffHoras);

        // Actualizar 
        await pool.query(`
        UPDATE detalle_asistencias
        SET horas_laboradas = ? 
        WHERE id = ?
        `,[ 
        horasEnteras,
        registro.id 
        ]);
        
     }
   
     res.render('asistencia');
   
    } catch(error) {
     // manejo de errores  
    }
    
   });
   



router.post('/terminarTurnoDiarioCustom', async(req, res) => {

  try {
    
    const { idAsistencia } = req.body;
    const { horas } = req.body;

    // Obtener registros  
    const [registros] = await pool.query(`
        SELECT *
        FROM detalle_asistencias
        WHERE id_asistencia = ? 
    `, [idAsistencia]);

    registros.forEach(registro => {

      if(registro.asistencia === 0) {
         registro.horas_laboradas = null;

      } else if(horas[registro.id_empleado]) {     
         registro.horas_laboradas = horas[registro.id_empleado];

      } else {   

        const entrada = Date.parse(`01/01/2023 ${registro.hora_entrada}`);
        const salida = Date.parse('01/01/2023 18:00');
        const diferencia = salida - entrada;
        const horasLaboradas = diferencia / (1000 * 3600);
        registro.horas_laboradas = Math.floor(horasLaboradas);   
      }

      // Actualizar      
      pool.query(`
              UPDATE detalle_asistencias  
              SET horas_laboradas = ?
              WHERE id = ?
      `, [registro.horas_laboradas, registro.id]);

    });

    res.json({mensaje: 'OK'});

  } catch (error) {

  }

});



router.get('/obtenerJustificacionesDiarias', async (req,res) =>{

    const {idDetalle} = req.query;
    console.log('idDetalle desde obtenerJustificacionesDiarias: '+idDetalle);
    const [data] = await pool.query(`SELECT * FROM justificaciones_diarias WHERE id_detalle_asistencia = ${idDetalle}`);
    if(data.length > 0){
      console.log(data[0].motivo);
      res.json(data[0]);
    }else{
      res.sendStatus(404);
    } 


});

router.post('/establecerFaltas', async(req, res) =>{

  try{
    const {idEmpleado,fechaHoy} = req.body;
    
        const [result] = await pool.query(`SELECT da.id
            FROM detalle_asistencias da
            INNER JOIN asistencias a ON a.id = da.id_asistencia
            INNER JOIN empleados e ON e.id = da.id_empleado
            WHERE a.fecha_asistencia = '${fechaHoy}' 
              AND e.id = ${idEmpleado}`);

            const idDetalle = result[0].id;
            console.log(idDetalle);
            await pool.query(`INSERT INTO faltas_diarias(id_detalle_asistencia) VALUES(${idDetalle})`);

          res.render('asistencia');



  }catch(err){
    res.status(500).json({message:err.message});
  }




});


router.get('/mostrarAsistencias', async(req, res) =>{
   
        
    res.render('vista_asistencias_cuadrillas');

});



router.get('/mostrarDetalles/:id', async(req, res) =>{

    try{
        await pool.query(`SET lc_time_names = 'es_ES'`);
        const {id} = req.params;
        const [detalles] = await pool.query(`SELECT 
        e.nombre,
        e.apellido_paterno,
        e.apellido_materno,
        da.asistencia,
        a.id AS id_asistencia,
        da.id AS id_detalle,
        da.id_empleado,
        a.fecha_asistencia AS fechaAsistencia,
        DATE_FORMAT(a.fecha_asistencia, '%d de %M de %Y') AS fecha_asistencia,
        CASE WHEN da.asistencia = 0 THEN 'No asistió' ELSE da.hora_entrada END AS hora_entrada,
        CASE WHEN da.asistencia = 0 THEN 'No laboró' ELSE da.horas_laboradas END AS horas_laboradas,
        CASE 
            WHEN da.asistencia = 0 AND fd.id IS NOT NULL THEN 'Falta'
            WHEN da.asistencia = 0 AND jd.id IS NOT NULL THEN 'Falta Justificada'
            WHEN da.asistencia = 0 THEN 'Pendiente'
            ELSE 'Asistencia'
        END AS estado_asistencia,
        CASE 
            WHEN da.asistencia = 0 OR da.horas_laboradas <= 8 THEN 'Ninguna'
            ELSE CONCAT(da.horas_laboradas - 8, ' horas')
        END AS horas_extra
    FROM 
        empleados e
        INNER JOIN detalle_asistencias da ON da.id_empleado = e.id
        INNER JOIN asistencias a ON a.id = da.id_asistencia
        LEFT JOIN justificaciones_diarias jd ON jd.id_detalle_asistencia = da.id
        LEFT JOIN faltas_diarias fd ON fd.id_detalle_asistencia = da.id
    WHERE
        a.id = ? `, [id]);
        res.render('vista_detalles', {detalles});

    }catch(err){
        res.status(500).json({message:err.message}); 
    }
});

router.get('/asistencias', (req, res) => {
    const { fecha } = req.query;
  
    pool.query(`
    SELECT da.id_empleado, da.asistencia, a.id  
    FROM detalle_asistencias da
    INNER JOIN asistencias a ON a.id = da.id_asistencia
    WHERE a.fecha_asistencia = ?
    `, [fecha]).then(asistencias => {
        return res.json(asistencias[0]);
        });

  
  });

  router.put('/modificar-asistencias', async(req, res)=>{
        try{
            const {id, asistencias} = req.body;
            console.log(asistencias);
            console.log(id);
            for(let idEmpleado in asistencias){
                const asistencia = asistencias[idEmpleado];    
                await pool.query(`
                UPDATE detalle_asistencias  
                SET asistencia = ? 
                WHERE id_asistencia = ? AND id_empleado = ?
            `, [
              asistencia, 
              id, // id de cabecera  
              idEmpleado
            ]);
            }
           res.render('asistencia');
            
            
        }catch(err){
            res.status(500).json({message:err.message}); 
        }
  });


  router.delete('/deleteAsistencia/:id', async(req, res) =>{

        try{
            const {id} = req.params;
            await pool.query('DELETE FROM asistencias WHERE id = ?', [id]);
            res.render('vista_detalles');
        }catch(err){
            res.status(500).json({message:err.message});
        }


  });


/********************************************************** RUTAS CORRESPONDIENTES A LAS ASISTENCIAS SEMANALES ********************************************************************************************** */
  router.get('/asistenciaSemanal', async(req, res) =>{
    try{
        const [result] = await pool.query('SELECT * FROM empleados');
        res.render('asistencia_semana', {empleados: result});

    }catch(err){
        //Aqui obtenemos todos los errores o excepciones que se obtengan en formato json
        res.status(500).json({message:err.message});
    }

  });


  router.get('/asistenciaSemanalPost', async(req, res) =>{
    try{
        const [result_fecha] = await pool.query('SELECT fecha_inicio, fecha_fin FROM asistencias_semanales');
        const total_registros = result_fecha.length;
        console.log("Total registros de asistencias_semanales: "+result_fecha);
        const fecha_inicio = Intl.DateTimeFormat('en-CA', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          }).format(result_fecha[total_registros-1].fecha_inicio);
        
          const fecha_fin = Intl.DateTimeFormat('en-CA', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          }).format(result_fecha[total_registros-1].fecha_fin);

          console.log("Fecha inicio de la ruta asistenciassemanalespost: "+fecha_inicio);
          console.log("Fecha inicio de la ruta asistenciassemanalespost: "+fecha_fin);


        const [empleados] = await pool.query(`SELECT * FROM empleados WHERE fecha_creacion < ?`, [fecha_inicio]);
        const [asistencias] = await pool.query(`SELECT id FROM asistencias_semanales WHERE fecha_inicio = ? AND fecha_fin = ?`, [fecha_inicio, fecha_fin]); 
        const [empleadosAsistidos] = await pool.query(`SELECT e.id, e.nombre, e.apellido_paterno, da.lunes, da.martes, da.miercoles, da.jueves, da.viernes, da.sabado, 
        da.entrada_lunes, da.entrada_martes, da.entrada_miercoles, da.entrada_jueves, da.entrada_viernes, da.entrada_sabado FROM empleados e INNER JOIN detalle_asistencias_semanales da ON da.id_empleado = e.id
        INNER JOIN asistencias_semanales a ON a.id = da.id_semanal WHERE a.fecha_inicio = ? AND a.fecha_fin = ? AND ((da.lunes = 1 AND da.entrada_lunes = '10:00') OR (da.martes = 1 AND da.entrada_martes = '10:00')
        OR (da.miercoles = 1 AND da.entrada_miercoles = '10:00') OR (da.jueves = 1 AND da.entrada_jueves = '10:00') OR (da.viernes = 1 AND da.entrada_viernes = '10:00')
        OR (da.sabado = 1 AND da.entrada_sabado = '10:00'))`, [fecha_inicio, fecha_fin]); 

        const resultado = {
            empleados,
            asistencias,
            empleadosAsistidos
        }

        res.render('asistencia_semana', resultado);

    }catch(err){
        //Aqui obtenemos todos los errores o excepciones que se obtengan en formato json
        res.status(500).json({message:err.message});
    }

  });


  router.post('/crearAsistenciaSemanal', async(req, res) =>{
    try{
        const hoy = new Date();

        const diaSemana = hoy.getDay();

        const fechaInicio = new Date(
            hoy.getFullYear(),
            hoy.getMonth(),
            hoy.getDate() - diaSemana + 1

        );

        const fechaFin = new Date (
            fechaInicio.getFullYear(),
            fechaInicio.getMonth(),
            fechaInicio.getDate() + 5
        );

        const inicioSemana = Intl.DateTimeFormat('en-CA', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          }).format(fechaInicio);
        
        const finSemana = Intl.DateTimeFormat('en-CA', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          }).format(fechaFin);

        const [result] = await pool.query(`INSERT INTO asistencias_semanales SET fecha_inicio = '${inicioSemana}', fecha_fin = '${finSemana}'`);
        const idAsistencia = result.insertId;

        const asistencias_semanales = req.body;
        console.log(asistencias_semanales);
        Object.keys(asistencias_semanales).forEach(idEmpleado =>{
            const registroAsistencia = asistencias_semanales[idEmpleado];
            console.log(registroAsistencia);
        
            Object.keys(registroAsistencia).forEach(async id =>{
                const asistenciaEmpleado = registroAsistencia[id];
                let arreglo = [];
                asistenciaEmpleado.forEach(dia =>{
                    arreglo.push(dia);
                });

                const asistenciasPorDia = arreglo.reduce((obj, asistencia) => {
                    obj[asistencia.dia] = asistencia.valorAsistencia
                    return obj
                  }, {})
                console.log(idAsistencia);
                console.log(id);
                console.log(asistenciasPorDia.lunes);

                await pool.query(`INSERT INTO detalle_asistencias_semanales (id_semanal, id_empleado, lunes, martes, miercoles, jueves, viernes, sabado)
                VALUES (?,?,?,?,?,?,?,?)`, [idAsistencia, id, asistenciasPorDia.lunes, asistenciasPorDia.martes, asistenciasPorDia.miercoles, asistenciasPorDia.jueves, asistenciasPorDia.viernes, asistenciasPorDia.sabado]);
            
                // Actualizar los valores de entrada en la tabla detalle_asistencias_semanales
                await pool.query(`UPDATE detalle_asistencias_semanales SET entrada_lunes = ?, entrada_martes = ?, entrada_miercoles = ?, entrada_jueves = ?, entrada_viernes = ?, entrada_sabado = ? WHERE id_semanal = ? AND id_empleado = ?`,
                [
                    asistenciasPorDia.lunes === 1 ? '10:00' : null,
                    asistenciasPorDia.martes === 1 ? '10:00' : null,
                    asistenciasPorDia.miercoles === 1 ? '10:00' : null,
                    asistenciasPorDia.jueves === 1 ? '10:00' : null,
                    asistenciasPorDia.viernes === 1 ? '10:00' : null,
                    asistenciasPorDia.sabado === 1 ? '10:00' : null,
                    idAsistencia,
                    id
                ]);


            });
        });

        res.render('asistencia_semana');
        
    }catch(err){
        //Aqui obtenemos todos los errores o excepciones que se obtengan en formato json
        res.status(500).json({message:err.message});
    }

  });

  router.post('/crearAsistenciaSemanalTardia', async(req, res) =>{

        try{
        // Fechas inicio / fin semana
        const hoy = new Date();

        const diaSemana = hoy.getDay();

        const fechaInicio = new Date(
            hoy.getFullYear(),
            hoy.getMonth(),
            hoy.getDate() - diaSemana + 1

        );

        const fechaFin = new Date (
            fechaInicio.getFullYear(),
            fechaInicio.getMonth(),
            fechaInicio.getDate() + 5
        );

        const inicioSemana = Intl.DateTimeFormat('en-CA', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          }).format(fechaInicio);
        
        const finSemana = Intl.DateTimeFormat('en-CA', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          }).format(fechaFin);
        // Insertar cabecera
        const [result] = await pool.query(`INSERT INTO asistencias_semanales SET fecha_inicio = '${inicioSemana}', fecha_fin = '${finSemana}'`);
        const idAsistencia = result.insertId;

        // Extraer asistencias y horas
        const {asistencias_semanales,horarios} = req.body;
      

        console.log(asistencias_semanales);
        console.log(horarios);

        Object.keys(asistencias_semanales).forEach(idEmpleado =>{
            const registroAsistencia = asistencias_semanales[idEmpleado];
            console.log(registroAsistencia);
            Object.keys(registroAsistencia).forEach(async id =>{
                const asistenciaEmpleado = registroAsistencia[id];
                let arreglo = [];
                asistenciaEmpleado.forEach(dia =>{
                    arreglo.push(dia);
                });
                const asistenciasPorDia = arreglo.reduce((obj, asistencia) => {
                    obj[asistencia.dia] = asistencia.valorAsistencia
                    return obj
                  }, {})
                console.log(idAsistencia);
                console.log(id);
                console.log(asistenciasPorDia.lunes);

                await pool.query(`INSERT INTO detalle_asistencias_semanales (id_semanal, id_empleado, lunes, martes, miercoles, jueves, viernes, sabado)
                VALUES (?,?,?,?,?,?,?,?)`, [idAsistencia, id, asistenciasPorDia.lunes, asistenciasPorDia.martes, asistenciasPorDia.miercoles, asistenciasPorDia.jueves, asistenciasPorDia.viernes, asistenciasPorDia.sabado]);
            
                
            });
        });

        for (let idEmpleado in horarios) {
            const registroHorarios = horarios[idEmpleado];
        
            for (let eId in registroHorarios) {
                await pool.query(`UPDATE detalle_asistencias_semanales SET entrada_lunes = ?, entrada_martes = ?, entrada_miercoles = ?, entrada_jueves = ?, entrada_viernes = ?, entrada_sabado = ? WHERE id_semanal = ? AND id_empleado = ?`,
                [
                    registroHorarios[eId].lunes,
                    registroHorarios[eId].martes,
                    registroHorarios[eId].miercoles,
                    registroHorarios[eId].jueves,
                    registroHorarios[eId].viernes,
                    registroHorarios[eId].sabado,
                    idAsistencia,
                    eId
                ]);
            }
        }
        
        res.render('asistencia_semana');
    }catch (err) {
        // Responde con un mensaje de error
        res.status(500).json({ message: err.message });
    }


  });

  router.post('/terminarTurnoSemanalNormal', async(req, res) =>{

    try{
        const {idAsistencia} = req.body;
        await pool.query(`UPDATE detalle_asistencias_semanales 
        SET
          horas_lunes = CASE
            WHEN lunes = 1 AND entrada_lunes = '10:00' THEN 8
            WHEN lunes = 1 AND entrada_lunes > '10:00' THEN FLOOR((CAST('18:00' AS TIME) - CAST(entrada_lunes AS TIME))/10000)
            ELSE horas_lunes
          END,
          horas_martes = CASE
            WHEN martes = 1 AND entrada_martes = '10:00' THEN 8  
            WHEN martes = 1 AND entrada_martes > '10:00' THEN FLOOR((CAST('18:00' AS TIME) - CAST(entrada_martes AS TIME))/10000)
            ELSE horas_martes
          END,
          horas_miercoles = CASE
            WHEN miercoles = 1 AND entrada_miercoles = '10:00' THEN 8
            WHEN miercoles = 1 AND entrada_miercoles > '10:00' THEN FLOOR((CAST('18:00' AS TIME) - CAST(entrada_miercoles AS TIME))/10000)
            ELSE horas_miercoles
          END,
          horas_jueves = CASE
            WHEN jueves = 1 AND entrada_jueves = '10:00' THEN 8
            WHEN jueves = 1 AND entrada_jueves > '10:00' THEN FLOOR((CAST('18:00' AS TIME) - CAST(entrada_jueves AS TIME))/10000)
            ELSE horas_jueves
          END,
          horas_viernes = CASE
            WHEN viernes = 1 AND entrada_viernes = '10:00' THEN 8
            WHEN viernes = 1 AND entrada_viernes > '10:00' THEN FLOOR((CAST('18:00' AS TIME) - CAST(entrada_viernes AS TIME))/10000)
            ELSE horas_viernes
          END,
          horas_sabado = CASE
            WHEN sabado = 1 AND entrada_sabado = '10:00' THEN 8
            WHEN sabado = 1 AND entrada_sabado > '10:00' THEN FLOOR((CAST('18:00' AS TIME) - CAST(entrada_sabado AS TIME))/10000)
            ELSE horas_sabado
          END
        WHERE id_semanal = ?`, [idAsistencia]);
        res.render('asistencia_semana');

    }catch(err){
        res.status(500).json({message:err.message});
    }


  });


  router.post('/terminarTurnoSemanalCustom', async(req, res) =>{
        try{
            const {idAsistencia, horas} = req.body;
            console.log(idAsistencia);
            console.log(horas)

            /***********************************************Logica Original*******************************************************/
            for(let idEmpleado in horas){
                console.log("Id del empleado: "+idEmpleado);
                console.log("Asistencia Lunes: "+horas[idEmpleado].lunes);
                console.log("Asistencia Martes: "+horas[idEmpleado].martes);
                console.log("Asistencia Miercoles: "+horas[idEmpleado].miercoles);
                console.log("Asistencia Jueves: "+horas[idEmpleado].jueves);
                console.log("Asistencia Viernes: "+horas[idEmpleado].viernes);
                console.log("Asistencia Sabado: "+horas[idEmpleado].sabado);

                const horaLunes = horas[idEmpleado].lunes;
                const horaMartes = horas[idEmpleado].martes;
                const horaMiercoles = horas[idEmpleado].miercoles;
                const horaJueves = horas[idEmpleado].jueves;
                const horaViernes = horas[idEmpleado].viernes;
                const horaSabado = horas[idEmpleado].sabado;


                await pool.query(`UPDATE detalle_asistencias_semanales SET horas_lunes = ?, horas_martes = ?, horas_miercoles = ?, horas_jueves = ?,
                horas_viernes = ?, horas_sabado = ? WHERE id_semanal = ? AND id_empleado = ?`, [horaLunes, horaMartes, horaMiercoles, horaJueves,
                horaViernes, horaSabado, idAsistencia, idEmpleado]);


                
            }

            await pool.query(`UPDATE detalle_asistencias_semanales 
            SET
              horas_lunes = CASE
                WHEN lunes = 0 THEN NULL
                WHEN lunes = 1 AND entrada_lunes > '10:00' THEN FLOOR((CAST('18:00' AS TIME) - CAST(entrada_lunes AS TIME))/10000)
                ELSE horas_lunes
              END,
              horas_martes = CASE
                WHEN martes = 0 THEN NULL  
                WHEN martes = 1 AND entrada_martes > '10:00' THEN FLOOR((CAST('18:00' AS TIME) - CAST(entrada_martes AS TIME))/10000)
                ELSE horas_martes
              END,
              horas_miercoles = CASE
                WHEN miercoles = 0 THEN NULL
                WHEN miercoles = 1 AND entrada_miercoles > '10:00' THEN FLOOR((CAST('18:00' AS TIME) - CAST(entrada_miercoles AS TIME))/10000)
                ELSE horas_miercoles
              END,
              horas_jueves = CASE
                WHEN jueves = 0 THEN NULL
                WHEN jueves = 1 AND entrada_jueves > '10:00' THEN FLOOR((CAST('18:00' AS TIME) - CAST(entrada_jueves AS TIME))/10000)
                ELSE horas_jueves
              END,
              horas_viernes = CASE
                WHEN viernes = 0 THEN NULL
                WHEN viernes = 1 AND entrada_viernes > '10:00' THEN FLOOR((CAST('18:00' AS TIME) - CAST(entrada_viernes AS TIME))/10000)
                ELSE horas_viernes
              END,
              horas_sabado = CASE
                WHEN sabado = 0 THEN NULL
                WHEN sabado = 1 AND entrada_sabado > '10:00' THEN FLOOR((CAST('18:00' AS TIME) - CAST(entrada_sabado AS TIME))/10000)
                ELSE horas_sabado
              END
            WHERE id_semanal = ?`, [idAsistencia])

            res.render('asistencia_semana');



        }catch(err){
            res.status(500).json({message:err.message});
        }

  });

  router.post('/justificarFaltasSemanales', async(req, res) =>{

    try{
        const {idEmpleado, dia, fechaInicio, fechaFin, motivo} = req.body;

        console.log("ID Empleado: "+idEmpleado);
        console.log("Dia: "+dia);
        console.log("Fecha de Inicio: "+fechaInicio);
        console.log("Fecha de Fin: "+fechaFin);
        console.log("Motivo: "+motivo);

        const [result] = await pool.query(`SELECT da.id
        FROM detalle_asistencias_semanales da
        INNER JOIN asistencias_semanales a ON a.id = da.id_semanal
        INNER JOIN empleados e ON e.id = da.id_empleado
        WHERE a.fecha_inicio = '${fechaInicio}' AND a.fecha_fin = '${fechaFin}' 
          AND e.id = ${idEmpleado}`);

        const idDetalle = result[0].id;

        console.log(idDetalle);

        await pool.query(`INSERT INTO justificaciones_semanales(id_detalle_asistencia_semanal, dia, motivo) VALUES(${idDetalle},'${dia}','${motivo}')`);

        res.render('asistencia');


    }catch(err){
        res.status(500).json({message:err.message});
    }
    



  });

  router.get('/consultarAsistenciaSemanal', async(req, res) =>{
        try{
            await pool.query(`SET lc_time_names = 'es_ES'`);
            const [asistenciasSemanales] = await pool.query(`SELECT CONCAT('Del ', DATE_FORMAT(fecha_inicio, '%d'), ' al ', DATE_FORMAT(fecha_fin, '%d de %M de %Y')) AS 'semanaAsistencia',
            a.id AS 'id_semanal',
            a.fecha_inicio AS 'fecha_inicio',
            a.fecha_fin AS 'fecha_fin',
            SUM(CASE WHEN lunes = 1 THEN 1 ELSE 0 END) AS 'Lunes',
            SUM(CASE WHEN martes = 1 THEN 1 ELSE 0 END) AS 'Martes',
            SUM(CASE WHEN miercoles = 1 THEN 1 ELSE 0 END) AS 'Miercoles', 
            SUM(CASE WHEN jueves = 1 THEN 1 ELSE 0 END) AS 'Jueves',
            SUM(CASE WHEN viernes = 1 THEN 1 ELSE 0 END) AS 'Viernes',
            SUM(CASE WHEN sabado = 1 THEN 1 ELSE 0 END) AS 'Sabado'
            FROM asistencias_semanales a
                INNER JOIN detalle_asistencias_semanales da
                ON a.id = da.id_semanal
            GROUP BY a.id;`);

            res.render('consultar_semana', {asistenciasSemanales});

        }catch(err){
            res.status(500).json({message:err.message});  
        }

      
  });

  router.get('/consultarDetalleAsistenciaSemanal/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const [detallesSemanales] = await pool.query(`SELECT CONCAT(e.nombre, ' ', e.apellido_paterno, ' ', e.apellido_materno) AS 'Nombre', da.id AS id_detalle,
      CASE WHEN GROUP_CONCAT(CASE WHEN js.dia = 'Lunes' THEN 'Falta Justificada' ELSE NULL END SEPARATOR ',') IS NOT NULL THEN GROUP_CONCAT(CASE WHEN js.dia = 'Lunes' THEN 'Falta Justificada' ELSE NULL END SEPARATOR ',') WHEN da.lunes = 0 THEN 'Falta' ELSE 'Asistencia' END AS 'Lunes',
      CASE WHEN GROUP_CONCAT(CASE WHEN js.dia = 'Martes' THEN 'Falta Justificada' ELSE NULL END SEPARATOR ',') IS NOT NULL THEN GROUP_CONCAT(CASE WHEN js.dia = 'Martes' THEN 'Falta Justificada' ELSE NULL END SEPARATOR ',') WHEN da.martes = 0 THEN 'Falta' ELSE 'Asistencia' END AS 'Martes',
      CASE WHEN GROUP_CONCAT(CASE WHEN js.dia = 'Miércoles' THEN 'Falta Justificada' ELSE NULL END SEPARATOR ',') IS NOT NULL THEN GROUP_CONCAT(CASE WHEN js.dia = 'Miércoles' THEN 'Falta Justificada' ELSE NULL END SEPARATOR ',') WHEN da.miercoles = 0 THEN 'Falta' ELSE 'Asistencia' END AS 'Miercoles',
      CASE WHEN GROUP_CONCAT(CASE WHEN js.dia = 'Jueves' THEN 'Falta Justificada' ELSE NULL END SEPARATOR ',') IS NOT NULL THEN GROUP_CONCAT(CASE WHEN js.dia = 'Jueves' THEN 'Falta Justificada' ELSE NULL END SEPARATOR ',') WHEN da.jueves = 0 THEN 'Falta' ELSE 'Asistencia' END AS 'Jueves',
      CASE WHEN GROUP_CONCAT(CASE WHEN js.dia = 'Viernes' THEN 'Falta Justificada' ELSE NULL END SEPARATOR ',') IS NOT NULL THEN GROUP_CONCAT(CASE WHEN js.dia = 'Viernes' THEN 'Falta Justificada' ELSE NULL END SEPARATOR ',') WHEN da.viernes = 0 THEN 'Falta' ELSE 'Asistencia' END AS 'Viernes',
      CASE WHEN GROUP_CONCAT(CASE WHEN js.dia = 'Sábado' THEN 'Falta Justificada' ELSE NULL END SEPARATOR ',') IS NOT NULL THEN GROUP_CONCAT(CASE WHEN js.dia = 'Sábado' THEN 'Falta Justificada' ELSE NULL END SEPARATOR ',') WHEN da.sabado = 0 THEN 'Falta' ELSE 'Asistencia' END AS 'Sabado',
      CASE WHEN da.lunes = 0 THEN 'No asistió' ELSE da.entrada_lunes END AS 'Entrada_Lunes',
      CASE WHEN da.martes = 0 THEN 'No asistió' ELSE da.entrada_martes END AS 'Entrada_Martes',
      CASE WHEN da.miercoles = 0 THEN 'No asistió' ELSE da.entrada_miercoles END AS 'Entrada_Miercoles',
      CASE WHEN da.jueves = 0 THEN 'No asistió' ELSE da.entrada_jueves END AS 'Entrada_Jueves',
      CASE WHEN da.viernes = 0 THEN 'No asistió' ELSE da.entrada_viernes END AS 'Entrada_Viernes',
      CASE WHEN da.sabado = 0 THEN 'No asistió' ELSE da.entrada_sabado END AS 'Entrada_Sabado',
      CASE WHEN da.lunes = 0 THEN 'No laboró' ELSE CONCAT(da.horas_lunes, ' horas') END AS 'Horas_Lunes',
      CASE WHEN da.martes = 0 THEN 'No laboró' ELSE CONCAT(da.horas_martes, ' horas') END AS 'Horas_Martes',
      CASE WHEN da.miercoles = 0 THEN 'No laboró' ELSE CONCAT(da.horas_miercoles, ' horas') END AS 'Horas_Miercoles',
      CASE WHEN da.jueves = 0 THEN 'No laboró' ELSE CONCAT(da.horas_jueves, ' horas') END AS 'Horas_Jueves',
      CASE WHEN da.viernes = 0 THEN 'No laboró' ELSE CONCAT(da.horas_viernes, ' horas') END AS 'Horas_Viernes',
      CASE WHEN da.sabado = 0 THEN 'No laboró' ELSE CONCAT(da.horas_sabado, ' horas') END AS 'Horas_Sabado',
      CASE WHEN da.lunes = 0 OR da.horas_lunes <= 8 THEN 'Ninguna' ELSE CONCAT(da.horas_lunes - 8, ' horas') END AS 'Horas_Extra_Lunes',
      CASE WHEN da.martes = 0 OR da.horas_martes <= 8 THEN 'Ninguna' ELSE CONCAT(da.horas_martes - 8, ' horas') END AS 'Horas_Extra_Martes',
      CASE WHEN da.miercoles = 0 OR da.horas_miercoles <= 8 THEN 'Ninguna' ELSE CONCAT(da.horas_miercoles - 8, ' horas') END AS 'Horas_Extra_Miercoles',
      CASE WHEN da.jueves = 0 OR da.horas_jueves <= 8 THEN 'Ninguna' ELSE CONCAT(da.horas_jueves - 8, ' horas') END AS 'Horas_Extra_Jueves',
      CASE WHEN da.viernes = 0 OR da.horas_viernes <= 8 THEN 'Ninguna' ELSE CONCAT(da.horas_viernes - 8, ' horas') END AS 'Horas_Extra_Viernes',
      CASE WHEN da.sabado = 0 OR da.horas_sabado <= 8 THEN 'Ninguna' ELSE CONCAT(da.horas_sabado - 8, ' horas') END AS 'Horas_Extra_Sabado'
      FROM detalle_asistencias_semanales da INNER JOIN empleados e ON da.id_empleado = e.id INNER JOIN asistencias_semanales a ON a.id = da.id_semanal LEFT JOIN justificaciones_semanales js ON js.id_detalle_asistencia_semanal = da.id WHERE a.id = ?
      GROUP BY da.id, e.nombre, e.apellido_paterno, e.apellido_materno, da.lunes, da.martes, da.miercoles, da.jueves, da.viernes, da.sabado, da.entrada_lunes, da.entrada_martes, da.entrada_miercoles, da.entrada_jueves, da.entrada_viernes, da.entrada_sabado, da.horas_lunes, da.horas_martes, da.horas_miercoles, da.horas_jueves, da.horas_viernes, da.horas_sabado`, [id]);
  
      res.render('registro_semanal', { detallesSemanales });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  router.get('/obtenerJustificacionesSemanales', async (req,res) =>{

    const {idDetalle, dia} = req.query;
    console.log('idDetalle desde obtenerJustificacionesDiarias: '+idDetalle);
    console.log('dia desde obtenerJustificacionesDiarias: '+dia);
    const [data] = await pool.query(`SELECT * FROM justificaciones_semanales WHERE id_detalle_asistencia_semanal = ${idDetalle} AND dia = '${dia}'`);
    if(data.length > 0){
      res.json(data[0]);
    }else{
      res.sendStatus(404);
    } 


});



  router.get('/asistenciasSemanalesRadios', (req, res)=>{

        const {fecha_inicio, fecha_fin} = req.query;
        console.log(fecha_inicio);
        pool.query(`SELECT
        e.id AS id_empleado,
        e.nombre AS nombre_empleado,
        da.id_semanal AS id_semanal,
        da.lunes AS asistencia_lunes,
        da.martes AS asistencia_martes,
        da.miercoles AS asistencia_miercoles,
        da.jueves AS asistencia_jueves,
        da.viernes AS asistencia_viernes,
        da.sabado AS asistencia_sabado
      FROM 
        detalle_asistencias_semanales AS da
        INNER JOIN empleados AS e
           ON da.id_empleado = e.id
        INNER JOIN asistencias_semanales AS a 
           ON a.id = da.id_semanal
      WHERE a.fecha_inicio = ? AND a.fecha_fin = ? GROUP BY e.id`, [fecha_inicio, fecha_fin]).then( result => {
            res.json(result[0]);
       });



  });

  router.post('/modificarAsistenciasSemanales', async(req, res) =>{

        try{
            const idSemana = req.body.idSemanal;
            console.log(idSemana);
            const asistenciasActualizadas = req.body.asistenciasSemanalesModificadas;
            console.log(asistenciasActualizadas);
            for(let idEmpleado in asistenciasActualizadas){
                console.log(idEmpleado);
                const nuevaAsistenciaLunes = asistenciasActualizadas[idEmpleado].lunes;
                console.log(nuevaAsistenciaLunes);
                const nuevaAsistenciaMartes = asistenciasActualizadas[idEmpleado].martes;
                console.log(nuevaAsistenciaMartes);
                const nuevaAsistenciaMiercoles = asistenciasActualizadas[idEmpleado].miercoles;
                console.log(nuevaAsistenciaMiercoles)
                const nuevaAsistenciaJueves= asistenciasActualizadas[idEmpleado].jueves;
                console.log(nuevaAsistenciaJueves);
                const nuevaAsistenciaViernes = asistenciasActualizadas[idEmpleado].viernes;
                console.log(nuevaAsistenciaViernes)
                const nuevaAsistenciaSabado = asistenciasActualizadas[idEmpleado].sabado;
                console.log(nuevaAsistenciaSabado);

                await pool.query(`UPDATE detalle_asistencias_semanales SET lunes = ?, martes = ?, miercoles = ?,
                jueves = ?, viernes = ?, sabado = ? WHERE id_semanal = ? AND id_empleado = ?`, [nuevaAsistenciaLunes, nuevaAsistenciaMartes, nuevaAsistenciaMiercoles, nuevaAsistenciaJueves, nuevaAsistenciaViernes, nuevaAsistenciaSabado, idSemana, idEmpleado]);
                
            }

            res.render('asistencia_semana');
        }catch(err){
            res.status(500).json({message:err.message});
        }




  });


  router.delete('/deleteAsistenciaSemanal/:id', async(req, res) =>{

    try{
        const {id} = req.params;
        await pool.query('DELETE FROM asistencias_semanales WHERE id = ?', [id]);
        res.render('consultar_semana');
    }catch(err){
        res.status(500).json({message:err.message});
    }


});


export default router;