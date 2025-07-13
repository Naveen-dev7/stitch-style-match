import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  ArrowLeft, MapPin, Star, Calendar, Clock, 
  MessageCircle, Heart, Share, Verified,
  IndianRupee, Award, Users
} from "lucide-react";

const TailorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data - in real app this would come from API
  const tailor = {
    id: parseInt(id || "1"),
    name: "Meera's Traditional Designs",
    location: "Bandra, Mumbai",
    rating: 4.9,
    reviewCount: 127,
    specialties: ["Sarees", "Lehengas", "Blouses"],
    priceRange: "₹500-2000",
    turnaround: "3-5 days",
    image: "/placeholder.svg",
    verified: true,
    experience: "8 years",
    completedOrders: 245,
    description: "Specializing in traditional Indian wear with a modern touch. Expert in intricate embroidery work and custom fittings.",
    services: [
      "Custom Blouse Stitching",
      "Saree Alteration", 
      "Lehenga Design",
      "Kurti Tailoring",
      "Embroidery Work"
    ],
    portfolio: [
      { id: 1, image: "/placeholder.svg", title: "Designer Lehenga", category: "Wedding Wear" },
      { id: 2, image: "/placeholder.svg", title: "Silk Saree Blouse", category: "Traditional" },
      { id: 3, image: "/placeholder.svg", title: "Party Wear Kurti", category: "Casual" },
      { id: 4, image: "/placeholder.svg", title: "Embroidered Anarkali", category: "Designer" },
      { id: 5, image: "/placeholder.svg", title: "Wedding Blouse", category: "Bridal" },
      { id: 6, image: "/placeholder.svg", title: "Casual Dress", category: "Western" }
    ],
    reviews: [
      {
        id: 1,
        name: "Priya S.",
        rating: 5,
        comment: "Excellent work on my wedding lehenga! Perfect fit and beautiful embroidery.",
        date: "2 weeks ago"
      },
      {
        id: 2,
        name: "Anjali M.",
        rating: 5,
        comment: "Best tailor in Mumbai! Quick delivery and amazing quality.",
        date: "1 month ago"
      },
      {
        id: 3,
        name: "Kavya R.",
        rating: 4,
        comment: "Good work overall, slight delay but worth the wait.",
        date: "2 months ago"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary text-primary-foreground p-4">
        <div className="max-w-4xl mx-auto">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(-1)}
            className="mb-4 text-primary-foreground hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div className="flex flex-col md:flex-row gap-6 items-start">
            <Avatar className="w-24 h-24">
              <AvatarImage src={tailor.image} alt={tailor.name} />
              <AvatarFallback>{tailor.name.charAt(0)}</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-2xl font-bold">{tailor.name}</h1>
                {tailor.verified && (
                  <Verified className="h-5 w-5 text-blue-300" />
                )}
              </div>

              <div className="flex items-center text-primary-foreground/80 mb-2">
                <MapPin className="h-4 w-4 mr-1" />
                {tailor.location}
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-300 fill-current" />
                  <span className="font-medium">{tailor.rating}</span>
                  <span className="text-primary-foreground/80">({tailor.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{tailor.completedOrders} orders</span>
                </div>
                <div className="flex items-center gap-1">
                  <Award className="h-4 w-4" />
                  <span>{tailor.experience} experience</span>
                </div>
              </div>

              <div className="flex gap-2 mb-4">
                {tailor.specialties.map((specialty) => (
                  <Badge key={specialty} variant="secondary" className="bg-white/20 text-primary-foreground">
                    {specialty}
                  </Badge>
                ))}
              </div>

              <div className="flex gap-2">
                <Button className="bg-white text-primary hover:bg-white/90">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Chat Now
                </Button>
                <Button variant="outline" className="border-white/20 text-primary-foreground hover:bg-white/10">
                  <Heart className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button variant="outline" size="icon" className="border-white/20 text-primary-foreground hover:bg-white/10">
                  <Share className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-4">
        <Tabs defaultValue="portfolio" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
          </TabsList>

          <TabsContent value="portfolio" className="mt-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {tailor.portfolio.map((work) => (
                <Card key={work.id} className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
                  <div className="aspect-square bg-muted">
                    <img 
                      src={work.image} 
                      alt={work.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-3">
                    <h3 className="font-medium text-sm mb-1">{work.title}</h3>
                    <Badge variant="outline" className="text-xs">{work.category}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="about" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground">{tailor.description}</p>
                
                <div>
                  <h3 className="font-semibold mb-3">Services Offered</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {tailor.services.map((service) => (
                      <div key={service} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span className="text-sm">{service}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <IndianRupee className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <div className="font-semibold">{tailor.priceRange}</div>
                    <div className="text-sm text-muted-foreground">Price Range</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <Clock className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <div className="font-semibold">{tailor.turnaround}</div>
                    <div className="text-sm text-muted-foreground">Turnaround</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <Calendar className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <div className="font-semibold">{tailor.experience}</div>
                    <div className="text-sm text-muted-foreground">Experience</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <div className="space-y-4">
              {tailor.reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-medium">{review.name}</div>
                        <div className="flex items-center gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 ${i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">{review.date}</span>
                    </div>
                    <p className="text-muted-foreground">{review.comment}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="pricing" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Pricing Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span>Simple Blouse</span>
                    <span className="font-medium">₹500 - ₹800</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span>Designer Blouse</span>
                    <span className="font-medium">₹1000 - ₹1500</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span>Lehenga (Basic)</span>
                    <span className="font-medium">₹1500 - ₹2500</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span>Lehenga (Designer)</span>
                    <span className="font-medium">₹3000 - ₹5000</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span>Kurti</span>
                    <span className="font-medium">₹400 - ₹700</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span>Embroidery Work</span>
                    <span className="font-medium">₹200 - ₹500 per piece</span>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Note:</strong> Prices may vary based on fabric, design complexity, and urgency. 
                    Contact for detailed quotes.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TailorProfile;