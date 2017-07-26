const path = require("path");
const require_tree = require("require-tree");
const Instance = require("./Instance");

class Factory{
  constructor(){
    this.definitions = {};
    for(const method of ["build", "create",]){
      Factory.prototype[method] = (name, options, cb) => {
        const [instance, callback,] = this.__prelude__(name, options, cb);

        if(!instance){
          throw new Error("Factory not found");
        }
        return instance[method](callback);
      };
    }
  }

  static defaultFolder(){
    return path.join(process.cwd(), "test", "factories");
  }

  define(name, model){
    this.definitions[name] = new Instance(this, name, model);
    return this.definitions[name];
  }

  __prelude__(name, options, cb){
    const instanceCopy = new Instance(this.definitions[name]);

    if(typeof options === "function"){
      cb = options;
      options = {};
    }
    for(const attrib in options){
      instanceCopy.attr(attrib, options[attrib]);
    }
    return [instanceCopy, cb,];
  }

  load(folder){
    folder = folder? folder: Factory.defaultFolder();
    const definitions = require_tree(folder);

    for (const index in definitions){
      definitions[index](this);
    }
  }
}

module.exports = Factory;
