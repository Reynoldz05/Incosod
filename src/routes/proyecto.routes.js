import {Router} from 'express'
import pool from '../database.js'

const router = Router();

router.get('/proyectos', async  (req, res) =>{

    try{

        const [result] = await pool.query(`SELECT * FROM empleados`);

        res.render('proyecto', {empleados: result});

    }catch(err){
        //Aqui obtenemos todos los errores o excepciones que se obtengan en formato json
        res.status(500).json({message:err.message});
    }


});

router.get('/obtener-encargados-disponibles', async (req, res) => {
  try {
    const [empleados] = await pool.query(`
      SELECT e.id, e.nombre, e.apellido_paterno, e.apellido_materno
      FROM empleados e
      LEFT JOIN detalle_cuadrillas dc ON e.id = dc.id_empleado
      WHERE dc.id IS NULL
    `);

    res.json({ empleados });
  } catch (error) {
    console.error('Error al obtener los empleados disponibles:', error);
    res.status(500).json({ error: 'Error al obtener los empleados disponibles' });
  }
}); 

router.get('/obtener-empleados-disponibles', async (req, res) => {
  try {
    const [empleados] = await pool.query(`
      SELECT e.id, e.nombre, e.apellido_paterno, e.apellido_materno
      FROM empleados e
      LEFT JOIN proyectos p ON e.id = p.id_empleado
      LEFT JOIN detalle_cuadrillas dc ON e.id = dc.id_empleado
      WHERE p.id IS NULL AND dc.id IS NULL
    `);

    res.json({ empleados });
  } catch (error) {
    console.error('Error al obtener los empleados disponibles:', error);
    res.status(500).json({ error: 'Error al obtener los empleados disponibles' });
  }
});

router.get('/obtener-proyectos', async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM proyectos ORDER BY id ASC');
      res.json(rows);
    } catch (error) {
      console.error('Error al obtener los proyectos:', error);
      res.status(500).json({ error: 'Error al obtener los proyectos' });
    }
  });


router.get('/obtener-proyectos-usuarios/:idUser', async(req, res) =>{

  const idUser = req.params.idUser;
  try {
    const [rows] = await pool.query(`SELECT * FROM proyectos WHERE id_empleado = ? ORDER BY id ASC`, [idUser]);
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener los proyectos:', error);
    res.status(500).json({ error: 'Error al obtener los proyectos' });
  }

})



  router.get('/obtener-detalles-proyecto', async (req, res) => {
    try {
        const proyectoId = req.query.id;
        //await pool.query(`SET lc_time_names = 'es_ES'`);
        // Realizar una consulta a la base de datos para obtener los detalles del proyecto, la cantidad de cuadrillas y el nombre del encargado
        const [rows] = await pool.query(`
          SELECT p.id, p.nombre, CONCAT(e.nombre, ' ', e.apellido_paterno, ' ', e.apellido_materno) AS nombre_encargado, p.fecha_inicio, p.fecha_fin, p.presupuesto_inicial, p.presupuesto_actual, p.descripcion, p.id_carpeta, p.id_imagen, COUNT(c.id) AS cantidad_cuadrillas
          FROM proyectos p
          LEFT JOIN cuadrillas c ON p.id = c.id_proyecto
          LEFT JOIN empleados e ON p.id_empleado = e.id
          WHERE p.id = ?
          GROUP BY p.id
        `, [proyectoId]);
        
        if (rows.length > 0) {
          const proyecto = rows[0];
          res.json(proyecto);
        } else {
          res.status(404).json({ error: 'Proyecto no encontrado' });
        }
      } catch (error) {
        console.error('Error al obtener los detalles del proyecto:', error);
        res.status(500).json({ error: 'Error al obtener los detalles del proyecto' });
      }
  });

  router.put('/actualizar-presupuesto-actual', async (req, res) => {
    try {
      const proyectoId = req.query.id;
      const presupuestoActual = parseFloat(req.query.presupuesto);
  
      // Validar que se proporcionen los parámetros necesarios
      if (!proyectoId || isNaN(presupuestoActual)) {
        return res.status(400).json({ success: false, message: 'Parámetros inválidos' });
      }
  
      // Actualizar el presupuesto actual en la base de datos
      const [result] = await pool.query('UPDATE proyectos SET presupuesto_actual = ? WHERE id = ?', [presupuestoActual, proyectoId]);
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Proyecto no encontrado' });
      }
  
      res.json({ success: true, message: 'Presupuesto actual actualizado correctamente' });
    } catch (error) {
      console.error('Error al actualizar el presupuesto actual:', error);
      res.status(500).json({ success: false, message: 'Error al actualizar el presupuesto actual' });
    }
  });

  router.get('/obtener-cuadrillas', async (req, res) => {
    try {
      const proyectoId = req.query.id;
  
      const [cuadrillas] = await pool.query(`
        SELECT c.id, c.nombre, COUNT(dc.id_empleado) AS cantidad_empleados, p.nombre AS nombre_proyecto
        FROM proyectos p, cuadrillas c 
        LEFT JOIN detalle_cuadrillas dc ON c.id = dc.id_cuadrilla
        WHERE c.id_proyecto = ?
        AND p.id = c.id_proyecto
        GROUP BY c.id
      `, [proyectoId]);
  
      res.json({ cuadrillas });
    } catch (error) {
      console.error('Error al obtener las cuadrillas:', error);
      res.status(500).json({ error: 'Error al obtener las cuadrillas' });
    }
  });

  // Ruta para obtener las cuadrillas de un proyecto
