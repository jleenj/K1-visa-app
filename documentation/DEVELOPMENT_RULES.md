# Development Rules for Claude Code

## Code Quality Standards
1. **Check existing code first** - Never assume what exists, always verify
2. **Unique variable names** - Use prefixes like `isSSNTouched`, never generic `isFieldTouched`
3. **Form accuracy** - Only include fields actually on official forms
4. **No duplicate logic** - Reuse existing smart fields, don't recreate

## Development Process
1. **Always scan existing smart fields** before creating new ones
2. **Test variable uniqueness** across all case statements  
3. **Reference official forms** for field requirements
4. **Maintain consistent patterns** with existing implementations

## Smart Field Guidelines
- Each field type handles its own validation
- Use `onFocus`/`onBlur` pattern for error display
- Support international formats (phone, address, postal codes)
- Provide helpful user guidance and format examples

## Business Logic Priorities
1. **User experience** - Clear, helpful error messages
2. **Form compliance** - Match official USCIS requirements exactly
3. **International support** - Handle multiple countries properly
4. **Smart defaults** - Auto-populate when possible (address history, etc.)

## Never Implement
- Generic variable names that could conflict
- Fields not on official forms
- localStorage/sessionStorage (not supported in Claude artifacts)
- Duplicate smart field logic