-- Add support for multiple package selection
-- Solution: Add a new column to store selected packages as an array

-- Add new column for storing multiple packages
ALTER TABLE public.registrations 
ADD COLUMN IF NOT EXISTS selected_packages TEXT[];

-- Update existing records to populate selected_packages from package_type
UPDATE public.registrations 
SET selected_packages = ARRAY[package_type::TEXT]
WHERE selected_packages IS NULL;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_registrations_selected_packages 
ON public.registrations USING GIN (selected_packages);

-- Add comment to explain the column
COMMENT ON COLUMN public.registrations.selected_packages IS 
'Array of selected packages: can contain "contest", "meetup", or both';
