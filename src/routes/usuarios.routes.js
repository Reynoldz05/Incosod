import {Router} from 'express';
import pool from '../database.js';
import bcrypt from 'bcrypt';


const router = Router();

router.get('/registrar-usuarios', async(req, res) =>{

    res.render('usuarios');
  });


// Ruta para obtener todos los usuarios
router.get('/obtener-usuarios', async (req, res) => {
  try {
    const [usuarios] = await pool.query(`
      SELECT u.id, u.alias, u.foto_perfil, u.id_empleado, e.nombre, e.apellido_paterno, e.apellido_materno
      FROM usuarios u
      JOIN empleados e ON u.id_empleado = e.id
    `);

    const usuariosFormateados = usuarios.map(usuario => ({
      id: usuario.id,
      id_empleado: usuario.id_empleado,
      alias: usuario.alias,
      fotoPerfil: usuario.foto_perfil,
      nombreCompleto: `${usuario.nombre} ${usuario.apellido_paterno} ${usuario.apellido_materno}`
    }));

    res.json(usuariosFormateados);
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
});



// Ruta para obtener los empleados disponibles
router.get('/mostrar-empleados-disponibles', async (req, res) => {
  try {
    const [empleados] = await pool.query(`
      SELECT e.id, e.nombre, e.apellido_paterno, e.apellido_materno
      FROM empleados e
      JOIN proyectos p ON e.id = p.id_empleado
      LEFT JOIN usuarios u ON e.id = u.id_empleado
      WHERE u.id IS NULL
      GROUP BY e.id
    `);
    res.json({ empleados });
  } catch (error) {
    console.error('Error al obtener los empleados disponibles:', error);
    res.status(500).json({ error: 'Error al obtener los empleados disponibles' });
  }
});

/*
router.delete('/eliminar-usuario/:empleadoId', async (req, res) => {
  try {
    const empleadoId = req.params.empleadoId;

    // Eliminar el usuario de la base de datos
    await pool.query('DELETE FROM usuarios WHERE id_empleado = ?', [empleadoId]);

    res.sendStatus(200);
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
    res.status(500).json({ error: 'Error al eliminar el usuario' });
  }
});*/


router.get('/obtener-datos-usuario/:idEmpleado', async (req, res) => {
  try {
    const idEmpleado = req.params.idEmpleado;

    const [usuario] = await pool.query(`
      SELECT u.alias, e.nombre, e.apellido_paterno, e.apellido_materno
      FROM usuarios u
      JOIN empleados e ON u.id_empleado = e.id
      WHERE u.id_empleado = ?
    `, [idEmpleado]);

    if (usuario) {
      res.json(usuario[0]);
    } else {
      res.status(404).json({ error: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error('Error al obtener los datos del usuario:', error);
    res.status(500).json({ error: 'Error al obtener los datos del usuario' });
  }
});


export default router;