import { expect } from 'chai';
import { spec } from 'modules/timBidAdapter';

describe('timAdapterTests', function () {
  describe('bidRequestValidity', function () {
    it('bidRequest with publisherid and placementCode params', function () {
      expect(spec.isBidRequestValid({
        bidder: 'tim',
        params: {
          publisherid: 'testid',
          placementCode: 'testplacement'
        }
      })).to.equal(true);
    });

    it('bidRequest with only publisherid', function () {
      expect(spec.isBidRequestValid({
        bidder: 'tim',
        params: {
          publisherid: 'testid'
        }
      })).to.equal(false);
    });

    it('bidRequest with only placementCode', function () {
      expect(spec.isBidRequestValid({
        bidder: 'tim',
        params: {
          placementCode: 'testplacement'
        }
      })).to.equal(false);
    });

    it('bidRequest without params', function () {
      expect(spec.isBidRequestValid({
        bidder: 'tim',
      })).to.equal(false);
    });
  });

  describe('buildRequests', function () {
    const validBidRequests = [{
      'bidder':'tim',
      'params':{"placementCode":"header-bid-tag-0", "publisherid":"testpublisherid"},
      "mediaTypes":{"banner":{"sizes":[[300,250]]}},
      "adUnitCode":"99",
      "transactionId":"99268e2f-5695-4334-b0cf-48b0d820f4f2",
      "sizes":[[300,250]],
      "bidId":"2c9c5333e3a972",
      "bidderRequestId":"1172997b088c21",
      "auctionId":"3e300f32-cee0-493f-9240-b43064ed28ee",
      "src":"client",
      "bidRequestsCount":1
      }];

    it('bidRequest method', function () {
      const request = spec.buildRequests(validBidRequests);
      expect(request.method).to.equal('GET');
    });

  });

});
