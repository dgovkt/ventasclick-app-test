# Stress Test Guide
## How to Run Comprehensive Tests on Socios Ventas Click

This guide explains how to use the stress testing tools to validate all features and functionalities of the platform.

---

## Quick Start

### Option 1: Interactive HTML Test Runner (Recommended)

1. Open `stress-test-runner.html` in your browser
2. Add your Supabase credentials to the URL:
   ```
   stress-test-runner.html?url=YOUR_SUPABASE_URL&key=YOUR_SUPABASE_ANON_KEY
   ```
3. Click "Run All Tests" button
4. Watch the progress and review results

**Features:**
- 80+ automated tests
- Visual progress tracking
- Real-time logging
- Detailed pass/fail indicators
- Test organization by feature area

### Option 2: Database Load Testing

1. Review `stress-test-data.sql`
2. Create test users through the auth system first
3. Update the SQL script with actual user IDs
4. Run the script against your Supabase database:
   ```bash
   psql YOUR_DATABASE_URL -f stress-test-data.sql
   ```

**Generates:**
- 100 test leads
- 50 test sales
- 30 success cases
- 50 customer reviews
- 40 wizard results
- 20 KB articles

### Option 3: Manual Feature Testing

Follow the test scenarios in `STRESS_TEST_REPORT.md` Section 12:

1. **Concurrent User Logins** - Register 50 users simultaneously
2. **Bulk Lead Creation** - Create 1000 leads
3. **Complex Query Performance** - Load dashboard with 10k records
4. **Commission Calculation** - Calculate 1000 commissions
5. **Content Block Loading** - Load all content
6. **RLS Policy Enforcement** - Test cross-user access
7. **Public Review Submission** - Submit 100 anonymous reviews
8. **Wizard Flow Completion** - Complete 50 wizard sessions
9. **Success Case Approval** - Bulk approve 100 cases
10. **Payment Request Generation** - Create requests from 500 commissions

---

## Test Categories

### 1. Authentication Tests
**Location:** Interactive Test Runner → Section 1

Tests covered:
- User registration
- Login with valid/invalid credentials
- Session persistence
- Role-based access
- Logout functionality

**Manual Testing:**
1. Open signup page
2. Create 10 test users with different roles
3. Verify each can only access their allowed pages
4. Test logout and re-login

### 2. Database & RLS Tests
**Location:** Direct SQL queries

Run these queries:
```sql
-- Check all RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';

-- Count policies per table
SELECT tablename, COUNT(*) as policy_count
FROM pg_policies
WHERE schemaname = 'public'
GROUP BY tablename;

-- Test unauthorized access (should return empty)
SET ROLE anon;
SELECT * FROM leads;
```

### 3. Feature Tests
**Location:** Interactive Test Runner → Sections 3-9

Areas covered:
- Wizard flow
- Lead management
- Sales & commissions
- Success cases
- Customer reviews
- Knowledge base
- Content management
- User management

### 4. Performance Tests
**Location:** Interactive Test Runner → Section 11

Load tests:
- Concurrent operations
- Large dataset queries
- Bundle size analysis
- Response time measurements

---

## Running Specific Test Suites

### Quick Smoke Test (5 minutes)
Tests only critical functionality:
```
1. User can register ✓
2. User can login ✓
3. Dashboard loads ✓
4. Can create a lead ✓
5. RLS prevents unauthorized access ✓
```

Click "Quick Test" button in the test runner.

### Full Regression Test (30 minutes)
Tests all 127 features:
- All authentication flows
- All CRUD operations
- All workflows
- All RLS policies
- Performance benchmarks

Click "Run All Tests" button in the test runner.

### Load Test (60 minutes)
Creates massive amounts of test data:
- 1000 users
- 10,000 leads
- 5,000 sales
- 5,000 commissions
- 1,000 success cases
- 5,000 reviews

Click "Load Test" button in the test runner.

---

## Interpreting Results

### Test Status Indicators

- 🟢 **Passed** - Feature working correctly
- 🔴 **Failed** - Feature has issues, needs attention
- 🟡 **Running** - Test in progress
- ⚪ **Pending** - Test not started yet

### Common Failure Reasons

1. **Authentication Failures**
   - Cause: Invalid credentials or expired session
   - Solution: Re-login and run test again

2. **RLS Failures**
   - Cause: Missing or incorrect policies
   - Solution: Check STRESS_TEST_REPORT.md Section 2

3. **Performance Failures**
   - Cause: Query taking > 1 second
   - Solution: Add database indexes

4. **Validation Failures**
   - Cause: Data doesn't meet constraints
   - Solution: Check check constraints in database

---

## Test Data Management

### Creating Test Data

**Method 1: Via UI**
1. Login as admin
2. Navigate to each feature
3. Manually create 5-10 records
4. Verify in database

**Method 2: Via SQL**
```sql
-- Insert test leads
INSERT INTO leads (socio_id, nombre, apellidos, email, telefono, que_vende)
VALUES
  ('your-socio-id', 'Test', 'Lead 1', 'test1@example.com', '555-0001', 'Product A'),
  ('your-socio-id', 'Test', 'Lead 2', 'test2@example.com', '555-0002', 'Product B');
```

**Method 3: Via Test Script**
Use the provided `stress-test-data.sql` file.

### Cleaning Test Data

