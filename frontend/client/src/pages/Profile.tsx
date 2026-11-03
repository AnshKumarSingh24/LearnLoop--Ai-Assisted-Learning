import { useState, useEffect, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { prepareProfileAvatar, profileInitials } from "@/lib/profileAvatar";
import { useTheme } from "@/contexts/ThemeContext";
import { useCompanion } from "@/contexts/CompanionContext";
import { 
  User, Moon, Sun, Palette, Settings2, Clock3, Trophy, 
  BookOpen, Flame, Shield, Globe, Cloud, Lock, Link2, 
  Mail, Key, Eye, Check, ChevronDown, Bell, 
  Instagram, MessageCircle, Linkedin, Save, Loader2,
  AlertCircle, CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { CAPTURE_API_URL } from "@/lib/captureApi";


const THEMES = [
  { id: "light", label: "Light", icon: "☀️" },
  { id: "dark", label: "Dark", icon: "🌙" },
  { id: "system", label: "System", icon: "💻" },
];

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "hi", label: "Hindi" },
  { value: "te", label: "Telugu" },
  { value: "ta", label: "Tamil" },
  { value: "kn", label: "Kannada" },
  { value: "ml", label: "Malayalam" },
  { value: "bn", label: "Bengali" },
  { value: "mr", label: "Marathi" },
  { value: "gu", label: "Gujarati" },
  { value: "pa", label: "Punjabi" },
  { value: "ur", label: "Urdu" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "zh", label: "Chinese" },
  { value: "ja", label: "Japanese" },
  { value: "ko", label: "Korean" },
  { value: "ar", label: "Arabic" },
];

const FONT_SIZES = ["Small", "Medium", "Large"];
const EDITOR_FONTS = ["Default", "Monospace", "Serif"];
const DEFAULT_VIEWS = ["Dashboard", "Learning", "Profile", "Canvas"];

const CONNECTED_APPS = [
  { id: "instagram", name: "Instagram", icon: Instagram, color: "#d84b78", connected: true },
  { id: "whatsapp", name: "WhatsApp", icon: MessageCircle, color: "#319b54", connected: true },
  { id: "linkedin", name: "LinkedIn", icon: Linkedin, color: "#3979a8", connected: true },
];

