/**
 * PurchaseController
 *
 * @description :: Server-side logic for managing purchases
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  buy (req, res) {
    async.waterfall([
      function (cb) {
        RouteService.getRouteById({ routeId: req.body.routeId }, cb);
      },

      function (route, cb) {
        RouteService.getRouteCost(route, cb);
      },

      function (route, cb) {
        PaymentService.charge({
          token: req.body.token,
          cost: route.cost
        }, function (err, charge) {
          if (err) { return cb(err); }

          return cb(null, { charge, route });
        });
      },

      function ({ charge, route }, cb) {
        Purchase.create({
          amount: parseInt(charge.amount, 10),
          status: 'success',
          claimed: false,
          friendly: `${route.source} to ${route.destination}`,
          transactionId: charge.id,
          meta: route
        }).exec(cb);
      }
    ], function (err, purchase) {
      if (err) { return res.serverError(err); }

      return res.ok({ id: purchase.id });
    });
  },

  cancel (req, res) {
    const purchaseId = req.param('purchaseId');

    async.waterfall([
      function (cb) {
        Purchase.findOne({ id: purchaseId }).exec(cb);
      },

      function (purchase, cb) {
        if (!purchase) { return cb(new Error('No such purchase.')); }

        if (purchase.claimed) { return cb(new Error('Purchase already claimed or refunded.')); }

        return Purchase.update({
          id: purchaseId
        }, {
          claimed: true,
          status: 'refunded'
        }).exec(cb);
      },

      function (purchases, cb) {
        PaymentService.refund({
          purchaseId: purchases[0].purchaseId
        }, cb);
      }
    ], function (err) {
      if (err) { return res.serverError(err); }

      return res.ok({ purchaseId });
    });
  }
};

