window.addEventListener('DOMContentLoaded', async () => {
  // 1. Iniciar DB
  await abrirDB();
  
  // 2. Cargar datos
  cargarHistorial();
});

async function cargarHistorial() {
  const tbody = document.querySelector('#tablaHistorial tbody');
  const msgVacio = document.getElementById('mensajeVacio');
  
  tbody.innerHTML = ''; // Limpiar tabla

  try {
    // Usamos la función existente en db.js
    const servicios = await obtenerTodosServicios();

    if (servicios.length === 0) {
      msgVacio.style.display = 'block';
      return;
    }
    msgVacio.style.display = 'none';

    // Ordenar del más reciente al más antiguo (usando el timestamp o id)
    // Como el ID es autoincremental, invertir el array funciona si no se borraron ids intermedios,
    // pero lo mejor es sort.
    servicios.sort((a, b) => b.id - a.id);

    servicios.forEach(s => {
      const tr = document.createElement('tr');
      
      tr.innerHTML = `
        <td>${s.fecha}</td>
        <td>${s.cliente}</td>
        <td>
          <div style="font-weight:bold">${s.placa}</div>
          <small style="color:var(--muted)">${s.modelo}</small>
        </td>
        <td>${s.servicios}</td>
        <td style="font-weight:bold; color:var(--success)">₡${s.total.toFixed(2)}</td>
        <td>
          <button class="btn-borrar" data-id="${s.id}">Eliminar</button>
        </td>
      `;

      tbody.appendChild(tr);
    });

    // Agregar eventos a los botones de eliminar
    document.querySelectorAll('.btn-borrar').forEach(btn => {
      btn.addEventListener('click', borrarRegistro);
    });

  } catch (error) {
    console.error("Error cargando historial:", error);
    alert("Error al cargar los datos");
  }
}

async function borrarRegistro(e) {
  const id = Number(e.target.dataset.id);
  
  if(confirm('¿Seguro que desea eliminar este registro permanentemente?')) {
    try {
      await eliminarServicio(id); // Función existente en db.js
      e.target.closest('tr').remove(); // Remover de la vista
      
      // Verificar si quedó vacía
      const tbody = document.querySelector('#tablaHistorial tbody');
      if(tbody.children.length === 0) {
        document.getElementById('mensajeVacio').style.display = 'block';
      }
    } catch (error) {
      alert('Error al eliminar');
    }
  }
}