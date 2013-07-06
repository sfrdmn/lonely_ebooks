var couchapp = require('couchapp');

ddoc = {
  _id: '_design/app'
};

ddoc.views = {
  random: {
    map: function(doc) {
      if (doc.random) {
        emit(doc.random, doc);
      }
    }
  }
};

module.exports = ddoc;
