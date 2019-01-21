import { expect } from 'chai';
import { spec } from 'modules/a4gBidAdapter';

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
  });
});
