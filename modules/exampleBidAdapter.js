import * as utils from 'src/utils';
import {config} from 'src/config';
import {registerBidder} from 'src/adapters/bidderFactory';
const BIDDER_CODE = 'example';
var bidId;
export const spec = {
  code: BIDDER_CODE,
  aliases: ['ex'], // short code
  /**
   * Determines whether or not the given bid request is valid.
   *
   * @param {BidRequest} bid The bid params to validate.
   * @return boolean True if this is a valid bid, and false otherwise.
   */
  isBidRequestValid: function(bid) {
    return true;
  },
  /**
   * Make a server request from the list of BidRequests.
   *
   * @param {validBidRequests[]} - an array of bids
   * @return ServerRequest Info describing the request to the server.
   */
  buildRequests: function(validBidRequests) {
    bidId=validBidRequests[0].bidId;
    console.log("validBidRequests:"+JSON.stringify( validBidRequests));
    const payload = {
      /*
      Use `bidderRequest.bids[]` to get bidder-dependent
      request info.

      If your bidder supports multiple currencies, use
      `config.getConfig(currency)` to find which one the ad
      server needs.

      Pull the requested transaction ID from
      `bidderRequest.bids[].transactionId`.
      */
    };
    //const payloadString = JSON.stringify(payload);
    var blob = new Blob(["Hello, world!"], { type: 'text/plain' });
    var blobUrl = URL.createObjectURL(blob);
    return {
      method: 'GET',
      url: blobUrl,
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
    console.log("bidRequest"+JSON.stringify(bidRequest));
    console.log("serverResponse"+JSON.stringify(serverResponse));
    // const serverBody  = serverResponse.body;
    // const headerValue = serverResponse.headers.get('some-response-header');
    // const bidResponses = [];
    // const bidResponse = {
    //   requestId: bidRequest.bidId,
    //   cpm: 5,
    //   width: 300,
    //   height: 500,
    //   creativeId: "CREATIVE_ID",
    //   dealId: "DEAL_ID",
    //   currency: "USD",
    //   netRevenue: true,
    //   ttl: 300,
    //   referrer: "REFERER",
    //   ad: "CREATIVE_BODY"
    // };
    // bidResponses.push(bidResponse);
    // console.log("bidResponses: "+JSON.stringify(bidResponses));
    console.log("bidId: "+bidId);
    return [{requestId:bidId,bidderCode: BIDDER_CODE,cpm:0.003986,creativeId:118214804,currency:"USD",netRevenue:true,ttl:300,adUnitCode:"98",example:{buyerMemberId:406},width:300,height:600,ad:"<!-- Creative 118214804 served by Member 406 via AppNexus --><a href=\"http://fra1-ib.adnxs.com/click?6IL6ljlddj9S1V8KalNwPwAAAKBH4eo_mueIfJdSdz_ecYqO5PJ_P1diSLDYwq0ZGHLNFzL6RmgPOQ5cAAAAAKHkvgBRDAAAlgEAAAIAAACU0AsHbOsVAAAAAABVU0QAVVNEACwBWAIKWQAAAAABAQUCAAAAALgA-yQoRgAAAAA./bcr=AAAAAAAA8D8=/cnd=%21lBHZNAj74p8MEJShrzgY7NZXIAAoADH8qfHSTWJQPzoJRlJBMTo0MTQ2QM0CSQAAAAAAAPA_UQAAAAAAAAAAWQAAAAAAAAAA/cca=NDA2I0ZSQTE6NDE0Ng==/bn=84475/referrer=http%3A%2F%2Fmediamart.tv%2Fsas%2Ftests%2FDesktop%2Fcaesar%2Fdfptest.html/clickenc=https%3A%2F%2Fnavigator.inspirato.com%2Fgorgeous-natural-destinations-for-adventurous-travelers%2F\" target=\"_blank\"><img width=\"300\" height=\"600\" style=\"border-style: none\" src=\"http://vcdn.adnxs.com/p/creative-image/9e/34/fb/e7/9e34fbe7-408c-4446-8cfa-f17b316105ad.jpg\"/></a><iframe src=\"http://acdn.adnxs.com/dmp/async_usersync.html\" width=\"1\" height=\"1\" frameborder=\"0\" scrolling=\"no\" marginheight=\"0\" marginwidth=\"0\" topmargin=\"0\" leftmargin=\"0\" style=\"position:absolute;overflow:hidden;clip:rect(0 0 0 0);height:1px;width:1px;margin:-1px;padding:0;border:0;\"></iframe><script>try {!function(){function e(e,t){return\"function\"==typeof __an_obj_extend_thunk?__an_obj_extend_thunk(e,t):e}function t(e,t){\"function\"==typeof __an_err_thunk&&__an_err_thunk(e,t)}function n(e,t){if(\"function\"==typeof __an_redirect_thunk)__an_redirect_thunk(e);else{var n=navigator.connection;navigator.__an_connection&&(n=navigator.__an_connection),window==window.top&&n&&n.downlinkMax<=.115&&\"function\"==typeof HTMLIFrameElement&&HTMLIFrameElement.prototype.hasOwnProperty(\"srcdoc\")?(window.__an_resize=function(e,t,n){var r=e.frameElement;r&&\"__an_if\"==r.getAttribute(\"name\")&&(t&&(r.style.width=t+\"px\"),n&&(r.style.height=n+\"px\"))},document.write('<iframe name=\"__an_if\" style=\"width:0;height:0\" srcdoc=\"<script type=\\'text/javascript\\' src=\\''+e+\"&\"+t.bdfif+\"=1'></sc\"),document.write('ript>\" frameborder=\"0\" scrolling=\"no\" marginheight=0 marginwidth=0 topmargin=\"0\" leftmargin=\"0\" allowtransparency=\"true\"></iframe>')):document.write('<script language=\"javascript\" src=\"'+e+'\"></scr'+'ipt>')}};var r=function(e){this.rdParams=e};r.prototype={constructor:r,walkAncestors:function(e){try{if(!window.location.ancestorOrigins)return;for(var t=0,n=window.location.ancestorOrigins.length;n>t;t++)e.call(null,window.location.ancestorOrigins[t],t)}catch(r){\"undefined\"!=typeof console}return[]},walkUpWindows:function(e){var t,n=[];do try{t=t?t.parent:window,e.call(null,t,n)}catch(r){return\"undefined\"!=typeof console,n.push({referrer:null,location:null,isTop:!1}),n}while(t!=window.top);return n},getPubUrlStack:function(e){var n,r=[],o=null,i=null,a=null,c=null,d=null,s=null,u=null;for(n=e.length-1;n>=0;n--){try{a=e[n].location}catch(l){\"undefined\"!=typeof console,t(l,\"AnRDModule::getPubUrlStack:: location\")}if(a)i=encodeURIComponent(a),r.push(i),u||(u=i);else if(0!==n){c=e[n-1];try{d=c.referrer,s=c.ancestor}catch(l){\"undefined\"!=typeof console,t(l,\"AnRDModule::getPubUrlStack:: prevFrame\")}d?(i=encodeURIComponent(d),r.push(i),u||(u=i)):s?(i=encodeURIComponent(s),r.push(i),u||(u=i)):r.push(o)}else r.push(o)}return{stack:r,detectUrl:u}},getLevels:function(){var e=this.walkUpWindows(function(e,n){try{n.push({referrer:e.document.referrer||null,location:e.location.href||null,isTop:e==window.top})}catch(r){n.push({referrer:null,location:null,isTop:e==window.top}),\"undefined\"!=typeof console,t(r,\"AnRDModule::getLevels\")}});return this.walkAncestors(function(t,n){e[n].ancestor=t}),e},getRefererInfo:function(){var e=\"\";try{var n=this.getLevels(),r=n.length-1,o=null!==n[r].location||r>0&&null!==n[r-1].referrer,i=this.getPubUrlStack(n);e=this.rdParams.rdRef+\"=\"+i.detectUrl+\"&\"+this.rdParams.rdTop+\"=\"+o+\"&\"+this.rdParams.rdIfs+\"=\"+r+\"&\"+this.rdParams.rdStk+\"=\"+i.stack+\"&\"+this.rdParams.rdQs}catch(a){e=\"\",\"undefined\"!=typeof console,t(a,\"AnRDModule::getRefererInfo\")}return e}};var o=function(n){var o=\"\";try{n=e(n,0);var i=e(new r(n),1);return i.getRefererInfo()}catch(a){o=\"\",\"undefined\"!=typeof console,t(a,\"AnRDModule::executeRD\")}return o};;var c=\"http://fra1-ib.adnxs.com/rd_log?referrer=http%3A%2F%2Fmediamart.tv%2Fsas%2Ftests%2FDesktop%2Fcaesar%2Fdfptest.html&e=wqT_3QLyB_SzAfIDAAADANYABQEIj_K44AUQ18Shgovb8NYZGJjktb6hxr6jaCo2CeiC-pY5XXY_EVLVXwpqU3A_GQAAAKBH4eo_IZrniHyXUnc_Kd5xio7k8n8_MQAAAEDhepQ_MKHJ-wU40RhAlgNIAlCUoa84WOzWV2AAaIqycXj7kwWAAQGKAQNVU0SSAQNVU0SYAawCoAHYBKgBAbABALgBAcABBcgBAtABANgBAOABAPABAIoCWnVmKCdhJywgMjcyOTQ4NiwgMTU0NDQzNTk4Myk7dWYoJ3InLCAxMTgyMTQ4MDQsIDE1NDQ0MzU5ODMpO3VmKCdjJywgMjU2ODYzOTUsIDE1NDQ0MzU5ODMpO5IC8QEhb2pObHdnajc0cDhNRUpTaHJ6Z1lBQ0RzMWxjd0FEZ0FRQUJJbGdOUW9jbjdCVmdBWUhob0FIQUFlQUNBQVNLSUFTaVFBUUdZQVFHZ0FRR29BUU93QVFDNUFhVEhMNVhsOG44X3dRR2t4eS1WNWZKX1A4a0JBQUFBQUFBQThEX1pBUUFBQUFBQUFQQV80QUVBOVFFQUFBQUFtQUlBb0FJQXRRSUEBLQh2UUkBB_BMQXdBSUF5QUlBNEFJQTZBSUEtQUlBZ0FNQmtBTUFtQU1CcUFQNzRwOE11Z01KUmxKQk1UbzBNVFEyNEFQTkFnLi6aAmEhbEJIWk5BajcBKABFDfRcN05aWElBQW9BREg4cWZIU1RXSlFQem9KLkQAEFFNMENTHbAAVREMDEFBQVcdDPBg2ALnQ-ACnY9G6gI5aHR0cDovL21lZGlhbWFydC50di9zYXMvdGVzdHMvRGVza3RvcC9jYWVzYXIvZGZwdGVzdC5odG1s8gITCg9DVVNUT01fTU9ERUxfSUQSAPICGgoWQy4WACBMRUFGX05BTUUBHQweChpDMh0A8JNBU1RfTU9ESUZJRUQSAIADAIgDAZADAJgDF6ADAaoDAMADrALIAwDYAwDgAwDoAwD4AwGABACSBA0vdXQvdjMvcHJlYmlkmAQAogQNMzEuMTU0LjE2OC4zNKgE_-ELsgQQCAAQARisAiDYBCgAMAA4ArgEAMAEAMgEANIEDTQwNiNGUkExOjQxNDbaBAIIAeAEAfAEYRkgiAUBmAUAoAX_EQEYAcAFAMkFAAUBFPA_0gUJCQULeAAAANgFAeAFAfAF2kr6BQQIABAAkAYAmAYAuAYAwQYBIDAAAPA_yAYA2gYWChAAOgEADBAAGAA.&s=d3d607e37363c7f7cafb7389f7541fccdce82701\";c+=\"&\"+o({rdRef:\"bdref\",rdTop:\"bdtop\",rdIfs:\"bdifs\",rdStk:\"bstk\",rdQs:\"\"}),n(c,{bdfif:\"bdfif\"})}();} catch (e) { }</script><div name=\"anxv\" lnttag=\"v;tv=view7-1h;st=1;d=300x600;vc=iab;vid_ccr=1;ab=66;tag_id=12510369;cb=http%3A%2F%2Ffra1-ib.adnxs.com%2Fvevent%3Freferrer%3Dhttp%253A%252F%252Fmediamart.tv%252Fsas%252Ftests%252FDesktop%252Fcaesar%252Fdfptest.html%26e%3DwqT_3QLyB_SzAfIDAAADANYABQEIj_K44AUQ18Shgovb8NYZGJjktb6hxr6jaCo2CeiC-pY5XXY_EVLVXwpqU3A_GQAAAKBH4eo_IZrniHyXUnc_Kd5xio7k8n8_MQAAAEDhepQ_MKHJ-wU40RhAlgNIAlCUoa84WOzWV2AAaIqycXj7kwWAAQGKAQNVU0SSAQNVU0SYAawCoAHYBKgBAbABALgBAcABBcgBAtABANgBAOABAPABAIoCWnVmKCdhJywgMjcyOTQ4NiwgMTU0NDQzNTk4Myk7dWYoJ3InLCAxMTgyMTQ4MDQsIDE1NDQ0MzU5ODMpO3VmKCdjJywgMjU2ODYzOTUsIDE1NDQ0MzU5ODMpO5IC8QEhb2pObHdnajc0cDhNRUpTaHJ6Z1lBQ0RzMWxjd0FEZ0FRQUJJbGdOUW9jbjdCVmdBWUhob0FIQUFlQUNBQVNLSUFTaVFBUUdZQVFHZ0FRR29BUU93QVFDNUFhVEhMNVhsOG44X3dRR2t4eS1WNWZKX1A4a0JBQUFBQUFBQThEX1pBUUFBQUFBQUFQQV80QUVBOVFFQUFBQUFtQUlBb0FJQXRRSUEBLQh2UUkBB_BMQXdBSUF5QUlBNEFJQTZBSUEtQUlBZ0FNQmtBTUFtQU1CcUFQNzRwOE11Z01KUmxKQk1UbzBNVFEyNEFQTkFnLi6aAmEhbEJIWk5BajcBKABFDfRcN05aWElBQW9BREg4cWZIU1RXSlFQem9KLkQAEFFNMENTHbAAVREMDEFBQVcdDPBg2ALnQ-ACnY9G6gI5aHR0cDovL21lZGlhbWFydC50di9zYXMvdGVzdHMvRGVza3RvcC9jYWVzYXIvZGZwdGVzdC5odG1s8gITCg9DVVNUT01fTU9ERUxfSUQSAPICGgoWQy4WACBMRUFGX05BTUUBHQweChpDMh0A8JNBU1RfTU9ESUZJRUQSAIADAIgDAZADAJgDF6ADAaoDAMADrALIAwDYAwDgAwDoAwD4AwGABACSBA0vdXQvdjMvcHJlYmlkmAQAogQNMzEuMTU0LjE2OC4zNKgE_-ELsgQQCAAQARisAiDYBCgAMAA4ArgEAMAEAMgEANIEDTQwNiNGUkExOjQxNDbaBAIIAeAEAfAEYRkgiAUBmAUAoAX_EQEYAcAFAMkFAAUBFPA_0gUJCQULeAAAANgFAeAFAfAF2kr6BQQIABAAkAYAmAYAuAYAwQYBIDAAAPA_yAYA2gYWChAAOgEADBAAGAA.%26s%3Dd3d607e37363c7f7cafb7389f7541fccdce82701;ts=1544435983;cet=0;cecb=\" width=\"0\" height=\"0\" style=\"display: block; margin: 0; padding: 0; height: 0; width: 0;\"><script type=\"text/javascript\" async=\"true\" src=\"http://cdn.adnxs.com/v/s/148/trk.js\"></script></div><div style=\"position:absolute;left:0px;top:0px;visibility:hidden;\"><img src=\"http://fra1-ib.adnxs.com/it?referrer=http%253A%252F%252Fmediamart.tv%252Fsas%252Ftests%252FDesktop%252Fcaesar%252Fdfptest.html&e=wqT_3QKeB_SzAZ4DAAADANYABQEIj_K44AUQ18Shgovb8NYZGJjktb6hxr6jaCo2CeiC-pY5XXY_EVLVXwpqU3A_GQAAAKBH4eo_IZrniHyXUnc_Kd5xio7k8n8_MQAAAEDhepQ_MKHJ-wU40RhAlgNIAlCUoa84WOzWV2AAaIqycXj7kwWAAQGKAQNVU0SSAQNVU0SYAawCoAHYBKgBAbABALgBAcABBcgBAtABANgBAOABAPABAIoCWnVmKCdhJywgMjcyOTQ4NiwgMTU0NDQzNTk4Myk7dWYoJ3InLCAxMTgyMTQ4MDQsIDE1NDQ0MzU5ODMpO3VmKCdjJywgMjU2ODYzOTUsIDE1NDQ0MzU5ODMpO5IC8QEhb2pObHdnajc0cDhNRUpTaHJ6Z1lBQ0RzMWxjd0FEZ0FRQUJJbGdOUW9jbjdCVmdBWUhob0FIQUFlQUNBQVNLSUFTaVFBUUdZQVFHZ0FRR29BUU93QVFDNUFhVEhMNVhsOG44X3dRR2t4eS1WNWZKX1A4a0JBQUFBQUFBQThEX1pBUUFBQUFBQUFQQV80QUVBOVFFQUFBQUFtQUlBb0FJQXRRSUEBLQh2UUkBB_BMQXdBSUF5QUlBNEFJQTZBSUEtQUlBZ0FNQmtBTUFtQU1CcUFQNzRwOE11Z01KUmxKQk1UbzBNVFEyNEFQTkFnLi6aAmEhbEJIWk5BajcBKABFDfRcN05aWElBQW9BREg4cWZIU1RXSlFQem9KLkQAEFFNMENTHbAAVREMDEFBQVcdDPQYAdgC50PgAp2PRuoCOWh0dHA6Ly9tZWRpYW1hcnQudHYvc2FzL3Rlc3RzL0Rlc2t0b3AvY2Flc2FyL2RmcHRlc3QuaHRtbIADAIgDAZADAJgDF6ADAaoDAMADrALIAwDYAwDgAwDoAwD4AwGABACSBA0vdXQvdjMvcHJlYmlkmAQAogQNMzEuMTU0LjE2OC4zNKgE_-ELsgQQCAAQARisAiDYBCgAMAA4ArgEAMAEAMgEANIEDTQwNiNGUkExOjQxNDbaBAIIAeAEAfAElKGvOIgFAZgFAKAF____________AcAFAMkFAAAAAAAA8D_SBQkJAAAAAAAAAADYBQHgBQHwBdpK-gUECAAQAJAGAJgGALgGAMEGAAAABTAcyAYA2gYWChAFMTgAAAAAAAAAAAAAABAAGAA.&s=f8188a3c4f66ff8dacda42b34fa9793a28b168a6\"></div>",mediaType:"banner"}];
  },

  /**
   * Register the user sync pixels which should be dropped after the auction.
   *
   * @param {SyncOptions} syncOptions Which user syncs are allowed?
   * @param {ServerResponse[]} serverResponses List of server's responses.
   * @return {UserSync[]} The user syncs which should be dropped.
   */
  getUserSyncs: function(syncOptions, serverResponses) {
    if (syncOptions.iframeEnabled) {
      return [{
        type: 'iframe',
        url: '//acdn.adnxs.com/ib/static/usersync/v3/async_usersync.html'
      }];
    }
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
  }
}
registerBidder(spec);
