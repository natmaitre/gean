var plPOS = 0
var opPOS = 0

var opDECK = [{}, {}, {}]
var plDECK = [{}, {}, {}]
var opID = ['bulbasaur', 'nidoran', 'charizard']
var plID = []

var MyDeck = localStorage.getItem('NatPokeDeck');
if (MyDeck === null) window.location.replace('/')
MyDeck = JSON.parse(MyDeck)

for (const d in MyDeck) {
  if ('id' in MyDeck[d]) {
    plID.push(MyDeck[d].id)
    plDECK[d] = MyDeck[d]
  } else window.location.replace('/')
}

let player = {
  hp: 0
}
let opponent = {
  hp: 0
}

function openFullscreen() {
  const elem = document.getElementById('body')
  if (elem.requestFullscreen) {
    elem.requestFullscreen()
  } else if (elem.webkitRequestFullscreen) {
    elem.webkitRequestFullscreen()
  } else if (elem.msRequestFullscreen) {
    elem.msRequestFullscreen()
  }
}

function playerTurn() {
  player.move = !player.move
  opponent.move = !opponent.move
  document.querySelector('.player .stats').style['border-color'] = 'black'
  document.querySelector('.opponent .stats').style['border-color'] = 'black'
  document.querySelector('.box .actions').innerHTML = ''
  if (!player.move) {
    document.querySelector('.player .stats').style['border-color'] = 'yellow'
    showContinue()
  }
  if (!opponent.move) {
    document.querySelector('.box .continue').innerHTML = ''
    document.querySelector('.opponent .stats').style['border-color'] = 'yellow'
    setTimeout(function () {
      compPokemon()
    }, 1500)
  }
}

function fainted(pokemon) {
  if (pokemon.hp <= 0) {
    document.getElementById('message').innerHTML = ' ' + pokemon.name + ' fainted! '
    if (player.move) {
      plPOS++
      document.querySelector('.player .pokemon').src = '/imgs/explosion.gif'
      setTimeout(function () {
        document.querySelector('.player .pokemon').src = ''
      }, 1000)
    } else {
      opPOS++
      document.querySelector('.opponent .pokemon').src = '/imgs/explosion.gif'
      setTimeout(function () {
        document.querySelector('.opponent .pokemon').src = ''
      }, 1000)
    }
    if (plPOS >= plID.length) {
      setTimeout(function () {
        startGameOver()
      }, 3000)
    } else if (opPOS >= plID.length) {
      setTimeout(function () {
        startGameOver()
      }, 3000)
    } else {
      setTimeout(function () {
        startGame()
      }, 3000)
    }
  }
}

function attack(name, attacker, defenser, damage) {
  if ((attacker.hp > 0) && (defenser.hp > 0)) {
    const miss = Math.floor((Math.random() * 10) + 1)
    if (miss === 1) {
      document.getElementById('message').innerHTML = "<span style='color:red'>" + attacker.name + "'s attack missed!<span>"
    } else {
      for (const a of attacker.attacks) {
        if (name === a.function) name = a.name
      }
      document.getElementById('message').innerHTML = ' ' + attacker.name + ' used ' + name + ' '
      let style = ''
      const critical = Math.floor((Math.random() * 10) + 1)
      if (critical === 4) {
        style = 'color:green'
        damage = 2 * damage
      }
      document.getElementById('message').innerHTML += "<span style='" + style + "'> (" + damage + ') </span>'
      defenser.hp = defenser.hp - damage
      if (defenser.hp < 0) {
        defenser.hp = 0
      }
      if (opponent.move) document.getElementById('apHP').innerHTML = defenser.hp
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
  const a = Math.floor(Math.random() * 4)
  eval(opponent.attacks[a].function)('opponent', opponent.attacks[a].name, opponent.attacks[a].damage)
}

function retreat() {
  if (!player.move) {
    document.getElementById('message').innerHTML = 'Do you really want to retreat ?'
    document.querySelector('.box .actions').innerHTML = '<button onclick="window.location.replace(\'/\');">Retreat</button>'
  }
}

function switchPokemon(pos) {
  plPOS = pos
  player = plDECK[plPOS]
  document.querySelector('.box .actions').innerHTML = ''
  document.getElementById('message').innerHTML = 'Pokemon switched!'
  document.querySelector('.player .pokemon').src = player.backImg
  document.querySelector('.player .stats .name').innerHTML = player.name
  document.querySelector('.player .stats .level').innerHTML = player.level
  document.getElementById('myHP').innerHTML = player.hp
  playerTurn()
}

function showSwitchPokemon() {
  if (!player.move) {
    document.querySelector('.box .actions').innerHTML = ''
    document.getElementById('message').innerHTML = 'Select your pokemon'
    for (let o in plDECK) {
      document.querySelector('.box .actions').innerHTML += '<button onclick="switchPokemon(' + o + ');"><div style=""><img src="' + plDECK[o].picImg + '" /><div style="position: absolute;top: 10%;left: 50%;transform: translate(-50%, -50%);">' + plDECK[o].hp + '</div></div></button>'
    }
  }
}

function showAttack() {
  if (!player.move) {
    document.querySelector('.box .actions').innerHTML = ''
    document.getElementById('message').innerHTML = 'Select your attack'
    for (const p of player.attacks) {
      document.querySelector('.box .actions').innerHTML += '<button onclick=\'' + p.function+'("player","' + p.name + '",' + p.damage + ');\'>' + p.name + '</button>'
    }
  }
}

function showContinue() {
  if (!player.move) {
    document.querySelector('.box .continue').innerHTML = '<button onclick="showAttack()">Attack</button><button onclick="showSwitchPokemon();">Switch</button><button onclick="">Action</button><button onclick="retreat()">Retreat</button>'
  }
}

function startGame() {
  for (const d of db) {
    if (opID.includes(d.id)) opDECK[opID.indexOf(d.id)] = JSON.parse(JSON.stringify(d))
    if (opID[opPOS] === d.id) {
      if (opponent.hp <= 0) opponent = opDECK[opID.indexOf(d.id)]
      document.getElementById('opoke' + opPOS).style['background-image'] = 'url("' + opponent.picImg + '")'
      opponent.move = 0
    }
    if (plID.includes(d.id)) plDECK[plID.indexOf(d.id)] = JSON.parse(JSON.stringify(d))
    if (plID[plPOS] === d.id) {
      if (player.hp <= 0) player = plDECK[plID.indexOf(d.id)]
      player.move = 1
    }
  }
  for (let o in plDECK) {
    document.getElementById('ppoke' + o).style['background-image'] = 'url("' + plDECK[o].picImg + '")'
  }
  document.querySelector('.box .actions').innerHTML = ''
  document.getElementById('message').innerHTML = 'Select your action !'
  document.querySelector('.player .pokemon').src = player.backImg
  document.querySelector('.opponent .pokemon').src = opponent.frontImg
  document.querySelector('.player .stats .name').innerHTML = player.name
  document.querySelector('.opponent .stats .name').innerHTML = opponent.name
  document.querySelector('.player .stats .level').innerHTML = player.level
  document.querySelector('.opponent .stats .level').innerHTML = opponent.level
  document.getElementById('apHP').innerHTML = opponent.hp
  document.getElementById('myHP').innerHTML = player.hp
  playerTurn()
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
  document.getElementById('fullscreen').addEventListener('click', function (event) {
    openFullscreen()
  })

  startGameOver()
}, false)