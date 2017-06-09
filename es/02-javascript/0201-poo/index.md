# Object-oriented programming

> OOP to me means only messaging, local retention and protection and
> hiding of state-process, and extreme late-binding of all things.

[Alan Kay on object-oriented programming](http://userpage.fu-berlin.de/~ram/pub/pub_jf47ht81Ht/doc_kay_oop_en)

## Problem modeling

Programming is expressing a problem in a given programming language. Modeling represents a halfway step of the process, where the important aspects of a problem are captured and organized.

The modeling of a problem is independent from the chosen programming language, but this choice conditions the ease you can codify the model with.

Many creative activities employ intermediate models between reality and its final expression on the medium. For instance, _storyboards_ are used in planning action sequences: they capture the key moments in the sequence.

![A page of the Batman animated series' storyboard](images/batman-storyboard.jpg)

This map, which depicts Shelob's Lair from The Lord of the Rings, was employed to maintain coherence in the described scenario.

![JRR Tolkien's groundwork notes for The Lord of the Rings](images/lotr-notes.jpg)

This is a design for a map from the video game _Mario_. Digital tools have enabled the automation of models into software.

![Map from the video game Mario on graph paper](images/mario-level-design.png)

And here's the flowchart of how the different functions of a Unity script are called.

![Flowchart for a Unity script's life cycle](images/monobehaviour-flowchart.png)

Object-oriented programming is a **problem modeling** technique that confers special emphasis to two concepts: **objects** and **message passing**.

## Objects

Objects are **depictions of a problem's aspects** that carry out a specific role, exhibit a set of concrete functionality –the [API](https://en.wikipedia.org/wiki/Application_programming_interface#Libraries_and_frameworks)–, and also conceal the way they carry out that functionality.

## Message passing

Messages are **action requests** from one object to another. These requests issue from a sender object to an addressee object, and they codify which **API functionality** is required.

## Object-oriented modeling

Object definitions and the interactions between objects model the problem. Throughout this section we shall informally model the video game [_Space Invaders_](https://en.wikipedia.org/wiki/Space_Invaders).

![Screenshot from the video game Space Invaders, where we can observe enemy ships, the allied ship, remaining ship & score counters, friendly & enemy bullets, and the ship's defenses.](images/space-invaders.jpg)

### Identifying objects

A technique for object identification is to **give names**.

![Screenshot from Space Invaders where many objects can be made out: 50 enemies, 9 defenses, 12 bullets, 2 counters, 1 hero ship...](images/space-invaders-objects.png)

These are some objects you could give a name: allied ship, enemy 1, enemy 2, enemy 3, friendly bullet, enemy bullet 1, enemy bullet 2, defense 1, defense 2, remaining ship counter, score counter.

### Types of objects and instances

It is clear at a glance that many concrete objects belong into families or **types** of objects. It is convenient to remember that these are also called **classes**.

Types **specify properties and common behaviors** to all of the belonging objects, though they may be different individually.

![Space Invaders screenshot where we can tell different object types: counters, defenses, enemies, player & bullets](images/space-invaders-types.png)

Some **types** you could identify are counters, shields, friandly ship, enemies, and bullets.

A type's **values** are each of the individual objects. The special enemy, as well as each of the other enemies, will be a distinct value of the **enemy type**.

When you use the class terminology, values will become **class instances**.

In object models, it is more convenient to work with object types.

![Object diagram with the five identified classes: marker, defense, enemy, hero & bullet.](images/space-invaders-object-diagram.png)

### Methods & interfaces

In order to try to determine the API for the types of objects you can use the game's interactions as a guide.



Para tratar de determinar la API de los tipos de objetos puedes guíarte por
las interacciones propias del juego.

<iframe width="560" height="315" src="https://www.youtube.com/embed/D1jZaIPeD5w?rel=0" frameborder="0" allowfullscreen></iframe>

For example:

> The enemies all move together towards one side of the screen; they advance
> one row and then they move towards the other side all the while they fire
> at random.

This time the technique is to **look for verbs**: _move_, _advance_, and _fire_, for instance.

In order to implement enemy behavior, enemies have to be able to move to the sides, advance and fire. Therefore, they will need to allow to be sent messages requesting any of these operations.

The actions an object can carry out are called **methods**.

![Enemy API showing four methods: move left, move right, advance and fire.](images/space-invaders-enemy-api.png)





### Estado y atributos

Los objetos no sólo pueden realizar acciones, sino que además capturan
**características** de las entidades a las que representan.

Cada enemigo, por ejemplo, tiene un gráfico distinto, una puntuación
diferente, una posición en pantalla y además recordará en qué dirección
se estaba moviendo.

El **estado** no se suele exponer de forma directa en la API. Piensa en el
caso de los enemigos: incluso si estos tienen una posición, es preferible
tener métodos específicos con los que manipular la posición (como
"mover a la izquierda" o "mover a la derecha") en lugar de dar libre acceso
a la posición.

A las características de un objeto se las denomina **atributos**.

![Estado del enemigo mostrando: gráfico, dirección actual, posición y puntuación.](images/space-invaders-enemy-state.png)

El proceso de modelado es iterativo: al definir algunas acciones, se introducen
nuevos nombres como _posición_ o _dirección_, que se convertirán a su vez en
nuevos tipos de objetos.

### Constructores y creación de objetos

Pensemos ahora en la interacción del disparo:

> Cuando el jugador pulsa el botón de disparo, aparece un proyectil delante de
> la nave amiga que avanza hasta alcanzar la parte superior de la pantalla o
> colisionar con un enemigo.

El proyectil no estaba ahí antes y tendrá que ser creado en el momento del
disparo.

Otro ejemplo, la preparación del nivel antes de jugar:

> Aparecen 55 enemigos en pantalla, 5 filas de 11 enemigos con la siguiente
> configuración: una fila de enemigos de la especie 1, dos filas de la especie
> 2, una de la especie 3 y una de la especie 4.

Está claro que no queremos escribir los 55 enemigos individualmente. Además,
dado que todos pertenecen al tipo enemigo, también es evidente que serán todos
muy parecidos.

Lo que se necesita es un mecanismo de **generación automática de objetos**. Cada
lenguaje ofrece formas distintas de crear objetos.

Un mecanismo útil es el de contar con un nuevo objeto el **constructor**, cuya
tarea es la de generar objetos de un tipo dado. Habrá pues **un constructor
por tipo**.

![Estado del enemigo mostrando: gráfico, dirección actual, posición y puntuación.](images/space-invaders-constructors.png)

Los constructores tienen una API muy sencilla: _nuevo objeto_. Este método crea
un nuevo objeto de un tipo dado.

![Una factoría para un tipo cualquiera con un sólo método: nuevo objeto.](images/space-invaders-constructor-detail.png)

Los constructores suelen permitir personalizar partes del objeto que están
creando de forma que se le pueda decir algo como _"crea un disparo con esta
posición, este gráfico y esta dirección de avance"_.

![Una factoría para un tipo cualquiera con un sólo método: nuevo objeto.](images/space-invaders-constructor-example.png)

### Relaciones entre tipos

Durante el modelado surgen relaciones de forma natural. Los enemigos _tienen_
una posición. La nave amiga _crea_ disparos.

Como es natural entre las personas, tenderás a **establecer jerarquías** entre
objetos creando tipos más generalistas. Por ejemplo: en vez de pensar en
enemigos y protagonista por separado, es posible pensar en _naves_.

El **tipo `nave`** reune los métodos y atributos comunes de la nave protagonista
y enemigos.

![La jerarquía entre los enemigos, la nave protagonista y el super-tipo nave.](images/space-invaders-hierarchy.png)

Esta jerarquía establece **relaciones de herencia** tambén llamadas relaciones
_"es un(a)"_ dado que el protagonista es una `nave` y el enemigo es una
`nave` también.

Se dice que el tipo `enemigo` **extiende** al tipo `nave` añadiendo `avanzar` a la
API, así como la puntuación y la última dirección de desplazamiento al estado.

La nave amiga no añade ningún método nuevo pero **redefine o sobreescribe** el
método `disparar` para que dispare hacia arriba.

Como hay nuevos tipos, necesitarás nuevos constructores. Los viejos
constructores pueden **delegar** parte de la creación del objeto (las partes
comunes) a los nuevos.

De esta forma, al pedir un enemigo, el constructor de enemigos pedirá una nave
al constructor de naves. Luego tomará esa nave, la modificará para que sea un
enemigo y devolverá un enemigo.

![Cuando se pide al constructor de enemigos un enemigo, este pide al constructor de naves una nave, la personaliza para que sea un enemigo y devuelve el enemigo.](./images/space-invaders-hierarchy-constructor.png)
