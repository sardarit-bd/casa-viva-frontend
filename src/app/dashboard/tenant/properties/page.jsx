"use client";

import Link from "next/link";
import {
  Home,
  Eye,
  MapPin,
  Star,
  Search,
  Filter,
  Bed,
  Bath,
  Square,
  Calendar,
  DollarSign,
  Users,
  ChevronDown,
  X,
  Check,
  Phone,
  MessageSquare,
  Clock,
  Tag,
  Building,
  Heart,
  Share2,
  CheckCircle,
  AlertCircle,
  Plus
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from 'react-hot-toast';

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TenantPropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [favorites, setFavorites] = useState([]);
  const [sortBy, setSortBy] = useState("recent");
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  // Fetch properties data for tenant
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));

        const mockProperties = [
          {
            id: "PR-001",
            title: "Luxury Villa Punta Cana",
            description: "5 bedroom luxury villa with private pool and ocean view. Perfect for family vacations or group getaways.",
            location: "Punta Cana, Dominican Republic",
            address: "123 Ocean Drive, Punta Cana",
            price: 350,
            currency: "USD",
            period: "night",
            bedrooms: 5,
            bathrooms: 4,
            guests: 10,
            area: "3,500",
            unit: "sq ft",
            status: "available",
            rating: 4.8,
            reviews: 42,
            amenities: ["Pool", "WiFi", "AC", "Parking", "Kitchen", "Beach Access", "Gym"],
            images: [
              "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?w=800&auto=format&fit=crop"
            ],
            landlord: {
              name: "John Smith",
              avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
              rating: 4.9,
              verified: true,
              responseRate: "95%",
              responseTime: "Within 2 hours"
            },
            leaseType: "Monthly",
            availableFrom: "2024-04-01",
            minStay: 30,
            maxStay: 365,
            deposit: 700,
            utilitiesIncluded: ["Water", "Electricity", "Internet"],
            petsAllowed: true,
            featured: true,
            createdAt: "2024-01-15"
          },
          {
            id: "PR-002",
            title: "Beachfront Condo Bavaro",
            description: "Modern 2-bedroom condo with direct beach access. Recently renovated with all modern amenities.",
            location: "Bavaro, Dominican Republic",
            address: "456 Beach Boulevard, Bavaro",
            price: 220,
            currency: "USD",
            period: "night",
            bedrooms: 2,
            bathrooms: 2,
            guests: 4,
            area: "1,200",
            unit: "sq ft",
            status: "available",
            rating: 4.5,
            reviews: 28,
            amenities: ["Beach Front", "WiFi", "AC", "Parking", "Kitchen", "Balcony", "TV"],
            images: [
              "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop"
            ],
            landlord: {
              name: "Maria Garcia",
              avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
              rating: 4.7,
              verified: true,
              responseRate: "90%",
              responseTime: "Within 4 hours"
            },
            leaseType: "Flexible",
            availableFrom: "2024-03-20",
            minStay: 7,
            maxStay: 180,
            deposit: 440,
            utilitiesIncluded: ["Water", "Electricity"],
            petsAllowed: false,
            featured: false,
            createdAt: "2024-02-20"
          },
          {
            id: "PR-003",
            title: "Golf Course Villa Cap Cana",
            description: "Luxurious 6-bedroom villa on championship golf course with private chef service available.",
            location: "Cap Cana, Dominican Republic",
            address: "789 Golf View Road, Cap Cana",
            price: 450,
            currency: "USD",
            period: "night",
            bedrooms: 6,
            bathrooms: 5,
            guests: 12,
            area: "4,500",
            unit: "sq ft",
            status: "occupied",
            rating: 4.9,
            reviews: 56,
            amenities: ["Golf Course", "Pool", "WiFi", "AC", "Parking", "Kitchen", "Gym", "Spa", "Private Chef"],
            images: [
              "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop"
            ],
            landlord: {
              name: "Robert Johnson",
              avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert",
              rating: 4.8,
              verified: true,
              responseRate: "98%",
              responseTime: "Within 1 hour"
            },
            leaseType: "Annual",
            availableFrom: "2024-06-01",
            minStay: 90,
            maxStay: 365,
            deposit: 900,
            utilitiesIncluded: ["Water", "Electricity", "Internet", "Cable"],
            petsAllowed: true,
            featured: true,
            createdAt: "2024-01-05"
          }
        ];

        setProperties(mockProperties);
      } catch (error) {
        toast.error("Failed to load properties");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Filter properties based on search and filters
  const filteredProperties = properties.filter(property => {
    const matchesSearch = searchQuery === "" ||
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filter === "all" || property.status === filter;

    return matchesSearch && matchesStatus;
  });

  // Sort properties
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      case 'rating': return b.rating - a.rating;
      case 'beds': return b.bedrooms - a.bedrooms;
      default: return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  // Toggle favorite
  const toggleFavorite = (propertyId) => {
    if (favorites.includes(propertyId)) {
      setFavorites(favorites.filter(id => id !== propertyId));
      toast.success("Removed from favorites");
    } else {
      setFavorites([...favorites, propertyId]);
      toast.success("Added to favorites");
    }
  };

  // Format date
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  // Format currency
  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);

  // Handle contact landlord
  const handleContactLandlord = (property) => {
    toast.success(`Contact request sent to ${property.landlord.name}`);
    setContactDialogOpen(false);
  };

  // Handle schedule tour
  const handleScheduleTour = (property) => {
    toast.success(`Tour scheduled for ${property.title}`);
  };

  // Calculate monthly price
  const calculateMonthlyPrice = (dailyPrice) => dailyPrice * 30;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#1F3A34]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ================= Header ================= */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#113B28]">
            Available Properties
          </h1>
          <CardDescription>
            Browse and find your perfect rental property
          </CardDescription>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-sm">
            <span className="font-semibold text-[#113B28]">{sortedProperties.length}</span> properties found
          </Badge>
        </div>
      </div>

      {/* ================= Search and Filter ================= */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search properties by title, location, or amenities..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filter and Sort */}
            <div className="flex gap-2">
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Properties</SelectItem>
                  <SelectItem value="available">Available Now</SelectItem>
                  <SelectItem value="occupied">Occupied</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rating</SelectItem>
                  <SelectItem value="beds">Most Bedrooms</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex border rounded-md overflow-hidden">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  className="h-10 w-10 rounded-none"
                >
                  <div className={`h-4 w-4 ${viewMode === "grid" ? "text-white" : "text-gray-600"}`}>
                    <div className="grid grid-cols-2 gap-0.5">
                      <div className="h-1.5 w-1.5 bg-current"></div>
                      <div className="h-1.5 w-1.5 bg-current"></div>
                      <div className="h-1.5 w-1.5 bg-current"></div>
                      <div className="h-1.5 w-1.5 bg-current"></div>
                    </div>
                  </div>
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                  className="h-10 w-10 rounded-none"
                >
                  <div className={`h-4 w-4 ${viewMode === "list" ? "text-white" : "text-gray-600"}`}>
                    <div className="space-y-0.5">
                      <div className="h-0.5 w-full bg-current"></div>
                      <div className="h-0.5 w-full bg-current"></div>
                      <div className="h-0.5 w-full bg-current"></div>
                    </div>
                  </div>
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            <Button
              variant={filter === 'all' ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All Properties
            </Button>
            <Button
              variant={filter === 'available' ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter('available')}
            >
              Available Now
            </Button>
            <Button
              variant={sortBy === 'price-low' ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy('price-low')}
            >
              Budget Friendly
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100"
            >
              Featured Properties
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ================= Properties Grid/List ================= */}
      {viewMode === "grid" ? (
        /* Grid View with Shadcn Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedProperties.length === 0 ? (
            <div className="col-span-3">
              <Card className="p-12 text-center">
                <Home className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <CardTitle className="mb-2">No properties found</CardTitle>
                <CardDescription className="mb-6 max-w-md mx-auto">
                  {searchQuery ? `No properties match "${searchQuery}". Try different keywords.` : 'No properties available matching your filters.'}
                </CardDescription>
                <Button
                  onClick={() => {
                    setSearchQuery('');
                    setFilter('all');
                    setSortBy('recent');
                  }}
                >
                  Clear Filters
                </Button>
              </Card>
            </div>
          ) : (
            sortedProperties.map((property) => (
              <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                {/* Property Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge
                      variant={property.status === 'available' ? "default" : "secondary"}
                      className={property.status === 'available' ? "bg-green-100 text-green-800 hover:bg-green-100" : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"}
                    >
                      {property.status === 'available' ? 'Available Now' : 'Occupied'}
                    </Badge>
                  </div>
                  <div className="absolute top-3 right-3 flex gap-2">
                    {property.featured && (
                      <Badge className="bg-amber-500 hover:bg-amber-600">
                        Featured
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 bg-white/90 backdrop-blur-sm hover:bg-white"
                      onClick={() => toggleFavorite(property.id)}
                    >
                      <Heart className={`h-4 w-4 ${favorites.includes(property.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                    </Button>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="flex justify-between items-center">
                      <Badge className="bg-black/70 backdrop-blur-sm text-white hover:bg-black/70">
                        ${property.price}<span className="text-xs">/{property.period}</span>
                      </Badge>
                      <Badge className="bg-black/70 backdrop-blur-sm text-white hover:bg-black/70">
                        <Star className="h-3 w-3 text-yellow-400 fill-yellow-400 mr-1" />
                        {property.rating} ({property.reviews})
                      </Badge>
                    </div>
                  </div>
                </div>

                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg mb-1">{property.title}</CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {property.location}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pb-3">
                  {/* Property Details */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-center gap-1">
                        <Bed className="h-4 w-4 text-gray-500" />
                        <span className="font-semibold">{property.bedrooms}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Beds</div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-center gap-1">
                        <Bath className="h-4 w-4 text-gray-500" />
                        <span className="font-semibold">{property.bathrooms}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Baths</div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-center gap-1">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span className="font-semibold">{property.guests}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Guests</div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{property.description}</p>

                  {/* Amenities */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {property.amenities.slice(0, 3).map((amenity, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {amenity}
                      </Badge>
                    ))}
                    {property.amenities.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{property.amenities.length - 3} more
                      </Badge>
                    )}
                  </div>

                  {/* Landlord Info */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-4">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={property.landlord.avatar} />
                        <AvatarFallback>
                          <Building className="h-4 w-4" />
                        </AvatarFallback>
                        {property.landlord.verified && (
                          <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full flex items-center justify-center">
                            <CheckCircle className="h-2 w-2 text-white" />
                          </div>
                        )}
                      </Avatar>
                      <div>
                        <div className="text-sm font-medium">{property.landlord.name}</div>
                        <div className="text-xs text-gray-500">Landlord</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-medium">{property.landlord.responseRate} response rate</div>
                      <div className="text-xs text-gray-500">{property.landlord.responseTime}</div>
                    </div>
                  </div>
                </CardContent>

                <CardFooter>
                  <div className="flex gap-2 w-full">
                    <Dialog open={detailsDialogOpen && selectedProperty?.id === property.id} onOpenChange={setDetailsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="default"
                          className="flex-1"
                          onClick={() => setSelectedProperty(property)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader className="pb-4 border-b">
                          <DialogTitle className="text-2xl">{property.title}</DialogTitle>
                          <DialogDescription className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            {property.location}
                          </DialogDescription>
                        </DialogHeader>
                        <PropertyDetailsDialog property={property} />
                      </DialogContent>
                    </Dialog>

                    <Dialog open={contactDialogOpen && selectedProperty?.id === property.id} onOpenChange={setContactDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => setSelectedProperty(property)}
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Contact
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Contact Landlord</DialogTitle>
                          <DialogDescription>
                            Send a message to {property.landlord.name} about {property.title}
                          </DialogDescription>
                        </DialogHeader>
                        <ContactLandlordForm
                          property={property}
                          onSubmit={handleContactLandlord}
                        />
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      ) : (
        /* List View with Shadcn Table */
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Property</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedProperties.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <Home className="h-12 w-12 text-gray-300 mb-4" />
                        <p className="text-gray-500">No properties found</p>
                        <p className="text-sm text-gray-400">
                          Try adjusting your search or filter
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedProperties.map((property) => (
                    <TableRow key={property.id} className="hover:bg-gray-50/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12 rounded-lg">
                            <AvatarImage src={property.images[0]} alt={property.title} />
                            <AvatarFallback className="rounded-lg">
                              <Home className="h-6 w-6" />
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-semibold text-[#113B28]">
                              {property.title}
                            </div>
                            <div className="flex items-center gap-1 mt-1">
                              <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                              <span className="text-xs font-medium">{property.rating}</span>
                              <span className="text-xs text-gray-500">({property.reviews})</span>
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{property.location}</span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="font-semibold text-gray-800">
                          ${property.price}
                          <span className="text-sm font-normal text-gray-500">/{property.period}</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {property.leaseType} lease
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="text-sm">
                          <div className="flex items-center gap-2">
                            <Bed className="h-3 w-3 text-gray-500" />
                            <span>{property.bedrooms} bed</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Bath className="h-3 w-3 text-gray-500" />
                            <span>{property.bathrooms} bath</span>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant={property.status === 'available' ? "default" : "secondary"}
                          className={property.status === 'available' ? "bg-green-100 text-green-800 hover:bg-green-100" : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"}
                        >
                          {property.status === 'available' ? 'Available Now' : 'Occupied'}
                        </Badge>
                        <div className="text-xs text-gray-500 mt-1">
                          From {formatDate(property.availableFrom)}
                        </div>
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleFavorite(property.id)}
                            title={favorites.includes(property.id) ? "Remove from favorites" : "Add to favorites"}
                          >
                            <Heart className={`h-4 w-4 ${favorites.includes(property.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                          </Button>

                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-7xl w-[95vw] max-h-[85vh] overflow-y-auto p-0">
                              <div className="p-6">
                                <DialogHeader className="pb-4">
                                  <DialogTitle className="sr-only">Property Details</DialogTitle>
                                </DialogHeader>
                                <PropertyDetailsDialog property={property} />
                              </div>
                            </DialogContent>
                          </Dialog>

                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MessageSquare className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Contact Landlord</DialogTitle>
                                <DialogDescription>
                                  Send a message to {property.landlord.name}
                                </DialogDescription>
                              </DialogHeader>
                              <ContactLandlordForm
                                property={property}
                                onSubmit={handleContactLandlord}
                              />
                            </DialogContent>
                          </Dialog>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <ChevronDown className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleScheduleTour(property)}>
                                <Calendar className="h-4 w-4 mr-2" />
                                Schedule Tour
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Share2 className="h-4 w-4 mr-2" />
                                Share Property
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Phone className="h-4 w-4 mr-2" />
                                Call Landlord
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Property Details Dialog Component
function PropertyDetailsDialog({ property }) {
  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  // Calculate monthly price function
  const calculateMonthlyPrice = (dailyPrice) => dailyPrice * 30;

  return (
    <div className="space-y-8 py-2">
      {/* Header Section */}
      <div className="border-b pb-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-[#113B28] mb-2">
              {property.title}
            </h1>
            <div className="flex items-center gap-4 text-gray-600">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                <span>{property.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                <span>+1 234 567 8900</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-green-100 text-green-800">
              {property.status === 'available' ? 'Available Now' : 'Occupied'}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              {property.rating} ({property.reviews})
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
        {/* Left Column - Description & Amenities */}
        <div className="lg:col-span-2 space-y-8">
          {/* Property Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <img
                src={property.images[0]}
                alt={property.title}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {property.images.slice(1, 3).map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`${property.title} ${index + 2}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-2xl font-bold text-[#113B28] mb-4">Description</h2>
            <p className="text-gray-700 leading-relaxed">{property.description}</p>
          </div>

          {/* Amenities */}
          <div>
            <h2 className="text-2xl font-bold text-[#113B28] mb-4">Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {property.amenities.map((amenity, index) => (
                <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-medium">{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Cards */}
        <div className="space-y-6">
          {/* Pricing Card */}
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="pb-3 bg-gray-50">
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                Pricing Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="flex justify-between items-center py-2 border-b">
                <div className="text-gray-600">Daily Rate</div>
                <div className="font-bold text-lg">${property.price}/{property.period}</div>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <div className="text-gray-600">Monthly Rent</div>
                <div className="font-bold text-lg">{formatCurrency(calculateMonthlyPrice(property.price))}</div>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <div className="text-gray-600">Security Deposit</div>
                <div className="font-bold text-lg">{formatCurrency(property.deposit)}</div>
              </div>
              <div className="flex justify-between items-center pt-2">
                <div className="font-bold text-lg">Total Move-in Cost</div>
                <div className="font-bold text-xl text-[#113B28]">
                  {formatCurrency(calculateMonthlyPrice(property.price) + property.deposit)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Property Details Card */}
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="pb-3 bg-gray-50">
              <CardTitle className="text-lg flex items-center gap-2">
                <Building className="h-5 w-5 text-purple-600" />
                Property Details
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-[#113B28] mb-1">{property.bedrooms}</div>
                  <div className="text-sm text-gray-600">Bedrooms</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-[#113B28] mb-1">{property.bathrooms}</div>
                  <div className="text-sm text-gray-600">Bathrooms</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-[#113B28] mb-1">{property.guests}</div>
                  <div className="text-sm text-gray-600">Max Guests</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-[#113B28] mb-1">{property.area}</div>
                  <div className="text-sm text-gray-600">Area ({property.unit})</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Availability Card */}
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="pb-3 bg-gray-50">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Availability
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-gray-500 flex-shrink-0" />
                <div>
                  <div className="text-sm text-gray-600">Available from</div>
                  <div className="font-semibold">{formatDate(property.availableFrom)}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-gray-500 flex-shrink-0" />
                <div>
                  <div className="text-sm text-gray-600">Minimum stay</div>
                  <div className="font-semibold">{property.minStay} days</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Tag className="h-5 w-5 text-gray-500 flex-shrink-0" />
                <div>
                  <div className="text-sm text-gray-600">Lease type</div>
                  <div className="font-semibold">{property.leaseType}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button className="flex-1 bg-[#113B28] hover:bg-[#0c2a1e]">
              <Phone className="h-4 w-4 mr-2" />
              Call Now
            </Button>
            <Button variant="outline" className="flex-1">
              <MessageSquare className="h-4 w-4 mr-2" />
              Message
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Contact Landlord Form Component
function ContactLandlordForm({ property, onSubmit }) {
  const [message, setMessage] = useState("");
  const [contactMethod, setContactMethod] = useState("message");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(property);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 py-2">
      <div className="space-y-4">
        <Label className="text-base">Contact Method</Label>
        <RadioGroup
          value={contactMethod}
          onValueChange={setContactMethod}
          className="grid grid-cols-1 md:grid-cols-3 gap-3"
        >
          <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
            <RadioGroupItem value="message" id="message" />
            <Label htmlFor="message" className="cursor-pointer flex-1">
              <div className="font-medium">Message</div>
              <div className="text-sm text-gray-500">Send a direct message</div>
            </Label>
          </div>
          <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
            <RadioGroupItem value="call" id="call" />
            <Label htmlFor="call" className="cursor-pointer flex-1">
              <div className="font-medium">Phone Call</div>
              <div className="text-sm text-gray-500">Request a phone call</div>
            </Label>
          </div>
          <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
            <RadioGroupItem value="tour" id="tour" />
            <Label htmlFor="tour" className="cursor-pointer flex-1">
              <div className="font-medium">Schedule Tour</div>
              <div className="text-sm text-gray-500">Book a property tour</div>
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-3">
        <Label htmlFor="message" className="text-base">Your Message</Label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={`Hi ${property.landlord.name}, I'm interested in "${property.title}" located at ${property.location}. Could you please provide more details about availability and viewing options?`}
          className="w-full min-h-[150px] p-4 border rounded-lg focus:ring-2 focus:ring-[#113B28] focus:border-transparent"
          required
        />
        <div className="text-sm text-gray-500">
          Your contact information will be shared with the landlord
        </div>
      </div>

      <DialogFooter className="flex gap-3">
        <DialogClose asChild>
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </DialogClose>
        <Button type="submit" className="bg-[#113B28] hover:bg-[#0c2a1e]">
          Send Message
        </Button>
      </DialogFooter>
    </form>
  );
}