// @ts-nocheck
/**
 * FieldRenderer - Extracted from App.tsx
 *
 * This component contains the EXACT field rendering logic from the original questionnaire.
 * DO NOT modify or recreate - this is copied directly from App.tsx renderField() function
 *
 * Extracted sections:
 * - Lines 78-84: phoneCountries
 * - Lines 86-469: addressFormats
 * - Lines 471-516: formatPostalCode, formatPhoneByCountry
 * - Lines 518-545: validateEmail
 * - Lines 1245-7388: renderField() switch statement with all case blocks
 */

import React from 'react';
import { ChevronDown, Info } from 'lucide-react';

// ========================================
// DATA STRUCTURES (from App.tsx lines 78-469)
// ========================================

const phoneCountries = [
  { code: 'US', name: 'United States', flag: '🇺🇸', dialCode: '+1', format: '(XXX) XXX-XXXX' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', dialCode: '+1', format: '(XXX) XXX-XXXX' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', dialCode: '+44', format: 'XXXX XXX XXX' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', dialCode: '+61', format: 'XXX XXX XXX' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', dialCode: '+49', format: 'XXX XXXXXXX' }
];

const addressFormats = {
  'United States': {
    stateRequired: true,
    stateLabel: 'State',
    provinceRequired: false,
    postalLabel: 'ZIP Code',
    postalFormat: /^\d{5}(-\d{4})?$/,
    postalPlaceholder: '12345 or 12345-6789',
    states: [
      'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
      'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
      'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
      'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
      'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
      'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
      'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
      'Wisconsin', 'Wyoming', 'District of Columbia'
    ]
  },
  'Canada': {
    stateRequired: true,
    stateLabel: 'Province/Territory',
    provinceLabel: 'Province/Territory',
    postalLabel: 'Postal Code',
    postalFormat: /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/,
    postalPlaceholder: 'K1A 0A9',
    states: [
      'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 'Newfoundland and Labrador',
      'Northwest Territories', 'Nova Scotia', 'Nunavut', 'Ontario', 'Prince Edward Island',
      'Quebec', 'Saskatchewan', 'Yukon'
    ]
  },
  'United Kingdom': {
    stateRequired: true,
    stateLabel: 'County',
    provinceLabel: 'County',
    postalLabel: 'Postcode',
    postalFormat: /^[A-Za-z]{1,2}\d[A-Za-z\d]?\s\d[A-Za-z]{2}$/,
    postalPlaceholder: 'SW1A 1AA'
  },
  'Australia': {
    stateRequired: true,
    stateLabel: 'State/Territory',
    provinceLabel: 'State/Territory',
    postalLabel: 'Postcode',
    postalFormat: /^\d{4}$/,
    postalPlaceholder: '2000',
    states: [
      'Australian Capital Territory', 'New South Wales', 'Northern Territory',
      'Queensland', 'South Australia', 'Tasmania', 'Victoria', 'Western Australia'
    ]
  },
  'Germany': {
    stateRequired: true,
    stateLabel: 'State',
    provinceLabel: 'State',
    postalLabel: 'Postleitzahl (PLZ)',
    postalFormat: /^\d{5}$/,
    postalPlaceholder: '10115',
    states: [
      'Baden-Württemberg', 'Bavaria', 'Berlin', 'Brandenburg', 'Bremen', 'Hamburg',
      'Hesse', 'Lower Saxony', 'Mecklenburg-Vorpommern', 'North Rhine-Westphalia',
      'Rhineland-Palatinate', 'Saarland', 'Saxony', 'Saxony-Anhalt', 'Schleswig-Holstein',
      'Thuringia'
    ]
  },
  'Mexico': {
    stateRequired: true,
    stateLabel: 'State',
    provinceLabel: 'State',
    postalLabel: 'Código Postal',
    postalFormat: /^\d{5}$/,
    postalPlaceholder: '01000',
    states: [
      'Aguascalientes', 'Baja California', 'Baja California Sur', 'Campeche',
      'Chiapas', 'Chihuahua', 'Coahuila', 'Colima', 'Durango', 'Guanajuato',
      'Guerrero', 'Hidalgo', 'Jalisco', 'México', 'Michoacán', 'Morelos',
      'Nayarit', 'Nuevo León', 'Oaxaca', 'Puebla', 'Querétaro', 'Quintana Roo',
      'San Luis Potosí', 'Sinaloa', 'Sonora', 'Tabasco', 'Tamaulipas', 'Tlaxcala',
      'Veracruz', 'Yucatán', 'Zacatecas', 'Ciudad de México'
    ]
  },
  'Brazil': {
    stateRequired: true,
    stateLabel: 'State',
    provinceLabel: 'State',
    postalLabel: 'CEP',
    postalFormat: /^\d{5}-?\d{3}$/,
    postalPlaceholder: '01310-100',
    states: [
      'Acre', 'Alagoas', 'Amapá', 'Amazonas', 'Bahia', 'Ceará',
      'Distrito Federal', 'Espírito Santo', 'Goiás', 'Maranhão', 'Mato Grosso',
      'Mato Grosso do Sul', 'Minas Gerais', 'Pará', 'Paraíba', 'Paraná',
      'Pernambuco', 'Piauí', 'Rio de Janeiro', 'Rio Grande do Norte',
      'Rio Grande do Sul', 'Rondônia', 'Roraima', 'Santa Catarina',
      'São Paulo', 'Sergipe', 'Tocantins'
    ]
  },
  'Philippines': {
    stateRequired: true,
    stateLabel: 'Province',
    provinceLabel: 'Province',
    postalLabel: 'Postal Code',
    postalFormat: /^\d{4}$/,
    postalPlaceholder: '1000',
    states: [
      'Abra', 'Agusan del Norte', 'Agusan del Sur', 'Aklan', 'Albay', 'Antique',
      'Apayao', 'Aurora', 'Basilan', 'Bataan', 'Batanes', 'Batangas', 'Benguet',
      'Biliran', 'Bohol', 'Bukidnon', 'Bulacan', 'Cagayan', 'Camarines Norte',
      'Camarines Sur', 'Camiguin', 'Capiz', 'Catanduanes', 'Cavite', 'Cebu',
      'Cotabato', 'Davao de Oro', 'Davao del Norte', 'Davao del Sur', 'Davao Occidental',
      'Davao Oriental', 'Dinagat Islands', 'Eastern Samar', 'Guimaras', 'Ifugao',
      'Ilocos Norte', 'Ilocos Sur', 'Iloilo', 'Isabela', 'Kalinga', 'La Union',
      'Laguna', 'Lanao del Norte', 'Lanao del Sur', 'Leyte', 'Maguindanao',
      'Marinduque', 'Masbate', 'Misamis Occidental', 'Misamis Oriental', 'Mountain Province',
      'Negros Occidental', 'Negros Oriental', 'Northern Samar', 'Nueva Ecija', 'Nueva Vizcaya',
      'Occidental Mindoro', 'Oriental Mindoro', 'Palawan', 'Pampanga', 'Pangasinan',
      'Quezon', 'Quirino', 'Rizal', 'Romblon', 'Samar', 'Sarangani', 'Siquijor',
      'Sorsogon', 'South Cotabato', 'Southern Leyte', 'Sultan Kudarat', 'Sulu',
      'Surigao del Norte', 'Surigao del Sur', 'Tarlac', 'Tawi-Tawi', 'Zambales',
      'Zamboanga del Norte', 'Zamboanga del Sur', 'Zamboanga Sibugay',
      'Metro Manila'
    ]
  },
  'Colombia': {
    stateRequired: true,
    stateLabel: 'Department',
    provinceLabel: 'Department',
    postalLabel: 'Código Postal',
    postalFormat: /^\d{6}$/,
    postalPlaceholder: '110111',
    states: [
      'Amazonas', 'Antioquia', 'Arauca', 'Atlántico', 'Bolívar', 'Boyacá',
      'Caldas', 'Caquetá', 'Casanare', 'Cauca', 'Cesar', 'Chocó', 'Córdoba',
      'Cundinamarca', 'Guainía', 'Guaviare', 'Huila', 'La Guajira', 'Magdalena',
      'Meta', 'Nariño', 'Norte de Santander', 'Putumayo', 'Quindío', 'Risaralda',
      'San Andrés y Providencia', 'Santander', 'Sucre', 'Tolima', 'Valle del Cauca',
      'Vaupés', 'Vichada', 'Bogotá D.C.'
    ]
  },
  'France': {
    stateRequired: true,
    stateLabel: 'Region',
    provinceLabel: 'Region',
    postalLabel: 'Code Postal',
    postalFormat: /^\d{5}$/,
    postalPlaceholder: '75001',
    states: [
      'Auvergne-Rhône-Alpes', 'Bourgogne-Franche-Comté', 'Bretagne', 'Centre-Val de Loire',
      'Corse', 'Grand Est', 'Hauts-de-France', 'Île-de-France', 'Normandie',
      'Nouvelle-Aquitaine', 'Occitanie', 'Pays de la Loire', 'Provence-Alpes-Côte d\'Azur',
      'Guadeloupe', 'Martinique', 'Guyane', 'La Réunion', 'Mayotte'
    ]
  },
  'India': {
    stateRequired: true,
    stateLabel: 'State/Union Territory',
    provinceLabel: 'State/Union Territory',
    postalLabel: 'PIN Code',
    postalFormat: /^\d{6}$/,
    postalPlaceholder: '110001',
    states: [
      'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
      'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
      'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
      'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
      'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
      'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
      'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
    ]
  },
  'Japan': {
    stateRequired: true,
    stateLabel: 'Prefecture',
    provinceLabel: 'Prefecture',
    postalLabel: 'Postal Code',
    postalFormat: /^\d{3}-?\d{4}$/,
    postalPlaceholder: '100-0001',
    states: [
      'Hokkaido', 'Aomori', 'Iwate', 'Miyagi', 'Akita', 'Yamagata', 'Fukushima',
      'Ibaraki', 'Tochigi', 'Gunma', 'Saitama', 'Chiba', 'Tokyo', 'Kanagawa',
      'Niigata', 'Toyama', 'Ishikawa', 'Fukui', 'Yamanashi', 'Nagano', 'Gifu',
      'Shizuoka', 'Aichi', 'Mie', 'Shiga', 'Kyoto', 'Osaka', 'Hyogo', 'Nara',
      'Wakayama', 'Tottori', 'Shimane', 'Okayama', 'Hiroshima', 'Yamaguchi',
      'Tokushima', 'Kagawa', 'Ehime', 'Kochi', 'Fukuoka', 'Saga', 'Nagasaki',
      'Kumamoto', 'Oita', 'Miyazaki', 'Kagoshima', 'Okinawa'
    ]
  },
  'South Korea': {
    stateRequired: true,
    stateLabel: 'Province',
    provinceLabel: 'Province',
    postalLabel: 'Postal Code',
    postalFormat: /^\d{5}$/,
    postalPlaceholder: '04524',
    states: [
      'Seoul', 'Busan', 'Daegu', 'Incheon', 'Gwangju', 'Daejeon', 'Ulsan', 'Sejong',
      'Gyeonggi', 'Gangwon', 'North Chungcheong', 'South Chungcheong',
      'North Jeolla', 'South Jeolla', 'North Gyeongsang', 'South Gyeongsang', 'Jeju'
    ]
  },
  'Nigeria': {
    stateRequired: true,
    stateLabel: 'State',
    provinceLabel: 'State',
    postalLabel: 'Postal Code',
    postalFormat: /^\d{6}$/,
    postalPlaceholder: '100001',
    states: [
      'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue',
      'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Gombe',
      'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara',
      'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau',
      'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara', 'Federal Capital Territory'
    ]
  },
  'China': {
    stateRequired: true,
    stateLabel: 'Province',
    provinceLabel: 'Province',
    postalLabel: 'Postal Code',
    postalFormat: /^\d{6}$/,
    postalPlaceholder: '100000',
    states: [
      'Anhui', 'Fujian', 'Gansu', 'Guangdong', 'Guizhou', 'Hainan',
      'Hebei', 'Heilongjiang', 'Henan', 'Hubei', 'Hunan', 'Jiangsu',
      'Jiangxi', 'Jilin', 'Liaoning', 'Qinghai', 'Shaanxi', 'Shandong',
      'Shanxi', 'Sichuan', 'Yunnan', 'Zhejiang',
      'Guangxi Zhuang Autonomous Region', 'Inner Mongolia Autonomous Region',
      'Ningxia Hui Autonomous Region', 'Tibet Autonomous Region',
      'Xinjiang Uygur Autonomous Region',
      'Beijing', 'Chongqing', 'Shanghai', 'Tianjin',
      'Hong Kong', 'Macau'
    ]
  },
  'Russia': {
    stateRequired: true,
    stateLabel: 'Oblast/Region',
    provinceLabel: 'Oblast/Region',
    postalLabel: 'Postal Code',
    postalFormat: /^[1-6]\d{5}$/,
    postalPlaceholder: '101000',
    states: [
      'Amur Oblast', 'Arkhangelsk Oblast', 'Astrakhan Oblast',
      'Belgorod Oblast', 'Bryansk Oblast', 'Chelyabinsk Oblast',
      'Irkutsk Oblast', 'Ivanovo Oblast', 'Kaliningrad Oblast',
      'Kaluga Oblast', 'Kemerovo Oblast', 'Kirov Oblast',
      'Kostroma Oblast', 'Kurgan Oblast', 'Kursk Oblast',
      'Leningrad Oblast', 'Lipetsk Oblast', 'Magadan Oblast',
      'Moscow Oblast', 'Murmansk Oblast', 'Nizhny Novgorod Oblast',
      'Novgorod Oblast', 'Novosibirsk Oblast', 'Omsk Oblast',
      'Orenburg Oblast', 'Oryol Oblast', 'Penza Oblast',
      'Pskov Oblast', 'Rostov Oblast', 'Ryazan Oblast',
      'Sakhalin Oblast', 'Samara Oblast', 'Saratov Oblast',
      'Smolensk Oblast', 'Sverdlovsk Oblast', 'Tambov Oblast',
      'Tomsk Oblast', 'Tula Oblast', 'Tver Oblast',
      'Tyumen Oblast', 'Ulyanovsk Oblast', 'Vladimir Oblast',
      'Volgograd Oblast', 'Vologda Oblast', 'Voronezh Oblast',
      'Yaroslavl Oblast',
      'Altai Krai', 'Kamchatka Krai', 'Khabarovsk Krai',
      'Krasnodar Krai', 'Krasnoyarsk Krai', 'Perm Krai',
      'Primorsky Krai', 'Stavropol Krai', 'Zabaykalsky Krai',
      'Adygea Republic', 'Altai Republic', 'Bashkortostan Republic',
      'Buryatia Republic', 'Chechnya Republic', 'Chuvashia Republic',
      'Crimea Republic', 'Dagestan Republic', 'Ingushetia Republic',
      'Kabardino-Balkaria Republic', 'Kalmykia Republic', 'Karachay-Cherkessia Republic',
      'Karelia Republic', 'Khakassia Republic', 'Komi Republic',
      'Mari El Republic', 'Mordovia Republic', 'North Ossetia-Alania Republic',
      'Sakha (Yakutia) Republic', 'Tatarstan Republic', 'Tyva Republic',
      'Udmurtia Republic',
      'Moscow', 'Saint Petersburg', 'Sevastopol',
      'Chukotka Autonomous Okrug', 'Khanty-Mansi Autonomous Okrug',
      'Nenets Autonomous Okrug', 'Yamalo-Nenets Autonomous Okrug',
      'Jewish Autonomous Oblast'
    ]
  },
  'Thailand': {
    stateRequired: true,
    stateLabel: 'Province',
    provinceLabel: 'Province',
    postalLabel: 'Postal Code',
    postalFormat: /^\d{5}$/,
    postalPlaceholder: '10300',
    states: [
      'Chiang Mai', 'Chiang Rai', 'Lampang', 'Lamphun',
      'Mae Hong Son', 'Nan', 'Phayao', 'Phrae', 'Uttaradit',
      'Amnat Charoen', 'Bueng Kan', 'Buriram', 'Chaiyaphum',
      'Kalasin', 'Khon Kaen', 'Loei', 'Maha Sarakham',
      'Mukdahan', 'Nakhon Phanom', 'Nakhon Ratchasima', 'Nong Bua Lamphu',
      'Nong Khai', 'Roi Et', 'Sakon Nakhon', 'Sisaket',
      'Surin', 'Ubon Ratchathani', 'Udon Thani', 'Yasothon',
      'Ang Thong', 'Bangkok', 'Chai Nat', 'Kanchanaburi',
      'Lop Buri', 'Nakhon Nayok', 'Nakhon Pathom', 'Nonthaburi',
      'Pathum Thani', 'Phetchaburi', 'Phra Nakhon Si Ayutthaya', 'Prachin Buri',
      'Prachuap Khiri Khan', 'Ratchaburi', 'Samut Prakan', 'Samut Sakhon',
      'Samut Songkhram', 'Saraburi', 'Sing Buri', 'Suphan Buri',
      'Nakhon Sawan', 'Uthai Thani',
      'Chumphon', 'Krabi', 'Nakhon Si Thammarat', 'Narathiwat',
      'Pattani', 'Phang Nga', 'Phatthalung', 'Phuket',
      'Ranong', 'Satun', 'Songkhla', 'Surat Thani',
      'Trang', 'Yala',
      'Chachoengsao', 'Chanthaburi', 'Chon Buri', 'Rayong',
      'Sa Kaeo', 'Trat', 'Pattaya',
      'Tak', 'Kamphaeng Phet', 'Phichit', 'Phitsanulok',
      'Sukhothai'
    ]
  },
  'Ukraine': {
    stateRequired: true,
    stateLabel: 'Oblast',
    provinceLabel: 'Oblast',
    postalLabel: 'Postal Code',
    postalFormat: /^\d{5}$/,
    postalPlaceholder: '01001',
    states: [
      'Cherkasy Oblast', 'Chernihiv Oblast', 'Chernivtsi Oblast',
      'Dnipropetrovsk Oblast', 'Donetsk Oblast', 'Ivano-Frankivsk Oblast',
      'Kharkiv Oblast', 'Kherson Oblast', 'Khmelnytskyi Oblast',
      'Kirovohrad Oblast', 'Kyiv Oblast', 'Luhansk Oblast',
      'Lviv Oblast', 'Mykolaiv Oblast', 'Odesa Oblast',
      'Poltava Oblast', 'Rivne Oblast', 'Sumy Oblast',
      'Ternopil Oblast', 'Vinnytsia Oblast', 'Volyn Oblast',
      'Zakarpattia Oblast', 'Zaporizhzhia Oblast', 'Zhytomyr Oblast',
      'Autonomous Republic of Crimea',
      'Kyiv', 'Sevastopol'
    ]
  },
  'Vietnam': {
    stateRequired: true,
    stateLabel: 'Province/City',
    provinceLabel: 'Province/City',
    postalLabel: 'Postal Code',
    postalFormat: /^\d{5}$/,
    postalPlaceholder: '10000',
    states: [
      'Hanoi', 'Ho Chi Minh City', 'Da Nang',
      'Hai Phong', 'Can Tho', 'Hue',
      'Hoa Binh', 'Son La', 'Dien Bien', 'Lai Chau', 'Lao Cai', 'Yen Bai',
      'Ha Nam', 'Ninh Binh', 'Bac Ninh', 'Hai Duong',
      'Hung Yen', 'Nam Dinh', 'Thai Binh', 'Vinh Phuc',
      'Ha Giang', 'Cao Bang', 'Bac Can', 'Lang Son', 'Tuyen Quang',
      'Thai Nguyen', 'Phu Tho', 'Bac Giang', 'Quang Ninh',
      'Thanh Hoa', 'Nghe An', 'Ha Tinh', 'Quang Binh', 'Quang Tri',
      'Kon Tum', 'Gia Lai', 'Dak Lak', 'Dak Nong', 'Lam Dong',
      'Khanh Hoa', 'Ninh Thuan', 'Binh Thuan', 'Quang Nam',
      'Quang Ngai', 'Binh Dinh', 'Phu Yen',
      'Ba Ria-Vung Tau', 'Binh Duong', 'Binh Phuoc',
      'Dong Nai', 'Tay Ninh',
      'Long An', 'Tien Giang', 'Ben Tre', 'Vinh Long',
      'Tra Vinh', 'Hau Giang', 'Soc Trang', 'Dong Thap',
      'An Giang', 'Kien Giang', 'Bac Lieu', 'Ca Mau'
    ]
  },
  'Singapore': {
    stateRequired: false,
    provinceNA: true,
    postalLabel: 'Postal Code',
    postalFormat: /^\d{6}$/,
    postalPlaceholder: '018956'
  },
  'Monaco': {
    stateRequired: false,
    provinceNA: true,
    postalLabel: 'Postal Code',
    postalFormat: /^980\d{2}$/,
    postalPlaceholder: '98000'
  },
  'Vatican City': {
    stateRequired: false,
    provinceNA: true,
    postalLabel: 'Postal Code',
    postalFormat: /^00120$/,
    postalPlaceholder: '00120'
  },
  'Malta': {
    stateRequired: false,
    provinceNA: true,
    postalLabel: 'Postal Code',
    postalFormat: /^[A-Z]{3} \d{4}$/,
    postalPlaceholder: 'VLT 1117'
  }
};

