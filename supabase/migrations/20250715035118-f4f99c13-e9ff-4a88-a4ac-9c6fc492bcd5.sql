-- Create tailors table with approval system
CREATE TABLE public.tailors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  business_name TEXT NOT NULL,
  experience_years INTEGER NOT NULL,
  specializations TEXT[] NOT NULL,
  shop_address TEXT NOT NULL,
  city TEXT NOT NULL,
  pincode TEXT NOT NULL,
  phone TEXT NOT NULL,
  portfolio_images TEXT[],
  certifications TEXT[],
  pricing_range TEXT NOT NULL,
  working_hours TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT tailors_status_check CHECK (status IN ('pending', 'approved', 'rejected'))
);

-- Enable Row Level Security
ALTER TABLE public.tailors ENABLE ROW LEVEL SECURITY;

-- Create policies for tailors table
CREATE POLICY "Tailors can view their own profile" 
ON public.tailors 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Tailors can create their own profile" 
ON public.tailors 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Tailors can update their own profile" 
ON public.tailors 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Policy for approved tailors to be visible to everyone
CREATE POLICY "Approved tailors are publicly visible" 
ON public.tailors 
FOR SELECT 
USING (status = 'approved');

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_tailors_updated_at
BEFORE UPDATE ON public.tailors
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();