<?php

    $data = json_decode(file_get_contents('php://input'), true);

    $id_data = $data['id'];

    $newText = $data['text'];

    $dbconn = pg_connect("host=localhost dbname=123 user=postgres password=admin")
        or die("Невозможно подключиться к БД");

    $query = "UPDATE lists SET lists_name = '".$newText."' WHERE lists_id = ".$id_data.";";

    pg_query($query) or http_response_code(500);

    pg_close($dbconn);
?>