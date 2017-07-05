# RPG Battle

Your main objectives for this practice will be **to get accustomed to reading JavaScript code** and **to practice the implementation of models and algorithms**.

Your secondary objective will be to practice the **_TDD_** (test-driven development) methodology.

## Installation and tests

**Download the <a href="start-here.zip" target="_blank">project's starter framework</a>** and decompress it. On a console, go to the project's root directory (where the `package.json` file is located) and launch:

```js
npm install
```

Now you can run tests with this:

```js
npm test
```

The practice will not be done until you pass the tests with 0 errors and 0 pending specifications:

```
$ npm test

> pvli2017-rpg-battle@1.0.0 test /Users/salva/workspace/pvli2017-rpg-battle
> node ./node_modules/gulp/bin/gulp.js test

[09:43:57] Using gulpfile ~/workspace/pvli2017-rpg-battle/gulpfile.js
[09:43:57] Starting 'lint'...
[09:43:57] Finished 'lint' after 71 ms
[09:43:57] Starting 'test'...
[09:43:57] Finished 'test' after 41 ms
........................................................................................
88 specs, 0 failures
Finished in 0.4 seconds
```

## Code quality

This project will expect your code to meet certain quality standards. The set of restrictions follow the [ESLint-recommended specification](http://eslint.org/docs/rules/), with two alterations:
- The _camelCase_ style must be used for identifiers.
- Single quotes must be used for strings.
- Operands and operators must be separated by spaces.
- Lines longer than 100 characters are not allowed.
- Functions with more than 40 statements are not allowed.

Ultimately, those rules are there to make programs easier to read. The best recommendation you can follow is to do things the way you have seen them done; when you contribute to someone else's code, watch and copy.

The last two rules are conceived to prevent you from writing excessively long functions, whether horizontally or vertically. Keep in mind we have limited the number of statements, not lines, so the following example really only has 4 statements:

```js
function f() {
  var x = 1;
  var y = 2;
  return x + g(y);

  function g(n) {
    return n * n;
  }
}
```

The program in charge of checking the code's style is called _linter_ and is run automatically alongside the tests. An error displays like this:

```js
/Users/salva/workspace/pvli2017-rpg-battle/src/TurnList.js
  15:8  error  Identifier 'snake_case' is not in camel case  camelcase
```

That is where the error is indicated; by file path, line, and column (in the `line:column` format).

## Practice methodology and guide

Before you start, read the document [TDD.md](./TDD.md) and the practice guide [GUIDE.md](./GUIDE.md). The former introduces the methodology you will follow in order to develop the practice; the latter shows you a sensible test-enabling order so that you can complete the practice successfully.

## Battle description

The practice's objective is to create **a library that models the functioning of an RPG battle**.

The fighters in the battle are characters on opposing sides that will fight each other. When the only characters standing belong to the same side, their side will be declared the victor.

At the start of the battle, the characters will be sorted by initiative from highest to lowest, and their turns will follow in succession in that order until only one side's characters are standing. If a character is dead, that is to say, her hit points are 0, her turn is skipped.

When a character's turn comes, she can choose between three actions: defending, attacking, or casting a spell.

If she defends, her defense will be raised by 10%. Defense is important because it affects the way a character blocks weapon or spell effects.

If she attacks, she will do so against a target character, who will receive a defense die roll. If the target succeeds in this roll, she will not receive any effect; however, should she fail, she will receive the full damage for the attacking weapon.

Finally, if she chooses to cast a spell, she will have to select the spell and then a target. Spells are located in a grimoire that is common to the character's side, and they consume mana points. If the character has insufficient mana for a spell, she cannot use it.

## The sides of the battle

Sides have an identifier, members, and spells. The set of spells available to a side is called its grimoire. For instance, the structure:

```js
var setup = {
  heroes: {
    members: [heroTank, heroWizard],
    grimoire: [fire, health]
  },
  monsters: {
    members: [fastEnemy],
    grimoire: [fire, health]
  }
};
```

Contains two sides with the identifiers `heroes` and `monsters`. The `heroes` side has only two members, `heroTank` and `heroWizard`; the `monsters` side has only one, `fastEnemy`. Both sides have grimoires containing the spells `fire` and `health`.

## The characters

Characters have a **name**, an **optional side** and a series of characteristics that determine their battle power. These characteristics are initiative, defense, hit points, mana points, and maximum hit points and mana points.

**Initiative** determines the order in which characters are placed in the turn list. The higher it is, the sooner they appear in the list.

**Defense** determines the probablity (from 0 to 100) that an [effect](#effects) will apply to the character.

**Mana points** pay the magic cost for spells, and **hit points** mark how much damage the character can take before dying (0 hit points) Both characteristics are respectively linked to **maximum mana points** and **maximum hit points**, which they cannot exceed.

The following table summarizes numeric characteristics and their limits.

| Characteristic | Minimum | Maximum | Limited by           |
|:---------------|--------:|--------:|:--------------------:|
| Initiative     |       0 |       - |                    - |
| Defense        |       0 |     100 |                    - |
| Hit points     |       0 |       - | Maximum hit points   |
| Mana points    |       0 |       - | Maximum mana points  |

## The actions

If a character chooses to **defend** during her turn, she will enter an improved defense status where her defense is raised by 10% (rounded up). A character can defend as many times as she may want to, raising her defense during every turn she defends, but she will lose her improvement as soon as another character attacks her.

If she chooses to **attack**, she will have to choose a target character from among all of the remaining living characters in the battle. The character will inflict her weapon effect on the target, according to the [effect application rules](#effect-rules).

Lastly, a character may **cast a spell**, in which case she must choose a spell she can afford on her side's grimoire, as well as a target. Again, the spell effect follows the [effect application rules](#effect-rules).

## Effects

Both weapons and spells contain effects. A weapon contains an effect that **always reduces hit points**, while spells may have various effects. Save for the character's name and side, **all characteristics are liable to alteration due to effects**.

### Effect rules

Effect rules expect any effect, a target, and an allegiance marker that designates whether the effect is applied by an ally of the target or not.

The procedure is as follows:

  1. If the allegiance marker indicates that they are allies, go to step 2.
  Else:
   1. Generate a random number from 1 to 100.
   2. If the result is lower than or equal to the target's defense, skip these steps. Else, go to step 2.
  2. For each characteristic affected by the effect:
   1. Add the effect value to the value of the target's characteristic.
   2. Correct the value so that it lies between 0 and the maximum allowed for that characteristic, if there is one.

## Weapons and spells

Weapons and spells are items with effects. The substantial difference between them is that spells have a mana point cost for the caster. This cost applies, no matter whether the target defends successfully or not.

Spell effects can be varied, just like those of weapons, but weapon effects need to reduce hit points in some way.

## The battle API

The battle has the following methods:
  + `setup` establishes the startup configuration, as previously shown.
  + `start` commences the battle.
  + `stop` stops the battle.

In addition, the battle exposes the following attributes:
  + `characters` to inspect the characters' status.
  + `scrolls` to inspect the spells' status.
  + `options` to control the battle.

The battle will emit the following events:
  + `start` alongside the fighters' identifiers by sides, at the beginning of the battle.
  + `turn` alongisde turn info, every time a character gets one.
  + `info` with the result of an action.
  + `end` when there is only one side standing.

In any case, the context object is the `Battle`.

## The control interface

Controlling the course of the battle consists of choosing what will happen on each turn. To do this, you will have to subscribe to the `turn` event, and choose from among the alternatives offered in `options`:

```js
var battle = new Battle(setup);
battle.on('turn', function (turn) {

  // The heroes damage the first available enemy.
  if (turn.party === 'heroes') {
    this.options.select('attack');
    var candidates = this.options.list();
    var monsters = candidates.filter(isMonster.bind(this));
    this.options.select(monsters[0]);
  }

  // The monsters only defend.
  if (turn.party === 'monsters') {
    this.options.select('defend');
  }

  function isMonster(charId) {
    return this.characters.get(charId).party === 'monsters';
  }
});
battle.start();
```

### The options

On each turn, the initial options will be: `defend`, `attack`, and `cast`.

On choosing `defend`, the rules for the action "defend" are applied and we move on to the next turn.

If `attack` is chosen, the following options have to show the character identifiers so that a target can be selected. When the target is selected, the action "attack" is executed and we move on to the next turn.

If `cast` is chosen, the options following it will be to show the available spells (which may be none), and then the target list. Again, on selecting a target, the "cast spell" action is executed and we move on to the next turn.

### Identifier forming rules

Character identifiers cannot be their names, since these could be repeated. If a side in a battle had two bat characters with the name `Bat`, their identifiers would be `Bat` and `Bat 2`. The identifier forming rules are:

  1. Scan through all of the sides. For each side:
    1. Scan through all of the members. For each member:
      1. Retrieve the character's name and check whether it is in the name histogram.
      2. If it is not, add it with the value 0.
      3. Retrieve the value for the name from the name histogram.
      4. If it is 0, the identifier is the name.
      5. If it is greater than 0, the identifier is the name followed by a space and its value in the histogram plus 1.
      6. Increase the histogram value by 1.
      7. Assign that identifier to the character.
