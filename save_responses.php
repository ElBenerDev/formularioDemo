<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = file_get_contents('php://input');
    $decodedData = urldecode($data); // Decodificar la URL

    // Añadir una línea en blanco al final para separar las respuestas
    file_put_contents('responses.txt', $decodedData . "\n\n", FILE_APPEND);
    http_response_code(200);
} else {
    http_response_code(405); // Método no permitido
}
