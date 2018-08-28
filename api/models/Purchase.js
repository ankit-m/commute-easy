/**
 * Purchase.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  autoCreatedAt: true,
  autoUpdatedAt: true,
  attributes: {
    id: {
      type: 'integer',
      unique: true,
      autoIncrement: true
    },
    claimed: {
      type: 'boolean'
    },
    amount: {
      type: 'integer'
    },
    status: {
      type: 'string',
      enum: ['success', 'denied', 'error', 'refunded']
    },
    friendly: {
      type: 'string'
    },
    transactionId: {
      type: 'string'
    },
    creator: {
      type: 'string'
    },
    meta: {
      type: 'json'
    }
  }
};

