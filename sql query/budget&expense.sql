-- Budget & Expense Tables for Workflow Dashboard

-- Project Budgets table
CREATE TABLE IF NOT EXISTS project_budgets (
    id TEXT PRIMARY KEY,
    workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    total_budget NUMERIC(12,2) NOT NULL DEFAULT 0,
    currency TEXT NOT NULL DEFAULT 'USD',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(workspace_id, project_id)
);

-- Expenses table
CREATE TABLE IF NOT EXISTS expenses (
    id TEXT PRIMARY KEY,
    workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    amount NUMERIC(12,2) NOT NULL DEFAULT 0,
    category TEXT NOT NULL DEFAULT 'General',
    expense_date TEXT NOT NULL,
    created_by TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_project_budgets_workspace ON project_budgets(workspace_id);
CREATE INDEX IF NOT EXISTS idx_project_budgets_project ON project_budgets(project_id);
CREATE INDEX IF NOT EXISTS idx_expenses_workspace ON expenses(workspace_id);
CREATE INDEX IF NOT EXISTS idx_expenses_project ON expenses(project_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(expense_date);


 ALTER TABLE project_budgets ENABLE ROW LEVEL SECURITY;
 ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

 CREATE POLICY "Allow all" ON project_budgets FOR ALL USING (true) WITH CHECK (true);
 CREATE POLICY "Allow all" ON expenses FOR ALL USING (true) WITH CHECK (true);