# Manual Case Copy Guide

This guide provides EXACT instructions for copying the remaining 7 large field type cases from App.tsx to FieldRenderer.jsx.

---

## STEP-BY-STEP INSTRUCTIONS

### Prerequisites
1. Open `c:\Users\vnix8\Documents\k1-visa-app\src\App.tsx` in your editor
2. Open `C:\Users\vnix8\Documents\k1-visa-app\src\utils\FieldRenderer.jsx` in a second tab/pane
3. In FieldRenderer.jsx, locate line 2436 (end of `case 'children-list':`)
4. Position your cursor at line 2438 (right BEFORE `default:`)

---

## Case 1: marriage-history

### Find in App.tsx:
- **Start**: Line 3675 `case 'marriage-history': {`
- **End**: Line 3925 `);` (closing of the last return statement)
- **Total lines**: 250

### What to Copy:
```
case 'marriage-history': {
  ... [ALL CONTENT] ...
}
```

### Paste Location in FieldRenderer.jsx:
- **Insert BEFORE**: Line 2438 (`default:`)
- **Insert AFTER**: Line 2436 (end of `case 'children-list':`)

### How to Copy:
1. In App.tsx, go to line 3675
2. Select from `case 'marriage-history': {` down to line 3925 (including the closing `}`)
3. Copy (Ctrl+C / Cmd+C)
4. In FieldRenderer.jsx, position cursor at line 2438 (before `default:`)
5. Paste (Ctrl+V / Cmd+V)
6. **Verify**: The case should end with `);` followed by `}` on separate lines

---

## Case 2: states-countries-list

### Find in App.tsx:
- **Start**: Line 1247 `case 'states-countries-list':`
- **End**: Line 1470 (closing `);` after the return statement)
- **Total lines**: 223

### What to Copy:
```
case 'states-countries-list':
  ... [ALL CONTENT] ...
```

### Paste Location in FieldRenderer.jsx:
- **Insert AFTER**: The `case 'marriage-history':` you just added

### Critical Variables in This Case:
- `sponsorDOBForList`
- `userAge`
- `extractedPlaces`
- `additionalPlaces`

---

## Case 3: conditional-address-history

### Find in App.tsx:
- **Start**: Line 1673 `case 'conditional-address-history': {`
- **End**: Line 1963 (closing `);` and `}`)
- **Total lines**: 290

### What to Copy:
```
case 'conditional-address-history': {
  ... [ALL CONTENT] ...
}
```

### Paste Location in FieldRenderer.jsx:
- **Insert AFTER**: The `case 'states-countries-list':` you just added

### Critical Functions Used:
- `formatPostalCode()`
- `addressFormats[]`
- Date validation logic

---

## Case 4: married-eligibility-check

### Find in App.tsx:
- **Start**: Line 4578 `case 'married-eligibility-check':`
- **End**: Line 4909 `return null;` (end of case)
- **Total lines**: 331

### What to Copy:
```
case 'married-eligibility-check':
  ... [ALL CONTENT] ...
```

### Paste Location in FieldRenderer.jsx:
- **Insert AFTER**: The `case 'conditional-address-history':` you just added

### Special Notes:
- This case has multiple return statements for different eligibility paths
- Includes AOS and Consular processing flows
- Uses `setCurrentData` which must be passed via props

---

## Case 5: chronological-timeline (LARGEST CASE)

### Find in App.tsx:
- **Start**: Line 5407 `case 'chronological-timeline': {`
- **End**: Line 6832 (closing `}` before `case 'timeline-summary':`)
- **Total lines**: 1,425 lines!

### What to Copy:
```
case 'chronological-timeline': {
  ... [ALL CONTENT INCLUDING SUB-CASES] ...
}
```

### Paste Location in FieldRenderer.jsx:
- **Insert AFTER**: The `case 'married-eligibility-check':` you just added

### ⚠️ WARNING - This is the LARGEST case:
- Contains multiple nested sub-cases for different timeline entry types
- Has complex state management for timeline entries
- Includes date validation and overlap detection
- Uses `calculateTimelineCoverage()` function (already added)

