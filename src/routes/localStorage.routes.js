import {Router} from 'express'
import pool from '../database.js'

const router = Router();

router.get('/bitacora', async (req, res) =>{

  res.render('bitacora')

}); 


router.get('/sincronizar-data', async (req, res) =>{

    const {llave} = req.query;
    console.log("LLave: "+llave);
    const [data] = await pool.query(`SELECT * FROM datos_localstorage WHERE llave = '${llave}'`);
    console.log(data[0]);
    if(data.length > 0){
        console.log(data[0].valor);
        res.json(data[0]);
    }else{
        res.sendStatus(404);
    }


}); 

router.post('/crearItem', async  (req, res) =>{

    try{
        const {llave, valor} = req.body;
        console.log(llave);
        await pool.query(`INSERT INTO datos_localstorage (llave, valor) VALUES ('${llave}', '${valor}')`);
        res.sendStatus(200);


    }catch(err){
        res.status(500).json({message:err.message});
    }

});

router.post('/updateItem', async (req, res) =>{

    try{
        const {llave, valor} = req.body;
        await pool.query(`UPDATE datos_localstorage SET valor = '${valor}' WHERE llave = '${llave}'`);
        res.sendStatus(200);

    }catch(err){
        res.status(500).json({message:err.message});
    }


});

router.delete('/deleteItem/:llave', async (req, res) =>{

    try{
        const {llave} = req.params;
        await pool.query('DELETE FROM datos_localstorage WHERE llave = ?', [llave]);
        res.sendStatus(200);

    }catch(err){
        res.status(500).json({message:err.message});
    }

}); 

// Ruta para obtener la fecha de la última asistencia guardada
router.get('/obtener-fecha-ultima-asistencia/:idAsistenciaCuadrilla', async (req, res) => {
  try {
    const { idAsistenciaCuadrilla } = req.params;
    const [rows] = await pool.query(`SELECT valor FROM datos_localstorage WHERE llave = "fechaUltimaAsistencia_${idAsistenciaCuadrilla}"`);
    const fechaUltimaAsistencia = rows[0]?.valor || null;
    res.json({ fechaUltimaAsistencia });
  } catch (error) {
    console.error('Error al obtener la fecha de la última asistencia:', error);
    res.status(500).json({ error: 'Error al obtener la fecha de la última asistencia' });
  }
});

// Ruta para guardar la fecha de la última asistencia
router.post('/guardar-fecha-ultima-asistencia', async (req, res) => {
  try {
    const { llave, valor, idAsistenciaCuadrilla} = req.body;
    await pool.query('INSERT INTO datos_localstorage (llave, valor, id_asistencia_cuadrilla, fecha) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE valor = ?', [llave, valor, idAsistenciaCuadrilla, valor, valor]);
    res.sendStatus(200);
  } catch (error) {
    console.error('Error al guardar la fecha de la última asistencia:', error);
    res.status(500).json({ error: 'Error al guardar la fecha de la última asistencia' });
  }
});


router.post('/guardar-asistencia-cuadrilla', async (req, res) => {
  try {
    const { llave, valor, idAsistenciaCuadrilla, fechaAsistencia } = req.body;
    await pool.query('INSERT INTO datos_localstorage (llave, valor, id_asistencia_cuadrilla, fecha) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE valor = ?', [llave, valor, idAsistenciaCuadrilla, fechaAsistencia, valor]);
    res.sendStatus(200);
  } catch (error) {
    console.error('Error al guardar la asistencia de la cuadrilla:', error);
    res.status(500).json({ error: 'Error al guardar la asistencia de la cuadrilla' });
  }
});


router.post('/guardar-ultima-asistencia-cuadrilla', async (req,res) =>{
  try{
    const {llave, valor, idAsistenciaCuadrilla} = req.body;
    await pool.query('INSERT INTO datos_localstorage (llave, valor, id_asistencia_cuadrilla, fecha) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE valor = ?', [llave, valor, idAsistenciaCuadrilla, valor, valor]);
    res.sendStatus(200);
  }catch(error){
    console.error('Error al guardar la ultima asistencia de la cuadrilla', error);
    res.status(500).json({ error: 'Error al guardar la ultima asistencia de la cuadrilla' });
  }
});


