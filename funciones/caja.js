let subtotal = 0;
let servicios = [];

window.addEventListener('DOMContentLoaded', () => {

  /* FECHA */
  setInterval(() => {
    document.getElementById('fechaHora').textContent =
      new Date().toLocaleString();
  }, 1000);

  /* BOTONES RAPIDOS */
  document.querySelectorAll('.btn-rapido').forEach(btn => {
    btn.addEventListener('click', () => {
      const nombre = btn.dataset.prod;
      const precio = Number(btn.dataset.precio);

      servicios.push({ nombre, precio });
      subtotal += precio;

      renderTicket();
    });
  });

  /* CANCELAR */
  document.getElementById('btnCancelar').addEventListener('click', () => {
    servicios = [];
    subtotal = 0;
    renderTicket();
  });

  /* COBRAR */
  document.getElementById('btnCobrar').addEventListener('click', () => {
    if (subtotal === 0) return;

    const iva = subtotal * 0.13;
    const total = subtotal + iva;

    document.getElementById('subtotal').textContent = `₡${subtotal.toFixed(2)}`;
    document.getElementById('iva').textContent = `₡${iva.toFixed(2)}`;
    document.getElementById('total').textContent = `₡${total.toFixed(2)}`;

    document.getElementById('modalCobro').classList.add('activo');
  });

  /* CERRAR MODAL */
  document.getElementById('cerrarModal').addEventListener('click', () => {
    document.getElementById('modalCobro').classList.remove('activo');
  });

  /* PAGA CON */
  document.getElementById('pagaCon').addEventListener('input', e => {
    const total = Number(document.getElementById('total').textContent.replace('₡',''));
    const paga = Number(e.target.value || 0);
    const vuelto = paga - total;

    document.getElementById('vuelto').textContent =
      vuelto >= 0 ? `₡${vuelto.toFixed(2)}` : '₡0.00';
  });

  /* CONFIRMAR */
  document.getElementById('confirmarPago').addEventListener('click', async () => {
    const placa = placaVal();
    const modelo = modeloVal();
    const cliente = clienteVal();

    const total = Number(document.getElementById('total').textContent.replace('₡',''));
    const paga = Number(document.getElementById('pagaCon').value || 0);

    if (!placa || !modelo || !cliente) {
      alert('Complete todos los datos');
      return;
    }

    const msg = document.getElementById('msgPago');

    if (paga < total) {
      msg.textContent = 'Saldo insuficiente. Verifique el monto ingresado.';
      msg.style.display = 'block';
      return;
    }

    msg.style.display = 'none';
// Obtenemos los nombres de los servicios seleccionados para el historial
    const descripcionServicios = servicios.map(s => s.nombre).join(', ');

    // GUARDAR EN INDEXEDDB (Se agregan los campos faltantes)
    try {
      await guardarServicio({
        fecha: new Date().toLocaleString(), // Guardamos fecha y hora
        timestamp: Date.now(),              // Útil para ordenar
        placa: placa,
        modelo: modelo,
        cliente: cliente,
        servicios: descripcionServicios || 'Lavado General',
        total: total
      });
      
      alert('Pago registrado con éxito'); // Feedback al usuario
      
      // Limpieza
      servicios = [];
      subtotal = 0;
      renderTicket();
      
      // Limpiar inputs del modal
      document.getElementById('placa').value = '';
      document.getElementById('modelo').value = '';
      document.getElementById('cliente').value = '';
      document.getElementById('pagaCon').value = '';
      document.getElementById('vuelto').textContent = '₡0.00';

      document.getElementById('modalCobro').classList.remove('activo');

    } catch (error) {
      console.error(error);
      alert('Error al guardar el servicio');
    }
  });
});

/* FUNCIONES */
function renderTicket() {
  const cont = document.getElementById('lineasTicket');
  cont.innerHTML = '';

  servicios.forEach(s => {
    const div = document.createElement('div');
    div.textContent = `${s.nombre} - ₡${s.precio.toFixed(2)}`;
    cont.appendChild(div);
  });

  document.getElementById('totalTicket').textContent = subtotal.toFixed(2);
}

const placaVal = () => document.getElementById('placa').value.trim();
const modeloVal = () => document.getElementById('modelo').value.trim();
const clienteVal = () => document.getElementById('cliente').value.trim();
