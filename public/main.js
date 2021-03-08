var MyDeck = localStorage.getItem('NatPokeDeck');
if (MyDeck === null) MyDeck = [{}, {}, {}]
else MyDeck = JSON.parse(MyDeck)

var curSlot = 0;
var curSearch = 0;

function clearSlot () {
    document.getElementById('slot0').style['border-color'] = '#888'
    document.getElementById('slot1').style['border-color'] = '#888'
    document.getElementById('slot2').style['border-color'] = '#888'
}

function changeSlot(id) {
    for (const d of db) {
        if (d.id === id) {
            MyDeck[curSlot] = d
            document.getElementById('slot' + curSlot).innerHTML = '<img class="imageSelect" src="' + MyDeck[curSlot].picImg + '" />'
        }
    }
    if ('id' in MyDeck[0] && 'id' in MyDeck[1] && 'id' in MyDeck[2]) {
        localStorage.setItem('NatPokeDeck', JSON.stringify(MyDeck));
        document.getElementById('battlebtn').disabled = false
    }
}

document.addEventListener('DOMContentLoaded', function () {

    document.getElementById('slot' + curSlot).style['border-color'] = 'yellow'
    document.getElementById('main').innerHTML = ""
    for (let i = curSearch; i < curSearch + 6; i++) {
        document.getElementById('main').innerHTML += '<img class="imageSelect" onclick="changeSlot(\'' + db[i].id + '\');" src="' + db[i].picImg + '" />'
    }

    document.getElementById('slot0').addEventListener('click', function (event) {
        curSlot = 0;
        clearSlot()
        document.getElementById('slot0').style['border-color'] = 'yellow'
    })
    document.getElementById('slot1').addEventListener('click', function (event) {
        curSlot = 1;
        clearSlot()
        document.getElementById('slot1').style['border-color'] = 'yellow'
    })
    document.getElementById('slot2').addEventListener('click', function (event) {
        curSlot = 2;
        clearSlot()
        document.getElementById('slot2').style['border-color'] = 'yellow'
    })

    for (const d in MyDeck) {
        document.getElementById('slot' + d).innerHTML = '<img class="imageSelect" src="' + MyDeck[d].picImg + '" />'
    }
    if ('id' in MyDeck[0] && 'id' in MyDeck[1] && 'id' in MyDeck[2]) {
        document.getElementById('battlebtn').disabled = false
    }

}, false)