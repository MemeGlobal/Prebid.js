var bidfactory = require('src/bidfactory.js');
var bidmanager = require('src/bidmanager.js');
var adaptermanager = require('src/adaptermanager');
var bidderName = 'a9';
/**
 * General Adapter for requesting bids from a9
 */
var a9Adapter = function a9Adapter() {
  function _callBids(params) {
    console.log("params: "+JSON.stringify(params));
    var sizes=params.bids[0].sizes;
    var apstagSlots = initializeAps(sizes);
    apstag.fetchBids({
      slots: apstagSlots
    }, function(bids) {
      var key=bids[0].amznbid;
      if(key){
        loadJSON('https://mediamart.tv/sas/ads/utils/php/getbid.php?key='+'1ttbeo0',
          function(data) {
            var bidObject = bidfactory.createBid(1);
            bidObject.bidderCode = bidderName;
            //bidObject.amazonBids=bids;
            bidObject.cpm=data;
            var placementCode=params.bids[0].placementCode;
            bidmanager.addBidResponse(placementCode, bidObject);
            console.log("amazon bid set");
          },
          function(xhr) {
            return;
          }
        );
      }
      return;


    });

    console.log("finished callbids amazon");
  }
  function loadJSON(path, success, error)
  {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function()
    {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          if (success)
            success(JSON.parse(xhr.responseText));
        } else {
          if (error)
            error(xhr);
        }
      }
    };
    xhr.open("GET", path, true);
    xhr.send();
  }
  function initializeAps(sizes){
    var slotId='div-gpt-ad-1539177507268-0';
    var slotName= '/21753374211/test_unit01';
    //set APS config
    apstag.init({
      pubID: '4d51593a-9c1d-486a-88e4-97bf58717851',
      adServer: 'googletag'
    });
    //Define apstag slots
    var apstagSlots = [{
      slotID: slotId,
      slotName: slotName,
      sizes: sizes
    }];
    return apstagSlots;
  }

  return {
    callBids: _callBids
  };
};

adaptermanager.registerBidAdapter(new a9Adapter(), bidderName);

module.exports = a9Adapter;

