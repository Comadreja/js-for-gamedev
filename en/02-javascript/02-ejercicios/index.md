# Guided exercises

Test these examples and try to answer the questions. If you get stuck on what a function does, search the Internet for the function followed by "mdn".

**1. Booleans in JavaScript.**

In JavaScript, any value can be considered true or false depending on context. For instance, `0` is considered `false`, and any number different than `0` is `true`:

```js
var v = 0; // after this test, change the value of v for another number.
!!v; // a double negation at the beginning turns it into a boolean.
```

Find out which values are true and which are false for all types: numbers, strings, objects, functions, and undefined.

**2. Boolean expressions in JavaScript.**

In JavaScript, boolean expressions are _vague_; this means as soon as the JavaScript interpreter knows what the expression is going to be equal to, we stop evaluating. For instance, what do you think will happen to the following expression?

```js
var hero = { name: 'Link', weapon: null };
console.log('Hero weapon power is:', hero.weapon.power);
```

But, now what?

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

Counter to common sense, the result of a boolean expression is not a boolean, but the last evaluated term. Remember, evaluation is _vague_ and JavaScript stops evaluating as soon as it can determine the expression's result. With this in mind, try to predict the result of the following expressions:

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

**5. Good practices in API design.**

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

Got to admit it though, writing so much is a royal pain.

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

Writing that is still a chore (good thing you have studied how to create object factories!), but using it is much clearer. This way, should you decide now that it would be better to show the names of the axes in caps, you can do this:

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

Can you think of the way to make a property read-only? That is to say, for its value to be unchangeable (assuming the user will not access any properties beginning by `_`)?

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

Would you dare say why, when we inspect the object, its properties are not displayed? How would you fix it? What would you do so that only the properties which are a part of the API can be seen?



No te lances a usar `Object.defineProperty()` si no tienes **muy claro** qué
significan los términos **configurable**, **enumerable** y **writable**.

**7. Usando funciones como si fueran métodos.**

Hemos visto que cualquier función puede usarse como un método si se referencia
como una propiedad de un objeto y entonces se llama. Pero lo cierto es que
también puedes hacer que una función cualquiera, sin estar referenciada desde
una propiedad, pueda ser usada como el método de un objeto si indicamos
explícitamente cual es el objeto destinatario. Esto puede hacerse con
[`.apply()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply)
y con
[`.call()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call).

```js
var ship = { name: 'Death Star' };

function fire(shot) {
  console.log(this.name + ' is firing: ' + shot.toUpperCase() + '!!!');
}

ship.fire; // ¿qué crees que será esto?
fire.apply(ship, ['pichium']);
fire.call(ship, 'pañum');
```

¿Cuál es la diferencia entre `.apply()` y `.call()`?

**8. Propiedades dinámicas.**

La notación corchete para acceder a las propiedades de un objeto es
especialmente útil para acceder a propiedades de manera genérica. Por ejemplo,
imagina el siguiente código:

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
  // Obtiene los nombres de las propiedades del objeto. Búscalo en la MDN.
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

¿Podrías modificar el efecto del arma del héroe para incapacitar al enemigo pero
no matarlo ni dañarlo? Intenta hacerlo sin reescribir el ejemplo entero, es
decir, continuando desde el término del ejemplo.

**9. Objetos como algo más que objetos.**

Los objetos de JavaScript no solo sirven para modelar los objetos de la
programación orientada a objetos sino que permiten realizar clasificaciones por
nombre. Un histograma, es decir un conteo de un conjunto con repeticiones, es
un ejemplo clásico de la utilidad de un objeto JavaScript:

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

Prueba a usar la función por ti mismo.

Lo que JavaScript llama objetos se conoce en otros lenguajes de programación
como mapas o diccionarios y a los nombres de las propiedades se los llama
_claves_.

¿Puedes pensar en al menos una aplicacion más?

**10. Funciones como parámetros.**

Las listas de JavaScript tiene algunos métodos que aceptan funciones como
parámetros, por ejemplo
[`.forEach()`](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/Array/forEach).
De hecho es común encontrar `.forEach()` cuando se tiene la certeza de que se
van a recorrer **todos** los elementos de una lista.

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

var poem = 'Todo pasa y todo queda, ' +
           'pero lo nuestro es pasar, ' +
           'pasar haciendo caminos, ' +
           'caminos sobre la mar';

wordHistogram(poem);
```

El resultado no es correcto porque al separar las palabras por los espacios
estás dejando caracteres que no forman palabras como parte de ellas. Puedes
arreglarlo si en vez de partir el texto por los espacios usas una
[expresión regular](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions)
para partir el texto por los límites de las palabras:

```js
function wordHistogram(text) {
  var wordList = text.split(/\b/); // Eso entre / / es una expresión regular.
  var histogram = {};
  wordList.forEach(function (word) {
    if (!histogram.hasOwnProperty(word)) {
      histogram[word] = 0;
    }
    histogram[word]++;
  });
  return histogram;
}

var poem = 'Todo pasa y todo queda, ' +
           'pero lo nuestro es pasar, ' +
           'pasar haciendo caminos, ' +
           'caminos sobre la mar';

