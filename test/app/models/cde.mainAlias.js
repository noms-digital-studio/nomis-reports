const modelHelpers = require('../../../app/models/helpers');

describe('cde/mainAlias', () => {
  describe('When the booking is linked to an alias', () => {
    let input = {
      nomsId: "X5815XX",
      offenderId: 1013128,
      firstName: "KOBIR",
      middleNames: "MATHEW PATRICE",
      surname: "ZAHIR",
      dateOfBirth: "1971-04-28",
      gender: {
        code: "M",
        description: "Male"
      },
      ethnicity: {
        code: "B1",
        description: "Black/Black British: Caribbean"
      },
      aliases: [
        {
          nomsId: "X5815XX",
          offenderId: 1021466,
          firstName: "JJJ",
          surname: "VIS0001-MIG002",
          dateOfBirth: "1975-04-18",
          gender: {
            code: "M",
            description: "Male"
          },
        }
      ],
      mainBooking: {
        bookingId: 8133,
        bookingNo: "BM9421",
        offenderId: 1021466,
        rootOffenderId: 1013128,
      },

    };

    let result = modelHelpers.getMainAlias(input);

    it('Should select the offender\'s gender from the alias', () => {
      result.should.have.property('gender', input.aliases[0].gender);
    });

    it('Should select the offender\'s surname from the alias', () => {
      result.should.have.property('surname', input.aliases[0].surname);
    });

    it('Should select the offender\'s forename from the alias', () => {
      result.should.have.property('firstName', input.aliases[0].firstName);
    });

    it('Should select the offender\'s middle names from the alias', () => {
      result.should.not.have.property('middleNames');
    });

    it('Should select the offender\'s date of birth from the alias', () => {
      result.should.have.property('dateOfBirth', input.aliases[0].dateOfBirth);
    });

    it('Should select the offender\'s ethnicity from the alias', () => {
      result.should.not.have.property('ethnicity');
    });
  });

  describe('When the booking is linked to the root alias', () => {
    let input = {
      nomsId: "X5815XX",
      offenderId: 1013128,
      firstName: "KOBIR",
      middleNames: "MATHEW PATRICE",
      surname: "ZAHIR",
      dateOfBirth: "1971-04-28",
      gender: {
        code: "M",
        description: "Male"
      },
      ethnicity: {
        code: "B1",
        description: "Black/Black British: Caribbean"
      },
      aliases: [
        {
          nomsId: "X5815XX",
          offenderId: 1021466,
          firstName: "JJJ",
          surname: "VIS0001-MIG002",
          dateOfBirth: "1975-04-18",
          gender: {
            code: "M",
            description: "Male"
          },
        }
      ],
      mainBooking: {
        bookingId: 8133,
        bookingNo: "BM9421",
        offenderId: 1013128,
        rootOffenderId: 1013128,
      },
    };

    let result = modelHelpers.getMainAlias(input);

    it('Should select the offender\'s gender from the alias', () => {
      result.should.have.property('gender', input.gender);
    });

    it('Should select the offender\'s surname from the alias', () => {
      result.should.have.property('surname', input.surname);
    });

    it('Should select the offender\'s forename from the alias', () => {
      result.should.have.property('firstName', input.firstName);
    });

    it('Should select the offender\'s middle names from the alias', () => {
      result.should.have.property('middleNames', input.middleNames);
    });

    it('Should select the offender\'s date of birth from the alias', () => {
      result.should.have.property('dateOfBirth', input.dateOfBirth);
    });

    it('Should select the offender\'s ethnicity from the alias', () => {
      result.should.have.property('ethnicity', input.ethnicity);
    });
  });

  describe('When the booking is not present', () => {
    let input = {
      nomsId: "X5815XX",
      offenderId: 1013128,
      firstName: "KOBIR",
      middleNames: "MATHEW PATRICE",
      surname: "ZAHIR",
      dateOfBirth: "1971-04-28",
      gender: {
        code: "M",
        description: "Male"
      },
      ethnicity: {
        code: "B1",
        description: "Black/Black British: Caribbean"
      },
      aliases: [
        {
          nomsId: "X5815XX",
          offenderId: 1021466,
          firstName: "JJJ",
          surname: "VIS0001-MIG002",
          dateOfBirth: "1975-04-18",
          gender: {
            code: "M",
            description: "Male"
          },
        }
      ],
    };

    let result = modelHelpers.getMainAlias(input);

    it('Should select the offender\'s gender from the alias', () => {
      result.should.have.property('gender', input.gender);
    });

    it('Should select the offender\'s surname from the alias', () => {
      result.should.have.property('surname', input.surname);
    });

    it('Should select the offender\'s forename from the alias', () => {
      result.should.have.property('firstName', input.firstName);
    });

    it('Should select the offender\'s middle names from the alias', () => {
      result.should.have.property('middleNames', input.middleNames);
    });

    it('Should select the offender\'s date of birth from the alias', () => {
      result.should.have.property('dateOfBirth', input.dateOfBirth);
    });

    it('Should select the offender\'s ethnicity from the alias', () => {
      result.should.have.property('ethnicity', input.ethnicity);
    });
  });
});
