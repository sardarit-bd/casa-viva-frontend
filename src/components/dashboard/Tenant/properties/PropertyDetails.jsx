import { Badge, Star } from "lucide-react";

export function PropertyDetails({ property }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-1">Property ID</h4>
          <p className="font-medium">{property.id}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-1">Status</h4>
          <Badge 
            variant={
              property.status === "active" ? "default" :
              property.status === "pending" ? "secondary" :
              "outline"
            }
          >
            {property.status}
          </Badge>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-1">Location</h4>
          <p className="font-medium">{property.location}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-1">Price</h4>
          <p className="font-medium">${property.price}/{property.period}</p>
        </div>
      </div>
      
      <div>
        <h4 className="text-sm font-medium text-gray-500 mb-1">Description</h4>
        <p className="text-gray-700">{property.description}</p>
      </div>
      
      <div className="grid grid-cols-4 gap-4">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-lg font-bold">{property.bedrooms}</div>
          <div className="text-sm text-gray-500">Bedrooms</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-lg font-bold">{property.bathrooms}</div>
          <div className="text-sm text-gray-500">Bathrooms</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-lg font-bold">{property.area}</div>
          <div className="text-sm text-gray-500">Area</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center gap-1">
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            <div className="text-lg font-bold">{property.rating}</div>
          </div>
          <div className="text-sm text-gray-500">Rating</div>
        </div>
      </div>
    </div>
  );
}