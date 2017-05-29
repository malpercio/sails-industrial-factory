const Promise = require('bluebird');

class Collection{
  constructor(increment){
    this.number = 1;
    this.increment = increment === true? 1: increment;
  }

  update(attrib){
    let newName = attrib + this.number;
    this.number += this.increment;
    return newName;
  }
}

module.exports = Collection;