// ========================================
// HELPER FUNCTIONS (from App.tsx lines 471-545)
// ========================================

const formatPostalCode = (value, country) => {
  const format = addressFormats[country];
  if (!format) return value;

  const digits = value.replace(/\D/g, '');

  // Country-specific formatting
  switch (country) {
    case 'United States':
      if (digits.length <= 5) return digits;
      return `${digits.slice(0, 5)}-${digits.slice(5, 9)}`;
    case 'Canada':
      // K1A 0A9 format
      let formatted = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
      if (formatted.length > 3) {
        formatted = formatted.slice(0, 3) + ' ' + formatted.slice(3, 6);
      }
      return formatted;
    default:
      return digits;
  }
};

const formatPhoneByCountry = (value, countryCode) => {
  const country = phoneCountries.find(c => c.code === countryCode);
  if (!country) return value;
  const digits = value.replace(/\D/g, '');
  const format = country.format;
  let formatted = '';
  let digitIndex = 0;
  for (let i = 0; i < format.length && digitIndex < digits.length; i++) {
    if (format[i] === 'X') {
      formatted += digits[digitIndex];
      digitIndex++;
    } else {
      formatted += format[i];
    }
  }
  return formatted;
};

const validateEmail = (emailObj) => {
  if (!emailObj || (!emailObj.localPart && !emailObj.domain)) {
    return { isValid: true, message: '' };
  }
  const { localPart, domain, customDomain } = emailObj;

  if (localPart && localPart.length === 0) {
    return { isValid: false, message: "Please enter your email name" };
  }

  if (localPart && !domain) {
    return { isValid: false, message: "Please select an email provider (like Gmail)" };
  }

  if (domain === 'other' && (!customDomain || customDomain.length === 0)) {
    return { isValid: false, message: "Please enter your email provider (like company.com)" };
  }

  if (domain === 'other' && customDomain && !customDomain.includes('.')) {
    return { isValid: false, message: "Email provider must include a dot (like company.com)" };
  }

  if (localPart && (domain !== 'other' || customDomain)) {
    return { isValid: true, message: "Looks good! ✅" };
  }

  return { isValid: true, message: '' };
};