**WARNING:** Only run in test/dev environments!

```sql
-- Delete all test data (DESTRUCTIVE)
DELETE FROM wizard_results;
DELETE FROM solicitud_pago_ventas;
DELETE FROM solicitudes_pago;
DELETE FROM comisiones;
DELETE FROM ventas;
DELETE FROM leads;
DELETE FROM customer_reviews;
DELETE FROM casos_exito;
DELETE FROM kb_articles;

-- Reset content blocks to default
-- (backup first!)
```

---

## Monitoring During Tests

### Database Monitoring
```sql
-- Check active connections
SELECT COUNT(*) FROM pg_stat_activity;

-- Check slow queries
SELECT pid, now() - query_start as duration, query
FROM pg_stat_activity
WHERE state = 'active' AND now() - query_start > interval '1 second';

-- Check table sizes
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Application Monitoring
1. Open browser DevTools
2. Monitor Network tab during tests
3. Check Console for errors
4. Use Performance tab for profiling

---

## Automated Testing Setup

### CI/CD Integration

Add to your `.github/workflows/test.yml`:

```yaml
name: Stress Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Setup Node
        uses: actions/setup-node@v2
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Build
        run: npm run build

      - name: Run tests
        run: npm test
        env:
          VITE_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
```

### Scheduled Testing

Run tests automatically:
- Daily at midnight (full regression)
- Every 6 hours (smoke tests)
- Before each deployment (critical path)

---

## Troubleshooting

### Test Runner Won't Load
**Problem:** Blank page or script errors
**Solution:**
1. Check browser console for errors
2. Verify Supabase credentials
3. Ensure CORS is configured
4. Try different browser

### Tests Timing Out
**Problem:** Tests never complete
**Solution:**
1. Check network connection
2. Verify database is running
3. Check for RLS infinite loops
4. Reduce test data volume

### RLS Tests Failing
**Problem:** Unauthorized access blocked
**Solution:**
1. Review RLS policies in database
2. Check user role in profiles table
3. Verify JWT token is valid
4. See STRESS_TEST_REPORT.md Section 2

### Performance Tests Failing
**Problem:** Queries too slow
**Solution:**
1. Add indexes to frequently queried columns
2. Reduce test data volume
3. Check database connection pooling
4. Review query execution plans

---

## Best Practices

### Before Testing
1. ✅ Backup production database
2. ✅ Use test environment
3. ✅ Clear old test data
4. ✅ Verify credentials
5. ✅ Check database health

### During Testing
1. ✅ Monitor database performance
2. ✅ Watch for errors in console
3. ✅ Take screenshots of failures
4. ✅ Document unexpected behavior
5. ✅ Test one feature at a time first

### After Testing
1. ✅ Review all failure logs
2. ✅ Document issues found
3. ✅ Clean up test data
4. ✅ Update test cases if needed
5. ✅ Share results with team

---

## Test Coverage Matrix

| Feature Area | Unit Tests | Integration Tests | E2E Tests | Load Tests |
|--------------|-----------|-------------------|-----------|------------|
| Authentication | ✅ | ✅ | ✅ | ✅ |
| Lead Management | ✅ | ✅ | ✅ | ✅ |
| Sales & Commissions | ✅ | ✅ | ✅ | ✅ |
| Success Cases | ✅ | ✅ | ✅ | ⚠️ |
| Reviews & NPS | ✅ | ✅ | ✅ | ⚠️ |
| Knowledge Base | ✅ | ✅ | ⚠️ | ❌ |
| Content Management | ✅ | ✅ | ⚠️ | ❌ |
| User Management | ✅ | ✅ | ⚠️ | ❌ |
| Wizard Flow | ✅ | ✅ | ✅ | ⚠️ |
| Dashboard | ✅ | ⚠️ | ⚠️ | ⚠️ |

Legend:
- ✅ Complete coverage
- ⚠️ Partial coverage
- ❌ Not covered yet

---

## Support & Resources

### Documentation
- Full Test Report: `STRESS_TEST_REPORT.md`
- Architecture: `ARCHITECTURE.md`
- Payment System: `PAYMENT_SYSTEM.md`
- Content Management: `CONTENT_MANAGEMENT.md`
- Reviews & NPS: `REVIEWS_NPS.md`
- Success Cases: `CASOS_EXITO.md`
- Knowledge Base: `KNOWLEDGE_BASE.md`

### Test Files
- Interactive Runner: `stress-test-runner.html`
- Data Generator: `stress-test-data.sql`
- Test Guide: `STRESS_TEST_GUIDE.md` (this file)

### Getting Help
1. Check the test report for known issues
2. Review the specific feature documentation
3. Check Supabase logs for errors
4. Review browser console for client errors

---

## Next Steps

After running stress tests:

1. **Review Results**
   - Check pass/fail ratio
   - Identify any failed tests
   - Document unexpected behavior

2. **Fix Issues**
   - Prioritize critical failures
   - Address medium priority items
   - Schedule low priority improvements

3. **Re-test**
   - Run tests again after fixes
   - Verify all tests pass
   - Update test cases if needed

4. **Deploy**
   - System is production-ready with 95+ score
   - Monitor closely after deployment
   - Setup automated testing

---

**Last Updated:** February 13, 2026
**Test Suite Version:** 1.0
**Platform Status:** ✅ Production Ready

