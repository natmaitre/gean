var player = {
  hp: 0
}
var opponent = {
  hp: 0
}

function openFullscreen() {
  var elem = document.getElementById("body");
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) {
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    elem.msRequestFullscreen();
  }
}

function playerTurn() {
  player.move = !player.move
  opponent.move = !opponent.move
  document.querySelector(".player .stats").style['border-color'] = 'black'
  document.querySelector(".opponent .stats").style['border-color'] = 'black'
  document.querySelector(".box .actions").innerHTML = "";
  if (!player.move) {
    document.querySelector(".player .stats").style['border-color'] = 'yellow'
    showContinue()
  }
  if (!opponent.move) {
    document.querySelector(".box .continue").innerHTML = ""
    document.querySelector(".opponent .stats").style['border-color'] = 'yellow'
    setTimeout(function () {
      compPokemon()
    }, 1500)
  }
}

function fainted(pokemon) {
  if (pokemon.hp <= 0) {
    document.getElementById('message').innerHTML = " " + pokemon.name + " fainted! "
    if (player.move) {
      plPOS++
      document.querySelector(".player .pokemon").src = '/imgs/explosion.gif'
      setTimeout(function () {
        document.querySelector(".player .pokemon").src = ""
      }, 1000)
    } else {
      opPOS++
      document.querySelector(".opponent .pokemon").src = '/imgs/explosion.gif'
      setTimeout(function () {
        document.querySelector(".opponent .pokemon").src = ""
      }, 1000)
    }
    if (plPOS >= plID.length) setTimeout(function () {
      startGameOver()
    }, 3000)
    else if (opPOS >= plID.length) setTimeout(function () {
      startGameOver()
    }, 3000)
    else setTimeout(function () {
      startGame()
    }, 3000)
  }
}

function attack(name, attacker, defenser, damage) {
  if ((attacker.hp > 0) && (defenser.hp > 0)) {
    var miss = Math.floor((Math.random() * 10) + 1);
    if (miss == 1) {
      document.getElementById('message').innerHTML = "<span style='color:red'>" + attacker.name + "'s attack missed!<span>";
    } else {
      for (const a of attacker.attacks) {
        if (name === a.function) name = a.name
      }
      document.getElementById('message').innerHTML = " " + attacker.name + " used " + name + " ";
      let style = ""
      var critical = Math.floor((Math.random() * 10) + 1);
      if (critical === 4) {
        style = "color:green"
        damage = 2 * damage;
      }
      document.getElementById('message').innerHTML += "<span style='" + style + "'> (" + damage + ") </span>";
      defenser.hp = defenser.hp - damage;
      if (defenser.hp < 0) {
        defenser.hp = 0
      }
      if (opponent.move) document.getElementById('apHP').innerHTML = defenser.hp;
      else document.getElementById('myHP').innerHTML = defenser.hp
      fainted(defenser)
    }
    playerTurn()
  }
}

function attackType(type, name, damage) {
  if (type === 'player') attack(name, player, opponent, damage)
  else attack(name, opponent, player, damage)
}

function waterCannon(type, name, damage) {
  attackType(type, name, damage)
}

function waterPulse(type, name, damage) {
  attackType(type, name, damage)
}

function surf(type, name, damage) {
  attackType(type, name, damage)
}

function tackle(type, name, damage) {
  attackType(type, name, damage)
}

function flameThrower(type, name, damage) {
  attackType(type, name, damage)
}

function dragonClaw(type, name, damage) {
  attackType(type, name, damage)
}

function ember(type, name, damage) {
  attackType(type, name, damage)
}

function growl(type, name, damage) {
  attackType(type, name, damage)
}

function compPokemon() {
  let a = Math.floor(Math.random() * 4)
  eval(opponent.attacks[a].function)('opponent', opponent.attacks[a].name, opponent.attacks[a].damage);
}

function retreat() {
  if (!player.move) document.querySelector(".box .actions").innerHTML = '<button onclick="startGameOver()">Retreat</button>'
}

function showAttack() {
  if (!player.move) {
    document.querySelector(".box .actions").innerHTML = ""
    for (const p of player.attacks)
      document.querySelector(".box .actions").innerHTML += '<button onclick=\'' + p.function+'("player","' + p.name + '",' + p.damage + ');\'>' + p.name + '</button>'
  }
}

function showContinue() {
  if (!player.move) document.querySelector(".box .continue").innerHTML = '<button onclick="showAttack()">Attack</button>\
  <button onclick="compPokemon()">Switch</button>\
  <button onclick="compPokemon()">Action</button>\
  <button onclick="retreat()">Retreat</button>'
}

function startGame() {
  for (const d of db) {
    if (opID[opPOS] === d.id) {
      if (opponent.hp <= 0) opponent = JSON.parse(JSON.stringify(d))
      opponent.move = 0
    }
    if (plID[plPOS] === d.id) {
      if (player.hp <= 0) player = JSON.parse(JSON.stringify(d))
      player.move = 1
    }
  }
  document.querySelector(".box .actions").innerHTML = "";
  document.getElementById("message").innerHTML = "Select your action !"
  document.querySelector(".player .pokemon").src = player.backImg
  document.querySelector(".opponent .pokemon").src = opponent.frontImg
  document.querySelector(".player .stats .name").innerHTML = player.name
  document.querySelector(".opponent .stats .name").innerHTML = opponent.name
  document.querySelector(".player .stats .level").innerHTML = player.level
  document.querySelector(".opponent .stats .level").innerHTML = opponent.level
  document.getElementById('apHP').innerHTML = opponent.hp;
  document.getElementById('myHP').innerHTML = player.hp;
  playerTurn();
}

function startGameOver() {
  plPOS = 0
  opPOS = 0
  player = {
    hp: 0
  }
  opponent = {
    hp: 0
  }
  startGame()
}

document.addEventListener('DOMContentLoaded', function () {

  plID = ["pikachu", "blastoise", "caterpie"]
  opID = ["bulbasaur", "nidoran", "charizard"]

  startGameOver()

}, false);