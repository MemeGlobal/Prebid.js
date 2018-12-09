import * as utils from 'src/utils';
import {config} from 'src/config';
import {registerBidder} from 'src/adapters/bidderFactory';
const BIDDER_CODE = 'a9Parallel';
export const spec = {
  code: BIDDER_CODE,
  aliases: ['a9Parallel'], // short code
  /**
   * Determines whether or not the given bid request is valid.
   *
   * @param {BidRequest} bid The bid params to validate.
   * @return boolean True if this is a valid bid, and false otherwise.
   */
  isBidRequestValid: function(bid) {
    return false;
  },
  /**
   * Make a server request from the list of BidRequests.
   *
   * @param {validBidRequests[]} - an array of bids
   * @return {method: string, url: null, data: string} Info describing the request to the server.
   */
  buildRequests: function(validBidRequests) {
  },
  /**
   * Unpack the response from the server into a list of bids.
   *
   * @param {ServerResponse} serverResponse A successful response from the server.
   * @return {Bid[]} An array of bids which were nested inside the server.
   */
  interpretResponse: function(serverResponse, bidRequest) {
  return [];
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
