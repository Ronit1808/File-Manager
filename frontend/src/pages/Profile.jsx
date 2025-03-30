import { useState, useEffect } from "react";
import { User, Phone, MapPin, Check, Loader, Plus, ChevronRight, Home } from "lucide-react";
import axiosInstance from "../../axiosInstance";

const Profile = () => {
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    phone_number: "",
    addresses: [],
  });

  const [newUsername, setNewUsername] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const [successMessage, setSuccessMessage] = useState("");

  // Address fields
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [addressFormVisible, setAddressFormVisible] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      
      const response = await axiosInstance.get("/profile/", {
        headers: { 
          "Content-Type": "application/json"
        },
      });
      const data = response.data;
      
      console.log("Profile data:", data);
      setTimeout(() => {
        setProfile({
          ...data,
          addresses: data.addresses || [],
        });
        setNewUsername(data.username);
        setNewPhone(data.profile?.phone_number || "");
        setIsLoading(false);
      }, 800);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setIsLoading(false);
    }
  };

  const updateUsername = async () => {
    if (!newUsername.trim()) {
      showMessage("Username cannot be empty");
      return;
    }
    
    try {
      await axiosInstance.patch("/profile/update-username/", { username: newUsername }, {
        headers: { 
          "Content-Type": "application/json"
        },
      });
      
      setProfile({ ...profile, username: newUsername });
      showMessage("Username updated successfully!");
    } catch (error) {
      console.error("Error updating username:", error);
      showMessage("Failed to update username", true);
    }
  };

  const updatePhone = async () => {
    try {
      await axiosInstance.patch("/profile/update-phone/", { phone_number: newPhone }, {
        headers: { 
          "Content-Type": "application/json"
        },
      });
      
      setProfile({ 
        ...profile, 
        profile: { ...profile.profile, phone_number: newPhone } 
      });
      showMessage("Phone number updated successfully!");
    } catch (error) {
      console.error("Error updating phone:", error);
      showMessage("Failed to update phone number", true);
    }
  };

  const addAddress = async () => {
    if (!street || !city || !state || !country || !zipCode) {
      showMessage("Please fill in all address fields", true);
      return;
    }

    try {
      await axiosInstance.post("/profile/add-address/", { street, city, state, country, zip_code: zipCode }, {
        headers: { 
          "Content-Type": "application/json"
        },
      });
      
      const newAddress = {
        id: Date.now(),
        street,
        city,
        state,
        country,
        zip_code: zipCode
      };
      
      setProfile({
        ...profile,
        addresses: [...profile.addresses, newAddress]
      });
      
      setStreet("");
      setCity("");
      setState("");
      setCountry("");
      setZipCode("");
      setAddressFormVisible(false);
      showMessage("Address added successfully!");
    } catch (error) {
      console.error("Error adding address:", error);
      showMessage("Failed to add address", true);
    }
  };

  const showMessage = (message, isError = false) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin h-8 w-8 text-blue-500" />
        <span className="ml-2 text-gray-600">Loading profile data...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <User className="mr-2" />
            User Profile
          </h1>
          <p className="text-gray-600 mt-1">Manage your personal information and addresses</p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mx-6 mt-4 p-3 bg-green-100 text-green-700 rounded-md flex items-center">
            <Check size={20} className="mr-2" />
            {successMessage}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex px-6">
            <button 
              onClick={() => setActiveTab("profile")}
              className={`py-4 px-4 font-medium text-sm flex items-center ${
                activeTab === "profile" 
                  ? "border-b-2 border-blue-500 text-blue-600" 
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <User size={16} className="mr-2" />
              Personal Info
            </button>
            <button 
              onClick={() => setActiveTab("addresses")}
              className={`py-4 px-4 font-medium text-sm flex items-center ${
                activeTab === "addresses" 
                  ? "border-b-2 border-blue-500 text-blue-600" 
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <MapPin size={16} className="mr-2" />
              Addresses
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg mb-6 flex items-start">
                <div className="bg-blue-100 rounded-full p-3 mr-4">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-blue-800">Basic Information</h3>
                  <p className="text-sm text-blue-600">Keep your personal details up to date</p>
                </div>
              </div>
              
              {/* Email Display (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <div className="bg-gray-50 p-3 rounded border border-gray-200 text-gray-700">
                  {profile.email}
                </div>
                <p className="mt-1 text-xs text-gray-500">Your email address cannot be changed</p>
              </div>
              
              {/* Username Update */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <div className="flex">
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="flex-1 rounded-l-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button 
                    onClick={updateUsername} 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-md transition-colors"
                  >
                    Update
                  </button>
                </div>
              </div>
              
              {/* Phone Number Update */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <div className="flex">
                  <div className="relative flex-1">
                    <Phone size={16} className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      className="pl-10 w-full rounded-l-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <button 
                    onClick={updatePhone} 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-md transition-colors"
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "addresses" && (
            <div>
              <div className="bg-green-50 p-4 rounded-lg mb-6 flex items-start">
                <div className="bg-green-100 rounded-full p-3 mr-4">
                  <MapPin className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium text-green-800">Addresses</h3>
                  <p className="text-sm text-green-600">Manage your addresses</p>
                </div>
              </div>

              {/* Display Saved Addresses */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-gray-800">Your Addresses</h3>
                  <button 
                    onClick={() => setAddressFormVisible(!addressFormVisible)}
                    className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                  >
                    {addressFormVisible ? "Cancel" : (
                      <>
                        <Plus size={16} className="mr-1" />
                        Add New Address
                      </>
                    )}
                  </button>
                </div>

                {profile.addresses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profile.addresses.map((addr) => (
                      <div key={addr.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between">
                          <div className="flex items-center mb-2">
                            <Home size={16} className="text-gray-500 mr-2" />
                            <h4 className="font-medium text-gray-900">
                              {addr.city}, {addr.state}
                            </h4>
                          </div>
                          <button className="text-gray-400 hover:text-gray-500">
                            <ChevronRight size={16} />
                          </button>
                        </div>
                        <p className="text-gray-600 text-sm">{addr.street}</p>
                        <p className="text-gray-600 text-sm">{addr.city}, {addr.state} {addr.zip_code}</p>
                        <p className="text-gray-600 text-sm">{addr.country}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                    <MapPin className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                    <p>No addresses found.</p>
                    <p className="text-sm">Add your first address to get started.</p>
                  </div>
                )}
              </div>

              {/* Add New Address Form */}
              {addressFormVisible && (
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 mt-4">
                  <h3 className="font-medium text-gray-800 mb-3">Add New Address</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                      <input
                        type="text"
                        placeholder="123 Main St"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <input
                        type="text"
                        placeholder="San Francisco"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">State/Province</label>
                      <input
                        type="text"
                        placeholder="California"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                      <input
                        type="text"
                        placeholder="United States"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Zip/Postal Code</label>
                      <input
                        type="text"
                        placeholder="94105"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <button 
                        onClick={addAddress} 
                        className="mt-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
                      >
                        <Plus size={16} className="inline mr-2" />
                        Add Address
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
