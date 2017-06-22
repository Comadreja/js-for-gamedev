'use strict';

function TurnList() {}

TurnList.prototype.reset = function (charactersById) {
  this._charactersById = charactersById;

  this._turnIndex = -1;
  this.turnNumber = 0;
  this.activeCharacterId = null;
  this.list = this._sortByInitiative();
};

TurnList.prototype.next = function () {
  // Make it calculate the next turn and return the result
  // according to the specification. Do not forget it has to skip
  // dead characters.
};

TurnList.prototype._sortByInitiative = function () {
  // Use the Array.sort() function. Do not implement your own
  // sorting function!
};

module.exports = TurnList;
