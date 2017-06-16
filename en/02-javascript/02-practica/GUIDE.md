# RPG Battle - Practice guide

The practice guide suggests you an order you can follow so as to successfully accomplish the implementation of the practice's functionality. You should brace yourself, however, for some **heavy JavaScript reading**; also be sure to keep Google, the MDN and StackOverflow handy.

## 1. The data model

There are many types of entities in the game, some related to each other and some unrelated.

The specification for such entities can be found in `spec/entities.js`, and the implementation in `src/entities.js`, `src/Character.js` and `src/items.js`.

### Effects

Perhaps the easiest type is `Effect` in `src/items.js`, which is specified in `spec/entities.js`. Begin from there.

### Characters

Keep enabling the tests related to the type `Character`, and disable the rest.

Next, open up `src/Character.js` and implement the remaining parts.

### Items

Go on with the `src/items.js` module, incrementally enabling the suites for the `Item`, `Weapon` and `Scroll` types you will find in `spec/entities.js`.

### Default entities

You need to create some default characters, weapons and scrolls so that other practices will be able to use them. The _built-in entities_ suite in `spec/entities.js` includes all of the expectations for these entities.

Go to the `src/entities.js` file and complete the remaining ones. Notice that the properties are _getters_, so that every time you access the properties they will return a new character.

## 2. The turn list

This one is easy. The specification can be found in `spec/TurnList.js` and the implementation in `src/TurnList.js`. You only need fill the gaps. It is pure algorithmics. You may have to look at how the `Array.sort()` function works if you do not want to implement your own sorting function.

## 3. The character's view

The character's view is a read-only display of the character's stats. Its specification is contained in `spec/CharactersView.js` and its implementation in `src/CharactersView.js`. You can pick up from there.

## 4. The options set

The options set represents the options that can be chosen at any given time. The specification is contained in `spec/Options.js`, and the near-complete implementation in `src/Options.js`. Notice how the `Options` type extends `EventEmitter`. Your task will be to implement the `.select()` method so that when it is called, an event according to the specification will be emitted.

## 5. The options stack

An RPG is normally made up of several stacked menus. For instance, the action menu gives way to the spell menu, which in turn gives way to the target menu. We can switch to the prior menu at any point. The options stack in `src/OptionsStack.js`, specified in `spec/OptionsStack.js`, reflects this behavior.

The API is the same as for the options set, but the methods are to be redirected to the last stacked menu only. Notice how new menus are stacked and unstacked.

## 6. Utilities

Easy! Nothing to do here, just keep in mind you have the `src/utils.js` module, where you can place more utilities if you find yourself repeating the same code in many places. I suggest you write some kind of test. You can look to the ones that are already in `spec/utils.js` for inspiration.

## 7. The battle

You got to the real meat of the practice. Until now, it was all a matter of preparing the different types the `Battle` type relies on. Now you will have to implement the state machine that controls battle actions: defending, attacking, and spellcasting.

Do notice that the fighters and their weapons and spells **are not the ones that are included by default in `src/entities.js`**, but those that are found in `spec/samplelib.js`.

The battle specification is contained in `spec/Battle.js`, and its implementation in `src/Battle.js`. In order to successfully approach this implementation, it is necessary for all of the tests up to now to pass.

There are no recommendations as to which tests should be enabled first in this part of the practice. You will have to experiment.

Review your code well, many of the exercises consist of giving implementations to **auxiliary functions**. This is the case for:
  + `assignParty`
  + `useUniqueNames`
  + `isAlive`
  + `getCommonParty`

Notice then the `_showAction` function, which will make battle actions available in the `options` attribute.

Now concentrate on actions. The implementation for `_defend` is almost finished. You only need to complete the functions `_improveDefense` and `_restoreDefense` for the calculation of improved defense.

The _defend_ action fills the structure `this._action` with the action's name, identifiers for the active character and the target, its effect, and the new defense value. All save for defense are necessary in order to be able to call the function `_executeAction`, which will execute the action and report the result.

During the process of implementing actions, you will also need to implement `_showTargets` and `_showScrolls` in a similar way, according to the specification and to the [header](index.md).

## 8. Code quality

When you are done and all of your tests check out green, you will have finished the practice.

Mark the branch with a _tag_ or switch branches before proceeding to improve the code's quality.

Now read any style errors the test command can provide, and run the tests every time you make any alterations in order to make sure you have not broken anything.

## End

Congratulations! You have finished the practice.
