const getNewApd = () => {
  const thisFFY = (() => {
    const year = new Date().getFullYear();

    // Federal fiscal year starts October 1,
    // but Javascript months start with 0 for
    // some reason, so October is month 9.
    if (new Date().getMonth() > 8) {
      return year + 1;
    }
    return year;
  })();

  const yearOptions = [thisFFY, thisFFY + 1, thisFFY + 2].map(y => `${y}`);
  const years = yearOptions.slice(0, 2);

  const forAllYears = (obj, yearsToCover = years) =>
    yearsToCover.reduce(
      (acc, year) => ({
        ...acc,
        [year]: obj
      }),
      {}
    );

  return {
    activities: [
      {
        alternatives: '',
        contractorResources: [],
        costAllocation: forAllYears({
          ffp: { federal: 90, state: 10 },
          other: 0
        }),
        costAllocationNarrative: {
          methodology: '',
          ...forAllYears({ otherSources: '' })
        },
        description: '',
        expenses: [],
        fundingSource: 'HIT',
        name: 'Program Administration',
        outcomes: [],
        plannedEndDate: '',
        plannedStartDate: '',
        schedule: [],
        standardsAndConditions: {
          doesNotSupport: '',
          supports: ''
        },
        statePersonnel: [],
        summary: '',
        quarterlyFFP: forAllYears({
          1: { contractors: 0, inHouse: 0 },
          2: { contractors: 0, inHouse: 0 },
          3: { contractors: 0, inHouse: 0 },
          4: { contractors: 0, inHouse: 0 }
        })
      }
    ],
    federalCitations: {},
    incentivePayments: {
      ehAmt: forAllYears({ 1: 0, 2: 0, 3: 0, 4: 0 }),
      ehCt: forAllYears({ 1: 0, 2: 0, 3: 0, 4: 0 }),
      epAmt: forAllYears({ 1: 0, 2: 0, 3: 0, 4: 0 }),
      epCt: forAllYears({ 1: 0, 2: 0, 3: 0, 4: 0 })
    },
    keyPersonnel: [],
    name: 'HITECH IAPD',
    narrativeHIE: '',
    narrativeHIT: '',
    narrativeMMIS: '',
    previousActivityExpenses: forAllYears(
      {
        hithie: {
          federalActual: 0,
          totalApproved: 0
        },
        mmis: {
          90: { federalActual: 0, totalApproved: 0 },
          75: { federalActual: 0, totalApproved: 0 },
          50: { federalActual: 0, totalApproved: 0 }
        }
      },
      [0, 1, 2].map(past => yearOptions[0] - past)
    ),
    previousActivitySummary: '',
    programOverview: '',
    stateProfile: {
      medicaidDirector: {
        email: '',
        name: '',
        phone: ''
      },
      medicaidOffice: {
        address1: '',
        address2: '',
        city: '',
        state: '',
        zip: ''
      }
    },
    years
  };
};

module.exports = getNewApd;
