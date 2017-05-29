const path = require("path");
const require_tree = require('require-tree');
const Promise = require('bluebird');
const Collection = require('./Collection');

class Instance{

  constructor(factory, name, model){
    if(factory instanceof Instance){
      this.autoIncrement = factory.autoIncrement;
      this.factory = factory.factory;
      this.name = factory.name;
      this.model = factory.model;
      this.attribs = {};
      for(let attrib in factory.attribs){
        this.attribs[attrib] = factory.attribs[attrib];
      }
    }else{
      this.autoIncrement = {};
      this.factory = factory;
      this.name = name;
      this.attribs = {};
      if(model){
        this.model = model;
      }else{
        this.model = global[name];
      }
    }
  }

  build(cb){
    return new Promise((resolve, reject) => {
      let json = this.__prelude__();
      return resolve(this.model.build(json));
    }).asCallback(cb)
  }

  create(cb){
    let json = this.__prelude__();
    return this.model.create(json).asCallback(cb);
  }

  attr(name, value, options){

    if(options && options.auto_increment){
      this.autoIncrement[name] = new Collection(options.auto_increment);
    }
    this.attribs[name] = value;
    return this;
  }

  __prelude__(){
    let json = {}, value;
    for(let attrib in this.attribs){
      if(typeof(this.attribs[attrib]) == 'function'){
        value = this.attribs[attrib]();
      }else{
        value = this.attribs[attrib];
      }
      if(this.autoIncrement[attrib]){
        json[attrib] = this.autoIncrement[attrib].update(value);
      }else{
        json[attrib] = this.attribs[attrib];
      }
    }
    return json;
  }

  parent(instance){
    instance = this.factory.definitions[instance];
    for(let attrib in instance.attribs){
      this.attribs[attrib] = instance.attribs[attrib];
    }
    this.autoIncrement = instance.autoIncrement;
    if(!this.model){
      this.model = instance.model;
    }
    return this;
  }
}

module.exports = Instance;
