import * as utils from 'src/utils';
import {config} from 'src/config';
import {registerBidder} from 'src/adapters/bidderFactory';
const BIDDER_CODE = 'tim';
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
    console.log("isBidRequestValid: "+JSON.stringify(bid));
    return true;
  },
  /**
   * Make a server request from the list of BidRequests.
   *
   * @param {validBidRequests[]} - an array of bids
   * @return {method: string, url: null, data: string} Info describing the request to the server.
   */
  buildRequests: function(validBidRequests) {
    var requests = [];
    console.log("validBidRequests: "+JSON.stringify(validBidRequests));
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
    var ip =  utils.getBidIdParameter('ip', bidReq.params);

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
         "ip": ip,
         "js":1,
         "ua": navigator.userAgent
      }
    };

    console.log("bidRequest: "+JSON.stringify(bidRequest));


    var url = '//hb.stinger-bidder.tech/v2/services/prebid/'+publisherid+'/'+placementCode+'?'+'br=' + encodeURIComponent(JSON.stringify(bidRequest));
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
    console.log("serverResponse: "+JSON.stringify(serverResponse));
    console.log("bidRequest: "+JSON.stringify(bidRequest));
  return [];
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
