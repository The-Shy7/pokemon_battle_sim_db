/**
 * Made by Kiet Sam.
 * Spring 2018
 * Updated by Lauren Bricker - Fall 2018
 *
 * Used for testing HW5.
 * Test output will be shown in the console.
 */

(function () {
  "use strict";

  const TEST_DESCRIPTIONS = {};
  const TESTS = ["select", "insert", "delete", "trade", "update"];

  /**
   * Loads the page.
   */
  window.addEventListener("load", loadPage);

  function loadPage() {
    id("select-test-btn").addEventListener("click", startSelectTests);
    id("insert-test-btn").addEventListener("click", startInsertTests);
    id("delete-test-btn").addEventListener("click", startDeleteTests);
    id("trade-test-btn").addEventListener("click", startTradeTests);
    id("update-test-btn").addEventListener("click", startUpdateTests);
    clearTestResults();
  }

  /**
   *  Function to clear all test results
   */
  function clearTestResults() {
    for (let i = 0; i < TESTS.length; i++ ) {
      id(TESTS[i] + "-test-results").innerText = "";
    }
  }

  /**
   *  Run the select test.
   */
  async function startSelectTests() {
    let result = await test(testSelectEmpty);

    postResult("select", "select-test-results", result);
  }

  /**
   *  Run the insert tests.
   */
  async function startInsertTests() {
    let result = true;
    result &= await test(testInsertNoNicknames);
    result &= await test(testInsertWithNicknames);
    result &= await test(testInsertMissingNameParam);

    postResult("insert", "insert-test-results", result);

  }

  /**
   *  Run the delete tests.
   */
  async function startDeleteTests() {
    let result = true;
    result &= await test(testDeleteUnknownMode);
    result &= await test(testDeleteMissingNameParam);

    result &= await test(testDeleteSinglePokemonFound);
    result &= await test(testDeleteSinglePokemonFoundWithLetterCasing);
    result &= await test(testDeleteSinglePokemonFoundWithLetterCasing2);
    result &= await test(testDeleteSinglePokemonNotFound);
    result &= await test(testDeleteSinglePokemonNotFoundWithLetterCasing);

    result &= await test(testDeleteAllNoPokemon);
    result &= await test(testDeleteAllOnePokemon);
    result &= await test(testDeleteAllMultiplePokemon);

    postResult("delete", "delete-test-results", result);
  }

  /**
   *  Run the trade tests.
   */
  async function startTradeTests() {
    let result = true;
    result &= await test(testTradeNoParams);
    result &= await test(testTrade);
    result &= await test(testTradeLetterCasing);
    result &= await test(testTradeNotFound);
    result &= await test(testTradeAlreadyHave);

    postResult("trade", "trade-test-results", result);
  }

  /**
   *  Run the update tests.
   */
  async function startUpdateTests() {
    let result = true;
    result &= await test(testUpdateParams);
    result &= await test(testUpdateNotFound);
    result &= await test(testUpdateNoNickname);
    result &= await test(testUpdateWithNickname);

    postResult("update", "update-test-results", result);
  }





  /******************************************************************/
  /**********************  Testing select.php ***********************/
  /******************************************************************/

  TEST_DESCRIPTIONS["testSelectEmpty"] = "Calls select.php and making sure there are there are no pokemon in the array.";
  async function testSelectEmpty() {
    try {
      let results = await selectAll();
      assert(results["pokemon"].length, 0);
      console.log("There are " + results["pokemon"].length + " pokemon in the db. ");
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  /******************************************************************/
  /**********************  Testing insert.php ***********************/
  /******************************************************************/

  TEST_DESCRIPTIONS["testInsertNoNicknames"] = "Calls insert.php with charmander, bulbasaur, and squirtle.";
  async function testInsertNoNicknames() {
    try {
      let pokemons = ["charmander", "bulbasaur", "squirtle"];
      await insertPokemons(pokemons);
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  TEST_DESCRIPTIONS["testInsertWithNicknames"] = "Calls insert.php with charmander (as charry), bulbasaur (as bulby), and squirtle (as squirty).";
  async function testInsertWithNicknames() {
    try {
      let pokemons = ["charmander", "bulbasaur", "squirtle"];
      let pokemonsNicknames = ["charry", "bulby", "squirty"];
      await insertPokemonsWithNickNamesAndVerify(pokemons, pokemonsNicknames);
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  TEST_DESCRIPTIONS["testInsertMissingNameParam"] = "Calls insert.php with no parameters.\nResponse should be {\"error\": \"Missing name parameter.\"}.";
  async function testInsertMissingNameParam() {
    try {
      let result = await insert();
      assertMessage(result["error"], "Missing name parameter.");
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  /******************************************************************/
  /**********************  Testing delete.php ***********************/
  /******************************************************************/

  TEST_DESCRIPTIONS["testDeleteUnknownMode"] = "Calls delete.php with mode=abc.\nResponse should be  {\"error\": \"Unknown mode abc.\"}.";
  async function testDeleteUnknownMode() {
    try {
      let invalidMode = "abc";
      let result = await remove(null, invalidMode);
      assertMessage(result["error"], "Unknown mode " + invalidMode + ".");
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  TEST_DESCRIPTIONS["testDeleteMissingNameParam"] = "Calls delete.php with no parameter. \nResponse should be {\"error\": \"Missing name or mode parameter.\"}.";
  async function testDeleteMissingNameParam() {
    try {
      let result = await remove();
      assertMessage(result["error"], "Missing name or mode parameter.");
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  TEST_DESCRIPTIONS["testDeleteSinglePokemonFound"] = "Calls insert.php with charmander. Then removes it with delete.php.\nDelete.php should respond with \"charmander removed from your Pokedex!\".";
  async function testDeleteSinglePokemonFound() {
    try {
      console.log("Prepping...");
      let pokemons = ["charmander"];
      await insertPokemons(pokemons);
      console.log("Prep done...");

      let result = await remove(pokemons[0]);
      assertMessage(result["success"], pokemons[0] + " removed from your Pokedex!");
      console.log("Your response is: " + result["success"]);
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  TEST_DESCRIPTIONS["testDeleteSinglePokemonFoundWithLetterCasing"] = "Insert charMANder into pokedex and removes it.\nDelete.php should show \"charMANder removed from your Pokedex!\".";
  async function testDeleteSinglePokemonFoundWithLetterCasing() {
    try {
      console.log("Prepping...");
      let pokemons = ["charMANder"];
      await insertPokemons(pokemons);
      console.log("Prep done...");


      let result = await remove(pokemons[0]);
      assertMessage(result["success"], pokemons[0] + " removed from your Pokedex!");
      console.log("Your response is: " + result["success"]);
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  TEST_DESCRIPTIONS["testDeleteSinglePokemonFoundWithLetterCasing2"] = "Insert charMANder into pokedex and removes it with CHARMANDER.\nDelete.php should show \"CHARMANDER removed from your Pokedex!\".";
  async function testDeleteSinglePokemonFoundWithLetterCasing2() {
    try {
      console.log("Prepping...");
      let pokemons = ["charMANder"];
      await insertPokemons(pokemons);
      console.log("Prep done...");

      let result = await remove(pokemons[0].toUpperCase());
      assertMessage(result["success"], pokemons[0].toUpperCase() + " removed from your Pokedex!");
      console.log("Your response is: " + result["success"]);
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  TEST_DESCRIPTIONS["testDeleteSinglePokemonNotFound"] = "Removes charmander from pokedex without any initial pokemon in the dex.\nDelete.php should show \"charmander not found in your Pokedex.\".";
  async function testDeleteSinglePokemonNotFound() {
    try {
      console.log("Prepping...");
      let pokemons = ["charmander"];
      let result = await remove(pokemons[0]);
      console.log("Prep done...");

      assertMessage(result["error"], pokemons[0] + " not found in your Pokedex.");
      console.log("Your response is: " + result["error"]);

      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  TEST_DESCRIPTIONS["testDeleteSinglePokemonNotFoundWithLetterCasing"] = "Removes charMANder from pokedex without any initial pokemon in the dex.\nDelete.php should show \"charMANder not found in your Pokedex.\".";
  async function testDeleteSinglePokemonNotFoundWithLetterCasing() {
    try {
      console.log("Prepping...");
      let pokemons = ["charMANder"];
      let result = await remove(pokemons[0]);
      console.log("Prep done...");

      assertMessage(result["error"], pokemons[0] + " not found in your Pokedex.");
      console.log("Your response is: " + result["error"]);

      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  TEST_DESCRIPTIONS["testDeleteAllNoPokemon"] = "Making sure that there are no pokemon in the database. \nThen calling remove all (should display \"All Pokemon removed from your Pokedex!\") \nand then making sure that the list of pokemons are still empty.";
  async function testDeleteAllNoPokemon() {
    try {
      let allPokemons = await selectAll();
      assert(allPokemons["pokemon"].length, 0);
      console.log("There are " + allPokemons["pokemon"].length + " pokemon in the db. ");

      let result = await removeAll();
      assertMessage(result["success"], "All Pokemon removed from your Pokedex!");
      console.log("Your response is: " + result["success"]);

      allPokemons = await selectAll();
      assert(allPokemons["pokemon"].length, 0);
      console.log("There are still " + allPokemons["pokemon"].length + " pokemon in the db. ");

      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  TEST_DESCRIPTIONS["testDeleteAllOnePokemon"] = "Making sure that there are no pokemon in the database.\nThen inserting charmander in Pokedex.\nNext, calling remove all (should display \"All Pokemon removed from your Pokedex!\").\nFinally making sure there are no pokemon in pokedex.";
  async function testDeleteAllOnePokemon() {
    try {
      let allPokemons = await selectAll();
      assert(allPokemons["pokemon"].length, 0);
      console.log("There are " + allPokemons["pokemon"].length + " pokemon in the db. ");

      let pokemons = ["charmander"];
      await insertPokemons(pokemons);

      let result = await removeAll();
      assertMessage(result["success"], "All Pokemon removed from your Pokedex!");
      console.log("Your response is: " + result["success"]);

      allPokemons = await selectAll();
      assert(allPokemons["pokemon"].length, 0);
      console.log("There are now " + allPokemons["pokemon"].length + " pokemon in the db. ");

      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  TEST_DESCRIPTIONS["testDeleteAllMultiplePokemon"] = "Making sure that there are no pokemon in the database.\nThen inserting charmander, squiRTle, and bulbasAUR.\nAfter calling removeall, delete.php should respond with \"All Pokemon removed from your Pokedex!\".\nFinally making sure there are no pokemon in pokedex.";
  async function testDeleteAllMultiplePokemon() {
    try {
      let allPokemons = await selectAll();
      assert(allPokemons["pokemon"].length, 0);
      console.log("There are " + allPokemons["pokemon"].length + " pokemon in the db. ");

      let pokemons = ["charmander", "squiRTle", "bulbasAUR"];
      await insertPokemons(pokemons);

      let result = await removeAll();
      assertMessage(result["success"], "All Pokemon removed from your Pokedex!");
      console.log("Your response is: " + result["success"]);

      allPokemons = await selectAll();
      assert(allPokemons["pokemon"].length, 0);
      console.log("There are now " + allPokemons["pokemon"].length + " pokemon in the db. ");

      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  /******************************************************************/
  /**********************  Testing trade.php ***********************/
  /******************************************************************/

  TEST_DESCRIPTIONS["testTradeNoParams"] = "Calling trade.php with no parameter.\nThen calling trade.php with 'mine' as mypokemon.\nLast, calling trade with 'theirs' as theirpokemon.";
  async function testTradeNoParams() {
    try {
      console.log("No parameters");
      let result = await trade();
      assertMessage(result["error"], "Missing mypokemon and theirpokemon parameter.");

      console.log("One parameter (mine)");
      result = await trade("mine");
      assertMessage(result["error"], "Missing theirpokemon parameter.");

      console.log("One parameter (theirs)");
      result = await trade(undefined, "theirs");
      assertMessage(result["error"], "Missing mypokemon parameter.");

      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  TEST_DESCRIPTIONS["testTrade"] = "Inserts charmander into the pokedex.\nThen trade our charmander for their squirtle.\nTrade.php should respond with \"You have traded your charmander for squirtle!\".\nThen making sure that the pokedex only has one pokemon whose name is squirtle and nickname as SQUIRTLE.";
  async function testTrade() {
    try {

      console.log("Prepping...");
      let pokemons = ["charmander"];
      await insertPokemons(pokemons);
      console.log("Prep done...");

      let result = await trade("charmander", "squirtle");
      assertMessage(result["success"], "You have traded your charmander for squirtle!");
      console.log("Your response is: " + result["success"]);

      result = await selectAll();
      pokemons = result["pokemon"];
      assert(pokemons.length, 1);
      assert(pokemons[0].name, "squirtle");
      assert(pokemons[0].nickname, "SQUIRTLE");
      console.log("Database correctly contains " + pokemons[0].name +
                 "/" + pokemons[0].nickname);

      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  TEST_DESCRIPTIONS["testTradeLetterCasing"] = "Inserts charMANder into the pokedex.\nThen trade charMANder with their SQUIRTle.\nTrade.php should respond with \"You have traded your charMANder for SQUIRTle!\".\nThen making sure that the pokedex only has one pokemon whose name is squirtle and nickname as SQUIRTLE.";
  async function testTradeLetterCasing() {
    try {
      console.log("Prepping...");
      let pokemons = ["charMANder"];
      await insertPokemons(pokemons);
      console.log("Prep done...");

      let result = await trade("charMANder", "SQUIRTle");
      assertMessage(result["success"], "You have traded your charMANder for SQUIRTle!");
      console.log("Your response is: " + result["success"]);


      result = await selectAll();
      pokemons = result["pokemon"];
      assert(pokemons.length, 1);
      assert(pokemons[0].name, "squirtle");
      assert(pokemons[0].nickname, "SQUIRTLE");
      console.log("Database correctly contains " + pokemons[0].name +
                 "/" + pokemons[0].nickname);

      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  TEST_DESCRIPTIONS["testTradeNotFound"] = "With no pokemon in the database, we trade charMANder with SQUIRTle.\nTrade.php should respond with an error \"charMANder not found in your Pokedex.\".";
  async function testTradeNotFound() {
    try {
      let result = await trade("charMANder", "SQUIRTle");
      assertMessage(result["error"], "charMANder not found in your Pokedex.");

      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  TEST_DESCRIPTIONS["testTradeAlreadyHave"] = "Insert charMANder and SQUIRTle into the pokedex.\nThen trade charMANder with SQUIRTle.\nTrade.php respond with an error \"You have already found SQUIRTle.\".";
  async function testTradeAlreadyHave() {
    try {
      console.log("Prepping...");
      let pokemons = ["charMANder", "SQUIRTle"];
      await insertPokemons(pokemons);
      console.log("Prep done...");

      let result = await trade("charMANder", "SQUIRTle");
      assertMessage(result["error"], "You have already found SQUIRTle.");

      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  /******************************************************************/
  /**********************  Testing update.php ***********************/
  /******************************************************************/

  TEST_DESCRIPTIONS["testUpdateParams"] = "Calls update.php with no parameter.\nUpdate should respond with \"Missing name parameter.\" \nThen calling update.php with only nickname parameter.\nShould still error \"Missing name parameter.\".";
  async function testUpdateParams() {
    try {
      console.log("No name parameter");
      let result = await update();
      assertMessage(result["error"], "Missing name parameter.");

      console.log("No name parameter with nickname parameter");
      result = await update(undefined, "stuff");
      assertMessage(result["error"], "Missing name parameter.");

      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  TEST_DESCRIPTIONS["testUpdateNotFound"] = "Calls update.php with charMANder when there are no pokemon in the pokedex.\nShould error \"charMANder not found in your Pokedex.\".";
  async function testUpdateNotFound() {
    try {
      let result = await update("charMANder");
      assertMessage(result["error"], "charMANder not found in your Pokedex.");

      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  TEST_DESCRIPTIONS["testUpdateNoNickname"] = "Insert charMANder with nickname as milky.\nThen call update.php with charMANder.\nIt should respond with \"Your charMANder is now named CHARMANDER!\".";
  async function testUpdateNoNickname() {
    try {
      console.log("Prepping...");
      await insertPokemonsWithNickNames(["charMANder"], ["milky"]);
      console.log("Prep done...");

      let result = await update("charMANder");
      assertMessage(result["success"], "Your charMANder is now named CHARMANDER!");
      console.log("Your response is: " + result["success"]);

      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  TEST_DESCRIPTIONS["testUpdateWithNickname"] = "Insert charMANder with nickname as milky.\nThen updates charMANder with nickname flabby.\nUpdate.php should respond with \"Your charMANder is now named flabby!\".\nLast, asserting that the first pokemon whose name is charmander and nickname is flabby.";
  async function testUpdateWithNickname() {
    try {
      console.log("Prepping...");
      await insertPokemonsWithNickNames(["charMANder"], ["milky"]);
      console.log("Prep done...");

      let result = await update("charMANder", "flabby");
      assertMessage(result["success"], "Your charMANder is now named flabby!");
      console.log("Your response is: " + result["success"]);

      let pokemons = (await selectAll())["pokemon"];
      console.log(pokemons);
      assert(pokemons[0].name, "charmander");
      assert(pokemons[0].nickname, "flabby");
      console.log("Database correctly contains " + pokemons[0].name +
                 "/" + pokemons[0].nickname);

      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }


  /******************************************************************/
  /***********************  Testing functions ***********************/
  /******************************************************************/


  /**
   *  Function to run a given test.
   *  @param {function} testFunction - the function that encapsulates the test to run
   *  @return {boolean} whether or not the test passed.
   */
  async function test(testFunction) {
    logTestHeader(testFunction);
    let removeResult = await removeAll();
    assertMessage(removeResult["success"], "All Pokemon removed from your Pokedex!");

    console.log("Start test...");
    let passed = await testFunction();

    if (passed) {
      console.log("%c:) " + testFunction.name + " passed!", "background-color: lightgreen;");
    } else {
      console.log("%c:( " + testFunction.name + " failed.", "background-color: hotpink;");
    }

    return passed;
  }

  /**
   *  Insert pokemons into the DB by creating a pokemonNickname array and calling
   *  insertPokemonsWithNickNames function.
   *  @param {String[]} pokemons - The pokemon names to insert
   */
  async function insertPokemons(pokemons) {
    let pokemonNicknames = [];
    for (let i = 0; i < pokemons.length; i++) {
      pokemonNicknames.push(undefined);
    }
    await insertPokemonsWithNickNamesAndVerify(pokemons, pokemonNicknames);
  }


  /**
   *  Insert pokemons into the DB by creating a pokemonNickname array and calling
   *  insertPokemonsWithNickNames function.
   *  @param {String[]} pokemons - The pokemon names to insert
   *  @param {String[]} pokemonNicknames - The nicknames of the pokemon being inserted
   */
  async function insertPokemonsWithNickNames(pokemons, pokemonNicknames) {
    // Make a copy of the original pokemon list and pokemon nickname list
    let pokemonsOriginal = pokemons.slice();
    let pokemonNicknamesOriginal = pokemonNicknames.slice();


    // Inser all of the pokemon into the DB and make sure it's a success
    for (let i = 0; i < pokemonsOriginal.length; i++) {
      let results = await insert(pokemonsOriginal[i], pokemonNicknamesOriginal[i]);
      assertMessage(results["success"], pokemonsOriginal[i] + " added to your Pokedex!");

      // This sets up the two "Original" arrays to be name in lowercase, nickname in UPPERCASE (if
      // not in the original nickname array), so we can test that everything was in fact
      // inserted into the db... by doing a select on the DB and comparing.
      if (pokemonNicknamesOriginal[i] === undefined) {
        pokemonNicknamesOriginal[i] = pokemonsOriginal[i].toUpperCase();
      }
      pokemonsOriginal[i] = pokemonsOriginal[i].toLowerCase();
    }

    // Do a select on the DB and get the results.
    let results = await selectAll();
    // First check the results have the same length as the original array!
    assert(results["pokemon"].length, pokemonsOriginal.length);
    // now find both the name and the nickname of the pokemon in the two comparison arrays.
    for (let pokemonResult of results["pokemon"]) {
      let name = pokemonResult["name"];
      assert(pokemonsOriginal.includes(name));

      let nickname = pokemonResult["nickname"];
      assert(pokemonNicknamesOriginal.includes(nickname));

      let pokemonIndex = pokemonsOriginal.indexOf(name);
      let pokemonNicknameIndex = pokemonNicknamesOriginal.indexOf(nickname);
      assert(pokemonIndex,  pokemonNicknameIndex);

      // clear out the location in the name and nickname arrays once we've found them in the
      // results
      pokemonsOriginal[pokemonIndex] = null;
      pokemonNicknamesOriginal[pokemonNicknameIndex] = null;
    }

    // Everything worked out if everything in those original arrays is back to null.
    for (let i = 0; i < pokemonsOriginal.length; i++) {
      assert(pokemonsOriginal[i], null);
      assert(pokemonNicknamesOriginal[i], null);
    }
  }

  /**
   *  Insert pokemons into the DB by creating a pokemonNickname array and calling
   *  insertPokemonsWithNickNames function. Do a verification to ensure the
   *  pokemon were indeed inserted.
   *  @param {String[]} pokemons - The pokemon names to insert
   *  @param {String[]} pokemonNicknames - The nicknames of the pokemon being inserted
   */
  async function insertPokemonsWithNickNamesAndVerify(pokemons, pokemonNicknames) {
    // Make a copy of the arrays used for testing at the end that the insert actually worked.
    let pokemonsCopy = pokemons.slice();
    let pokemonNicknamesCopy = pokemonNicknames.slice();

    // Insert first time, should be a success.
    console.log("Insert "+ pokemons.length +
                " pokemon into the db. No error should be shown....");
    await insertPokemonsWithNickNames(pokemons, pokemonNicknames);

    // Try the inserts again, this time all insertions should be failures
    let size = pokemonsCopy.length;
    console.log("Test that " + size +
                " pokemon are in the db by inserting again, you should see " + size +
                " pokemon have already been found. ");
    for (let i = 0; i < pokemonsCopy.length; i++) {
      let results = await insert(pokemonsCopy[i], pokemonNicknamesCopy[i]);
      assertMessage(results["error"], pokemonsCopy[i] + " already found.");
    }
  }


    /******************************************************************/
    /********************  AJAX calling functions *********************/
    /******************************************************************/


  /**
   *  Tests the update endpoint with a pokemon name and nickname.
   *  @param {String} name - The name of the pokemon
   *  @param {String} nickname - The updated nickname of the pokemon
   */
  async function update(name, nickname) {
    let url = "update.php";

    let data = new FormData();
    if (name !== undefined) {
      data.append("name", name);
    }
    if (nickname !== undefined) {
      data.append("nickname", nickname);
    }

    let resp = await fetch(url, {method: "POST", body: data})
    .then(checkStatus)
    .then(function (response) {
      return JSON.parse(response);
    })
    .catch(function (response) {
      console.log("Your response is: " + response);
      return JSON.parse(response);
    });

    return resp;
  }

  /**
   *  Tests the trade endpoint with by trading one of my pokemon for one of "theirs"
   *  @param {String} mine - The name of the my pokemon to trade away
   *  @param {String} theirs - The name of their pokemon to receive
   */
  async function trade(mine, theirs) {
    let url = "trade.php";

    let data = new FormData();
    if (mine !== undefined) {
      data.append("mypokemon", mine);
    }
    if (theirs !== undefined) {
      data.append("theirpokemon", theirs);
    }

    let resp = await fetch(url,{method: "POST", body: data})
    .then(checkStatus)
    .then(function (response) {
      return JSON.parse(response);
    })
    .catch(function (response) {
      console.log("Your response is: " + response);
      return JSON.parse(response);
    });

    return resp;
  }

  /**
   *  Tests the insert endpoint with by adding a pokemon with a name and nickname
   *  @param {String} name - The name of the my pokemon to insert
   *  @param {String} nickname - The nickname of the pokemon, if any
   */
  async function insert(pokemon, nickname) {
    let url = "insert.php";

    let data = new FormData();
    if (pokemon !== undefined) {
      data.append("name", pokemon);
    }
    if (nickname !== undefined) {
      data.append("nickname", nickname);
    }

    let resp = await fetch(url, {method: "POST", body: data})
    .then(checkStatus)
    .then(function (response) {
      return JSON.parse(response);
    })
    .catch(function (response) {
      console.log("Your response is: " + response);
      return JSON.parse(response);
    });

    return resp;
  }

  /**
   *  Tests the select endpoint of the Pokedex 2 API.
   */
  async function selectAll() {
    let url = "select.php";
    let resp = await fetch(url)
    .then(checkStatus)
    .then(JSON.parse)
    .then(function (response) {
      return response;
    })
    .catch(function (response) {
      console.log("Your response is: " + response);
      return response;
    });

    // Check that all names are lower case.
    for (let pokemon of resp["pokemon"]) {
      assert(pokemon.name, pokemon.name.toLowerCase());
    }
    return resp;
  }

  /**
   *  Function to remove all of the pokemon from the database.
   */
  async function removeAll() {
    console.log("Clearing out Pokedex...");
    return remove(null, "removeall");
  }

  /**
   *  Tests the delete endpoint of the Pokedex 2 API.
   *  @param {String} pokemon - The name of the my pokemon to insert
   *  @param {String} mode - which delete mode to use if any.
   */
  async function remove(pokemon, mode) {
    let url = "delete.php";

    let data = new FormData();
    if (pokemon !== null && pokemon !== undefined) {
      data.append("name", pokemon);
    }
    else if (mode !== null && mode !== undefined) {
      data.append("mode", mode);
    }

    let resp = await fetch(url, {method: "POST", body: data})
    .then(checkStatus)
    .then(function (response) {
      return JSON.parse(response);
    })
    .catch(function (response) {
      console.log("Your response is: " + response);
      return JSON.parse(response);
    });

    return resp;
  }

  /***********************************************************************************
   * HELPER FUNCTIONS BELOW
   ***********************************************************************************/

   /**
    *  Function to post the results on the web page and on the console.
    *  @param {String} test - The test name
    *  @param {String} idName - The id of the element on the page to update
    *  @param {boolean} result - whether or not the test passed.
    */
   function postResult(test, idName, result) {
     let text = "ALL TESTS PASSED!";
     if (result) {
       id(idName).classList.add("passed");
     }
     else {
       id(idName).classList.add("failed");
       text = "NOT " + text;
     }
     text = test + " " + text;
     if (idName !== null ) {
       id(idName).innerText = text;
     }
   }

   /**
    *  Check to see if the actual is the same as the expected. If they are different,
    *  thow an exception.
    *  @param {object} actual - What the actual results are
    *  @param {object} expected - What we expected. Could be just "true" if we expect the
    *             actual to just be true.
    */
  function assert(actual, expected = true) {
    if (actual !== expected) {
      let e = new Error("Expected condition failed!\nExpected: " + expected
                        + "\nActual  : " + actual);
      throw e;
    }
  }

  /**
   *  Check to see if the actual message is the same as the expected message. If they are different,
   *  thow an exception.
   *  @param {object} actual - What the actual message is
   *  @param {object} expected - What we expected the message to be.
   */
  function assertMessage(actual, expected) {
    if (actual !== expected) {
      let e = new Error("Output message incorrect!\nExpected: " + expected
                        + "\nActual  : " + actual);
      throw e;
    }
  }

  /**
   *  Function to log the test we're doing in big bright colors.
   *  @param {function} testFunction - the function we're testing.
   */
  function logTestHeader(testFunction) {
    let header = "Test: " + testFunction.name;
    let description = TEST_DESCRIPTIONS[testFunction.name];
    let headerStyle = "background: #9BDBF5; color: black; font-size: 14pt; font-weight: bold;";
    let descriptionStyle = "background: #FAF5AB; color: #02534D; font-size: 10pt;";
    console.log('%c ' + header + " \n%c" + description, headerStyle, descriptionStyle);
  }

  /**
   * Hides the given DOM element by adding the "hidden" class to the associated DOM.
   * @param {string} id of a DOM element
   */
  function hide(idNames) {
    id(idName).classList.toggle("hidden", true);
  }

  /**
   * Shows the given DOM element by removing the "hidden" class from the associated DOM.
   * @param {string} id of a DOM element
   */
  function show(idName) {
    id(idName).classList.toggle("hidden", false);
  }

  /**
    * Function to check the status of an Ajax call, boiler plate code to include,
    * based on: https://developers.google.com/web/updates/2015/03/introduction-to-fetch
    * @param the response text from the url call
    * @return did we succeed or not, so we know whether or not to continue with the handling of
    * this promise
    */
  function checkStatus(response) {
    let responseText = response.text();
    if (response.status >= 200 && response.status < 300 || response.status === 0) {
      return responseText;
    } else {
      //return response.text();
      return responseText.then(Promise.reject.bind(Promise));
    }
  }

  /**
   * Returns the DOM element for the given id.
   * @param {string} id - of DOM element to get.
   * @returns {DOM object} the DOM element for the given id.
   */
  function id(idName) {
    return document.getElementById(idName);
  }

  /**
   * Returns the first DOM element for the given query.
   * @param {string} q - a CSS selector query
   * @returns {DOM object} the first DOM element for the given query.
   */
  function qs(q) {
    return document.querySelector(q);
  }

  /**
   * Creates and returns a DOM object with the specified tag.
   * @param {string} e - tag of the DOM object to create
   * @returns {DOM object} a newly created DOM object with the given tag.
   */
  function ce(e) {
    return document.createElement(e);
  }
})();