router.get('/obtenerCuadrillas/:idProyecto', async (req, res) => {
  try {
    const { idProyecto } = req.params;
    console.log(idProyecto);
    const [cuadrillas] = await pool.query('SELECT * FROM cuadrillas WHERE id_proyecto = ?', [idProyecto]);
    res.json(cuadrillas);
  } catch (error) {
    console.error('Error al obtener las cuadrillas:', error);
    res.status(500).json({ error: 'Error al obtener las cuadrillas' });
  }
});

// Ruta para obtener los empleados de una cuadrilla
router.get('/obtenerEmpleadosCuadrilla/:idCuadrilla', async (req, res) => {
  try {
    const { idCuadrilla } = req.params;
    const [empleados] = await pool.query(`
      SELECT e.id, e.nombre, e.apellido_paterno, e.apellido_materno
      FROM empleados e
      INNER JOIN detalle_cuadrillas dc ON e.id = dc.id_empleado
      WHERE dc.id_cuadrilla = ? ORDER BY e.id ASC
    `, [idCuadrilla]);
    res.json(empleados);
  } catch (error) {
    console.error('Error al obtener los empleados de la cuadrilla:', error);
    res.status(500).json({ error: 'Error al obtener los empleados de la cuadrilla' });
  }
});


  router.get('/obtener-empleados-cuadrilla', async (req, res) => {
    try {
      const cuadrillaId = req.query.id;
      console.log('CuadrillaID: ',cuadrillaId);
      const [empleados] = await pool.query(`
        SELECT e.id, e.nombre, e.apellido_paterno, e.apellido_materno, dc.id AS id_detalle
        FROM empleados e
        INNER JOIN detalle_cuadrillas dc ON e.id = dc.id_empleado
        WHERE dc.id_cuadrilla = ? 
      `, [cuadrillaId]);
      
      console.log(empleados);
      res.json({ empleados });
    } catch (error) {
      console.error('Error al obtener los empleados de la cuadrilla:', error);
      res.status(500).json({ error: 'Error al obtener los empleados de la cuadrilla' });
    }
  });

  router.get('/obtenerProyectos', async (req, res) => {
    try {
      const [proyectos] = await pool.query('SELECT id, nombre FROM proyectos');
      res.json({ proyectos });
    } catch (error) {
      console.error('Error al obtener los proyectos:', error);
      res.status(500).json({ error: 'Error al obtener los proyectos' });
    }
  });

  router.get('/obtener-proyectos-cuadrillas', async (req, res) => {
    try {
      const [proyectos] = await pool.query(`
        SELECT
          p.id AS id_proyecto,
          p.nombre AS nombre_proyecto,
          c.id AS id_cuadrilla,
          c.nombre AS nombre_cuadrilla,
          COUNT(dc.id_empleado) AS cantidad_empleados
        FROM
          proyectos p
          LEFT JOIN cuadrillas c ON p.id = c.id_proyecto
          LEFT JOIN detalle_cuadrillas dc ON c.id = dc.id_cuadrilla
        GROUP BY
          p.id, c.id
      `);
  
      res.json({ proyectos });
    } catch (error) {
      console.error('Error al obtener los proyectos y cuadrillas:', error);
      res.status(500).json({ error: 'Error al obtener los proyectos y cuadrillas' });
    }
  });

  router.get('/obtener-contratistas-proyecto', async (req, res) => {
    try {
      const proyectoId = req.query.id;
  
      const [contratistas] = await pool.query(`
        SELECT c.id, c.nombre, c.sueldo
        FROM contratistas c
        WHERE c.id_proyecto = ?
      `, [proyectoId]);
  
      res.json({ contratistas });
    } catch (error) {
      console.error('Error al obtener los contratistas del proyecto:', error);
      res.status(500).json({ error: 'Error al obtener los contratistas del proyecto' });
    }
  });


  // Ruta para guardar un contratista en un proyecto
