import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import NavigationPanel from './components/NavigationPanel';
import SectionTimeline from './components/SectionTimeline';
import NameScreen from './components/screens/NameScreen';
import ContactInfoScreen from './components/screens/ContactInfoScreen';
import BirthdateScreen from './components/screens/BirthdateScreen';
import CitizenshipScreen from './components/screens/CitizenshipScreen';
import PhysicalDescriptionScreen from './components/screens/PhysicalDescriptionScreen';
import AddressHistoryScreen from './components/screens/AddressHistoryScreen';
// Section 2 screens
import MarriageStateScreen from './components/screens/section2/MarriageStateScreen';
import IntentToMarryScreen from './components/screens/section2/IntentToMarryScreen';
import LegallyFreeScreen from './components/screens/section2/LegallyFreeScreen';
import MetInPersonScreen from './components/screens/section2/MetInPersonScreen';
import MarriageBrokerScreen from './components/screens/section2/MarriageBrokerScreen';
import RelationshipScreen from './components/screens/section2/RelationshipScreen';
import MeetingDescriptionScreen from './components/screens/section2/MeetingDescriptionScreen';
// Section 3 screens
import CurrentAddressesScreen from './components/screens/section3/CurrentAddressesScreen';
import Section3AddressHistoryScreen from './components/screens/section3/AddressHistoryScreen';
import PlacesSince18Screen from './components/screens/section3/PlacesSince18Screen';
import FutureUSAddressScreen from './components/screens/section3/FutureUSAddressScreen';
import ReviewScreen from './components/screens/section3/ReviewScreen';
// Section 4 screens
import MarriageScreen from './components/screens/section4/MarriageScreen';
import ParentsScreen from './components/screens/section4/ParentsScreen';
import ChildrenScreen from './components/screens/section4/ChildrenScreen';
// Section 5 screens
import EmploymentTimelineScreen from './components/screens/section5/EmploymentTimelineScreen';
import EmploymentSummaryScreen from './components/screens/section5/EmploymentSummaryScreen';
// Section 6 screens - Sponsor Criminal History (multi-screen)
import SponsorCriminalHistoryIntroScreen from './components/screens/section6/SponsorCriminalHistoryIntroScreen';
import ProtectionOrderScreen from './components/screens/section6/ProtectionOrderScreen';
import DomesticViolenceScreen from './components/screens/section6/DomesticViolenceScreen';
import ViolentCrimesScreen from './components/screens/section6/ViolentCrimesScreen';
import DrugAlcoholScreen from './components/screens/section6/DrugAlcoholScreen';
import OtherCriminalHistoryScreen from './components/screens/section6/OtherCriminalHistoryScreen';
// Section 6 screens - Beneficiary
import BeneficiaryUSTravelHistoryScreen from './components/screens/section6/BeneficiaryUSTravelHistoryScreen';
import BeneficiaryCriminalHistoryScreen from './components/screens/section6/BeneficiaryCriminalHistoryScreen';
import BeneficiaryImmigrationIssuesScreen from './components/screens/section6/BeneficiaryImmigrationIssuesScreen';
import BeneficiaryHealthVaccinationsScreen from './components/screens/section6/BeneficiaryHealthVaccinationsScreen';
import BeneficiarySecurityHumanRightsScreen from './components/screens/section6/BeneficiarySecurityHumanRightsScreen';
// Section 7 screens
import PreviousPetitionsScreen from './components/screens/section7/PreviousPetitionsScreen';
import PreviousSponsorshipsScreen from './components/screens/section7/PreviousSponsorshipsScreen';
import OtherObligationsScreen from './components/screens/section7/OtherObligationsScreen';
import HouseholdMembersScreen from './components/screens/section7/HouseholdMembersScreen';
import questionnaireStructure from './data/sectionStructure';

/**
 * QuestionnaireContent Component
 * Inner component that has access to useLocation
 */
