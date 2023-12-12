<?php

$host = 'newneo.cghqoxxyg0hl.us-west-1.rds.amazonaws.com';
$dbname = 'newneo';
$username = 'admin';
$password = 'neopetsadmin';

function connectToDB()
{
    global $db_host, $db_user, $db_password, $db_name;

    $mysqli = new mysqli($db_host, $db_user, $db_password, $db_name);

    if ($mysqli->connect_error) {
        die("Connection failed: " . $mysqli->connect_error);
    }

    return $mysqli;
}
$mysqli = connectToDB();

$mysqli->close();