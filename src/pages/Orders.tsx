import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle, 
  MessageCircle,
  Calendar,
  IndianRupee,
  User
} from 'lucide-react';

interface Order {
  id: string;
  tailor_id: number;
  tailor_name: string;
  item_type: string;
  description: string;
  status: string;
  price_quoted: number;
  created_at: string;
  estimated_completion: string;
  actual_completion: string;
}

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      toast({
        title: "Error fetching orders",
        description: "Failed to load your orders. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'cancelled': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'in_progress': return <Clock className="h-4 w-4 text-blue-500" />;
      default: return <Package className="h-4 w-4 text-orange-500" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'default';
      case 'in_progress': return 'secondary';
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatStatus = (status: string) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const filterOrdersByStatus = (status: string) => {
    if (status === 'all') return orders;
    return orders.filter(order => order.status.toLowerCase() === status.toLowerCase());
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">Login Required</h2>
            <p className="text-muted-foreground mb-4">
              Please log in to view your orders
            </p>
            <Button onClick={() => window.location.href = '/auth'}>
              Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Package className="h-12 w-12 mx-auto mb-4 text-primary animate-pulse" />
          <p className="text-muted-foreground">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <div className="max-w-4xl mx-auto p-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Orders</h1>
          <p className="text-muted-foreground">Track and manage all your tailoring orders</p>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All ({orders.length})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({filterOrdersByStatus('pending').length})</TabsTrigger>
            <TabsTrigger value="in_progress">In Progress ({filterOrdersByStatus('in_progress').length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({filterOrdersByStatus('completed').length})</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled ({filterOrdersByStatus('cancelled').length})</TabsTrigger>
          </TabsList>

          {['all', 'pending', 'in_progress', 'completed', 'cancelled'].map((status) => (
            <TabsContent key={status} value={status} className="mt-6">
              {filterOrdersByStatus(status).length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No Orders Found</h3>
                    <p className="text-muted-foreground mb-4">
                      {status === 'all' 
                        ? "You haven't placed any orders yet. Start by finding a tailor!"
                        : `No ${formatStatus(status).toLowerCase()} orders found.`
                      }
                    </p>
                    {status === 'all' && (
                      <Button onClick={() => window.location.href = '/find-tailor'}>
                        Find Tailors
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {filterOrdersByStatus(status).map((order) => (
                    <Card key={order.id} className="overflow-hidden">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg flex items-center gap-2">
                              {getStatusIcon(order.status)}
                              {order.item_type}
                            </CardTitle>
                            <p className="text-muted-foreground">Order #{order.id.slice(0, 8)}</p>
                          </div>
                          <Badge variant={getStatusVariant(order.status)}>
                            {formatStatus(order.status)}
                          </Badge>
                        </div>
                      </CardHeader>
                      
                      <CardContent>
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{order.tailor_name}</span>
                            </div>
                            {order.description && (
                              <p className="text-sm text-muted-foreground">{order.description}</p>
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">Ordered: {formatDate(order.created_at)}</span>
                            </div>
                            {order.estimated_completion && (
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">Expected: {formatDate(order.estimated_completion)}</span>
                              </div>
                            )}
                            {order.price_quoted && (
                              <div className="flex items-center gap-2">
                                <IndianRupee className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">₹{order.price_quoted}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          {order.status === 'pending' && (
                            <Button 
                              size="sm"
                              onClick={() => window.location.href = `/payment/${order.id}`}
                            >
                              <IndianRupee className="h-4 w-4 mr-2" />
                              Pay Now
                            </Button>
                          )}
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => window.location.href = `/messages?tailor=${order.tailor_id}`}
                          >
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Chat with Tailor
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => window.location.href = `/tailor/${order.tailor_id}`}
                          >
                            View Tailor Profile
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default Orders;