import { useState, useEffect } from "react";
import { User, Mail, Calendar, Shield, Camera, Save, Key, Smartphone, Fingerprint, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import toast from "react-hot-toast";
import { format } from "date-fns";

interface ProfileData {
  id: string;
  user_id: string;
  username?: string;
  full_name: string;
  avatar_url: string;
  created_at: string;
  updated_at?: string;
}

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileData>({
    id: "",
    user_id: "",
    full_name: "",
    avatar_url: "",
    created_at: "",
  });
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  
  // State untuk password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    if (user) fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        await createProfileIfNotExists();
        return;
      }

      setProfile({
        id: data.id,
        user_id: data.user_id,
        full_name: data.full_name || user.email?.split("@")[0] || "User",
        avatar_url: data.avatar_url || "",
        created_at: data.created_at,
        updated_at: data.updated_at,
        username: data.username || "",
      });
    } catch (err: any) {
      console.error("Error fetching profile:", err);
      toast.error("Failed to load profile data");
    }
  };

  const createProfileIfNotExists = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from("profiles")
        .upsert(
          {
            user_id: user.id,
            full_name: user.user_metadata?.full_name || user.email?.split("@")[0] || "User",
            avatar_url: "",
          },
          { onConflict: "user_id" }
        )
        .select()
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setProfile({
          id: data.id,
          user_id: data.user_id,
          full_name: data.full_name,
          avatar_url: data.avatar_url || "",
          created_at: data.created_at,
          updated_at: data.updated_at,
        });
        toast.success("Profile created successfully");
      }
    } catch (err: any) {
      console.error("Error creating profile:", err);
      toast.error("Failed to create profile");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .upsert(
          {
            user_id: user.id,
            full_name: profile.full_name,
            avatar_url: profile.avatar_url,
          },
          { onConflict: "user_id" }
        )
        .select()
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setProfile((prev) => ({
          ...prev,
          full_name: data.full_name,
          avatar_url: data.avatar_url || prev.avatar_url,
        }));
        toast.success("Profile updated successfully");
        setIsEditing(false);
      }
    } catch (err: any) {
      console.error("Error updating profile:", err);
      toast.error(`Failed to update profile: ${err.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !user) return;
    const file = e.target.files[0];
    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}-${Math.random()}.${fileExt}`;

    setAvatarUploading(true);
    try {
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName);

      if (!publicUrlData.publicUrl) throw new Error("Failed to get public URL");

      const { data, error } = await supabase
        .from("profiles")
        .upsert(
          { user_id: user.id, avatar_url: publicUrlData.publicUrl },
          { onConflict: "user_id" }
        )
        .select()
        .maybeSingle();

      if (error) throw error;

      setProfile((prev) => ({ ...prev, avatar_url: publicUrlData.publicUrl }));
      toast.success("Avatar updated successfully");
    } catch (err: any) {
      console.error("Error uploading avatar:", err);
      toast.error(`Failed to upload avatar: ${err.message || "Unknown error"}`);
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirmation do not match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setPasswordLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      toast.success("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      console.error("Error updating password:", err);
      toast.error(`Failed to update password: ${err.message || "Unknown error"}`);
    } finally {
      setPasswordLoading(false);
    }
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">
            My Profile
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your account settings and preferences
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardHeader className="text-center">
            <div className="flex flex-col items-center">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profile.avatar_url} alt={profile.full_name} />
                  <AvatarFallback className="text-xl">
                    {profile.full_name ? getInitials(profile.full_name) : "U"}
                  </AvatarFallback>
                </Avatar>
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 bg-primary rounded-full p-1.5 cursor-pointer hover:bg-primary/90 transition-colors"
                >
                  <Camera className="h-4 w-4 text-white" />
                  <input
                    id="avatar-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    disabled={avatarUploading}
                  />
                </label>
              </div>
              <CardTitle className="mt-4">{profile.full_name || "User"}</CardTitle>
              <CardDescription>{user?.email}</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Member since</span>
                <span className="font-medium">
                  {profile.created_at
                    ? format(new Date(profile.created_at), "MMMM yyyy")
                    : "Unknown"}
                </span>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-medium">Account Status</h4>
                <Badge variant="outline" className="bg-success/20 text-success border-success">
                  Active
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Profile Information</CardTitle>
              {!isEditing ? (
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveProfile}
                    disabled={loading}
                    className="gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="personal">Personal Info</TabsTrigger>
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      name="full_name"
                      value={profile.full_name}
                      disabled={!isEditing}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      name="username"
                      value={profile.username || ""}
                      disabled
                      placeholder="Auto-generated"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="account" className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                    <Mail className="h-8 w-8 text-primary" />
                    <div>
                      <h4 className="font-medium">Email Address</h4>
                      <p className="text-sm text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                    <Badge className="ml-auto bg-success/20 text-success border-success">
                      Verified
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                    <Calendar className="h-8 w-8 text-primary" />
                    <div>
                      <h4 className="font-medium">Account Created</h4>
                      <p className="text-sm text-muted-foreground">
                        {profile.created_at
                          ? format(new Date(profile.created_at), "MMMM d, yyyy")
                          : "Unknown"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                    <User className="h-8 w-8 text-primary" />
                    <div>
                      <h4 className="font-medium">Account ID</h4>
                      <p className="text-sm text-muted-foreground font-mono">
                        {user?.id?.substring(0, 8)}...
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="security" className="space-y-4">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Key className="h-5 w-5" />
                        Change Password
                      </CardTitle>
                      <CardDescription>
                        Update your password to keep your account secure
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input
                          id="current-password"
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="Enter your current password"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input
                          id="new-password"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter your new password"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm Password</Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm your new password"
                        />
                      </div>
                      <Button 
                        onClick={handleChangePassword} 
                        disabled={passwordLoading}
                        className="w-full"
                      >
                        {passwordLoading ? "Updating..." : "Update Password"}
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Smartphone className="h-5 w-5" />
                        Two-Factor Authentication
                      </CardTitle>
                      <CardDescription>
                        Add an extra layer of security to your account
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Protect your account with both your password and your phone
                          </p>
                        </div>
                        <Button variant="outline">
                          Enable
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Fingerprint className="h-5 w-5" />
                        Active Sessions
                      </CardTitle>
                      <CardDescription>
                        Manage your active sessions across devices
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="bg-primary/10 p-2 rounded-lg">
                            <Smartphone className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">Current Session</p>
                            <p className="text-sm text-muted-foreground">
                              {navigator.userAgent.split(" ")[0]} on {navigator.platform}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline">Active now</Badge>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-destructive/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-destructive">
                        <AlertTriangle className="h-5 w-5" />
                        Danger Zone
                      </CardTitle>
                      <CardDescription>
                        These actions are irreversible. Please proceed with caution.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between p-4 border border-destructive/30 rounded-lg">
                        <div>
                          <h4 className="font-medium">Delete Account</h4>
                          <p className="text-sm text-muted-foreground">
                            Permanently delete your account and all data
                          </p>
                        </div>
                        <Button variant="destructive">Delete Account</Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}