// ========================================
// FIELD RENDERER COMPONENT
// ========================================

/**
 * FieldRenderer Component
 *
 * Renders a single field using the EXACT logic from App.tsx renderField() function
 *
 * Props:
 * - field: Field definition object {id, label, type, required, options, helpText, showWhen, etc.}
 * - currentData: The full questionnaire data object
 * - updateField: Function to update a field value
 * - touchedFields: Object tracking which fields have been touched (for validation)
 * - setTouchedFields: Function to update touched fields
 * - setShowInfoPanel: Function to control info panel visibility (for address fields)
 * - showInfoPanel: Boolean indicating if info panel is visible
 */
const FieldRenderer = ({
  field,
  currentData,
  updateField,
  touchedFields = {},
  setTouchedFields = () => {},
  setShowInfoPanel = () => {},
  showInfoPanel = false
}) => {

  // Check showWhen condition
  if (field.showWhen && !field.showWhen(currentData)) {
    return null;
  }

  const value = currentData[field.id] || '';

  // ========================================
  // SWITCH STATEMENT - ALL FIELD TYPES
  // Copied from App.tsx lines 1245-7388
  // ========================================

  switch (field.type) {

    case 'select':
      const isSelectFieldTouched = touchedFields && touchedFields[field.id];
      const selectUnknownFieldId = `${field.id}Unknown`;
      const isSelectUnknown = currentData[selectUnknownFieldId] || false;
      const showSelectError = isSelectFieldTouched && field.required && (!value || value === '') && !isSelectUnknown;

      // Dynamic options for sponsorPreviousMarriages field
      let selectOptions = field.options;
      if (field.id === 'sponsorPreviousMarriages') {
        const maritalStatus = currentData['sponsorMaritalStatus'] || '';
        const preparingWhileDivorcing = currentData['preparingWhileDivorcing'] || false;

        // For married users preparing while divorcing, start from 1 (not 0) since they must include current marriage
        if (maritalStatus === 'Married' && preparingWhileDivorcing) {
          selectOptions = ['1', '2', '3', '4', '5+'];
        }
      }

      // Dynamic options for beneficiaryPreviousMarriages field
      if (field.id === 'beneficiaryPreviousMarriages') {
        const beneficiaryMaritalStatus = currentData['beneficiaryMaritalStatus'] || '';
        const beneficiaryPreparingWhileDivorcing = currentData['beneficiaryPreparingWhileDivorcing'] || false;

        // For married beneficiaries preparing while divorcing, start from 1 (not 0) since they must include current marriage
        if (beneficiaryMaritalStatus === 'Married' && beneficiaryPreparingWhileDivorcing) {
          selectOptions = ['1', '2', '3', '4', '5+'];
        }
      }

      return (
        <div>
          <div className="flex items-center gap-3">
            <select
              className={`flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500 ${showSelectError ? 'border-red-500' : ''
                } ${isSelectUnknown ? 'opacity-50 pointer-events-none bg-gray-100' : ''}`}
              value={isSelectUnknown ? '' : value}
              disabled={isSelectUnknown}
              onFocus={() => {
                setTouchedFields(prev => ({ ...prev, [field.id]: false }));
              }}
              onBlur={() => {
                setTouchedFields(prev => ({ ...prev, [field.id]: true }));
              }}
              onChange={(e) => updateField(field.id, e.target.value)}
            >
              <option value="">Select...</option>
              {selectOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            {field.allowUnknown && (
              <label className="flex items-center gap-2 text-sm text-gray-700 whitespace-nowrap cursor-pointer">
                <input
                  type="checkbox"
                  checked={isSelectUnknown}
                  onChange={(e) => {
                    updateField(selectUnknownFieldId, e.target.checked);
                    if (e.target.checked) {
                      updateField(field.id, '');
                    }
                  }}
                  className="w-4 h-4"
                />
                Unknown
              </label>
            )}
          </div>
          {showSelectError && (
            <div className="mt-1 text-sm text-red-600">
              ⚠️ Please select an option
            </div>
          )}
        </div>
      );

    case 'date':
      const isDateFieldTouched = touchedFields && touchedFields[field.id];
      const unknownFieldId = `${field.id}Unknown`;
      const isUnknown = currentData[unknownFieldId] || false;
      const showDateError = isDateFieldTouched && field.required && (!value || value === '') && !isUnknown;

      return (
        <div>
          <div className="flex items-center gap-3">
            <input
              type="date"
              className={`flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500 ${showDateError ? 'border-red-500' : ''
                } ${isUnknown ? 'opacity-50 pointer-events-none bg-gray-100' : ''}`}
              value={isUnknown ? '' : value}
              disabled={isUnknown}
              onFocus={() => {
                setTouchedFields(prev => ({ ...prev, [field.id]: false }));
              }}
              onBlur={() => {
                setTouchedFields(prev => ({ ...prev, [field.id]: true }));
              }}
              onChange={(e) => updateField(field.id, e.target.value)}
            />
            {field.allowUnknown && (
              <label className="flex items-center gap-2 text-sm text-gray-700 whitespace-nowrap cursor-pointer">
                <input
                  type="checkbox"
                  checked={isUnknown}
                  onChange={(e) => {
                    updateField(unknownFieldId, e.target.checked);
                    if (e.target.checked) {
                      updateField(field.id, '');
                    }
                  }}
                  className="w-4 h-4"
                />
                Unknown
              </label>
            )}
          </div>
          {showDateError && (
            <div className="mt-1 text-sm text-red-600">
              ⚠️ Please select a date
            </div>
          )}
        </div>
      );

    case 'checkbox':
      return (
        <div className="flex items-start space-x-2">
          <input
            type="checkbox"
            id={field.id}
            className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            checked={value || false}
            onChange={(e) => updateField(field.id, e.target.checked)}
          />
          <label htmlFor={field.id} className="text-sm text-gray-700">
            {field.label}
          </label>
        </div>
      );

    case 'multi-select':
      const multiSelectValue = currentData[field.id] || [];

      return (
        <div className="space-y-2">
          {field.options.map(option => (
            <label key={option} className="flex items-center space-x-2">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                checked={multiSelectValue.includes(option)}
                onChange={(e) => {
                  if (e.target.checked) {
                    updateField(field.id, [...multiSelectValue, option]);
                  } else {
                    updateField(field.id, multiSelectValue.filter(v => v !== option));
                  }
                }}
              />
              <span className="text-sm text-gray-700">{option}</span>
            </label>
          ))}
        </div>
      );

    case 'other-names':
      const otherNamesValue = currentData[field.id] || [];

      return (
        <div className="space-y-3">
          {otherNamesValue.map((nameEntry, index) => (
            <div key={index} className="border border-gray-200 rounded p-3 bg-gray-50">
              <div className="grid grid-cols-3 gap-2 mb-2">
                <input
                  type="text"
                  className="p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  value={nameEntry.lastName || ''}
                  onChange={(e) => {
                    const newNames = [...otherNamesValue];
                    newNames[index] = { ...newNames[index], lastName: e.target.value };
                    updateField(field.id, newNames);
                  }}
                  placeholder="Last Name"
                />
                <input
                  type="text"
                  className="p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  value={nameEntry.firstName || ''}
                  onChange={(e) => {
                    const newNames = [...otherNamesValue];
                    newNames[index] = { ...newNames[index], firstName: e.target.value };
                    updateField(field.id, newNames);
                  }}
                  placeholder="First Name"
                />
                <input
                  type="text"
                  className="p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  value={nameEntry.middleName || ''}
                  onChange={(e) => {
                    const newNames = [...otherNamesValue];
                    newNames[index] = { ...newNames[index], middleName: e.target.value };
                    updateField(field.id, newNames);
                  }}
                  placeholder="Middle Name"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  const newNames = otherNamesValue.filter((_, i) => i !== index);
                  updateField(field.id, newNames);
                }}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Remove this name
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() => {
              const newNames = [...otherNamesValue, { lastName: '', firstName: '', middleName: '' }];
              updateField(field.id, newNames);
            }}
            className="w-full p-2 border-2 border-dashed border-gray-300 rounded text-gray-600 hover:border-gray-400 hover:text-gray-800 transition-colors"
          >
            + Add another name
          </button>

          {otherNamesValue.length === 0 && (
            <p className="text-sm text-gray-500 italic">
              Click "Add another name" to add maiden names, aliases, nicknames, etc.
            </p>
          )}
        </div>
      );

    case 'smart-email':
      const smartEmailValue = currentData[field.id] || {};
      const emailValidationResult = validateEmail(smartEmailValue);
      const { localPart: emailLocalPart = '', domain: emailDomain = '', customDomain: emailCustomDomain = '' } = smartEmailValue;

      const popularEmailDomains = [
        { value: 'gmail.com', label: 'Gmail (gmail.com)' },
        { value: 'outlook.com', label: 'Outlook (outlook.com)' },
        { value: 'yahoo.com', label: 'Yahoo (yahoo.com)' },
        { value: 'hotmail.com', label: 'Hotmail (hotmail.com)' },
        { value: 'icloud.com', label: 'iCloud (icloud.com)' },
        { value: 'other', label: 'Other...' }
      ];

      const isEmailFieldTouched = touchedFields && touchedFields[field.id];
      const showEmailError = isEmailFieldTouched && (emailLocalPart || emailDomain || emailCustomDomain) && !emailValidationResult.isValid;

      return (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              className="flex-1 p-2 border rounded-l focus:ring-2 focus:ring-blue-500"
              value={emailLocalPart}
              onFocus={() => {
                setTouchedFields(prev => ({ ...prev, [field.id]: false }));
              }}
              onBlur={() => {
                setTouchedFields(prev => ({ ...prev, [field.id]: true }));
              }}
              onChange={(e) => {
                const cleanValue = e.target.value.replace(/[^a-zA-Z0-9._-]/g, '');
                const newValue = { ...smartEmailValue, localPart: cleanValue };
                updateField(field.id, newValue);
              }}
              placeholder="yourname"
            />
            <span className="px-2 py-2 bg-gray-100 border-t border-b border-gray-300 text-gray-700 font-medium">
              @
            </span>
            <select
              className="flex-1 p-2 border rounded-r focus:ring-2 focus:ring-blue-500 min-w-0"
              value={emailDomain}
              onFocus={() => {
                setTouchedFields(prev => ({ ...prev, [field.id]: false }));
              }}
              onBlur={() => {
                setTouchedFields(prev => ({ ...prev, [field.id]: true }));
              }}
              onChange={(e) => {
                const newValue = { ...smartEmailValue, domain: e.target.value };
                if (e.target.value !== 'other') {
                  newValue.customDomain = '';
                }
                updateField(field.id, newValue);
              }}
            >
              <option value="">Select provider...</option>
              {popularEmailDomains.map(provider => (
                <option key={provider.value} value={provider.value}>
                  {provider.label}
                </option>
              ))}
            </select>
          </div>

          {emailDomain === 'other' && (
            <input
              type="text"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              value={emailCustomDomain}
              onFocus={() => {
                setTouchedFields(prev => ({ ...prev, [field.id]: false }));
              }}
              onBlur={() => {
                setTouchedFields(prev => ({ ...prev, [field.id]: true }));
              }}
              onChange={(e) => {
                const cleanValue = e.target.value.replace(/[^a-zA-Z0-9.-]/g, '');
                const newValue = { ...smartEmailValue, customDomain: cleanValue };
                updateField(field.id, newValue);
              }}
              placeholder="company.com or school.edu"
            />
          )}

          {showEmailError && emailValidationResult.message && (
            <div className="text-sm flex items-center text-orange-600">
              <span className="mr-1">{emailValidationResult.message}</span>
            </div>
          )}
        </div>
      );

    case 'international-phone':
      const intlPhoneValue = currentData[field.id] || {};
      const selectedPhoneCountry = intlPhoneValue.country || 'US';
      const phoneNumberValue = intlPhoneValue.number || '';

      // Check if field is touched for this specific phone field
      const isPhoneFieldTouched = touchedFields && touchedFields[field.id];
      const phoneDigits = phoneNumberValue.replace(/\D/g, '').length;
      const minDigits = selectedPhoneCountry === 'US' || selectedPhoneCountry === 'CA' ? 10 : 7;
      const showPhoneError = isPhoneFieldTouched && field.required && phoneNumberValue && phoneDigits < minDigits;

      return (
        <div className="space-y-2">
          <select
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            value={selectedPhoneCountry}
            onChange={(e) => {
              updateField(field.id, { ...intlPhoneValue, country: e.target.value, number: '' });
            }}
          >
            {phoneCountries.map(country => (
              <option key={country.code} value={country.code}>
                {country.flag} {country.name} ({country.dialCode})
              </option>
            ))}
          </select>
          <div className="flex">
            <span className="inline-flex items-center px-3 py-2 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-l">
              {phoneCountries.find(c => c.code === selectedPhoneCountry)?.dialCode}
            </span>
            <input
              type="tel"
              className={`flex-1 p-2 border rounded-r focus:ring-2 focus:ring-blue-500 ${showPhoneError ? 'border-red-500' : 'border-gray-300'
                }`}
              value={phoneNumberValue}
              onFocus={() => {
                setTouchedFields(prev => ({ ...prev, [field.id]: false }));
              }}
              onBlur={() => {
                setTouchedFields(prev => ({ ...prev, [field.id]: true }));
              }}
              onChange={(e) => {
                const formatted = formatPhoneByCountry(e.target.value, selectedPhoneCountry);
                updateField(field.id, { ...intlPhoneValue, number: formatted });
              }}
              placeholder={phoneCountries.find(c => c.code === selectedPhoneCountry)?.format?.replace(/X/g, '0') || 'Phone number'}
            />
          </div>
          {showPhoneError && (
            <div className="text-sm text-red-600">
              ⚠️ Please enter a valid phone number
            </div>
          )}
        </div>
      );

    case 'ssn':
      const ssnDigits = (value || '').replace(/\D/g, '');
      const isSSNFieldTouched = touchedFields && touchedFields[field.id];
      const showSSNError = isSSNFieldTouched && field.required && ssnDigits.length > 0 && ssnDigits.length < 9;

      return (
        <div>
          <input
            type="text"
            className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 ${showSSNError ? 'border-red-500' : ''
              }`}
            value={value}
            onFocus={() => {
              setTouchedFields(prev => ({ ...prev, [field.id]: false }));
            }}
            onBlur={() => {
              setTouchedFields(prev => ({ ...prev, [field.id]: true }));
            }}
            onChange={(e) => {
              let digits = e.target.value.replace(/\D/g, '');
              digits = digits.slice(0, 9);

              let formatted = '';
              if (digits.length > 0) {
                formatted = digits.slice(0, 3);
                if (digits.length > 3) {
                  formatted += '-' + digits.slice(3, 5);
                }
                if (digits.length > 5) {
                  formatted += '-' + digits.slice(5, 9);
                }
              }

              updateField(field.id, formatted);
            }}
            placeholder="XXX-XX-XXXX"
            maxLength="11"
          />
          {showSSNError && (
            <div className="mt-1 text-sm text-red-600">
              ⚠️ Please enter all 9 digits
            </div>
          )}
        </div>
      );

    case 'birth-location':
      const birthLocationValue = currentData[field.id] || {};
      const { city: birthLocationCity = '', state: birthLocationState = '', country: birthLocationCountry = '' } = birthLocationValue;
      const isBirthLocationTouched = touchedFields && touchedFields[field.id];
      const showCityError = isBirthLocationTouched && field.required && birthLocationCountry && !birthLocationCity;
      const countryFormat = addressFormats[birthLocationCountry] || { stateRequired: false };
      const showStateError = isBirthLocationTouched && field.required && birthLocationCountry && !birthLocationState;
      const showCountryError = isBirthLocationTouched && field.required && !birthLocationCountry;

      return (
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <h4 className="text-sm font-semibold text-gray-700 mb-3 border-b border-gray-300 pb-2">
            📍 Place of Birth Information
          </h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country <span className="text-red-500">*</span>
              </label>
              <select
                className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 ${showCountryError ? 'border-red-500' : ''
                  }`}
                value={birthLocationCountry}
                onFocus={() => {
                  setTouchedFields(prev => ({ ...prev, [field.id]: false }));
                }}
                onBlur={() => {
                  setTouchedFields(prev => ({ ...prev, [field.id]: true }));
                }}
                onChange={(e) => {
                  updateField(field.id, { ...birthLocationValue, country: e.target.value, state: '' });
                }}
              >
                <option value="">Select country...</option>
                {/* Filter out United States for beneficiary birth location (K-1 beneficiary must be foreign national) */}
                {(field.id === 'beneficiaryBirthLocation'
                  ? phoneCountries.filter(c => c.name !== 'United States')
                  : phoneCountries
                ).map(c => (
                  <option key={c.code} value={c.name}>
                    {c.flag} {c.name}
                  </option>
                ))}
              </select>
              {showCountryError && (
                <div className="mt-1 text-sm text-red-600">
                  ⚠️ Please select a country
                </div>
              )}
            </div>

            {birthLocationCountry && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City/Town/Village <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 ${showCityError ? 'border-red-500' : ''
                      }`}
                    value={birthLocationCity}
                    onFocus={() => {
                      setTouchedFields(prev => ({ ...prev, [field.id]: false }));
                    }}
                    onBlur={() => {
                      setTouchedFields(prev => ({ ...prev, [field.id]: true }));
                    }}
                    onChange={(e) => updateField(field.id, { ...birthLocationValue, city: e.target.value })}
                    placeholder="Enter city/town/village"
                  />
                  {showCityError && (
                    <div className="mt-1 text-sm text-red-600">
                      ⚠️ City/Town/Village is required
                    </div>
                  )}
                </div>

                <div>
                  {(() => {
                    const countryFormat = addressFormats[birthLocationCountry] || { stateRequired: false, stateLabel: 'Province', provinceLabel: 'Province' };
                    const hasDropdown = countryFormat.states && countryFormat.states.length > 0;
                    const labelText = countryFormat.provinceLabel || countryFormat.stateLabel || 'Province';

                    return (
                      <>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {labelText} <span className="text-red-500">*</span>
                        </label>
                        {hasDropdown ? (
                          <select
                            className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 ${showStateError ? 'border-red-500' : ''
                              }`}
                            value={birthLocationState}
                            onFocus={() => {
                              setTouchedFields(prev => ({ ...prev, [field.id]: false }));
                            }}
                            onBlur={() => {
                              setTouchedFields(prev => ({ ...prev, [field.id]: true }));
                            }}
                            onChange={(e) => updateField(field.id, { ...birthLocationValue, state: e.target.value })}
                          >
                            <option value="">Select {labelText.toLowerCase()}...</option>
                            {countryFormat.states.map(stateOption => (
                              <option key={stateOption} value={stateOption}>{stateOption}</option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type="text"
                            className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 ${showStateError ? 'border-red-500' : ''
                              }`}
                            value={birthLocationState}
                            onFocus={() => {
                              setTouchedFields(prev => ({ ...prev, [field.id]: false }));
                            }}
                            onBlur={() => {
                              setTouchedFields(prev => ({ ...prev, [field.id]: true }));
                            }}
                            onChange={(e) => updateField(field.id, { ...birthLocationValue, state: e.target.value })}
                            placeholder={`Enter ${labelText.toLowerCase()}`}
                          />
                        )}
                      </>
                    );
                  })()}
                </div>
              </>
            )}
          </div>
          {showStateError && (() => {
            const countryFormat = addressFormats[birthLocationCountry] || { provinceLabel: 'Province' };
            const labelText = countryFormat.provinceLabel || countryFormat.stateLabel || 'Province';
            return (
              <div className="mt-1 text-sm text-red-600">
                ⚠️ {labelText} is required
              </div>
            );
          })()}
        </div>
      );

    case 'citizenship-method':
      return (
        <div className="space-y-2">
          <select
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            value={value}
            onChange={(e) => updateField(field.id, e.target.value)}
          >
            <option value="">Select...</option>
            <option value="Birth in the United States">Birth in the United States</option>
            <option value="Naturalization">Naturalization</option>
            <option value="U.S. citizen parents">U.S. citizen parents</option>
          </select>

          <div className="text-xs text-gray-600 bg-blue-50 border border-blue-200 rounded p-2">
            <p className="font-medium mb-1">📝 Quick Guide:</p>
            <ul className="space-y-1 ml-2">
              <li><strong>Birth in the United States:</strong> You were born on U.S. soil</li>
              <li><strong>Naturalization:</strong> You personally applied for citizenship (Form N-400) and took the oath</li>
              <li><strong>U.S. citizen parents:</strong> You became a citizen through your parents. This means that either of the following applies:
                <ul className="ml-4 mt-1 text-xs">
                  <li>• Born abroad to U.S. citizen parents, OR</li>
                  <li>• Automatically became a citizen when your parents naturalized (and you were under 18)</li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      );

    case 'cert-question':
      return (
        <div className="space-y-3">
          <select
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            value={value}
            onChange={(e) => updateField(field.id, e.target.value)}
          >
            <option value="">Select...</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="text-sm text-blue-800 space-y-2">
              <p><strong>📝 What this means:</strong></p>
              <ul className="list-disc ml-4 space-y-1">
                <li><strong>"In your own name"</strong> means certificates issued directly to you (not through parents as a minor)</li>
                <li><strong>Certificate of Naturalization:</strong> Given when you become a citizen through naturalization process</li>
                <li><strong>Certificate of Citizenship:</strong> Can be obtained by those who became citizens through birth abroad to US parents, or other qualifying circumstances</li>
              </ul>

              <div className="mt-3 p-2 bg-green-100 border border-green-200 rounded">
                <p className="font-medium text-green-800">✅ It's okay if you don't have these certificates!</p>
                <p className="text-green-700 text-xs mt-1">Many US-born citizens do not have them. You can prove citizenship with your birth certificate, US passport, or other documents.</p>
              </div>

              <p className="text-xs mt-2"><strong>Note:</strong> If you answer "No", you'll need to provide other evidence of US citizenship with your application (like birth certificate or passport).</p>
            </div>
          </div>
        </div>
      );

    case 'cert-number':
      return (
        <div className="space-y-2">
          <input
            type="text"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            value={value}
            onChange={(e) => updateField(field.id, e.target.value)}
            placeholder="Enter certificate number"
          />
          <div className="text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded p-2">
            <p className="font-semibold mb-2">Where to find your certificate number:</p>
            <p className="mb-2">• <strong>Location:</strong> Top right corner in red ink (for certificates issued since 1941)</p>
            <p className="ml-4 mb-2 text-gray-500">→ For certificates issued 1906-1941: Check top left corner instead</p>
            <p className="mb-2">• <strong>Labeled as:</strong> "Certificate No." or "Certificate Number"</p>
            <p className="mb-2">• <strong>Format:</strong></p>
            <p className="ml-4 mb-1">→ Certificate of Naturalization: 8-digit alphanumeric (may start with "C")</p>
            <p className="ml-4 mb-2">→ Certificate of Citizenship: 6-8 digit alphanumeric (may start with "A" or "AA")</p>
            <p>• <strong>Don't confuse with:</strong> A-Number, Application No., or Petition No.</p>
          </div>
        </div>
      );

    case 'cert-place':
      const certPlaceValue = currentData[field.id] || {};
      const { city: certCity = '', state: certState = '', country: certCountry = 'United States' } = certPlaceValue;
      const isCertPlaceTouched = touchedFields && touchedFields[field.id];
      const showCertCityError = isCertPlaceTouched && field.required && !certCity;
      const showCertStateError = isCertPlaceTouched && field.required && certCountry === 'United States' && !certState;

      return (
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <h4 className="text-sm font-semibold text-gray-700 mb-3 border-b border-gray-300 pb-2">
            📍 Place of Issuance
          </h4>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Country <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                value={certCountry}
                onChange={(e) => updateField(field.id, { ...certPlaceValue, country: e.target.value, state: '' })}
              >
                {phoneCountries.map(c => (
                  <option key={c.code} value={c.name}>
                    {c.flag} {c.name}
                  </option>
                ))}
              </select>
              {certCountry !== 'United States' && (
                <p className="mt-1 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded p-2">
                  ⚠️ Foreign issuance is rare. Only applicable if you were naturalized or received your citizenship certificate at a US military base, embassy, or consulate abroad.
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                value={certCity}
                onChange={(e) => updateField(field.id, { ...certPlaceValue, city: e.target.value })}
                placeholder={certCountry === 'United States' ? "Enter city (e.g., Los Angeles, New York)" : "Enter city or military base name"}
              />
            </div>

            {certCountry === 'United States' && (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  State <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  value={certState}
                  onChange={(e) => updateField(field.id, { ...certPlaceValue, state: e.target.value })}
                >
                  <option value="">Select state...</option>
                  {addressFormats['United States'].states.map(stateOption => (
                    <option key={stateOption} value={stateOption}>{stateOption}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      );

    case 'height-converter':
      const heightConverterValue = currentData[field.id] || {};
      const { feet: heightFeet = '', inches: heightInches = '', unit: heightUnit = 'ft', cm: heightCm = '' } = heightConverterValue;

      const convertHeight = (inputValue, fromUnit) => {
        if (fromUnit === 'cm') {
          const totalCm = parseFloat(inputValue) || 0;
          const totalInches = totalCm / 2.54;
          const ft = Math.floor(totalInches / 12);
          const inch = Math.round(totalInches % 12);
          return { feet: ft.toString(), inches: inch.toString() };
        } else {
          const totalInches = (parseInt(heightFeet) || 0) * 12 + (parseInt(heightInches) || 0);
          const convertedCm = Math.round(totalInches * 2.54);
          return { cm: convertedCm.toString() };
        }
      };

      return (
        <div className="space-y-2">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-sm text-gray-600">Unit:</span>
            <button
              type="button"
              onClick={() => {
                if (heightUnit === 'cm' && heightCm) {
                  const converted = convertHeight(heightCm, 'cm');
                  updateField(field.id, { ...converted, unit: 'ft', cm: '' });
                } else {
                  updateField(field.id, { ...heightConverterValue, unit: 'ft' });
                }
              }}
              className={`px-3 py-1 rounded text-xs ${heightUnit === 'ft'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              ft/in
            </button>
            <button
              type="button"
              onClick={() => {
                if (heightUnit === 'ft' && (heightFeet || heightInches)) {
                  const converted = convertHeight('', 'ft');
                  updateField(field.id, { ...converted, unit: 'cm', feet: '', inches: '' });
                } else {
                  updateField(field.id, { ...heightConverterValue, unit: 'cm' });
                }
              }}
              className={`px-3 py-1 rounded text-xs ${heightUnit === 'cm'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              cm
            </button>
          </div>

          {heightUnit === 'ft' ? (
            <div className="flex items-center space-x-2">
              <input
                type="number"
                className="w-20 p-2 border rounded focus:ring-2 focus:ring-blue-500"
                value={heightFeet}
                onChange={(e) => updateField(field.id, { ...heightConverterValue, feet: e.target.value })}
                min="0"
                max="8"
                placeholder="5"
              />
              <span className="text-gray-500">ft</span>
              <input
                type="number"
                className="w-20 p-2 border rounded focus:ring-2 focus:ring-blue-500"
                value={heightInches}
                onChange={(e) => updateField(field.id, { ...heightConverterValue, inches: e.target.value })}
                min="0"
                max="11"
                placeholder="10"
              />
              <span className="text-gray-500">in</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <input
                type="number"
                className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500"
                value={heightCm}
                onChange={(e) => updateField(field.id, { ...heightConverterValue, cm: e.target.value })}
                min="0"
                step="0.1"
                placeholder="175"
              />
              <span className="text-gray-500 font-medium">cm</span>
            </div>
          )}

          {((heightUnit === 'ft' && (heightFeet || heightInches)) || (heightUnit === 'cm' && heightCm)) && (
            <div className="text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded p-2">
              {heightUnit === 'cm'
                ? `≈ ${convertHeight(heightCm, 'cm').feet}' ${convertHeight(heightCm, 'cm').inches}" (will be submitted to forms)`
                : `≈ ${convertHeight('', 'ft').cm} cm`
              }
            </div>
          )}
        </div>
      );

    case 'weight':
      const weightValue = currentData[field.id] || {};
      const { pounds: weightPounds = '', unit: weightUnit = 'lbs' } = weightValue;

      const convertWeight = (inputValue, fromUnit) => {
        const numValue = parseFloat(inputValue) || 0;
        if (fromUnit === 'kg') {
          return Math.round(numValue * 2.20462);
        } else {
          return Math.round(numValue / 2.20462);
        }
      };

      return (
        <div className="space-y-2">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-sm text-gray-600">Unit:</span>
            <button
              type="button"
              onClick={() => {
                const newUnit = weightUnit === 'lbs' ? 'kg' : 'lbs';
                const currentValue = parseFloat(weightPounds) || 0;
                const convertedValue = currentValue > 0 ? convertWeight(currentValue, weightUnit) : '';
                updateField(field.id, { pounds: convertedValue.toString(), unit: newUnit });
              }}
              className={`px-3 py-1 rounded text-xs ${weightUnit === 'lbs'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              lbs
            </button>
            <button
              type="button"
              onClick={() => {
                const newUnit = weightUnit === 'kg' ? 'lbs' : 'kg';
                const currentValue = parseFloat(weightPounds) || 0;
                const convertedValue = currentValue > 0 ? convertWeight(currentValue, weightUnit) : '';
                updateField(field.id, { pounds: convertedValue.toString(), unit: newUnit });
              }}
              className={`px-3 py-1 rounded text-xs ${weightUnit === 'kg'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              kg
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="number"
              className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500"
              value={weightPounds}
              onChange={(e) => updateField(field.id, { ...weightValue, pounds: e.target.value })}
              min="0"
              step={weightUnit === 'kg' ? '0.1' : '1'}
              placeholder={weightUnit === 'kg' ? '70.5' : '155'}
            />
            <span className="text-gray-500 font-medium">{weightUnit}</span>
          </div>

          {weightPounds && (
            <div className="text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded p-2">
              {weightUnit === 'kg'
                ? `≈ ${convertWeight(weightPounds, 'kg')} lbs (will be submitted to forms)`
                : `≈ ${convertWeight(weightPounds, 'lbs')} kg`
              }
            </div>
          )}
        </div>
      );

    case 'address': {
      const mainAddressValue = currentData[field.id] || {};

      // Check if this is the beneficiary's intended US address - auto-set to US and hide country selector
      const isIntendedUSAddress = field.id === 'beneficiaryIntendedUSAddress';

      // Auto-set country to US for intended US address if not already set
      if (isIntendedUSAddress && !mainAddressValue.country) {
        updateField(field.id, { ...mainAddressValue, country: 'United States' });
      }

      const { street: mainStreet = '', unitType: mainUnitType = '', unitNumber: mainUnitNumber = '', city: mainCity = '', state: mainState = '', zipCode: mainZipCode = '', country: mainCountry = isIntendedUSAddress ? 'United States' : '', inCareOf: mainInCareOf = '' } = mainAddressValue;
      const mainCountryFormat = addressFormats[mainCountry] || addressFormats['United States'];

      // Check if this is a required mailing address
      const isRequiredMailingAddress = field.id === 'sponsorMailingAddress' && field.required;

      return (
        <div className="space-y-3">
          {/* Hide country selector for intended US address, show for others */}
          {!isIntendedUSAddress && (
            <div>
              {isRequiredMailingAddress && (
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Country <span className="text-red-500">*</span>
                </label>
              )}
              <select
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                value={mainCountry}
                onChange={(e) => {
                  updateField(field.id, { ...mainAddressValue, country: e.target.value, state: '', zipCode: '' });
                }}
              >
                <option value="">Select country...</option>
                {phoneCountries.map(c => (
                  <option key={c.code} value={c.name}>
                    {c.flag} {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {(mainCountry || isIntendedUSAddress) && (
            <>
              {/* In Care Of Name field for mailing address */}
              {isRequiredMailingAddress && (
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    <span className="inline-flex items-center">
                      In Care Of Name (if applicable)
                      <button
                        type="button"
                        onClick={() => setShowInfoPanel(!showInfoPanel)}
                        className="ml-2 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2 py-0.5 rounded border border-blue-300 transition-colors"
                      >
                        What's this?
                      </button>
                    </span>
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    value={mainInCareOf}
                    onChange={(e) => updateField(field.id, { ...mainAddressValue, inCareOf: e.target.value })}
                    placeholder="e.g., John Smith or ABC Company"
                  />
                </div>
              )}

              <div>
                {isRequiredMailingAddress && (
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Street Address <span className="text-red-500">*</span>
                  </label>
                )}
                <input
                  type="text"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  value={mainStreet}
                  onChange={(e) => updateField(field.id, { ...mainAddressValue, street: e.target.value })}
                  placeholder="Street Number and Name"
                />
              </div>

              {/* Unit Details */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Unit Details (Optional)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 text-sm"
                    value={mainUnitType}
                    onChange={(e) => updateField(field.id, { ...mainAddressValue, unitType: e.target.value, unitNumber: e.target.value ? mainUnitNumber : '' })}
                  >
                    <option value="">Select type...</option>
                    <option value="Apt">Apt</option>
                    <option value="Ste">Ste</option>
                    <option value="Flr">Flr</option>
                  </select>
                  <input
                    type="text"
                    className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 text-sm ${!mainUnitType ? 'bg-gray-100 text-gray-400' : ''}`}
                    value={mainUnitNumber}
                    onChange={(e) => updateField(field.id, { ...mainAddressValue, unitNumber: e.target.value })}
                    placeholder="Number/ID"
                    disabled={!mainUnitType}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  {isRequiredMailingAddress && (
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      City <span className="text-red-500">*</span>
                    </label>
                  )}
                  <input
                    type="text"
                    className="p-2 border rounded focus:ring-2 focus:ring-blue-500 w-full"
                    value={mainCity}
                    onChange={(e) => updateField(field.id, { ...mainAddressValue, city: e.target.value })}
                    placeholder="City"
                  />
                </div>
                <div>
                  {isRequiredMailingAddress && (
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      {mainCountryFormat.stateLabel || 'State'} <span className="text-red-500">*</span>
                    </label>
                  )}
                  {mainCountryFormat.states ? (
                    <select
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                      value={mainState}
                      onChange={(e) => updateField(field.id, { ...mainAddressValue, state: e.target.value })}
                    >
                      <option value="">Select {mainCountryFormat.stateLabel.toLowerCase()}...</option>
                      {mainCountryFormat.states.map(stateOption => (
                        <option key={stateOption} value={stateOption}>{stateOption}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                      value={mainState}
                      onChange={(e) => updateField(field.id, { ...mainAddressValue, state: e.target.value })}
                      placeholder={`Enter ${(mainCountryFormat.stateLabel || 'state').toLowerCase()}`}
                    />
                  )}
                </div>
              </div>

              <div className="relative">
                <input
                  type="text"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  value={mainZipCode}
                  onChange={(e) => {
                    const formatted = formatPostalCode(e.target.value, mainCountry);
                    updateField(field.id, { ...mainAddressValue, zipCode: formatted });
                  }}
                  placeholder={mainCountryFormat.postalPlaceholder}
                />
                <label className="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-600">
                  {mainCountryFormat.postalLabel} <span className="text-red-500">*</span>
                </label>
              </div>

              {mainZipCode && !mainCountryFormat.postalFormat.test(mainZipCode) && (
                <div className="text-sm text-orange-600 flex items-center">
                  <span>Please enter a valid {mainCountryFormat.postalLabel.toLowerCase()} for {mainCountry}</span>
                </div>
              )}
            </>
          )}
        </div>
      );
    }

    case 'a-number': {
      const displayValue = value.replace(/^A0*/, ''); // Remove A and leading zeros for display
      const helpKey = `${field.id}_showHelp`;
      const showANumberHelp = currentData[helpKey] || false;

      return (
        <div className="space-y-2">
          <div className="flex">
            <span className="inline-flex items-center px-3 py-2 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-l font-medium">
              A
            </span>
            <input
              type="text"
              className="flex-1 p-2 border border-gray-300 rounded-r focus:ring-2 focus:ring-blue-500"
              value={displayValue}
              onChange={(e) => {
                let val = e.target.value.replace(/\D/g, '');
                if (val.length > 9) val = val.slice(0, 9);

                if (val) {
                  // Pad to 9 digits for storage but don't show padding to user
                  const paddedVal = val.padStart(9, '0');
                  updateField(field.id, `A${paddedVal}`);
                } else {
                  updateField(field.id, '');
                }
              }}
              placeholder="12345678 (7-9 digits)"
              maxLength="9"
            />
          </div>

          {/* Expandable help section */}
          <button
            type="button"
            onClick={() => updateField(helpKey, !showANumberHelp)}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            {showANumberHelp ? '▼' : '▶'} Where to find this number
          </button>

          {showANumberHelp && (
            <div className="text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded p-3 space-y-2">
              <p className="font-semibold">Where to find your A-Number (if you have one):</p>
              <ul className="list-disc ml-4 space-y-1">
                <li><strong>Green Card:</strong> Front of card under "USCIS#"</li>
                <li><strong>Work Permit (EAD):</strong> Front of card under "USCIS#"</li>
                <li><strong>Visa stamp in passport:</strong> Listed as "Registration Number"</li>
                <li><strong>USCIS notices/letters:</strong> Near top, labeled "A#" or "USCIS A#"</li>
                <li><strong>Certificate of Naturalization:</strong> Labeled "USCIS Registration No." (NOT the certificate number in red)</li>
              </ul>
              <p className="font-semibold mt-3">Format:</p>
              <p>A followed by 7-9 digits (e.g., A12345678)</p>
              <p className="font-semibold mt-3">Don't confuse with:</p>
              <ul className="list-disc ml-4 space-y-1">
                <li>Receipt numbers (3 letters + 10 digits like MSC1234567890)</li>
                <li>Green card number (13 characters on back of card)</li>
                <li>USCIS online account number (12 digits, no "A")</li>
              </ul>
              <p className="mt-3 italic text-gray-700">
                <strong>Note:</strong> Most people won't have an A-Number unless they previously had a green card, work permit, or filed for permanent residence. If you've never had U.S. immigration status, leave this blank.
              </p>
            </div>
          )}

          {displayValue && displayValue.length >= 7 && displayValue.length <= 9 && (
            <div className="text-sm text-green-600">
              ✅ Valid A-Number format
            </div>
          )}

          {displayValue && (displayValue.length < 7 || displayValue.length > 9) && (
            <div className="text-sm text-orange-600">
              A-Number should be 7-9 digits (e.g., A12345678)
            </div>
          )}
        </div>
      );
    }

    case 'uscis-account': {
      const helpKey = `${field.id}_showHelp`;
      const showUSCISAccountHelp = currentData[helpKey] || false;

      return (
        <div className="space-y-2">
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            value={value || ''}
            onChange={(e) => {
              let val = e.target.value.replace(/\D/g, ''); // Only digits
              if (val.length > 12) val = val.slice(0, 12); // Max 12 digits
              updateField(field.id, val);
            }}
            placeholder="123456789012 (12 digits)"
            maxLength="12"
          />

          {/* Expandable help section */}
          <button
            type="button"
            onClick={() => updateField(helpKey, !showUSCISAccountHelp)}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            {showUSCISAccountHelp ? '▼' : '▶'} Where to find this number
          </button>

          {showUSCISAccountHelp && (
            <div className="text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded p-3 space-y-2">
              <p className="font-semibold">Where to find it:</p>
              <ul className="list-disc ml-4 space-y-1">
                <li>Log in to <strong>myaccount.uscis.gov</strong> → Profile section (12-digit number)</li>
                <li>Top of receipt notices for online applications</li>
              </ul>
              <p className="font-semibold mt-3">Don't have one?</p>
              <p>You can create an account at <strong>myaccount.uscis.gov</strong> to track your case online and receive notifications. This field is optional.</p>
              <p className="font-semibold mt-3">Format:</p>
              <p>12 digits only (e.g., 123456789012)</p>
              <p className="font-semibold mt-3">This is different from:</p>
              <ul className="list-disc ml-4 space-y-1">
                <li>A-Number (starts with "A")</li>
                <li>Receipt number (starts with 3 letters)</li>
              </ul>
            </div>
          )}

          {value && value.length === 12 && (
            <div className="text-sm text-green-600">
              ✅ Valid format (12 digits)
            </div>
          )}

          {value && value.length > 0 && value.length !== 12 && (
            <div className="text-sm text-orange-600">
              USCIS Online Account Number should be exactly 12 digits
            </div>
          )}
        </div>
      );
    }

    default:
      // This handles 'text', 'number', and any other basic input types
      const isDefaultTouched = touchedFields && touchedFields[field.id];
      const defaultUnknownFieldId = `${field.id}Unknown`;
      const isDefaultUnknown = currentData[defaultUnknownFieldId] || false;
      const showError = isDefaultTouched && field.required && (!value || value === '') && !isDefaultUnknown;

      return (
        <div>
          <div className="flex items-center gap-3">
            <input
              type={field.type}
              className={`flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500 ${showError ? 'border-red-500' : ''
                } ${isDefaultUnknown ? 'opacity-50 pointer-events-none bg-gray-100' : ''}`}
              value={isDefaultUnknown ? '' : value}
              placeholder={field.placeholder}
              disabled={isDefaultUnknown}
              onFocus={() => {
                setTouchedFields(prev => ({ ...prev, [field.id]: false }));
              }}
              onBlur={() => {
                setTouchedFields(prev => ({ ...prev, [field.id]: true }));
              }}
              onChange={(e) => updateField(field.id, e.target.value)}
            />
            {field.allowUnknown && (
              <label className="flex items-center gap-2 text-sm text-gray-700 whitespace-nowrap cursor-pointer">
                <input
                  type="checkbox"
                  checked={isDefaultUnknown}
                  onChange={(e) => {
                    updateField(defaultUnknownFieldId, e.target.checked);
                    if (e.target.checked) {
                      updateField(field.id, '');
                    }
                  }}
                  className="w-4 h-4"
                />
                Unknown
              </label>
            )}
          </div>
          {showError && (
            <div className="mt-1 text-sm text-red-600">
              ⚠️ This field is required
            </div>
          )}
          {field.helpText && (
            <div className="mt-2 text-sm text-gray-600 bg-blue-50 border-l-4 border-blue-300 pl-3 py-2 rounded">
              <span>💡 </span>
              {field.helpText.split('\n').filter(line => line.trim() !== '').map((line, index) => {
                // Check if line contains a URL
                const urlMatch = line.match(/(https?:\/\/[^\s]+)/);
                if (urlMatch) {
                  const parts = line.split(urlMatch[0]);
                  return (
                    <div key={index} className={index > 0 ? 'mt-1' : ''}>
                      {parts[0]}
                      <a
                        href={urlMatch[0]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        {urlMatch[0]}
                      </a>
                      {parts[1]}
                    </div>
                  );
                }
                return (
                  <div key={index} className={index > 0 ? 'mt-1' : ''}>
                    {line}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      );
  }
};

export default FieldRenderer;
