const sails = require('sails');
const each = require('lodash/forEach');
const includes = require('lodash/includes');
const Promise = require('bluebird');

const sailsrc = {
  environment: 'test',
  hooks: {
    orm: false,
    blueprints: false,
    pubsub: false,
    grunt: false,
  },
  log:{
    level: 'silent'
  },
  connections: {
      testConnection: {
      user: 'root',
      password: '',
      database: 'industrial',
      dialect: 'mysql',
    }
  },

  models: {
    connection: 'testConnection',
    migrate: 'alter'
  },
}

before((done) => {
  if(process.env.DBUSER){
    sailsrc.connections.testConnection.user = process.env.DBUSER;
  }
  if(process.env.PSSWD){
    sailsrc.connections.testConnection.password = process.env.PSSWD;
  }
  if(process.env.DB){
    sailsrc.connections.testConnection.database = process.env.DB;
  }
  sails.lift(sailsrc, (err, sails) => {
    if(err){
      return done(err);
    }
    global.factory = require('../index.js');
    done();
  });
});

after((done) => {
  sails.lower(done);
});

beforeEach(() => {
  let models = [];
  for (let model in sails.models){
    models.push(sails.models[model]);
  }
  return Promise.map(models, (model) => {
    return model.destroy({where: {}, force:true});
  });
});
