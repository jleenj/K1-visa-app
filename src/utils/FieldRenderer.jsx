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
import Section1_7 from '../components/sections/Section1_7';
import Section1_8 from '../components/sections/Section1_8';
import Section1_9 from '../components/sections/Section1_9';

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
// HELPER FUNCTION FOR TIMELINE COVERAGE
// ========================================

// Calculate timeline coverage with support for overlapping periods
const calculateTimelineCoverage = (entries) => {
  if (entries.length === 0) return { covered: 0, total: 5 * 365, gaps: [] };

  // Normalize dates to midnight to avoid timezone/time issues in day calculations
  const fiveYearsAgo = new Date();
  fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);
  fiveYearsAgo.setHours(0, 0, 0, 0); // Set to midnight

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to midnight

  // Create a day-by-day coverage map
  const totalDays = Math.ceil((today.getTime() - fiveYearsAgo.getTime()) / (1000 * 60 * 60 * 24));
  const coverage = new Array(totalDays).fill(false);

  // Mark covered days for each entry
  entries.forEach((entry) => {
    if (!entry.startDate) return;

    // Create dates in local timezone to avoid UTC/timezone shift issues
    const startParts = entry.startDate.split('-');
    const entryStartDate = new Date(parseInt(startParts[0]), parseInt(startParts[1]) - 1, parseInt(startParts[2]));

    let entryEndDate;
    if (entry.isCurrent || !entry.endDate) {
      entryEndDate = today;
    } else {
      const endParts = entry.endDate.split('-');
      entryEndDate = new Date(parseInt(endParts[0]), parseInt(endParts[1]) - 1, parseInt(endParts[2]));
    }

    // Skip if dates are invalid
    if (isNaN(entryStartDate.getTime()) || isNaN(entryEndDate.getTime())) {
      return;
    }

    // Mark each day covered by this entry
    const startDayIndex = Math.floor((entryStartDate.getTime() - fiveYearsAgo.getTime()) / (1000 * 60 * 60 * 24));
    const endDayIndex = Math.floor((entryEndDate.getTime() - fiveYearsAgo.getTime()) / (1000 * 60 * 60 * 24));

    for (let dayIndex = Math.max(0, startDayIndex); dayIndex <= Math.min(totalDays - 1, endDayIndex); dayIndex++) {
      coverage[dayIndex] = true;
    }
  });

  // Find gaps (consecutive uncovered days)
  const gaps = [];
  let gapStart = null;

  for (let dayIndex = 0; dayIndex < totalDays; dayIndex++) {
    if (!coverage[dayIndex]) {
      if (gapStart === null) {
        gapStart = dayIndex;
      }
    } else {
      if (gapStart !== null) {
        // End of a gap
        const gapDays = dayIndex - gapStart;
        // Only include gaps that are actually meaningful
        if (gapDays > 0) {
          const gapStartDate = new Date(fiveYearsAgo.getTime() + gapStart * 24 * 60 * 60 * 1000);
          const gapEndDate = new Date(fiveYearsAgo.getTime() + (dayIndex - 1) * 24 * 60 * 60 * 1000);
          gaps.push({
            startDate: gapStartDate.toISOString().split('T')[0],
            endDate: gapEndDate.toISOString().split('T')[0],
            days: gapDays
          });
        }
        gapStart = null;
      }
    }
  }

  // Handle gap extending to the end
  if (gapStart !== null) {
    const gapDays = totalDays - gapStart;
    const gapStartDate = new Date(fiveYearsAgo.getTime() + gapStart * 24 * 60 * 60 * 1000);
    gaps.push({
      startDate: gapStartDate.toISOString().split('T')[0],
      endDate: today.toISOString().split('T')[0],
      days: gapDays
    });
  }

  const coveredDays = coverage.filter(day => day).length;
  return { covered: coveredDays, total: totalDays, gaps };
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

    case 'info-panel':
      return (
        <div className="bg-blue-50 border-l-4 border-blue-300 pl-4 py-3 rounded mb-4">
          <div className="flex items-start">
            <div className="mr-3 mt-0.5">
              <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">i</span>
              </div>
            </div>
            <div>
              {field.label.split('\n').map((line, index) => (
                <p key={index} className={`text-blue-800 text-sm ${index === 0 ? 'font-medium' : ''} ${index > 0 ? 'mt-2' : ''}`}>
                  {line}
                </p>
              ))}
            </div>
          </div>
        </div>
      );

    case 'section-header':
      return (
        <div className="border-t-2 border-blue-200 pt-6 mt-8 mb-4 first:border-t-0 first:pt-0 first:mt-0">
          <h4 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
            {field.label}
          </h4>
        </div>
      );

    case 'section1_7_component':
      return (
        <Section1_7
          currentData={currentData}
          updateField={updateField}
        />
      );

    case 'section1_8_component':
      return (
        <Section1_8
          currentData={currentData}
          updateField={updateField}
        />
      );

    case 'section1_9_component':
      return (
        <Section1_9
          currentData={currentData}
          updateField={updateField}
        />
      );

    case 'country': {
      // Filter out United States for beneficiary birth country and citizenship (K-1 beneficiary must be foreign national)
      const filteredCountries = (field.id === 'beneficiaryBirthCountry' || field.id === 'beneficiaryCitizenship')
        ? phoneCountries.filter(c => c.name !== 'United States')
        : phoneCountries;

      const countryUnknownFieldId = `${field.id}Unknown`;
      const isCountryUnknown = currentData[countryUnknownFieldId] || false;

      return (
        <div className="flex items-center gap-3">
          <select
            className={`flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500 ${isCountryUnknown ? 'opacity-50 pointer-events-none bg-gray-100' : ''}`}
            value={isCountryUnknown ? '' : value}
            disabled={isCountryUnknown}
            onChange={(e) => updateField(field.id, e.target.value)}
          >
            <option value="">Select country...</option>
            {filteredCountries.map(country => (
              <option key={country.code} value={country.name}>
                {country.flag} {country.name}
              </option>
            ))}
          </select>
          {field.allowUnknown && (
            <label className="flex items-center gap-2 text-sm text-gray-700 whitespace-nowrap cursor-pointer">
              <input
                type="checkbox"
                checked={isCountryUnknown}
                onChange={(e) => {
                  updateField(countryUnknownFieldId, e.target.checked);
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
      );
    }

    case 'native-alphabet-name':
      const nativeNameValue = currentData[field.id] || {};

      return (
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded text-sm">
            <p className="text-blue-800">
              <strong>ℹ️ When to use this field:</strong> Only if [BeneficiaryFirstName]'s name uses a non-Latin alphabet
              (Arabic, Chinese, Cyrillic, Hebrew, Japanese, Korean, Thai, etc.). If the name uses Latin letters (A-Z), leave this blank.
            </p>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Family Name (Last Name) in Native Alphabet</label>
              <input
                type="text"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                value={nativeNameValue.lastName || ''}
                onChange={(e) => updateField(field.id, { ...nativeNameValue, lastName: e.target.value })}
                placeholder="Enter in native script"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Given Name (First Name) in Native Alphabet</label>
              <input
                type="text"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                value={nativeNameValue.firstName || ''}
                onChange={(e) => updateField(field.id, { ...nativeNameValue, firstName: e.target.value })}
                placeholder="Enter in native script"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Middle Name in Native Alphabet (if applicable)</label>
              <input
                type="text"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                value={nativeNameValue.middleName || ''}
                onChange={(e) => updateField(field.id, { ...nativeNameValue, middleName: e.target.value })}
                placeholder="Enter in native script (optional)"
              />
            </div>
          </div>
        </div>
      );

    case 'native-alphabet-address': {
      const nativeAddressValue = currentData[field.id] || {};
      const { street: nativeStreet = '', unitType: nativeUnitType = '', unitNumber: nativeUnitNumber = '', city: nativeCity = '', state: nativeState = '', zipCode: nativeZipCode = '', country: nativeCountry = '' } = nativeAddressValue;
      const nativeCountryFormat = addressFormats[nativeCountry] || addressFormats['United States'];

      return (
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded text-sm">
            <p className="text-blue-800">
              <strong>ℹ️ When to use this field:</strong> Only if [BeneficiaryFirstName]'s address uses a non-Latin alphabet
              (Arabic, Chinese, Cyrillic, Hebrew, Japanese, Korean, Thai, etc.). Provide the complete address in native script.
            </p>
          </div>
          <div className="space-y-3">
            {/* Country Selection - Only non-Latin alphabet countries */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Country</label>
              <select
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                value={nativeCountry}
                onChange={(e) => {
                  updateField(field.id, { ...nativeAddressValue, country: e.target.value, state: '', zipCode: '' });
                }}
              >
                <option value="">Select country...</option>
                <option value="China">🇨🇳 China</option>
                <option value="Russia">🇷🇺 Russia</option>
                <option value="Thailand">🇹🇭 Thailand</option>
                <option value="Ukraine">🇺🇦 Ukraine</option>
                <option value="Vietnam">🇻🇳 Vietnam</option>
              </select>
            </div>

            {nativeCountry && (
              <>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Street Address (in Native Alphabet)
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    value={nativeStreet}
                    onChange={(e) => updateField(field.id, { ...nativeAddressValue, street: e.target.value })}
                    placeholder="Enter street address in native script"
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
                      value={nativeUnitType}
                      onChange={(e) => updateField(field.id, { ...nativeAddressValue, unitType: e.target.value, unitNumber: e.target.value ? nativeUnitNumber : '' })}
                    >
                      <option value="">Select type...</option>
                      <option value="Apt">Apt</option>
                      <option value="Ste">Ste</option>
                      <option value="Flr">Flr</option>
                    </select>
                    <input
                      type="text"
                      className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 text-sm ${!nativeUnitType ? 'bg-gray-100 text-gray-400' : ''}`}
                      value={nativeUnitNumber}
                      onChange={(e) => updateField(field.id, { ...nativeAddressValue, unitNumber: e.target.value })}
                      placeholder="Number/ID"
                      disabled={!nativeUnitType}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      City (in Native Alphabet)
                    </label>
                    <input
                      type="text"
                      className="p-2 border rounded focus:ring-2 focus:ring-blue-500 w-full"
                      value={nativeCity}
                      onChange={(e) => updateField(field.id, { ...nativeAddressValue, city: e.target.value })}
                      placeholder="Enter in native script"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      {nativeCountryFormat.stateLabel || 'State'} (in Native Alphabet)
                      {nativeCountryFormat.stateRequired && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    {nativeCountryFormat.states ? (
                      <select
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                        value={nativeState}
                        onChange={(e) => updateField(field.id, { ...nativeAddressValue, state: e.target.value })}
                      >
                        <option value="">Select {nativeCountryFormat.stateLabel.toLowerCase()}...</option>
                        {nativeCountryFormat.states.map(stateOption => (
                          <option key={stateOption} value={stateOption}>{stateOption}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 ${!nativeCountryFormat.stateRequired && nativeCountry !== 'United States' && nativeCountry !== 'Canada' ? 'bg-gray-50' : ''}`}
                        value={nativeState}
                        onChange={(e) => updateField(field.id, { ...nativeAddressValue, state: e.target.value })}
                        placeholder={`Enter in native script`}
                        disabled={!nativeCountryFormat.stateRequired && nativeCountry !== 'United States' && nativeCountry !== 'Canada'}
                      />
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    {nativeCountryFormat.postalLabel || 'Postal Code'} (in Native Alphabet)
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    value={nativeZipCode}
                    onChange={(e) => {
                      const formatted = formatPostalCode(e.target.value, nativeCountry);
                      updateField(field.id, { ...nativeAddressValue, zipCode: formatted });
                    }}
                    placeholder={nativeCountryFormat.postalPlaceholder || 'Enter postal code'}
                  />
                  {nativeZipCode && !nativeCountryFormat.postalFormat.test(nativeZipCode) && (
                    <div className="text-sm text-orange-600 flex items-center mt-1">
                      <span>Please enter a valid {nativeCountryFormat.postalLabel.toLowerCase()} for {nativeCountry}</span>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      );
    }

    case 'address-with-careof': {
      const addressWithCareOfValue = currentData[field.id] || {};
      const { street: addressWithCareOfStreet = '', unitType: addressWithCareOfUnitType = '', unitNumber: addressWithCareOfUnitNumber = '', city: addressWithCareOfCity = '', state: addressWithCareOfState = '', zipCode: addressWithCareOfZipCode = '', country: addressWithCareOfCountry = '', careOf: addressWithCareOfCareOf = '' } = addressWithCareOfValue;
      const addressWithCareOfCountryFormat = addressFormats[addressWithCareOfCountry] || addressFormats['United States'];

      return (
        <div className="space-y-3">
          {/* C/O Field */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Care Of (c/o) - Optional
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              value={addressWithCareOfCareOf}
              onChange={(e) => updateField(field.id, { ...addressWithCareOfValue, careOf: e.target.value })}
              placeholder="Name of person or organization (if applicable)"
            />
            <p className="text-xs text-gray-500 mt-1">
              Only use this if mail is being sent to an address in care of someone else (e.g., "c/o John Smith" or "c/o ABC Company")
            </p>
          </div>

          {/* Country Selection */}
          <select
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            value={addressWithCareOfCountry}
            onChange={(e) => {
              updateField(field.id, { ...addressWithCareOfValue, country: e.target.value, state: '', zipCode: '' });
            }}
          >
            <option value="">Select country...</option>
            {phoneCountries.map(c => (
              <option key={c.code} value={c.name}>
                {c.flag} {c.name}
              </option>
            ))}
          </select>

          {addressWithCareOfCountry && (
            <>
              {/* Street Address */}
              <input
                type="text"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                value={addressWithCareOfStreet}
                onChange={(e) => updateField(field.id, { ...addressWithCareOfValue, street: e.target.value })}
                placeholder="Street Number and Name"
              />

              {/* Unit Details */}
              <div className="grid grid-cols-2 gap-2">
                <select
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 text-sm"
                  value={addressWithCareOfUnitType}
                  onChange={(e) => updateField(field.id, { ...addressWithCareOfValue, unitType: e.target.value, unitNumber: e.target.value ? addressWithCareOfUnitNumber : '' })}
                >
                  <option value="">Unit type (optional)</option>
                  <option value="Apt">Apt</option>
                  <option value="Ste">Ste</option>
                  <option value="Flr">Flr</option>
                </select>
                <input
                  type="text"
                  className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 text-sm ${!addressWithCareOfUnitType ? 'bg-gray-100 text-gray-400' : ''}`}
                  value={addressWithCareOfUnitNumber}
                  onChange={(e) => updateField(field.id, { ...addressWithCareOfValue, unitNumber: e.target.value })}
                  placeholder="Number/ID"
                  disabled={!addressWithCareOfUnitType}
                />
              </div>

              {/* City and State */}
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  className="p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  value={addressWithCareOfCity}
                  onChange={(e) => updateField(field.id, { ...addressWithCareOfValue, city: e.target.value })}
                  placeholder="City"
                />
                {addressWithCareOfCountryFormat.states ? (
                  <select
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    value={addressWithCareOfState}
                    onChange={(e) => updateField(field.id, { ...addressWithCareOfValue, state: e.target.value })}
                  >
                    <option value="">Select {addressWithCareOfCountryFormat.stateLabel.toLowerCase()}...</option>
                    {addressWithCareOfCountryFormat.states.map(stateOption => (
                      <option key={stateOption} value={stateOption}>{stateOption}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    value={addressWithCareOfState}
                    onChange={(e) => updateField(field.id, { ...addressWithCareOfValue, state: e.target.value })}
                    placeholder={addressWithCareOfCountryFormat.stateLabel || 'State/Province'}
                  />
                )}
              </div>

              {/* Postal Code */}
              <input
                type="text"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                value={addressWithCareOfZipCode}
                onChange={(e) => {
                  const formatted = formatPostalCode(e.target.value, addressWithCareOfCountry);
                  updateField(field.id, { ...addressWithCareOfValue, zipCode: formatted });
                }}
                placeholder={addressWithCareOfCountryFormat.postalPlaceholder}
              />
              {addressWithCareOfZipCode && !addressWithCareOfCountryFormat.postalFormat.test(addressWithCareOfZipCode) && (
                <div className="text-sm text-orange-600 flex items-center mt-1">
                  <span>Please enter a valid {addressWithCareOfCountryFormat.postalLabel.toLowerCase()} for {addressWithCareOfCountry}</span>
                </div>
              )}
            </>
          )}
        </div>
      );
    }

    case 'beneficiary-currently-in-us-warning': {
      const beneficiaryCurrentlyInUS = currentData['beneficiaryCurrentlyInUS'] || '';

      if (beneficiaryCurrentlyInUS !== 'Yes') {
        return null;
      }

      return (
        <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <span className="text-amber-600 text-lg">⚠️</span>
            <div>
              <h4 className="font-medium text-amber-800 mb-2">Important: Beneficiary Currently in the U.S.</h4>
              <p className="text-sm text-amber-700 mb-3">
                Since [BeneficiaryFirstName] is currently in the United States, there are some important considerations:
              </p>
              <ul className="list-disc ml-5 text-sm text-amber-700 space-y-1">
                <li><strong>Maintain legal status:</strong> [BeneficiaryFirstName] must maintain legal immigration status throughout the K-1 process</li>
                <li><strong>Consular processing:</strong> [BeneficiaryFirstName] will need to return to their home country for the visa interview</li>
                <li><strong>Travel considerations:</strong> Leaving the U.S. before the interview may affect pending applications</li>
              </ul>
              <p className="text-sm text-amber-700 mt-3">
                <strong>We recommend consulting with an immigration attorney</strong> to ensure [BeneficiaryFirstName]'s situation is handled correctly.
              </p>
            </div>
          </div>
        </div>
      );
    }

    case 'beneficiary-married-eligibility-check': {
      const beneficiaryMaritalStatus = currentData['beneficiaryMaritalStatus'] || '';
      const beneficiaryFirstName = currentData['beneficiaryFirstName'] || '[BeneficiaryFirstName]';
      const sponsorFirstName = currentData['sponsorFirstName'] || '[SponsorFirstName]';

      if (beneficiaryMaritalStatus !== 'Married') {
        return null;
      }

      return (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <span className="text-red-600 text-xl">🚫</span>
            <div>
              <h4 className="font-medium text-red-800 mb-2">K-1 Visa Not Available</h4>
              <p className="text-sm text-red-700 mb-3">
                K-1 visas are only available for engaged couples who are both legally free to marry. Since {beneficiaryFirstName} is currently married, they cannot apply for a K-1 visa.
              </p>
              <p className="text-sm text-red-700 mb-3">
                <strong>What to do:</strong>
              </p>
              <ul className="list-disc ml-5 text-sm text-red-700 space-y-1 mb-3">
                <li>If {beneficiaryFirstName} is in the process of getting divorced, wait until the divorce is finalized before applying</li>
                <li>If {beneficiaryFirstName} and {sponsorFirstName} are already married, you may qualify for a spousal visa instead</li>
              </ul>
              <button
                className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors"
                onClick={() => {
                  console.log('TODO: Route to support for married beneficiary scenario');
                }}
              >
                Contact Support for Guidance
              </button>
            </div>
          </div>
        </div>
      );
    }

    case 'children-list': {
      const childrenCount = parseInt(currentData['beneficiaryChildren'] || '0');

      if (childrenCount === 0) return null;

      const childrenValue = currentData[field.id] || [];

      return (
        <div className="space-y-4">
          {[...Array(childrenCount)].map((_, index) => {
            const child = childrenValue[index] || {};
            return (
              <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <h4 className="font-medium text-gray-800 mb-3">Child #{index + 1}</h4>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      className="p-2 border rounded focus:ring-2 focus:ring-blue-500"
                      value={child.lastName || ''}
                      onChange={(e) => {
                        const newChildren = [...childrenValue];
                        newChildren[index] = { ...child, lastName: e.target.value };
                        updateField(field.id, newChildren);
                      }}
                      placeholder="Last Name"
                    />
                    <input
                      type="text"
                      className="p-2 border rounded focus:ring-2 focus:ring-blue-500"
                      value={child.firstName || ''}
                      onChange={(e) => {
                        const newChildren = [...childrenValue];
                        newChildren[index] = { ...child, firstName: e.target.value };
                        updateField(field.id, newChildren);
                      }}
                      placeholder="First Name"
                    />
                    <input
                      type="text"
                      className="p-2 border rounded focus:ring-2 focus:ring-blue-500"
                      value={child.middleName || ''}
                      onChange={(e) => {
                        const newChildren = [...childrenValue];
                        newChildren[index] = { ...child, middleName: e.target.value };
                        updateField(field.id, newChildren);
                      }}
                      placeholder="Middle Name"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Date of Birth</label>
                      <input
                        type="date"
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                        value={child.dob || ''}
                        onChange={(e) => {
                          const newChildren = [...childrenValue];
                          newChildren[index] = { ...child, dob: e.target.value };
                          updateField(field.id, newChildren);
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Country of Birth</label>
                      <select
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                        value={child.birthCountry || ''}
                        onChange={(e) => {
                          const newChildren = [...childrenValue];
                          newChildren[index] = { ...child, birthCountry: e.target.value };
                          updateField(field.id, newChildren);
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
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    case 'states-countries-list':
      const sponsorDOBForList = currentData['sponsorDOB'] || '';

      // If no DOB provided, don't show anything
      if (!sponsorDOBForList) {
        return null;
      }

      // Calculate age
      let userAge = null;
      const today = new Date();
      const birthDate = new Date(sponsorDOBForList);
      userAge = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        userAge--;
      }

      // If 23 or younger, the 5-year history already covers since age 18
      if (userAge <= 23) {
        return (
          <div className="text-sm text-green-600 bg-green-50 border border-green-200 rounded p-3">
            <p className="font-medium">✅ Your 5-year address history already covers all places since age 18</p>
            <p className="text-xs mt-1">No additional information needed for this section.</p>
          </div>
        );
      }

      // Auto-extract states/countries from existing address data
      const extractedPlaces = new Set();

      // From current physical address (could be mailing or separate physical)
      const physicalAddr = currentData['sponsorMailingDifferent'] === 'Yes'
        ? (currentData['sponsorCurrentAddress'] || {})
        : (currentData['sponsorMailingAddress'] || {});

      if (physicalAddr.country === 'United States' && physicalAddr.state) {
        extractedPlaces.add(`${physicalAddr.state}, USA`);
      } else if (physicalAddr.country && physicalAddr.country !== 'United States') {
        extractedPlaces.add(physicalAddr.country);
      }

      // From address history
      const addrHistory = currentData['sponsorAddressHistory'] || [];
      addrHistory.forEach((addr) => {
        if (addr.country === 'United States' && addr.state) {
          extractedPlaces.add(`${addr.state}, USA`);
        } else if (addr.country && addr.country !== 'United States') {
          extractedPlaces.add(addr.country);
        }
      });

      // From mailing address if different
      if (currentData['sponsorMailingDifferent'] === 'Yes') {
        const mailingAddr = currentData['sponsorMailingAddress'] || {};
        if (mailingAddr.country === 'United States' && mailingAddr.state) {
          extractedPlaces.add(`${mailingAddr.state}, USA`);
        } else if (mailingAddr.country && mailingAddr.country !== 'United States') {
          extractedPlaces.add(mailingAddr.country);
        }
      }

      // User's additional places (from before the 5-year period)
      const additionalPlaces = currentData[field.id] || [];

      // Track whether user needs to add earlier places
      const showEarlierPlaces = currentData[`${field.id}_answer`] === 'yes';

      // Calculate date ranges
      const currentYear = today.getFullYear();
      const currentMonth = today.getMonth() + 1;
      const currentDay = today.getDate();

      // Date when user turned 18
      const turned18Date = new Date(birthDate);
      turned18Date.setFullYear(birthDate.getFullYear() + 18);
      const turned18DateStr = `${turned18Date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`;

      // Date 5 years ago
      const fiveYearsAgoDate = new Date(today);
      fiveYearsAgoDate.setFullYear(currentYear - 5);
      const fiveYearsAgoStr = `${fiveYearsAgoDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`;

      // Current date string
      const currentDateStr = `${today.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`;

      return (
        <div className="space-y-4">
          {/* Show extracted places */}
          {extractedPlaces.size > 0 && (
            <div className="bg-green-50 border border-green-200 rounded p-3">
              <p className="text-sm font-medium text-green-800 mb-2">
                ✅ We have these locations from your addresses:
              </p>
              <div className="space-y-1">
                {Array.from(extractedPlaces).map((place: any, index) => (
                  <div key={index} className="text-sm text-green-700">
                    {`• ${place} (${fiveYearsAgoStr} - ${currentDateStr})`}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Simple Yes/No Question */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700">
              Did you live anywhere else since age 18? ({turned18DateStr} - {fiveYearsAgoStr})
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  updateField(`${field.id}_answer`, 'yes');
                }}
                className={`px-4 py-2 rounded border transition-colors ${showEarlierPlaces
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => {
                  updateField(`${field.id}_answer`, 'no');
                  updateField(field.id, []); // Clear any added places
                }}
                className={`px-4 py-2 rounded border transition-colors ${!showEarlierPlaces && currentData[`${field.id}_answer`] === 'no'
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
              >
                No - same places
              </button>
            </div>
          </div>

          {/* Only show fields if they answered Yes */}
          {showEarlierPlaces && (
            <div className="space-y-3 border-l-4 border-blue-400 pl-4">
              <p className="text-sm text-gray-600">
                Add <strong>ALL</strong> states and countries where you lived since age 18 ({turned18DateStr} - {fiveYearsAgoStr}):
              </p>

              {additionalPlaces.map((place, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <select
                    className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    value={place.type || ''}
                    onChange={(e) => {
                      const newPlaces = [...additionalPlaces];
                      newPlaces[index] = { ...place, type: e.target.value, location: '' };
                      updateField(field.id, newPlaces);
                    }}
                  >
                    <option value="">Select type...</option>
                    <option value="us-state">U.S. State</option>
                    <option value="foreign-country">Foreign Country</option>
                  </select>

                  {place.type === 'us-state' && (
                    <select
                      className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500"
                      value={place.location || ''}
                      onChange={(e) => {
                        const newPlaces = [...additionalPlaces];
                        newPlaces[index] = { ...place, location: e.target.value };
                        updateField(field.id, newPlaces);
                      }}
                    >
                      <option value="">Select state...</option>
                      {addressFormats['United States'].states.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  )}

                  {place.type === 'foreign-country' && (
                    <select
                      className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500"
                      value={place.location || ''}
                      onChange={(e) => {
                        const newPlaces = [...additionalPlaces];
                        newPlaces[index] = { ...place, location: e.target.value };
                        updateField(field.id, newPlaces);
                      }}
                    >
                      <option value="">Select country...</option>
                      {phoneCountries.map(c => (
                        <option key={c.code} value={c.name}>
                          {c.flag} {c.name}
                        </option>
                      ))}
                    </select>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      const newPlaces = additionalPlaces.filter((_, i) => i !== index);
                      updateField(field.id, newPlaces);
                    }}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => {
                  updateField(field.id, [...additionalPlaces, { type: '', location: '' }]);
                }}
                className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-800 transition-colors"
              >
                + Add State or Country
              </button>
            </div>
          )}
        </div>
      );

    case 'conditional-address-history': {
      // Determine which move-in date field to check based on field ID
      const moveInDateField = field.id.includes('beneficiary') ? 'beneficiaryMoveInDate' : 'sponsorMoveInDate';
      const moveInDate = currentData[moveInDateField] || '';

      // If no move-in date is entered yet, don't show anything
      if (!moveInDate) {
        return null;
      }

      // Check if address history is needed
      const fiveYearsAgo = new Date();
      fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);
      const needsAddressHistory = new Date(moveInDate) > fiveYearsAgo;

      if (!needsAddressHistory) {
        return (
          <div className="text-sm text-green-600 bg-green-50 border border-green-200 rounded p-3">
            <p className="font-medium">✅ No Address History Needed</p>
            <p>You've lived at your current address for 5+ years.</p>
          </div>
        );
      }

      const addressHistoryValue = currentData[field.id] || [];
      const fiveYearsAgoString = fiveYearsAgo.toISOString().split('T')[0];

      // Check if we have complete 5-year coverage
      const lastAddress = addressHistoryValue[addressHistoryValue.length - 1];
      const hasCompleteCoverage = lastAddress && lastAddress.dateFrom &&
        new Date(lastAddress.dateFrom) <= fiveYearsAgo;

      // Calculate coverage gap if any
      let coverageGap = null;
      if (addressHistoryValue.length > 0 && lastAddress && lastAddress.dateFrom) {
        const lastDate = new Date(lastAddress.dateFrom);
        if (lastDate > fiveYearsAgo) {
          const gapMonths = Math.ceil((lastDate - fiveYearsAgo) / (1000 * 60 * 60 * 24 * 30));
          coverageGap = gapMonths;
        }
      }

      return (
        <div className="space-y-4">
          <div className="text-sm text-gray-600 bg-blue-50 border border-blue-200 rounded p-3">
            <p className="font-medium text-blue-800 mb-1">📍 Address History Requirements</p>
            <p>You must provide all addresses where you've lived from <strong>{fiveYearsAgoString}</strong> to <strong>{moveInDate}</strong>.</p>
            <p className="text-xs mt-1">Each address must connect directly to the next with no gaps in dates.</p>
          </div>

          {addressHistoryValue.map((address, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-800">
                  Previous Address #{index + 1}
                  {index === 0 && <span className="text-xs text-gray-500 ml-2">(Most recent)</span>}
                </h4>
                <button
                  type="button"
                  onClick={() => {
                    const newHistory = addressHistoryValue.filter((_, i) => i !== index);
                    updateField(field.id, newHistory);
                  }}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>

              <div className="space-y-3">
                {/* Date Range */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Date From
                      {index === addressHistoryValue.length - 1 &&
                        <span className="text-gray-500 ml-1">(oldest)</span>}
                    </label>
                    <input
                      type="date"
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                      value={address.dateFrom || ''}
                      max={index === 0 ? moveInDate : (addressHistoryValue[index - 1]?.dateFrom || moveInDate)}
                      min={fiveYearsAgoString}
                      onChange={(e) => {
                        const newHistory = [...addressHistoryValue];
                        newHistory[index] = { ...address, dateFrom: e.target.value };

                        // Auto-update the previous address's dateTo
                        if (index < addressHistoryValue.length - 1) {
                          newHistory[index + 1].dateTo = e.target.value;
                        }

                        updateField(field.id, newHistory);
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Date To
                      {index === 0 && <span className="text-gray-500 ml-1">(must match move-in date)</span>}
                    </label>
                    <input
                      type="date"
                      className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
                      value={address.dateTo || (index === 0 ? moveInDate : '')}
                      readOnly
                    />
                  </div>
                </div>

                {/* Date validation messages */}
                {address.dateFrom && address.dateTo && new Date(address.dateFrom) >= new Date(address.dateTo) && (
                  <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded p-2">
                    ⚠️ "Date From" must be before "Date To"
                  </div>
                )}

                {/* Country Selection */}
                <select
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  value={address.country || ''}
                  onChange={(e) => {
                    const newHistory = [...addressHistoryValue];
                    newHistory[index] = { ...address, country: e.target.value, state: '', zipCode: '' };
                    updateField(field.id, newHistory);
                  }}
                >
                  <option value="">Select country...</option>
                  {phoneCountries.map(c => (
                    <option key={c.code} value={c.name}>
                      {c.flag} {c.name}
                    </option>
                  ))}
                </select>

                {address.country && (
                  <>
                    {/* Street Address */}
                    <input
                      type="text"
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                      value={address.street || ''}
                      onChange={(e) => {
                        const newHistory = [...addressHistoryValue];
                        newHistory[index] = { ...address, street: e.target.value };
                        updateField(field.id, newHistory);
                      }}
                      placeholder="Street Number and Name"
                    />

                    {/* City and State/Province */}
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        className="p-2 border rounded focus:ring-2 focus:ring-blue-500"
                        value={address.city || ''}
                        onChange={(e) => {
                          const newHistory = [...addressHistoryValue];
                          newHistory[index] = { ...address, city: e.target.value };
                          updateField(field.id, newHistory);
                        }}
                        placeholder="City"
                      />

                      {/* State field - US only */}
                      {address.country === 'United States' && (() => {
                        const countryFormat = addressFormats[address.country];
                        return (
                          <select
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                            value={address.state || ''}
                            onChange={(e) => {
                              const newHistory = [...addressHistoryValue];
                              newHistory[index] = { ...address, state: e.target.value };
                              updateField(field.id, newHistory);
                            }}
                          >
                            <option value="">Select state...</option>
                            {countryFormat.states.map(stateOption => (
                              <option key={stateOption} value={stateOption}>{stateOption}</option>
                            ))}
                          </select>
                        );
                      })()}

                      {/* Province/Region field - non-US only */}
                      {address.country !== 'United States' && (() => {
                        const countryFormat = addressFormats[address.country] || {};
                        if (countryFormat.provinceNA) return null; // Hide for small countries
                        return countryFormat.states ? (
                          <select
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                            value={address.state || ''}
                            onChange={(e) => {
                              const newHistory = [...addressHistoryValue];
                              newHistory[index] = { ...address, state: e.target.value };
                              updateField(field.id, newHistory);
                            }}
                          >
                            <option value="">Select {(countryFormat.provinceLabel || 'province').toLowerCase()}...</option>
                            {countryFormat.states.map(stateOption => (
                              <option key={stateOption} value={stateOption}>{stateOption}</option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type="text"
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                            value={address.state || ''}
                            onChange={(e) => {
                              const newHistory = [...addressHistoryValue];
                              newHistory[index] = { ...address, state: e.target.value };
                              updateField(field.id, newHistory);
                            }}
                            placeholder={`Enter ${(countryFormat.provinceLabel || 'province').toLowerCase()}`}
                          />
                        );
                      })()}
                    </div>

                    {/* Postal Code */}
                    <input
                      type="text"
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                      value={address.zipCode || ''}
                      onChange={(e) => {
                        const newHistory = [...addressHistoryValue];
                        const formatted = formatPostalCode(e.target.value, address.country);
                        newHistory[index] = { ...address, zipCode: formatted };
                        updateField(field.id, newHistory);
                      }}
                      placeholder={(() => {
                        const countryFormat = addressFormats[address.country] || addressFormats['United States'];
                        return countryFormat.postalPlaceholder;
                      })()}
                    />
                  </>
                )}
              </div>
            </div>
          ))}

          {/* Add Address Button - only show if history is incomplete */}
          {!hasCompleteCoverage && (
            <button
              type="button"
              onClick={() => {
                const newAddress = {
                  dateFrom: '',
                  dateTo: addressHistoryValue.length === 0 ? moveInDate : (addressHistoryValue[addressHistoryValue.length - 1]?.dateFrom || ''),
                  country: '',
                  street: '',
                  city: '',
                  state: '',
                  zipCode: ''
                };
                updateField(field.id, [...addressHistoryValue, newAddress]);
              }}
              className="w-full p-3 border-2 border-dashed border-blue-300 rounded-lg text-blue-600 hover:border-blue-400 hover:text-blue-800 transition-colors bg-blue-50 hover:bg-blue-100"
            >
              + Add Previous Address
            </button>
          )}

          {/* Coverage Status Messages */}
          {!hasCompleteCoverage && addressHistoryValue.length > 0 && (
            <div className="text-sm text-orange-600 bg-orange-50 border border-orange-200 rounded p-3">
              <p className="font-medium">⚠️ Address History Incomplete</p>
              {coverageGap && (
                <p>You need approximately {coverageGap} more months of address history to reach the 5-year requirement.</p>
              )}
              <p className="text-xs mt-1">Your oldest address must start on or before {fiveYearsAgoString}.</p>
            </div>
          )}

          {hasCompleteCoverage && (
            <div className="text-sm text-green-600 bg-green-50 border border-green-200 rounded p-3">
              <p className="font-medium">✅ 5-Year Address History Complete</p>
              <p>Your address history covers the full required period.</p>
            </div>
          )}

          {addressHistoryValue.length === 0 && (
            <p className="text-sm text-gray-500 italic text-center py-4">
              Click "Add Previous Address" to start adding your address history.
            </p>
          )}
        </div>
      );
    }

    case 'marriage-history': {
      // Determine which previousMarriages field to check based on field ID
      const isBeneficiaryMarriageHistory = field.id.includes('beneficiary');
      const previousMarriagesField = isBeneficiaryMarriageHistory
        ? 'beneficiaryPreviousMarriages'
        : 'sponsorPreviousMarriages';
      const previousMarriagesValue = currentData[previousMarriagesField] || '0';
      let marriageCount = parseInt(previousMarriagesValue) || 0;

      // Handle "5+" option - start with 5 marriages and allow adding more
      if (previousMarriagesValue === '5+') {
        marriageCount = 5;
      }

      const marriageHistoryValue = currentData[field.id] || [];

      // If user selected "5+" but has more than 5 entries, show all entries
      const actualMarriageCount = previousMarriagesValue === '5+'
        ? Math.max(5, marriageHistoryValue.length)
        : marriageCount;

      if (marriageCount === 0) return null;

      return (
        <div className="space-y-4">
          {[...Array(actualMarriageCount)].map((_, index) => {
            const marriage = marriageHistoryValue[index] || {};
            return (
              <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-gray-800">Marriage #{index + 1}</h4>
                  {/* Show remove button for "5+" scenario when there are more than 5 entries, or if it's beyond the base count */}
                  {(previousMarriagesValue === '5+' && marriageHistoryValue.length > 5) && (
                    <button
                      type="button"
                      onClick={() => {
                        const newHistory = marriageHistoryValue.filter((_, i) => i !== index);
                        updateField(field.id, newHistory);
                      }}
                      className="px-2 py-1 text-red-600 hover:bg-red-50 rounded text-sm font-medium"
                      title="Remove this marriage"
                    >
                      ✕ Remove
                    </button>
                  )}
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      className="p-2 border rounded focus:ring-2 focus:ring-blue-500"
                      value={marriage.spouseLastName || ''}
                      onChange={(e) => {
                        const newHistory = [...marriageHistoryValue];
                        newHistory[index] = { ...marriage, spouseLastName: e.target.value };
                        updateField(field.id, newHistory);
                      }}
                      placeholder="Spouse Last Name"
                    />
                    <input
                      type="text"
                      className="p-2 border rounded focus:ring-2 focus:ring-blue-500"
                      value={marriage.spouseFirstName || ''}
                      onChange={(e) => {
                        const newHistory = [...marriageHistoryValue];
                        newHistory[index] = { ...marriage, spouseFirstName: e.target.value };
                        updateField(field.id, newHistory);
                      }}
                      placeholder="Spouse First Name"
                    />
                    <input
                      type="text"
                      className="p-2 border rounded focus:ring-2 focus:ring-blue-500"
                      value={marriage.spouseMiddleName || ''}
                      onChange={(e) => {
                        const newHistory = [...marriageHistoryValue];
                        newHistory[index] = { ...marriage, spouseMiddleName: e.target.value };
                        updateField(field.id, newHistory);
                      }}
                      placeholder="Middle Name"
                    />
                  </div>

                  {/* Only show DOB and Country of Birth for beneficiary (DS-160 requirement) */}
                  {isBeneficiaryMarriageHistory && (
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Spouse's Date of Birth</label>
                        <input
                          type="date"
                          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                          value={marriage.spouseDOB || ''}
                          onChange={(e) => {
                            const newHistory = [...marriageHistoryValue];
                            newHistory[index] = { ...marriage, spouseDOB: e.target.value };
                            updateField(field.id, newHistory);
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Spouse's Country of Birth</label>
                        <select
                          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                          value={marriage.spouseBirthCountry || ''}
                          onChange={(e) => {
                            const newHistory = [...marriageHistoryValue];
                            newHistory[index] = { ...marriage, spouseBirthCountry: e.target.value };
                            updateField(field.id, newHistory);
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
                    </div>
                  )}

                  {/* Date of Marriage - only for beneficiary (DS-160 requirement) */}
                  {/* Date Marriage Ended - always shown (required for both I-129F sponsor and beneficiary sections) */}
                  <div className={isBeneficiaryMarriageHistory ? "grid grid-cols-2 gap-2" : ""}>
                    {isBeneficiaryMarriageHistory && (
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Date of Marriage</label>
                        <input
                          type="date"
                          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                          value={marriage.marriageDate || ''}
                          onChange={(e) => {
                            const newHistory = [...marriageHistoryValue];
                            const newStartDate = e.target.value;
                            const updatedMarriage = { ...marriage, marriageDate: newStartDate };

                            // If new start date is after current end date, clear the end date
                            if (marriage.marriageEndDate && newStartDate > marriage.marriageEndDate) {
                              updatedMarriage.marriageEndDate = '';
                            }

                            newHistory[index] = updatedMarriage;
                            updateField(field.id, newHistory);
                          }}
                        />
                      </div>
                    )}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Date Marriage Ended</label>
                      <input
                        type="date"
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                        value={marriage.marriageEndDate || ''}
                        min={marriage.marriageDate || ''}
                        onChange={(e) => {
                          // Allow all changes during typing
                          const newHistory = [...marriageHistoryValue];
                          newHistory[index] = { ...marriage, marriageEndDate: e.target.value };
                          updateField(field.id, newHistory);
                        }}
                        onBlur={(e) => {
                          // Only validate when user finishes editing (loses focus)
                          const newEndDate = e.target.value;
                          if (marriage.marriageDate && newEndDate && newEndDate < marriage.marriageDate) {
                            // Clear invalid date
                            const newHistory = [...marriageHistoryValue];
                            newHistory[index] = { ...marriage, marriageEndDate: '' };
                            updateField(field.id, newHistory);
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Date overlap validation warning */}
          {(() => {
            // Check for overlapping dates across marriages
            const marriages = marriageHistoryValue.filter(m => m.marriageDate && m.marriageEndDate);
            let hasOverlap = false;

            for (let i = 0; i < marriages.length; i++) {
              for (let j = i + 1; j < marriages.length; j++) {
                const marriage1Start = new Date(marriages[i].marriageDate);
                const marriage1End = new Date(marriages[i].marriageEndDate);
                const marriage2Start = new Date(marriages[j].marriageDate);
                const marriage2End = new Date(marriages[j].marriageEndDate);

                // Check if dates overlap
                if ((marriage1Start <= marriage2End && marriage1End >= marriage2Start)) {
                  hasOverlap = true;
                  break;
                }
              }
              if (hasOverlap) break;
            }

            if (hasOverlap) {
              return (
                <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <span className="text-amber-600 text-lg">⚠️</span>
                    <div>
                      <h4 className="font-medium text-amber-800 mb-2">Overlapping Marriage Dates Detected</h4>
                      <p className="text-sm text-amber-700 mb-3">
                        We noticed some of your marriage dates overlap. Having multiple marriages at the same time can significantly impact your visa approval chances and may require additional explanation to USCIS.
                      </p>
                      <p className="text-sm text-amber-700 mb-3">
                        <strong>What to do:</strong> Please double-check your dates to ensure they're accurate. If the dates are correct and you have a unique situation, we recommend contacting our support team for guidance.
                      </p>
                      <button
                        className="text-sm bg-amber-600 text-white px-3 py-1 rounded hover:bg-amber-700 transition-colors"
                        onClick={() => {
                          // TODO: Route to support
                          console.log('TODO: Route to support for overlapping marriage dates');
                        }}
                      >
                        Contact Support Team
                      </button>
                    </div>
                  </div>
                </div>
              );
            }

            return null;
          })()}

          {/* Add Another Marriage button - only show if user selected "5+" */}
          {previousMarriagesValue === '5+' && (
            <div className="text-center pt-4">
              <button
                type="button"
                onClick={() => {
                  // Add a new empty marriage entry
                  const newHistory = [...marriageHistoryValue];
                  newHistory.push({});
                  updateField(field.id, newHistory);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                + Add Another Previous Marriage
              </button>
            </div>
          )}
        </div>
      );
    }

      case 'married-eligibility-check':
        const maritalStatus = currentData['sponsorMaritalStatus'] || '';
        const sponsorFirstName = currentData['sponsorFirstName'] || '[SponsorFirstName]';
        const beneficiaryFirstName = currentData['beneficiaryFirstName'] || '[BeneficiaryFirstName]';
        const sponsorSex = currentData['sponsorSex'] || '';
        const sponsorPronoun = sponsorSex === 'Male' ? 'he' : sponsorSex === 'Female' ? 'she' : 'they';

        const marriedTo = currentData['marriedTo'] || '';
        const spouseLocation = currentData['spouseLocation'] || '';
        const preparingWhileDivorcing = currentData['preparingWhileDivorcing'] || false;

        // Show initial married eligibility check
        if (maritalStatus === 'Married' && !marriedTo) {
          return (
            <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center mb-3">
                <span className="text-orange-600 text-xl mr-2">⚠️</span>
                <h3 className="text-lg font-semibold text-orange-800">Important: K-1 Visa Eligibility Check</h3>
              </div>
              <p className="text-gray-700 mb-4">
                K-1 visas are only for engaged couples. We need to determine the right path for {sponsorFirstName}.
              </p>

              <div className="space-y-3">
                <p className="font-medium text-gray-800">Who is {sponsorFirstName} married to?</p>

                <div className="space-y-2">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="marriedTo"
                      value="sponsor"
                      checked={marriedTo === 'sponsor'}
                      onChange={(e) => updateField('marriedTo', e.target.value)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span>The person {sponsorFirstName} wants to sponsor ({beneficiaryFirstName})</span>
                  </label>

                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="marriedTo"
                      value="someone-else"
                      checked={marriedTo === 'someone-else'}
                      onChange={(e) => updateField('marriedTo', e.target.value)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span>Someone else</span>
                  </label>
                </div>

                <p className="text-xs text-gray-500 mt-3">
                  Note: If {beneficiaryFirstName} isn't the correct name, that's okay. We just need to know if {sponsorFirstName} is married to the person {sponsorPronoun} wants to sponsor. Names can be updated later.
                </p>
              </div>
            </div>
          );
        }

        // Show spouse location question after selecting "married to sponsor"
        if (maritalStatus === 'Married' && marriedTo === 'sponsor' && !spouseLocation) {
          return (
            <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center mb-3">
                <span className="text-orange-600 text-xl mr-2">⚠️</span>
                <h3 className="text-lg font-semibold text-orange-800">Important: K-1 Visa Eligibility Check</h3>
              </div>
              <p className="text-gray-700 mb-4">
                K-1 visas are only for engaged couples. We need to determine the right path for {sponsorFirstName}.
              </p>

              <div className="space-y-4">
                <div>
                  <p className="font-medium text-gray-800 mb-2">Who is {sponsorFirstName} married to?</p>
                  <p className="text-green-600 text-sm">✓ The person {sponsorFirstName} wants to sponsor ({beneficiaryFirstName})</p>
                </div>

                <div className="space-y-3">
                  <p className="font-medium text-gray-800">Where is {beneficiaryFirstName} currently?</p>

                  <div className="space-y-2">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="spouseLocation"
                        value="in-us"
                        checked={spouseLocation === 'in-us'}
                        onChange={(e) => updateField('spouseLocation', e.target.value)}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span>In the United States</span>
                    </label>

                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="spouseLocation"
                        value="outside-us"
                        checked={spouseLocation === 'outside-us'}
                        onChange={(e) => updateField('spouseLocation', e.target.value)}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span>Outside the United States</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          );
        }

        // Path A: Married to sponsor + In US (AOS)
        if (maritalStatus === 'Married' && marriedTo === 'sponsor' && spouseLocation === 'in-us') {
          return (
            <div className="space-y-4">
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center mb-3">
                  <span className="text-orange-600 text-xl mr-2">⚠️</span>
                  <h3 className="text-lg font-semibold text-orange-800">Important: K-1 Visa Eligibility Check</h3>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>✓ Married to: The person {sponsorFirstName} wants to sponsor ({beneficiaryFirstName})</p>
                  <p>✓ Location: In the United States</p>
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">
                  → Spousal Green Card: Adjustment of Status (AOS)
                </h3>
                <p className="text-gray-700 mb-4">
                  Being married means {beneficiaryFirstName} can directly apply for a green card - no need for the fiancé visa step, which eventually requires a separate green card application.
                </p>

                <details className="mb-4">
                  <summary className="cursor-pointer text-blue-600 font-medium hover:text-blue-800">
                    What is AOS? (click to expand)
                  </summary>
                  <div className="mt-2 pl-4 text-gray-600">
                    <p className="mb-2">Adjustment of Status is a spousal green card application that allows the spouse to become a permanent resident while staying in the US</p>
                    <p>Estimated timeline: 6-10 months for work/travel permit, 12-18 months for green card approval</p>
                  </div>
                </details>

                <div className="flex flex-col space-y-3">
                  <button
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    onClick={() => {
                      // TODO: Route to AOS eligibility test
                      console.log('TODO: Route to AOS qualifying test');
                    }}
                  >
                    Continue to Spousal Green Card Application →
                  </button>
                  <button
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    onClick={() => {
                      updateField('sponsorMaritalStatus', '');
                      updateField('marriedTo', '');
                      updateField('spouseLocation', '');
                    }}
                  >
                    ← Back to K-1 Form
                  </button>
                  <button
                    className="text-sm text-blue-600 hover:text-blue-800"
                    onClick={() => {
                      // TODO: Route to support
                      console.log('TODO: Route to support for clarification/refund requests');
                    }}
                  >
                    Have questions? Contact support
                  </button>
                </div>
              </div>
            </div>
          );
        }

        // Path B: Married to sponsor + Outside US (Consular)
        if (maritalStatus === 'Married' && marriedTo === 'sponsor' && spouseLocation === 'outside-us') {
          return (
            <div className="space-y-4">
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center mb-3">
                  <span className="text-orange-600 text-xl mr-2">⚠️</span>
                  <h3 className="text-lg font-semibold text-orange-800">Important: K-1 Visa Eligibility Check</h3>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>✓ Married to: The person {sponsorFirstName} wants to sponsor ({beneficiaryFirstName})</p>
                  <p>✓ Location: Outside the United States</p>
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">
                  → Spousal Green Card: Consular Processing
                </h3>
                <p className="text-gray-700 mb-4">
                  Being married means {beneficiaryFirstName} can directly apply for a green card - no need for the fiancé visa step, which eventually requires a separate green card application.
                </p>

                <details className="mb-4">
                  <summary className="cursor-pointer text-blue-600 font-medium hover:text-blue-800">
                    What is Consular Processing? (click to expand)
                  </summary>
                  <div className="mt-2 pl-4 text-gray-600 space-y-2">
                    <p>Consular Processing is when the spouse applies for their green card from outside the US and enters as a permanent resident</p>
                    <p><strong>Estimated timeline:</strong> 12-16 months until approval</p>
                    <div className="ml-4">
                      <p>• Month 1-12: Application processing ({beneficiaryFirstName} remains outside the US)</p>
                      <p>• Month 12-16: Interview at local U.S. Embassy or Consulate in {beneficiaryFirstName}'s country</p>
                      <p>• Note: If no U.S. Embassy/Consulate is available locally, interview may be scheduled in a neighboring country</p>
                      <p>• After approval: {beneficiaryFirstName} can enter US as permanent resident</p>
                      <p>• Physical green card arrives by mail within 30-60 days after entering the US</p>
                    </div>
                    <p className="mt-2 font-medium text-amber-600">
                      Important: Many temporary visas (tourist visas, ESTA, etc.) are often denied during green card processing due to immigration intent. {beneficiaryFirstName} should plan to remain outside the US until the process is complete.
                    </p>
                  </div>
                </details>

                <div className="flex flex-col space-y-3">
                  <button
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    onClick={() => {
                      // TODO: Route to Consular eligibility test
                      console.log('TODO: Route to Consular qualifying test');
                    }}
                  >
                    Continue to Spousal Green Card Application →
                  </button>
                  <button
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    onClick={() => {
                      updateField('sponsorMaritalStatus', '');
                      updateField('marriedTo', '');
                      updateField('spouseLocation', '');
                    }}
                  >
                    ← Back to K-1 Form
                  </button>
                  <button
                    className="text-sm text-blue-600 hover:text-blue-800"
                    onClick={() => {
                      // TODO: Route to support
                      console.log('TODO: Route to support for clarification/refund requests');
                    }}
                  >
                    Have questions? Contact support
                  </button>
                </div>
              </div>
            </div>
          );
        }

        // Path C: Married to someone else
        if (maritalStatus === 'Married' && marriedTo === 'someone-else') {
          return (
            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <h3 className="text-lg font-semibold text-amber-800 mb-3">
                → Let's understand {sponsorFirstName}'s current marriage situation
              </h3>
              <p className="text-gray-700 mb-4">
                For a K-1 visa, both parties need to be legally free to marry. We understand divorces can be complex, and we're here to help {sponsorFirstName} prepare the visa application for when it's time to file.
              </p>

              <div className="space-y-3">
                <div>
                  {!preparingWhileDivorcing ? (
                    <button
                      className="w-full px-6 py-4 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-left"
                      onClick={() => {
                        updateField('preparingWhileDivorcing', true);
                      }}
                    >
                      <div className="font-medium">Continue preparing the application now and file when the divorce is finalized</div>
                      <div className="text-sm text-amber-100 mt-1">We'll help {sponsorFirstName} get everything ready to file as soon as possible</div>
                    </button>
                  ) : (
                    <div className="w-full px-6 py-4 bg-green-100 border border-green-300 rounded-lg text-left">
                      <div className="flex items-center">
                        <span className="text-green-600 text-xl mr-2">✓</span>
                        <div>
                          <div className="font-medium text-green-800">Great - let's keep going!</div>
                          <div className="text-sm text-green-600 mt-1">Form is now active and ready to continue</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col space-y-2">
                  <button
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                    onClick={() => {
                      updateField('marriedTo', '');
                      updateField('preparingWhileDivorcing', false);
                    }}
                  >
                    ← Back
                  </button>
                  <button
                    className="text-sm text-amber-600 hover:text-amber-800"
                    onClick={() => {
                      // TODO: Route to support system with context
                      console.log('TODO: Route to support system with context for married to someone else scenario');
                    }}
                  >
                    Need to discuss {sponsorFirstName}'s situation? Contact support
                  </button>
                </div>
              </div>
            </div>
          );
        }

        return null;

      case 'chronological-timeline': {
        // Determine which timeline field to use based on field ID
        const timelineFieldId = field.id.includes('beneficiary') ? 'beneficiaryTimelineEntries' : 'sponsorTimelineEntries';
        const chronologicalEntries = currentData[timelineFieldId] || [{}];


        return (
          <div>

            {/* Work History Periods */}
            <div className="space-y-4">
              {chronologicalEntries.map((entry, index) => {
                // Description generation function
                const generateDescription = (circumstances, professionalField) => {
                  let parts = [];

                  // Add professional context first
                  if (professionalField && professionalField !== 'Other Professional Services') {
                    if (circumstances.includes('recent-separation')) {
                      parts.push(`Recently unemployed ${professionalField.toLowerCase()} professional`);
                    } else {
                      parts.push(`${professionalField} professional`);
                    }
                  } else if (circumstances?.includes('recent-separation')) {
                    parts.push('Recently unemployed');
                  } else {
                    parts.push('Unemployed');
                  }

                  // Separate different types of activities
                  const jobSearchActivities = ['actively seeking opportunities'];
                  const skillDevelopmentActivities = [];
                  const situationalContext = [];

                  // Job search activities
                  if (circumstances?.includes('working-with-recruiters')) {
                    jobSearchActivities.push('working with recruiters');
                  }

                  if (circumstances?.includes('professional-networking')) {
                    jobSearchActivities.push('networking professionally');
                  }

                  // Skill development activities
                  if (circumstances?.includes('recent-training')) {
                    skillDevelopmentActivities.push('recently completed relevant training for next role');
                  }

                  if (circumstances?.includes('pursuing-qualifications')) {
                    skillDevelopmentActivities.push('pursuing additional qualifications');
                  }

                  // Situational context
                  if (circumstances?.includes('relocated')) {
                    situationalContext.push('recently relocated');
                  }

                  // Build main sentence with better flow for relocated circumstances
                  let description;

                  // Special handling for relocated circumstances
                  if (circumstances?.includes('relocated')) {
                    if (professionalField && professionalField !== 'Other Professional Services') {
                      if (circumstances.includes('recent-separation')) {
                        description = `Recently unemployed ${professionalField.toLowerCase()} professional actively seeking opportunities after recently relocating`;
                      } else {
                        description = `${professionalField} professional actively seeking opportunities after recently relocating`;
                      }
                    } else {
                      if (circumstances.includes('recent-separation')) {
                        description = 'Recently unemployed, actively seeking opportunities after recently relocating';
                      } else {
                        description = 'Actively seeking opportunities after recently relocating';
                      }
                    }
                  } else {
                    // Standard flow for non-relocated circumstances
                    description = parts[0];
                  }

                  // Add additional job search activities for non-relocated or when there are extra activities
                  if (!circumstances?.includes('relocated') && jobSearchActivities.length > 0) {
                    if (jobSearchActivities.length === 1) {
                      description += ` ${jobSearchActivities[0]}`;
                    } else if (jobSearchActivities.length === 2) {
                      description += ` ${jobSearchActivities[0]} and ${jobSearchActivities[1]}`;
                    } else {
                      const lastActivity = jobSearchActivities.pop();
                      description += ` ${jobSearchActivities.join(', ')}, and ${lastActivity}`;
                    }
                  } else if (circumstances?.includes('relocated') && jobSearchActivities.length > 1) {
                    // For relocated, only add additional activities beyond the basic "actively seeking"
                    const additionalActivities = jobSearchActivities.slice(1); // Remove "actively seeking opportunities"
                    if (additionalActivities.length > 0) {
                      if (additionalActivities.length === 1) {
                        description += `, ${additionalActivities[0]}`;
                      } else if (additionalActivities.length === 2) {
                        description += `, ${additionalActivities[0]} and ${additionalActivities[1]}`;
                      } else {
                        const lastActivity = additionalActivities.pop();
                        description += `, ${additionalActivities.join(', ')}, and ${lastActivity}`;
                      }
                    }
                  }

                  // Add skill development as separate sentence if present
                  if (skillDevelopmentActivities.length > 0) {
                    let skillSentence;
                    if (skillDevelopmentActivities.length === 1) {
                      skillSentence = skillDevelopmentActivities[0];
                    } else if (skillDevelopmentActivities.length === 2) {
                      skillSentence = `${skillDevelopmentActivities[0]} and ${skillDevelopmentActivities[1]}`;
                    } else {
                      const lastSkill = skillDevelopmentActivities.pop();
                      skillSentence = `${skillDevelopmentActivities.join(', ')}, and ${lastSkill}`;
                    }

                    // Add "for next role" context if not already present in any activity
                    const hasForNextRole = skillDevelopmentActivities.some(activity => activity.includes('for next role'));
                    if (!hasForNextRole) {
                      skillSentence += ' for next role';
                    }

                    description += `. Also ${skillSentence}`;
                  }

                  return description;
                };

                // Auto-update description helper
                const updateDescriptionIfNeeded = (newCircumstances, newProfessionalField) => {
                  if (entry.type !== 'seeking-work') return;

                  const newGeneratedDescription = generateDescription(newCircumstances || entry.favorableCircumstances, newProfessionalField || entry.professionalField);
                  const currentDescription = entry.organization || '';
                  const lastAutoGenerated = entry.lastAutoGenerated || '';

                  // Only update if user hasn't manually edited OR field is empty
                  const shouldUpdate = currentDescription === lastAutoGenerated || currentDescription === '';

                  const newEntries = [...chronologicalEntries];
                  newEntries[index] = {
                    ...entry,
                    organization: shouldUpdate ? newGeneratedDescription : entry.organization,
                    lastAutoGenerated: newGeneratedDescription,
                    favorableCircumstances: newCircumstances || entry.favorableCircumstances,
                    professionalField: newProfessionalField !== undefined ? newProfessionalField : entry.professionalField
                  };
                  updateField(timelineFieldId, newEntries);
                };

                // Set default description for new seeking-work entries
                if (entry.type === 'seeking-work' && !entry.organization && !entry.lastAutoGenerated) {
                  const defaultDescription = "Unemployed actively seeking opportunities";
                  const newEntries = [...chronologicalEntries];
                  newEntries[index] = {
                    ...entry,
                    organization: defaultDescription,
                    lastAutoGenerated: defaultDescription
                  };
                  updateField(timelineFieldId, newEntries);
                }

                return (
                  <div key={index} className="border rounded-lg p-4 bg-white">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-medium text-lg">
                        {(() => {
                          const typeMap = {
                            'working': { icon: '💼', label: 'Working Period' },
                            'in-education': { icon: '📚', label: 'Education Period' },
                            'seeking-work': { icon: '🔍', label: 'Seeking Work Period' },
                            'homemaker': { icon: '🏠', label: 'Homemaker Period' },
                            'retired': { icon: '🌴', label: 'Retirement Period' },
                            'unable-to-work': { icon: '🏥', label: 'Unable to Work Period' },
                            'military': { icon: '🪖', label: 'Military Service Period' },
                            'other': { icon: '📝', label: 'Other/Personal Time Period' }
                          };
                          const entryInfo = entry.type && typeMap[entry.type] ? typeMap[entry.type] : { icon: '📝', label: 'Work Period' };
                          return `${entryInfo.icon} ${entryInfo.label} ${index + 1}${index === 0 ? ' (Most Recent)' : ''}`;
                        })()}
                      </h4>
                      <button
                        type="button"
                        onClick={() => {
                          const newEntries = chronologicalEntries.filter((_, i) => i !== index);
                          updateField(timelineFieldId, newEntries);
                        }}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">Type</label>
                        <select
                          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                          value={entry.type || ''}
                          onChange={(e) => {
                            const newEntries = [...chronologicalEntries];
                            const newType = e.target.value;

                            // Clear organization field when changing types since it serves different purposes
                            // (Company name vs Description vs School name, etc.)
                            if (newType === 'seeking-work') {
                              // Set default description for seeking-work
                              const defaultDescription = "Unemployed actively seeking opportunities";
                              newEntries[index] = {
                                ...entry,
                                type: newType,
                                organization: defaultDescription,
                                lastAutoGenerated: defaultDescription,
                                favorableCircumstances: []
                              };
                            } else {
                              // Clear everything for other types
                              newEntries[index] = {
                                ...entry,
                                type: newType,
                                organization: '',
                                showRetiredHelp: false, // Clear retired help panel when switching types
                                showOtherHelp: false, // Clear other help panel when switching types
                                lastAutoGenerated: '',
                                favorableCircumstances: []
                              };
                            }
                            updateField(timelineFieldId, newEntries);
                          }}
                        >
                          <option value="">Select type...</option>
                          <option value="working">Working (employed or self-employed)</option>
                          <option value="seeking-work">Seeking Work (unemployed & actively searching)</option>
                          <option value="in-education">In Education (full-time or part-time)</option>
                          <option value="homemaker">Homemaker</option>
                          <option value="unable-to-work">Unable to Work (medical/disability)</option>
                          <option value="military">Military Service</option>
                          <option value="retired">Retired</option>
                          <option value="other">Other/Personal Time</option>
                        </select>
                      </div>

                      {/* USCIS Guidance Notes for each employment type */}
                      {entry.type && entry.type !== 'seeking-work' && entry.type !== 'unable-to-work' && entry.type !== 'military' && entry.type !== 'homemaker' && (
                        <div className="md:col-span-2 mb-4 p-3 bg-blue-50 border-l-4 border-blue-300 rounded">
                          <div className="text-sm text-blue-800">
                            {(() => {
                              const guidance = {
                                'working': {
                                  icon: '💼',
                                  title: 'Working Period',
                                  content: 'USCIS uses this information to verify your work history and assess financial stability. Include all employment, even part-time or temporary positions.'
                                },
                                'seeking-work': {
                                  icon: '',
                                  title: '',
                                  content: ''
                                },
                                'in-education': {
                                  icon: '📚',
                                  title: 'Education Period',
                                  content: 'USCIS considers full-time education as valid employment history. Include any relevant degrees or certifications earned. This is for students not seeking work.'
                                },
                                'unable-to-work': {
                                  icon: '🏥',
                                  title: 'Unable to Work Period',
                                  content: 'This covers medical leave, disability, or other situations preventing work. In Description: Enter "Medical Leave" or "Disability". You can mention if it was from a specific employer but no medical details needed.'
                                },
                                'retired': {
                                  icon: '🌴',
                                  title: 'Retirement Period',
                                  content: 'In Description: Enter "Retired" or "Retired [former profession]" (e.g., "Retired Teacher"). If you had any part-time work during retirement, select "Working" type instead.'
                                },
                                'other': {
                                  icon: '📝',
                                  title: 'Other/Personal Time Period',
                                  content: 'In Description: Be specific (e.g., "Volunteer work at Red Cross", "Travel/sabbatical", "Starting own business", "Personal time off"). If you received any payment, select "Working" type instead.'
                                }
                              };

                              const info = guidance[entry.type] || { icon: '📝', title: 'Work Period', content: 'Please provide details about this period.' };
                              return (
                                <>
                                  <div className="font-medium flex items-center">
                                    <span className="mr-2">{info.icon}</span>
                                    {info.title}
                                  </div>
                                  <p className="mt-1">{info.content}</p>
                                </>
                              );
                            })()}
                          </div>
                        </div>
                      )}

                      {/* Additional Details for Seeking Work */}
                      {entry.type === 'seeking-work' && (
                        <div className="md:col-span-2 p-4 bg-blue-50 border border-blue-200 rounded mb-4">
                          <h5 className="font-medium text-blue-900 mb-3">Select any that apply to automatically generate your description below. You can always edit the description manually afterward:</h5>

                          <div className="space-y-3">
                            {/* Recent Transition Context */}
                            <div className="space-y-2">
                              <h6 className="font-medium text-sm text-blue-900">Recent Transition Context:</h6>
                              <div className="pl-4 space-y-2">
                                <label className="flex items-start space-x-2">
                                  <input
                                    type="checkbox"
                                    className="mt-1"
                                    checked={entry.favorableCircumstances?.includes('recent-separation') || false}
                                    onChange={(e) => {
                                      const circumstances = entry.favorableCircumstances || [];
                                      const newCircumstances = e.target.checked
                                        ? [...circumstances, 'recent-separation']
                                        : circumstances.filter(c => c !== 'recent-separation');
                                      updateDescriptionIfNeeded(newCircumstances);
                                    }}
                                  />
                                  <span className="text-sm">Recently left previous position (within last 6 months)</span>
                                </label>

                                <label className="flex items-start space-x-2">
                                  <input
                                    type="checkbox"
                                    className="mt-1"
                                    checked={entry.favorableCircumstances?.includes('relocated') || false}
                                    onChange={(e) => {
                                      const circumstances = entry.favorableCircumstances || [];
                                      const newCircumstances = e.target.checked
                                        ? [...circumstances, 'relocated']
                                        : circumstances.filter(c => c !== 'relocated');
                                      updateDescriptionIfNeeded(newCircumstances);
                                    }}
                                  />
                                  <span className="text-sm">Recently relocated (actively seeking work in new area)</span>
                                </label>
                              </div>
                            </div>


                            {/* Active Job Search Efforts */}
                            <div className="space-y-2">
                              <h6 className="font-medium text-sm text-blue-900">Active Job Search Efforts:</h6>
                              <div className="pl-4 space-y-2">
                                <label className="flex items-start space-x-2">
                                  <input
                                    type="checkbox"
                                    className="mt-1"
                                    checked={entry.favorableCircumstances?.includes('working-with-recruiters') || false}
                                    onChange={(e) => {
                                      const circumstances = entry.favorableCircumstances || [];
                                      const newCircumstances = e.target.checked
                                        ? [...circumstances, 'working-with-recruiters']
                                        : circumstances.filter(c => c !== 'working-with-recruiters');
                                      updateDescriptionIfNeeded(newCircumstances);
                                    }}
                                  />
                                  <span className="text-sm">Working with recruiters/placement agencies</span>
                                </label>

                                <label className="flex items-start space-x-2">
                                  <input
                                    type="checkbox"
                                    className="mt-1"
                                    checked={entry.favorableCircumstances?.includes('professional-networking') || false}
                                    onChange={(e) => {
                                      const circumstances = entry.favorableCircumstances || [];
                                      const newCircumstances = e.target.checked
                                        ? [...circumstances, 'professional-networking']
                                        : circumstances.filter(c => c !== 'professional-networking');
                                      updateDescriptionIfNeeded(newCircumstances);
                                    }}
                                  />
                                  <span className="text-sm">Networking actively in professional circles</span>
                                </label>

                                <label className="flex items-start space-x-2">
                                  <input
                                    type="checkbox"
                                    className="mt-1"
                                    checked={entry.favorableCircumstances?.includes('pursuing-qualifications') || false}
                                    onChange={(e) => {
                                      const circumstances = entry.favorableCircumstances || [];
                                      const newCircumstances = e.target.checked
                                        ? [...circumstances, 'pursuing-qualifications']
                                        : circumstances.filter(c => c !== 'pursuing-qualifications');
                                      updateDescriptionIfNeeded(newCircumstances);
                                    }}
                                  />
                                  <span className="text-sm">Pursuing additional qualifications while job searching</span>
                                </label>

                                <label className="flex items-start space-x-2">
                                  <input
                                    type="checkbox"
                                    className="mt-1"
                                    checked={entry.favorableCircumstances?.includes('recent-training') || false}
                                    onChange={(e) => {
                                      const circumstances = entry.favorableCircumstances || [];
                                      const newCircumstances = e.target.checked
                                        ? [...circumstances, 'recent-training']
                                        : circumstances.filter(c => c !== 'recent-training');
                                      updateDescriptionIfNeeded(newCircumstances);
                                    }}
                                  />
                                  <span className="text-sm">Recently completed job-relevant education/training (within last 6 months)</span>
                                </label>
                              </div>
                            </div>


                            {/* Professional Field Dropdown */}
                            <div className="space-y-2">
                              <label className="block">
                                <span className="font-medium text-sm text-blue-900">Professional Field (Optional):</span>
                                <select
                                  className="mt-1 w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                  value={entry.professionalField || ''}
                                  onChange={(e) => {
                                    updateDescriptionIfNeeded(entry.favorableCircumstances, e.target.value);
                                  }}
                                >
                                  <option value="">Select your professional field...</option>
                                  <option value="Accounting & Finance">Accounting & Finance</option>
                                  <option value="Architecture & Engineering">Architecture & Engineering</option>
                                  <option value="Arts & Entertainment">Arts & Entertainment</option>
                                  <option value="Business & Management">Business & Management</option>
                                  <option value="Computer & IT">Computer & IT</option>
                                  <option value="Construction & Trades">Construction & Trades</option>
                                  <option value="Education & Training">Education & Training</option>
                                  <option value="Healthcare & Medical">Healthcare & Medical</option>
                                  <option value="Legal">Legal</option>
                                  <option value="Manufacturing & Production">Manufacturing & Production</option>
                                  <option value="Marketing & Sales">Marketing & Sales</option>
                                  <option value="Media & Communications">Media & Communications</option>
                                  <option value="Non-Profit & Government">Non-Profit & Government</option>
                                  <option value="Real Estate">Real Estate</option>
                                  <option value="Retail & Customer Service">Retail & Customer Service</option>
                                  <option value="Science & Research">Science & Research</option>
                                  <option value="Transportation & Logistics">Transportation & Logistics</option>
                                  <option value="Other Professional Services">Other Professional Services</option>
                                </select>
                                <span className="text-xs text-blue-700 mt-1 block">This helps generate better descriptions (e.g., "Marketing & Sales professional seeking opportunities")</span>
                              </label>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Additional Details for Unable to Work */}
                      {entry.type === 'unable-to-work' && (
                        <div className="md:col-span-2 p-4 bg-red-50 border border-red-200 rounded mb-4">
                          <h5 className="font-medium text-red-900 mb-3">Select the type that best describes your situation:</h5>

                          <div className="space-y-3">
                            <div className="space-y-2">
                              <div className="space-y-2">
                                <label className="flex items-start space-x-2">
                                  <input
                                    type="radio"
                                    name={`unable-work-type-${index}`}
                                    checked={entry.unableToWorkType === 'medical-leave'}
                                    onChange={() => {
                                      const newEntries = [...chronologicalEntries];
                                      const autoGenerated = "Temporary medical leave from employment";
                                      newEntries[index] = {
                                        ...entry,
                                        unableToWorkType: 'medical-leave',
                                        organization: autoGenerated,
                                        lastAutoGenerated: autoGenerated
                                      };
                                      updateField(timelineFieldId, newEntries);
                                    }}
                                    className="mt-0.5"
                                  />
                                  <span className="text-sm">
                                    <strong>Medical leave</strong> - Temporary leave due to personal health issues
                                  </span>
                                </label>

                                <label className="flex items-start space-x-2">
                                  <input
                                    type="radio"
                                    name={`unable-work-type-${index}`}
                                    checked={entry.unableToWorkType === 'disability'}
                                    onChange={() => {
                                      const newEntries = [...chronologicalEntries];
                                      const autoGenerated = "Unable to work due to disability";
                                      newEntries[index] = {
                                        ...entry,
                                        unableToWorkType: 'disability',
                                        organization: autoGenerated,
                                        lastAutoGenerated: autoGenerated
                                      };
                                      updateField(timelineFieldId, newEntries);
                                    }}
                                    className="mt-0.5"
                                  />
                                  <span className="text-sm">
                                    <strong>Disability</strong> - Long-term or permanent disability affecting ability to work
                                  </span>
                                </label>

                                <label className="flex items-start space-x-2">
                                  <input
                                    type="radio"
                                    name={`unable-work-type-${index}`}
                                    checked={entry.unableToWorkType === 'family-caregiving'}
                                    onChange={() => {
                                      const newEntries = [...chronologicalEntries];
                                      const autoGenerated = "Unable to work due to full-time caregiving for family member";
                                      newEntries[index] = {
                                        ...entry,
                                        unableToWorkType: 'family-caregiving',
                                        organization: autoGenerated,
                                        lastAutoGenerated: autoGenerated
                                      };
                                      updateField(timelineFieldId, newEntries);
                                    }}
                                    className="mt-0.5"
                                  />
                                  <span className="text-sm">
                                    <strong>Family caregiving</strong> - Unable to work due to caring for family member
                                  </span>
                                </label>

                                <label className="flex items-start space-x-2">
                                  <input
                                    type="radio"
                                    name={`unable-work-type-${index}`}
                                    checked={entry.unableToWorkType === 'other-health'}
                                    onChange={() => {
                                      const newEntries = [...chronologicalEntries];
                                      const autoGenerated = "Unable to work due to health-related circumstances";
                                      newEntries[index] = {
                                        ...entry,
                                        unableToWorkType: 'other-health',
                                        organization: autoGenerated,
                                        lastAutoGenerated: autoGenerated
                                      };
                                      updateField(timelineFieldId, newEntries);
                                    }}
                                    className="mt-0.5"
                                  />
                                  <span className="text-sm">
                                    <strong>Other health reasons</strong> - Other health-related reasons preventing work
                                  </span>
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Organization/Employer/School Name - Required for all types */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">
                          {(() => {
                            const labels = {
                              'working': 'Company/Organization Name',
                              'in-education': 'School/Institution Name',
                              'military': 'Branch of Service',
                              'seeking-work': 'Description (auto-fills or write your own)',
                              'caregiving': 'Description',
                              'retired': 'Description',
                              'unable-to-work': 'Description',
                              'other': 'Description'
                            };
                            return labels[entry.type] || 'Description';
                          })()}
                        </label>
                        {entry.type === 'seeking-work' ? (
                          <div>
                            <textarea
                              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                              rows={3}
                              value={entry.organization || ''}
                              onChange={(e) => {
                                const newEntries = [...chronologicalEntries];
                                newEntries[index] = { ...entry, organization: e.target.value };
                                updateField(timelineFieldId, newEntries);
                              }}
                              placeholder="Describe your employment situation"
                            />

                            {/* Restore Auto-Generated Button - Show only when user has manually edited */}
                            {(() => {
                              const currentDescription = entry.organization || '';
                              const lastAutoGenerated = entry.lastAutoGenerated || '';
                              const hasManualEdit = currentDescription !== lastAutoGenerated && currentDescription !== '' && lastAutoGenerated !== '';

                              if (hasManualEdit) {
                                return (
                                  <div className="mt-2">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const newEntries = [...chronologicalEntries];
                                        newEntries[index] = {
                                          ...entry,
                                          organization: lastAutoGenerated
                                        };
                                        updateField(timelineFieldId, newEntries);
                                      }}
                                      className="text-xs text-blue-600 hover:text-blue-800 underline flex items-center space-x-1"
                                    >
                                      <span>↺</span>
                                      <span>Use auto-generated description</span>
                                    </button>
                                    <p className="text-xs text-gray-500 mt-1">
                                      Auto-generated: "{lastAutoGenerated}"
                                    </p>
                                  </div>
                                );
                              }
                              return null;
                            })()}
                          </div>
                        ) : entry.type === 'unable-to-work' ? (
                          <div>
                            <textarea
                              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                              rows={2}
                              value={entry.organization || ''}
                              onChange={(e) => {
                                const newEntries = [...chronologicalEntries];
                                newEntries[index] = { ...entry, organization: e.target.value };
                                updateField(timelineFieldId, newEntries);
                              }}
                              placeholder="Edit this description or write your own"
                            />

                            <p className="text-xs text-gray-600 mt-1">
                              ✏️ You can edit this auto-generated description to add more specific details
                            </p>

                            {/* Helpful elaboration guidance based on selected type */}
                            {entry.unableToWorkType && (
                              <div className="mt-2 p-2 bg-blue-50 border-l-4 border-blue-300 text-xs text-blue-800">
                                {(() => {
                                  const guidance = {
                                    'medical-leave': '💡 Consider adding: duration (short-term/long-term), general nature (surgery recovery, treatment), whether from specific employer',
                                    'disability': '💡 Consider adding: whether temporary or permanent, if receiving benefits, general impact on work capacity',
                                    'family-caregiving': '💡 Consider adding: relationship to family member (parent, spouse, child), type of care provided (medical care, disability support, elderly care), approximate duration',
                                    'other-health': '💡 Be specific but avoid unnecessary medical details (e.g., "Recovery from surgery", "Treatment for chronic condition")'
                                  };
                                  return guidance[entry.unableToWorkType] || '';
                                })()}
                              </div>
                            )}

                            {/* Restore Auto-Generated Button - Show only when user has manually edited */}
                            {(() => {
                              const currentDescription = entry.organization || '';
                              const lastAutoGenerated = entry.lastAutoGenerated || '';
                              const hasManualEdit = currentDescription !== lastAutoGenerated && currentDescription !== '' && lastAutoGenerated !== '';

                              if (hasManualEdit) {
                                return (
                                  <div className="mt-2">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const newEntries = [...chronologicalEntries];
                                        newEntries[index] = {
                                          ...entry,
                                          organization: lastAutoGenerated
                                        };
                                        updateField(timelineFieldId, newEntries);
                                      }}
                                      className="text-xs text-blue-600 hover:text-blue-800 underline flex items-center space-x-1"
                                    >
                                      <span>↺</span>
                                      <span>Use auto-generated description</span>
                                    </button>
                                    <p className="text-xs text-gray-500 mt-1">
                                      Auto-generated: "{lastAutoGenerated}"
                                    </p>
                                  </div>
                                );
                              }
                              return null;
                            })()}
                          </div>
                        ) : entry.type === 'retired' ? (
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                value={entry.organization || ''}
                                onChange={(e) => {
                                  const newEntries = [...chronologicalEntries];
                                  newEntries[index] = { ...entry, organization: e.target.value };
                                  updateField(timelineFieldId, newEntries);
                                }}
                                placeholder="e.g., Retired Teacher with 30 years of service"
                              />

                              <button
                                type="button"
                                onClick={() => {
                                  const newEntries = [...chronologicalEntries];
                                  newEntries[index] = {
                                    ...entry,
                                    showRetiredHelp: !entry.showRetiredHelp
                                  };
                                  updateField(timelineFieldId, newEntries);
                                }}
                                className="px-3 py-2 text-sm bg-blue-100 text-blue-700 border border-blue-300 rounded hover:bg-blue-200 transition-colors whitespace-nowrap"
                              >
                                ℹ️ How to write a good description
                              </button>
                            </div>

                            {/* Collapsible help panel */}
                            {entry.showRetiredHelp && (
                              <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm">
                                <div className="flex justify-between items-start mb-3">
                                  <h4 className="font-medium text-blue-800">Writing Strong Retirement Descriptions</h4>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newEntries = [...chronologicalEntries];
                                      newEntries[index] = {
                                        ...entry,
                                        showRetiredHelp: false
                                      };
                                      updateField(timelineFieldId, newEntries);
                                    }}
                                    className="text-blue-600 hover:text-blue-800 text-lg leading-none"
                                  >
                                    ×
                                  </button>
                                </div>

                                <div className="space-y-4 text-blue-700">
                                  <div>
                                    <h5 className="font-medium text-blue-800 mb-2">✅ What to Include:</h5>
                                    <ul className="space-y-1 text-sm ml-4">
                                      <li>• <strong>Previous profession:</strong> "Retired Teacher", "Retired Engineer"</li>
                                      <li>• <strong>Years of service:</strong> "30 years of service", "Career spanning 1985-2020"</li>
                                      <li>• <strong>Income sources:</strong> "Receiving pension and Social Security"</li>
                                      <li>• <strong>Stability indicators:</strong> "Homeowner", "Financially stable"</li>
                                    </ul>
                                  </div>

                                  <div>
                                    <h5 className="font-medium text-blue-800 mb-2">💪 Strong Examples:</h5>
                                    <div className="bg-green-50 border border-green-200 rounded p-3 text-sm">
                                      <p><strong>Excellent:</strong> "Retired federal employee (1985-2020) with full pension and Social Security benefits"</p>
                                      <p><strong>Good:</strong> "Retired high school teacher after 32 years. Receiving state pension."</p>
                                      <p><strong>Basic:</strong> "Retired nurse with Social Security and 401k"</p>
                                    </div>
                                  </div>

                                  <div>
                                    <h5 className="font-medium text-blue-800 mb-2">❌ What to Avoid:</h5>
                                    <ul className="space-y-1 text-sm ml-4">
                                      <li>• Health problems or medical reasons for retirement</li>
                                      <li>• Financial struggles or insufficient income</li>
                                      <li>• Vague statements like just "Retired"</li>
                                      <li>• Recent job loss described as retirement</li>
                                    </ul>
                                  </div>

                                  <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                                    <p className="text-sm"><strong>💡 Pro Tip:</strong> Strong retirement descriptions show financial stability and professional history, which helps demonstrate your ability to support your fiancé(e).</p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : entry.type === 'other' ? (
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                value={entry.organization || ''}
                                onChange={(e) => {
                                  const newEntries = [...chronologicalEntries];
                                  newEntries[index] = { ...entry, organization: e.target.value };
                                  updateField(timelineFieldId, newEntries);
                                }}
                                placeholder="e.g., Weekend volunteer at local food bank"
                              />

                              <button
                                type="button"
                                onClick={() => {
                                  const newEntries = [...chronologicalEntries];
                                  newEntries[index] = {
                                    ...entry,
                                    showOtherHelp: !entry.showOtherHelp
                                  };
                                  updateField(timelineFieldId, newEntries);
                                }}
                                className="px-3 py-2 text-sm bg-blue-100 text-blue-700 border border-blue-300 rounded hover:bg-blue-200 transition-colors whitespace-nowrap"
                              >
                                ℹ️ How to write a good description
                              </button>
                            </div>

                            {/* Collapsible help panel */}
                            {entry.showOtherHelp && (
                              <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm">
                                <div className="flex justify-between items-start mb-3">
                                  <h4 className="font-medium text-blue-800">Writing Strong "Other/Personal Time" Descriptions</h4>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newEntries = [...chronologicalEntries];
                                      newEntries[index] = {
                                        ...entry,
                                        showOtherHelp: false
                                      };
                                      updateField(timelineFieldId, newEntries);
                                    }}
                                    className="text-blue-600 hover:text-blue-800 text-lg leading-none"
                                  >
                                    ×
                                  </button>
                                </div>

                                <div className="space-y-4 text-blue-700">
                                  <div>
                                    <h5 className="font-medium text-blue-800 mb-2">What Makes a Strong Description:</h5>
                                    <p className="text-sm mb-3">Clear, specific, and shows legitimate use of your time</p>
                                    <h5 className="font-medium text-blue-800 mb-2">Writing Approach:</h5>
                                    <ul className="space-y-1 text-sm ml-4">
                                      <li><strong>✏️ BE DIRECT:</strong> Be direct and factual - include enough detail to paint a clear picture</li>
                                      <li><strong>💡 ADD CONTEXT:</strong> Include location or circumstances that explain the situation</li>
                                      <li><strong>⚠️ AVOID VAGUENESS:</strong> Generic descriptions don't give enough information about what you were actually doing</li>
                                    </ul>
                                  </div>

                                  <div>
                                    <h5 className="font-medium text-blue-800 mb-2">Before/After Examples:</h5>
                                    <div className="space-y-3 text-sm">
                                      <div className="bg-red-50 border border-red-200 rounded p-3">
                                        <p><strong>❌ WEAK:</strong> "Taking a break from work to focus on myself and spend time with family"</p>
                                      </div>
                                      <div className="bg-green-50 border border-green-200 rounded p-3">
                                        <p><strong>✅ STRONG:</strong> "Extended stay in Colombia to care for elderly grandmother and handle family affairs"</p>
                                      </div>
                                      <p className="text-xs text-blue-600"><strong>Why the difference?</strong> The weak version uses vague phrases like "focus on myself" and "spend time with family" that don't explain what you were actually doing, while the strong version gives specific context about caregiving and location.</p>
                                    </div>
                                  </div>

                                  <div>
                                    <h5 className="font-medium text-blue-800 mb-2">Quick Quality Checklist:</h5>
                                    <ul className="space-y-1 text-sm ml-4">
                                      <li>✅ Specific activity or situation</li>
                                      <li>✅ Location or context included</li>
                                      <li>✅ Legitimate reason or purpose (if applicable)</li>
                                    </ul>
                                  </div>


                                  <div>
                                    <h5 className="font-medium text-blue-800 mb-2">Examples That Work:</h5>
                                    <div className="bg-green-50 border border-green-200 rounded p-3 text-sm space-y-1">
                                      <p><strong>Travel:</strong> "Cultural immersion trip through Southeast Asia to study languages and local customs"</p>
                                      <p><strong>Family:</strong> "Primary caregiver for aging parent recovering from major surgery"</p>
                                      <p><strong>Transition:</strong> "Relocation period between countries while handling immigration paperwork"</p>
                                    </div>
                                  </div>

                                </div>
                              </div>
                            )}
                          </div>
                        ) : entry.type === 'homemaker' ? (
                          <div></div>
                        ) : entry.type === 'military' ? (
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                value={entry.organization || ''}
                                onChange={(e) => {
                                  const newEntries = [...chronologicalEntries];
                                  newEntries[index] = { ...entry, organization: e.target.value };
                                  updateField(timelineFieldId, newEntries);
                                }}
                                placeholder="e.g., U.S. Army, Royal Navy, German Armed Forces, U.S. Air Force Reserve"
                              />

                              <button
                                type="button"
                                onClick={() => {
                                  const newEntries = [...chronologicalEntries];
                                  newEntries[index] = {
                                    ...entry,
                                    showMilitaryHelp: !entry.showMilitaryHelp
                                  };
                                  updateField(timelineFieldId, newEntries);
                                }}
                                className="px-3 py-2 text-sm bg-blue-100 text-blue-700 border border-blue-300 rounded hover:bg-blue-200 transition-colors whitespace-nowrap"
                              >
                                ℹ️ Examples
                              </button>
                            </div>

                            {/* Collapsible help panel */}
                            {entry.showMilitaryHelp && (
                              <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm">
                                <div className="flex justify-between items-start mb-3">
                                  <h4 className="font-medium text-blue-800">Military Service Examples</h4>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newEntries = [...chronologicalEntries];
                                      newEntries[index] = {
                                        ...entry,
                                        showMilitaryHelp: false
                                      };
                                      updateField(timelineFieldId, newEntries);
                                    }}
                                    className="text-blue-600 hover:text-blue-800 text-xs"
                                  >
                                    ✕ Close
                                  </button>
                                </div>

                                <div className="space-y-3">
                                  <div>
                                    <h5 className="font-medium text-blue-800 mb-2">U.S. Military Examples:</h5>
                                    <div className="bg-green-50 border border-green-200 rounded p-3 text-sm space-y-1">
                                      <p><strong>U.S. Army</strong> (for active duty service)</p>
                                      <p><strong>U.S. Navy Reserve</strong> (for reserve service)</p>
                                      <p><strong>Air National Guard</strong> (for National Guard service)</p>
                                      <p><strong>U.S. Marine Corps</strong> (for Marine service)</p>
                                    </div>
                                  </div>

                                  <div>
                                    <h5 className="font-medium text-blue-800 mb-2">International Examples:</h5>
                                    <div className="bg-green-50 border border-green-200 rounded p-3 text-sm space-y-1">
                                      <p><strong>Royal Navy</strong> (United Kingdom)</p>
                                      <p><strong>German Armed Forces</strong> (Germany)</p>
                                      <p><strong>Israeli Defense Forces</strong> (Israel)</p>
                                      <p><strong>Royal Canadian Army</strong> (Canada)</p>
                                    </div>
                                  </div>

                                  <div className="text-xs text-blue-600">
                                    <strong>💡 Tip:</strong> Include the branch name and country.
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <input
                            type="text"
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                            value={entry.organization || ''}
                            onChange={(e) => {
                              const newEntries = [...chronologicalEntries];
                              newEntries[index] = { ...entry, organization: e.target.value };
                              updateField(timelineFieldId, newEntries);
                            }}
                            placeholder={(() => {
                              const placeholders = {
                                'working': 'ABC Company Inc.',
                                'in-education': 'University of ABC',
                                'military': 'U.S. Army',
                                'caregiving': 'Homemaker',
                                'retired': 'Retired',
                                'unable-to-work': 'Medical Leave',
                                'other': 'Describe your activity'
                              };
                              return placeholders[entry.type] || 'Enter details';
                            })()}
                          />
                        )}

                      </div>

                      {/* Job Title/Position - Required for working, military, and education */}
                      {(entry.type === 'working' || entry.type === 'military' || entry.type === 'in-education') && (
                        <>
                          <div>
                            <label className="block text-sm font-medium mb-1">
                              {entry.type === 'working' ? 'Job Title' :
                                entry.type === 'military' ? 'Rank/Position' : 'Program/Degree'}
                            </label>
                            {entry.type === 'in-education' ? (
                              <div>
                                <select
                                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                  value={entry.jobTitle || ''}
                                  onChange={(e) => {
                                    const newEntries = [...chronologicalEntries];
                                    newEntries[index] = { ...entry, jobTitle: e.target.value };
                                    updateField(timelineFieldId, newEntries);
                                  }}
                                >
                                  <option value="">Select program type...</option>
                                  <option value="High School Program">High School Program</option>
                                  <option value="Certificate/Vocational Program">Certificate/Vocational Program</option>
                                  <option value="Associate Degree Program">Associate Degree Program</option>
                                  <option value="Bachelor's Degree Program">Bachelor's Degree Program</option>
                                  <option value="Master's Degree Program">Master's Degree Program</option>
                                  <option value="Doctoral Degree Program">Doctoral Degree Program</option>
                                  <option value="Professional Degree Program (J.D., M.D., etc.)">Professional Degree Program (J.D., M.D., etc.)</option>
                                  <option value="Other">Other</option>
                                </select>
                                <p className="text-xs text-gray-600 mt-1">
                                  <strong>Other includes:</strong> GED preparation classes, adult education programs, language/ESL courses, continuing education, professional development courses, online certification programs, or any educational activities not listed above.
                                </p>
                              </div>
                            ) : (
                              <input
                                type="text"
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                value={entry.jobTitle || ''}
                                onChange={(e) => {
                                  const newEntries = [...chronologicalEntries];
                                  newEntries[index] = { ...entry, jobTitle: e.target.value };
                                  updateField(timelineFieldId, newEntries);
                                }}
                                placeholder={
                                  entry.type === 'working' ? 'Software Engineer' : 'Sergeant'
                                }
                              />
                            )}
                          </div>

                          {/* Employment Status - Full-time/Part-time (not for military, homemaker, or unable-to-work) */}
                          {entry.type === 'working' && (
                            <div>
                              <label className="block text-sm font-medium mb-1">
                                Employment Type
                              </label>
                              <select
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                value={entry.employmentStatus || ''}
                                onChange={(e) => {
                                  const newEntries = [...chronologicalEntries];
                                  newEntries[index] = { ...entry, employmentStatus: e.target.value };
                                  updateField(timelineFieldId, newEntries);
                                }}
                              >
                                <option value="">Select...</option>
                                <option value="Full-time">Full-time</option>
                                <option value="Part-time">Part-time</option>
                                <option value="Contract">Contract</option>
                                <option value="Self-employed">Self-employed</option>
                              </select>
                            </div>
                          )}
                          {entry.type === 'in-education' && (
                            <div>
                              <label className="block text-sm font-medium mb-1">
                                Enrollment Status
                              </label>
                              <select
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                value={entry.employmentStatus || ''}
                                onChange={(e) => {
                                  const newEntries = [...chronologicalEntries];
                                  newEntries[index] = { ...entry, employmentStatus: e.target.value };
                                  updateField(timelineFieldId, newEntries);
                                }}
                              >
                                <option value="">Select...</option>
                                <option value="Full-time">Full-time</option>
                                <option value="Part-time">Part-time</option>
                              </select>
                            </div>
                          )}
                        </>
                      )}

                      {/* Date Range - Start and End Date side by side */}
                      <div>
                        <label className="block text-sm font-medium mb-1">Start Date</label>
                        {/* All entries: User controls start date */}
                        <input
                          type="date"
                          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                          value={entry.startDate || ''}
                          max={index === 0 ? new Date().toISOString().split('T')[0] : (chronologicalEntries[index - 1]?.startDate || new Date().toISOString().split('T')[0])}
                          onChange={(e) => {
                            const newEntries = [...chronologicalEntries];
                            newEntries[index] = { ...entry, startDate: e.target.value };

                            // Auto-update the end date of the next entry (Entry N+1) to match this start date
                            if (newEntries[index + 1]) {
                              newEntries[index + 1] = { ...newEntries[index + 1], endDate: e.target.value };
                            }

                            updateField(timelineFieldId, newEntries);
                          }}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">End Date</label>
                        {(entry.isCurrent || index === 0) ? (
                          // Current Activity: Show "Present" and make field read-only
                          <input
                            type="text"
                            className="w-full p-2 border rounded bg-gray-100 focus:ring-2 focus:ring-blue-500"
                            value="Present"
                            disabled={true}
                            placeholder="Present (Current Activity)"
                          />
                        ) : (
                          // Allow user to set any end date (supports overlapping periods)
                          <input
                            type="date"
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                            value={entry.endDate || ''}
                            min={entry.startDate}
                            max={new Date().toISOString().split('T')[0]}
                            placeholder="End date"
                            onChange={(e) => {
                              const newEntries = [...chronologicalEntries];
                              newEntries[index] = { ...entry, endDate: e.target.value };
                              updateField(timelineFieldId, newEntries);
                            }}
                          />
                        )}
                        <div className="flex items-center space-x-2 mt-2">
                          {index === 0 ? (
                            // Entry 1 (most recent) is always current
                            <div className="flex items-center text-sm text-green-700">
                              <input
                                type="checkbox"
                                className="mr-1"
                                checked={true}
                                disabled={true}
                              />
                              <span className="font-medium">Current (Most Recent)</span>
                            </div>
                          ) : (
                            // Entry 2+ cannot be current
                            <div className="text-sm text-gray-500 italic">
                              Historical activity
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Address - Required for ALL types per USCIS Form I-129F */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">
                          Address {(() => {
                            const addressLabels = {
                              'working': '(Employer Address)',
                              'in-education': '(School Address)',
                              'seeking-work': '(Your Residence During This Period)',
                              'caregiving': '(Your Residence During This Period)',
                              'retired': '(Your Residence During This Period)',
                              'unable-to-work': '(Your Residence During This Period)',
                              'military': '(Base/Unit Address)',
                              'other': '(Relevant Address for This Period)'
                            };
                            return addressLabels[entry.type] || '';
                          })()}
                        </label>

                        {/* Smart address handling */}
                        {(entry.type === 'caregiving' || entry.type === 'seeking-work' ||
                          entry.type === 'retired' || entry.type === 'unable-to-work') ? (
                          <div className="space-y-2">
                            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-sm">
                              💡 For {entry.type === 'caregiving' ? 'caregiving' : (entry.type || '').replace('-', ' ')} periods, USCIS typically expects your home address during this time.
                              We can pre-fill this with your current address, but please update if you lived elsewhere.
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                // Pre-fill with current address from earlier sections
                                const newEntries = [...chronologicalEntries];
                                // Get current address from sponsor's current address section
                                const currentAddress = currentData['sponsorCurrentAddress'] || {};
                                newEntries[index] = {
                                  ...entry,
                                  country: currentAddress.country || 'United States',
                                  streetAddress: currentAddress.street || '',
                                  unitType: currentAddress.unitType || '',
                                  unitNumber: currentAddress.unitNumber || '',
                                  city: currentAddress.city || '',
                                  state: currentAddress.state || '',
                                  zipCode: currentAddress.zipCode || ''
                                };
                                updateField(timelineFieldId, newEntries);
                              }}
                              className="mb-2 px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200"
                            >
                              Use Current Home Address
                            </button>
                          </div>
                        ) : null}

                        {/* Smart Country-Based Address System */}
                        <div className="space-y-3">
                          {/* Country Selection */}
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Country</label>
                            <select
                              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                              value={entry.country || ''}
                              onChange={(e) => {
                                const newEntries = [...chronologicalEntries];
                                newEntries[index] = { ...entry, country: e.target.value, state: '', zipCode: '' };
                                updateField(timelineFieldId, newEntries);
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

                          {entry.country && (
                            <>
                              {/* Street Address and Unit Details */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-1">Street Address</label>
                                  <input
                                    type="text"
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                    value={entry.streetAddress || ''}
                                    onChange={(e) => {
                                      const newEntries = [...chronologicalEntries];
                                      newEntries[index] = { ...entry, streetAddress: e.target.value };
                                      updateField(timelineFieldId, newEntries);
                                    }}
                                    placeholder="123 Main Street"
                                  />
                                </div>

                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-1">Unit Details (Optional)</label>
                                  <div className="grid grid-cols-2 gap-2">
                                    <select
                                      className="p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                      value={entry.unitType || ''}
                                      onChange={(e) => {
                                        const newEntries = [...chronologicalEntries];
                                        newEntries[index] = { ...entry, unitType: e.target.value };
                                        updateField(timelineFieldId, newEntries);
                                      }}
                                    >
                                      <option value="">Select type...</option>
                                      <option value="Apartment">Apartment</option>
                                      <option value="Suite">Suite</option>
                                      <option value="Floor">Floor</option>
                                    </select>
                                    <input
                                      type="text"
                                      className="p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                      value={entry.unitNumber || ''}
                                      onChange={(e) => {
                                        const newEntries = [...chronologicalEntries];
                                        newEntries[index] = { ...entry, unitNumber: e.target.value };
                                        updateField(timelineFieldId, newEntries);
                                      }}
                                      placeholder="Number/ID"
                                      disabled={!entry.unitType}
                                    />
                                  </div>
                                </div>
                              </div>

                              {/* City and State/Province */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-1">
                                    {entry.country === 'United Kingdom' ? 'Town/City' : 'City'}
                                  </label>
                                  <input
                                    type="text"
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                    value={entry.city || ''}
                                    onChange={(e) => {
                                      const newEntries = [...chronologicalEntries];
                                      newEntries[index] = { ...entry, city: e.target.value };
                                      updateField(timelineFieldId, newEntries);
                                    }}
                                    placeholder={entry.country === 'United Kingdom' ? 'London' : 'City name'}
                                  />
                                </div>

                                {/* State - US only */}
                                {entry.country === 'United States' && (() => {
                                  const countryFormat = addressFormats[entry.country];
                                  return (
                                    <div>
                                      <label className="block text-xs font-medium text-gray-600 mb-1">State</label>
                                      <select
                                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                        value={entry.state || ''}
                                        onChange={(e) => {
                                          const newEntries = [...chronologicalEntries];
                                          newEntries[index] = { ...entry, state: e.target.value };
                                          updateField(timelineFieldId, newEntries);
                                        }}
                                      >
                                        <option value="">Select state...</option>
                                        {countryFormat.states.map(stateOption => (
                                          <option key={stateOption} value={stateOption}>{stateOption}</option>
                                        ))}
                                      </select>
                                    </div>
                                  );
                                })()}

                                {/* Province/Region - non-US only */}
                                {entry.country !== 'United States' && (() => {
                                  const countryFormat = addressFormats[entry.country] || {};
                                  if (countryFormat.provinceNA) return null;
                                  return (
                                    <div>
                                      <label className="block text-xs font-medium text-gray-600 mb-1">
                                        {countryFormat.provinceLabel || 'Province'}
                                      </label>
                                      {countryFormat.states ? (
                                        <select
                                          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                          value={entry.state || ''}
                                          onChange={(e) => {
                                            const newEntries = [...chronologicalEntries];
                                            newEntries[index] = { ...entry, state: e.target.value };
                                            updateField(timelineFieldId, newEntries);
                                          }}
                                        >
                                          <option value="">Select {(countryFormat.provinceLabel || 'province').toLowerCase()}...</option>
                                          {countryFormat.states.map(stateOption => (
                                            <option key={stateOption} value={stateOption}>{stateOption}</option>
                                          ))}
                                        </select>
                                      ) : (
                                        <input
                                          type="text"
                                          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                          value={entry.state || ''}
                                          onChange={(e) => {
                                            const newEntries = [...chronologicalEntries];
                                            newEntries[index] = { ...entry, state: e.target.value };
                                            updateField(timelineFieldId, newEntries);
                                          }}
                                          placeholder={`Enter ${(countryFormat.provinceLabel || 'province').toLowerCase()}`}
                                        />
                                      )}
                                    </div>
                                  );
                                })()}
                              </div>

                              {/* Postal Code */}
                              <div>
                                {(() => {
                                  const countryFormat = addressFormats[entry.country] || addressFormats['United States'];
                                  return (
                                    <>
                                      <label className="block text-xs font-medium text-gray-600 mb-1">
                                        {countryFormat.postalLabel || 'Postal Code'}
                                      </label>
                                      <input
                                        type="text"
                                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                        value={entry.zipCode || ''}
                                        onChange={(e) => {
                                          const formatted = formatPostalCode(e.target.value, entry.country);
                                          const newEntries = [...chronologicalEntries];
                                          newEntries[index] = { ...entry, zipCode: formatted };
                                          updateField(timelineFieldId, newEntries);
                                        }}
                                        placeholder={countryFormat.postalPlaceholder || 'Enter postal code'}
                                      />

                                      {/* ZIP Code validation */}
                                      {entry.zipCode && !countryFormat.postalFormat.test(entry.zipCode) && (
                                        <div className="text-sm text-orange-600 flex items-center mt-1">
                                          <span>Please enter a valid {countryFormat.postalLabel.toLowerCase()} for {entry.country}</span>
                                        </div>
                                      )}
                                    </>
                                  );
                                })()}
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })}

              {/* Add New Entry Button */}
              <button
                type="button"
                onClick={() => {
                  const isFirstEntry = chronologicalEntries.length === 0;

                  const newEntry = {
                    type: '',
                    organization: '',
                    startDate: '', // User will set this
                    endDate: isFirstEntry ? null : '', // First entry has null end date (current), others will auto-connect
                    isCurrent: isFirstEntry // Only first entry is current
                  };

                  const newEntries = [...chronologicalEntries, newEntry];
                  updateField(timelineFieldId, newEntries);
                }}
                className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors"
              >
                + Add Work Period
              </button>
            </div>
          </div>
        );
      }
      case 'timeline-summary': {
        // Determine which timeline field to use based on field ID
        const summaryTimelineFieldId = field.id.includes('beneficiary') ? 'beneficiaryTimelineEntries' : 'sponsorTimelineEntries';
        const summaryEntries = currentData[summaryTimelineFieldId] || [{}];

        if (summaryEntries.length === 0 || (summaryEntries.length === 1 && !summaryEntries[0].type)) {
          return (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
              <p className="text-yellow-800">⚠️ Please add at least one work period to your history above.</p>
            </div>
          );
        }

        // Get timeline coverage for display
        const summaryCoverage = calculateTimelineCoverage(summaryEntries.filter(entry => entry.type));

        // Helper function to get display name for employment types
        const getDisplayName = (entry) => {
          if (entry.type === 'working') {
            return entry.organization || 'Employment';
          }

          const typeDisplayNames = {
            'homemaker': 'Homemaker',
            'student': 'Student',
            'retired': 'Retired',
            'military': 'Military Service',
            'unable-to-work': 'Unable to Work',
            'other': 'Personal Time'
          };

          return typeDisplayNames[entry.type] || (entry.type || '').replace('-', ' ');
        };

        return (
          <div className="bg-white border rounded-lg p-4">
            <h4 className="font-medium mb-4">📋 Your 5-Year Timeline Summary</h4>

            {/* Coverage status */}
            <div className="mb-4 p-3 rounded border">
              {summaryCoverage.gaps.length === 0 ? (
                <div className="text-green-600 text-sm">
                  ✅ Complete coverage
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-red-600 text-sm">
                    ❌ Coverage incomplete: {summaryCoverage.gaps.length} gap(s) detected
                  </div>
                  <div className="ml-4 space-y-1">
                    {summaryCoverage.gaps.map((gap, index) => (
                      <div key={index} className="text-red-700 text-xs bg-red-50 px-2 py-1 rounded">
                        📅 Gap {index + 1}: {gap.days === 1 ? gap.startDate : `${gap.startDate} to ${gap.endDate}`} ({gap.days} day{gap.days !== 1 ? 's' : ''})
                      </div>
                    ))}
                  </div>
                  <div className="text-gray-600 text-xs">
                    💡 Add work periods, education, or other activities to cover these gaps
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3">
              {summaryEntries
                .filter(entry => entry.type) // Filter out empty entries
                .sort((a, b) => {
                  // Current jobs (no end date) come first
                  const aIsCurrent = a.isCurrent || !a.endDate;
                  const bIsCurrent = b.isCurrent || !b.endDate;

                  if (aIsCurrent && !bIsCurrent) return -1;
                  if (!aIsCurrent && bIsCurrent) return 1;

                  // For jobs of same type (both current or both historical), sort by start date descending
                  const aStartDate = new Date(a.startDate || '1970-01-01');
                  const bStartDate = new Date(b.startDate || '1970-01-01');
                  return bStartDate - aStartDate;
                })
                .map((entry, index) => {
                  // Check if this entry overlaps with others
                  const hasOverlaps = summaryEntries.filter(otherEntry => {
                    if (otherEntry === entry || !otherEntry.type) return false;

                    const entryStart = new Date(entry.startDate);
                    const entryEnd = (entry.isCurrent || !entry.endDate) ? new Date() : new Date(entry.endDate);
                    const otherStart = new Date(otherEntry.startDate);
                    const otherEnd = (otherEntry.isCurrent || !otherEntry.endDate) ? new Date() : new Date(otherEntry.endDate);

                    return entryStart <= otherEnd && entryEnd >= otherStart;
                  }).length > 0;

                  return (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                      <div>
                        <span className="font-medium">
                          {getDisplayName(entry)}
                          {(entry.isCurrent || !entry.endDate) && <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Current</span>}
                          {hasOverlaps && <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Overlapping</span>}
                        </span>
                        {entry.jobTitle && <span className="text-gray-600"> - {entry.jobTitle}</span>}
                      </div>
                      <span className="text-sm text-gray-500">
                        {entry.startDate} → {(entry.isCurrent || !entry.endDate) ? 'Present' : (entry.endDate || 'Not specified')}
                      </span>
                    </div>
                  );
                })}
            </div>

          </div>
        );
      }
      case 'beneficiary-legal-screening': {
        const beneficiaryFirstName = currentData['beneficiaryFirstName'] || '[BeneficiaryFirstName]';
        const criminalHistory = currentData['beneficiaryCriminalHistory'] || '';
        const immigrationIssues = currentData['beneficiaryImmigrationIssues'] || '';
        const healthConcerns = currentData['beneficiaryHealthConcerns'] || '';
        const securityViolations = currentData['beneficiarySecurityViolations'] || '';

        return (
          <div className="space-y-8">
            {/* Introduction */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">Why we ask these questions</h3>
                  <p className="mt-2 text-sm text-blue-700">
                    The DS-160 form requires comprehensive background screening for all K-1 visa beneficiaries. These questions help us identify if your case requires specialized guidance.
                  </p>
                </div>
              </div>
            </div>

            {/* Question 1: Criminal History */}
            <div className="space-y-4">
              <h4 className="text-base font-semibold text-gray-900">
                Has {beneficiaryFirstName} ever been arrested, charged, or convicted of:
              </h4>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <ul className="text-sm text-gray-700 space-y-1 ml-4 list-disc">
                  <li>Any crime (including expunged, dismissed, or pardoned cases)</li>
                  <li>Drug offenses (controlled substances)</li>
                  <li>Prostitution, solicitation, or procuring prostitutes (past 10 years)</li>
                  <li>Money laundering</li>
                  <li>Child custody violations or international child abduction</li>
                  <li>Human trafficking or aiding human traffickers</li>
                </ul>

                <div className="mt-3 text-sm text-gray-600 bg-blue-50 border-l-4 border-blue-300 pl-3 py-2 rounded">
                  <span>💡 </span>
                  <div className="space-y-2">
                    <p>Important information:</p>
                    <ul className="ml-4 list-disc space-y-1">
                      <li>Include arrests even if charges were dropped or dismissed</li>
                      <li>Include convictions even if expunged, sealed, or pardoned</li>
                      <li>Include violations from ANY country, not just the United States</li>
                      <li>Exclude minor traffic infractions (speeding tickets, parking violations) unless they involved alcohol, drugs, reckless driving, or resulted in arrest</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-center space-x-3 p-4 border-2 border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="beneficiaryCriminalHistory"
                    value="Yes"
                    checked={criminalHistory === 'Yes'}
                    onChange={(e) => updateField('beneficiaryCriminalHistory', e.target.value)}
                    className="h-4 w-4 text-blue-600"
                  />
                  <span className="text-sm font-medium text-gray-900">Yes</span>
                </label>

                <label className="flex items-center space-x-3 p-4 border-2 border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="beneficiaryCriminalHistory"
                    value="No"
                    checked={criminalHistory === 'No'}
                    onChange={(e) => updateField('beneficiaryCriminalHistory', e.target.value)}
                    className="h-4 w-4 text-blue-600"
                  />
                  <span className="text-sm font-medium text-gray-900">No</span>
                </label>
              </div>

              {criminalHistory === 'Yes' && (
                <div className="mt-4 p-6 bg-red-50 border-l-4 border-red-400 rounded">
                  <div className="flex items-start">
                    <svg className="h-6 w-6 text-red-600 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div className="flex-1">
                      <p className="text-base font-semibold text-red-800 mb-2">
                        Your situation requires individual review
                      </p>
                      <p className="text-sm text-red-700 mb-4">
                        Based on your answer, your situation is complex and requires personalized guidance. Please contact our customer service team to discuss your options.
                      </p>
                      <button
                        type="button"
                        onClick={() => window.location.href = 'mailto:support@example.com?subject=K-1 Visa Application - Criminal History Question'}
                        className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded transition-colors"
                      >
                        Contact Customer Service
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Question 2: Immigration Issues */}
            <div className={`space-y-4 ${criminalHistory === 'Yes' ? 'opacity-50 pointer-events-none' : ''}`}>
              <h4 className="text-base font-semibold text-gray-900">
                Has {beneficiaryFirstName} ever:
              </h4>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <ul className="text-sm text-gray-700 space-y-1 ml-4 list-disc">
                  <li>Been refused a U.S. visa, denied entry, or had a visa canceled/revoked?</li>
                  <li>Been deported or removed from any country?</li>
                  <li>Been unlawfully present in the U.S. for more than 6 months?</li>
                  <li>Sought to obtain a visa or U.S. entry through fraud or misrepresentation?</li>
                  <li>Withheld custody of a U.S. citizen child from a person with legal custody?</li>
                  <li>Voted in the United States illegally?</li>
                  <li>Renounced U.S. citizenship for tax avoidance purposes?</li>
                </ul>
              </div>

              <div className="space-y-3">
                <label className="flex items-center space-x-3 p-4 border-2 border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="beneficiaryImmigrationIssues"
                    value="Yes"
                    checked={immigrationIssues === 'Yes'}
                    onChange={(e) => updateField('beneficiaryImmigrationIssues', e.target.value)}
                    className="h-4 w-4 text-blue-600"
                  />
                  <span className="text-sm font-medium text-gray-900">Yes</span>
                </label>

                <label className="flex items-center space-x-3 p-4 border-2 border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="beneficiaryImmigrationIssues"
                    value="No"
                    checked={immigrationIssues === 'No'}
                    onChange={(e) => updateField('beneficiaryImmigrationIssues', e.target.value)}
                    className="h-4 w-4 text-blue-600"
                  />
                  <span className="text-sm font-medium text-gray-900">No</span>
                </label>
              </div>

              {immigrationIssues === 'Yes' && (
                <div className="mt-4 p-6 bg-red-50 border-l-4 border-red-400 rounded">
                  <div className="flex items-start">
                    <svg className="h-6 w-6 text-red-600 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div className="flex-1">
                      <p className="text-base font-semibold text-red-800 mb-2">
                        Your situation requires individual review
                      </p>
                      <p className="text-sm text-red-700 mb-4">
                        Based on your answer, your situation is complex and requires personalized guidance. Please contact our customer service team to discuss your options.
                      </p>
                      <button
                        type="button"
                        onClick={() => window.location.href = 'mailto:support@example.com?subject=K-1 Visa Application - Immigration Issues Question'}
                        className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded transition-colors"
                      >
                        Contact Customer Service
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Question 3: Health & Vaccinations */}
            <div className={`space-y-4 ${criminalHistory === 'Yes' || immigrationIssues === 'Yes' ? 'opacity-50 pointer-events-none' : ''}`}>
              <h4 className="text-base font-semibold text-gray-900">
                Does {beneficiaryFirstName} have any of the following:
              </h4>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2">
                <ul className="text-sm text-gray-700 space-y-2 ml-4 list-disc">
                  <li>
                    <strong>Communicable disease of public health significance</strong>
                    <p className="text-xs text-gray-600 mt-1">Examples: Active tuberculosis, infectious syphilis, gonorrhea, infectious leprosy. <span className="italic">Note: HIV is not on this list.</span></p>
                  </li>
                  <li>
                    <strong>Mental or physical disorder that poses a threat to safety</strong>
                    <p className="text-xs text-gray-600 mt-1">Requires BOTH a disorder AND history of harmful behavior (e.g., DUI arrests, assaults, suicide attempts, violent threats). Having depression, anxiety, or a disability alone does NOT make you inadmissible.</p>
                  </li>
                  <li>
                    <strong>Drug abuse or addiction (current or past)</strong>
                    <p className="text-xs text-gray-600 mt-1">Answer "Yes" if you currently have or have ever had a drug abuse or addiction problem based on clinical diagnosis (DSM criteria). One-time use doesn't count. If you've been in sustained remission for 12+ months with documented treatment and no longer meet DSM criteria for substance use disorder, you may answer "No".</p>
                  </li>
                  <li>
                    <strong>Lack of required vaccination documentation</strong>
                    <p className="text-xs text-gray-600 mt-1">Answer "Yes" only if you cannot obtain vaccination records or have medical/religious objections that haven't been formally documented.</p>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <label className="flex items-center space-x-3 p-4 border-2 border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="beneficiaryHealthConcerns"
                    value="Yes"
                    checked={healthConcerns === 'Yes'}
                    onChange={(e) => updateField('beneficiaryHealthConcerns', e.target.value)}
                    className="h-4 w-4 text-blue-600"
                  />
                  <span className="text-sm font-medium text-gray-900">Yes</span>
                </label>

                <label className="flex items-center space-x-3 p-4 border-2 border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="beneficiaryHealthConcerns"
                    value="No"
                    checked={healthConcerns === 'No'}
                    onChange={(e) => updateField('beneficiaryHealthConcerns', e.target.value)}
                    className="h-4 w-4 text-blue-600"
                  />
                  <span className="text-sm font-medium text-gray-900">No</span>
                </label>
              </div>

              {healthConcerns === 'Yes' && (
                <div className="mt-4 p-6 bg-red-50 border-l-4 border-red-400 rounded">
                  <div className="flex items-start">
                    <svg className="h-6 w-6 text-red-600 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div className="flex-1">
                      <p className="text-base font-semibold text-red-800 mb-2">
                        Your situation requires individual review
                      </p>
                      <p className="text-sm text-red-700 mb-4">
                        Based on your answer, your situation is complex and requires personalized guidance. Please contact our customer service team to discuss your options.
                      </p>
                      <button
                        type="button"
                        onClick={() => window.location.href = 'mailto:support@example.com?subject=K-1 Visa Application - Health Concerns Question'}
                        className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded transition-colors"
                      >
                        Contact Customer Service
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Question 4: Security & Human Rights Violations */}
            <div className={`space-y-4 ${criminalHistory === 'Yes' || immigrationIssues === 'Yes' || healthConcerns === 'Yes' ? 'opacity-50 pointer-events-none' : ''}`}>
              <h4 className="text-base font-semibold text-gray-900">
                Has {beneficiaryFirstName} ever been involved in or convicted of:
              </h4>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <ul className="text-sm text-gray-700 space-y-1 ml-4 list-disc">
                  <li>Terrorism or support to terrorist organizations</li>
                  <li>Espionage, sabotage, or export control violations</li>
                  <li>Genocide, torture, war crimes, or extrajudicial killings</li>
                  <li>Human trafficking (sex trafficking or labor trafficking)</li>
                  <li>Recruitment or use of child soldiers</li>
                  <li>Religious freedom violations (while serving as government official)</li>
                  <li>Forced abortion/sterilization programs or coercive organ transplantation</li>
                  <li>Member of Communist or totalitarian party</li>
                  <li>Benefited from family member's trafficking or terrorist activities (past 5 years)</li>
                </ul>

                <div className="mt-3 text-sm text-gray-600 bg-blue-50 border-l-4 border-blue-300 pl-3 py-2 rounded">
                  <span>💡 </span>
                  These situations apply to very few people, but the DS-160 requires us to ask about them as part of the visa screening process.
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-center space-x-3 p-4 border-2 border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="beneficiarySecurityViolations"
                    value="Yes"
                    checked={securityViolations === 'Yes'}
                    onChange={(e) => updateField('beneficiarySecurityViolations', e.target.value)}
                    className="h-4 w-4 text-blue-600"
                  />
                  <span className="text-sm font-medium text-gray-900">Yes</span>
                </label>

                <label className="flex items-center space-x-3 p-4 border-2 border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="beneficiarySecurityViolations"
                    value="No"
                    checked={securityViolations === 'No'}
                    onChange={(e) => updateField('beneficiarySecurityViolations', e.target.value)}
                    className="h-4 w-4 text-blue-600"
                  />
                  <span className="text-sm font-medium text-gray-900">No</span>
                </label>
              </div>

              {securityViolations === 'Yes' && (
                <div className="mt-4 p-6 bg-red-50 border-l-4 border-red-400 rounded">
                  <div className="flex items-start">
                    <svg className="h-6 w-6 text-red-600 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div className="flex-1">
                      <p className="text-base font-semibold text-red-800 mb-2">
                        Your situation requires individual review
                      </p>
                      <p className="text-sm text-red-700 mb-4">
                        Based on your answer, your situation is complex and requires personalized guidance. Please contact our customer service team to discuss your options.
                      </p>
                      <button
                        type="button"
                        onClick={() => window.location.href = 'mailto:support@example.com?subject=K-1 Visa Application - Security Violations Question'}
                        className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded transition-colors"
                      >
                        Contact Customer Service
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
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
