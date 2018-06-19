const fs = require('fs');
const moment = require('moment');
const jsonStream = require('jsonstream');
const jsonPatch = require('fast-json-patch');
const csv = require('csvtojson');
const pointer = require('json-pointer');

const log = require('../server/log');

const cdeSource = './test/data/C_NOMIS_OFFENDER_30052018_01.dat';
const jsonSource = './.extracts/reports/CDE/20180531.json';
const jsonOutput = './.extracts/reports/diff.31.json';

const inspect = (x) => {
  log.info(x);
  return x;
};

let fieldNum = 153;

const cdeFields = [
  'sysdate_f1',                     // passed param
  'establishment_f2',               // ref data label
  'estab_code_f3',                  // 0 differences
  'nomis_id_f4',                    // 0 differences
  'gender_f5',                      // ref data label
  'prison_no_f6',                   // 0 differences
  'surname_f7',                     // 0 differences
  'forename1_f8',                   // 0 differences
  'forename2_f9',                   // now includes middle_name_2
  'cro_f10',                        // 0 differences
  'adult_yp_f11',                   // ref data label
  'age_f12',                        // 0 differences
  'dob_f13',                        // 0 differences
  'nationality_f14',                // ref data label
  'ethnicity_f15',                  // ref data label
  'religion_f16',                   // ref data label
  'marital_f17',                    // ref data label
  'maternity_status_f18',           // ref data label
  'location_f19',                   // ref data label
  'incentive_band_f20',
  'occupation_v21',
  'transfer_reason_f22',
  'first_reception_date_f23',       // 0 differences
  'custody_status_f24',
  'inmate_status_f25',              // ref data label
  'sec_cat.level_f26',              // ref data label - data linked to f17, f27, f74
  'sec_cat.next_review_f27',        // A6304AA, X0258XX - data linked to f17, f27, f74
  'sentence.years_f28',
  'sentence.months_f29',
  'sentence.days_f30',
  'previous_prison_no_f31',
  'earliest_release_date_f32',
  'check_hold.governor_f33',
  'check_hold.f34',                 // 0 differences
  'check_hold.f35',                 // 0 differences
  'check_hold.allocation_36',
  'check_hold.security_37',
  'check_hold.medical_38',
  'check_hold.parole_39',
  'date_of_first_conviction_40',
  'date_first_sentenced_f41',
  'f2052_status_42',
  'highest_ranked_offence_f43',
  'f44',                            // 0 differences
  'pending_transfers_f45',          // 0 differences
  'received_from_f46',              // 0 differences
  'vulnerable_prisoner_alert_f47',
  'pnc_f48',
  'emplmnt_status.discharge_f49',   // A8144AA, A1011AC
  'emplmnt_status.reception_f50',   // A8144AA, A1011AC
  'schedule_1_sex_offender_f51',
  'sex_offender_f52',               // A8508AA, A8518AA
  'supervising_service_f53',
  'height_metres_f54',
  'complexion_f55',                 // 0 differences
  'hair_f56',                       // 0 differences
  'left_eye_f57',                   // 0 differences
  'right_eye_f58',                  // 0 differences
  'build_f59',                      // ref data label
  'face_f60',                       // 0 differences
  'facial_hair_f61',                // ref data label
  'marks.head_f62',                 // 0 differences
  'marks.body_f63',                 // 0 differences
  'sentence_length_f64',
  'release.date_f65',
  'releasename_f66',
  'sed_f67',
  'hdced_f68',
  'hdcad_f69',
  'ped_f70',
  'crd_f71',
  'npd_f72',
  'led_f73',
  'date_sec_cat_changed_f74',        // A6304AA, X0258XX - data linked to f17, f27, f74
  'rule_45_yoi_rule_46_f75',
  'f2052sh.alert_f76',
  'f2052sh.start_f77',
  'discharge.nfa_f78',               // ref data label
  'discharge.address1_f79',
  'discharge.address2_f80',
  'discharge.address3_f81',
  'discharge.address4_f82',
  'discharge.address5_f83',
  'discharge.address6_f84',
  'discharge.address7_f85',
  'reception.nfa_f86',
  'reception.address1_f87',
  'reception.address2_f88',
  'reception.address3_f89',
  'reception.address4_f90',
  'reception.address5_f91',
  'reception.address6_f92',
  'reception.address7_f93',
  'home.address1_f94',
  'home.address2_f95',
  'home.address3_f96',
  'home.address4_f97',
  'home.address5_f98',
  'home.address6_f99',
  'home.address7_f100',
  'nok.name_f101',
  'nok.nfa_f102',
  'nok.address1_f103',
  'nok.address2_f104',
  'nok.address3_f105',
  'nok.address4_f106',
  'nok.address5_f107',
  'nok.address6_f108',
  'nok.address7_f109',
  'prob.name_f110',
  'prob.address1_f111',
  'prob.address2_f112',
  'prob.address3_f113',
  'prob.address4_f114',
  'prob.address5_f115',
  'prob.address6_f116',
  'prob.address7_f117',
  'f118',
  'f119',
  'f120',
  'f121',
  'f122',
  'f123',
  'f124',
  'f125',
  'f126',
  'f127',
  'f128',
  'f129',
  'f130',
  'f131',
  'f132',
  'f133',
  'sending_estab_f134',
  'reason_f135',
  'movement.date_f136',
  'movement.hour_f137',
  'movement.min_f138',
  'movement.sec_f139',
  'movement.code_f140',
  'court_f141',
  'escort_f142',
  'first_out_mov_post_adm_f143',
  'employed_f144',
  'diary_details_f145',
  'licence_type_f146',
  'other_offences_f147',
  'active_alerts_f148',
  'court.type_f149',
  'court.code_f150',
  'court.name_f151',
  'activity_details_f152',
  'tused_f153',
];

