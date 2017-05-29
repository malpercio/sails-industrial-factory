const path = require("path");
const require_tree = require('require-tree');
const Promise = require('bluebird');
const Instance = require('./Instance');

class Factory{
  constructor(){
    this.definitions = {};
  }

  static defaultFolder(){
    return path.join(process.cwd(), "test", "factories");
  }

  define(name, model){
    this.definitions[name] = new Instance(this, name, model);
    return this.definitions[name];
  }

  build(name, options, cb){
    let [instance, callback] = this.__prelude__(name, options, cb);
    return instance.build(callback);
  }

  create(name, options, cb){
    let [instance, callback] = this.__prelude__(name, options, cb);
    return instance.create(callback);
  }

  __prelude__(name, options, cb){
    let instanceCopy = new Instance(this.definitions[name]);
    if(typeof(options) == 'function'){
      cb = options;
      options = {};
    }
    for(let attrib in options){
      instanceCopy.attr(options[attrib]);
    }
    return [instanceCopy, cb];
  }

  load(folder){
    folder = folder? folder: Factory.defaultFolder();
    let definitions = require_tree(folder),
      promises = [];
    for (let index in definitions){
      definitions[index](this);
    }
  }
}

module.exports = Factory;
