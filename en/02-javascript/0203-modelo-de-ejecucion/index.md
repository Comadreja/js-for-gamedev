# The JavaScript execution model

One of JavaScript's signature features is its **asynchronous execution model**, where results are not immediately available, but will be in the future.

## Scope and _hoisting_

As in so many other languages, the names of variables can be reutilized to store different values, as long as they are located in **different scopes**.

A variable's _scope_ is the segment of code where it can be used. Variables with the same name in different scopes are different variables.

In JavaScript, scope is the **function's body**, demarcated by the pair of braces `{` and `}` which follow the function's parameter list.

```js
function introduction() {
    // This is the variable, text.
    var text = 'I\'m Ziltoid, the Omniscient.';
    greetings();
    console.log(text);
}

function greetings(list) {
    // And this is a different variable, also called text.
    var text = 'Greetings humans!';
    console.log(text);
}

introduction();
```

In JavaScript, functions can be defined within other functions, thereby enabling nested scopes.

Function nesting is useful when we want to use **auxiliar functions**, which are normally short.

```js
function getEven(list) {
    function isEven(n) {
        return n % 2 === 0;
    }
    return list.filter(isEven);
}

getEven([1, 2, 3, 4, 5, 6]);
```

Since the scope is that of the function itself, the same name in a nested function can refer to two things:

1) **If it is used with `var`**, we are referring to **another different variable**:

```js
function introduction() {
    // This is a variable, text.
    var text = 'I\'m Ziltoid, the Omniscient.';

    function greetings(list) {
        // And this is ANOTHER different variable called text.
        var text = 'Greetings humans!';
        console.log(text);
    }

    greetings();
    console.log(text);
}

introduction();
```

In the above case, we say that the variable `text` from the nested function `greetings` _conceals_ the variable `text` from the function `introduction`.

Remember that, in order to introduce a new variable, we have to declare it with `var` before using it (or at the same time we are assigning it).

2) If we skip the word `var`, no new variable is created, but it is the existing one that is **reused**.

```js
function introduction() {
  // This is a variable called text.
  var text = 'I\'m Ziltoid, the Omniscient.';

  function greetings(list) {
    // This is THE SAME variable called text as the one outside.
    text = 'Greetings humans!';
    console.log(text);
  }

  greetings();
  console.log(text);
}

introduction();
```

### _Hoisting_

_Hoisting_, in the context of programming, refers to a mechanism some languages employ in regards to name declaration.

In JavaScript, it makes no difference at which point through a function we declare a variable. JavaScript parses any declaration as occurring at the beginning of the function.

I.e., this:

```js
function f() {
    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++) {
            console.log('i: ', i, ' j: ', j);
        }
    }
}
```

Is equivalent to this:

```js
function f() {
    var i;
    var j;
    for (i = 0; i < 10; i++) {
        for (j = 0; j < 10; j++) {
            console.log('i: ', i, ' j: ', j);
        }
    }
}
```

Do notice that JavaScript **_hoists_ the declaration** of the variable (it takes it to the beginning), not its initialization. That is the reason the following piece of code does not fail, but prints out `undefined`:

```js
function f() {
    console.log(i);
    var i = 5;
}
f();
```

In **strict mode**, using a variable that has not been declared will cause an error.

```js
function f() {
    console.log(i);
    i = 5;
}
f();
```

This is not an issue with **function declarations**: when a function declaration is hoisted, it is hoisted as a whole, _definition included_.

```js
function getEven(list) {
    return list.filter(isEven);

    function isEven(n) {
        return n % 2 === 0;
    }
}

getEven([1, 2, 3, 4, 5, 6]);
```

This allows a way of arranging code that might be clearer, placing auxiliar functions right after the functions that use them.

This way, just from a look at the first line of the function, we can know what it does.

```js
    return list.filter(isEven);
```

And, should we still be in doubt, we can continue to read and look into what the auxiliar function does.

```js
    function isEven(n) {
        return n % 2 === 0;
    }
```

Do notice that for this way of writing code to be clear, the names we use for auxiliar functions must be suitable, descriptive, and give us hints about the value they return.

## _Closures_

Functions are data and are created every time a `function` instruction is found. This way, we can create functions that return functions.

