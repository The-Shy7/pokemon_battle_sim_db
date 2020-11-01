<?php
/**
 * Name: Tahmin Talukder
 * Section: CSE 154 AQ
 * Date: June 6th, 2019
 *
 * This PHP file returns the user's player ID (PID) and token in plain text.
 * The PID will be the UW netid. These PID and token values will be used
 * for verifying that player identities when they play moves in battle mode,
 * and trade with one another.
 */

  header("Content-type: text/plain");
  $player_id = "tahmit";
  $token = "poketoken_5cf6f7c7c85337.42483343";
  echo $player_id . "\n" . $token;
?>
