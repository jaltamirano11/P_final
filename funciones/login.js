/* RESTRICCIONES EN LOS INPUTS */
const loginUser = document.getElementById('loginUser');
loginUser.addEventListener('input', function () {
    this.value = soloMayusculas(this.value);
    this.value = soloLetras(this.value);
});

const nombreInput = document.getElementById('nombre');
nombreInput.addEventListener('input', function () {
    this.value = formatoNombre(this.value);
    this.value = soloLetras(this.value);
});

const apellido1Input = document.getElementById('apellido1');
apellido1Input.addEventListener('input', function () {
    this.value = formatoNombre(this.value);
    this.value = soloLetras(this.value);
});

const apellido2Input = document.getElementById('apellido2');
apellido2Input.addEventListener('input', function () {
    this.value = formatoNombre(this.value);
    this.value = soloLetras(this.value);
});

const cedulaInput = document.getElementById('cedula');
cedulaInput.addEventListener('input', function () {
    this.value = soloNumeros(this.value, 9);
});

const telefonoInput = document.getElementById('telefono');
telefonoInput.addEventListener('input', function () {
    this.value = soloNumeros(this.value, 8);
});

const correoInput = document.getElementById('correo');
correoInput.addEventListener('input', function () {
    this.value = formatoCorreo(this.value);
    this.value = soloMinusculas(this.value);
});

const contraseniaInput = document.getElementById('contrasenia');
let toastTimeout;

contraseniaInput.addEventListener('input', () => {
    clearTimeout(toastTimeout);

    const faltan = detalleContrasenia(this.value);
    if (faltan.length) {
        toastTimeout = setTimeout(() => {
            mostrarToast('Falta: ' + faltan.join(', '), 3000);
        }, 300); // pequeño debounce
    }
});

//  Crear Nombre de usuario
document.getElementById('btnCreate').addEventListener('click', async () => {
    // 1. Leer campos
    const datos = {
        nombre: document.getElementById('nombre').value.trim(),
        apellido1: document.getElementById('apellido1').value.trim(),
        apellido2: document.getElementById('apellido2').value.trim(),
        cedula: document.getElementById('cedula').value.trim(),
        telefono: document.getElementById('telefono').value.trim(),
        correo: document.getElementById('correo').value.trim(),
        contrasenia: document.getElementById('contrasenia').value
    };
    // 2. Generar nombre de usuario
    datos.usuario = generarUsuario(datos.nombre, datos.apellido1, datos.apellido2);
    const faltan = detalleContrasenia(datos.contrasenia);
    if (faltan.length) {
        mostrarToast('Contraseña incompleta: ' + faltan.join(', '));
        return; // no continuamos
    }
    // 3. Guardar
    await window.dbReady;
    try {
        await crearUsuario(datos);
        mostrarToast('Usuario creado: ' + datos.usuario);
        createModal.style.display = 'none';
        loginModal.style.display = 'block';
        // opcional: limpiar form
        document.querySelectorAll('#createModal input').forEach(i => i.value = '');
    } catch (e) {
        mostrarToast(e.message || 'Error al crear');
    }
});

document.getElementById('btnEntrar').addEventListener('click', async() => {
    const usuario = document.getElementById('loginUser').value.trim();
    const clave = document.getElementById('loginPass').value;

    if(!usuario || !clave) {
        mostrarToast('Usuario y cointraseña requeridos');
        return;
    }
    const usuarios = await leerTodos(); //await(espera) es una funcion async 
    const user = usuarios.find(u => u.usuario === usuario );

    if(!user ) {
        mostrarToast('Usuario no encontrado');
        return;
    }
    if(user.contrasenia !== clave) {
        mostrarToast('Contraseña incorrecta');
        return;
    }
    mostrarToast('Bienvenido,'+user.nombre);
    window.location.href = 'paginas/caja.html';
});
