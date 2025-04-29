"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"

export default function BorrowerSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [settings, setSettings] = useState({
    notifications_email: true,
    notifications_sms: false,
    notifications_push: true,
    marketing_emails: false,
    two_factor_auth: false,
  })
  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: "",
  })
  const supabase = createClientComponentClient()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    async function checkAuth() {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session) {
        router.push("/auth/login")
        return
      }

      fetchUserData(session.user.id)
    }

    checkAuth()
  }, [supabase, router])

  async function fetchUserData(userId: string) {
    try {
      setLoading(true)

      const { data, error } = await supabase.from("users").select("*").eq("id", userId).single()

      if (error) throw error

      setUser(data)
      setSettings({
        notifications_email: data.notifications_email ?? true,
        notifications_sms: data.notifications_sms ?? false,
        notifications_push: data.notifications_push ?? true,
        marketing_emails: data.marketing_emails ?? false,
        two_factor_auth: data.two_factor_auth ?? false,
      })
    } catch (error) {
      console.error("Error fetching user data:", error)
      toast({
        title: "Error",
        description: "Failed to load user settings",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  async function saveNotificationSettings() {
    try {
      setSaving(true)

      const { error } = await supabase
        .from("users")
        .update({
          notifications_email: settings.notifications_email,
          notifications_sms: settings.notifications_sms,
          notifications_push: settings.notifications_push,
          marketing_emails: settings.marketing_emails,
        })
        .eq("id", user.id)

      if (error) throw error

      toast({
        title: "Settings Saved",
        description: "Your notification preferences have been updated.",
      })
    } catch (error) {
      console.error("Error saving settings:", error)
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  async function saveSecuritySettings() {
    try {
      setSaving(true)

      const { error } = await supabase
        .from("users")
        .update({
          two_factor_auth: settings.two_factor_auth,
        })
        .eq("id", user.id)

      if (error) throw error

      toast({
        title: "Settings Saved",
        description: "Your security settings have been updated.",
      })
    } catch (error) {
      console.error("Error saving settings:", error)
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  async function changePassword() {
    if (password.new !== password.confirm) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
      })
      return
    }

    try {
      setSaving(true)

      const { error } = await supabase.auth.updateUser({
        password: password.new,
      })

      if (error) throw error

      setPassword({
        current: "",
        new: "",
        confirm: "",
      })

      toast({
        title: "Password Updated",
        description: "Your password has been changed successfully.",
      })
    } catch (error) {
      console.error("Error changing password:", error)
      toast({
        title: "Error",
        description: "Failed to change password",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Manage your account settings and preferences.</p>
      </div>

      <Tabs defaultValue="notifications" className="space-y-4">
        <TabsList>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose how you want to receive notifications.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="notifications_email" className="flex-1">
                  Email Notifications
                  <p className="text-sm font-normal text-muted-foreground">
                    Receive notifications about your rentals via email.
                  </p>
                </Label>
                <Switch
                  id="notifications_email"
                  checked={settings.notifications_email}
                  onCheckedChange={(checked) => setSettings({ ...settings, notifications_email: checked })}
                />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="notifications_sms" className="flex-1">
                  SMS Notifications
                  <p className="text-sm font-normal text-muted-foreground">
                    Receive notifications about your rentals via SMS.
                  </p>
                </Label>
                <Switch
                  id="notifications_sms"
                  checked={settings.notifications_sms}
                  onCheckedChange={(checked) => setSettings({ ...settings, notifications_sms: checked })}
                />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="notifications_push" className="flex-1">
                  Push Notifications
                  <p className="text-sm font-normal text-muted-foreground">
                    Receive push notifications in your browser.
                  </p>
                </Label>
                <Switch
                  id="notifications_push"
                  checked={settings.notifications_push}
                  onCheckedChange={(checked) => setSettings({ ...settings, notifications_push: checked })}
                />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="marketing_emails" className="flex-1">
                  Marketing Emails
                  <p className="text-sm font-normal text-muted-foreground">
                    Receive emails about new features and special offers.
                  </p>
                </Label>
                <Switch
                  id="marketing_emails"
                  checked={settings.marketing_emails}
                  onCheckedChange={(checked) => setSettings({ ...settings, marketing_emails: checked })}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveNotificationSettings} disabled={saving}>
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your account security preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="two_factor_auth" className="flex-1">
                  Two-Factor Authentication
                  <p className="text-sm font-normal text-muted-foreground">
                    Add an extra layer of security to your account.
                  </p>
                </Label>
                <Switch
                  id="two_factor_auth"
                  checked={settings.two_factor_auth}
                  onCheckedChange={(checked) => setSettings({ ...settings, two_factor_auth: checked })}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveSecuritySettings} disabled={saving}>
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save Changes
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your account password.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={password.current}
                  onChange={(e) => setPassword({ ...password, current: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={password.new}
                  onChange={(e) => setPassword({ ...password, new: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={password.confirm}
                  onChange={(e) => setPassword({ ...password, confirm: e.target.value })}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={changePassword} disabled={saving}>
                {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Change Password
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Management</CardTitle>
              <CardDescription>Manage your account settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Delete Account</Label>
                <p className="text-sm text-muted-foreground">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="destructive">Delete Account</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
