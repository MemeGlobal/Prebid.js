var bidfactory = require('src/bidfactory.js');
var bidmanager = require('src/bidmanager.js');
var adaptermanager = require('src/adaptermanager');
var bidderName = 'a9';
/**
 * General Adapter for requesting bids from a9
 */
var a9Adapter = function a9Adapter() {
  function _callBids(params) {
    var timeout = params.timeout;
    var placementCode=params.bids[0].placementCode;
    params=params.bids[0].params;
    var sizes=params.sizes;
    var serverDomain =params.serverDomain;
    var slotId=params.slotId;
    var slotName=params.slotName;
    var pubID=params.pubID;
    var apstagSlots = initializeAps(sizes,slotId,slotName,pubID);
    apstag.fetchBids({
      slots: apstagSlots,
      timeout: timeout
    }, function(bids) {
      var key=bids[0].amznbid;
      if(key && key!=2){
        loadJSON('https://'+serverDomain+'/sas/player/trackers/getbid.php?key='+key,
          function(cpm) {
            var bidObject = bidfactory.createBid(1);
            bidObject.bidderCode = bidderName;
            //bidObject.amazonBids=bids;
            bidObject.cpm=cpm;
            bidmanager.addBidResponse(placementCode, bidObject);
          },
          function(xhr) {
            return;
          }
        );
      }

    });

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

  function initializeAps(sizes,slotId,slotName,pubID)
  {
    apstag.init({
      pubID:pubID,
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

