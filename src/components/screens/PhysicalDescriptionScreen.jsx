import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ScreenLayout from '../ScreenLayout';
import { getNextScreen, isFirstScreen } from '../../utils/navigationUtils';

/**
 * PhysicalDescriptionScreen Component
 *
 * Screen for collecting biographic and physical description information
 */
const PhysicalDescriptionScreen = ({
  currentData,
  updateField,
  userRole,
  isSponsor = true
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const prefix = isSponsor ? 'sponsor' : 'beneficiary';

  const handleNext = () => {
    const nextPath = getNextScreen(location.pathname, userRole);
    if (nextPath) {
      navigate(nextPath);
    }
  };

  const isFirst = isFirstScreen(location.pathname, userRole);

  // Height conversion helpers
  const cmToFeetInches = (cm) => {
    const totalInches = cm / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return { feet, inches };
  };

  const feetInchesToCm = (feet, inches) => {
    return Math.round(((parseInt(feet) || 0) * 12 + (parseInt(inches) || 0)) * 2.54);
  };

  // Weight conversion helpers
  const kgToLbs = (kg) => Math.round(kg * 2.20462);
  const lbsToKg = (lbs) => Math.round(lbs / 2.20462);

  // Check if required fields are filled
  const isFormValid = () => {
    return currentData[`${prefix}Sex`] &&
           currentData[`${prefix}Height`] &&
           currentData[`${prefix}Weight`] &&
           currentData[`${prefix}EyeColor`] &&
           currentData[`${prefix}HairColor`] &&
           currentData[`${prefix}Ethnicity`] &&
           currentData[`${prefix}Race`];
  };

  // Get height values
  const heightData = currentData[`${prefix}Height`] || { feet: '', inches: '', cm: '' };
  const weightData = currentData[`${prefix}Weight`] || { lbs: '', kg: '' };

  const handleHeightChange = (field, value) => {
    const newHeight = { ...heightData, [field]: value };

    if (field === 'feet' || field === 'inches') {
      newHeight.cm = feetInchesToCm(newHeight.feet, newHeight.inches);
    } else if (field === 'cm') {
      const { feet, inches } = cmToFeetInches(parseInt(value) || 0);
      newHeight.feet = feet;
      newHeight.inches = inches;
    }

    updateField(`${prefix}Height`, newHeight);
  };

  const handleWeightChange = (field, value) => {
    const newWeight = { ...weightData, [field]: value };

    if (field === 'lbs') {
      newWeight.kg = lbsToKg(parseInt(value) || 0);
    } else if (field === 'kg') {
      newWeight.lbs = kgToLbs(parseInt(value) || 0);
    }

    updateField(`${prefix}Weight`, newWeight);
  };

  return (
    <ScreenLayout
      showBackButton={!isFirst}
      onNext={handleNext}
      nextButtonDisabled={!isFormValid()}
    >
      {/* Screen Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Physical Description
        </h2>
        <p className="text-gray-600">
          Provide {isSponsor ? 'your' : 'your partner\'s'} biographic and physical information.
        </p>
      </div>

      {/* Form Fields */}
      <div className="space-y-6">
        {/* Sex */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sex <span className="text-red-500">*</span>
          </label>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name={`${prefix}Sex`}
                value="Male"
                checked={currentData[`${prefix}Sex`] === 'Male'}
                onChange={(e) => updateField(`${prefix}Sex`, e.target.value)}
                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Male</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name={`${prefix}Sex`}
                value="Female"
                checked={currentData[`${prefix}Sex`] === 'Female'}
                onChange={(e) => updateField(`${prefix}Sex`, e.target.value)}
                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Female</span>
            </label>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Starting January 2025, USCIS recognizes only two biological sexes on all immigration forms.
          </p>
        </div>

        {/* Ethnicity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ethnicity <span className="text-red-500">*</span>
          </label>
          <select
            value={currentData[`${prefix}Ethnicity`] || ''}
            onChange={(e) => updateField(`${prefix}Ethnicity`, e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select one</option>
            <option value="Hispanic or Latino">Hispanic or Latino</option>
            <option value="Not Hispanic or Latino">Not Hispanic or Latino</option>
          </select>
        </div>

        {/* Race */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Race <span className="text-red-500">*</span>
          </label>
          <select
            value={currentData[`${prefix}Race`] || ''}
            onChange={(e) => updateField(`${prefix}Race`, e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select one or more</option>
            <option value="American Indian or Alaska Native">American Indian or Alaska Native</option>
            <option value="Asian">Asian</option>
            <option value="Black or African American">Black or African American</option>
            <option value="Native Hawaiian or Other Pacific Islander">Native Hawaiian or Other Pacific Islander</option>
            <option value="White">White</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Select the option that best describes your race
          </p>
        </div>

        {/* Height */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Height <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Feet & Inches</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={heightData.feet || ''}
                  onChange={(e) => handleHeightChange('feet', e.target.value)}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="5"
                  min="0"
                  max="8"
                />
                <span className="self-center text-gray-600">ft</span>
                <input
                  type="number"
                  value={heightData.inches || ''}
                  onChange={(e) => handleHeightChange('inches', e.target.value)}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="10"
                  min="0"
                  max="11"
                />
                <span className="self-center text-gray-600">in</span>
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Centimeters</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={heightData.cm || ''}
                  onChange={(e) => handleHeightChange('cm', e.target.value)}
                  className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="178"
                  min="0"
                  max="300"
                />
                <span className="self-center text-gray-600">cm</span>
              </div>
            </div>
          </div>
        </div>

        {/* Weight */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Weight <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Pounds</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={weightData.lbs || ''}
                  onChange={(e) => handleWeightChange('lbs', e.target.value)}
                  className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="150"
                  min="0"
                  max="999"
                />
                <span className="self-center text-gray-600">lbs</span>
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Kilograms</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={weightData.kg || ''}
                  onChange={(e) => handleWeightChange('kg', e.target.value)}
                  className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="68"
                  min="0"
                  max="500"
                />
                <span className="self-center text-gray-600">kg</span>
              </div>
            </div>
          </div>
        </div>

        {/* Eye Color */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Eye Color <span className="text-red-500">*</span>
          </label>
          <select
            value={currentData[`${prefix}EyeColor`] || ''}
            onChange={(e) => updateField(`${prefix}EyeColor`, e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select one</option>
            <option value="Black">Black</option>
            <option value="Blue">Blue</option>
            <option value="Brown">Brown</option>
            <option value="Gray">Gray</option>
            <option value="Green">Green</option>
            <option value="Hazel">Hazel</option>
            <option value="Maroon">Maroon</option>
            <option value="Pink">Pink</option>
            <option value="Unknown">Unknown</option>
          </select>
        </div>

        {/* Hair Color */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hair Color <span className="text-red-500">*</span>
          </label>
          <select
            value={currentData[`${prefix}HairColor`] || ''}
            onChange={(e) => updateField(`${prefix}HairColor`, e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select one</option>
            <option value="Bald">Bald</option>
            <option value="Black">Black</option>
            <option value="Blond">Blond</option>
            <option value="Brown">Brown</option>
            <option value="Gray">Gray</option>
            <option value="Red">Red</option>
            <option value="Sandy">Sandy</option>
            <option value="White">White</option>
            <option value="Unknown">Unknown</option>
          </select>
        </div>
      </div>
    </ScreenLayout>
  );
};

export default PhysicalDescriptionScreen;
