<?php

    $data = json_decode(file_get_contents('php://input'), true);

    $text_data = $data["text"];


    $dbconn = pg_connect("host=localhost port=5433 dbname=testdb user=postgres password=admin")
        or die("Невозможно подключиться к БД");


    $query = "INSERT INTO todolist (task) VALUES ('".$text_data."') RETURNING id;";

    

    $result = pg_query($query) or die('Ошибка запроса: ' . pg_last_error());

    $row = pg_fetch_row($result);
    $new_id = $row['0'];

    pg_close($dbconn);

    echo $new_id;

?>
