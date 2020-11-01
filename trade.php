<?php
/**
 * Name: Tahmin Talukder
 * Section: CSE 154 AQ
 * Date: June 6th, 2019
 *
 * This file updates the Pokedex after a trade has occured. The pokemon the
 * player traded is removed from the Pokedex and the pokemon they received
 * is added into it.
 */

  include "common.php";

  header("Content-type: application/json");
  $db = get_PDO();

  if (!isset($_POST["mypokemon"]) && !isset($_POST["theirpokemon"])) {
    missing_params("mypokemon", "theirpokemon");
    die();
  } else if (!isset($_POST["mypokemon"]) || !isset($_POST["theirpokemon"])) {
    if (!isset($_POST["mypokemon"])) {
      missing_params("mypokemon", "");
      die();
    } else if (!isset($_POST["theirpokemon"])) {
      missing_params("theirpokemon", "");
      die();
    }
  } else {
    $mypokemon = $_POST["mypokemon"];
    $theirpokemon = $_POST["theirpokemon"];

    if (!pokemon_exists($db, $mypokemon)) {
      header("HTTP/1.1 400 Invalid Request");
      echo json_encode(array("error" => "{$mypokemon} not found in your Pokedex."));
    } else if (pokemon_exists($db, $theirpokemon)) {
      header("HTTP/1.1 400 Invalid Request");
      echo json_encode(array("error" => "You have already found {$theirpokemon}."));
    } else {
      $nickname = strtoupper($theirpokemon);
      date_default_timezone_set('America/Los_Angeles');
      $time = date('y-m-d H:i:s');
      $delete_pokemon = "DELETE FROM Pokedex WHERE name = :name";

      try {
        $stmt = $db->prepare($delete_pokemon);
        $params = array("name" => $mypokemon);
        $stmt->execute($params);
      } catch(PDOException $ex) {
        db_error();
      }

      $add_pokemon = "INSERT INTO Pokedex(name, nickname, datefound) " .
                     "VALUES (:name, :nickname, :datefound)";

      try {
        $stmt = $db->prepare($add_pokemon);
        $params = array("name" => strtolower($theirpokemon),
                        "nickname" => $nickname,
                        "datefound" => $time);
        $stmt->execute($params);
      } catch(PDOException $ex) {
        db_error();
      }

      echo json_encode(array("success" => "You have traded your {$mypokemon} for {$theirpokemon}!"));
    }
  }
?>
