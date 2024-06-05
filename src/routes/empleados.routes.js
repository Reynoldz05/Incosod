import {Router} from 'express'
import pool from '../database.js'

const router = Router();

router.get('/mostrar', async(req, res) => {
  try {
    await pool.query(`SET lc_time_names = 'es_ES'`);
    const [result] = await pool.query(`
      SELECT 
        e.id,
        e.nombre,
        e.apellido_paterno,
        e.apellido_materno,
        e.telefono,
        p.puesto,
        CASE WHEN e.NSS IS NULL THEN 'No Tiene' ELSE e.NSS END AS nss,
        CASE WHEN e.Infonavit IS NULL THEN 'No Tiene' ELSE e.Infonavit END AS infonavit,
        e.salario,
        DATE_FORMAT(e.fecha_creacion, '%d de %M de %Y') AS fecha_ingreso
      FROM 
        empleados e
      JOIN 
        puestos p ON e.id_puesto = p.id
      ORDER BY e.id ASC
    `);
    
    res.render('empleados', { empleados: result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get('/obtener-empleado/:id', async (req, res) => {
    const empleadoId = req.params.id;
  
    try {
      const [empleado] = await pool.query('SELECT * FROM empleados WHERE id = ?', [empleadoId]);
  
      if (empleado.length === 0) {
        return res.status(404).json({ message: 'Empleado no encontrado' });
      }
  
      res.json({ empleado: empleado[0] });
    } catch (error) {
      console.error('Error al obtener la información del empleado:', error);
      res.status(500).json({ message: 'Error al obtener la información del empleado' });
    }
  });


router.get('/mostrarEmpleados', async(req, res) =>{

    try{
        const [result] = await pool.query(`SELECT id,nombre,apellido_paterno,apellido_materno,telefono,id_puesto,
        CASE WHEN NSS IS NULL THEN 'No Tiene' ELSE NSS END AS nss,
        CASE WHEN Infonavit IS NULL THEN 'No Tiene' ELSE Infonavit END AS infonavit,
        salario,fecha_creacion FROM empleados`);
        
        res.json({empleados: result});

    }catch(err){
        //Aqui obtenemos todos los errores o excepciones que se obtengan en formato json
        res.status(500).json({message:err.message});
    }

    
});


router.get('/crear', async(req, res) =>{
        const [empleados] = await pool.query(`SELECT id,nombre,apellido_paterno,apellido_materno,telefono,puesto,
        CASE WHEN NSS IS NULL THEN 'No Tiene' ELSE NSS END AS nss,
        CASE WHEN Infonavit IS NULL THEN 'No Tiene' ELSE Infonavit END AS infonavit,
        salario,fecha_creacion FROM empleados`)
        res.render('empleados', {empleados});
    });

    
 
    router.get('/edit/:id', async (req, res) => {
      try {
        const { id } = req.params;
        const [empleado] = await pool.query(`
          SELECT e.*, p.puesto, p.sueldo
          FROM empleados e
          JOIN puestos p ON e.id_puesto = p.id
          WHERE e.id = ?
        `, [id]);
        const empleadoEdit = empleado[0];
        return res.json({ empleado: empleadoEdit });
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    });

    // Ruta para obtener todos los puestos
    router.get('/puestos', async (req, res) => {
        try {
        const [result] = await pool.query('SELECT * FROM puestos');
        res.json({ puestos: result });
        } catch (err) {
        res.status(500).json({ message: err.message });
        }
  });
  
  // Ruta para crear un nuevo puesto
    router.post('/puestos', async (req, res) => {
        try {
        const { puesto, sueldo } = req.body;
        function generateDateString(date = new Date()) {
            return new Intl.DateTimeFormat('en-CA', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit'
            }).format(date);
          }
        const fecha_agregado = String(generateDateString());
        await pool.query('INSERT INTO puestos (puesto, sueldo, fecha_agregado) VALUES (?, ?, ?)', [puesto, sueldo, fecha_agregado]);
        res.sendStatus(201);
        } catch (err) {
        res.status(500).json({ message: err.message });
        }
  });


  // Ruta para modificar un puesto
router.put('/puestos/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { puesto, sueldo } = req.body;
      console.log('Puesto: ',puesto);
      console.log('Sueldo: ',sueldo);
      await pool.query('UPDATE puestos SET puesto = ?, sueldo = ? WHERE id = ?', [puesto, sueldo, id]);
      res.sendStatus(200);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  // Ruta para eliminar un puesto
  router.delete('/puestos/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await pool.query('DELETE FROM puestos WHERE id = ?', [id]);
      res.sendStatus(200);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });



    // Ruta para obtener los puestos disponibles
  router.get('/obtener-puestos', async (req, res) => {
    try {
      const [puestos] = await pool.query('SELECT id, puesto, sueldo FROM puestos');
      res.json({ puestos });
    } catch (error) {
      console.error('Error al obtener los puestos:', error);
      res.status(500).json({ message: 'Error al obtener los puestos' });
    }
  });
    
export default router;