router.post('/guardar-contratista-proyecto', async (req, res) => {
  try {
    const { nombre, sueldo, id_proyecto } = req.body;

    function generateDateString(date = new Date()) {
      return new Intl.DateTimeFormat('en-CA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).format(date);
    }
    const fecha_agregado = String(generateDateString());

    // Insertar el contratista en la tabla contratistas
      await pool.query(
      'INSERT INTO contratistas (id_proyecto, nombre, sueldo, fecha_agregado) VALUES (?, ?, ?, ?)',
      [id_proyecto, nombre, sueldo, fecha_agregado]
    );


    res.json({ success: true });
  } catch (error) {
    console.error('Error al guardar el contratista en el proyecto:', error);
    res.status(500).json({ error: 'Error al guardar el contratista en el proyecto' });
  }
});


router.get('/obtener-contratistas', async (req, res) => {
  try {
    const [contratistas] = await pool.query(`
      SELECT c.id, c.nombre, p.nombre AS nombre_proyecto, c.sueldo, c.fecha_agregado
      FROM contratistas c
      LEFT JOIN proyectos p ON c.id_proyecto = p.id
    `);

    res.json({ contratistas });
  } catch (error) {
    console.error('Error al obtener los contratistas:', error);
    res.status(500).json({ error: 'Error al obtener los contratistas' });
  }
});


router.put('/modificar-contratista', async (req, res) => {
  const id = req.query.id;
  const { nombre, sueldo } = req.body;

  try {
    await pool.query('UPDATE contratistas SET nombre = ?, sueldo = ? WHERE id = ?', [nombre, sueldo, id]);
    res.sendStatus(200);
  } catch (error) {
    console.error('Error al modificar al contratista:', error);
    res.sendStatus(500);
  }
});



  router.put('/mover-empleado-cuadrilla', async (req, res) => {
    try {
      const idEmpleado = req.query.idEmpleado;
      const idCuadrilla = req.query.idCuadrilla;
      const idCuadrillaActual = req.query.idCuadrillaActual;
      await pool.query('UPDATE detalle_cuadrillas SET id_cuadrilla = ? WHERE id_empleado = ? AND id = ?  ', [idCuadrilla, idEmpleado, idCuadrillaActual]);
  
      res.json({ success: true });
    } catch (error) {
      console.error('Error al mover al empleado a la cuadrilla:', error);
      res.status(500).json({ success: false, error: 'Error al mover al empleado a la cuadrilla' });
    }
  });


  router.put('/mover-contratista-proyecto', async (req, res) => {
    const contratistaId = req.query.contratistaId;
    const proyectoId = req.query.proyectoId;
  
    try {
      await pool.query('UPDATE contratistas SET id_proyecto = ? WHERE id = ?', [proyectoId, contratistaId]);
      res.sendStatus(200);
    } catch (error) {
      console.error('Error al mover al contratista:', error);
      res.sendStatus(500);
    }
  });


  router.delete('/eliminar-empleado-proyecto', async (req, res) => {
    try {
      const idEmpleado = req.query.idEmpleado;
      const idCuadrilla = req.query.idCuadrilla;
  
  
      // Eliminar el empleado de la tabla detalle_cuadrillas
      await pool.query('DELETE FROM detalle_cuadrillas WHERE id_empleado = ? AND id_cuadrilla = ?', [idEmpleado, idCuadrilla]);
  
      res.json({ success: true });
  
    } catch (error) {
      console.error('Error al eliminar al empleado del proyecto:', error);
      res.status(500).json({ success: false, error: 'Error al eliminar al empleado del proyecto' });
    }
  });


  router.delete('/eliminar-contratista-proyecto', async (req, res) => {
    const contratistaId = req.query.contratistaId;
  
    try {
      await pool.query('DELETE FROM contratistas WHERE id = ?', [contratistaId]);
      res.sendStatus(200);
    } catch (error) {
      console.error('Error al eliminar al contratista:', error);
      res.sendStatus(500);
    }
  });


  router.delete('/eliminar-cuadrilla', async (req, res) => {
    const cuadrillaId = req.query.id;
  
    try {
      // Lógica para eliminar el proyecto de la base de datos según el ID
      await pool.query('DELETE FROM cuadrillas WHERE id= ?', [cuadrillaId]);
  
      res.sendStatus(200);
    } catch (error) {
      console.error('Error al eliminar la cuadrilla:', error);
      res.sendStatus(500);
    }
  });


  router.delete('/eliminar-proyecto', async (req, res) => {
    const idProyecto = req.query.id;
  
    try {
      // Lógica para eliminar el proyecto de la base de datos según el ID
      await pool.query('DELETE FROM proyectos WHERE id= ?', [idProyecto]);
  
      res.sendStatus(200);
    } catch (error) {
      console.error('Error al eliminar el proyecto:', error);
      res.sendStatus(500);
    }
  });

  router.post('/asignar-empleados-cuadrilla', async (req, res) => {
    try {
      const { cuadrillaId, empleados } = req.body;
      console.log('Cuadrilla ID en la ruta de asignarEmpleadosCuadrilla: ',cuadrillaId);
      console.log('Empleados en la ruta de asignarEmpleadosCuadrilla: ',empleados);
      const result = await pool.query('INSERT INTO detalle_cuadrillas (id_cuadrilla, id_empleado) VALUES ?', [empleados.map(empleado => [cuadrillaId, empleado])]);
      res.json({ success: true });
    } catch (error) {
      console.error('Error al asignar empleados a la cuadrilla:', error);
      res.status(500).json({ error: 'Error al asignar empleados a la cuadrilla' });
    }
  });


  router.get('/verificar-nombre-cuadrilla', async (req, res) => {
    const { proyectoId, nombreCuadrilla } = req.query;
  
    try {
      const [existingCuadrilla] = await pool.query(
        'SELECT * FROM cuadrillas WHERE id_proyecto = ? AND nombre = ?',
        [proyectoId, nombreCuadrilla]
      );
  
      res.json({ exists: existingCuadrilla.length > 0 });
    } catch (error) {
      console.error('Error al verificar el nombre de la cuadrilla:', error);
      res.json({ exists: false });
    }
  });


  router.post('/crear-cuadrilla', async (req, res) => {
    const { proyectoId, nombreCuadrilla, empleadosAsignados } = req.body;
    
    try {
      // Crear la cuadrilla
      const [result] = await pool.query(
        'INSERT INTO cuadrillas (id_proyecto, nombre) VALUES (?, ?)',
        [proyectoId, nombreCuadrilla]
      );
  
      const cuadrillaId = result.insertId;
  
      // Asignar los empleados a la cuadrilla
      const values = empleadosAsignados.map(empleadoId => [cuadrillaId, empleadoId]);
      console.log(values);
      await pool.query(
        'INSERT INTO detalle_cuadrillas (id_cuadrilla, id_empleado) VALUES ?',
        [values]
      );
  
      res.json({ success: true });
    } catch (error) {
      console.error('Error al crear la cuadrilla:', error);
      res.json({ success: false, error: 'Error al crear la cuadrilla' });
    }
  });


export default router;