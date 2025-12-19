const DB_NAME = 'Carwash';
const DB_VERSION = 1;
const STORE_NAME = 'usuarios';

// Variable global para la conexión
let db;

/* ============================================================
   2. ABRIR O CREAR LA BASE DE DATOS
   ============================================================ */
function abrirDB() {
  return new Promise((resolve, reject) => {
    // Solicitud para abrir la BD
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    // Se dispara si la BD no existe o la versión cambia
    request.onupgradeneeded = (event) => {
      db = event.target.result;
      console.log('⚙️ Creando estructura de la BD...');

      
      // Si no existe el ObjectStore, lo creamos
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'cedula' });
        // Ejemplo: crear índices para búsquedas rápidas
        store.createIndex('idx_nombre', 'nombre', { unique: false });
        store.createIndex('idx_correo', 'correo', { unique: true });
      }
      // store servicios (para cobros)
      if (!db.objectStoreNames.contains('servicios')) {
        const s = db.createObjectStore('servicios', { keyPath: 'id', autoIncrement: true });
        s.createIndex('idx_placa', 'placa');
        s.createIndex('idx_fecha', 'fecha', { unique: false});
      }
    };
   
    // Se dispara cuando la BD se abre correctamente
    request.onsuccess = (event) => {
      db = event.target.result;
      console.log('✅ BD abierta:', DB_NAME);
      resolve();
    };

    // Se dispara si hay error al abrir la BD
    request.onerror = (event) => {
      console.error('❌ Error al abrir la BD:', event.target.error);
      reject(event.target.error);
    };
  });
}

/* ============================================================
   3. CREATE (Agregar un registro)
   ============================================================ */
function crearUsuario(usuario) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite'); // Transacción en modo escritura
    const store = tx.objectStore(STORE_NAME);
    const request = store.add(usuario); // add() falla si la clave ya existe

    request.onsuccess = () => {
      console.log('✅ Usuario agregado:', usuario);
      resolve(true);
    };

    request.onerror = (event) => {
      console.error('❌ Error al agregar usuario:', event.target.error);
      reject(event.target.error);
    };
  });
}

/* ============================================================
   4. READ (Leer todos los registros)
   ============================================================ */
function leerTodos() {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly'); // Solo lectura
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll(); // Devuelve un array con todos los registros

    request.onsuccess = () => {
      console.log('📄 Todos los usuarios:', request.result);
      resolve(request.result);
    };

    request.onerror = (event) => {
      console.error('❌ Error al leer usuarios:', event.target.error);
      reject(event.target.error);
    };
  });
}

/* ============================================================
   5. READ (Leer por clave primaria)
   ============================================================ */
function leerPorCedula(cedula) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(cedula); // Busca por keyPath

    request.onsuccess = () => {
      console.log('🔍 Usuario encontrado:', request.result);
      resolve(request.result);
    };

    request.onerror = (event) => {
      console.error('❌ Error al buscar usuario:', event.target.error);
      reject(event.target.error);
    };
  });
}

/* ============================================================
   6. UPDATE (Actualizar un registro)
   ============================================================ */
function actualizarUsuario(usuario) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.put(usuario); // put() reemplaza si existe la clave

    request.onsuccess = () => {
      console.log('✅ Usuario actualizado:', usuario);
      resolve(true);
    };

    request.onerror = (event) => {
      console.error('❌ Error al actualizar usuario:', event.target.error);
      reject(event.target.error);
    };
  });
}

/* ============================================================
   7. DELETE (Eliminar un registro)
   ============================================================ */
function borrarUsuario(cedula) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const request = store.delete(cedula);

    request.onsuccess = () => {
      console.log('🗑️ Usuario eliminado:', cedula);
      resolve(true);
    };

    request.onerror = (event) => {
      console.error('❌ Error al eliminar usuario:', event.target.error);
      reject(event.target.error);
    };
  });
}
/* Servicios: escritura, lectura con cursor y eliminación */
function guardarServicio(servicio) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(['servicios'], 'readwrite');
    const store = tx.objectStore('servicios');
    const req = store.add(servicio);
    req.onsuccess = (e) => resolve(e.target.result);
    req.onerror = (e) => reject(e.target.error);
  });
}
function obtenerServiciosPorCursor() {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(['servicios'], 'readonly');
    const store = tx.objectStore('servicios');
    const req = store.openCursor();
    const arr = [];
    req.onsuccess = (e) => {
      const cursor = e.target.result;
      if (cursor) { arr.push(cursor.value); cursor.continue(); }
      else { resolve(arr); }
    };
    req.onerror = (e) => reject(e.target.error);
  });
}
function obtenerTodosServicios() {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(['servicios'], 'readonly');
    const store = tx.objectStore('servicios');
    const req = store.getAll();
    req.onsuccess = (e) => resolve(e.target.result || []);
    req.onerror = (e) => reject(e.target.error);
  });
}

/* Eliminar servicio por id */
function eliminarServicio(id) {
   return new Promise((resolve, reject) => {
    const tx = db.transaction(['servicios'], 'readwrite');
    const store = tx.objectStore('servicios');
    const req = store.delete(Number(id));
    req.onsuccess = () => resolve();
    req.onerror = (e) => reject(e.target.error);
  });
}


/* ============================================================
   8. INICIALIZAR LA BD AL CARGAR LA PÁGINA
   ============================================================ */
window.addEventListener('DOMContentLoaded', async () => {
  await abrirDB();
  console.log('✅ CRUD listo para usar');
});