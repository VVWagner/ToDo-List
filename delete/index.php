<?php
    // http_response_code(500);
    // die();


    $data = json_decode(file_get_contents('php://input'), true);
    #echo $data["text"];
    #echo json_encode($data);

    $id_data = $data["id"];


    $dbconn = pg_connect("host=localhost port=5433 dbname=testdb user=postgres password=admin")
        or die("Невозможно подключиться к БД");


    $query = "DELETE FROM todolist WHERE id = ".$id_data." OR parent_id = ".$id_data.";";

    pg_query($query) or http_response_code(500);

    pg_close($dbconn);

    http_response_code(200);
?>