[![forthebadge](http://forthebadge.com/images/badges/built-by-codebabes.svg)](https://jaque.me/)

[![Stories in Progress](https://img.shields.io/waffle/label/malpercio/sails-industrial-factory/in%20progress.svg?style=flat)](https://waffle.io/malpercio/sails-industrial-factory)
[![Build Status](https://david-dm.org/malpercio/sails-industrial-factory.svg)](https://travis-ci.org/malpercio/sails-industrial-factory)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/c988b9a0675b43ff964e76168b9975c3)](https://www.codacy.com/app/danielglezespinoza/sails-industrial-factory?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=malpercio/sails-industrial-factory&amp;utm_campaign=Badge_Grade)
[![bitHound Overall Score](https://www.bithound.io/github/malpercio/sails-industrial-factory/badges/score.svg)](https://www.bithound.io/github/malpercio/sails-industrial-factory)
[![bitHound Dependencies](https://www.bithound.io/github/malpercio/sails-industrial-factory/badges/dependencies.svg)](https://www.bithound.io/github/malpercio/sails-industrial-factory/master/dependencies/npm)
[![dependencies Status](https://david-dm.org/malpercio/sails-industrial-factory/status.svg)](https://david-dm.org/malpercio/sails-industrial-factory)
[![DevDependencies](https://david-dm.org/malpercio/sails-industrial-factory/dev-status.svg)](https://david-dm.org/malpercio/sails-industrial-factory)
[![npm version](https://badge.fury.io/js/sails-industrial-factory.svg)](https://badge.fury.io/js/sails-industrial-factory)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/malpercio/sails-industrial-factory/master/LICENSE)

# sails-industrial-factory
Simple model factory for Sails.js with Sequelize inspired by Sails Factory

## Installation
```
    npm install sails-industrial-factory
```
## Usage

### Defining factories

Define a factory by giving it a name and an optional model name. The factory name will be the default model name (parent model or the name itself) if model name is not provided.

```js
var factory = require("sails-industrial-factory");

factory.define("user")
  .attr("first_name", "First Name")
  .attr("last_name", "Last Name")
  .attr("random_id", function() { return Math.random(); });

factory.define("active_user").parent("user")
  .attr("active", true);

factory.define("admin_user", Admin).parent("user");
```

### Using factories
```js
//Callback
factory.build("active_user", function(err, active_user) {
  // active_user: non-persistent "active_user" instance
  // {
  //    first_name: "First Name",
  //    last_name: "Last Name",
  //    random_id: <number>,
  //    active: true
  // }
});

factory.build("user", {first_name: "Hello", last_name: function() { return "World"; }}, function(err, user) {
  // user: non-persistent "user" instance
  // {
  //    first_name: "Hello",
  //    last_name: "World",
  //    random_id: <number>
  // }
});

factory.create("active_user", function(err, active_user) {
  // active_user: sails User model instance
  // {
  //    id: <id>,
  //    first_name: "First Name",
  //    last_name: "Last Name",
  //    random_id: <number>,
  //    active: true,
  //    createdAt: <date>,
  //    updatedAt: <date>
  // }
});

//Promise
factory.build("active_user")
  .then(()=> {
  // active_user: non-persistent "active_user" instance
  // {
  //    first_name: "First Name",
  //    last_name: "Last Name",
  //    random_id: <number>,
  //    active: true
  // }
  });

factory.build("user", {first_name: "Hello", last_name: function() { return "World"; }})
  .then(()=> {
  // user: non-persistent "user" instance
  // {
  //    first_name: "Hello",
  //    last_name: "World",
  //    random_id: <number>
  // }
  });

factory.create("active_user")
  .then(()=> {
  // active_user: sails User model instance
  // {
  //    id: <id>,
  //    first_name: "First Name",
  //    last_name: "Last Name",
  //    random_id: <number>,
  //    active: true,
  //    createdAt: <date>,
  //    updatedAt: <date>
  // }
  });
```
### Auto increment attributes

Attributes can have an auto_increment option. By default, sequence will increment by 1, otherwise it will increment by whatever value the auto_increment option is set to. Counting starts at the initial value given. Sequence is shared among parent and children.

```js
    factory.define("user")
      .attr("id", 0, {auto_increment: true})
      .attr("first_name", "First Name - ", {auto_increment: 5});

    factory.define("other_user").parent("user");

    factory.build("user", function(user) {
      // user:
      // {
      //    id: 1,
      //    first_name: "First Name - 5",
      //    ...
      // }
    });

    factory.create("user", function(user) {
      // user:
      // {
      //    id: 2,
      //    first_name: "First Name - 10",
      //    ...
      // }
    });

    factory.build("other_user", function(other_user) {
      // other_user:
      // {
      //    id: 3,
      //    first_name: "First Name - 15",
      //    ...
      // }
    });
```

### Loading factories

Calling .load() without parameter will try to load factory definitions from test/factories folder.
```js
// api/models/User.js
module.exports = {
  attributes: {
    first_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    last_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    last_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    active: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
};


// test/factories/User.js
module.exports = function(factory) {
  factory.define("user")
    .attr("first_name", "First Name")
    .attr("last_name", "Last Name")

  factory.define("active_user").parent("user")
    .attr("active", true);
};

// test/bootstrap.js
before(function(done) {
  require("sails").lift({
    log: {
      level: "error"
    }
  }, function(err, sails) {
    if (sails) {
      // -- make factories global to your tests
      global.factory = require("sails-industrial-factory");
      //-- load factory definition files from test/factories
      factory.load();
    }
    done(err);
  });
});
```

To load factory files from different folder:

```js
factory.load("/path/to/factories");
```

## License
[MIT](./LICENSE)


[![NPM](https://nodei.co/npm/sails-industrial-factory.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/sails-industrial-factory/)
