var bidfactory = require('src/bidfactory.js');
var bidmanager = require('src/bidmanager.js');
var adaptermanager = require('src/adaptermanager');
var bidderName = 'a9_parallel';
/**
 * General Adapter for requesting bids from a9
 */
var a9_parallelAdapter = function a9Adapter() {
  function _callBids(params) {
    var bidObject = bidfactory.createBid(2);
    bidObject.bidderCode = bidderName;
    var placementCode=params.bids[0].placementCode;
    bidmanager.addBidResponse(placementCode, bidObject);
    return;
  }


  return {
    callBids: _callBids
  };
};

adaptermanager.registerBidAdapter(new a9_parallelAdapter(), bidderName);

module.exports = a9_parallelAdapter;

