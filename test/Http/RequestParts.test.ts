import { expect } from 'chai';
import RequestParts from "../../src/Http/RequestParts";

describe('Http/', () => {
    describe('RequestParts', () => {
        describe('()', () => {
            let requestParts = new RequestParts(
                'url',
                {param: 'value1'},
                {option: 'op1'}
            );

            it('Should work properly', () => {
                expect(requestParts.getUrl()).to.be.equal('url');
                expect(requestParts.getParameters()).to.be.deep.equal({param: 'value1'});
                expect(requestParts.getOptions()).to.be.deep.equal({option: 'op1'});
            });
        });

    });
});