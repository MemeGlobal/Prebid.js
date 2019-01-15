import * as utils from 'src/utils';
import {config} from 'src/config';
import {registerBidder} from 'src/adapters/bidderFactory';
import * as bidfactory from "../src/bidfactory";
var CONSTANTS = require('src/constants.json');
const BIDDER_CODE = 'tim';
var bidsRequested;

function find(array,property,value) {
  for(let i=0;i<array.length;i++){
    if(array[i][property]==value){
      return array[i];
    }
  }
  return {};
}

function parseBidRequest(bidRequest) {
  let params=bidRequest.url.split('?')[1];
  var obj = {};
  var pairs = params.split('&');
  try{
    for(var i in pairs){
      var split = pairs[i].split('=');
      obj[decodeURIComponent(split[0])] = decodeURIComponent(split[1]);
    }
  }catch (e) {
    console.log(e);
  }

  return JSON.parse(obj.br);
}

/**
 *  Format creative with optional nurl call
 *  @param bid rtb Bid object
 */
function formatAdMarkup(bid) {
  var adm = bid.adm;
  if ('nurl' in bid) {
    adm += utils.createTrackPixelHtml(`${bid.nurl}&px=1`);
  }
  return `<!DOCTYPE html><html><head><title></title><body style='margin:0px;padding:0px;'>${adm}</body></head>`;
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
    if(bid.params && bid.params.publisherid && bid.params.placementCode){
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
    var publisherid = bidReq.params.publisherid;
    var bidFloor = bidReq.params.bidfloor;
    var placementCode = bidReq.params.placementCode;

    var adW = bidReq.mediaTypes.banner.sizes[0][0];
    var adH = bidReq.mediaTypes.banner.sizes[0][1];


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
    if(!bidFloor){
      delete bidRequest.imp["bidfloor"];
    }

    bidRequest.bidId = bidReq.bidId;
    var url = '//hb.stinger-bidder.tech/api/v2/services/prebid/'+publisherid+'/'+placementCode+'?'+'br=' + encodeURIComponent(JSON.stringify(bidRequest));
    return {
      method: 'GET',
      url: url,
      data: "",
      options: {withCredentials: false}
    };

  },
  /**
   * Unpack the response from the server into a list of bids.
   *
   * @param {ServerResponse} serverResponse A successful response from the server.
   * @return {Bid[]} An array of bids which were nested inside the server.
   */
  interpretResponse: function(serverResponse, bidRequest) {
    bidRequest=parseBidRequest(bidRequest);
    var bidResp = serverResponse.body;
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
        if (responseCPM === 0) {
          var bid = bidfactory.createBid(2);
          bid.bidderCode = BIDDER_CODE;
          bidResponses.push(bid);
          return bidResponses;
        }
        bidResponse.placementCode = placementCode;
        bidResponse.size = bidRequested.sizes;
        bidResponse.creativeId = bidderBid.id;
        bidResponse.bidderCode = BIDDER_CODE;
        bidResponse.cpm = responseCPM;
        bidResponse.ad = formatAdMarkup(bidderBid);
        bidResponse.width = parseInt(bidderBid.w);
        bidResponse.height = parseInt(bidderBid.h);
        bidResponse.currency=bidResp.cur;
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
