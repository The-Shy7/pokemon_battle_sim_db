<?php
/**
 * Name: Tahmin Talukder
 * Section: CSE 154 AQ
 * Date: June 6th, 2019
 *
 * This file updates a pokemon in the Pokedex table given a name to have a
 * given nickname. If the nickname isn't passed then the current nickname of
 * the pokemon will be replaced with an uppercase version of the pokemon's name.
 */

  include "common.php";

  header("Content-type: application/json");
  $db = get_PDO();

  if (isset($_POST["name"]) && isset($_POST["nickname"])) {
    $name = $_POST["name"];
    $nickname = $_POST["nickname"];
    update($db, $name, $nickname);
  } else if (isset($_POST["name"])) {
    $name = $_POST["name"];
    $nickname = strtoupper($name);
    update($db, $name, $nickname);
  } else {
    missing_params("name", "");
    die();
  }

  /**
   * Updates the nickname of the given pokemon within
   * the Pokedex with a given or default nickname.
   * @param $db {PDO} - the database containing Pokedex
   * @param $name {string} - the name of pokemon
   * @param $nickname {string} - the nickname of the pokemon
   */
  function update($db, $name, $nickname) {
    if (pokemon_exists($db, strtolower($name))) {
        $sql = "UPDATE Pokedex SET nickname = :nickname WHERE name = :name";

        try {
          $stmt = $db->prepare($sql);
          $params = array("name" => strtolower($name), "nickname" => $nickname);
          $stmt->execute($params);
          echo json_encode(array("success" => "Your {$name} is now named {$nickname}!"));
        } catch(PDOException $ex) {
          db_error();
        }
    } else {
        header("HTTP/1.1 400 Invalid Request");
        echo json_encode(array("error" => "{$name} not found in your Pokedex."));
    }
  }
?>
