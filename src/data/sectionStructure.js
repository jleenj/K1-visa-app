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
          totalQuestions: 2, // For progress bar
          screens: [
            { id: 'marriage-state', field: 'marriageState' },
            { id: 'intent-to-marry', field: 'intendToMarry90Days' }
          ]
        },
        {
          id: 'visa-requirements',
          title: 'Visa Requirements',
          oneQuestionPerScreen: true, // Each question gets own screen
          totalQuestions: 5, // For progress bar (5 L0 questions: legally free, met in person, marriage broker, related, meeting description)
          screens: [
            { id: 'legally-free', field: 'legallyFreeToMarry' },
            { id: 'met-in-person', fields: ['metInPerson', 'planToMeet'] }, // planToMeet is conditional
            { id: 'marriage-broker', field: 'metThroughIMB' },
            { id: 'relationship', field: 'areRelated' }, // Main field that determines completion
            { id: 'meeting-description', field: 'meetingCircumstances' }
          ]
        }
      ]
    },

    // SECTION 3: ADDRESS HISTORY (Sponsor)
    {
      id: 'section-3-address-history',
      title: 'Address History',
      isSponsor: true,
      subsections: [
        {
          id: 'current-addresses',
          title: 'CURRENT ADDRESS',
          fields: [
            'sponsorMailingAddress',
            'sponsorMailingDifferent',
            'sponsorCurrentAddress'
          ]
        },
        {
          id: 'address-history',
          title: 'PREVIOUS ADDRESSES (5 YEARS)',
          fields: [
            'sponsorAddressDuration', // Moved from current-addresses
            'sponsorAddressHistory' // Smart field - 5-year timeline
          ]
        },
        {
          id: 'places-since-18',
          title: 'OTHER PLACES LIVED SINCE AGE 18',
          fields: [
            'sponsorPlacesResided' // Smart field - states/countries since 18
          ],
          showWhen: (data) => {
            // Only show if sponsor is 23 or older
            // Logic: If 22 or younger, past 5 years fully covers since age 18
            // If 23+, there's a gap between turning 18 and the 5-year cutoff
            const dob = data.sponsorDOB;
            if (!dob) return false;

            const birthDate = new Date(dob);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
              age--;
            }

            return age >= 23;
          }
        },
        {
          id: 'review',
          title: 'SUMMARY',
          fields: [] // Timeline visualization component
        }
      ]
    },

    // SECTION 3 (Beneficiary instance)
    {
      id: 'section-3-address-history-beneficiary',
      title: 'Address History',
      isSponsor: false,
      subsections: [
        {
          id: 'current-addresses',
          title: 'CURRENT ADDRESS',
          fields: [
            'beneficiaryMailingAddress',
            'beneficiaryMailingDifferent',
            'beneficiaryCurrentAddress',
            'beneficiaryNativeAddress'
          ]
        },
        {
          id: 'address-history',
          title: 'PREVIOUS ADDRESSES (5 YEARS)',
          fields: [
            'beneficiaryAddressDuration', // Moved from current-addresses
            'beneficiaryAddressHistory' // Smart field - 5-year timeline
          ]
        },
        {
          id: 'future-us-address',
          title: 'FUTURE U.S. ADDRESS',
          fields: [
            'beneficiaryIntendedUSAddress'
          ]
        },
        {
          id: 'review',
          title: 'SUMMARY',
          fields: [] // Timeline visualization component
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
          title: 'EMPLOYMENT HISTORY (5 YEARS)',
          fields: [
            'sponsorTimeline', // Smart field - chronological-timeline
            'sponsorTimelineSummary' // Smart field - timeline-summary
          ]
        },
        {
          id: 'summary',
          title: 'SUMMARY',
          fields: [] // Review component
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
          title: 'EMPLOYMENT HISTORY (5 YEARS)',
          fields: [
            'beneficiaryTimeline', // Smart field - chronological-timeline
            'beneficiaryTimelineSummary' // Smart field - timeline-summary
          ]
        },
        {
          id: 'summary',
          title: 'SUMMARY',
          fields: [] // Review component
        }
      ]
    },

    // SECTION 6: LEGAL & SECURITY (Sponsor)
    {
      id: 'section-6-legal',
      title: 'Legal & Security',
      isSponsor: true,
      subsections: [
        {
          id: 'criminal-history',
          title: 'Criminal History',
          oneQuestionPerScreen: true, // Each question gets own screen (like Section 2)
          totalQuestions: 6, // For progress bar (intro + 5 questions)
          screens: [
            { id: 'criminal-history-intro', field: 'sponsorCriminalHistoryIntroViewed' }, // Intro screen - tracked when user clicks Next
            { id: 'criminal-history-protection-orders', field: 'sponsorProtectionOrder' },
            { id: 'criminal-history-domestic-violence', field: 'sponsorDomesticViolence' },
            { id: 'criminal-history-violent-crimes', field: 'sponsorViolentCrimes' },
            { id: 'criminal-history-drug-alcohol', field: 'sponsorDrugAlcoholOffenses' },
            { id: 'criminal-history-other', field: 'sponsorOtherCriminalHistory' }
          ]
        }
      ]
    },

    // SECTION 6 (Beneficiary instance)
    {
      id: 'section-6-legal-beneficiary',
      title: 'Legal & Security',
      isSponsor: false,
      subsections: [
        {
          id: 'us-travel',
          title: 'U.S. TRAVEL HISTORY',
          fields: [
            'beneficiaryEverInUS',
            'beneficiaryWillBeInUSWhenFiling'
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
            'beneficiaryImmigrationIssues'
          ]
        },
        {
          id: 'health-vaccinations',
          title: 'HEALTH & VACCINATIONS',
          fields: [
            'beneficiaryHealthConcerns'
          ]
        },
        {
          id: 'security-human-rights',
          title: 'SECURITY & HUMAN RIGHTS',
          fields: [
            'beneficiarySecurityViolations'
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
          title: 'Previous Sponsorships',
          fields: ['hasPreviousPetitions', 'previousPetitions']
        },
        {
          id: 'other-obligations',
          title: 'Other Obligations',
          fields: ['hasOtherObligations', 'otherObligations']
        },
        {
          id: 'household-members',
          title: 'Household Members',
          fields: ['hasChildrenUnder18', 'childrenDetails', 'otherDependents']
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
