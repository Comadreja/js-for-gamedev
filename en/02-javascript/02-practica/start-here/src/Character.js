'use strict';
var dice = require('./dice');

function Character(name, features) {
  features = features || {};
  this.name = name;
  // Extract each characteristic from the features parameter, and store it
  // to a property.
  this._mp = features.mp || 0;
  this.maxMp = features.maxMp || this._mp;
}

Character.prototype._immuneToEffect = ['name', 'weapon'];

Character.prototype.isDead = function () {
  // Fill in this function's body.
};

Character.prototype.applyEffect = function (effect, isAlly) {
  // Implement the effect application rules in order to modify the
  // character's characteristics. Do not forget to return true or false
  // depending on whether the effect has applied or not.
};

Object.defineProperty(Character.prototype, 'mp', {
  get: function () {
    return this._mp;
  },
  set: function (newValue) {
    this._mp = Math.max(0, Math.min(newValue, this.maxMp));
  }
});

Object.defineProperty(Character.prototype, 'hp', {
  // You can use the same technique as before in order to keep hp's value
  // within the correct range.
});

// You can do something similar to the above in order to keep defense
// between 0 and 100.

module.exports = Character;
