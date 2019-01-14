import * as utils from 'src/utils';
import {config} from 'src/config';
import {registerBidder} from 'src/adapters/bidderFactory';
import * as bidfactory from "../src/bidfactory";
const BIDDER_CODE = 'tim';
var bidsRequested;


function fillAuctionPricePLaceholder(str, auctionPrice) {
  if (typeof str != 'string') {
    return str;
  }
  return str.replace(/\${AUCTION_PRICE}/g, auctionPrice);
}


function find(array,property,value) {
  for(let i=0;i<array.length;i++){
    if(array[i][property]==value){
      return array[i];
    }
  }
  return {};
}

export const spec = {
  code: BIDDER_CODE,
  aliases: ['tim'], // short code
  /**
   * Determines whether or not the given bid request is valid.
   *
   * @param {BidRequest} bid The bid params to validate.
   * @return boolean True if this is a valid bid, and false otherwise.
   */
  isBidRequestValid: function(bid) {
    if(bid.params && bid.params.publisherid && bid.params.placementCode && bid.params.bidfloor){
      return true;
    }
    return false;

  },
  /**
   * Make a server request from the list of BidRequests.
   *
   * @param {validBidRequests[]} - an array of bids
   * @return {method: string, url: null, data: string} Info describing the request to the server.
   */
  buildRequests: function(validBidRequests,bidderRequest) {
    bidsRequested=bidderRequest;
    var requests = [];
    for (var i = 0; i < validBidRequests.length; i++) {
      requests.push(this.requestBid(validBidRequests[i]));
    }
    return requests;
  },

  requestBid:function(bidReq){
    // build bid request object
    var domain = window.location.host;
    var page = window.location.host + window.location.pathname + location.search + location.hash;
    var publisherid = utils.getBidIdParameter('publisherid', bidReq.params);
    var bidFloor = Number(utils.getBidIdParameter('bidfloor', bidReq.params));
    var placementCode = utils.getBidIdParameter('placementCode', bidReq.params);

    var adW = 0;
    var adH = 0;

    var bidSizes = Array.isArray(bidReq.params.sizes) ? bidReq.params.sizes : bidReq.sizes;
    var sizeArrayLength = bidSizes.length;
    if (sizeArrayLength === 2 && typeof bidSizes[0] === 'number' && typeof bidSizes[1] === 'number') {
      adW = bidSizes[0];
      adH = bidSizes[1];
    } else {
      adW = bidSizes[0][0];
      adH = bidSizes[0][1];
    }

    // build bid request with impressions
    var bidRequest = {
      id: utils.getUniqueIdentifierStr(),
      imp: [{
        id: bidReq.bidId,
        banner: {
          w: adW,
          h: adH
        },
        tagid: placementCode,
        bidfloor: bidFloor
      }],
      site: {
        domain: domain,
        page: page,
        publisher: {
          id: publisherid
        }
      },
      device:{
         "language": this.getLanguage(),
         "w":adW,
         "h":adH,
         "js":1,
         "ua": navigator.userAgent
      }
    };


    var url = '//hb.stinger-bidder.tech/api/v2/services/prebid/'+publisherid+'/'+placementCode+'?'+'br=' + encodeURIComponent(JSON.stringify(bidRequest));
    return {
      method: 'GET',
      url: url,
      data: "",
    };

  },
  /**
   * Unpack the response from the server into a list of bids.
   *
   * @param {ServerResponse} serverResponse A successful response from the server.
   * @return {Bid[]} An array of bids which were nested inside the server.
   */
  interpretResponse: function(serverResponse, bidRequest) {
    var bidResp = serverResponse;
    const bidResponses = [];
    if ((!bidResp || !bidResp.id) ||
      (!bidResp.seatbid || bidResp.seatbid.length === 0 || !bidResp.seatbid[0].bid || bidResp.seatbid[0].bid.length === 0)) {
      return [];
    }

    bidResp.seatbid[0].bid.forEach(function (bidderBid) {
      var responseCPM;
      var placementCode = '';
      var bidSet = bidsRequested;
      var bidRequested =find(bidSet.bids,"bidId",bidderBid.impid);
      if (bidRequested) {
        var bidResponse = bidfactory.createBid(1);
        placementCode = bidRequested.placementCode;
        bidRequested.status = CONSTANTS.STATUS.GOOD;

        responseCPM = parseFloat(bidderBid.price);
        bidderBid.nurl = fillAuctionPricePLaceholder(bidderBid.nurl, responseCPM);
        bidderBid.adm = fillAuctionPricePLaceholder(bidderBid.adm, responseCPM);
        if (responseCPM === 0) {
          var bid = bidfactory.createBid(2);
          bid.bidderCode = BIDDER_CODE;
          bidResponses.push(bid);
          return bidResponses;
        }
        bidResponse.placementCode = placementCode;
        bidResponse.size = bidRequested.sizes;
        var responseAd = bidderBid.adm;
        var responseNurl = '<img src="' + bidderBid.nurl + '" height="0px" width="0px" style="display: none;">';
        bidResponse.creativeId = bidderBid.id;
        bidResponse.bidderCode = BIDDER_CODE;
        bidResponse.cpm = responseCPM;
        bidResponse.ad = decodeURIComponent(responseAd + responseNurl);
        bidResponse.width = parseInt(bidderBid.w);
        bidResponse.height = parseInt(bidderBid.h);
        bidResponse.currency="USD";
        bidResponse.netRevenue=true;
        bidResponse.requestId=bidRequest.bidId;
        bidResponse.ttl=360;
        bidResponses.push(bidResponse);

        }
    });
    return bidResponses;

},
  getLanguage: function() {
  const language = navigator.language ? 'language' : 'userLanguage';
  return navigator[language].split('-')[0];
},

/**
 * Register the user sync pixels which should be dropped after the auction.
 *
 * @param {SyncOptions} syncOptions Which user syncs are allowed?
 * @param {ServerResponse[]} serverResponses List of server's responses.
 * @return {UserSync[]} The user syncs which should be dropped.
 */
getUserSyncs: function(syncOptions, serverResponses) {
  const syncs = []
  return syncs;
},

/**
 * Register bidder specific code, which will execute if bidder timed out after an auction
 * @param {data} Containing timeout specific data
 */
onTimeout: function(data) {
  // Bidder specifc code
},

/**
 * Register bidder specific code, which will execute if a bid from this bidder won the auction
 * @param {Bid} The bid that won the auction
 */
onBidWon: function(bid) {
  // Bidder specific code
},

/**
 * Register bidder specific code, which will execute when the adserver targeting has been set for a bid from this bidder
 * @param {Bid} The bid of which the targeting has been set
 */
onSetTargeting: function(bid) {
  // Bidder specific code
},
}
registerBidder(spec);
