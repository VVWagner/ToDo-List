<?php

    $dbconn = pg_connect("host=localhost port=5433 dbname=testdb user=postgres password=admin")
        or die("Невозможно подключиться к БД");

    $query = 'SELECT * FROM todolist ORDER BY id ASC';
    $result = pg_query($query) or die('Ошибка запроса: ' . pg_last_error());

    $line = pg_fetch_all($result);

    pg_free_result($result);

    pg_close($dbconn);

    print_r(json_encode($line, JSON_UNESCAPED_UNICODE));

?>