wordHistogram(poem);
```

Pero ahora tendrás cosas que no son palabras (como espacios y comas). Puedes
filtrar una lista con
[`.filter()`](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/Array/filter):

```js
function isEven(n) { return n % 2 === 0; }
[1, 2, 3, 4, 5, 6].filter(isEven);
```

Y así quitar lo que no sean palabras:

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

var poem = 'Todo pasa y todo queda, ' +
           'pero lo nuestro es pasar, ' +
           'pasar haciendo caminos, ' +
           'caminos sobre la mar';

wordHistogram(poem);
```

También deberías normalizar las palabras (pasarlas a minúsculas por ejemplo)
para no encontrarnos con entradas distintas en el histograma para la misma
palabra. Para transformar una lista en otra lista con el mismo número de
elementos usamos
[`.map()`](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/Array/map).

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

var poem = 'Todo pasa y todo queda, ' +
           'pero lo nuestro es pasar, ' +
           'pasar haciendo caminos, ' +
           'caminos sobre la mar';

wordHistogram(poem);
```

Una última función te permite transformar una lista en un sólo valor. Esto es
precisamente el histograma, una clasificación de todos los valores de la lista.
Esta transformación se consigue mediante
[`.reduce()`](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/Array/reduce):

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

var poem = 'Todo pasa y todo queda, ' +
           'pero lo nuestro es pasar, ' +
           'pasar haciendo caminos, ' +
           'caminos sobre la mar';

wordHistogram(poem);
```

**11. Número variables de parámetros**

Fíjate en esto:

```js
console.log('I\'m', 'Ziltoid');
console.log('I\'m', 'Ziltoid,', 'the', 'Omniscient');
Math.max(1);
Math.max(1, 2);
Math.max(1, 2, 3);
```

Como puedes ver, la función acepta un número cualquiera de variables. Podemos
hacer lo mismo gracias a la variable implícita `arguments`.

```
function f() {
  console.log('Número de argumentos pasados:', arguments.length);
  console.log('Argumentos:', arguments);
}
f();
f(1);
f('a', {});
f(function () {}, [], undefined);
```

Busca la información sobre `arguments` en la
[MDN](http://lmgtfy.com/?q=mdn+arguments). ¡Te hará falta!

**12. Decoradores**

Aparte de devolverse como parámetros, las funciones pueden ser devueltas desde
otras functiones. Considera el siguiente ejemplo:

```js
function newLog(label) {
  return function(value) {
    console.log(label + ':', value);
  }
}
```

Esta función crea funciones que llamarán a `console.log()` pero con una
etiqueta delante. Podríamos crear métodos `log` por clase, cada uno con
un prefijo y así distinguir unos logs de otros.

Sin embargo, advierte el siguiente comportamiento:

```js
var log1 = newLog('Default');
var log2 = newLog('Ziltoid');

var p = { x: 1, y: 10 };
log1(p);
log2(p);
log1('Greetings', 'humans!');
```

¿Cual es el problema? ¿Por qué no funciona el último ejemplo?

Para hacer que funcione, tendrías que llamar a `console.log()` con un número
de parámetros que no sabemos a priori. Puedes usar `arguments`, no obstante:

```js
function newLog(label) {
  return function() {
    // ¿Por qué tenemos que hacer esto?
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

¿Podrías decir qué hace cada línea en la función `newLog`?

**13. Asincronía y closures**

Carga el siguiente código:

```js
function scheduleTasks(count) {
  for(var i = 1; i <= count; i++) {
    setTimeout(function () {
      console.log('Executing task', i);
    }, i * 1000);
  }
}
```

Y trata de predecir qué pasará al ejecutar el siguiente código:

```js
scheduleTasks(5);
```

¿Hace lo que esperabas? Si no es así, ¿por qué? ¿cómo lo arreglarías? Pista:
necesitas la función [`.bind()`](
https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_objects/Function/bind).

**14. Eventos y métodos**

Habrá veces en las que tendrás que llamar a un método de un objeto cuando ocurra
algo. Por ejemplo, supón que el método avanzar de un supuesto objeto debe
llamarse en un intervalo de tiempo. Pongamos cada segundo:

```js
var obj = {
  x: 10,
  y: 2,
  advance: function () {
    this.y += 2;
    console.log('Ahora Y vale', this.y);
  }
};

var id = setInterval(obj.advance, 1 * 1000);
```

Este ejemplo falla porque en la última línea **no estamos llamando** a la
función sino sólo pasándola como parámetro. La función `setInterval` no
tiene idea del destinatario del mensaje y por tando no puede llamar a la función
como si fuera un método.

Podemos arreglarlo con `bind` pero antes para el intervalo con:

```js
clearInterval(id);
```

Puedes solucionar el problema con:

```js
var id = setInterval(obj.advance.bind(obj), 1 * 1000);
```

**15. La función bind()**

A estas alturas ya deberías saber cómo funciona `bind` o qué hace. Si aun no
lo tienes claro, búscalo en la MDN.

La tarea es la siguiente: crea una función `bind` que simule el comportamiento
del método de las funciones `.bind()`. Como se pide una función y no un método,
el primer parámetro será la función. Así pues, en vez de usarse así:

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

La usarás de esta otra forma:

```js
function die(sides) {
  var result = Math.floor(Math.random() * sides) + 1;
  this.history.push(result);
  return result;
}
var obj = { history: [] };
var d20 = bind(die, obj, 20); // fíjate en que ahora die es el primer parámetro
d20();
```
