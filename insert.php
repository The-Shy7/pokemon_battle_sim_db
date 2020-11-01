<?php
/**
 * Name: Tahmin Talukder
 * Section: CSE 154 AQ
 * Date: June 6th, 2019
 *
 * This file adds a pokemon to the Pokedex, after the user enters a name
 * as a parameter. If a nickname is given, it will be added with the pokemon.
 * This also adds the date/time of when the pokemon was added to the Pokedex.
 */

  include "common.php";

  $db = get_PDO();

  if (isset($_POST["name"]) && isset($_POST["nickname"])) {
    $name = $_POST["name"];
    $nickname = $_POST["nickname"];
    add_to_db($db, $name, $nickname);
  } else if (isset($_POST["name"])) {
    $name = $_POST["name"];
    $nickname = strtoupper($name);
    add_to_db($db, $name, $nickname);
  } else {
    missing_params("name", "");
    die();
  }

  /**
   * Removes all pokemons and rows from the table. If
   * an error occurs then an error message will appear
   * and end the program's execution.
   * @param $db {PDO} - the database containing Pokedex
   * @param $name {string} - the name of pokemon
   * @param $nickname {string} - the nickname of the pokemon
   */
  function add_to_db($db, $name, $nickname) {
    date_default_timezone_set('America/Los_Angeles');
    $time = date('y-m-d H:i:s');
    header("Content-Type: application/json");

    if (pokemon_exists($db, $name)) {
        header("HTTP/1.1 400 Invalid Request");
        echo json_encode(array("error" => "{$name} already found."));
    } else {
      $sql = "INSERT INTO Pokedex(name, nickname, datefound) " .
             "VALUES (:name, :nickname, :datefound)";

      try {
        $stmt = $db->prepare($sql);
        $params = array("name" => strtolower($name),
                        "nickname" => $nickname,
                        "datefound" => $time);
        $stmt->execute($params);
        echo json_encode(array("success" => "{$name} added to your Pokedex!"));
      } catch(PDOException $ex) {
        db_error();
      }
    }
  }
?>
