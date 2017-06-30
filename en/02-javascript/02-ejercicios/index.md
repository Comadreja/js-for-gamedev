# Guided exercises

Test these examples and try to answer the questions. If you get stuck guessing what a function does, search the Internet for the function, followed by "mdn".

**1. Booleans in JavaScript.**

In JavaScript, any value can be considered true or false depending on context. For instance, `0` is considered `false`, and any number different than `0` is `true`:

```js
var v = 0; // after this test, change the value of v for another number.
!!v; // a double negation at the beginning turns it into a boolean.
```

Find out which values are true and which are false for all types: numbers, strings, objects, functions, and undefined.

**2. Boolean expressions in JavaScript.**

In JavaScript, boolean expressions are _vague_; this means we stop evaluating as soon as the JavaScript interpreter knows what the expression is going to equal. For instance, what do you think will happen to the following expression?

```js
var hero = { name: 'Link', weapon: null };
console.log('Hero weapon power is:', hero.weapon.power);
```

Then again, what now?

```js
var hero = { name: 'Link', weapon: null };
if (hero.weapon && hero.weapon.power) {
  console.log('Hero weapon power is:', hero.weapon.power);
} else {
  console.log('The hero has no weapon.');
}
```

In the case of `&&` (_and_) expressions, evaluation ends as soon as we find a false term.

In the case of `||` (_or_) expressions, evaluation ends as soon as we find a true term.

**3. The result of a boolean expression.**

Counter to common sense, the result of a boolean expression is not a boolean, but the last evaluated term. Remember, evaluation is _vague_ and JavaScript stops evaluating as soon as it can determine the expression's result. Keeping this in mind, try to predict the result of the following expressions:

```js
var v;
function noop() { return; };

1 && true && { name: 'Link' };
[] && null && "Spam!";
null || v || noop || true;
null || v || void "Eggs!" || 0;
```

**4. Default parameters.**

You can see a real application of the above in this number-filling function. There are no default parameters in JavaScript, but skipped parameters have the special value `undefined`, which is false.

```js
function pad(target, targetLength, fill) {
  var result = target.toString();
  var targetLength = targetLength || result.length + 1;
  var fill = fill || '0';
  while (result.length < targetLength) {
    result = fill + result;
  }
  return result;
}

// try to predict the result of the following calls
pad(3);
pad(2, 5);
pad(2, 5, '*');
```

**5. Best practices in API design.**

It is often said that the state should not be made explicit, but this modeling for points always ends up as an example:

```js
var p = { x: 5, y: 5 };

function scale(point, factor) {
  point.x = point.x * factor;
  point.y = point.y * factor;
  return p;
}

scale(p, 10);
```

The correct implementation would be:

```js
var p = {
  _x: 5,
  _y: 5,
  getX: function () {
    return this._x;
  },
  getY: function () {
    return this._y;
  },
  setX: function (v) {
    this._x = v;
  },
  setY: function (v) {
    this._y = v;
  }
};

function scale(point, factor) {
  point.setX(point.getX() * factor);
  point.setY(point.getY() * factor);
  return p;
}

scale(p, 10);
```

Though we have to admit, writing so much is a royal pain.

**7. Computed properties to the rescue.**

JavaScript allows the definition of a special type of properties, usually called _computed properties_, in this fashion:

```js
var p = {
  _x: 5,
  _y: 5,
  get x() {
    return this._x;
  },
  get y() {
    return this._y;
  },
  set x(v) {
    this._x = v;
  },
  set y(v) {
    this._y = v;
  }
};

function scale(point, factor) {
  point.x = point.x * factor;
  point.y = point.y * factor;
  return p;
}

scale(p, 10);
```

Writing that is still a chore (good thing you have studied how to create object factories!), but using it is much clearer. This way, should you decide now that it would be better to show the names of the X/Y axes in caps, you can do this:

