const express = require('express');
const router = new express.Router();

const moment = require('moment');
const helpers = require('../helpers');

const ReportsService = require('../services/ReportsService');

const AOModel = require('../models/AO');
const CDEModel = require('../models/CDE');

const services = {};
let setUpServices = (config) => {
  services.reports = services.reports || new ReportsService(config);

  setUpServices = () => {};
};

const list = (req, res, next) =>
  services.reports.listOffenders(
      Object.assign({}, req.query, { page: undefined, size: undefined }),
      req.query.page,
      req.query.size
    )
    .then(data => {
      res.links(helpers.processLinks(data._links));
      return res.json(data._embedded.offenders);
    })
    .catch(helpers.failWithError(res, next));

const retrieveDetails = (req, res, next) =>
  services.reports
    .getDetails(req.params.offenderId)
    .then(data => res.json(data))
    .catch(helpers.failWithError(res, next));

const retrieveOffenderByNomsId = (req, res, next) =>
  services.reports
    .getDetailsByNomsId(req.params.nomsId)
    .then(data => res.json(data))
    .catch(helpers.failWithError(res, next));

const retrieveAODetails = (req, res, next) =>
  services.reports
    .getDetails(req.params.offenderId)
    .then(AOModel.build(moment()))
    .then(data => res.json(data))
    .catch(helpers.failWithError(res, next));

const retrieveAODetailsByNomsId = (req, res, next) =>
  services.reports
    .getDetailsByNomsId(req.params.nomsId)
    .then(AOModel.build(moment()))
    .then(data => res.json(data))
    .catch(helpers.failWithError(res, next));

const retrieveCDEDetails = (req, res, next) =>
  services.reports
    .getDetails(req.params.offenderId)
    .then(CDEModel.build(moment()))
    .then(data => res.json(data))
    .catch(helpers.failWithError(res, next));

const retrieveCDEModel = (req, res, next) =>
  services.reports
    .getDetails(req.params.offenderId)
    .then(CDEModel.buildModel(moment()))
    .then(data => res.json(data))
    .catch(helpers.failWithError(res, next));

const retrieveCDEDetailsByNomsId = (req, res, next) =>
  services.reports
    .getDetailsByNomsId(req.params.nomsId)
    .then(CDEModel.build(moment()))
    .then(data => res.json(data))
    .catch(helpers.failWithError(res, next));

const retrieveCDEModelByNomsId = (req, res, next) =>
  services.reports
    .getDetailsByNomsId(req.params.nomsId)
    .then(CDEModel.buildModel(moment()))
    .then(data => res.json(data))
    .catch(helpers.failWithError(res, next));

router.use((req, res, next) => {
  setUpServices(req.app.locals.config);
  next();
});

router.get('/', list);
// by NOMIS offender_display_id (nomsId)
router.get('/nomsId/:nomsId', retrieveOffenderByNomsId);
router.get('/nomsId/:nomsId/ao', retrieveAODetailsByNomsId);
router.get('/nomsId/:nomsId/cde', retrieveCDEDetailsByNomsId);
router.get('/nomsId/:nomsId/cde/model', retrieveCDEModelByNomsId);
// by NOMIS offender_id
router.get('/:offenderId', retrieveDetails);
router.get('/:offenderId/ao', retrieveAODetails);
router.get('/:offenderId/cde', retrieveCDEDetails);
router.get('/:offenderId/cde/model', retrieveCDEModel);

module.exports = router;
