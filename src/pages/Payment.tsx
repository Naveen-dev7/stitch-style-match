import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  IndianRupee, 
  CreditCard, 
  Shield, 
  AlertCircle,
  CheckCircle,
  Package,
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
}

const Payment = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (orderId && user) {
      fetchOrder();
    }
  }, [orderId, user]);

  const fetchOrder = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (error) throw error;
      setOrder(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load order details. Please try again.",
        variant: "destructive"
      });
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!order) return;
    
    setProcessing(true);
    try {
      // Here you would integrate with your payment gateway
      // For now, we'll simulate the payment process
      
      // Update order status to paid
      const { error } = await supabase
        .from('orders')
        .update({ status: 'paid' })
        .eq('id', order.id);

      if (error) throw error;

      toast({
        title: "Payment Successful!",
        description: "Your payment has been processed successfully.",
      });

      navigate(`/order/${order.id}`);
    } catch (error: any) {
      toast({
        title: "Payment Failed",
        description: error.message || "Payment processing failed. Please try again.",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">Login Required</h2>
            <p className="text-muted-foreground mb-4">
              Please log in to proceed with payment
            </p>
            <Button onClick={() => navigate('/auth')}>
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
          <CreditCard className="h-12 w-12 mx-auto mb-4 text-primary animate-pulse" />
          <p className="text-muted-foreground">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">Order Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The order you're trying to pay for could not be found.
            </p>
            <Button onClick={() => navigate('/orders')}>
              Back to Orders
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate fees
  const orderAmount = order.price_quoted;
  const platformFee = Math.round(orderAmount * 0.1); // 10% platform fee for customer
  const tailorServiceFee = Math.round(orderAmount * 0.1); // 10% service fee deducted from tailor
  const totalCustomerPayment = orderAmount + platformFee;
  const tailorReceives = orderAmount - tailorServiceFee;

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary text-primary-foreground p-4">
        <div className="max-w-2xl mx-auto">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(-1)}
            className="mb-4 text-primary-foreground hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div className="flex items-center gap-3">
            <CreditCard className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold">Payment</h1>
              <p className="text-primary-foreground/80">Order #{order.id.slice(0, 8)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Order Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{order.item_type}</h3>
                <p className="text-sm text-muted-foreground">{order.description}</p>
                <p className="text-sm text-muted-foreground">By {order.tailor_name}</p>
              </div>
              <Badge variant="outline">
                {order.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Payment Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IndianRupee className="h-5 w-5" />
              Payment Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Customer Payment */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Your Payment</h3>
              
              <div className="flex justify-between items-center">
                <span>Order Amount</span>
                <span className="font-mono">₹{orderAmount}</span>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Platform Fee (10%)</span>
                <span className="font-mono text-muted-foreground">₹{platformFee}</span>
              </div>
              
              <Separator />
              
              <div className="flex justify-between items-center font-semibold text-lg">
                <span>Total Amount</span>
                <span className="font-mono text-primary">₹{totalCustomerPayment}</span>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Fee Distribution */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Fee Distribution</h3>
              
              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span>Tailor Receives</span>
                  <span className="font-mono text-green-600">₹{tailorReceives}</span>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Tailor Service Fee (10%)</span>
                  <span className="font-mono text-muted-foreground">-₹{tailorServiceFee}</span>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Platform Fee (from customer)</span>
                  <span className="font-mono text-muted-foreground">₹{platformFee}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Your payment is secured with industry-standard encryption. Platform fees help us maintain the service and support tailors.
          </AlertDescription>
        </Alert>

        {/* Payment Actions */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-2">
                  ₹{totalCustomerPayment}
                </div>
                <p className="text-sm text-muted-foreground">
                  Final amount to be charged
                </p>
              </div>
              
              <Button 
                onClick={handlePayment}
                disabled={processing}
                className="w-full h-12 text-lg"
                size="lg"
              >
                {processing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5 mr-2" />
                    Pay ₹{totalCustomerPayment}
                  </>
                )}
              </Button>
              
              <p className="text-xs text-center text-muted-foreground">
                By proceeding, you agree to our terms of service and payment policies
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Payment;