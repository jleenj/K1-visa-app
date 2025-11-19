// State Marriage Laws Data
// Minimum marriage age and first-cousin marriage restrictions by state

export const stateMarriageLaws = {
  AL: { name: 'Alabama', minAge: 18, firstCousinsAllowed: true },
  AK: { name: 'Alaska', minAge: 18, firstCousinsAllowed: false },
  AZ: { name: 'Arizona', minAge: 18, firstCousinsAllowed: false },
  AR: { name: 'Arkansas', minAge: 18, firstCousinsAllowed: false },
  CA: { name: 'California', minAge: 18, firstCousinsAllowed: true },
  CO: { name: 'Colorado', minAge: 18, firstCousinsAllowed: true },
  CT: { name: 'Connecticut', minAge: 18, firstCousinsAllowed: true },
  DE: { name: 'Delaware', minAge: 18, firstCousinsAllowed: false },
  DC: { name: 'District of Columbia', minAge: 18, firstCousinsAllowed: true },
  FL: { name: 'Florida', minAge: 18, firstCousinsAllowed: true },
  GA: { name: 'Georgia', minAge: 18, firstCousinsAllowed: true },
  HI: { name: 'Hawaii', minAge: 18, firstCousinsAllowed: true },
  ID: { name: 'Idaho', minAge: 18, firstCousinsAllowed: false },
  IL: { name: 'Illinois', minAge: 18, firstCousinsAllowed: false },
  IN: { name: 'Indiana', minAge: 18, firstCousinsAllowed: false },
  IA: { name: 'Iowa', minAge: 18, firstCousinsAllowed: false },
  KS: { name: 'Kansas', minAge: 18, firstCousinsAllowed: false },
  KY: { name: 'Kentucky', minAge: 18, firstCousinsAllowed: false },
  LA: { name: 'Louisiana', minAge: 18, firstCousinsAllowed: false },
  ME: { name: 'Maine', minAge: 18, firstCousinsAllowed: true },
  MD: { name: 'Maryland', minAge: 18, firstCousinsAllowed: true },
  MA: { name: 'Massachusetts', minAge: 18, firstCousinsAllowed: true },
  MI: { name: 'Michigan', minAge: 18, firstCousinsAllowed: false },
  MN: { name: 'Minnesota', minAge: 18, firstCousinsAllowed: false },
  MS: { name: 'Mississippi', minAge: 21, firstCousinsAllowed: false },
  MO: { name: 'Missouri', minAge: 18, firstCousinsAllowed: false },
  MT: { name: 'Montana', minAge: 18, firstCousinsAllowed: false },
  NE: { name: 'Nebraska', minAge: 19, firstCousinsAllowed: false },
  NV: { name: 'Nevada', minAge: 18, firstCousinsAllowed: false },
  NH: { name: 'New Hampshire', minAge: 18, firstCousinsAllowed: false },
  NJ: { name: 'New Jersey', minAge: 18, firstCousinsAllowed: true },
  NM: { name: 'New Mexico', minAge: 18, firstCousinsAllowed: true },
  NY: { name: 'New York', minAge: 18, firstCousinsAllowed: true },
  NC: { name: 'North Carolina', minAge: 18, firstCousinsAllowed: true },
  ND: { name: 'North Dakota', minAge: 18, firstCousinsAllowed: false },
  OH: { name: 'Ohio', minAge: 18, firstCousinsAllowed: false },
  OK: { name: 'Oklahoma', minAge: 18, firstCousinsAllowed: false },
  OR: { name: 'Oregon', minAge: 18, firstCousinsAllowed: false },
  PA: { name: 'Pennsylvania', minAge: 18, firstCousinsAllowed: false },
  RI: { name: 'Rhode Island', minAge: 18, firstCousinsAllowed: true },
  SC: { name: 'South Carolina', minAge: 18, firstCousinsAllowed: true },
  SD: { name: 'South Dakota', minAge: 18, firstCousinsAllowed: false },
  TN: { name: 'Tennessee', minAge: 18, firstCousinsAllowed: true },
  TX: { name: 'Texas', minAge: 18, firstCousinsAllowed: false },
  UT: { name: 'Utah', minAge: 18, firstCousinsAllowed: false },
  VT: { name: 'Vermont', minAge: 18, firstCousinsAllowed: true },
  VA: { name: 'Virginia', minAge: 18, firstCousinsAllowed: true },
  WA: { name: 'Washington', minAge: 18, firstCousinsAllowed: false },
  WV: { name: 'West Virginia', minAge: 18, firstCousinsAllowed: false },
  WI: { name: 'Wisconsin', minAge: 18, firstCousinsAllowed: false },
  WY: { name: 'Wyoming', minAge: 18, firstCousinsAllowed: false }
};

// States that allow adopted sibling marriage
export const adoptedSiblingsAllowedStates = ['CO', 'HI', 'KS', 'MA', 'RI', 'VA'];

// Helper function to check if first cousins can marry in a state
export const canFirstCousinsMarry = (stateCode) => {
  return stateMarriageLaws[stateCode]?.firstCousinsAllowed || false;
};

// Helper function to get minimum marriage age for a state
export const getMinimumMarriageAge = (stateCode) => {
  return stateMarriageLaws[stateCode]?.minAge || 18;
};

// Helper function to check if adopted siblings can marry in a state
export const canAdoptedSiblingsMarry = (stateCode) => {
  return adoptedSiblingsAllowedStates.includes(stateCode);
};
