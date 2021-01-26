<?php

    $data = json_decode(file_get_contents('php://input'), true);

    $id_data = $data["id"];
    $status = $data["checkboxStatus"];


    $dbconn = pg_connect("host=localhost dbname=123 user=postgres password=admin")
        or die("Невозможно подключиться к БД");


    if ($status) {
        $statusText = 'true';
    } else {
        $statusText = 'false';
    };

    $query = "UPDATE lists SET lists_checkbox = ".$statusText." WHERE lists_id = ".$id_data.";";

    pg_query($query) or http_response_code(500);

    pg_close($dbconn);
?>