export default function Profile() {
  const { isAuthenticated, loading, user } = useAuth({ redirectOnUnauthenticated: true, redirectPath: "/onboarding" });
  const utils = trpc.useUtils();
  const learnerProfileQuery = trpc.user.getLearnerProfile.useQuery(undefined, { enabled: isAuthenticated });
  const preferencesQuery = trpc.user.getPreferences.useQuery(undefined, { enabled: isAuthenticated });
  const saveLearnerProfile = trpc.user.updateLearnerProfile.useMutation();
  const savePreferences = trpc.user.updateProfile.useMutation();
  const uploadAvatar = trpc.user.uploadAvatar.useMutation();
  const removeAvatar = trpc.user.removeAvatar.useMutation();
  const { theme, toggleTheme } = useTheme();
  const { setContext } = useCompanion();
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [displayName, setDisplayName] = useState("");
  const [role, setRole] = useState("");
  const [userType, setUserType] = useState<"learner" | "creator" | "both">("learner");
  const [interests, setInterests] = useState("");
  const [learningGoals, setLearningGoals] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("Beginner");
  const [learningStyle, setLearningStyle] = useState("");
  const [dailyTarget, setDailyTarget] = useState("");
  const [workspaceName, setWorkspaceName] = useState("");
  const [avatarError, setAvatarError] = useState("");
  const [profileSaveError, setProfileSaveError] = useState("");
  const [profileDirty, setProfileDirty] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "appearance" | "editor" | "ai" | "notifications" | "language" | "cloud" | "privacy" | "apps">("profile");
  const [saving, setSaving] = useState(false);
  const [savedFields, setSavedFields] = useState<Record<string, boolean>>({});
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    theme: "system",
    language: "en",
    fontSize: "Medium",
    editorFont: "Default",
    defaultView: "Dashboard",
    personalizedLearning: true,
    aiSuggestions: true,
    learningReminders: true,
    weeklyProgress: false,
    profileVisibility: false,
    cloudStorage: false,
  });

  useEffect(() => {
    setContext({ workspace: "Profile" });
  }, [setContext]);

  useEffect(() => {
    const profile = learnerProfileQuery.data;
    if (!profile) return;
    const parts = profile.fullName.trim().split(/\s+/).filter(Boolean);
    setProfileData(previous => ({
      ...previous,
      firstName: parts[0] || "",
      lastName: parts.slice(1).join(" "),
      username: profile.displayName || "",
      email: profile.email || user?.email || "",
      language: profile.preferredLanguage || previous.language,
    }));
    setDisplayName(profile.preferredDisplayName || "");
    setRole(profile.role || "");
    setUserType(profile.userType === "creator" || profile.userType === "both" ? profile.userType : "learner");
    setInterests(profile.interests.join(", "));
    setLearningGoals(profile.learningGoals.join(", "));
    setExperienceLevel(profile.experienceLevel || "Beginner");
    setLearningStyle(profile.learningStyle || "");
    setDailyTarget(profile.dailyTarget || "");
    setWorkspaceName(profile.workspaceName || "");
  }, [learnerProfileQuery.data, user?.email]);

  useEffect(() => {
    if (preferencesQuery.data) {
      setProfileData(previous => ({ ...previous, ...preferencesQuery.data, password: "", confirmPassword: "" }));
    }
  }, [preferencesQuery.data]);

  useEffect(() => {
    if (!isAuthenticated || learnerProfileQuery.isLoading || learnerProfileQuery.data) return;
    const controller = new AbortController();
    fetch(`${CAPTURE_API_URL}/profile`, { signal: controller.signal, headers: { "Authorization": "Bearer demo-user" } })
      .then(async response => {
        if (!response.ok) throw new Error("Could not load profile preferences");
        return response.json();
      })
      .then(data => setProfileData(previous => ({ ...previous, ...data, password: "", confirmPassword: "" })))
      .catch(error => {
        if (error.name !== "AbortError") toast.error("Could not load saved profile preferences");
      });
    return () => controller.abort();
  }, [isAuthenticated]);

  const handleSave = async (field?: string) => {
    setSaving(true);
    setProfileSaveError("");
    try {
      const fullName = `${profileData.firstName.trim()} ${profileData.lastName.trim()}`.trim();
      await Promise.all([
        savePreferences.mutateAsync({
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          email: profileData.email || undefined,
          theme: profileData.theme as "light" | "dark" | "system",
          language: profileData.language,
          fontSize: profileData.fontSize as "Small" | "Medium" | "Large",
          editorFont: profileData.editorFont as "Default" | "Monospace" | "Serif",
          defaultView: profileData.defaultView as "Dashboard" | "Learning" | "Profile" | "Canvas",
          personalizedLearning: profileData.personalizedLearning,
          aiSuggestions: profileData.aiSuggestions,
          learningReminders: profileData.learningReminders,
          weeklyProgress: profileData.weeklyProgress,
          profileVisibility: profileData.profileVisibility,
          cloudStorage: profileData.cloudStorage,
        }),
        saveLearnerProfile.mutateAsync({
          ...(fullName ? { fullName } : {}),
          ...(displayName.trim() ? { displayName: displayName.trim() } : {}),
          ...(profileData.email.trim() ? { email: profileData.email.trim() } : {}),
          ...(role.trim() ? { role: role.trim() } : {}),
          userType,
          interests: interests.split(",").map(value => value.trim()).filter(Boolean),
          learningGoals: learningGoals.split(",").map(value => value.trim()).filter(Boolean),
          experienceLevel: experienceLevel as "Beginner" | "Intermediate" | "Advanced",
          ...(learningStyle.trim() ? { learningStyle: learningStyle.trim() } : {}),
          ...(dailyTarget.trim() ? { dailyTarget: dailyTarget.trim() } : {}),
          preferredLanguage: profileData.language,
          ...(workspaceName.trim() ? { workspaceName: workspaceName.trim() } : {}),
        }),
      ]);
      await Promise.all([utils.user.getLearnerProfile.invalidate(), utils.auth.me.invalidate(), utils.user.getPreferences.invalidate()]);
      setProfileDirty(false);
      setProfileSaveError("");
      toast.success("Profile saved");
      if (field) setSavedFields(previous => ({ ...previous, [field]: true }));
      return;
      /* legacy direct profile request is intentionally unreachable; profile writes must use authenticated tRPC. */
      const response = await fetch(`${CAPTURE_API_URL}/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer demo-user" },
        body: JSON.stringify({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        username: profileData.username,
        email: profileData.email,
        theme: profileData.theme,
        language: profileData.language,
        fontSize: profileData.fontSize,
        editorFont: profileData.editorFont,
        defaultView: profileData.defaultView,
        personalizedLearning: profileData.personalizedLearning,
        aiSuggestions: profileData.aiSuggestions,
        learningReminders: profileData.learningReminders,
        weeklyProgress: profileData.weeklyProgress,
        profileVisibility: profileData.profileVisibility,
          cloudStorage: profileData.cloudStorage,
        }),
      });
      if (!response.ok) throw new Error((await response.json().catch(() => ({}))).detail || "Profile could not be saved");
      toast.success("Profile saved");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Profile could not be saved";
      setProfileSaveError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (key: string, value: string | boolean) => {
    setProfileData(prev => ({ ...prev, [key]: value }));
    setSavedFields(prev => ({ ...prev, [key]: false }));
    setProfileDirty(true);
  };

  const handleAvatarFile = async (file?: File) => {
    if (!file) return;
    setAvatarError("");
    try {
      const dataUrl = await prepareProfileAvatar(file);
      await uploadAvatar.mutateAsync({ dataUrl });
      await utils.user.getLearnerProfile.invalidate();
      await utils.auth.me.invalidate();
      toast.success("Profile photo updated");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Profile photo could not be saved.";
      setAvatarError(message);
      toast.error(message);
    }
  };

  const handleAvatarRemove = async () => {
    setAvatarError("");
    try {
      await removeAvatar.mutateAsync();
      await utils.user.getLearnerProfile.invalidate();
      await utils.auth.me.invalidate();
      toast.success("Profile photo removed");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Profile photo could not be removed.";
      setAvatarError(message);
      toast.error(message);
    }
  };

  if (loading && !isAuthenticated) return <div className="flex items-center justify-center h-[60vh]"><Loader2 className="animate-spin text-[#123d2d]" size={32} /></div>;

  return (
    <div className="max-w-4xl mx-auto py-10 px-6">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-2">My Profile</h1>
        <p className="text-gray-500">Manage your account, learning preferences, and connected services.</p>
      </div>

      {/* Profile Header Card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-8">
        <div className="flex items-center gap-6">
          <input ref={avatarInputRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={event => { const file = event.target.files?.[0]; event.target.value = ""; void handleAvatarFile(file); }} />
          <div className="w-20 h-20 rounded-full bg-[#123d2d] text-white flex items-center justify-center text-2xl font-bold overflow-hidden">
            {user?.avatarUrl ? <img src={user.avatarUrl} alt="" className="h-full w-full object-cover" /> : profileInitials(displayName || user?.name)}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">{displayName || `${profileData.firstName} ${profileData.lastName}`.trim() || "New Learner"}</h2>
            <p className="text-gray-500 mt-1">{profileData.email || "No email"}</p>
            <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
              <span className="flex items-center gap-1"><Flame size={14} /> 12 Day Streak</span>
              <span className="flex items-center gap-1"><Trophy size={14} /> 24 Sessions</span>
              <span className="flex items-center gap-1"><Clock3 size={14} /> 8.5h Total</span>
              {learnerProfileQuery.data?.createdAt && <span>Member since {new Date(learnerProfileQuery.data.createdAt).toLocaleDateString()}</span>}
            </div>
            <div className="mt-3 flex gap-2">
              <Button variant="outline" size="sm" onClick={() => avatarInputRef.current?.click()} disabled={uploadAvatar.isPending}>Change photo</Button>
              {user?.avatarUrl && <Button variant="outline" size="sm" onClick={() => void handleAvatarRemove()} disabled={removeAvatar.isPending}>Remove photo</Button>}
            </div>
            {avatarError && <p role="alert" className="mt-2 text-sm text-red-600">{avatarError}</p>}
          </div>
          <Button variant="outline" onClick={() => handleSave()} disabled={saving} className="h-10">
            {saving ? <Loader2 className="animate-spin mr-2" size={16} /> : <Save size={16} className="mr-2" />} Save All
          </Button>
        </div>
        <p aria-live="polite" className={`mt-4 text-sm ${profileSaveError ? "text-red-700" : profileDirty ? "text-amber-700" : "text-green-700"}`}>
          {saving ? "Saving profile…" : profileSaveError ? "Save failed." : profileDirty ? "Unsaved changes" : savedFields.profile ? "Saved successfully" : ""}
          {profileSaveError && <button className="ml-2 font-semibold underline" onClick={() => void handleSave()} disabled={saving}>Retry</button>}
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex gap-1 overflow-x-auto pb-1" role="tablist">
          {[
            { id: "profile", label: "Profile", icon: User },
            { id: "appearance", label: "Appearance", icon: Palette },
            { id: "editor", label: "Editor", icon: Settings2 },
            { id: "ai", label: "AI Preferences", icon: BookOpen },
            { id: "notifications", label: "Notifications", icon: Bell },
            { id: "language", label: "Language", icon: Globe },
            { id: "cloud", label: "Cloud Storage", icon: Cloud },
            { id: "privacy", label: "Privacy", icon: Shield },
            { id: "apps", label: "Connected Apps", icon: Link2 },
          ].map(tab => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-[#123d2d] text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <tab.icon size={16} /> {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Panels */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
        
        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Personal Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="block text-sm font-bold text-gray-700 mb-2">First Name</Label>
                <div className="flex gap-2">
                  <Input 
                    value={profileData.firstName}
                    onChange={e => handleChange("firstName", e.target.value)}
                    placeholder="Enter your first name"
                    className="flex-1"
                  />
                  <Button variant="outline" size="sm" onClick={() => handleSave("firstName")} disabled={saving}>
                    {savedFields.firstName ? <CheckCircle2 className="text-green-500" size={16} /> : <Check size={16} />} Enter
                  </Button>
                </div>
                {savedFields.firstName && <p className="text-green-600 text-sm mt-1 flex items-center gap-1"><CheckCircle2 size={12} /> Saved</p>}
              </div>

              <div>
                <Label className="block text-sm font-bold text-gray-700 mb-2">Last Name</Label>
                <div className="flex gap-2">
                  <Input 
                    value={profileData.lastName}
                    onChange={e => handleChange("lastName", e.target.value)}
                    placeholder="Enter your last name"
                    className="flex-1"
                  />
                  <Button variant="outline" size="sm" onClick={() => handleSave("lastName")} disabled={saving}>
                    {savedFields.lastName ? <CheckCircle2 className="text-green-500" size={16} /> : <Check size={16} />} Enter
                  </Button>
                </div>
                {savedFields.lastName && <p className="text-green-600 text-sm mt-1 flex items-center gap-1"><CheckCircle2 size={12} /> Saved</p>}
              </div>

              <div>
                <Label className="block text-sm font-bold text-gray-700 mb-2">Username</Label>
                <div className="flex gap-2">
                  <Input 
                    value={profileData.username}
                    onChange={e => handleChange("username", e.target.value)}
                    placeholder="Enter your username"
                    className="flex-1"
                  />
                  <Button variant="outline" size="sm" onClick={() => handleSave("username")} disabled={saving}>
                    {savedFields.username ? <CheckCircle2 className="text-green-500" size={16} /> : <Check size={16} />} Enter
                  </Button>
                </div>
                {savedFields.username && <p className="text-green-600 text-sm mt-1 flex items-center gap-1"><CheckCircle2 size={12} /> Saved</p>}
              </div>

              <div>
                <Label className="block text-sm font-bold text-gray-700 mb-2">Email</Label>
                <div className="flex gap-2">
                  <Input 
                    type="email"
                    value={profileData.email}
                    onChange={e => handleChange("email", e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1"
                  />
                  <Button variant="outline" size="sm" onClick={() => handleSave("email")} disabled={saving}>
                    {savedFields.email ? <CheckCircle2 className="text-green-500" size={16} /> : <Check size={16} />} Enter
                  </Button>
                </div>
                {savedFields.email && <p className="text-green-600 text-sm mt-1 flex items-center gap-1"><CheckCircle2 size={12} /> Saved</p>}
              </div>
              <div>
                <Label className="block text-sm font-bold text-gray-700 mb-2">Preferred display name</Label>
                <Input value={displayName} onChange={event => { setDisplayName(event.target.value); setProfileDirty(true); }} placeholder="What should LearnLoop call you?" />
              </div>
              <div>
                <Label className="block text-sm font-bold text-gray-700 mb-2">Role</Label>
                <Input value={role} onChange={event => { setRole(event.target.value); setProfileDirty(true); }} placeholder="Student, educator, professional…" />
              </div>
              <div>
                <Label className="block text-sm font-bold text-gray-700 mb-2">Learner or creator</Label>
                <Select value={userType} onValueChange={value => { setUserType(value as "learner" | "creator" | "both"); setProfileDirty(true); }}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="learner">Learner</SelectItem><SelectItem value="creator">Creator</SelectItem><SelectItem value="both">Both</SelectItem></SelectContent>
                </Select>
              </div>
              <div>
                <Label className="block text-sm font-bold text-gray-700 mb-2">Experience level</Label>
                <Select value={experienceLevel} onValueChange={value => { setExperienceLevel(value); setProfileDirty(true); }}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="Beginner">Beginner</SelectItem><SelectItem value="Intermediate">Intermediate</SelectItem><SelectItem value="Advanced">Advanced</SelectItem></SelectContent>
                </Select>
              </div>
              <div>
                <Label className="block text-sm font-bold text-gray-700 mb-2">Interests (comma separated)</Label>
                <Input value={interests} onChange={event => { setInterests(event.target.value); setProfileDirty(true); }} placeholder="Design, biology, languages…" />
              </div>
              <div>
                <Label className="block text-sm font-bold text-gray-700 mb-2">Learning goals (comma separated)</Label>
                <Input value={learningGoals} onChange={event => { setLearningGoals(event.target.value); setProfileDirty(true); }} placeholder="Prepare for an exam, learn a language…" />
              </div>
              <div>
                <Label className="block text-sm font-bold text-gray-700 mb-2">Learning style</Label>
                <Input value={learningStyle} onChange={event => { setLearningStyle(event.target.value); setProfileDirty(true); }} placeholder="Visual, practical, balanced…" />
              </div>
              <div>
                <Label className="block text-sm font-bold text-gray-700 mb-2">Daily or weekly target</Label>
                <Input value={dailyTarget} onChange={event => { setDailyTarget(event.target.value); setProfileDirty(true); }} placeholder="10 minutes daily" />
              </div>
              <div>
                <Label className="block text-sm font-bold text-gray-700 mb-2">Workspace name</Label>
                <Input value={workspaceName} onChange={event => { setWorkspaceName(event.target.value); setProfileDirty(true); }} placeholder="My learning space" />
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-lg font-bold text-gray-900 mb-4">Change Password</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="block text-sm font-bold text-gray-700 mb-2">New Password</Label>
                  <Input 
                    type="password"
                    value={profileData.password}
                    onChange={e => handleChange("password", e.target.value)}
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <Label className="block text-sm font-bold text-gray-700 mb-2">Confirm Password</Label>
                  <Input 
                    type="password"
                    value={profileData.confirmPassword}
                    onChange={e => handleChange("confirmPassword", e.target.value)}
                    placeholder="Confirm password"
                  />
                </div>
              </div>
              <p className="text-sm text-gray-500">Leave blank to keep current password.</p>
            </div>
          </div>
        )}

        {/* Appearance Tab */}
        {activeTab === "appearance" && (
          <div className="p-6 space-y-8">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Theme</h3>
              <p className="text-gray-500 text-sm mb-4">Choose how Darwinity looks on your device.</p>
              <div className="grid grid-cols-3 gap-4">
                {THEMES.map(t => (
                  <button
                    key={t.id}
                    onClick={() => { handleChange("theme", t.id); toggleTheme?.(); }}
                    className={`p-4 rounded-xl border-2 text-center transition-all ${
                      profileData.theme === t.id
                        ? "border-[#123d2d] bg-[#f1f5f2]"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="text-3xl mb-2">{t.icon}</div>
                    <div className="font-medium text-gray-900">{t.label}</div>
                  </button>
                ))}
              </div>
              <div className="mt-2">
                <Label className="flex items-center gap-2 cursor-pointer">
                  <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
                  <span className="text-sm font-medium text-gray-700">Dark Mode</span>
                </Label>
              </div>
            </div>
          </div>
        )}

        {/* Editor Tab */}
        {activeTab === "editor" && (
          <div className="p-6 space-y-8">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Font Size</h3>
              <Select value={profileData.fontSize} onValueChange={v => handleChange("fontSize", v)}>
                <SelectTrigger className="w-full max-w-xs">
                  <SelectValue placeholder="Select font size" />
                </SelectTrigger>
                <SelectContent>
                  {FONT_SIZES.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Editor Font</h3>
              <Select value={profileData.editorFont} onValueChange={v => handleChange("editorFont", v)}>
                <SelectTrigger className="w-full max-w-xs">
                  <SelectValue placeholder="Select font" />
                </SelectTrigger>
                <SelectContent>
                  {EDITOR_FONTS.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Default View</h3>
              <p className="text-gray-500 text-sm mb-2">What page opens when you launch Darwinity.</p>
              <Select value={profileData.defaultView} onValueChange={v => handleChange("defaultView", v)}>
                <SelectTrigger className="w-full max-w-xs">
                  <SelectValue placeholder="Select default view" />
                </SelectTrigger>
                <SelectContent>
                  {DEFAULT_VIEWS.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* AI Preferences Tab */}
        {activeTab === "ai" && (
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between py-4 border-b border-gray-100">
              <div>
                <h4 className="font-bold text-gray-900">Personalized Learning</h4>
                <p className="text-sm text-gray-500">Allow AI to personalize your learning experience.</p>
              </div>
              <Switch checked={profileData.personalizedLearning} onCheckedChange={v => handleChange("personalizedLearning", v)} />
            </div>
            <div className="flex items-center justify-between py-4 border-b border-gray-100">
              <div>
                <h4 className="font-bold text-gray-900">AI Suggestions</h4>
                <p className="text-sm text-gray-500">Receive recommendations based on your progress.</p>
              </div>
              <Switch checked={profileData.aiSuggestions} onCheckedChange={v => handleChange("aiSuggestions", v)} />
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === "notifications" && (
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between py-4 border-b border-gray-100">
              <div>
                <h4 className="font-bold text-gray-900">Learning Reminders</h4>
                <p className="text-sm text-gray-500">Get reminders to continue your learning.</p>
              </div>
              <Switch checked={profileData.learningReminders} onCheckedChange={v => handleChange("learningReminders", v)} />
            </div>
            <div className="flex items-center justify-between py-4 border-b border-gray-100">
              <div>
                <h4 className="font-bold text-gray-900">Weekly Progress Report</h4>
                <p className="text-sm text-gray-500">Receive a weekly summary of your progress.</p>
              </div>
              <Switch checked={profileData.weeklyProgress} onCheckedChange={v => handleChange("weeklyProgress", v)} />
            </div>
          </div>
        )}

        {/* Language Tab */}
        {activeTab === "language" && (
          <div className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Preferred Language</h3>
            <Select value={profileData.language} onValueChange={v => handleChange("language", v)}>
              <SelectTrigger className="w-full max-w-xs">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map(l => <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Cloud Storage Tab */}
        {activeTab === "cloud" && (
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between py-4 border-b border-gray-100">
              <div>
                <h4 className="font-bold text-gray-900">Cloud Storage</h4>
                <p className="text-sm text-gray-500">Connect your cloud storage to save learning materials.</p>
              </div>
              <Switch checked={profileData.cloudStorage} onCheckedChange={v => handleChange("cloudStorage", v)} />
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between py-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 font-bold">G</div>
                  <div>
                    <h4 className="font-bold text-gray-900">Google Drive</h4>
                    <p className="text-sm text-gray-500">Sync notes and PDFs</p>
                  </div>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between py-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-800 font-bold">D</div>
                  <div>
                    <h4 className="font-bold text-gray-900">Dropbox</h4>
                    <p className="text-sm text-gray-500">Backup your artifacts</p>
                  </div>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between py-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold">O</div>
                  <div>
                    <h4 className="font-bold text-gray-900">OneDrive</h4>
                    <p className="text-sm text-gray-500">Microsoft cloud sync</p>
                  </div>
                </div>
                <Switch />
              </div>
            </div>
            <p className="text-sm text-gray-500">Cloud storage integration coming soon.</p>
          </div>
        )}

        {/* Privacy Tab */}
        {activeTab === "privacy" && (
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between py-4 border-b border-gray-100">
              <div>
                <h4 className="font-bold text-gray-900">Profile Visibility</h4>
                <p className="text-sm text-gray-500">Allow other learners to see your profile.</p>
              </div>
              <Switch checked={profileData.profileVisibility} onCheckedChange={v => handleChange("profileVisibility", v)} />
            </div>
            <div className="flex items-center justify-between py-4 border-b border-gray-100">
              <div>
                <h4 className="font-bold text-gray-900">Analytics</h4>
                <p className="text-sm text-gray-500">Allow anonymous usage analytics.</p>
              </div>
              <Switch checked={true} onCheckedChange={() => {}} />
            </div>
            <div className="flex items-center justify-between py-4 border-b border-gray-100">
              <div>
                <h4 className="font-bold text-gray-900">Data Processing</h4>
                <p className="text-sm text-gray-500">Allow data processing for AI improvements.</p>
              </div>
              <Switch checked={true} onCheckedChange={() => {}} />
            </div>
          </div>
        )}

        {/* Connected Apps Tab */}
        {activeTab === "apps" && (
          <div className="p-6 space-y-4">
            <p className="text-gray-500 text-sm mb-4">Manage the apps connected to your Darwinity account.</p>
            <div className="space-y-3">
              {CONNECTED_APPS.map(app => (
                <div key={app.id} className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-lg flex items-center justify-center" style={{ backgroundColor: app.color + "20" }}>
                      <app.icon size={22} style={{ color: app.color }} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{app.name}</h4>
                      <p className="text-sm text-green-600 font-medium flex items-center gap-1">
                        <CheckCircle2 size={12} /> Connected
                      </p>
                    </div>
                  </div>
                  <Switch defaultChecked={app.connected} />
                </div>
              ))}
            </div>
            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-3">Available Integrations</p>
              <div className="flex gap-3">
                <Button variant="outline" disabled className="flex-1">Connect Notion</Button>
                <Button variant="outline" disabled className="flex-1">Connect GitHub</Button>
                <Button variant="outline" disabled className="flex-1">Connect Slack</Button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
