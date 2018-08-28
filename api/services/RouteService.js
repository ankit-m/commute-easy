module.exports = {
  getRoutes (options, cb) {
    const { source, destination, mode } = options;

    return cb(null, {
      source: 'India Gate',
      destination: 'AIIMS',
      routes: [{
        id: 1,
        source: 'India Gate',
        destination: 'AIIMS Metro',
        legs: [{
          id: 1,
          type: 'bus',
          source: 'India Gate Bus Stand',
          destination: 'Central Secretariat'
        }, {
          id: 2,
          type: 'metro',
          source: 'Central Secretariat',
          destination: 'AIIMS Metro'
        }]
      }, {
        id: 2,
        source: 'India Gate',
        destination: 'AIIMS',
        legs: [{
          id: 1,
          type: 'taxi',
          source: 'India Gate',
          destination: 'Central Secretariat'
        }]
      }]
    });
  },

  getRouteById (options, cb) {
    return cb(null, {
      id: 1,
      source: 'India Gate',
      destination: 'AIIMS Metro',
      legs: [{
        id: 1,
        type: 'bus',
        source: 'India Gate Bus Stand',
        destination: 'Central Secretariat'
      }, {
        id: 2,
        type: 'metro',
        source: 'Central Secretariat',
        destination: 'AIIMS Metro'
      }]
    });
  },

  getRouteCost (routeDetails, cb) {
    const tasks = routeDetails.legs.map(function (leg) {
      if (['bus', 'train', 'metro'].includes(leg.type)) {
        return function (next) {
          TransitService.getCost({
            source: leg.source,
            destination: leg.destination
          }, next);
        };
      }

      return function (next) {
        TaxiService.getCost({
          source: leg.source,
          destination: leg.destination
        }, next);
      };
    });

    async.parallel(tasks, function (err, costs) {
      if (err) { return cb(err); }

      let decoratedRoute = Object.assign({}, routeDetails);

      decoratedRoute.cost = costs.reduce(function (a, b) { return a + b; }, 0);
      decoratedRoute.legs.forEach(function (leg, i) {
        leg.cost = costs[i];
      });

      return cb(null, decoratedRoute);
    });
  }
};
