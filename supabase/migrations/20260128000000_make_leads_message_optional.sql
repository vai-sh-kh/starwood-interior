-- Make message column optional in leads table
ALTER TABLE leads ALTER COLUMN message DROP NOT NULL;
