<?php
/**
 * Name: Tahmin Talukder
 * Section: CSE 154 AQ
 * Date: June 6th, 2019
 *
 * This file allows the user to delete pokemon from the Pokedex. If given a
 * name, then that pokemon will be removed. If the removeall mode is given, then
 * all pokemon will be removed from the pokedex.
 */

  include "common.php";

  header("Content-Type: application/json");
  $db = get_PDO();

  if (!isset($_POST["name"]) && !isset($_POST["mode"])) {
    missing_both_params("name", "mode");
    die();
  } else if (isset($_POST["name"])) {
    $name = $_POST["name"];

    if (pokemon_exists($db, $name)) {
      $sql = "DELETE FROM Pokedex WHERE name = :name";

      try {
        $stmt = $db->prepare($sql);
        $params = array("name" => $name);
        $stmt->execute($params);
        echo json_encode(array("success" => "{$name} removed from your Pokedex!"));
      } catch(PDOException $ex) {
        db_error();
      }
    } else {
      header("HTTP/1.1 400 Invalid Request");
      echo json_encode(array("error" => "{$name} not found in your Pokedex."));
    }
  } else {
    $mode = $_POST["mode"];

    if ($mode === "removeall") {
      remove_all($db);
      echo json_encode(array("success" => "All Pokemon removed from your Pokedex!"));
    } else {
      header("HTTP/1.1 400 Invalid Request");
      echo json_encode(array("error" => "Unknown mode {$mode}."));
    }
  }
?>
