-- Add service_interest field to leads table
ALTER TABLE leads ADD COLUMN service_interest TEXT;

-- Create index for better query performance
CREATE INDEX idx_leads_service_interest ON leads(service_interest);

-- Add comment
COMMENT ON COLUMN leads.service_interest IS 'Service the lead is interested in';
