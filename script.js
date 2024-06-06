document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.getElementById('login-form');
    const addFieldForm = document.getElementById('add-field-form');
    const userForm = document.getElementById('user-form');
    const formMessage = document.getElementById('form-message');
    const responsesContainer = document.getElementById('responses-container');
    const fieldsContainer = document.getElementById('fields-container');

    // Función para manejar la adición de campos en el formulario de administración
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

        // Mostrar los campos activos al cargar la página de administración
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
            
            // Guardar las respuestas en el servidor (simulación)
            fetch('save_responses.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams(entries).toString()
            })
            .then(response => {
                if (response.ok) {
                    formMessage.innerText = 'Respuestas guardadas.';
                } else {
                    formMessage.innerText = 'Error al guardar respuestas.';
                }
            })
            .catch(() => formMessage.innerText = 'Error al guardar respuestas.');
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
        fetch('responses.txt') 
            .then(response => response.text())
            .then(data => {
                const responses = data.split('\n\n');
                responses.forEach(response => {
                    const responseDiv = document.createElement('div');
                    responseDiv.classList.add('response');
                    responseDiv.innerText = response;
                    responsesContainer.appendChild(responseDiv);
                });
            });
    }
});