```js
var p = {
  _x: 5,
  _y: 5,
  get X() {
    return this._x;
  },
  get Y() {
    return this._y;
  },
  set X(v) {
    this._x = v;
  },
  set Y(v) {
    this._y = v;
  }
};

function scale(point, factor) {
  point.X = point.X * factor;
  point.Y = point.Y * factor;
  return p;
}

scale(p, 10);
```

Can you guess the way to make a property read-only? That is to say, for its value to be unchangeable (assuming the user will not access any properties beginning by `_`)?

If you wanted to add a property to an already existing object, you would have to use [Object.defineProperty()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty):

```js
var point = {};
Object.defineProperty(point, '_x', { value: 5, writable: true });
Object.defineProperty(point, '_y', { value: 5, writable: true });
Object.defineProperty(point, 'x', {
  get: function () {
    return this._x;
  },
  set: function (v) {
    this._x = v;
  }
});
Object.defineProperty(point, 'y', {
  get: function () {
    return this._y;
  },
  set: function (v) {
    this._y = v;
  }
});
point; // no properties are appreciable...
point.x; // ...but here they are.
point.y;
```

Dare you explain why, when we inspect the object, its properties are not displayed? How would you fix it? What would you do so that only the properties which are a part of the API can be seen?

Do not just go and use `Object.defineProperty()` unless you have a **very clear notion** of what the terms **configurable**, **enumerable** and **writable** mean.

**7. Using functions in lieu of methods.**

We have seen how any function can be used as a method if it is referenced as an object's property and then called. But the fact of the matter is, you can also make any function (regardless of whether it is referenced from a property) work as an object's method if you explicitly designate the target object. This can be done with [`.apply()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply) and [`.call()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call).

```js
var ship = { name: 'Death Star' };

function fire(shot) {
  console.log(this.name + ' is firing: ' + shot.toUpperCase() + '!!!');
}

ship.fire; // what do you think this is?
fire.apply(ship, ['voip']);
fire.call(ship, 'pew');
```

What is the difference between `.apply()` and `.call()`?

**8. Dynamic properties.**

The bracketed notation for accessing an object's properties is especially useful for accessing properties in a generic way. For instance, picture the following piece of code:

```js
var hero = {
  name: 'Link',
  hp: 10,
  stamina: 10,
  weapon: { name: 'sword', effect: { hp: -2 } }
};
var enemy = {
  name: 'Ganondorf',
  hp: 20,
  stamina: 5,
  weapon: { name: 'wand', effect: { hp: -1, stamina: -5 } }
};

function attack(character, target) {
  if (character.stamina > 0) {
    console.log(character.name + ' uses ' + character.weapon.name + '!');
    applyEffect(character.weapon.effect, target);
    character.stamina--;
  } else {
    console.log(character.name + ' is too tired to attack!');
  }
}

function applyEffect(effect, target) {
  // Obtains names of object properties. Look it up on the MDN.
  var propertyNames = Object.keys(effect);
  for (var i = 0; i < propertyNames.length; i++) {
    var name = propertyNames[i];
    target[name] += effect[name];
  }
}

attack(hero, enemy);
attack(enemy, hero);
attack(hero, enemy);
attack(enemy, hero);
attack(hero, enemy);
```

Could you modify the hero's weapon effect so that it can incapacitate the enemy, but not kill him or damage him? Try to do it without rewriting the whole example, i.e., picking up from where the example ends.

**9. Objects as something more than objects.**

JavaScript objects do not only serve the purpose of modeling object-oriented programming objects, but also allow classifications by name. A histogram, i.e. a count of a set with repetitions, is a textbook example of the versatility of JavaScript objects:

```js
function wordHistogram(text) {
  var wordList = text.split(' ');
  var histogram = {};
  for (var i = 0; i < wordList.length; i++) {
    var word = wordList[i];
    if (!histogram.hasOwnProperty(word)) {
      histogram[word] = 0;
    }
    histogram[word]++;
  }
  return histogram;
}
```

Try to use the function by yourself.

What JavaScript calls objects is known in other programming languages as maps or dictionaries, and property names are also known as _keys_.

Can you think of at least one more application?

**10. Functions as parameters.**

