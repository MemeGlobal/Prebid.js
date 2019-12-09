var CONSTANTS = require('src/constants.json');
import * as utils from 'src/utils';
import {config} from 'src/config';
import {registerBidder} from 'src/adapters/bidderFactory';
import * as bidfactory from 'src/bidfactory';
const BIDDER_CODE = 'memegen';

const openRtbAdapterHost = 'whichtalk.com';
var timeout;
var bidsRequested;

function fillAuctionPricePLaceholder(str, auctionPrice) {
  if (typeof str != 'string') {
    return str;
  }
  return str.replace(/\${AUCTION_PRICE}/g, auctionPrice);
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
  aliases: ['memegen'], // short code


  isBidRequestValid: function(bid) {
    if(bid && bid.params && bid.params.bidderUrl){
      return true;
    }
    return false;

  },

  buildRequests: function(validBidRequests,bidderRequest) {
    bidsRequested=bidderRequest;

    timeout =bidderRequest.timeout;
    var requests = [];
    let bids=validBidRequests;
    for (var i = 0; i < bids.length; i++) {
      requests.push(this.createBidRequest(bids[i]));
    }
    return requests;
  },

  createBidRequest:function (bidReq) {
    timeout = timeout || config.getConfig('bidderTimeout');
    // build bid request object
    var domain = window.location.host;
    var page = window.location.host + window.location.pathname + location.search + location.hash;

    var isInapp = utils.getBidIdParameter('isInapp', bidReq.params);
    var publisherId = utils.getBidIdParameter('publisherId', bidReq.params);
    var rtbTagId = Number(utils.getBidIdParameter('rtbTagId', bidReq.params));
    var rtbSiteId = utils.getBidIdParameter('rtbSiteId', bidReq.params);
    var bidFloor = Number(utils.getBidIdParameter('bidfloor', bidReq.params));
    var buyerUid = utils.getBidIdParameter('buyerUid', bidReq.params);
    var ua = utils.getBidIdParameter('ua', bidReq.params) || window.navigator.userAgent;

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
    function isSecure() {
      return window && window.location &&
        window.location.protocol == 'https:' || window.location.protocol == 'https'; // without ":" to support an older FF version
    }

    function secureValue() {
      return isSecure() ? 1: 0;
    }

    function buildInappRequest() {
      var appBundle = utils.getBidIdParameter('appBundle', bidReq.params);
      return {
        id: utils.getUniqueIdentifierStr(),
        imp: [{
          id: bidReq.bidId,
          banner: {
            w: adW,
            h: adH
          },
          tagid: toStringIfExists(rtbTagId || bidReq.placementCode),
          bidfloor: bidFloor,
          exp: 180,
          secure: secureValue()
        }],
        app: {
          id: toStringIfExists(utils.getBidIdParameter('appId', bidReq.params) || rtbSiteId || appBundle),
          name: utils.getBidIdParameter('appName', bidReq.params),
          bundle: appBundle,
          storeurl: utils.getBidIdParameter('appStoreurl', bidReq.params),
          publisher: {
            id: publisherId
          }
        },
        at: 1,
        device: {
          ua: ua,
          ifa: utils.getBidIdParameter('deviceIfa', bidReq.params),
          geo: {
            lat: utils.getBidIdParameter('lat', bidReq.params),
            lon: utils.getBidIdParameter('lon', bidReq.params),
            type: utils.getBidIdParameter('geoType', bidReq.params),
            utcoffset: utils.getBidIdParameter('utcoffset', bidReq.params)
          }
        },
        user: {
          geo: {
            utcoffset: utils.getBidIdParameter('utcoffset', bidReq.params)
          }
        }
      };
    }

    function buildWebRequest() {
      return {
        id: utils.getUniqueIdentifierStr(),
        imp: [{
          id: bidReq.bidId,
          banner: {
            w: adW,
            h: adH
          },
          tagid: toStringIfExists(rtbTagId || bidReq.placementCode),
          bidfloor: bidFloor,
          exp: 180,
          secure: secureValue()
        }],
        site: {
          domain: domain,
          page: page,
          publisher: {
            id: publisherId
          }
        },
        at: 1,
        device: {
          ua: ua,
        },
        user: {
          geo: {
            utcoffset: utils.getBidIdParameter('utcoffset', bidReq.params)
          }
        }
      };
    }

    function toStringIfExists(val) {
      if (val === undefined || val === null) {
        return val;
      }
      return String(val);
    }

    // build bid request with impressions
    var bidRequest;

    if (isInapp) {
      bidRequest = buildInappRequest();
    } else {
      bidRequest = buildWebRequest();
    }

    var pageUrl = utils.getBidIdParameter('pageUrl', bidReq.params);
    var pageDomain = utils.getBidIdParameter('pageDomain', bidReq.params);
    var ip = utils.getBidIdParameter('ip', bidReq.params);
    bidRequest.tmax = timeout;
    bidRequest.cur = ["USD"];
    if (bidRequest.site) {
      if (pageUrl) {
        bidRequest.site.page = pageUrl;
      }

      if (pageDomain) {
        bidRequest.site.domain = pageDomain;
      }

      if (rtbSiteId) {
        bidRequest.site.id = rtbSiteId;
      }
    }

    if (buyerUid) {
      bidRequest.user = bidRequest.user || {};
      bidRequest.user.buyeruid = buyerUid;
    }

    if (ip && bidRequest.device) {
      bidRequest.device.ip = ip;
    }
    var tagId = utils.getBidIdParameter('tagId', bidReq.params);
    bidRequest.bidId = bidReq.bidId;
    var scriptUrl = '//' + openRtbAdapterHost + '/api/v2/services/prebid?callback=window.$$PREBID_GLOBAL$$.mgres' +
      '&br=' + encodeURIComponent(JSON.stringify(bidRequest)) +
      '&tmax=' + timeout +
      '&tag_id=' + tagId +
      '&bidder_url=' + encodeURIComponent(utils.getBidIdParameter('bidderUrl', bidReq.params));
    return {
      method: 'GET',
      url:scriptUrl,
      data:"",
      options: {withCredentials: false}
    };

  },


  interpretResponse: function(serverResponse, bidRequest) {
    bidRequest=parseBidRequest(bidRequest);
    const bidResponses = [];
    let bidResp= JSON.parse(serverResponse.body);

    let tag=bidResp.tag;
    bidResp=bidResp.response;
    ///////


    if ((!bidResp || !bidResp.id) ||
      (!bidResp.seatbid || bidResp.seatbid.length === 0 || !bidResp.seatbid[0].bid || bidResp.seatbid[0].bid.length === 0)) {
      return [];
    }

    bidResp.seatbid[0].bid.forEach(function (bidderBid) {
      var responseCPM;
      var placementCode = '';
      var bidSet = bidsRequested;
      var memegenTagId = tag;

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
        bidResponse.memegenTagId = memegenTagId;
        bidResponse.currency="USD";
        bidResponse.netRevenue=true;
        bidResponse.requestId=bidRequest.bidId;
        bidResponse.ttl=360;
        bidResponses.push(bidResponse);

      }
    });
    return bidResponses;
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