### Recommended Approach:
1. Copy in chunks if your editor struggles with 1,425 lines
2. First copy lines 5407-5800 (opening and first sub-cases)
3. Then copy lines 5801-6200 (middle sub-cases)
4. Finally copy lines 6201-6832 (closing sub-cases and return)
5. Verify all opening `{` have closing `}` braces

---

## Case 6: timeline-summary

### Find in App.tsx:
- **Start**: Line 6832 `case 'timeline-summary': {`
- **End**: Line 6944 `);` (closing return)
- **Total lines**: 112

### What to Copy:
```
case 'timeline-summary': {
  ... [ALL CONTENT] ...
}
```

### Paste Location in FieldRenderer.jsx:
- **Insert AFTER**: The `case 'chronological-timeline':` you just added

### Dependencies:
- Uses `calculateTimelineCoverage()` (already added to FieldRenderer.jsx)
- Depends on `sponsorTimelineEntries` or `beneficiaryTimelineEntries`

---

## Case 7: beneficiary-legal-screening

### Find in App.tsx:
- **Start**: Line 6962 `case 'beneficiary-legal-screening': {`
- **End**: Approximately line 7302 (need to find exact end)
- **Total lines**: ~340

### What to Copy:
```
case 'beneficiary-legal-screening': {
  ... [ALL CONTENT] ...
}
```

### Paste Location in FieldRenderer.jsx:
- **Insert AFTER**: The `case 'timeline-summary':` you just added
- **Insert BEFORE**: `default:` case

### How to Find the End:
1. Go to line 6962 in App.tsx
2. Scroll down until you find the NEXT case statement or a closing `}` at the same indentation level
3. The end is typically marked by the closing `}` followed by a blank line or the next case

---

## Verification Steps

After adding each case:

### 1. Syntax Check
```bash
cd c:\Users\vnix8\Documents\k1-visa-app
npm run lint
```

### 2. Visual Check
- All case statements should be at the same indentation level
- Each case should end with `}` or `break;` before the next case
- No orphaned opening or closing braces

### 3. Run Application
```bash
npm run dev
```
- Check browser console for errors
- Test forms that use the new field types

---

## Common Issues and Solutions

### Issue: "Unexpected token" error
**Solution**: Check for missing closing braces `}` or semicolons `;`

### Issue: "Cannot read property of undefined"
**Solution**: Verify all helper functions (like `formatPostalCode`, `addressFormats`) are available in FieldRenderer.jsx

### Issue: "setCurrentData is not defined"
**Solution**: Some cases use `setCurrentData` - these need to be passed as props to FieldRenderer

### Issue: Duplicate case statement
**Solution**: Make sure you didn't accidentally paste the same case twice. Each case name should appear only once.

---

## Final Checklist

After completing all 7 manual additions:

- [ ] All 7 cases pasted into FieldRenderer.jsx
- [ ] All cases appear BEFORE the `default:` case
- [ ] Proper indentation maintained
- [ ] No syntax errors (run `npm run lint`)
- [ ] Application runs without console errors (run `npm run dev`)
- [ ] Test at least one form that uses each new field type

---

## Estimated Time

- Case 1 (marriage-history): ~10 minutes
- Case 2 (states-countries-list): ~8 minutes
- Case 3 (conditional-address-history): ~12 minutes
- Case 4 (married-eligibility-check): ~15 minutes
- Case 5 (chronological-timeline): ~30 minutes (LARGE)
- Case 6 (timeline-summary): ~6 minutes
- Case 7 (beneficiary-legal-screening): ~15 minutes

**Total Estimated Time**: ~1.5-2 hours

---

## Need Help?

If you encounter issues:
1. Check the `FIELD_RENDERER_EXTRACTION_REPORT.md` for overview
2. Verify the source line numbers in App.tsx haven't changed
3. Make sure all helper functions and imports are in place
4. Test incrementally - add one case at a time and test

---

**Last Updated**: 2025-12-16
**Purpose**: Complete the migration of all field types from App.tsx to FieldRenderer.jsx