JavaScript lists have some methods which accept functions as parameters, for instance [`.forEach()`](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/Array/forEach). In fact, `.forEach()` is commonly found whenever there is the certainty that we are going to go over **all** of the elements in a list.

```js
function wordHistogram(text) {
  var wordList = text.split(' ');
  var histogram = {};
  wordList.forEach(function (word) {
    if (!histogram.hasOwnProperty(word)) {
      histogram[word] = 0;
    }
    histogram[word]++;
  });
  return histogram;
}

var poem = 'All passes and all remains, ' +
           'but \'tis our lot to pass, ' +
           'pass by making pathways, ' +
           'pathways o\'er the sea';

wordHistogram(poem);
```

The result is not correct, since by separating words by their spaces you are leaving out characters that are not part of the words themselves. You can fix this if, rather than splitting the text by the spaces, you use a [regular expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions) in order to split the text by the words' ends:

```js
function wordHistogram(text) {
  var wordList = text.split(/\b/); // The thing between / / is a regular expression.
  var histogram = {};
  wordList.forEach(function (word) {
    if (!histogram.hasOwnProperty(word)) {
      histogram[word] = 0;
    }
    histogram[word]++;
  });
  return histogram;
}

var poem = 'All passes and all remains, ' +
           'but \'tis our lot to pass, ' +
           'pass by making pathways, ' +
           'pathways o\'er the sea';

wordHistogram(poem);
```

But now you will have things that are not words, such as spaces and commas. You can filter a list by using [`.filter()`](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/Array/filter):

```js
function isEven(n) { return n % 2 === 0; }
[1, 2, 3, 4, 5, 6].filter(isEven);
```

And thus remove anything which is not a word:

```js
function isWord(candidate) {
  return /\w+/.test(candidate);
}

function wordHistogram(text) {
  var wordList = text.split(/\b/);
  wordList = wordList.filter(isWord);
  var histogram = {};

  wordList.forEach(function (word) {
    if (!histogram.hasOwnProperty(word)) {
      histogram[word] = 0;
    }
    histogram[word]++;
  });
  return histogram;
}

var poem = 'All passes and all remains, ' +
           'but \'tis our lot to pass, ' +
           'pass by making pathways, ' +
           'pathways o\'er the sea';

wordHistogram(poem);
```

You should also normalize the words (making them all-lowercase, for instance) so as to avoid finding different histogram entries for the same word. In order to transform a list into another list with the same amount of items, we use [`.map()`](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/Array/map).

```js
function isWord(candidate) {
  return /\w+/.test(candidate);
}

function toLowerCase(word) {
  return word.toLowerCase();
}

function wordHistogram(text) {
  var wordList = text.split(/\b/);
  wordList = wordList.filter(isWord);
  wordList = wordList.map(toLowerCase);
  var histogram = {};

  wordList.forEach(function (word) {
    if (!histogram.hasOwnProperty(word)) {
      histogram[word] = 0;
    }
    histogram[word]++;
  });
  return histogram;
}

var poem = 'All passes and all remains, ' +
           'but \'tis our lot to pass, ' +
           'pass by making pathways, ' +
           'pathways o\'er the sea';

wordHistogram(poem);
```

One last function allows us to transform a list into a single value. This is precisely the histogram, a classification of all of the values in the list. This transformation is achieved by using [`.reduce()`](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/Array/reduce):

```js
function isWord(candidate) {
  return /\w+/.test(candidate);
}

function toLowerCase(word) {
  return word.toLowerCase();
}

function buildHistogram(inProgressHistogram, word) {
  if (!inProgressHistogram.hasOwnProperty(word)) {
    inProgressHistogram[word] = 0;
  }
  inProgressHistogram[word]++;
  return inProgressHistogram;
}

function wordHistogram(text) {
  var emptyHistogram = {};
  return text.split(/\b/)
             .filter(isWord)
             .map(toLowerCase)
             .reduce(buildHistogram, emptyHistogram);
}

var poem = 'All passes and all remains, ' +
           'but \'tis our lot to pass, ' +
           'pass by making pathways, ' +
           'pathways o\'er the sea';

wordHistogram(poem);
```

