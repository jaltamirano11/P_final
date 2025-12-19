 /* ---------- Abrir / cerrar modales ---------- */
        const loginModal   = document.getElementById('loginModal');
        const createModal  = document.getElementById('createModal');
        const btnShowCreate= document.getElementById('btnShowCreate');
        const btnCancelCreate=document.getElementById('btnCancelCreate');

        btnShowCreate.addEventListener('click', () => {
            loginModal.style.display = 'none';
            createModal.style.display = 'block';
        });
        btnCancelCreate.addEventListener('click', () => {
            createModal.style.display = 'none';
            loginModal.style.display = 'block';
        });