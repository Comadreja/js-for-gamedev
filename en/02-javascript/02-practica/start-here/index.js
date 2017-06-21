var readline = require('readline');

var Battle = require('./src/Battle');

var entities = require('./src/entities');

var cmd = readline.createInterface({
  input: process.stdin,
  outpu: process.stdout,
  prompt: '> '
});

var parties;
var partyNames = { heroes: 'heroes', monsters: 'monsters' };
var action;
var battle;
var battleLine;

setupBattle();

function setupBattle() {
  battle = new Battle();
  battle.setup(getRandomSetup());

  battle.on('start', function (charactersByParties) {
    parties = charactersByParties;
    console.log('Let the battle begin!');
  });

  battle.on('end', function (result) {
    console.log('The battle is over!');
    console.log('Winning party: ' + result.winner);
    process.exit(0);
  });

  battle.on('turn', function (turn) {
    console.log(
      'Turno', turn.number + '.'
    );
    showTurnLine(turn.activeCharacterId);
    showActions(this.options);
  });

  battle.on('info', function (result) {
    switch (result.action) {
    case 'attack':
      if (!result.success) {
        console.log(
          result.activeCharacterId,
          'tried to hit', result.targetId,
          'and failed.'
        );
      } else {
        console.log(
          result.activeCharacterId,
          'hits', result.targetId,
          'and inflicts', result.effect
        );
      }
      break;
    case 'defend':
      console.log(
        result.targetId,
        'defended. Now his defense is',
        result.newDefense
      );
      break;
    case 'cast':
      if (!result.success) {
        console.log(
          result.activeCharacterId,
          'tried to cast a spell on', result.targetId,
          'and failed.'
        );
      } else {
        console.log(
          result.activeCharacterId,
          'casts', result.scrollName, 'on', result.targetId,
          'causing the effect', result.effect
        );
      }
      break;
    }
    console.log();
  });

  battle.start();
}

function showActions() {
  var actions = {
    attack: 'Attack',
    defend: 'Defend',
    cast: 'Cast'
  };
  var items = battle.options.list();

  console.log('Choose what to do:');
  items.forEach(function (item, index) {
    console.log('[' + (index + 1) + ']', actions[item]);
  });
  waitForAction();

  function waitForAction() {
    cmd.prompt();
    cmd.once('line', function (selection) {
      selection = parseInt(selection);
      if (!isNaN(selection) && selection > 0 && selection <= items.length) {
        var id = items[selection - 1];
        battle.options.select(items[selection - 1]);
        action = id;
        if (id === 'attack') {
          showTargets();
        }
        if (id === 'cast') {
          showScrolls();
        }
      } else {
        console.log('Incorrect option');
        setTimeout(function () {
          readline.moveCursor(process.stdin, 0, -2);
          readline.clearScreenDown(process.stdin);
          waitForAction();
        }, 500);
      }
    });
  }
}

function showTargets() {
  var items = battle.options.list();
  console.log('Choose a target:');
  items.forEach(function (item, index) {
    console.log('[' + (index + 1) + ']', item);
  });
  console.log('\n[0] Cancel');
  waitForAction();

  function waitForAction() {
    cmd.prompt();
    cmd.once('line', function (selection) {
      selection = parseInt(selection);
      if (!isNaN(selection) && selection >= 0 && selection <= items.length) {
        if (selection === 0) {
          battle.options.cancel();
          readline.moveCursor(process.stdin, 0, -(4 + items.length));
          readline.clearScreenDown(process.stdin);
          if (action === 'attack') {
            showActions();
          }
          if (action === 'cast') {
            showScrolls();
          }
        } else {
          var id = items[selection - 1];
          battle.options.select(items[selection - 1]);
        }
      } else {
        console.log('Incorrect option');
        setTimeout(function () {
          readline.moveCursor(process.stdin, 0, -2);
          readline.clearScreenDown(process.stdin);
          waitForAction();
        }, 500);
      }
    });
  }
}

function showScrolls() {
  var items = battle.options.list();
  console.log('Choose a spell:');
  items.forEach(function (item, index) {
    console.log(
      '[' + (index + 1) + ']', item,
      '(' + battle.options.get(item).cost + ' MP)'
    );
  });
  console.log('\n[0] Cancelar');
  waitForAction();

  function waitForAction() {
    cmd.prompt();
    cmd.once('line', function (selection) {
      selection = parseInt(selection);
      if (!isNaN(selection) && selection >= 0 && selection <= items.length) {
        if (selection === 0) {
          battle.options.cancel();
          readline.moveCursor(process.stdin, 0, -(4 + items.length));
          readline.clearScreenDown(process.stdin);
          showActions();
        } else {
          var id = items[selection - 1];
          battle.options.select(items[selection - 1]);
          readline.moveCursor(process.stdin, 0, -(4 + items.length));
          readline.clearScreenDown(process.stdin);
          showTargets();
        }
      } else {
        console.log('Opción incorrecta');
        setTimeout(function () {
          readline.moveCursor(process.stdin, 0, -2);
          readline.clearScreenDown(process.stdin);
          waitForAction();
        }, 500);
      }
    });
  }
}

function showTurnLine(activeCharacterId) {
  var nameRegExp = new RegExp(activeCharacterId);
  Object.keys(parties).forEach(function (partyId) {
    console.log('Party of the', partyNames[partyId] + ':');
    var characters = parties[partyId];
    characters.forEach(function (charId) {
      var character = battle.characters.get(charId);
      var hp = character.hp;
      var maxHp = character.maxHp;
      var mp = character.mp;
      var maxMp = character.maxMp;
      var deadToken = character.hp === 0 ? '✝' : ' ';
      console.log(
        charId === activeCharacterId ? '>' : deadToken,
        charId,
        hp + '/' + maxHp + ' HP',
        mp + '/' + maxMp + ' MP'
      );
    });
  });
  console.log();
}

function getRandomSetup() {
  var heroMembers = [
    entities.characters.heroTank,
    entities.characters.heroWizard
  ];
  var monsterMembers = getMonsterParty();
  return {
    heroes: {
      members: heroMembers,
      grimoire: [entities.scrolls.health, entities.scrolls.fireball]
    },
    monsters: {
      members: monsterMembers
    }
  };
}

function getMonsterParty() {
  var partySize = Math.floor(Math.random() * 3) + 1;
  var members = [];
  for (var i = 0; i < partySize; i++) {
    members.push(getRandomMonster());
  }
  return members;
}

function getRandomMonster() {
  var monsters = Object.keys(entities.characters).filter(isMonster);
  var randomId = monsters[Math.floor(Math.random() * monsters.length)];
  return entities.characters[randomId];

  function isMonster(id) {
    return id.substr(0, 'monster'.length) === 'monster';
  }
}