const cdeColParser = {
  age_f12: 'number',

  sysdate_f1(item) { return moment(item, 'DD/MM/YYYY'); },
  dob_f13(item) { return moment(item, 'DD/MM/YYYY'); },
  first_reception_date_f23(item) { return moment(item, 'DD/MM/YYYY'); },
  ['sec_cat.next_review_f27'](item) { return moment(item, 'DD/MM/YYYY'); },
  earliest_release_date_f32(item) { return moment(item, 'DD/MM/YYYY'); },
  date_of_first_conviction_40(item) { return moment(item, 'DD/MM/YYYY'); },
  date_first_sentenced_f41(item) { return moment(item, 'DD/MM/YYYY'); },
  sed_f67(item) { return moment(item, 'DD/MM/YYYY'); },
  hdced_f68(item) { return moment(item, 'DD/MM/YYYY'); },
  hdcad_f69(item) { return moment(item, 'DD/MM/YYYY'); },
  ped_f70(item) { return moment(item, 'DD/MM/YYYY'); },
  crd_f71(item) { return moment(item, 'DD/MM/YYYY'); },
  npd_f72(item) { return moment(item, 'DD/MM/YYYY'); },
  led_f73(item) { return moment(item, 'DD/MM/YYYY'); },
  date_sec_cat_changed_f74(item) { return moment(item, 'DD/MM/YYYY'); },
  ['f2052sh.start_f77'](item) { return moment(item, 'DD/MM/YYYY'); },
  ['movement.date_f136'](item) { return moment(item, 'DD/MM/YYYY'); },
  first_out_mov_post_adm_f143(item) { return moment(item, 'DD/MM/YYYY'); },
  tused_f153(item) { return moment(item, 'DD/MM/YYYY'); },

  previous_prison_no_f31(item) { return item.replace(/"/g, '').split('~'); },
  pnc_f48(item) { return item.replace(/"/g, '').split('~'); },
  ['marks.head_f62'](item) { return item.replace(/"/g, '').split('~'); },
  ['marks.body_f63'](item) { return item.replace(/"/g, '').split('~'); },
  diary_details_f145(item) { return item.replace(/"/g, '').split('~'); },
  other_offences_f147(item) { return item.replace(/"/g, '').split('~'); },
  active_alerts_f148(item) { return item.replace(/"/g, '').split('~'); },

  sentence_length_f64(item) { return 1 * item; },
  ['sentence.years_f28'](item) { return 1 * item; },
  ['sentence.months_f29'](item) { return 1 * item; },
  ['sentence.days_f30'](item) { return 1 * item; },
};

const upperCase = (x) =>
  typeof x === 'string' ? x.toUpperCase() : x;

const readableDiff = (a, fieldNum) => diff => {
  var val = diff.op !== 'add' ? pointer.get(a, diff.path) : '';
  diff.value = diff.value || '';

  if (typeof diff.value === 'string') {
    diff.value = diff.value.trim();
  }


  // ignore list
  if (~[
    // extract date
    '/sysdate_f1',

     // ref data id
    '/gender_f5',
    '/ethnicity_f15',
    '/nationality_f14',
    '/religion_f16',
    '/marital_f17',
    '/transfer_reason_f22',
    '/sec_cat/level_f26',
    '/reason_f135',
    '/sending_estab_f134',
    '/inmate_status_f25',
    '/location_f19',
    '/establishment_f2',

    // country ref codes
    '/prob/address5_f115',
    '/nok/address5_f107',
    '/reception/address5_f91',
    '/home/address5_f98',
    '/discharge/address5_f83',

  ].indexOf(diff.path)
      // diary Details
      // || diff.path.indexOf('/diary_details_f145') === 0
    ) {
    return;
  }

  if (diff.path !== '/' + cdeFields[fieldNum - 1].replace(/\./g, '/')) {
    //return;
  }

  switch (diff.op) {
    case 'add':
      return diff.value !== ''
              ? [ `(+) ${diff.path}`, `'${val}'`, `'${diff.value}'` ].join(',')
              : undefined;
    case 'replace':
      if (upperCase(val) === upperCase(diff.value)) {
        return;
      }
      if (diff.value !== '') {
        return val !== diff.value
              ? [ `(x) ${diff.path}`, `'${val}'`, `'${diff.value}'` ].join(',')
              : undefined;
      }
    case 'remove':
      return val !== ''
              ? [ `(-) ${diff.path}`, `'${val}'`, `'${diff.value}'` ].join(',')
              : undefined;
  }
};

const cde = { length: 0 };
const diff = { length: 0 };
let waitUntilFinished = false;

const finish = () => {
  log.debug(`Number of differences [${diff.length}]`);
  fs.writeFileSync(jsonOutput, JSON.stringify(diff, null, '  '));
};

const checkDoc = (nomsId, fieldNum) => {
  clearTimeout(waitUntilFinished);

  let x = cde[nomsId];

  //log.info(nomsId, !!x.doc, !!x.line);

  if (x.doc && x.line) {
    delete cde[nomsId];
    cde.length--;

    let d = jsonPatch.compare(x.doc, x.line)
      .map(readableDiff(x.doc, fieldNum))
      .filter(x => x !== undefined);

    if (d && d.length > 0) {
      diff[nomsId] = d;
      diff.length++;
    }

    //log.info({ nomsId, diff: diff.length, cde: cde.length }, 'diff');

    waitUntilFinished = setTimeout(finish, 1000);
  }
};

const processStream = (type, fieldNum) => (x) => {
  let nomsId = x.nomis_id_f4;

  if (type === 'doc' && x.diary_details_f145) {
    x.diary_details_f145 = x.diary_details_f145.map(dd =>
      `"${dd.date_145a || ''}","${dd.time_145b || ''}","${dd.reason_code_145c || ''}","${dd.comment_text_145d || ''}","${dd.escort_type_145e || ''}","${dd.not_for_release_alert_145f || ''}"`
    );
  }

  if (!cde[nomsId]) {
    cde[nomsId] = {};
    cde.length++;
  }

  cde[nomsId][type] = x;

  checkDoc(nomsId, fieldNum);
};

fs.createReadStream(jsonSource, 'utf8')
  .pipe(jsonStream.parse('*'))
  .on('data', processStream('doc', fieldNum))
  .on('error', err => log.error(err));

csv({ noheader: true, headers: cdeFields, delimiter: '|', ignoreEmpty: false, colParser: cdeColParser })
  .fromStream(fs.createReadStream(cdeSource, 'utf8'))
  .subscribe(processStream('line', fieldNum))
  .on('error', err => log.error(err));