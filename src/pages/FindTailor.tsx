import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Star, Filter, Heart, MessageCircle } from "lucide-react";

interface Tailor {
  id: string;
  business_name: string;
  city: string;
  pincode: string;
  phone: string;
  specializations: string[];
  pricing_range: string;
  working_hours: string;
  shop_address: string;
  experience_years: number;
  profiles?: {
    full_name: string;
  };
}

const FindTailor = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [tailors, setTailors] = useState<Tailor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApprovedTailors();
  }, []);

  const fetchApprovedTailors = async () => {
    try {
      const { data, error } = await supabase
        .from('tailors')
        .select(`
          *,
          profiles (
            full_name
          )
        `)
        .eq('status', 'approved');

      if (error) throw error;
      setTailors(data as any || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch tailors",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const cities = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Pune", "Kolkata"];
  const categories = ["Traditional Wear", "Western Wear", "Formal Wear", "Wedding Wear", "Designer Wear"];

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      {/* Search Header */}
      <div className="bg-gradient-to-r from-primary to-secondary text-primary-foreground py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center">Find Your Perfect Tailor</h1>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, location, or specialty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background"
              />
            </div>
            
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger className="w-full md:w-48 bg-background">
                <SelectValue placeholder="Select City" />
              </SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48 bg-background">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button variant="secondary" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="text-lg">Loading tailors...</div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">
                {tailors.length} Tailors Found
              </h2>
          <Select defaultValue="rating">
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="reviews">Most Reviews</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="distance">Nearest First</SelectItem>
            </SelectContent>
          </Select>
        </div>

            <div className="grid gap-6">
              {tailors.map((tailor) => (
                <Card key={tailor.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="md:flex">
                    <div className="md:w-48 h-48 bg-muted flex items-center justify-center">
                      <div className="text-4xl font-bold text-muted-foreground">
                        {tailor.business_name.charAt(0)}
                      </div>
                    </div>
                    
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-xl font-semibold">{tailor.business_name}</h3>
                            <Badge variant="secondary" className="text-xs">Verified</Badge>
                          </div>
                          <div className="flex items-center text-muted-foreground mb-2">
                            <MapPin className="h-4 w-4 mr-1" />
                            {tailor.city}, {tailor.pincode}
                          </div>
                          <div className="text-sm text-muted-foreground mb-3">
                            Owner: {tailor.profiles?.full_name || 'N/A'}
                          </div>
                        </div>
                        
                        <Button variant="ghost" size="icon">
                          <Heart className="h-5 w-5" />
                        </Button>
                      </div>
                      
                      <div className="grid md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">Specialties</div>
                          <div className="flex flex-wrap gap-1">
                            {tailor.specializations.map((specialty, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">Price Range</div>
                          <div className="font-medium">{tailor.pricing_range}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">Experience</div>
                          <div className="font-medium">{tailor.experience_years} years</div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          className="flex-1"
                          onClick={() => navigate(`/tailor/${tailor.id}`)}
                        >
                          View Profile
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => navigate(`/messages?tailor=${tailor.id}`)}
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Chat
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {tailors.length === 0 && (
              <div className="text-center py-12">
                <div className="text-lg font-semibold mb-2">No approved tailors found</div>
                <div className="text-muted-foreground">Please check back later or try different search criteria.</div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FindTailor;