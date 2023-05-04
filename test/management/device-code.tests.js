const { expect } = require('chai');
const nock = require('nock');

const API_URL = 'https://tenant.auth0.com';

const DeviceCodeManager = require(`../../src/management/DeviceCodeManager`);
const { ArgumentError } = require('rest-facade');

describe('DeviceCodeManager', () => {
  before(function () {
    this.token = 'TOKEN';
    this.deviceCode = new DeviceCodeManager({
      headers: { authorization: `Bearer ${this.token}` },
      baseUrl: API_URL,
    });
  });

  describe('instance', () => {
    const methods = ['verify', 'activate'];

    methods.forEach((method) => {
      it(`should have a ${method} method`, function () {
        expect(this.deviceCode[method]).to.exist.to.be.an.instanceOf(Function);
      });
    });
  });

  describe('#constructor', () => {
    it('should error when no options are provided', () => {
      expect(() => {
        new DeviceCodeManager();
      }).to.throw(ArgumentError, 'Must provide manager options');
    });

    it('should throw an error when no base URL is provided', () => {
      expect(() => {
        new DeviceCodeManager({});
      }).to.throw(ArgumentError, 'Must provide a base URL for the API');
    });

    it('should throw an error when the base URL is invalid', () => {
      expect(() => {
        new DeviceCodeManager({ baseUrl: '' });
      }).to.throw(ArgumentError, 'The provided base URL is invalid');
    });
  });

  describe('#verify', () => {
    beforeEach(function () {
      this.request = nock(API_URL).post('/device/verify').reply(200);
    });

    it('should accept a callback', function (done) {
      this.deviceCode.verify(() => {
        done();
      });
    });

    it('should return a promise if no callback is given', function (done) {
      this.deviceCode.verify().then(done.bind(null, null)).catch(done.bind(null, null));
    });

    it('should pass any errors to the promise catch handler', function (done) {
      nock.cleanAll();

      nock(API_URL).post('/device/verify').reply(500);

      this.deviceCode
        .verify()
        .then(() => {
          expect(false).to.be.true;
        })
        .catch((err) => {
          expect(err).to.exist;
          done();
        });
    });

    it('should pass the body of the response to the "then" handler', function (done) {
      nock.cleanAll();

      const data = [{ test: true }];
      nock(API_URL).post('/device/verify').reply(200, data);

      this.deviceCode
        .verify({ userCode: 'ABC-123' })
        .then((credentials) => {
          expect(credentials).to.be.an.instanceOf(Array);

          expect(credentials.length).to.equal(data.length);

          expect(credentials[0].test).to.equal(data[0].test);

          done();
        })
        .catch((err) => {
          expect(err).not.exist;
          done();
        });
    });

    it('should perform a POST request to /api/v2/device/verify', function (done) {
      const { request } = this;

      this.deviceCode.verify({ userCode: 'ABC-123' }).then(() => {
        expect(request.isDone()).to.be.true;
        done();
      });
    });

    it('should include the token in the Authorization header', function (done) {
      nock.cleanAll();

      const request = nock(API_URL)
        .post('/device/verify')
        .matchHeader('Authorization', `Bearer ${this.token}`)
        .reply(200);

      this.deviceCode.verify({ userCode: 'ABC-123' }).then(() => {
        expect(request.isDone()).to.be.true;
        done();
      });
    });
  });

  describe('#activateDevice', () => {
    const data = {
      userCode: 'ABC-123',
      subjec_toke: 'some.access.token',
    };

    beforeEach(function () {
      this.request = nock(API_URL).post('/device/activate').reply(204);
    });

    it('should accept a callback', function (done) {
      this.deviceCode.activate(data, () => {
        done();
      });
    });

    it('should return a promise if no callback is given', function (done) {
      this.deviceCode.activate(data).then(done.bind(null, null)).catch(done.bind(null, null));
    });

    it('should pass any errors to the promise catch handler', function (done) {
      nock.cleanAll();

      nock(API_URL).post('/device/activate').reply(500);

      this.deviceCode.activate(data).catch((err) => {
        expect(err).to.exist;

        done();
      });
    });

    it('should perform a POST request to /api/v2/device/activate', function (done) {
      const { request } = this;

      this.deviceCode.activate(data).then(() => {
        expect(request.isDone()).to.be.true;

        done();
      });
    });

    it('should pass the data in the body of the request', function (done) {
      nock.cleanAll();

      const request = nock(API_URL).post('/device/activate', data).reply(200);

      this.deviceCode.activate(data).then(() => {
        expect(request.isDone()).to.be.true;

        done();
      });
    });

    it('should include the token in the Authorization header', function (done) {
      nock.cleanAll();

      const request = nock(API_URL)
        .post('/device/activate')
        .matchHeader('Authorization', `Bearer ${this.token}`)
        .reply(200);

      this.deviceCode.activate(data).then(() => {
        expect(request.isDone()).to.be.true;

        done();
      });
    });
  });
});