```js
function buildFunction() {
    return function () { return 42; };
}

var f = buildFunction();
var g = buildFunction();

typeof f === 'function';
typeof g === 'function';

f();
g(); // Both functions do the same thing...

f !== g; // ...but are NOT the same function
```

On its own, this is not a very powerful mechanism; but knowing that a nested function can access the variables from higher scopes, we can do something like this:

```js
function newDie(sides) {
  return function () {
    return Math.floor(Math.random() * sides) + 1;
  };
}
var d100 = newDie(100);
var d20 = newDie(20);

d100 !== d20; // different, created in two different newDie calls.

d100();
d20();
```

In JavaScript, functions **retain the access to variables from higher scopes**. A function referring to any variable from a higher scope is called a **_closure_**.

**This does not affect the value of `this`**, which will continue to be the message's addressee.

### Methods, _closures_ and `this`

Consider the following example:

```js
var diceUtils = {
    history: [], // keeps the roll history.

    newDie: function (sides) {
        return function die() {
            var result = Math.floor(Math.random() * sides) + 1;
            this.history.push([new Date(), sides, result]);
            return result;
        }
    }
}
```

Our intent is to be able to create dice and keep a record of all the rolls we make with these dice.

However, this does not work:

```js
var d10 = diceUtils.newDie(10);
d10(); // error!
```

This is so because **`this` is always the message's addressee** and `d10` is being called as if it were a function rather than a method.

Remember that we can make any function take a fixed value as `this` with `.apply()`; so this does work, although it is not very convenient:

```js
d10.apply(diceUtils);
d10.apply(diceUtils);
diceUtils.history;
```

What we need to do is to make it so that the function `die` within `newDie` will refer to the `this` from the higher scope, not its own.

We can achieve this in two different ways. The first is a mere play on variables, storing `this`to an auxiliar variable (in this case, `self`):

```js
var diceUtils = {
    history: [], // keeps the dice record.

    newDie: function (sides) {
        var self = this; // self is now the addressee of newDie.

        return function die() {
            var result = Math.floor(Math.random() * sides) + 1;
            // by using self, we refer to newDie's addressee.
            self.history.push([new Date(), sides, result]);
            return result;
        }
    }
}
```

This does work, and is far more convenient:

```js
var d10 = diceUtils.newDie(10);
var d6 = diceUtils.newDie(6);
d10();
d6();
d10();
diceUtils.history;
```

The seconf way is to use the functions' **[`bind`](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_objects/Function/bind) method**.

A function's `bind` method returns another function whose `this` will be the first parameter of `bind`. Thus:

```js
var diceUtils = {
    history: [], // keeps the dice record.

    newDie: function (sides) {
        return die.bind(this); // a new function that will call die with its addressee set on the first parameter.

        function die() {
            var result = Math.floor(Math.random() * sides) + 1;
            this.history.push([new Date(), sides, result]);
            return result;
        }
    }
}
```

Both forms are widely used, but the first is often seen written this way:

```js
var diceUtils = {
    history: [], // keeps the dice record.

    newDie: function (sides) {
        return function die() {
            var result = Math.floor(Math.random() * sides) + 1;
            this.history.push([new Date(), sides, result]);
            return result;
        }.bind(this); // bind follows the function expression.
    }
}
```

## Modules

This section introduces the **modules** feature, which is specific to Node.

One of the main disadvantages to JavaScript ([until next version](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Statements/import)) is that there is no way of arranging code in modules.

Modules are useful for isolating related functionality: types, functions, constants, configuration…

Node _does have modules_ and, fortunately, there are **tools that simulate modules** like Node's on the browser.

In Node, JavaScript files ending by `.js`are modules. Node allows us to expose or **export functionality** from a module, placing it within the object `module.exports`:

```js
// In diceUtils.js
"use strict"; // sets the module to strict mode.

var history = [];

function newDie(sides) {
    return function die() {
        var result = Math.floor(Math.random() * sides) + 1;
        history.push([new Date(), sides, result]);
        return result;
    };
}

// What is exported is actually the object module.exports!
module.exports.newDie = newDie;
module.exports.history = history;
```

What is actually exported is **always `module.exports`**, which starts out as an empty object:

```js
typeof module.exports;
module.exports;
```

Now we can **import that module** within another:

