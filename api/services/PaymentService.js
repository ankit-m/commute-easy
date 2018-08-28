const request = require('request');

module.exports = {
  charge (options, cb) {
    request.post(`https://api.razorpay.com/v1/payments/${options.token}/capture`, {
      json: true,
      auth: {
        user: sails.config.razorpay.pk,
        pass: sails.config.razorpay.secret
      },
      body: {
        amount: options.cost
      }
    }, function (err, response, body) {
      if (err) { return cb(err); }

      return cb(null, body);
    });
  },

  refund (options, cb) {
    request.post(`https://api.razorpay.com/v1/payments/${options.transactionId}/refund`, {
      json: true,
      auth: {
        user: sails.config.razorpay.pk,
        pass: sails.config.razorpay.secret
      }
    }, function (err, response, body) {
      if (err) { return cb(err); }

      return cb(null, body);
    });
  }
};
