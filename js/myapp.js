//variables y selectores
const formulario = document.getElementById('agregar-gasto');
const gastosListado = document.querySelector('#gastos ul');

//eventos
eventListeners()
function eventListeners(){
  document.addEventListener('DOMContentLoaded', preguntarPresupuesto);

  formulario.addEventListener('submit',agregarGasto)
}

//clases
class Presupuesto {
  constructor(presupuesto){
    this.presupuesto = Number(presupuesto);
    this.restante = Number(presupuesto);
    this.gastos=[];
  }
  nuevoGasto(gasto){
    this.gastos = [...this.gastos,gasto];
    this.calcularRestante()
  }
  calcularRestante(){
    const gastado = this.gastos.reduce( (total, gasto) => total + gasto.cantidad, 0);
    this.restante = this.presupuesto-gastado;
  }
  eliminarGasto(id){
    this.gastos = this.gastos.filter( x => x.id !== id )

    console.log(`eliminar id: ${id} desde la clase`);
    this.calcularRestante()
  }
}
class UI {
  insertarPresupuesto(cantidad){
    const {presupuesto, restante} = cantidad
    document.querySelector('#total').textContent = presupuesto;
    document.querySelector('#restante').textContent = restante;
  }
  imprimirAlerta(mensaje, tipo){
    const alerta = document.createElement('p')
    alerta.classList.add('text-center', 'alert')
    alerta.textContent = mensaje;

    if(tipo==='error'){
      alerta.classList.add('alert-danger')
    } else {
      alerta.classList.add('alert-success')
  }
   document.querySelector('.primario').insertBefore(alerta,formulario)

   setTimeout( () => {
     alerta.remove()
   }, 3000 )
  }
  agregarGastoListado(gastos){
    this.limpiarHTML()
    gastos.forEach( gasto => {
      const { cantidad, nombre, id} = gasto
      const gastoNuevo = document.createElement('li');
      gastoNuevo.className = 'list-group-item d-flex justify-content-between align-items-center';
      gastoNuevo.dataset.id=id;

      gastoNuevo.innerHTML = `${nombre} <span class="badge badge-primary badge-pill">$ ${cantidad}</span>`;

      const btnBorrar = document.createElement('button')
      btnBorrar.classList.add('btn' ,'btn-danger', 'borrar-gasto');
      btnBorrar.innerHTML='Borrar &times'
      btnBorrar.onclick = ()=>{
        eliminarGasto(id);
      }
      gastoNuevo.appendChild(btnBorrar)

      gastosListado.appendChild(gastoNuevo);
    })
  }
  limpiarHTML(){
    while(gastosListado.firstChild){
      gastosListado.removeChild(gastosListado.firstChild)
    }
  }
  actualizarRestante(restante){
    document.querySelector('#restante').textContent = restante;
  }
  comprobarPresupuesto(presupuestoObj){
    const {presupuesto, restante} = presupuestoObj
    const divRestante = document.querySelector('.restante')

    if(presupuesto/4 > restante){
      divRestante.classList.remove('alert-success', 'alert-warning')
      divRestante.classList.add('alert-danger')
    } else if (presupuesto / 2 > restante){
      divRestante.classList.remove('alert-success','alert-danger')
      divRestante.classList.add('alert-warning')
    } else {
      divRestante.classList.remove('alert-warning', 'alert-danger')
      divRestante.classList.add('alert-success')
    }

    //si el total es cero o menor
    if(restante <= 0){
      ui.imprimirAlerta('presupuesto agotado', 'error')
      formulario.querySelector('button[type="submit"]').disabled=true;
    }
  }
}
//instancias
let presupuesto;
const ui = new UI();

//funciones

function preguntarPresupuesto(){
  const presupuestoUsuario =   prompt('introduce tu presupuesto')

  if (presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0) {
    window.location.reload();
  }
  presupuesto=new Presupuesto(presupuestoUsuario);
  ui.insertarPresupuesto(presupuesto);
}
function agregarGasto(e){
  e.preventDefault();
  const nombre = document.querySelector('#gasto').value;
  const cantidad = Number(document.querySelector('#cantidad').value);

   if(nombre===''|| cantidad === ''){
     ui.imprimirAlerta('Ambos campos son obligatorios', 'error');
     return
   } else if(cantidad<=0 || isNaN(cantidad)){
     ui.imprimirAlerta('Cantidad no valida', 'error');
     return
   }
   //generar un object literal enhancement de tipo gasto
   const gasto = { nombre, cantidad, id: Date.now() }//lo contrario a un destructuring
   presupuesto.nuevoGasto(gasto);
   ui.imprimirAlerta('agregado gasto correctamente');

   //imprimir Gastos
   const {gastos, restante} = presupuesto;
   ui.agregarGastoListado(gastos);
   ui.actualizarRestante(restante);

   ui.comprobarPresupuesto(presupuesto)


   formulario.reset();
  }

  function eliminarGasto(id){
    presupuesto.eliminarGasto(id)
    const { gastos, restante } = presupuesto;
    ui.agregarGastoListado(gastos);
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto)
  }