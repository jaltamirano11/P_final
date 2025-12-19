function generarUsuario(nombre, apellido1, apellido2) {
    const usuario = (nombre.charAt(0) + apellido1 + apellido2.charAt(0)).toUpperCase();
    return usuario;
}

function mostrarToast(mensage, tiempo = 3000) {
    const toastEl = document.getElementById('toast');
    toastEl.textContent = mensage;
    toastEl.classList.add('show');
    //setTimeout(() => toastEl.classList.remove('show'), tiempo);
}   