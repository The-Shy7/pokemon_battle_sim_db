<?php
/**
 * Name: Tahmin Talukder
 * Section: CSE 154 AQ
 * Date: June 6th, 2019
 *
 * This file provides a connection to the hw5 database and handles
 * error messages that may arise from the query and manipulating the
 * Pokedex and accounts for any missing parameters.
 */

  /**
   * Returns a PDO object connected to the database. If a PDOException is thrown when
   * attempting to connect to the database, responds with a 503 Service Unavailable
   * error.
   * @return {PDO} connected to the database upon a succesful connection.
   */
  function get_PDO() {
    $host = "localhost";
    $port = "8889";
    $user = "root";
    $password = "root";
    $dbname = "hw5db";
    $ds = "mysql:host={$host}:{$port};dbname={$dbname};charset=utf8";

    try {
      $db = new PDO($ds, $user, $password);
      $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
      return $db;
    } catch(PDOException $ex) {
      db_error();
    }
  }

  /**
   * Prints out a JSON 400 error message if one or more required parameters are
   * missing.
   * @param $param1 {string} - the 1st missing request parameter
   * @param $param2 {string} - the 2nd missing request parameter
   */
  function missing_params($param1, $param2) {
    header("Content-type: application/json");
    header("HTTP/1.1 400 Invalid Request");

    if ($param2 === "") {
      echo json_encode(array("error" => "Missing {$param1} parameter."));
    } else {
      echo json_encode(array("error" => "Missing {$param1} and {$param2} parameter."));
    }
  }

  /**
   * Prints out a JSON 400 error message if both parameters are missing for a web
   * service that requires one or the other.
   * @param $param1 {string} - the 1st missing request parameter
   * @param $param2 {string} - the 2nd missing request parameter
   */
  function missing_both_params($param1, $param2) {
    header("Content-type: application/json");
    header("HTTP/1.1 400 Invalid Request");
    echo json_encode(array("error" => "Missing {$param1} or {$param2} parameter."));
  }

  /**
   * Prints out a JSON 503 error message if there is an error querying
   * the database and will end the program execution.
   */
  function db_error() {
    header("Content-type: application/json");
    header("HTTP/1.1 503 Service Unavailable");
    echo json_encode(array("error" => "A database error occurred. Please try again later."));
    die();
  }

  /**
   * Removes all pokemons and rows from the table. If
   * an error occurs then an error message will appear
   * and end the program's execution.
   * @param $db {PDO} - the database containing Pokedex
   * @param $name {string} - the pokemon's name
   * @return {boolean} - true if the given pokemon is in the table, false otherwise
   */
  function pokemon_exists($db, $name) {
    $sql_query = "SELECT * FROM Pokedex WHERE name = :name";

    try {
      $stmt = $db->prepare($sql_query);
      $stmt->execute(array("name" => $name));
    } catch(PDOException $ex) {
      db_error();
    }

    return $stmt->rowCount() !== 0;
  }

  /**
   * Removes all pokemons and rows from the table. If
   * an error occurs then an error message will appear
   * and end the program's execution.
   * @param $db {PDO} - the database containing Pokedex
   */
  function remove_all($db) {
    $sql_query = "DELETE FROM Pokedex";

    try {
      $stmt = $db->prepare($sql_query);
      $stmt->execute();
    } catch(PDOException $ex) {
      db_error();
    }
  }
?>
