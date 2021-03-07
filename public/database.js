const db = [{
  id: 'pikachu',
  name: 'Pikachu',
  picImg: 'https://img.pokemondb.net/sprites/black-white/normal/pikachu.png',
  frontImg: 'http://img.pokemondb.net/sprites/black-white/anim/normal/pikachu.gif',
  backImg: 'http://img.pokemondb.net/sprites/black-white/anim/back-normal/pikachu.gif',
  hp: 40,
  level: 1,
  attacks: [{
    name: 'Water Pulse',
    function: 'waterPulse',
    damage: 20
  },
  {
    name: 'Surf',
    function: 'surf',
    damage: 5
  },
  {
    name: 'Tackle',
    function: 'tackle',
    damage: 10
  },
  {
    name: 'Water Cannon',
    function: 'waterCannon',
    damage: 30
  }
  ]
}, {
  id: 'bulbasaur',
  name: 'Bulbasaur',
  picImg: 'https://img.pokemondb.net/sprites/black-white/normal/bulbasaur.png',
  frontImg: 'http://img.pokemondb.net/sprites/black-white/anim/normal/bulbasaur.gif',
  backImg: 'http://img.pokemondb.net/sprites/black-white/anim/back-normal/bulbasaur.gif',
  hp: 40,
  level: 1,
  attacks: [{
    name: 'Water Pulse',
    function: 'waterPulse',
    damage: 20
  },
  {
    name: 'Surf',
    function: 'surf',
    damage: 5
  },
  {
    name: 'Tackle',
    function: 'tackle',
    damage: 10
  },
  {
    name: 'Water Cannon',
    function: 'waterCannon',
    damage: 30
  }
  ]
}, {
  id: 'caterpie',
  name: 'Caterpie',
  picImg: 'https://img.pokemondb.net/sprites/black-white/normal/caterpie.png',
  frontImg: 'http://img.pokemondb.net/sprites/black-white/anim/normal/caterpie.gif',
  backImg: 'http://img.pokemondb.net/sprites/black-white/anim/back-normal/caterpie.gif',
  hp: 40,
  level: 1,
  attacks: [{
    name: 'Water Pulse',
    function: 'waterPulse',
    damage: 20
  },
  {
    name: 'Surf',
    function: 'surf',
    damage: 5
  },
  {
    name: 'Tackle',
    function: 'tackle',
    damage: 10
  },
  {
    name: 'Water Cannon',
    function: 'waterCannon',
    damage: 30
  }
  ]
}, {
  id: 'nidoran',
  name: 'Nidoran',
  picImg: 'https://img.pokemondb.net/sprites/black-white/normal/nidoran-m.png',
  frontImg: 'http://img.pokemondb.net/sprites/black-white/anim/normal/nidoran-m.gif',
  backImg: 'http://img.pokemondb.net/sprites/black-white/anim/back-normal/nidoran-m.gif',
  hp: 40,
  level: 1,
  attacks: [{
    name: 'Water Pulse',
    function: 'waterPulse',
    damage: 20
  },
  {
    name: 'Surf',
    function: 'surf',
    damage: 5
  },
  {
    name: 'Tackle',
    function: 'tackle',
    damage: 10
  },
  {
    name: 'Water Cannon',
    function: 'waterCannon',
    damage: 30
  }
  ]
}, {
  id: 'blastoise',
  name: 'Blastoise',
  picImg: 'https://img.pokemondb.net/sprites/black-white/normal/blastoise.png',
  frontImg: 'http://img.pokemondb.net/sprites/black-white/anim/normal/blastoise.gif',
  backImg: 'http://img.pokemondb.net/sprites/black-white/anim/back-normal/blastoise.gif',
  hp: 100,
  level: 86,
  attacks: [{
    name: 'Water Pulse',
    function: 'waterPulse',
    damage: 20
  },
  {
    name: 'Surf',
    function: 'surf',
    damage: 5
  },
  {
    name: 'Tackle',
    function: 'tackle',
    damage: 10
  },
  {
    name: 'Water Cannon',
    function: 'waterCannon',
    damage: 30
  }
  ]
}, {
  id: 'charizard',
  name: 'Charizard',
  picImg: 'https://img.pokemondb.net/sprites/black-white/normal/charizard.png',
  frontImg: 'http://img.pokemondb.net/sprites/black-white/anim/normal/charizard.gif',
  backImg: 'http://img.pokemondb.net/sprites/black-white/anim/back-normal/charizard.gif',
  hp: 100,
  level: 86,
  attacks: [{
    name: 'Flame Thrower',
    function: 'flameThrower',
    damage: 30
  },
  {
    name: 'Dragon Claw',
    function: 'dragonClaw',
    damage: 20
  },
  {
    name: 'Ember',
    function: 'ember',
    damage: 10
  },
  {
    name: 'Growl',
    function: 'growl',
    damage: 5
  }
  ]
}]

if (!db) console.log('Error')
