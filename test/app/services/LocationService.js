let should = require('chai').should();

const request = require('supertest');
const express = require('express');

const LocationRepository = require('../../../app/repositories/LocationRepository');
const LocationService = require('../../../app/services/LocationService');

describe('A Location Service', () => {
  let exampleSet = [
    { locationId: 'ABC', description: 'ABCabc' },
    { locationId: 'DEF', description: 'DEFdef' },
    { locationId: 'GHI', description: 'GHIghi' },
  ];
  let exampleRecord = { locationId: 'TEST', description: 'TESTtest' };
  let exampleInmateList = [
    { offenderNo: 123, description: '123abcABC' },
  ];

  let server = express();
  server.get('/locations', (req, res) => res.status(200).json(exampleSet));
  server.get('/locations/TEST', (req, res) => res.status(200).json(exampleRecord));
  server.get('/locations/FOO/inmates', (req, res) => res.status(200).json(exampleInmateList));
  server.get('/locations/ECHO/inmates', (req, res) => res.status(200).json({ query: req.query }));

  describe('for the Elite 2 API', () => {
    let fakeKey = [
      '-----BEGIN PRIVATE KEY-----',
      'MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgPGJGAm4X1fvBuC1z',
      'SpO/4Izx6PXfNMaiKaS5RUkFqEGhRANCAARCBvmeksd3QGTrVs2eMrrfa7CYF+sX',
      'sjyGg+Bo5mPKGH4Gs8M7oIvoP9pb/I85tdebtKlmiCZHAZE5w4DfJSV6',
      '-----END PRIVATE KEY-----'
    ].join('\n');

    let config = {
      elite2: {
        apiGatewayToken: 'LOCATION-REPO-TOKEN',
        apiGatewayPrivateKey: fakeKey,
        apiUrl: '',
      },
    };

    let locationRepository = new LocationRepository(config, request(server));
    let locationService = new LocationService(config, locationRepository);

    it('should retrieve a list of locations from the remote', () =>
      locationService.list()
        .then((data) => data.should.eql(exampleSet)));

    it('should retrieve a location from the remote for a known locationId', () =>
      locationService.getDetails('TEST')
        .then((data) => data.should.eql(exampleRecord)));

    it('should return nothing if the locationId is not known', () =>
      locationService.getDetails('VOID')
        .then((data) => should.not.exist(data)));

    it('should retrieve a list of inmates from the remote for a known locationId', () =>
      locationService.listInmates('FOO')
        .then((data) => data.should.eql(exampleInmateList)));

    it('should pass the search parameters to the remote', () =>
      locationService.listInmates('ECHO', { q: 'BAR' })
        .then((data) => data.should.eql({ query: { q: 'BAR' }})));
  });
});