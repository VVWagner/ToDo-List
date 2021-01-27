<?php

    $data = json_decode(file_get_contents('php://input'), true);

    $id_data = $data['id'];

    $newText = $data['text'];

    $dbconn = pg_connect("host=localhost port=5433 dbname=testdb user=postgres password=admin")
        or die("Невозможно подключиться к БД");

    $query = "UPDATE todolist SET task = '".$newText."' WHERE id = ".$id_data.";";

    pg_query($query) or http_response_code(500);

    pg_close($dbconn);
?>