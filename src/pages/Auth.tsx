import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, ArrowLeft, X, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Auth = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({ email: '', password: '', fullName: '', confirmPassword: '' });
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [signupEmail, setSignupEmail] = useState('');
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
  
  const { signIn, signUp, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await signIn(loginForm.email, loginForm.password);
      
      if (error) {
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Welcome back!",
          description: "You have been logged in successfully."
        });
        navigate('/');
      }
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signupForm.password !== signupForm.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive"
      });
      return;
    }

    if (signupForm.password.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      const { error } = await signUp(signupForm.email, signupForm.password, signupForm.fullName);
      
      if (error) {
        toast({
          title: "Signup Failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        setSignupEmail(signupForm.email);
        setSignupSuccess(true);
        toast({
          title: "Account Created!",
          description: "Please check your email to verify your account."
        });
      }
    } catch (error) {
      toast({
        title: "Signup Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

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
      // First create the user account
      const { error: authError } = await signUp(
        tailorForm.email, 
        tailorForm.password, 
        tailorForm.fullName
      );
      
      if (authError) {
        throw authError;
      }

      // Get the user session
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Create tailor profile
        const { error: tailorError } = await supabase
          .from('tailors')
          .insert({
            user_id: user.id,
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
          throw tailorError;
        }

        setSignupEmail(tailorForm.email);
        setSignupSuccess(true);
        toast({
          title: "Application Submitted!",
          description: "Your tailor application has been submitted for review. Please check your email and wait for admin approval.",
        });
        
        // Reset form
        setTailorForm({
          email: '',
          password: '',
          confirmPassword: '',
          fullName: '',
          businessName: '',
          experienceYears: '',
          specializations: [],
          shopAddress: '',
          city: '',
          pincode: '',
          phone: '',
          pricingRange: '',
          workingHours: ''
        });
      }
    } catch (error: any) {
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

  // Show signup success message
  if (signupSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold">Check Your Email</CardTitle>
              <CardDescription>
                We've sent a verification link to <strong>{signupEmail}</strong>. 
                Please check your email and click the verification link to complete your registration.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  After verifying your email, you can login to your account.
                </p>
                <Button onClick={() => {
                  setSignupSuccess(false);
                  setSignupEmail('');
                }} className="w-full">
                  Back to Login
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">S</span>
            </div>
            <CardTitle className="text-2xl">Welcome to StitchMatch</CardTitle>
            <CardDescription>Your trusted platform for finding perfect tailors</CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
          <TabsTrigger value="tailor">Join as Tailor</TabsTrigger>
        </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="Enter your email"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                        required
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
                  
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Enter your full name"
                      value={signupForm.fullName}
                      onChange={(e) => setSignupForm({...signupForm, fullName: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      value={signupForm.email}
                      onChange={(e) => setSignupForm({...signupForm, email: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password (min. 6 characters)"
                        value={signupForm.password}
                        onChange={(e) => setSignupForm({...signupForm, password: e.target.value})}
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
                    <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                    <Input
                      id="signup-confirm-password"
                      type="password"
                      placeholder="Confirm your password"
                      value={signupForm.confirmPassword}
                      onChange={(e) => setSignupForm({...signupForm, confirmPassword: e.target.value})}
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="tailor">
                <form onSubmit={handleTailorSignup} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
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

                  <div className="grid grid-cols-2 gap-4">
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

                  <div className="grid grid-cols-2 gap-4">
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

                  <div className="space-y-2">
                    <Label>Specializations</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add specialization (e.g., Suits, Dresses)"
                        value={specializationInput}
                        onChange={(e) => setSpecializationInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecialization())}
                      />
                      <Button type="button" onClick={addSpecialization} variant="outline">
                        Add
                      </Button>
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

                  <div className="space-y-2">
                    <Label htmlFor="tailor-address">Shop Address</Label>
                    <Textarea
                      id="tailor-address"
                      placeholder="Complete shop address"
                      value={tailorForm.shopAddress}
                      onChange={(e) => setTailorForm(prev => ({ ...prev, shopAddress: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tailor-city">City</Label>
                      <Input
                        id="tailor-city"
                        type="text"
                        placeholder="Your city"
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
                        placeholder="Area pincode"
                        value={tailorForm.pincode}
                        onChange={(e) => setTailorForm(prev => ({ ...prev, pincode: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tailor-pricing">Pricing Range</Label>
                    <Select value={tailorForm.pricingRange} onValueChange={(value) => setTailorForm(prev => ({ ...prev, pricingRange: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select pricing range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="budget">Budget (₹500-2000)</SelectItem>
                        <SelectItem value="mid-range">Mid-range (₹2000-5000)</SelectItem>
                        <SelectItem value="premium">Premium (₹5000-10000)</SelectItem>
                        <SelectItem value="luxury">Luxury (₹10000+)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tailor-hours">Working Hours</Label>
                    <Input
                      id="tailor-hours"
                      type="text"
                      placeholder="e.g., Mon-Sat 9AM-7PM"
                      value={tailorForm.workingHours}
                      onChange={(e) => setTailorForm(prev => ({ ...prev, workingHours: e.target.value }))}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Submitting Application..." : "Submit Application"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;