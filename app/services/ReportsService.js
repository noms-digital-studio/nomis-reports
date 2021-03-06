const log = require('../../server/log');

const ProcessAgent = require('../helpers/MainProcessAgent');

const describe = (name, promise, alt, map) =>
  promise
    .then((data) => ({ [name]: (data || alt) }))
    .then((data) => data.map && map ? data.map(map) : data)
    .catch((err) => {
      log.error({ name, err }, 'ReportsService describe ERROR');

      return alt;
    });

function ReportsService(config, processAgent) {
  this.config = config;
  this.agent = processAgent || new ProcessAgent(this.config);
}

ReportsService.prototype.listOffenders = function (query, page, size) {
  return this.agent.request('reports', 'listOffenders', query, page, size)
    .then(response => {
      response._embedded.offenders =
        response._embedded.offenders
          .filter(o => (o.bookings && o.bookings[0] && o.bookings[0].agencyLocationId && o.bookings[0].agencyLocationId !== 'ZZGHI'));

      return response;
    });
};

ReportsService.prototype.getDetails = function (offenderId) {
  return this.getOffender(offenderId)
    .then(offender => {
      let bookingId = offender.bookings[0].bookingId;

      return Promise.all([
        describe('addresses', this.getOffenderAddresses(offenderId), []),
        describe('alerts', this.getOffenderAlerts(offenderId), []),
        describe('assessments', this.getOffenderAssessments(offenderId), []),
        describe('charges', this.getOffenderCharges(offenderId), []),
        describe('contactPersons', this.getOffenderContactPersons(offenderId), []),
        describe('courseAttendances', this.getOffenderCourseAttendances(offenderId), []),
        describe('courseExclusions', this.getOffenderCourseExclusions(offenderId), []),
        describe('courtEvents', this.getOffenderCourtEvents(offenderId), []),
        describe('diaryDetails', this.getOffenderDiaryDetails(offenderId), []),
        describe('employments', this.getOffenderEmployments(offenderId), []),
        describe('healthProblems', this.getOffenderHealthProblems(offenderId), []),
        describe('ieps', this.getOffenderIEPs(offenderId), []),
        describe('imprisonmentStatuses', this.getOffenderImprisonmentStatuses(offenderId), []),
        describe('individualSchedules', this.getOffenderIndividualSchedules(offenderId), []),
        describe('movements', this.getOffenderMovements(offenderId), []),
        describe('physicals', this.getOffenderPhysicals(offenderId), []),
        describe('programmeProfiles', this.getOffenderProgrammeProfiles(offenderId, bookingId), []),
        describe('rehabDecisions', this.getOffenderRehabDecisions(offenderId), []),
        describe('releaseDetails', this.getOffenderReleaseDetails(offenderId), []),
        describe('sentenceCalculations', this.getOffenderSentenceCalculations(offenderId), []),
        describe('sentences', this.getOffenderSentences(offenderId), []),
      ])
      .then((data) => data.reduce((a, b) => Object.assign(a, b), offender));
    });
};

ReportsService.prototype.getDetailsByNomsId = function (nomsId) {
  return this.getOffenderByNomsId(nomsId).then(o => this.getDetails(o.offenderId));
};




ReportsService.prototype.listAddresses = function (query, page, size) {
  return this.agent.request('reports', 'listAddresses', query, page, size);
};

ReportsService.prototype.listAgencyLocations = function (query, page, size) {
  return this.agent.request('reports', 'listAgencyLocations', query, page, size);
};

ReportsService.prototype.listAgencyInternalLocations = function (query, page, size) {
  return this.agent.request('reports', 'listAgencyInternalLocations', query, page, size);
};

ReportsService.prototype.listAlerts = function (query, page, size) {
  return this.agent.request('reports', 'listAlerts', query, page, size);
};

ReportsService.prototype.listAssessments = function (query, page, size) {
  return this.agent.request('reports', 'listAssessments', query, page, size);
};

ReportsService.prototype.listCharges = function (query, page, size) {
  return this.agent.request('reports', 'listCharges', query, page, size);
};

ReportsService.prototype.listEvents = function (query, page, size) {
  return this.agent.request('reports', 'listEvents', query, page, size);
};

ReportsService.prototype.listHealthProblems = function (query, page, size) {
  return this.agent.request('reports', 'listHealthProblems', query, page, size);
};

ReportsService.prototype.listImprisonmentStatuses = function (query, page, size) {
  return this.agent.request('reports', 'listImprisonmentStatuses', query, page, size);
};

