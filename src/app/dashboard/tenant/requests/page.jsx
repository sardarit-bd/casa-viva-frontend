'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Home, MessageSquare, Eye } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { leaseService } from '@/services/lease.service';

export default function TenantMyRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await leaseService.getMyLeases({
          role: "tenant",
        });

        const formatted = res.data.data.map((lease) => ({
          id: lease._id,
          propertyTitle: lease.property?.title,
          location: lease.property?.city,
          landlord: lease.landlord?.name,
          status: lease.status,
          createdAt: new Date(lease.createdAt).toLocaleDateString(),
        }));

        setRequests(formatted);
      } catch (err) {
        toast.error("Failed to load requests");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);


  const filteredRequests = requests.filter((r) => filter === 'all' || r.status === filter);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#1F3A34]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#113B28]">My Requests</h1>
          <CardDescription>Track your property rental requests</CardDescription>
        </div>

        <Badge variant="outline">
          <span className="font-semibold text-[#113B28]">{filteredRequests.length}</span> requests
        </Badge>
      </div>

      <Card>
        <CardContent className="pt-6 flex gap-4">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Requests</SelectItem>
              <SelectItem value="pending_request">Pending</SelectItem>
              <SelectItem value="draft">Approved</SelectItem>
              <SelectItem value="sent_to_tenant">Sent to Tenant</SelectItem>
              <SelectItem value="fully_executed">Signed</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Property</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Landlord</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <Home className="h-10 w-10 mx-auto text-gray-300 mb-2" />
                    <p className="text-gray-500">No requests found</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredRequests.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell className="font-medium">{req.propertyTitle}</TableCell>
                    <TableCell>{req.location}</TableCell>
                    <TableCell>{req.landlord}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          req.status === 'fully_executed'
                            ? 'bg-green-100 text-green-700'
                            : req.status === 'sent_to_tenant'
                              ? 'bg-blue-100 text-blue-700'
                              : req.status === 'draft'
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-yellow-100 text-yellow-700'
                        }
                      >
                        {req.status.replaceAll('_', ' ')}
                      </Badge>

                    </TableCell>
                    <TableCell>{req.createdAt}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button size="icon" variant="ghost">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