router.get('/obtener-ultima-asistencia-cuadrilla/:idCuadrilla', async (req, res) =>{
  try{

    const { idCuadrilla } = req.params;

    const [rows] = await pool.query(`SELECT valor FROM datos_localstorage WHERE llave = "ultimaAsistenciaCuadrilla_${idCuadrilla}"`);

    const fechaUltimaAsistenciaCuadrilla = rows[0]?.valor || null;

    res.json({fechaUltimaAsistenciaCuadrilla});
    
  }catch(error) {
    console.error('Error al obtener la ultima asistencia de la cuadrilla:', error);
    res.status(500).json({ error: 'Error al obtener la ultima asistencia de la cuadrilla' });
  }

});



  
router.get('/obtener-asistencia-cuadrilla', async (req, res) => {
  try {
    const idCuadrilla = req.query.idCuadrilla;
    const idAsistenciaCuadrilla = req.query.idAsistenciaCuadrilla;
    console.log(idCuadrilla);
    const [rows] = await pool.query(`SELECT valor FROM datos_localstorage WHERE llave = "asistenciaCuadrilla_${idAsistenciaCuadrilla}" AND valor = ?`, [idCuadrilla]);
    console.log(rows);
    const asistenciaCuadrilla = rows[0]?.valor || null;
    console.log(asistenciaCuadrilla);
    res.json({ asistenciaCuadrilla });
  } catch (error) {
    console.error('Error al obtener la asistencia de la cuadrilla:', error);
    res.status(500).json({ error: 'Error al obtener la asistencia de la cuadrilla' });
  }
});

router.delete('/eliminar-fecha-ultima-asistencia/:idAsistenciaCuadrilla', async (req, res) => {
  try {
    const { idAsistenciaCuadrilla} = req.params;
    await pool.query(`DELETE FROM datos_localstorage WHERE llave = "fechaUltimaAsistencia_${idAsistenciaCuadrilla}"`);
    res.sendStatus(200);
  } catch (error) {
    console.error('Error al eliminar la fecha de la última asistencia:', error);
    res.status(500).json({ error: 'Error al eliminar la fecha de la última asistencia' });
  }
});

router.delete('/eliminar-ultima-asistencia-cuadrilla/:idCuadrilla', async (req, res) =>{
    try{

      const {idCuadrilla} = req.params;

      await pool.query(`DELETE FROM datos_localstorage WHERE llave = "ultimaAsistenciaCuadrilla_${idCuadrilla}"`);
      res.sendStatus(200);
    }catch(error){
      console.error('Error al eliminar la ultima asistencia de la cuadrilla:', error);
      res.status(500).json({ error: 'Error al eliminar la ultima asistencia de la cuadrilla' });
    }
})

router.delete('/eliminar-asistencia-cuadrilla/:idAsistenciaCuadrilla', async (req, res) => {
  try {
    const { idAsistenciaCuadrilla} = req.params;
    await pool.query(`DELETE FROM datos_localstorage WHERE llave = "asistenciaCuadrilla_${idAsistenciaCuadrilla}"`).catch();
    await pool.query(`DELETE FROM datos_localstorage WHERE llave = "justificacionesEmpleados_${idAsistenciaCuadrilla}"`).catch();
    await pool.query(`DELETE FROM datos_localstorage WHERE llave = "faltasEmpleados_${idAsistenciaCuadrilla}"`).catch();
    await pool.query(`DELETE FROM datos_localstorage WHERE llave = "faltasPendientes_${idAsistenciaCuadrilla}"`).catch();
    await pool.query(`DELETE FROM datos_localstorage WHERE llave = "idDetallesCuadrilla_${idAsistenciaCuadrilla}"`).catch();
    await pool.query(`DELETE FROM datos_localstorage WHERE llave = "terminarTurno_${idAsistenciaCuadrilla}"`).catch();
  
    res.sendStatus(200);
  } catch (error) {
    console.error('Error al eliminar la asistencia de la cuadrilla:', error);
    res.status(500).json({ error: 'Error al eliminar la asistencia de la cuadrilla' });
  }
});


export default router;