ReportsService.prototype.listMovements = function (query, page, size) {
  return this.agent.request('reports', 'listMovements', query, page, size);
};

ReportsService.prototype.listOffences = function (query, page, size) {
  return this.agent.request('reports', 'listOffences', query, page, size);
};

ReportsService.prototype.listOffenders = function (query, page, size) {
  return this.agent.request('reports', 'listOffenders', query, page, size);
};

ReportsService.prototype.listReleaseDetails = function (query, page, size) {
  return this.agent.request('reports', 'listReleaseDetails', query, page, size);
};

ReportsService.prototype.listSentenceCalculations = function (query, page, size) {
  return this.agent.request('reports', 'listSentenceCalculations', query, page, size);
};

ReportsService.prototype.listSentences = function (query, page, size) {
  return this.agent.request('reports', 'listSentences', query, page, size);
};





ReportsService.prototype.getOffenderByNomsId = function (nomsId) {
  return this.agent.request('reports', 'getOffenderByNomsId', nomsId);
};

ReportsService.prototype.getOffender = function (offenderId) {
  return this.agent.request('reports', 'getOffender', offenderId);
};

ReportsService.prototype.getOffenderAddresses = function (offenderId) {
  return this.agent.request('reports', 'getOffenderAddresses', offenderId);
};

ReportsService.prototype.getOffenderAlerts = function (offenderId) {
  return this.agent.request('reports', 'getOffenderAlerts', offenderId);
};

ReportsService.prototype.getOffenderAssessments = function (offenderId) {
  return this.agent.request('reports', 'getOffenderAssessments', offenderId);
};

ReportsService.prototype.getOffenderCharges = function (offenderId) {
  return this.agent.request('reports', 'getOffenderCharges', offenderId);
};

ReportsService.prototype.getOffenderContactPersons = function (offenderId) {
  return this.agent.request('reports', 'getOffenderContactPersons', offenderId);
};

ReportsService.prototype.getOffenderCourseAttendances = function (offenderId) {
  return this.agent.request('reports', 'getOffenderCourseAttendances', offenderId);
};

ReportsService.prototype.getOffenderCourseExclusions = function (offenderId) {
  return this.agent.request('reports', 'getOffenderCourseExclusions', offenderId);
};

ReportsService.prototype.getOffenderCourtEvents = function (offenderId) {
  return this.agent.request('reports', 'getOffenderCourtEvents', offenderId);
};

ReportsService.prototype.getOffenderDiaryDetails = function (offenderId) {
  return this.agent.request('reports', 'getOffenderDiaryDetails', offenderId);
};

ReportsService.prototype.getOffenderEmployments = function (offenderId) {
  return this.agent.request('reports', 'getOffenderEmployments', offenderId);
};

ReportsService.prototype.getOffenderHealthProblems = function (offenderId) {
  return this.agent.request('reports', 'getOffenderHealthProblems', offenderId);
};

ReportsService.prototype.getOffenderIEPs = function (offenderId) {
  return this.agent.request('reports', 'getOffenderIEPs', offenderId);
};

ReportsService.prototype.getOffenderImprisonmentStatuses = function (offenderId) {
  return this.agent.request('reports', 'getOffenderImprisonmentStatuses', offenderId);
};

ReportsService.prototype.getOffenderIndividualSchedules = function (offenderId) {
  return this.agent.request('reports', 'getOffenderIndividualSchedules', offenderId);
};

ReportsService.prototype.getOffenderMovements = function (offenderId) {
  return this.agent.request('reports', 'getOffenderMovements', offenderId);
};

ReportsService.prototype.getOffenderPhysicals = function (offenderId) {
  return this.agent.request('reports', 'getOffenderPhysicals', offenderId);
};

ReportsService.prototype.getOffenderProgrammeProfiles = function (offenderId, bookingId) {
  return this.agent.request('reports', 'getOffenderProgrammeProfiles', offenderId, bookingId);
};

ReportsService.prototype.getOffenderRehabDecisions = function (offenderId) {
  return this.agent.request('reports', 'getOffenderRehabDecisions', offenderId);
};

ReportsService.prototype.getOffenderReleaseDetails = function (offenderId) {
  return this.agent.request('reports', 'getOffenderReleaseDetails', offenderId);
};

ReportsService.prototype.getOffenderSentenceCalculations = function (offenderId) {
  return this.agent.request('reports', 'getOffenderSentenceCalculations', offenderId);
};

ReportsService.prototype.getOffenderSentences = function (offenderId) {
  return this.agent.request('reports', 'getOffenderSentences', offenderId);
};

module.exports = ReportsService;
