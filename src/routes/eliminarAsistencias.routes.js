import { Router } from 'express';
import pool from '../database.js';
import cron from 'node-cron';

const router = Router();

// Programar la tarea para que se ejecute todos los lunes a las 00:00 horas

//NOTA: Para fines de prueba se establecio el 4 para que se ejecute la tarea el jueves a las 00:00 horas (ya que esto se implemento un miercoles por la tarde xd)
cron.schedule('0 0 * * 1', async () => {
  try {
    // Eliminar las asistencias de la tabla asistencias_cuadrilla
    await pool.query('DELETE FROM asistencias_cuadrilla');
    console.log('Asistencias eliminadas correctamente');
  } catch (error) {
    console.error('Error al eliminar las asistencias:', error);
  }
});

export default router;