/**
 * ViewController
 *
 * @description :: Server-side logic for managing views
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const QRCode = require('qrcode');

module.exports = {
  routes (req, res) {
    async.waterfall([
      function (cb) {
        RouteService.getRoutes({
          source: req.param('source'),
          destination: req.param('destination'),
          modes: req.param('modes')
        }, cb);
      },

      function (data, cb) {
        const tasks = data.routes.map(function (route) {
          return function (next) {
            RouteService.getRouteCost(route, next);
          };
        });

        async.parallel(tasks, function (err, costDecoratedRoutes) {
          if (err) { return cb(err); }

          return cb(null, Object.assign(data, { routes: costDecoratedRoutes }));
        });
      }

    ], function (err, result) {
      if (err) { return res.serverError(err); }

      return res.view('routes', result);
    });
  },

  purchases (req, res) {
    Purchase
      .find()
      .exec(function (err, results) {
        if (err) { return res.view('500', err); }

        return res.view('purchases', {
          purchases: results
        });
      });
  },

  singlePurchase (req, res) {
    Purchase
      .findOne({ id: req.param('purchaseId') })
      .exec(function (err, purchase) {
        if (err) { res.view('500', err); }

        if (!purchase) {
          return res.view('404', {
            data: 'The ticket does not exist'
          });
        }

        return QRCode.toString(purchase.transactionId, { type: 'svg' }, function (err, string) {
          if (err) { return res.view('500', err); }

          return res.view('purchase', {
            qr: string,
            amount: purchase.amount,
            friendly: purchase.friendly,
            status: purchase.status
          });
        });
      });
  }
};

