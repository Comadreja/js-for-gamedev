'use strict';

function Item(name, effect) {
  this.name = name;
  this.effect = effect;
}

function Weapon(name, damage, extraEffect) {
  extraEffect = extraEffect || new Effect({});
  // Make Weapon be a subtype of Item by making it call the Item constructor.
}
// Finish implementing inheritance by making Item's prototype property be the prototype
// to Weapon.prototype and remember to adjust the constructor.

function Scroll(name, cost, effect) {
  Item.call(this, name, effect);
  this.cost = cost;
}
Scroll.prototype = Object.create(Item.prototype);
Scroll.prototype.constructor = Scroll;

Scroll.prototype.canBeUsed = function (mp) {
  // The scroll can be used if mana points are equal to or higher than the spell cost.
};

function Effect(variations) {
  // Copy the properties that are found in variations as properties of this object.
}

module.exports = {
  Item: Item,
  Weapon: Weapon,
  Scroll: Scroll,
  Effect: Effect
};
