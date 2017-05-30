const Promise = require('bluebird');
const Sails = require('sails').Sails;
const should = require('should');
let factory;

describe('Factories test', function() {

  beforeEach(() => {
    factory = require('../index.js');
  });

  it('should define', () => {
    return new Promise((resolve, reject) => {
      factory.define('mini', TableType)
        .attr("name", "Mini");
      factory.definitions.mini.name.should.equal('mini');
      factory.definitions.mini.attribs.name.should.equal('Mini');
      return resolve();
    });
  })

  it('should build', () => {
    factory.define('mini', TableType)
      .attr("name", "Mini");
    return factory.build('mini')
      .then((table) => {
        (table instanceof Sequelize.Instance).should.be.true();
      })
  });

  it('should create', () => {
    factory.define('mini', TableType)
      .attr("name", "Mini");
    return factory.create('mini')
      .then((table) => {
        (table instanceof Sequelize.Instance).should.be.true();
        return TableType.findAndCountAll({where:{name:"Mini"}})
      })
      .then((result) => {
        result.count.should.equal(1);
      })
  });

  it('should alter define', () => {
    factory.define('active', Restaurant)
      .attr("name", "Mini")
      .attr("active", true);
    factory.define('inactive').parent('active')
      .attr("active", false);
    return factory.create('inactive')
      .then((restaurant) => {
        (restaurant instanceof Sequelize.Instance).should.be.true();
        return Restaurant.findAndCountAll({where:{active:false}})
      })
      .then((result) => {
        result.count.should.equal(1);
      })
  });

  it('should load', () => {
    factory.load();
    return factory.create('inactive')
      .then((restaurant) => {
        (restaurant instanceof Sequelize.Instance).should.be.true();
        return Restaurant.findAndCountAll({where:{active:false}})
      })
      .then((result) => {
        result.count.should.equal(1);
      })
  });

  it('should increment', () => {
    factory.define('active', Restaurant)
      .attr("name", "Mini", {auto_increment:2})
      .attr("active", true);
    factory.define('inactive').parent('active')
      .attr("active", false);
    return factory.create('inactive')
      .then((restaurant) => {
        (restaurant instanceof Sequelize.Instance).should.be.true();
        return Restaurant.findAndCountAll({where:{name:"Mini1"}})
      })
      .then((result) => {
        result.count.should.equal(1);
      })
      .then(() => {
        return factory.create('active')
      })
      .then((restaurant) => {
        (restaurant instanceof Sequelize.Instance).should.be.true();
        return Restaurant.findAndCountAll({where:{name:"Mini5"}})
      })
      .then((result) => {
        result.count.should.equal(1);
      })
  });

});
