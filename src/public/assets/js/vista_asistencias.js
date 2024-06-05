const btnEliminar = document.querySelectorAll('.eliminarAsistencia');

let value = 0;
let horasAsignadas = "";
let justificacionesDiarias = [];
let faltasDiarias = [];
    async function fetchFechaModificacion() {
      try{
        const respuesta = await fetch('/sincronizar-data?llave=fechaModificacion');
      
        const datos = await respuesta.json();
        
        if(datos){
        
          const {valor} = datos;
      
          console.log("Fecha modificacion: "+valor);
      
          value = valor;
      
        } else {
        
          console.error('No se encontró dato');
        
        }
      } catch (err) {

        console.error(err);
      }
    

    }

    async function fetchHorasAsignadas() {

      try{
        const respuesta = await  fetch('/sincronizar-data?llave=HorasAsignadas');
        const datos = await respuesta.json();

        if(datos){
          const {valor} =  datos;

          console.log("Horas Asignadas: "+valor);
          horasAsignadas = valor;
        }else {
        
          console.error('No se encontró dato');
        
        }


      }catch(err){
        console.error(err);
      }

    }

    async function fetchJustificaciones(){

      try{

        const respuesta =  await fetch('/sincronizar-data?llave=Justificaciones');
        const datos = await respuesta.json();

        if(datos){
          const {valor} = datos;
          justificacionesDiarias = valor;
        }else{
          console.error('No se encontró dato');
        }

      }catch(err){
        console.error(err);
      }

    }


    async function fetchFaltas(){

      try{

        const respuesta =  await fetch('/sincronizar-data?llave=Faltas');
        const datos = await respuesta.json();

        if(datos){
          const {valor} = datos;
          console.log(valor);
          faltasDiarias = valor;
          
        }else{
          console.error('No se encontró dato');
        }

      }catch(err){
        console.error(err);
      }

    }


 async function abrirEliminar(e){
    e.preventDefault();
    const idAsistencia = e.target.dataset.id;
    const fechaOrigen = e.target.id;
    const fechaAsistencia = Date.parse(fechaOrigen, "dd 'de' MMMM 'de' yyyy");
    const fechaFormateada = new Intl.DateTimeFormat('en-CA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).format(fechaAsistencia);
    console.log(fechaFormateada);
    console.log("Dato global DB: "+value);
    console.log("Dato global horas asignadas: "+horasAsignadas);
    console.log("Array de Justificaciones desde DB: "+justificacionesDiarias);
    console.log("Array de faltas diarias desde DB: "+faltasDiarias);
    try{
        Swal.fire({
            title: "¿Estas seguro?",
            text: "Esta acción es irreversible!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Eliminar asistencia"
        }).then(async (result) =>{
            if (result.isConfirmed) {
               
            
                if(value == fechaFormateada){
                  
                    const llave = "fechaModificacion";

                        await fetch(`/deleteItem/${llave}`, {
                        method: "DELETE" 
                        })
                        .then(res => {
                        // Verificar que se eliminó
                        if(res.ok) {
                            console.log("Item fechaModifiacion eliminado");
                            
                        }
                        })
                    if((horasAsignadas != "" && horasAsignadas != undefined) && horasAsignadas == "Asignado"){
                        const llave = "HorasAsignadas";

                        await fetch(`/deleteItem/${llave}`, {
                        method: "DELETE" 
                        })
                        .then(res => {
                        // Verificar que se eliminó
                        if(res.ok) {
                            console.log("Item HorasAsignadas eliminado");
                    
                        }
                        })
                    }
                    if(justificacionesDiarias != 0 && justificacionesDiarias != undefined && justificacionesDiarias != null && justificacionesDiarias != []){
                        const llave = "Justificaciones";

                        await fetch(`/deleteItem/${llave}`, {
                        method: "DELETE" 
                        })
                        .then(res => {
                        // Verificar que se eliminó
                        if(res.ok) {
                            console.log("Item Justificaciones eliminado");
                            
                        }
                        })
                        
                    }

                    if(faltasDiarias != 0 && faltasDiarias != undefined && faltasDiarias != null && faltasDiarias != []){
                        const llave = "Faltas";

                        await fetch(`/deleteItem/${llave}`, {
                        method: "DELETE" 
                        })
                        .then(res => {
                        // Verificar que se eliminó
                        if(res.ok) {
                            console.log("Item Faltas eliminado");
                            
                       
                        }
                        })
                        
                    }

                    if(localStorage.getItem('DivsRemovidos')){
                        localStorage.removeItem('DivsRemovidos');
                    }

                    if(localStorage.getItem('ArrayAsistencias')){
                        localStorage.removeItem('ArrayAsistencias');
                    }


                }
                    await fetch(`/deleteAsistencia/${idAsistencia}` ,{
                    method: 'DELETE'
                },
                
                Swal.fire({
                    title: "Borrado!",
                    text: "La asistencia se ha eliminado exitosamente.",
                    icon: "success"
                }).then(() => {
                    
                    window.location.reload();
                 })
                
                
                );


            }
        });

    }catch(err){
        console.error(err);
    }

}


(async () =>{

    await fetchFechaModificacion();
    await fetchHorasAsignadas();
    await fetchJustificaciones();
    await fetchFaltas();

    btnEliminar.forEach(btn => {

        btn.addEventListener('click', abrirEliminar);
    
    });

})();   
