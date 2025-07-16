import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { CheckCircle, XCircle, Clock, User, Phone, MapPin } from 'lucide-react';

interface TailorApplication {
  id: string;
  user_id: string;
  business_name: string;
  experience_years: number;
  specializations: string[];
  shop_address: string;
  city: string;
  pincode: string;
  phone: string;
  pricing_range: string;
  working_hours: string;
  status: string;
  admin_notes: string | null;
  created_at: string;
  profiles?: {
    full_name: string;
  };
}

const AdminPanel = () => {
  const [applications, setApplications] = useState<TailorApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<TailorApplication | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [processing, setProcessing] = useState(false);
  
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('tailors')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data as any || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch tailor applications",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (applicationId: string, status: 'approved' | 'rejected') => {
    setProcessing(true);
    try {
      const { error } = await supabase
        .from('tailors')
        .update({ 
          status, 
          admin_notes: adminNotes || null 
        })
        .eq('id', applicationId);

      if (error) throw error;

      toast({
        title: `Application ${status}`,
        description: `Tailor application has been ${status} successfully.`,
      });

      // Refresh applications
      await fetchApplications();
      setSelectedApp(null);
      setAdminNotes('');
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update application status",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Loading applications...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Admin Panel - Tailor Applications</h1>
        <p className="text-muted-foreground">Review and approve tailor applications</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {applications.map((app) => (
          <Card key={app.id} className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{app.business_name}</CardTitle>
                <Badge className={getStatusColor(app.status)}>
                  {app.status}
                </Badge>
              </div>
              <CardDescription className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {app.profiles?.full_name}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {app.phone}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {app.city}, {app.pincode}
                </div>
                <div>
                  <strong>Experience:</strong> {app.experience_years} years
                </div>
                <div>
                  <strong>Pricing:</strong> {app.pricing_range}
                </div>
                <div>
                  <strong>Specializations:</strong>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {app.specializations.map((spec, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex gap-2">
                <Button 
                  size="sm" 
                  onClick={() => setSelectedApp(app)}
                  variant="outline"
                >
                  View Details
                </Button>
                {app.status === 'pending' && (
                  <>
                    <Button
                      size="sm"
                      onClick={() => handleApproval(app.id, 'approved')}
                      disabled={processing}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleApproval(app.id, 'rejected')}
                      disabled={processing}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {applications.length === 0 && (
        <div className="text-center py-12">
          <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Applications</h3>
          <p className="text-muted-foreground">No tailor applications to review at the moment.</p>
        </div>
      )}

      {/* Detailed View Modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{selectedApp.business_name}</CardTitle>
                  <CardDescription>{selectedApp.profiles?.full_name}</CardDescription>
                </div>
                <Button variant="ghost" onClick={() => setSelectedApp(null)}>
                  ×
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <strong>Phone:</strong> {selectedApp.phone}
                </div>
                <div>
                  <strong>Experience:</strong> {selectedApp.experience_years} years
                </div>
                <div>
                  <strong>City:</strong> {selectedApp.city}
                </div>
                <div>
                  <strong>Pincode:</strong> {selectedApp.pincode}
                </div>
                <div>
                  <strong>Pricing:</strong> {selectedApp.pricing_range}
                </div>
                <div>
                  <strong>Working Hours:</strong> {selectedApp.working_hours}
                </div>
              </div>

              <div>
                <strong>Shop Address:</strong>
                <p className="mt-1 text-sm">{selectedApp.shop_address}</p>
              </div>

              <div>
                <strong>Specializations:</strong>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedApp.specializations.map((spec, index) => (
                    <Badge key={index} variant="secondary">
                      {spec}
                    </Badge>
                  ))}
                </div>
              </div>

              {selectedApp.status === 'pending' && (
                <div className="space-y-4 pt-4 border-t">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Admin Notes (Optional)
                    </label>
                    <Textarea
                      placeholder="Add any notes about this application..."
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleApproval(selectedApp.id, 'approved')}
                      disabled={processing}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve Application
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleApproval(selectedApp.id, 'rejected')}
                      disabled={processing}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject Application
                    </Button>
                  </div>
                </div>
              )}

              {selectedApp.admin_notes && (
                <div className="pt-4 border-t">
                  <strong>Admin Notes:</strong>
                  <p className="mt-1 text-sm">{selectedApp.admin_notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;