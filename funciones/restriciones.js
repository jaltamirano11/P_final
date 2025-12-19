/*VALIDACIONES DE FORMATOS ESPECIFICOS*/
function soloMayusculas(str) {
    return str.trim().toUpperCase();
}

function soloMinusculas(str) {
    return str.trim().toLowerCase();
}

function soloNumeros(str, longitud) {
    return str.replace(/[^0-9]/g, '');
}

function soloLetras(str) {
    return str.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]/g, '');
}

function formatoNombre(str) {
    return str.trim().toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}

function validaFormatoCorreo(str) {
    const email = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return email.test(str);
}

function formatoCorreo(str) {
    return str.replace(/[^a-zA-Z0-9@._%+-]/g, '');
}

function validarContrasenia(str) {
    const tieneMayuscula = /[A-Z]/.test(str);
    const tieneMinuscula = /[a-z]/.test(str);
    const tieneNumero = /\d/.test(str);
    const tieneCaracterEspecial = /[!@#$%^&*(),.?":{}|<>]/.test(str);
    const longitudValida = str.length >= 10;
    return tieneMayuscula && tieneMinuscula && tieneNumero && tieneCaracterEspecial && longitudValida;
}

function detalleContrasenia(str) {
    const faltan = [];
    //if (str.length < 10) faltan.push('10 caracteres');
    if (!/[A-Z]/.test(str)) faltan.push('una mayúscula');
    if (!/[a-z]/.test(str)) faltan.push('una minúscula');
    if (!/\d/.test(str)) faltan.push('un número');
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(str)) faltan.push('un símbolo');
    return faltan; // [] si todo OK
}










