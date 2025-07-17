import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  ArrowLeft, MessageCircle, Calendar, Clock, 
  MapPin, Phone, Star, Package, IndianRupee,
  CheckCircle, Circle, AlertCircle
} from "lucide-react";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data - in real app this would come from API
  const order = {
    id: id || "ORD-001",
    itemType: "Saree Blouse",
    description: "Traditional silk saree blouse with intricate embroidery work",
    status: "In Progress",
    priceQuoted: 1200,
    createdAt: "2024-01-10",
    estimatedCompletion: "2024-01-15",
    actualCompletion: null,
    specialInstructions: "Please ensure the neckline is deep V-cut with gold thread embroidery. The blouse should have a perfect fit with 3/4 sleeves.",
    measurements: {
      bust: "36",
      waist: "32", 
      shoulder: "14",
      armhole: "18",
      sleeveLLength: "18"
    },
    tailor: {
      id: 1,
      name: "Meera's Traditional Designs",
      avatar: "/placeholder.svg",
      rating: 4.9,
      location: "Bandra, Mumbai",
      phone: "+91 9876543210"
    },
    statusHistory: [
      { status: "Order Placed", date: "2024-01-10", time: "10:30 AM", completed: true },
      { status: "Measurements Confirmed", date: "2024-01-10", time: "02:15 PM", completed: true },
      { status: "Work Started", date: "2024-01-11", time: "09:00 AM", completed: true },
      { status: "In Progress", date: "2024-01-12", time: "11:30 AM", completed: true },
      { status: "Quality Check", date: "2024-01-14", time: "TBD", completed: false },
      { status: "Ready for Pickup", date: "2024-01-15", time: "TBD", completed: false }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold">Order #{order.id}</h1>
              <p className="text-primary-foreground/80">{order.itemType}</p>
            </div>
            <Badge className={`${getStatusColor(order.status)} text-sm px-3 py-1`}>
              {order.status}
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Order Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Item Details</h3>
                <p className="text-sm text-muted-foreground mb-1">Type: {order.itemType}</p>
                <p className="text-sm text-muted-foreground">{order.description}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Pricing</h3>
                <div className="flex items-center gap-1">
                  <IndianRupee className="h-4 w-4" />
                  <span className="text-xl font-bold">{order.priceQuoted}</span>
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Order Date</p>
                  <p className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Expected Delivery</p>
                  <p className="text-sm text-muted-foreground">{new Date(order.estimatedCompletion).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <p className="text-sm text-muted-foreground">{order.status}</p>
                </div>
              </div>
            </div>

            {order.specialInstructions && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-2">Special Instructions</h3>
                  <p className="text-sm text-muted-foreground">{order.specialInstructions}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Tailor Information */}
        <Card>
          <CardHeader>
            <CardTitle>Tailor Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={order.tailor.avatar} alt={order.tailor.name} />
                <AvatarFallback>{order.tailor.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold">{order.tailor.name}</h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span>{order.tailor.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{order.tailor.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    <span>{order.tailor.phone}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                className="flex-1"
                onClick={() => navigate(`/messages?tailor=${order.tailor.id}`)}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Chat with Tailor
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate(`/tailor/${order.tailor.id}`)}
              >
                View Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Measurements */}
        <Card>
          <CardHeader>
            <CardTitle>Measurements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(order.measurements).map(([key, value]) => (
                <div key={key} className="text-center p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                  <p className="font-semibold">{value}"</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Order Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Order Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order.statusHistory.map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    {item.completed ? (
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    ) : (
                      <Circle className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className={`font-medium ${item.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {item.status}
                      </p>
                      <div className="text-sm text-muted-foreground">
                        {item.date} {item.time !== 'TBD' && `• ${item.time}`}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => navigate('/orders')}
          >
            Back to Orders
          </Button>
          {order.status === 'Pending' && (
            <Button 
              className="flex-1"
              onClick={() => navigate(`/payment/${order.id}`)}
            >
              <IndianRupee className="h-4 w-4 mr-2" />
              Pay Now
            </Button>
          )}
          {order.status === 'Ready for Pickup' && (
            <Button className="flex-1">
              Mark as Delivered
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;