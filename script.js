document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.getElementById('login-form');
    const addFieldForm = document.getElementById('add-field-form');
    const userForm = document.getElementById('user-form');
    const loginMessage = document.getElementById('login-message');
    const formMessage = document.getElementById('form-message');

    // Datos de usuario administrador predefinido
    const adminUsername = 'admin';
    const adminPassword = 'admin';

    // Función para manejar el inicio de sesión
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            fetch('users.txt')
                .then(response => response.text())
                .then(data => {
                    const users = data.split('\n').map(line => line.split(','));
                    const user = users.find(u => u[0] === username && u[1] === password);

                    if (username === adminUsername && password === adminPassword) {
                        window.location.href = 'admin.html';
                    } else if (user) {
                        window.location.href = 'user.html';
                    } else {
                        loginMessage.innerText = 'Credenciales incorrectas';
                    }
                });
        });
    }

    // Función para manejar la adición de campos en el formulario de admin
    if (addFieldForm) {
        addFieldForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const fieldName = document.getElementById('field-name').value;
            const newField = document.createElement('input');
            newField.type = 'text';
            newField.name = fieldName;
            newField.placeholder = fieldName;

            // Guardar el campo en localStorage
            let fields = JSON.parse(localStorage.getItem('fields')) || [];
            fields.push(fieldName);
            localStorage.setItem('fields', JSON.stringify(fields));

            userForm.appendChild(newField);
            formMessage.innerText = `Campo "${fieldName}" agregado.`;
        });
    }

    // Función para manejar el envío del formulario de usuario
    if (userForm) {
        userForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const formData = new FormData(userForm);
            const entries = Array.from(formData.entries()).map(entry => `${entry[0]}: ${entry[1]}`).join('\n');
            
            fetch('responses.txt', {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain'
                },
                body: entries
            })
            .then(() => formMessage.innerText = 'Respuestas guardadas.')
            .catch(() => formMessage.innerText = 'Error al guardar respuestas.');
        });

        // Recuperar los campos guardados del localStorage y agregarlos al formulario de usuario
        const fields = JSON.parse(localStorage.getItem('fields')) || [];
        fields.forEach(fieldName => {
            const newField = document.createElement('input');
            newField.type = 'text';
            newField.name = fieldName;
            newField.placeholder = fieldName;
            userForm.insertBefore(newField, userForm.firstChild);
        });
    }
});
