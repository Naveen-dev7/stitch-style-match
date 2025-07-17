import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, ArrowLeft, X, Check, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const TailorSignup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [applicationSuccess, setApplicationSuccess] = useState(false);
  const [applicationEmail, setApplicationEmail] = useState('');
  const [tailorForm, setTailorForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    businessName: '',
    experienceYears: '',
    specializations: [] as string[],
    shopAddress: '',
    city: '',
    pincode: '',
    phone: '',
    pricingRange: '',
    workingHours: ''
  });
  const [specializationInput, setSpecializationInput] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleTailorSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (tailorForm.password !== tailorForm.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive"
      });
      return;
    }

    if (tailorForm.specializations.length === 0) {
      toast({
        title: "Missing Specializations",
        description: "Please add at least one specialization.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Create user account with tailor metadata to prevent profile creation
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error: authError } = await supabase.auth.signUp({
        email: tailorForm.email,
        password: tailorForm.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: tailorForm.fullName,
            user_type: 'tailor' // This prevents profile creation
          }
        }
      });
      
      if (authError) {
        throw authError;
      }

      // If user was created successfully, create tailor entry
      if (data.user) {
        const { error: tailorError } = await supabase
          .from('tailors')
          .insert({
            user_id: data.user.id,
            business_name: tailorForm.businessName,
            experience_years: parseInt(tailorForm.experienceYears),
            specializations: tailorForm.specializations,
            shop_address: tailorForm.shopAddress,
            city: tailorForm.city,
            pincode: tailorForm.pincode,
            phone: tailorForm.phone,
            pricing_range: tailorForm.pricingRange,
            working_hours: tailorForm.workingHours,
            status: 'pending'
          });

        if (tailorError) {
          console.error('Tailor profile creation error:', tailorError);
          throw tailorError;
        }

        setApplicationEmail(tailorForm.email);
        setApplicationSuccess(true);
        toast({
          title: "Application Submitted!",
          description: "Your tailor application is now under verification.",
        });
      }
    } catch (error: any) {
      console.error('Tailor signup error:', error);
      toast({
        title: "Application Failed",
        description: error.message || "An error occurred during tailor signup",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addSpecialization = () => {
    if (specializationInput.trim() && !tailorForm.specializations.includes(specializationInput.trim())) {
      setTailorForm(prev => ({
        ...prev,
        specializations: [...prev.specializations, specializationInput.trim()]
      }));
      setSpecializationInput('');
    }
  };

  const removeSpecialization = (spec: string) => {
    setTailorForm(prev => ({
      ...prev,
      specializations: prev.specializations.filter(s => s !== spec)
    }));
  };

  // Show application success message
  if (applicationSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold">Application Under Verification</CardTitle>
              <CardDescription>
                Your tailor application has been submitted successfully and is now under review.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  We will review your application and notify you at <strong>{applicationEmail}</strong> once it's processed. 
                  Please also check your email to verify your account.
                </p>
                <Button onClick={() => navigate('/')} className="w-full">
                  Back to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 py-8 px-4">
      <div className="w-full max-w-2xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">T</span>
            </div>
            <CardTitle className="text-2xl">Apply as a Tailor</CardTitle>
            <CardDescription>Join our network of skilled tailors and grow your business</CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleTailorSignup} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Personal Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tailor-fullName">Full Name</Label>
                    <Input
                      id="tailor-fullName"
                      type="text"
                      placeholder="Enter your full name"
                      value={tailorForm.fullName}
                      onChange={(e) => setTailorForm(prev => ({ ...prev, fullName: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tailor-email">Email</Label>
                    <Input
                      id="tailor-email"
                      type="email"
                      placeholder="Enter your email"
                      value={tailorForm.email}
                      onChange={(e) => setTailorForm(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tailor-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="tailor-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password (min. 6 characters)"
                        value={tailorForm.password}
                        onChange={(e) => setTailorForm(prev => ({ ...prev, password: e.target.value }))}
                        required
                        minLength={6}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tailor-confirmPassword">Confirm Password</Label>
                    <Input
                      id="tailor-confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={tailorForm.confirmPassword}
                      onChange={(e) => setTailorForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Business Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Business Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tailor-businessName">Business Name</Label>
                    <Input
                      id="tailor-businessName"
                      type="text"
                      placeholder="Your shop/business name"
                      value={tailorForm.businessName}
                      onChange={(e) => setTailorForm(prev => ({ ...prev, businessName: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tailor-phone">Phone Number</Label>
                    <Input
                      id="tailor-phone"
                      type="tel"
                      placeholder="Your contact number"
                      value={tailorForm.phone}
                      onChange={(e) => setTailorForm(prev => ({ ...prev, phone: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tailor-shopAddress">Shop Address</Label>
                  <Textarea
                    id="tailor-shopAddress"
                    placeholder="Complete shop address"
                    value={tailorForm.shopAddress}
                    onChange={(e) => setTailorForm(prev => ({ ...prev, shopAddress: e.target.value }))}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tailor-city">City</Label>
                    <Input
                      id="tailor-city"
                      type="text"
                      placeholder="City"
                      value={tailorForm.city}
                      onChange={(e) => setTailorForm(prev => ({ ...prev, city: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tailor-pincode">Pincode</Label>
                    <Input
                      id="tailor-pincode"
                      type="text"
                      placeholder="Pincode"
                      value={tailorForm.pincode}
                      onChange={(e) => setTailorForm(prev => ({ ...prev, pincode: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tailor-experience">Experience (Years)</Label>
                    <Input
                      id="tailor-experience"
                      type="number"
                      placeholder="Years of experience"
                      value={tailorForm.experienceYears}
                      onChange={(e) => setTailorForm(prev => ({ ...prev, experienceYears: e.target.value }))}
                      required
                      min="0"
                    />
                  </div>
                </div>
              </div>

              {/* Professional Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Professional Details</h3>
                
                <div className="space-y-2">
                  <Label>Specializations</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="e.g., Shirts, Dresses, Alterations"
                      value={specializationInput}
                      onChange={(e) => setSpecializationInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecialization())}
                    />
                    <Button type="button" onClick={addSpecialization}>Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tailorForm.specializations.map((spec, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {spec}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => removeSpecialization(spec)} />
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tailor-pricing">Pricing Range</Label>
                    <Select onValueChange={(value) => setTailorForm(prev => ({ ...prev, pricingRange: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select pricing range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Budget (₹100-500)">Budget (₹100-500)</SelectItem>
                        <SelectItem value="Mid-range (₹500-1500)">Mid-range (₹500-1500)</SelectItem>
                        <SelectItem value="Premium (₹1500-3000)">Premium (₹1500-3000)</SelectItem>
                        <SelectItem value="Luxury (₹3000+)">Luxury (₹3000+)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tailor-workingHours">Working Hours</Label>
                    <Input
                      id="tailor-workingHours"
                      type="text"
                      placeholder="e.g., 9 AM - 8 PM"
                      value={tailorForm.workingHours}
                      onChange={(e) => setTailorForm(prev => ({ ...prev, workingHours: e.target.value }))}
                      required
                    />
                  </div>
                </div>
              </div>
              
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Submitting Application..." : "Submit Tailor Application"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <p className="text-muted-foreground">
                Already have an account? {' '}
                <Button variant="link" className="p-0 h-auto" onClick={() => navigate('/auth')}>
                  Sign in here
                </Button>
              </p>
              <p className="text-muted-foreground mt-2">
                Looking for a tailor? {' '}
                <Button variant="link" className="p-0 h-auto" onClick={() => navigate('/customer-signup')}>
                  Sign up as customer
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TailorSignup;