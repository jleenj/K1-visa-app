/**
 * Section Structure Data
 *
 * Defines the complete questionnaire structure based on QUESTIONNAIRE_SECTION_STRUCTURE.md
 *
 * Structure:
 * - sections: Array of major sections
 *   - id: Unique identifier for routing
 *   - title: Display name
 *   - isSponsor: true if sponsor-only section
 *   - appliesToBoth: true if applies to both people (Section 2 only)
 *   - subsections: Array of subsections within the section
 *     - id: Unique identifier for routing
 *     - title: Display name
 *     - oneQuestionPerScreen: true if Section 2 style (default: false)
 *     - fields: Array of field IDs from App.tsx
 */

export const questionnaireStructure = {
  sections: [
    // SECTION 1: PERSONAL INFORMATION
    {
      id: 'section-1-personal-info',
      title: 'Personal Information',
      isSponsor: true, // First instance is for sponsor
      subsections: [
        {
          id: 'name',
          title: 'NAME',
          fields: [
            'sponsorLastName',
            'sponsorFirstName',
            'sponsorMiddleName',
            'sponsorOtherNames'
          ]
        },
        {
          id: 'contact-info',
          title: 'CONTACT INFO',
          fields: [
            'sponsorEmail',
            'sponsorDaytimePhone',
            'sponsorMobilePhone'
          ]
        },
        {
          id: 'birthdate',
          title: 'BIRTHDATE',
          fields: [
            'sponsorDOB',
            'sponsorBirthCity',
            'sponsorBirthState',
            'sponsorBirthCountry'
          ]
        },
        {
          id: 'citizenship-id',
          title: 'CITIZENSHIP & IDENTIFICATION',
          fields: [
            'sponsorCitizenshipMethod',
            'sponsorHasCertificate',
            'sponsorCertNumber',
            'sponsorCertIssueDate',
            'sponsorCertIssuePlace',
            'sponsorSSN',
            'sponsorANumber',
            'sponsorUSCISAccountNumber'
          ]
        },
        {
          id: 'biographic-physical',
          title: 'BIOGRAPHIC & PHYSICAL INFORMATION',
          fields: [
            'sponsorSex',
            'sponsorEthnicity',
            'sponsorRace',
            'sponsorHeight',
            'sponsorWeight',
            'sponsorEyeColor',
            'sponsorHairColor'
          ]
        }
      ]
    },

    // SECTION 1 (Beneficiary instance)
    {
      id: 'section-1-personal-info-beneficiary',
      title: 'Personal Information',
      isSponsor: false, // Beneficiary instance
      subsections: [
        {
          id: 'name',
          title: 'NAME',
          fields: [
            'beneficiaryLastName',
            'beneficiaryFirstName',
            'beneficiaryMiddleName',
            'beneficiaryOtherNames',
            'beneficiaryNativeLastName',
            'beneficiaryNativeFirstName',
            'beneficiaryNativeMiddleName'
          ]
        },
        {
          id: 'contact-info',
          title: 'CONTACT INFO',
          fields: [
            'beneficiaryEmail',
            'beneficiaryDaytimePhone',
            'beneficiaryMobilePhone'
          ]
        },
        {
          id: 'birthdate',
          title: 'BIRTHDATE',
          fields: [
            'beneficiaryDOB',
            'beneficiaryBirthCity',
            'beneficiaryBirthState',
            'beneficiaryBirthCountry'
          ]
        },
        {
          id: 'citizenship-id',
          title: 'CITIZENSHIP & IDENTIFICATION',
          fields: [
            'beneficiaryCountryOfCitizenship',
            'beneficiarySSN',
            'beneficiaryANumber'
          ]
        },
        {
          id: 'biographic-physical',
          title: 'BIOGRAPHIC & PHYSICAL INFORMATION',
          fields: [
            'beneficiarySex'
          ]
        }
      ]
    },

    // SECTION 2: YOUR RELATIONSHIP
    {
      id: 'section-2-relationship',
      title: 'Your Relationship',
      appliesToBoth: true, // Special handling - not in user/partner profiles
      subsections: [
        {
          id: 'marriage-plans',
          title: 'Marriage Plans',
          oneQuestionPerScreen: true, // Each question gets own screen
          fields: [
            'marriageState',
            'intentToMarry'
          ]
        },
        {
          id: 'visa-requirements',
          title: 'Visa Requirements',
          oneQuestionPerScreen: true, // Each question gets own screen
          fields: [
            'legallyFreeToMarry',
            'metInPerson',
            'planToMeet', // Conditional
            'metThroughIMB',
            'currentlyRelated',
            'relationshipType', // Conditional
            'bloodRelationship', // Conditional
            'adoptionRelationship', // Conditional
            'marriageRelationship', // Conditional
            'meetingDescription'
          ]
        }
      ]
    },

    // SECTION 3: COMPLETE ADDRESS HISTORY (Sponsor)
    {
      id: 'section-3-address-history',
      title: 'Complete Address History',
      isSponsor: true,
      subsections: [
        {
          id: 'current-addresses',
          title: 'CURRENT ADDRESSES',
          fields: [
            'sponsorMailingAddress',
            'sponsorMailingDifferent',
            'sponsorCurrentAddress',
            'sponsorAddressDuration'
          ]
        },
        {
          id: 'address-history',
          title: 'ADDRESS HISTORY',
          fields: [
            'sponsorPreviousAddresses', // Smart field - 5-year timeline
            'sponsorPlacesLivedSince18' // Smart field - states/countries since 18
          ]
        }
      ]
    },

    // SECTION 3 (Beneficiary instance)
    {
      id: 'section-3-address-history-beneficiary',
      title: 'Complete Address History',
      isSponsor: false,
      subsections: [
        {
          id: 'current-addresses',
          title: 'CURRENT ADDRESSES',
          fields: [
            'beneficiaryMailingAddress',
            'beneficiaryMailingDifferent',
            'beneficiaryCurrentAddress',
            'beneficiaryNativeAddress',
            'beneficiaryAddressDuration'
          ]
        },
        {
          id: 'address-history',
          title: 'ADDRESS HISTORY',
          fields: [
            'beneficiaryPreviousAddresses' // Smart field - 5-year timeline
          ]
        },
        {
          id: 'future-us-address',
          title: 'FUTURE U.S. ADDRESS',
          fields: [
            'beneficiaryIntendedUSAddress'
          ]
        }
      ]
    },

    // SECTION 4: FAMILY BACKGROUND (Sponsor)
    {
      id: 'section-4-family',
      title: 'Family Background',
      isSponsor: true,
      subsections: [
        {
          id: 'marriage',
          title: 'MARRIAGE',
          fields: [
            'sponsorMaritalStatus',
            'marriedEligibilityCheck',
            'sponsorPreviousMarriages',
            'sponsorMarriageHistory'
          ]
        },
        {
          id: 'parents',
          title: 'PARENTS',
          fields: [
            // Parent 1
            'sponsorParent1FirstName',
            'sponsorParent1MiddleName',
            'sponsorParent1LastName',
            'sponsorParent1DOB',
            'sponsorParent1Sex',
            'sponsorParent1BirthCountry',
            'sponsorParent1ResidenceCountry',
            'sponsorParent1ResidenceCity',
            // Parent 2
            'sponsorParent2FirstName',
            'sponsorParent2MiddleName',
            'sponsorParent2LastName',
            'sponsorParent2DOB',
            'sponsorParent2Sex',
            'sponsorParent2BirthCountry',
            'sponsorParent2ResidenceCountry',
            'sponsorParent2ResidenceCity'
          ]
        }
      ]
    },

    // SECTION 4 (Beneficiary instance)
    {
      id: 'section-4-family-beneficiary',
      title: 'Family Background',
      isSponsor: false,
      subsections: [
        {
          id: 'marriage',
          title: 'MARRIAGE',
          fields: [
            'beneficiaryMaritalStatus',
            'beneficiaryMarriedEligibilityCheck',
            'beneficiaryPreviousMarriages',
            'beneficiaryMarriageHistory'
          ]
        },
        {
          id: 'parents',
          title: 'PARENTS',
          fields: [
            // Parent 1
            'beneficiaryParent1FirstName',
            'beneficiaryParent1MiddleName',
            'beneficiaryParent1LastName',
            'beneficiaryParent1DOB',
            'beneficiaryParent1Sex',
            'beneficiaryParent1BirthCountry',
            'beneficiaryParent1ResidenceCountry',
            'beneficiaryParent1ResidenceCity',
            // Parent 2
            'beneficiaryParent2FirstName',
            'beneficiaryParent2MiddleName',
            'beneficiaryParent2LastName',
            'beneficiaryParent2DOB',
            'beneficiaryParent2Sex',
            'beneficiaryParent2BirthCountry',
            'beneficiaryParent2ResidenceCountry',
            'beneficiaryParent2ResidenceCity'
          ]
        },
        {
          id: 'children',
          title: 'CHILDREN',
          fields: [
            'beneficiaryHasChildren',
            'beneficiaryChildrenDetails'
          ]
        }
      ]
    },

    // SECTION 5: EMPLOYMENT HISTORY (Sponsor)
    {
      id: 'section-5-employment',
      title: 'Employment History',
      isSponsor: true,
      subsections: [
        {
          id: 'employment-timeline',
          title: '5-YEAR EMPLOYMENT TIMELINE',
          fields: [
            'sponsorEmploymentTimeline' // Smart field - 5-year timeline with gap detection
          ]
        }
      ]
    },

    // SECTION 5 (Beneficiary instance)
    {
      id: 'section-5-employment-beneficiary',
      title: 'Employment History',
      isSponsor: false,
      subsections: [
        {
          id: 'employment-timeline',
          title: '5-YEAR EMPLOYMENT TIMELINE',
          fields: [
            'beneficiaryEmploymentTimeline' // Smart field - 5-year timeline
          ]
        }
      ]
    },

    // SECTION 6: LEGAL & SECURITY HISTORY (Sponsor)
    {
      id: 'section-6-legal',
      title: 'Legal & Security History',
      isSponsor: true,
      subsections: [
        {
          id: 'criminal-history',
          title: 'CRIMINAL HISTORY',
          fields: [
            'sponsorProtectionOrders',
            'sponsorDomesticViolence',
            'sponsorViolentCrimes',
            'sponsorMultipleDrugAlcohol',
            'sponsorOtherCrimes'
          ]
        }
      ]
    },

    // SECTION 6 (Beneficiary instance)
    {
      id: 'section-6-legal-beneficiary',
      title: 'Legal & Security History',
      isSponsor: false,
      subsections: [
        {
          id: 'us-travel',
          title: 'U.S. TRAVEL HISTORY',
          fields: [
            'beneficiaryEverInUS',
            'beneficiaryCurrentlyInUS',
            'beneficiaryCurrentlyInUSWarning'
          ]
        },
        {
          id: 'criminal-history',
          title: 'CRIMINAL HISTORY',
          fields: [
            'beneficiaryCriminalHistory' // Comprehensive screening
          ]
        },
        {
          id: 'immigration-issues',
          title: 'IMMIGRATION ISSUES',
          fields: [
            'beneficiaryImmigrationViolations'
          ]
        },
        {
          id: 'health-vaccinations',
          title: 'HEALTH & VACCINATIONS',
          fields: [
            'beneficiaryCommunicableDiseases',
            'beneficiaryMentalPhysicalDisorder',
            'beneficiaryDrugAbuse',
            'beneficiaryVaccinationDocumentation'
          ]
        },
        {
          id: 'security-human-rights',
          title: 'SECURITY & HUMAN RIGHTS',
          fields: [
            'beneficiaryTerrorismEspionage',
            'beneficiaryGenocideWarCrimes',
            'beneficiaryHumanTrafficking',
            'beneficiaryChildSoldiers',
            'beneficiaryReligiousFreedomViolations',
            'beneficiaryForcedAbortionSterilization',
            'beneficiaryOrganTransplantation',
            'beneficiaryCommunistParty',
            'beneficiaryBenefitedFromFamilyTrafficking'
          ]
        }
      ]
    },

    // SECTION 7: PREVIOUS PETITIONS & AFFIDAVITS (Sponsor only)
    {
      id: 'section-7-petitions',
      title: 'Previous Petitions & Affidavits',
      isSponsor: true,
      sponsorOnly: true,
      subsections: [
        {
          id: 'previous-sponsorships',
          title: 'PREVIOUS SPONSORSHIPS',
          customComponent: 'Section1_7', // Uses existing custom component
          fields: [] // Handled by custom component
        },
        {
          id: 'other-obligations',
          title: 'OTHER OBLIGATIONS',
          customComponent: 'Section1_7',
          fields: []
        },
        {
          id: 'household-members',
          title: 'HOUSEHOLD MEMBERS',
          customComponent: 'Section1_7',
          fields: []
        }
      ]
    },

    // SECTION 8: FINANCIAL INFORMATION (Sponsor only)
    {
      id: 'section-8-financial',
      title: 'Financial Information',
      isSponsor: true,
      sponsorOnly: true,
      subsections: [
        {
          id: 'income-documentation',
          title: 'INCOME DOCUMENTATION',
          customComponent: 'Section1_8',
          fields: []
        },
        {
          id: 'income-sources',
          title: 'INCOME SOURCES',
          customComponent: 'Section1_8',
          fields: []
        },
        {
          id: 'assets',
          title: 'ASSETS',
          customComponent: 'Section1_8',
          fields: []
        },
        {
          id: 'contributions',
          title: 'CONTRIBUTIONS TO BENEFICIARY',
          customComponent: 'Section1_8',
          fields: []
        }
      ]
    }
  ]
};

export default questionnaireStructure;
