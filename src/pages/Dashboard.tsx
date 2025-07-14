import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Star, Users, Package, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  
  const recentOrders = [
    { id: "ORD-001", tailor: "Meera Designs", status: "In Progress", item: "Saree Blouse" },
    { id: "ORD-002", tailor: "Crafted Couture", status: "Delivered", item: "Lehenga" },
  ];

  const featuredTailors = [
    { name: "Anjali Stitches", rating: 4.8, location: "Mumbai", specialty: "Traditional Wear" },
    { name: "Modern Threads", rating: 4.6, location: "Delhi", specialty: "Western Wear" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-secondary text-primary-foreground py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Find Your Perfect Tailor
          </h1>
          <p className="text-xl mb-8 opacity-90">
            Connect with skilled tailors across India for custom clothing that fits perfectly
          </p>
          <Button size="lg" variant="secondary" className="text-lg px-8 py-3" onClick={() => navigate('/find-tailor')}>
            <Search className="mr-2 h-5 w-5" />
            Find Tailors Near You
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold text-primary">500+</div>
              <div className="text-sm text-muted-foreground">Verified Tailors</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Package className="h-8 w-8 mx-auto mb-2 text-accent" />
              <div className="text-2xl font-bold text-accent">2,000+</div>
              <div className="text-sm text-muted-foreground">Orders Completed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Star className="h-8 w-8 mx-auto mb-2 text-secondary" />
              <div className="text-2xl font-bold text-secondary">4.8</div>
              <div className="text-sm text-muted-foreground">Average Rating</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <MapPin className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold text-primary">50+</div>
              <div className="text-sm text-muted-foreground">Cities</div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Track your ongoing and completed orders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{order.item}</div>
                      <div className="text-sm text-muted-foreground">{order.tailor}</div>
                    </div>
                    <Badge variant={order.status === "Delivered" ? "default" : "secondary"}>
                      {order.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Featured Tailors */}
          <Card>
            <CardHeader>
              <CardTitle>Featured Tailors</CardTitle>
              <CardDescription>Top-rated tailors in your area</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {featuredTailors.map((tailor) => (
                  <div key={tailor.name} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{tailor.name}</div>
                      <div className="text-sm text-muted-foreground flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {tailor.location} • {tailor.specialty}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="font-medium">{tailor.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4">
          <Button variant="outline" className="h-20 flex-col" onClick={() => navigate('/find-tailor')}>
            <Search className="h-6 w-6 mb-2" />
            Find Tailors
          </Button>
          <Button variant="outline" className="h-20 flex-col">
            <Package className="h-6 w-6 mb-2" />
            Track Orders
          </Button>
          <Button variant="outline" className="h-20 flex-col">
            <MessageCircle className="h-6 w-6 mb-2" />
            Messages
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;