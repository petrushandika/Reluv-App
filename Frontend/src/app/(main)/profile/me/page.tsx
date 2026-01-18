"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  User as UserIcon,
  Mail,
  Phone,
  Calendar,
  ShieldCheck,
  Bell,
  Save,
  Camera,
  Info,
  ChevronRight,
  LogOut,
  MapPin,
  Check
} from "lucide-react";
import { useAuthStore } from "@/features/(auth)/store/auth.store";
import { getMe, updateMe, updateMyProfile } from "@/features/(main)/user/api/userApi";
import { User as UserType } from "@/features/(auth)/types";
import { PrivateRoute } from "@/shared/components/guards/RouteGuards";
import { toast } from "sonner";
import ProfileSidebar from "@/shared/components/layout/ProfileSidebar";
import Spinner from "@/shared/components/common/Spinner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Select } from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";

const ProfilePage = () => {
  const router = useRouter();
  const { user: authUser, isAuthenticated, fetchAndSetUser } = useAuthStore();
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("identity");
  
  // Form states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birth, setBirth] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (!isAuthenticated()) {
        router.push("/login");
        return;
      }

      try {
        const userData = await getMe();
        setUser(userData);
        setFirstName(userData.firstName || "");
        setLastName(userData.lastName || "");
        setPhone(userData.phone || "");
        setGender(userData.profile?.gender || "");
        setBio(userData.profile?.bio || "");
        if (userData.birth) {
          setBirth(new Date(userData.birth).toISOString().split('T')[0]);
        }
      } catch (error) {
        toast.error("Gagal memuat profil");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [isAuthenticated, router]);

  const handleSaveIdentity = async () => {
    setIsSaving(true);
    try {
      await updateMe({ firstName, lastName, birth });
      await updateMyProfile({ gender, bio });
      await fetchAndSetUser();
      toast.success("Profil berhasil diperbarui");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal memperbarui profil");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveContact = async () => {
    setIsSaving(true);
    try {
      await updateMe({ phone });
      await fetchAndSetUser();
      toast.success("Info kontak berhasil diperbarui");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal memperbarui kontak");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <PrivateRoute>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4 sm:px-6 md:px-10 xl:px-20 2xl:px-40 py-10 sm:py-12 md:py-14">
          <div className="flex flex-col lg:flex-row lg:items-start gap-8 lg:gap-12">
            
            <ProfileSidebar user={user} />

            <main className="flex-1 space-y-8">
              <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                   <UserIcon className="w-6 h-6 text-sky-600" />
                   Pengaturan Profil
                </h1>
                <p className="text-sm text-slate-500 font-medium tracking-tight">Kelola informasi pribadi dan pengaturan keamanan akun Anda.</p>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="w-full overflow-x-auto pb-2 scrollbar-hide">
                  <TabsList className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-1 rounded-xl w-fit flex h-12 shadow-none">
                  <TabsTrigger 
                    value="identity" 
                    className="px-6 rounded-lg text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-slate-50 dark:data-[state=active]:bg-slate-900 data-[state=active]:text-sky-600 data-[state=active]:border border-transparent transition-all h-full"
                  >
                    Identitas
                  </TabsTrigger>
                  <TabsTrigger 
                    value="account"
                    className="px-6 rounded-lg text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-slate-50 dark:data-[state=active]:bg-slate-900 data-[state=active]:text-sky-600 data-[state=active]:border border-transparent transition-all h-full"
                  >
                    Akun & Kontak
                  </TabsTrigger>
                  <TabsTrigger 
                    value="security"
                    className="px-6 rounded-lg text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-slate-50 dark:data-[state=active]:bg-slate-900 data-[state=active]:text-sky-600 data-[state=active]:border border-transparent transition-all h-full"
                  >
                    Keamanan
                  </TabsTrigger>
                </TabsList>

                </div >

                <TabsContent value="identity" className="space-y-6 focus-visible:outline-none mt-4 md:mt-0">
                  <Card className="border-slate-200 dark:border-slate-800 shadow-none rounded-2xl overflow-hidden bg-white dark:bg-slate-950 border">
                    <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 py-6">
                      <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-white flex items-center gap-2">
                        <Info className="w-4 h-4 text-sky-600" />
                        Informasi Pribadi
                      </CardTitle>
                      <CardDescription className="text-xs font-medium text-slate-500">Nama dan data diri Anda yang akan ditampilkan di platform.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-5 md:p-8 space-y-6">
                      <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="first-name" className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Nama Depan</Label>
                          <Input 
                            id="first-name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="h-11 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-medium border"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="last-name" className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Nama Belakang</Label>
                          <Input 
                            id="last-name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="h-11 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-medium border"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="birth" className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Tanggal Lahir</Label>
                          <div className="relative">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input 
                              id="birth"
                              type="date"
                              value={birth}
                              onChange={(e) => setBirth(e.target.value)}
                              className="pl-11 h-11 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-medium border"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="gender" className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Jenis Kelamin</Label>
                          <div className="h-11 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 flex items-center px-4">
                             <select 
                               id="gender"
                               value={gender}
                               onChange={(e) => setGender(e.target.value)}
                               className="w-full bg-transparent text-sm font-medium focus:outline-none dark:text-white"
                             >
                               <option value="" disabled className="dark:bg-slate-900">Pilih Jenis Kelamin</option>
                               <option value="male" className="dark:bg-slate-900">Laki-laki</option>
                               <option value="female" className="dark:bg-slate-900">Perempuan</option>
                               <option value="other" className="dark:bg-slate-900">Lainnya</option>
                             </select>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bio" className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Bio / Tentang Sata</Label>
                        <Textarea 
                          id="bio"
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          placeholder="Ceritakan sedikit tentang Anda..."
                          className="min-h-[100px] rounded-xl bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-medium border"
                        />
                      </div>

                      <div className="flex flex-col sm:flex-row justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                        <Button 
                          onClick={handleSaveIdentity}
                          disabled={isSaving}
                          className="w-full sm:w-auto h-11 px-8 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs uppercase tracking-widest transition-all active:scale-95 shadow-none"
                        >
                          {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="account" className="space-y-6 focus-visible:outline-none">
                  <Card className="border-slate-200 dark:border-slate-800 shadow-none rounded-2xl overflow-hidden bg-white dark:bg-slate-950 border">
                    <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 py-6">
                      <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-white flex items-center gap-2">
                        <Phone className="w-4 h-4 text-sky-600" />
                        Info Kontak
                      </CardTitle>
                      <CardDescription className="text-xs font-medium text-slate-500">Kelola nomor telepon dan email untuk komunikasi pesanan.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-5 md:p-8 space-y-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Email Utama</Label>
                          <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input 
                              disabled
                              value={user?.email}
                              className="pl-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 font-medium border opacity-70 cursor-not-allowed"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2 py-1 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg border border-emerald-100 dark:border-emerald-900/30">
                               <Check className="w-3 h-3 text-emerald-600" />
                               <span className="text-[9px] font-bold uppercase text-emerald-600">Terverifikasi</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Nomor Telepon</Label>
                          <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input 
                              id="phone"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              placeholder="0812XXXXXXXX"
                              className="pl-11 h-11 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-medium border"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                        <Button 
                          onClick={handleSaveContact}
                          disabled={isSaving}
                          className="w-full sm:w-auto h-11 px-8 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs uppercase tracking-widest transition-all active:scale-95 shadow-none"
                        >
                          Simpan Kontak
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="security" className="space-y-6 focus-visible:outline-none">
                  <Card className="border-slate-200 dark:border-slate-800 shadow-none rounded-2xl overflow-hidden bg-white dark:bg-slate-950 border">
                    <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 py-6">
                      <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-white flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-sky-600" />
                        Akses & Keamanan
                      </CardTitle>
                      <CardDescription className="text-xs font-medium text-slate-500">Jaga keamanan akun Anda dengan verifikasi dan kata sandi.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-5 md:p-8 space-y-6">
                       <div className="flex flex-col gap-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800 gap-4">
                             <div>
                                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Kata Sandi</h4>
                                <p className="text-[10px] text-slate-500 font-medium mt-0.5">Terakhir diubah 3 bulan yang lalu</p>
                             </div>
                             <Button variant="outline" className="w-full sm:w-auto h-9 px-4 rounded-lg border-slate-200 dark:border-slate-800 text-[10px] font-bold uppercase tracking-widest hover:bg-white dark:hover:bg-slate-900 border">
                               Ubah Sandi
                             </Button>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800 gap-4">
                             <div>
                                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Metode Masuk</h4>
                                <p className="text-[10px] text-slate-500 font-medium mt-0.5">Tersambung dengan Google</p>
                             </div>
                             <div className="w-fit flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg">
                                <span className="text-[9px] font-bold text-slate-500 uppercase">Google</span>
                             </div>
                          </div>
                       </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </main>
          </div>
        </div>
      </div>
    </PrivateRoute>
  );
};

export default ProfilePage;
