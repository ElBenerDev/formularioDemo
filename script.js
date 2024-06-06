document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.getElementById('login-form');
    const addFieldForm = document.getElementById('add-field-form');
    const userForm = document.getElementById('user-form');
    const loginMessage = document.getElementById('login-message');
    const formMessage = document.getElementById('form-message');
    const responsesContainer = document.getElementById('responses-container');
    const fieldsContainer = document.getElementById('fields-container');

    const adminUsername = 'admin';
    const adminPassword = 'password';

    // Cargar usuarios desde users.json
    let users = [];
    fetch('users.json')
        .then(response => response.json())
        .then(data => {
            users = data;
        })
        .catch(error => {
            console.error('Error al cargar usuarios:', error);
        });

    // Función para manejar el inicio de sesión
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            const user = users.find(u => u.username === username && u.password === password);

            if (username === adminUsername && password === adminPassword) {
                window.location.href = 'admin.html';
            } else if (user) {
                window.location.href = 'user.html';
            } else {
                loginMessage.innerText = 'Credenciales incorrectas';
            }
        });
    }

    // Función para manejar la adición de campos en el formulario de admin
    if (addFieldForm) {
        addFieldForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const fieldName = document.getElementById('field-name').value;
            if (fieldName) {
                const newField = document.createElement('input');
                newField.type = 'text';
                newField.name = fieldName;
                newField.placeholder = fieldName;

                let fields = JSON.parse(localStorage.getItem('fields')) || [];
                fields.push(fieldName);
                localStorage.setItem('fields', JSON.stringify(fields));

                if (userForm) {
                    userForm.appendChild(newField);
                }

                // Actualizar la lista de campos activos
                const fieldItem = document.createElement('div');
                fieldItem.classList.add('field-item');
                fieldItem.innerText = fieldName;
                fieldsContainer.appendChild(fieldItem);

                formMessage.innerText = `Campo "${fieldName}" agregado.`;
                document.getElementById('field-name').value = ''; // Limpiar el input después de agregar
            }
        });

        // Mostrar los campos activos al cargar la página de admin
        const fields = JSON.parse(localStorage.getItem('fields')) || [];
        fields.forEach(fieldName => {
            const fieldItem = document.createElement('div');
            fieldItem.classList.add('field-item');
            fieldItem.innerText = fieldName;
            fieldsContainer.appendChild(fieldItem);
        });
    }

    // Función para manejar el envío del formulario de usuario
    if (userForm) {
        userForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const formData = new FormData(userForm);
            const entries = Array.from(formData.entries()).map(entry => `${entry[0]}: ${entry[1]}`).join('\n');
            
            // Guardar las respuestas en localStorage
            let responses = JSON.parse(localStorage.getItem('responses')) || [];
            responses.push(entries);
            localStorage.setItem('responses', JSON.stringify(responses));

            formMessage.innerText = 'Respuestas guardadas.';
        });

        const fields = JSON.parse(localStorage.getItem('fields')) || [];
        fields.forEach(fieldName => {
            const newField = document.createElement('input');
            newField.type = 'text';
            newField.name = fieldName;
            newField.placeholder = fieldName;
            userForm.insertBefore(newField, userForm.firstChild);
        });
    }

    // Función para mostrar las respuestas guardadas
    if (responsesContainer) {
        const responses = JSON.parse(localStorage.getItem('responses')) || [];
        responses.forEach(response => {
            const responseDiv = document.createElement('div');
            responseDiv.classList.add('response');
            responseDiv.innerText = response;
            responsesContainer.appendChild(responseDiv);
        });
    }
});
