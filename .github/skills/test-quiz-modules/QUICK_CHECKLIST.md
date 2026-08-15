# Quick Daily Checklist (5 min)

Use this when you need a rapid smoke test before committing changes.

## Pre-Test (1 min)
- [ ] Local server running: `python -m http.server 8000`
- [ ] Browser DevTools open (Console tab)

## Test One Module (3 min)
**Pick the module you changed, or rotate through them:**

1. **Load & Open**
   - [ ] Page loads without console errors
   - [ ] Quiz displays (title, question, choices visible)

2. **Quick Scoring Test**
   - [ ] Select correct answer → score increases?
   - [ ] Select wrong answer → score stays same?
   - [ ] Refresh page → no console errors?

3. **Mobile Check (1 min)**
   - [ ] Open DevTools → Toggle device toolbar
   - [ ] Resize to 375px width → layout doesn't break?
   - [ ] Buttons still clickable?

## Post-Test (1 min)
- [ ] No errors in Console ✓ = GREEN LIGHT (safe to commit)
- [ ] Errors in Console ✗ = RED LIGHT (investigate before commit)

---

**Log result:**
```
✓ [module name] - [date] - PASS
✗ [module name] - [date] - FAIL - [issue]
```
