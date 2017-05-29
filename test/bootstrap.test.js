const sails = require('sails');
const each = require('lodash/forEach');
const includes = require('lodash/includes');
const Promise = require('bluebird');

before((done) => {
  sails.lift({
    environment: 'test',
    hooks: {
      orm:false,
      blueprints: false,
      pubsub: false,
    },
    log:{
      level:'silent'
    },
  }, done);
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
