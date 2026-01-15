'use client';

import { Mail, MapPin, Phone, User, Home } from "lucide-react";
import { useState, useEffect } from "react";
import CustomSelect from "../../Admin/CustomSelect";

export function PersonalInfo({ user, editMode, onSave, loading }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
  });

  // Initialize form data when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user?.address || '',
        city: user?.city || '',
        country: user?.country || '',
      });
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLocationChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Country options
  const countryOptions = [
    { value: '', label: 'Select Country' },
    { value: 'United States', label: 'United States' },
    { value: 'Canada', label: 'Canada' },
    { value: 'United Kingdom', label: 'United Kingdom' },
    { value: 'Australia', label: 'Australia' },
    { value: 'Germany', label: 'Germany' },
    { value: 'France', label: 'France' },
    { value: 'Spain', label: 'Spain' },
    { value: 'Italy', label: 'Italy' },
    { value: 'Japan', label: 'Japan' },
    { value: 'China', label: 'China' },
    { value: 'India', label: 'India' },
    { value: 'Bangladesh', label: 'Bangladesh' }
  ];

  // City options based on selected country
  const getCityOptions = () => {
    const citiesByCountry = {
      '': [{ value: '', label: 'Select City' }],
      'United States': [
        { value: '', label: 'Select City' },
        { value: 'New York', label: 'New York' },
        { value: 'Los Angeles', label: 'Los Angeles' },
        { value: 'Chicago', label: 'Chicago' },
        { value: 'Houston', label: 'Houston' },
        { value: 'Phoenix', label: 'Phoenix' },
        { value: 'Philadelphia', label: 'Philadelphia' },
        { value: 'San Antonio', label: 'San Antonio' },
        { value: 'San Diego', label: 'San Diego' },
        { value: 'Dallas', label: 'Dallas' },
        { value: 'San Jose', label: 'San Jose' }
      ],
      'Canada': [
        { value: '', label: 'Select City' },
        { value: 'Toronto', label: 'Toronto' },
        { value: 'Vancouver', label: 'Vancouver' },
        { value: 'Montreal', label: 'Montreal' },
        { value: 'Calgary', label: 'Calgary' },
        { value: 'Edmonton', label: 'Edmonton' },
        { value: 'Ottawa', label: 'Ottawa' },
        { value: 'Winnipeg', label: 'Winnipeg' }
      ],
      'United Kingdom': [
        { value: '', label: 'Select City' },
        { value: 'London', label: 'London' },
        { value: 'Manchester', label: 'Manchester' },
        { value: 'Birmingham', label: 'Birmingham' },
        { value: 'Liverpool', label: 'Liverpool' },
        { value: 'Leeds', label: 'Leeds' },
        { value: 'Glasgow', label: 'Glasgow' },
        { value: 'Sheffield', label: 'Sheffield' }
      ],
      'Australia': [
        { value: '', label: 'Select City' },
        { value: 'Sydney', label: 'Sydney' },
        { value: 'Melbourne', label: 'Melbourne' },
        { value: 'Brisbane', label: 'Brisbane' },
        { value: 'Perth', label: 'Perth' },
        { value: 'Adelaide', label: 'Adelaide' },
        { value: 'Gold Coast', label: 'Gold Coast' },
        { value: 'Canberra', label: 'Canberra' }
      ],
      'Germany': [
        { value: '', label: 'Select City' },
        { value: 'Berlin', label: 'Berlin' },
        { value: 'Hamburg', label: 'Hamburg' },
        { value: 'Munich', label: 'Munich' },
        { value: 'Cologne', label: 'Cologne' },
        { value: 'Frankfurt', label: 'Frankfurt' },
        { value: 'Stuttgart', label: 'Stuttgart' },
        { value: 'Düsseldorf', label: 'Düsseldorf' }
      ],
      'France': [
        { value: '', label: 'Select City' },
        { value: 'Paris', label: 'Paris' },
        { value: 'Marseille', label: 'Marseille' },
        { value: 'Lyon', label: 'Lyon' },
        { value: 'Toulouse', label: 'Toulouse' },
        { value: 'Nice', label: 'Nice' },
        { value: 'Nantes', label: 'Nantes' },
        { value: 'Strasbourg', label: 'Strasbourg' }
      ],
      'Spain': [
        { value: '', label: 'Select City' },
        { value: 'Madrid', label: 'Madrid' },
        { value: 'Barcelona', label: 'Barcelona' },
        { value: 'Valencia', label: 'Valencia' },
        { value: 'Seville', label: 'Seville' },
        { value: 'Zaragoza', label: 'Zaragoza' },
        { value: 'Málaga', label: 'Málaga' },
        { value: 'Murcia', label: 'Murcia' }
      ],
      'Italy': [
        { value: '', label: 'Select City' },
        { value: 'Rome', label: 'Rome' },
        { value: 'Milan', label: 'Milan' },
        { value: 'Naples', label: 'Naples' },
        { value: 'Turin', label: 'Turin' },
        { value: 'Palermo', label: 'Palermo' },
        { value: 'Genoa', label: 'Genoa' },
        { value: 'Bologna', label: 'Bologna' }
      ],
      'Japan': [
        { value: '', label: 'Select City' },
        { value: 'Tokyo', label: 'Tokyo' },
        { value: 'Yokohama', label: 'Yokohama' },
        { value: 'Osaka', label: 'Osaka' },
        { value: 'Nagoya', label: 'Nagoya' },
        { value: 'Sapporo', label: 'Sapporo' },
        { value: 'Kobe', label: 'Kobe' },
        { value: 'Kyoto', label: 'Kyoto' }
      ],
      'China': [
        { value: '', label: 'Select City' },
        { value: 'Beijing', label: 'Beijing' },
        { value: 'Shanghai', label: 'Shanghai' },
        { value: 'Guangzhou', label: 'Guangzhou' },
        { value: 'Shenzhen', label: 'Shenzhen' },
        { value: 'Chengdu', label: 'Chengdu' },
        { value: 'Chongqing', label: 'Chongqing' },
        { value: 'Tianjin', label: 'Tianjin' }
      ],
      'India': [
        { value: '', label: 'Select City' },
        { value: 'Mumbai', label: 'Mumbai' },
        { value: 'Delhi', label: 'Delhi' },
        { value: 'Bangalore', label: 'Bangalore' },
        { value: 'Hyderabad', label: 'Hyderabad' },
        { value: 'Ahmedabad', label: 'Ahmedabad' },
        { value: 'Chennai', label: 'Chennai' },
        { value: 'Kolkata', label: 'Kolkata' }
      ],
      'Bangladesh': [
        { value: '', label: 'Select City' },
        { value: 'Dhaka', label: 'Dhaka' },
        { value: 'Chittagong', label: 'Chittagong' },
        { value: 'Khulna', label: 'Khulna' },
        { value: 'Rajshahi', label: 'Rajshahi' },
        { value: 'Sylhet', label: 'Sylhet' },
        { value: 'Barisal', label: 'Barisal' },
        { value: 'Rangpur', label: 'Rangpur' }
      ]
    };

    return citiesByCountry[formData.country] || [{ value: '', label: 'Select City' }];
  };

  return (
    <div>
      {editMode ? (
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    disabled={loading}
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="border-t pt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              Location Information
            </h3>

            {/* Address Field */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="3"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none disabled:opacity-50"
                  placeholder="Enter your complete address"
                  disabled={loading}
                />
              </div>
            </div>

            {/* City, State, Zip, Country Fields in Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Country */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Country
                </label>
                <CustomSelect
                  value={formData.country}
                  onChange={(value) => handleLocationChange('country', value)}
                  options={countryOptions}
                  className="w-full disabled:opacity-50"
                  variant="admin"
                  disabled={loading}
                />
              </div>

              {/* City - Shows based on selected country */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  City
                </label>
                <CustomSelect
                  value={formData.city}
                  onChange={(value) => handleLocationChange('city', value)}
                  options={getCityOptions()}
                  className="w-full disabled:opacity-50"
                  variant="admin"
                  disabled={loading || !formData.country}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 border-t">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="flex-1 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-[#004087] text-white rounded-lg hover:bg-[#004a9e] disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-8">
          {/* Personal Information Display */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Full Name *
                </label>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <User className="h-5 w-5 text-gray-500 mr-3" />
                  <span className="font-medium text-gray-900">
                    {user.name || 'Not provided'}
                  </span>
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <Phone className="h-5 w-5 text-gray-500 mr-3" />
                  <span className="font-medium text-gray-900">
                    {user.phone || 'Not provided'}
                  </span>
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Email Address *
                </label>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <Mail className="h-5 w-5 text-gray-500 mr-3" />
                  <span className="font-medium text-gray-900">
                    {user.email || 'Not provided'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Location Information Display */}
          <div className="border-t pt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              Location Information
            </h3>

            {user?.address ? (
              <div className="space-y-6">
                {/* Address */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex">
                      <MapPin className="h-5 w-5 text-gray-500 mr-3 mt-0.5 flex-shrink-0" />
                      <p className="font-medium text-gray-900 leading-relaxed">
                        {user.address}
                      </p>
                    </div>
                  </div>
                </div>

                {/* City, Country Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  {/* Country */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Country
                    </label>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="font-medium text-gray-900">
                        {user.country || 'Not provided'}
                      </p>
                    </div>
                  </div>
                  {/* City */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      City
                    </label>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="font-medium text-gray-900">
                        {user.city || 'Not provided'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-gray-600">No location information added yet</p>
                <p className="text-sm text-gray-500 mt-2">Click "Edit Profile" to add location details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}