"use client";

import { useState, useEffect } from "react";
import { Save, RefreshCw, Upload, Store, MapPin, Share2, Image as ImageIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Label } from "@/shared/components/ui/label";
import { Separator } from "@/shared/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { toast } from "sonner";
import Image from "next/image";

interface StoreSettings {
  name: string;
  description: string;
  logo: string;
  banner: string;
  phone: string;
  email: string;
  address: {
    street: string;
    city: string;
    province: string;
    postalCode: string;
  };
  socialMedia: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
  operational: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<StoreSettings>({
    name: "",
    description: "",
    logo: "",
    banner: "",
    phone: "",
    email: "",
    address: {
      street: "",
      city: "",
      province: "",
      postalCode: "",
    },
    socialMedia: {},
    operational: {
      monday: "09:00 - 17:00",
      tuesday: "09:00 - 17:00",
      wednesday: "09:00 - 17:00",
      thursday: "09:00 - 17:00",
      friday: "09:00 - 17:00",
      saturday: "09:00 - 15:00",
      sunday: "Closed",
    },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoPreview, setLogoPreview] = useState("");
  const [bannerPreview, setBannerPreview] = useState("");
  const [activeTab, setActiveTab] = useState("general");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockSettings: StoreSettings = {
        name: "My Fashion Store",
        description: "Premium preloved fashion items with guaranteed quality. We offer the best selection of vintage and modern fashion pieces.",
        logo: "/placeholder-logo.jpg",
        banner: "/placeholder-banner.jpg",
        phone: "+62 812-3456-7890",
        email: "store@example.com",
        address: {
          street: "Jl. Sudirman No. 123",
          city: "Jakarta",
          province: "DKI Jakarta",
          postalCode: "12345",
        },
        socialMedia: {
          instagram: "@myfashionstore",
          facebook: "myfashionstore",
          twitter: "@myfashionstore",
        },
        operational: {
          monday: "09:00 - 17:00",
          tuesday: "09:00 - 17:00",
          wednesday: "09:00 - 17:00",
          thursday: "09:00 - 17:00",
          friday: "09:00 - 17:00",
          saturday: "09:00 - 15:00",
          sunday: "Closed",
        },
      };

      setSettings(mockSettings);
      setLogoPreview(mockSettings.logo);
      setBannerPreview(mockSettings.banner);
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Settings saved successfully");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = (type: "logo" | "banner", file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      if (type === "logo") {
        setLogoPreview(result);
        setSettings({ ...settings, logo: result });
      } else {
        setBannerPreview(result);
        setSettings({ ...settings, banner: result });
      }
    };
    reader.readAsDataURL(file);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="text-center space-y-4">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-sky-600 border-t-transparent"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 max-w-[1400px] mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white glossy-text-title">
            Store Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your store information and preferences
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchSettings}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Reset</span>
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition-all shadow-lg shadow-sky-600/20 disabled:opacity-50 font-medium"
          >
            {saving ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            <span>{saving ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start">
          <TabsTrigger value="general" className="gap-2">
            <Store className="w-4 h-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="location" className="gap-2">
            <MapPin className="w-4 h-4" />
            Location
          </TabsTrigger>
          <TabsTrigger value="branding" className="gap-2">
            <ImageIcon className="w-4 h-4" />
            Branding
          </TabsTrigger>
          <TabsTrigger value="social" className="gap-2">
            <Share2 className="w-4 h-4" />
            Social Media
          </TabsTrigger>
        </TabsList>

        {/* General Tab */}
        <TabsContent value="general" className="space-y-6">
          <Card className="glossy-card">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Update your store's basic details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="store-name">Store Name</Label>
                <Input
                  id="store-name"
                  type="text"
                  value={settings.name}
                  onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                  placeholder="Enter your store name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={settings.description}
                  onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                  rows={4}
                  placeholder="Describe your store..."
                />
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={settings.phone}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                    placeholder="+62 xxx-xxxx-xxxx"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    placeholder="store@example.com"
                  />
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Operational Hours</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(settings.operational).map(([day, hours]) => (
                    <div key={day} className="space-y-2">
                      <Label htmlFor={`op-${day}`} className="capitalize">{day}</Label>
                      <Input
                        id={`op-${day}`}
                        type="text"
                        value={hours}
                        onChange={(e) => setSettings({
                          ...settings,
                          operational: { ...settings.operational, [day]: e.target.value }
                        })}
                        placeholder="09:00 - 17:00"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Location Tab */}
        <TabsContent value="location" className="space-y-6">
          <Card className="glossy-card">
            <CardHeader>
              <CardTitle>Store Address</CardTitle>
              <CardDescription>Manage your store's physical location</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="street">Street Address</Label>
                <Input
                  id="street"
                  type="text"
                  value={settings.address.street}
                  onChange={(e) => setSettings({
                    ...settings,
                    address: { ...settings.address, street: e.target.value }
                  })}
                  placeholder="Jl. Example No. 123"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    type="text"
                    value={settings.address.city}
                    onChange={(e) => setSettings({
                      ...settings,
                      address: { ...settings.address, city: e.target.value }
                    })}
                    placeholder="Jakarta"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="province">Province</Label>
                  <Input
                    id="province"
                    type="text"
                    value={settings.address.province}
                    onChange={(e) => setSettings({
                      ...settings,
                      address: { ...settings.address, province: e.target.value }
                    })}
                    placeholder="DKI Jakarta"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postal">Postal Code</Label>
                  <Input
                    id="postal"
                    type="text"
                    value={settings.address.postalCode}
                    onChange={(e) => setSettings({
                      ...settings,
                      address: { ...settings.address, postalCode: e.target.value }
                    })}
                    placeholder="12345"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Branding Tab */}
        <TabsContent value="branding" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glossy-card">
              <CardHeader>
                <CardTitle>Store Logo</CardTitle>
                <CardDescription>Upload your store logo (recommended: 400x400px)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center p-6 bg-gray-50 dark:bg-gray-900 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-sky-500 dark:hover:border-sky-500 transition-colors">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden bg-white dark:bg-gray-800 mb-4 shadow-lg">
                    {logoPreview ? (
                      <Image src={logoPreview} alt="Logo" fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Upload className="w-12 h-12" />
                      </div>
                    )}
                  </div>
                  <label
                    htmlFor="logo-upload"
                    className="cursor-pointer px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors font-medium"
                  >
                    Change Logo
                    <input
                      type="file"
                      id="logo-upload"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleImageUpload("logo", e.target.files[0])}
                    />
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">PNG, JPG up to 2MB</p>
                </div>
              </CardContent>
            </Card>

            <Card className="glossy-card">
              <CardHeader>
                <CardTitle>Store Banner</CardTitle>
                <CardDescription>Upload your store banner (recommended: 1200x400px)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center p-6 bg-gray-50 dark:bg-gray-900 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-sky-500 dark:hover:border-sky-500 transition-colors">
                  <div className="relative w-full h-40 rounded-lg overflow-hidden bg-white dark:bg-gray-800 mb-4 shadow-lg">
                    {bannerPreview ? (
                      <Image src={bannerPreview} alt="Banner" fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Upload className="w-12 h-12" />
                      </div>
                    )}
                  </div>
                  <label
                    htmlFor="banner-upload"
                    className="cursor-pointer px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors font-medium"
                  >
                    Change Banner
                    <input
                      type="file"
                      id="banner-upload"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleImageUpload("banner", e.target.files[0])}
                    />
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">PNG, JPG up to 5MB</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Social Media Tab */}
        <TabsContent value="social" className="space-y-6">
          <Card className="glossy-card">
            <CardHeader>
              <CardTitle>Social Media Links</CardTitle>
              <CardDescription>Connect your social media accounts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">@</span>
                  <Input
                    id="instagram"
                    type="text"
                    value={settings.socialMedia.instagram || ""}
                    onChange={(e) => setSettings({
                      ...settings,
                      socialMedia: { ...settings.socialMedia, instagram: e.target.value }
                    })}
                    className="pl-8"
                    placeholder="username"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="facebook">Facebook</Label>
                <Input
                  id="facebook"
                  type="text"
                  value={settings.socialMedia.facebook || ""}
                  onChange={(e) => setSettings({
                    ...settings,
                    socialMedia: { ...settings.socialMedia, facebook: e.target.value }
                  })}
                  placeholder="username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter / X</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">@</span>
                  <Input
                    id="twitter"
                    type="text"
                    value={settings.socialMedia.twitter || ""}
                    onChange={(e) => setSettings({
                      ...settings,
                      socialMedia: { ...settings.socialMedia, twitter: e.target.value }
                    })}
                    className="pl-8"
                    placeholder="username"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
