# Employment Summary - All Possible "Missing" Messages

This document lists all possible warning messages that can appear in the Employment Summary screen when required fields are incomplete.

## Required Fields by Employment Type

### All Employment Types (Always Required)
1. **Type** - Selected from dropdown (working, seeking-work, in-education, etc.)
2. **Start Date** - Required for all entries
3. **End Date** - Required for all entries (except current/most recent which shows "Present")
4. **Employer Address Fields** (Required for ALL types):
   - Country
   - Street Address
   - City
   - State/Province (if applicable for the country)
   - Postal Code

### Type-Specific Required Fields

#### Working (Employed or Self-Employed)
- **Organization Name** → Shows: `⚠️ Missing Company Name`
- **Job Title** → Shows: `⚠️ Missing Job Title`

#### In Education
- **School/Institution Name** → Shows: `⚠️ Missing School/Institution Name`
- **Program/Degree** → Shows: `⚠️ Missing Job Title`

#### Military Service
- **Branch of Service** → Shows: `⚠️ Missing Military Branch`
- **Rank/Position** → Shows: `⚠️ Missing Job Title`

#### Seeking Work
- **Description** → Shows: `⚠️ Missing Description`
- **Note**: If description is provided, displays "Seeking Work" (not the full text)

#### Other Types (Homemaker, Retired, Unable to Work, Caregiving, Other)
- **Organization/Description** → Shows: `⚠️ Missing Description`
- **No job title required** for these types

---

## Address Missing Field Messages

The address display shows a combined message for ALL missing address fields:

### Format
`📍 ⚠️ Missing: [field1], [field2], [field3]`

### Possible Missing Fields in Address
1. **Country**
2. **Street Address**
3. **City**
4. **State** (for US addresses)
5. **Province/Region/State** (for other countries that require it)
   - Examples: "Province" (Canada), "Prefecture" (Japan), "County" (UK)
6. **Postal Code** (or "ZIP Code" for US)

### Example Messages
- `📍 ⚠️ Missing: Country, Street Address, City, Postal Code`
- `📍 ⚠️ Missing: State, Postal Code`
- `📍 ⚠️ Missing: Street Address`
- `📍 ⚠️ Missing: Country`

---

## Complete Example Displays by Employment Type

### Working - All Fields Complete
```
💼 ABC Company Inc.                    Current
   Software Engineer
   📍 123 Main Street, New York, NY, 10001, United States
   📅 Feb 10, 2025 → Present
```

### Working - Missing Company Name and Address
```
💼 ⚠️ Missing Company Name             Current
   Software Engineer
   📍 ⚠️ Missing: Country, Street Address, City, State, Postal Code
   📅 Feb 10, 2025 → Present
```

### Working - Missing Job Title and Partial Address
```
💼 ABC Company Inc.                    Current
   ⚠️ Missing Job Title
   📍 ⚠️ Missing: City, State, Postal Code
   📅 Feb 10, 2025 → Present
```

### In Education - Complete
```
📚 Harvard University
   Bachelor's Degree Program
   📍 123 College Ave, Cambridge, MA, 02138, United States
   📅 Sep 1, 2020 → Jun 1, 2024
```

### In Education - Missing School and Address
```
📚 ⚠️ Missing School/Institution Name
   Master's Degree Program
   📍 ⚠️ Missing: Country, Street Address, City, State, Postal Code
   📅 Sep 1, 2020 → Jun 1, 2024
```

### Military - Complete
```
🪖 United States Army
   Sergeant
   📍 Fort Benning, Columbus, GA, 31905, United States
   📅 Jan 1, 2018 → Dec 31, 2022
```

### Military - Missing Branch and Address
```
🪖 ⚠️ Missing Military Branch
   ⚠️ Missing Job Title
   📍 ⚠️ Missing: Country, Street Address, City, State, Postal Code
   📅 Jan 1, 2018 → Dec 31, 2022
```

### Seeking Work - Complete
```
🔍 Seeking Work
   📍 123 Main Street, Los Angeles, CA, 90001, United States
   📅 Mar 1, 2024 → Aug 1, 2024
```

### Seeking Work - Missing Description and Address
```
🔍 ⚠️ Missing Description
   📍 ⚠️ Missing: Country, Street Address, City, State, Postal Code
   📅 Mar 1, 2024 → Aug 1, 2024
```

### Homemaker - Complete
```
🏠 Homemaker
   📍 456 Oak Street, Portland, OR, 97201, United States
   📅 Jun 1, 2022 → May 31, 2024
```

### Homemaker - Missing Address
```
🏠 Homemaker
   📍 ⚠️ Missing: Street Address, City
   📅 Jun 1, 2022 → May 31, 2024
```

### Retired - Complete
```
🌴 Retired
   📍 789 Beach Blvd, Miami, FL, 33139, United States
   📅 Jan 1, 2020 → Present
```

### Unable to Work - Complete
```
🏥 Unable to Work
   📍 321 Health Ave, Seattle, WA, 98101, United States
   📅 Apr 1, 2023 → Present
```

---

## Summary of All Possible Warning Messages

### Organization/Company Name Messages
1. `⚠️ Missing Company Name` (for type: working)
2. `⚠️ Missing School/Institution Name` (for type: in-education)
3. `⚠️ Missing Military Branch` (for type: military)
4. `⚠️ Missing Description` (for type: seeking-work, other, caregiving, retired, unable-to-work)

### Job Title Message
5. `⚠️ Missing Job Title` (for types: working, military, in-education)

### Date Messages
6. `⚠️ Missing Start Date` (shown in **red text**)
7. `⚠️ Missing End Date` (shown in **red text**, only for non-current entries)

### Address Messages (Combined Format)
8. `⚠️ Missing: Country`
9. `⚠️ Missing: Street Address`
10. `⚠️ Missing: City`
11. `⚠️ Missing: State` (US only)
12. `⚠️ Missing: Province` (or other regional names for non-US countries)
13. `⚠️ Missing: Postal Code`
14. Any combination of the above (e.g., `⚠️ Missing: Country, Street Address, City, State, Postal Code`)

---

## Bottom Warning Messages (Amber Box)

When employment history is incomplete, a detailed warning message appears at the bottom with specific issues:

### Message 1: No Employment History
```
• You need to add at least one employment entry to cover the last 5 years
```

### Message 2: Incomplete Entries
```
• Some entries are missing required fields (marked with ⚠️ above)
```

### Message 3: Coverage Gaps
```
• Your employment history has gaps - you need to account for all time in the last 5 years (approximately X months)
```

**Example Full Warning:**
```
⚠️ We're missing some information that USCIS requires.
  • Some entries are missing required fields (marked with ⚠️ above)
  • Your employment history has gaps - you need to account for all time in the last 5 years (approximately 3 months)

Click Back to add or edit employment entries.
```

### Status Badges
- **Missing** - No entries at all
- **Incomplete** - Has entries but missing required fields or has gaps
- **Complete** - All entries have required fields and 5-year coverage is complete
