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
    utils.logError(e);
  }

  return JSON.parse(obj.br);
}


function formatAdMarkup(bid) {
  var adm = bid.adm;
  if ('nurl' in bid) {
    adm += utils.createTrackPixelHtml(bid.nurl);
  }
  return "<!DOCTYPE html><html><head><title></title><body style='margin:0px;padding:0px;'>"+adm+"</body></head>";
}

export const spec = {
  code: BIDDER_CODE,

  isBidRequestValid: function(bid) {
    if(bid.params && bid.params.publisherid && bid.params.placementCode){
      return true;
    }
    if(!bid.params){
      utils.logError("bid not valid: params were not provided");
    }
    else if(!bid.params.publisherid){
      utils.logError("bid not valid: publisherid was not provided");
    }
    else if(!bid.params.placementCode){
      utils.logError("bid not valid: placementCode was not provided");
    }
    return false;

  },

  buildRequests: function(validBidRequests,bidderRequest) {
    bidsRequested=bidderRequest;
    var requests = [];
    for (var i = 0; i < validBidRequests.length; i++) {
      requests.push(this.createRTBRequestUTL(validBidRequests[i]));
    }
    return requests;
  },

  createRTBRequestUTL:function(bidReq){
    // build bid request object
    var domain = window.location.host;
    var page = window.location.href;
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
        bidResponse.ttl=180;
        bidResponses.push(bidResponse);

        }
    });
    return bidResponses;

},
  getLanguage: function() {
  const language = navigator.language ? 'language' : 'userLanguage';
  return navigator[language].split('-')[0];
},


getUserSyncs: function(syncOptions, serverResponses) {
  const syncs = []
  return syncs;
},


onTimeout: function(data) {
  // Bidder specifc code
},


onBidWon: function(bid) {
  // Bidder specific code
},


onSetTargeting: function(bid) {
  // Bidder specific code
},
}
registerBidder(spec);
