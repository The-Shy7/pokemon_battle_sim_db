<?php
/**
 * Name: Tahmin Talukder
 * Section: CSE 154 AQ
 * Date: June 6th, 2019
 *
 * This PHP file output a JSON response with a key "pokemon" mapping to an
 * array of all Pokemon the player has found, including the name,
 * nickname, and found date/time for each Pokemon. The array will be empty
 * if the Pokedex is empty.
 */

  include "common.php";

  $db = get_PDO();
  $pokemons = $db->query("SELECT * FROM Pokedex");
  $json_array = array();

  foreach ($pokemons as $pokemon) {
    $pokemon_info = array("name" => $pokemon["name"],
                          "nickname" => $pokemon["nickname"],
                          "datefound" => $pokemon["datefound"]);
    array_push($json_array, $pokemon_info);
  }

  $output = array("pokemon" => $json_array);
  header("Content-type: application/json");
  echo json_encode($output);
?>