```js
// In cthulhuRpg.js
"use strict";

var diceUtils = require('./diceUtils');
var d100 = diceUtils.newDie(100);

var howard = {
    sanity: 45,
    sanityCheck: function () {
        if (d100() <= this.sanity) {
            console.log('Horrifying, but I\'ll manage. That was close.');
        } else {
            console.log(
                '¡Ph\'nglui mglw\'nafh Cthulhu R\'lyeh wgah\'nagl fhtagn!');
        }
    }
};
howard.sanityCheck();
```

In order to import one module from another we need to pass to [`require`](https://nodejs.org/api/modules.html#modules_module_require_id) the **relative route** to the module file we want to import.

If we pass a name instead of a route, we will access the **default funcionality** that comes with Node (modules that are part of the standard library, such as `path` or `fs`) or the one we install from third parties (for instance, modules installed with the npm package manager). We shall use this form in a couple of occasions later on.

## Differences in scope between Node and the browser

It has been said that scope in JavaScript is equivalent to the function, but we also know that we can open a console or a file and start declaring variables without any need for writing functions.

This happens because we are using the **global scope**. The global scope is available both to the browser and Node.

```js
// This is a variable called text within the GLOBAL scope.
var text = 'I\'m Ziltoid, the Omniscient.';

// This is a function within the GLOBAL scope.
function greetings(list) {
    // This is ANOTHER variable called text, within the function's scope.
    var text = 'Greetings humans!';
    console.log(text);
}

greetings();
console.log(text);
```

However, there is a peculiarity to Node. The global scope is actually _local in regards to the file_. This means that:

```js
// In a.js, text is only visible from within the FILE.
"use strict";
var text = 'I\'m Ziltoid, the Omniscient.';

// In b.js, text is only visible from within the FILE.
"use strict";
var text = 'Greetings humans!';

// In a console run from the same directory as a & b
require('./a');
require('./b');
text;
```





## Programación asíncrona y eventos

Prueba el siguiente ejemplo (copia, pega y espera 5 segundos):

```js
var fiveSeconds = 5 * 1000; // en milisegundos.

// Esto ocurre ahora.
console.log('T: ', new Date());

setTimeout(function () {
    // Esto ocurre pasados 5 segundos.
    console.log('T + 5 segundos: ', new Date());
}, fiveSeconds);

// Esto ocurre inmediatamente después
console.log('T + delta: ', new Date());
```

Como puedes comprobar, el mensaje se completa pasados 5 segundos porque lo que
hace [`setTimeout`](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setTimeout)
es llamar a la función tan pronto como pasen el número de milisegundos
indicados.

Decimos que una función es un **_callback_** si se llama en algún momento
futuro –es decir, **asíncronamente**– para informar de algún resultado.

En el ejemplo de `setTimeout`, el resultado es que ha pasado la cantidad de
tiempo especificada.

### Eventos

En esta sección veremos el **módulo `readline`**, que es específico de Node.

La programación asíncrona en JavaScript y otros lenguajes se usa para **modelar
eventos**, principalmente esperas por entrada y salida. En otras palabras:
hitos que ocurren pero que no sabemos _cuándo_ ocurren.

La entrada y salida –a partir de ahora IO (del inglés _input / output_)– no
sólo supone lectura de ficheros o peticiones a la red, también incluye esperar
una acción del usuario.

Como ejemplo, vamos a implementar una consola de diálogo por líneas. Usaremos el
módulo [`readline`](https://nodejs.org/api/readline.html), que es parte de la
librería estándar que viene con Node:

```js
// En conversational.js
"use strict";

var readline = require('readline');

var cmd = readline.createInterface({
    input: process.stdin,  // así referenciamos la consola como entrada.
    output: process.stdout, // y así, como salida.
    prompt: '(╯°□°）╯ ' // lo que aparece para esperar la entrada del usuario.
});
```

Lanza ese programa con Node y verás que no hace nada, **pero tampoco termina**.
Esto es típico de los programas asíncronos: el programa queda esperando a que
pase algo. Pulsa `ctrl+c` para terminar el programa.

Ahora prueba:

```js
// Añade al final de conversational.js
console.log('Escribe algo y pulsa enter');
cmd.prompt(); // pide que el usuario escriba algo.

cmd.on('line', function (input) {
    console.log('Has dicho "' + input  + '"');
    cmd.prompt(); // pide que el usuario escriba algo.
});
```

Lo que has conseguido es **escuchar el evento `line`** que se produce
[cada vez que en la entrada se recibe un caracter de cambio de línea](https://nodejs.org/api/readline.html#readline_event_line).

Hablando de eventos, la función que se ejecuta asíncronamente recibe el nombre de
**_listener_**, pero tampoco es raro que se la llame _callback_.

Se habla de "**registrar un _listener_** para un evento", "subscribirse a un
evento" o "escuchar un evento" a utilizar el mecanismo que permite asociar la
ejecución de una función con dicho evento.

Con todo, aún no se puede salir del programa anterior. Necesitamos algunos
cambios más:

```js
// Añade a conversational.js
cmd.on('line', function (input) {
    if (input === 'salir') {
        cmd.close();
    }
});

cmd.on('close', function () {
    console.log('¡Nos vemos!');
    process.exit(0); // sale de node.
});
```

Hemos añadido un segundo _listener_ al evento `line` y **ambos se ejecutarán**.
El primero gestiona el funcionamiento por defecto (que es repetir lo que el
usuario ha introducido) y el segundo trata específicamente el comando `salir`.

Si la línea es exactamente `salir`, cerraremos la interfaz de línea de
comandos. Esto produce un evento `close` y, cuando lo recibamos, utilizaremos el
_listener_ de ese evento para terminar el programa.

El método `on` es un segundo nombre para [`addListener`](https://nodejs.org/api/events.html#events_emitter_addlistener_eventname_listener).

Igual que podemos añadir un _listener_, también podemos eliminarlo con
[`removeListener`](https://nodejs.org/api/events.html#events_emitter_removelistener_eventname_listener),
y quitarlos todos con
[`removeAllListeners`](https://nodejs.org/api/events.html#events_emitter_removealllisteners_eventname).

Podemos escuchar un evento **sólo una vez** con
[`once`](https://nodejs.org/api/events.html#events_emitter_once_eventname_listener).

### Emisores de eventos

Ahora veremos la clase `EventEmitter`, que también es específica de Node.

Los eventos no son un mecanismo estándar de JavaScript. Son una forma
conveniente de modelar determinados tipos de problema, pero un objeto JavaScript,
por sí solo, **no tiene API para emitir eventos**.

En Node contamos con diversas alternativas con el fin de que los objetos emitan
eventos:

- Implementar nuestra propia API de eventos.

- Hacer que nuestros objetos **usen** una instancia de `EventEmitter`.

- Hacer que nuestros objetos **sean instancias** de `EventEmitter`.

La primera supondría crear nuestro propio método `on` y los mecanismos para
emitir eventos. La segunda y la tercera usan la clase
[`EventEmitter`](https://nodejs.org/api/events.html#events_class_eventemitter),
que ya implementa esta API.

Este es un ejemplo de la opción 3 –el cual aprovechamos para repasar la
herencia:

```js
var events = require('events');
var EventEmitter = events.EventEmitter;

function Ship() {
    EventEmitter.apply(this);
    this._ammunition = 'laser charges';
}

Ship.prototype = Object.create(EventEmitter.prototype);
Ship.prototype.constructor = Nave;

var ship = new Ship();
ship.on; // ¡existe!
```

Ahora que la nave puede emitir eventos, vamos a hacer que dispare y que emita un
evento.

```js
Ship.prototype.shoot = function () {
    console.log('PICHIUM!');
    this.emit('shoot', this._ammunition); // parte de la API de EventEmitter.
};

ship.on('shoot', function (ammunition) {
    console.log('CENTRO DE MANDO. La nave ha disparado:', ammunition);
});

ship.shoot();
```

**Emitir un evento** consiste en llamar al método
[`emit`](https://nodejs.org/api/events.html#events_emitter_emit_eventname_arg1_arg2),
que hará que se ejecuten los _listeners_ que escuchan tal evento.

Los eventos son increiblemente útiles para modelar interfaces de usuario de
forma genérica.

Para ello, los modelos deben **publicar** qué les ocurre: cómo cambian, qué
hacen… Todo **a base de eventos**. Las interfaces de usuario se
**suscribirán** a estos eventos y proporcionarán la información visual adecuada.

Este modelo permite además que varias interfaces de usuario funcionen al mismo
tiempo, todas escuchando los mismos eventos. Sin embargo, también permite
dividir la interfaz en otras más especializadas, cada una escuchando un
determinado conjunto de eventos.