**11. Variable parameter counts.**

Check this out:

```js
console.log('I\'m', 'Ziltoid');
console.log('I\'m', 'Ziltoid,', 'the', 'Omniscient');
Math.max(1);
Math.max(1, 2);
Math.max(1, 2, 3);
```

As you can see, the function accepts any amount of variables. We can do the same thanks to the implicit variable, `arguments`.

```
function f() {
  console.log('Amount of arguments passed:', arguments.length);
  console.log('Arguments:', arguments);
}
f();
f(1);
f('a', {});
f(function () {}, [], undefined);
```

Look up the info on `arguments` on the [MDN](http://lmgtfy.com/?q=mdn+arguments). You will need it!

**12. Decorators.**

Aside from being returned as parameters, functions can be returned from other functions. Consider the following example:

```js
function newLog(label) {
  return function(value) {
    console.log(label + ':', value);
  }
}
```

This function creates other functions that will call `console.log()`, but with a tag preceding it. We could create `log` methods on a class-by-class basis, each with a prefix, and thus be able to tell different logs from each other.

However, do notice the following behavior:

```js
var log1 = newLog('Default');
var log2 = newLog('Ziltoid');

var p = { x: 1, y: 10 };
log1(p);
log2(p);
log1('Greetings', 'humans!');
```

What is the problem? Why is the last example not working?

To make it work, you would need to call `console.log()` with a number of parameters we do not know beforehand. You can use `arguments`, however:

```js
function newLog(label) {
  return function() {
    // Why do we have to do this?
    var args = Array.prototype.slice.call(arguments);
    args.splice(0, 0, label + ':');
    console.log.apply(console, args);
  }
}

var log1 = newLog('Default');
var log2 = newLog('Ziltoid');

var p = { x: 1, y: 10 };
log1(p);
log2(p);
log1('Greetings', 'humans!');
```

Can you tell what each line in the `newLog` function does?

**13. Asynchrony and closures.**

Load up the following code:

```js
function scheduleTasks(count) {
  for(var i = 1; i <= count; i++) {
    setTimeout(function () {
      console.log('Executing task', i);
    }, i * 1000);
  }
}
```

And try to predict what will happen when you run the following code:

```js
scheduleTasks(5);
```

Did it do what you expected? If not, why? How would you fix it? Here goes a clue: you need the [`.bind()`](
https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_objects/Function/bind) function.

**14. Events and methods.**

There will be occasions when you will need to call a method from an object when something happens. For instance, suppose that the 'advance' method of a given object has to be called within an interval. Shall we say, every second:

```js
var obj = {
  x: 10,
  y: 2,
  advance: function () {
    this.y += 2;
    console.log('Now Y equals', this.y);
  }
};

var id = setInterval(obj.advance, 1 * 1000);
```

This example fails because in the last line **we are not calling** the function, but only passing it as a parameter. The `setInterval` function has no idea of the message's target, and therefore cannot call the function as if it were a method.

We can fix this with `bind`, but first you need to stop the interval with:

```js
clearInterval(id);
```

You can solve the issue with:

```js
var id = setInterval(obj.advance.bind(obj), 1 * 1000);
```

**15. The bind() function.**

At this stage, you should already know how `bind` works, or what it does. If you are not too clear on that, look it up on the MDN.

Your task is the following: create a `bind` function that simulates the behaviour of `.bind()` functions' method. Since what is requested is a function and not a method, the first parameter will be the function. Therefore, instead of using it this way:

```js
function die(sides) {
  var result = Math.floor(Math.random() * sides) + 1;
  this.history.push(result);
  return result;
}
var obj = { history: [] };
var d20 = die.bind(obj, 20);
d20();
```

You will be using it this other way:

```js
function die(sides) {
  var result = Math.floor(Math.random() * sides) + 1;
  this.history.push(result);
  return result;
}
var obj = { history: [] };
var d20 = bind(die, obj, 20); // notice that now die is the first parameter
d20();
```