const QuestionnaireContent = ({ currentData, updateField, fieldErrors, setFieldErrors, touchedFields, setTouchedFields }) => {
  const location = useLocation();

  // Get current section ID from URL
  const getCurrentSectionId = () => {
    const pathParts = location.pathname.split('/').filter(Boolean);
    return pathParts.length > 0 ? pathParts[0] : null;
  };

  const currentSectionId = getCurrentSectionId();

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Section Timeline at Top */}
      <SectionTimeline
        sections={questionnaireStructure.sections}
        currentSectionId={currentSectionId}
        currentData={currentData}
      />

      {/* Main Content: Navigation Panel + Screens */}
      <div className="flex flex-1 overflow-hidden">
        {/* Navigation Panel */}
        <NavigationPanel
          sections={questionnaireStructure.sections}
          currentData={currentData}
          userRole={currentData.userRole}
        />

        {/* Screen Routes */}
        <Routes>
          {/* Default route - redirect to first screen */}
          <Route
            path="/"
            element={<Navigate to="/section-1-personal-info/name" replace />}
          />

          {/* SECTION 1: PERSONAL INFORMATION - SPONSOR */}
          <Route path="/section-1-personal-info/name" element={<NameScreen currentData={currentData} updateField={updateField} userRole={currentData.userRole} isSponsor={true} />} />
          <Route path="/section-1-personal-info/contact-info" element={<ContactInfoScreen currentData={currentData} updateField={updateField} userRole={currentData.userRole} isSponsor={true} />} />
          <Route path="/section-1-personal-info/birthdate" element={<BirthdateScreen currentData={currentData} updateField={updateField} userRole={currentData.userRole} isSponsor={true} />} />
          <Route path="/section-1-personal-info/citizenship-id" element={<CitizenshipScreen currentData={currentData} updateField={updateField} userRole={currentData.userRole} isSponsor={true} />} />
          <Route path="/section-1-personal-info/biographic-physical" element={<PhysicalDescriptionScreen currentData={currentData} updateField={updateField} userRole={currentData.userRole} isSponsor={true} />} />

          {/* SECTION 1: PERSONAL INFORMATION - BENEFICIARY */}
          <Route path="/section-1-personal-info-beneficiary/name" element={<NameScreen currentData={currentData} updateField={updateField} userRole={currentData.userRole} isSponsor={false} />} />
          <Route path="/section-1-personal-info-beneficiary/contact-info" element={<ContactInfoScreen currentData={currentData} updateField={updateField} userRole={currentData.userRole} isSponsor={false} />} />
          <Route path="/section-1-personal-info-beneficiary/birthdate" element={<BirthdateScreen currentData={currentData} updateField={updateField} userRole={currentData.userRole} isSponsor={false} />} />
          <Route path="/section-1-personal-info-beneficiary/citizenship-id" element={<CitizenshipScreen currentData={currentData} updateField={updateField} userRole={currentData.userRole} isSponsor={false} />} />
          <Route path="/section-1-personal-info-beneficiary/biographic-physical" element={<PhysicalDescriptionScreen currentData={currentData} updateField={updateField} userRole={currentData.userRole} isSponsor={false} />} />

          {/* SECTION 2: YOUR RELATIONSHIP - Marriage Plans */}
          <Route path="/section-2-relationship/marriage-state" element={<MarriageStateScreen currentData={currentData} updateField={updateField} userRole={currentData.userRole} />} />
          <Route path="/section-2-relationship/intent-to-marry" element={<IntentToMarryScreen currentData={currentData} updateField={updateField} userRole={currentData.userRole} />} />

          {/* SECTION 2: YOUR RELATIONSHIP - Visa Requirements */}
          <Route path="/section-2-relationship/legally-free" element={<LegallyFreeScreen currentData={currentData} updateField={updateField} userRole={currentData.userRole} />} />
          <Route path="/section-2-relationship/met-in-person" element={<MetInPersonScreen currentData={currentData} updateField={updateField} userRole={currentData.userRole} />} />
          <Route path="/section-2-relationship/marriage-broker" element={<MarriageBrokerScreen currentData={currentData} updateField={updateField} userRole={currentData.userRole} />} />
          <Route path="/section-2-relationship/relationship" element={<RelationshipScreen currentData={currentData} updateField={updateField} userRole={currentData.userRole} />} />
          <Route path="/section-2-relationship/meeting-description" element={<MeetingDescriptionScreen currentData={currentData} updateField={updateField} userRole={currentData.userRole} />} />

          {/* SECTION 3: COMPLETE ADDRESS HISTORY - SPONSOR */}
          <Route path="/section-3-address-history/current-addresses" element={<CurrentAddressesScreen currentData={currentData} updateField={updateField} fieldErrors={fieldErrors} setFieldErrors={setFieldErrors} touchedFields={touchedFields} setTouchedFields={setTouchedFields} userRole={currentData.userRole} />} />
          <Route path="/section-3-address-history/address-history" element={<Section3AddressHistoryScreen currentData={currentData} updateField={updateField} fieldErrors={fieldErrors} setFieldErrors={setFieldErrors} touchedFields={touchedFields} setTouchedFields={setTouchedFields} userRole={currentData.userRole} />} />
          <Route path="/section-3-address-history/places-since-18" element={<PlacesSince18Screen currentData={currentData} updateField={updateField} fieldErrors={fieldErrors} setFieldErrors={setFieldErrors} touchedFields={touchedFields} setTouchedFields={setTouchedFields} userRole={currentData.userRole} />} />
          <Route path="/section-3-address-history/review" element={<ReviewScreen currentData={currentData} updateField={updateField} userRole={currentData.userRole} />} />

          {/* SECTION 3: COMPLETE ADDRESS HISTORY - BENEFICIARY */}
          <Route path="/section-3-address-history-beneficiary/current-addresses" element={<CurrentAddressesScreen currentData={currentData} updateField={updateField} fieldErrors={fieldErrors} setFieldErrors={setFieldErrors} touchedFields={touchedFields} setTouchedFields={setTouchedFields} userRole={currentData.userRole} />} />
          <Route path="/section-3-address-history-beneficiary/address-history" element={<Section3AddressHistoryScreen currentData={currentData} updateField={updateField} fieldErrors={fieldErrors} setFieldErrors={setFieldErrors} touchedFields={touchedFields} setTouchedFields={setTouchedFields} userRole={currentData.userRole} />} />
          <Route path="/section-3-address-history-beneficiary/future-us-address" element={<FutureUSAddressScreen currentData={currentData} updateField={updateField} fieldErrors={fieldErrors} setFieldErrors={setFieldErrors} touchedFields={touchedFields} setTouchedFields={setTouchedFields} userRole={currentData.userRole} />} />
          <Route path="/section-3-address-history-beneficiary/review" element={<ReviewScreen currentData={currentData} updateField={updateField} userRole={currentData.userRole} />} />

          {/* SECTION 4: FAMILY BACKGROUND - SPONSOR */}
          <Route path="/section-4-family/marriage" element={<MarriageScreen currentData={currentData} updateField={updateField} fieldErrors={fieldErrors} setFieldErrors={setFieldErrors} touchedFields={touchedFields} setTouchedFields={setTouchedFields} userRole={currentData.userRole} />} />
          <Route path="/section-4-family/parents" element={<ParentsScreen currentData={currentData} updateField={updateField} fieldErrors={fieldErrors} setFieldErrors={setFieldErrors} touchedFields={touchedFields} setTouchedFields={setTouchedFields} userRole={currentData.userRole} />} />

          {/* SECTION 4: FAMILY BACKGROUND - BENEFICIARY */}
          <Route path="/section-4-family-beneficiary/marriage" element={<MarriageScreen currentData={currentData} updateField={updateField} fieldErrors={fieldErrors} setFieldErrors={setFieldErrors} touchedFields={touchedFields} setTouchedFields={setTouchedFields} userRole={currentData.userRole} />} />
          <Route path="/section-4-family-beneficiary/parents" element={<ParentsScreen currentData={currentData} updateField={updateField} fieldErrors={fieldErrors} setFieldErrors={setFieldErrors} touchedFields={touchedFields} setTouchedFields={setTouchedFields} userRole={currentData.userRole} />} />
          <Route path="/section-4-family-beneficiary/children" element={<ChildrenScreen currentData={currentData} updateField={updateField} fieldErrors={fieldErrors} setFieldErrors={setFieldErrors} touchedFields={touchedFields} setTouchedFields={setTouchedFields} userRole={currentData.userRole} />} />

          {/* SECTION 5: EMPLOYMENT HISTORY - SPONSOR */}
          <Route path="/section-5-employment/employment-timeline" element={<EmploymentTimelineScreen currentData={currentData} updateField={updateField} fieldErrors={fieldErrors} setFieldErrors={setFieldErrors} touchedFields={touchedFields} setTouchedFields={setTouchedFields} userRole={currentData.userRole} />} />
          <Route path="/section-5-employment/summary" element={<EmploymentSummaryScreen currentData={currentData} updateField={updateField} userRole={currentData.userRole} />} />

          {/* SECTION 5: EMPLOYMENT HISTORY - BENEFICIARY */}
          <Route path="/section-5-employment-beneficiary/employment-timeline" element={<EmploymentTimelineScreen currentData={currentData} updateField={updateField} fieldErrors={fieldErrors} setFieldErrors={setFieldErrors} touchedFields={touchedFields} setTouchedFields={setTouchedFields} userRole={currentData.userRole} />} />
          <Route path="/section-5-employment-beneficiary/summary" element={<EmploymentSummaryScreen currentData={currentData} updateField={updateField} userRole={currentData.userRole} />} />

          {/* SECTION 6: LEGAL & SECURITY HISTORY - SPONSOR */}
          {/* Criminal History - Multi-screen (like Section 2) */}
          <Route path="/section-6-legal/criminal-history-intro" element={<SponsorCriminalHistoryIntroScreen currentData={currentData} updateField={updateField} userRole={currentData.userRole} />} />
          <Route path="/section-6-legal/criminal-history-protection-orders" element={<ProtectionOrderScreen currentData={currentData} updateField={updateField} userRole={currentData.userRole} />} />
          <Route path="/section-6-legal/criminal-history-domestic-violence" element={<DomesticViolenceScreen currentData={currentData} updateField={updateField} userRole={currentData.userRole} />} />
          <Route path="/section-6-legal/criminal-history-violent-crimes" element={<ViolentCrimesScreen currentData={currentData} updateField={updateField} userRole={currentData.userRole} />} />
          <Route path="/section-6-legal/criminal-history-drug-alcohol" element={<DrugAlcoholScreen currentData={currentData} updateField={updateField} userRole={currentData.userRole} />} />
          <Route path="/section-6-legal/criminal-history-other" element={<OtherCriminalHistoryScreen currentData={currentData} updateField={updateField} userRole={currentData.userRole} />} />

          {/* SECTION 6: LEGAL & SECURITY HISTORY - BENEFICIARY */}
          <Route path="/section-6-legal-beneficiary/us-travel" element={<BeneficiaryUSTravelHistoryScreen currentData={currentData} updateField={updateField} userRole={currentData.userRole} />} />
          <Route path="/section-6-legal-beneficiary/criminal-history" element={<BeneficiaryCriminalHistoryScreen currentData={currentData} updateField={updateField} userRole={currentData.userRole} />} />
          <Route path="/section-6-legal-beneficiary/immigration-issues" element={<BeneficiaryImmigrationIssuesScreen currentData={currentData} updateField={updateField} userRole={currentData.userRole} />} />
          <Route path="/section-6-legal-beneficiary/health-vaccinations" element={<BeneficiaryHealthVaccinationsScreen currentData={currentData} updateField={updateField} userRole={currentData.userRole} />} />
          <Route path="/section-6-legal-beneficiary/security-human-rights" element={<BeneficiarySecurityHumanRightsScreen currentData={currentData} updateField={updateField} userRole={currentData.userRole} />} />

          {/* SECTION 7: PREVIOUS PETITIONS & AFFIDAVITS - SPONSOR */}
          <Route path="/section-7-petitions/previous-sponsorships" element={<PreviousSponsorshipsScreen currentData={currentData} updateField={updateField} userRole={currentData.userRole} />} />
          <Route path="/section-7-petitions/other-obligations" element={<OtherObligationsScreen currentData={currentData} updateField={updateField} userRole={currentData.userRole} />} />
          <Route path="/section-7-petitions/household-members" element={<HouseholdMembersScreen currentData={currentData} updateField={updateField} userRole={currentData.userRole} />} />
          {/* Legacy route - keeping for backwards compatibility */}
          <Route path="/section-7-petitions/previous-petitions" element={<PreviousPetitionsScreen currentData={currentData} updateField={updateField} userRole={currentData.userRole} />} />

          {/* TODO: Add routes for remaining section (8) */}
          {/* For now, we'll show a placeholder for undefined routes */}
          <Route
            path="/:sectionId/:subsectionId"
            element={
              <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Screen Under Construction
                  </h2>
                  <p className="text-gray-600">
                    This screen will be implemented soon.
                  </p>
                  <p className="text-sm text-gray-500 mt-4">
                    Check the URL to see which section you're viewing
                  </p>
                </div>
              </div>
            }
          />
        </Routes>
      </div>
    </div>
  );
};

/**
 * QuestionnaireRouter Component
 *
 * Main router for the multi-screen questionnaire experience
 * Manages:
 * - URL-based navigation
 * - Global state (currentData)
 * - Section timeline
 * - Navigation panel integration
 * - Screen routing
 */
const QuestionnaireRouter = () => {
  // Global questionnaire state
  const [currentData, setCurrentData] = useState({
    // TODO: Pre-fill from qualification test when connected
    USER_FIRST_NAME: 'Your',
    PARTNER_FIRST_NAME: "Partner's",
    // For now, assume user is sponsor (will come from qualification test)
    userRole: 'SPONSOR'
  });

  // Field validation state
  const [fieldErrors, setFieldErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});

  const updateField = (field, value) => {
    setCurrentData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <BrowserRouter>
      <QuestionnaireContent
        currentData={currentData}
        updateField={updateField}
        fieldErrors={fieldErrors}
        setFieldErrors={setFieldErrors}
        touchedFields={touchedFields}
        setTouchedFields={setTouchedFields}
      />
    </BrowserRouter>
  );
};

export default QuestionnaireRouter;
