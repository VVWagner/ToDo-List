<?php

    $data = json_decode(file_get_contents('php://input'), true);

    $id_data = $data["id"];
    $status = $data["checkboxStatus"];


    $dbconn = pg_connect("host=localhost port=5433 dbname=testdb user=postgres password=admin")
        or die("Невозможно подключиться к БД");


    if ($status) {
        $statusText = 'true';
    } else {
        $statusText = 'false';
    };

    $query = "UPDATE todolist SET checkbox = ".$statusText." WHERE id = ".$id_data.";";

    pg_query($query) or http_response_code(500);

    pg_close($dbconn);
?>