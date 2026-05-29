Create a new table `platform_entries` to store official financial records per platform, used by the dashboard for profit, hourly earnings, cost-per-km, and performance calculations.

**Database changes**
1. Create `platform_entries` table with the following columns:
   - `user_id` (links to auth.users, cascade on delete)
   - `platform_name` (required)
   - `entry_date` (required)
   - `gross_earnings` (required)
   - `worked_hours`
   - `trips_count`
   - `kilometers`
   - `fuel_cost`
   - `extra_costs`
   - `source` (defaults to 'manual')
   - `imported_print_id` (optional foreign key to imported_prints)
   - `notes`
2. Add GRANT permissions for authenticated and service_role users.
3. Enable Row Level Security (RLS) on the table.
4. Create four RLS policies so each authenticated user can only view, create, edit, and delete their own records.
5. Create an index on `user_id` for query performance.

**Out of scope**
- No frontend changes.
- No modifications to existing tables.