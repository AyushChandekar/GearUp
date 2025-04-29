"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getMaskedEnv } from "@/lib/env"
import { checkSupabaseConnection } from "@/lib/supabase"
import { AlertCircle, CheckCircle, Copy, Database, Key, RefreshCw, Server, Settings } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function EnvironmentPage() {
  const [maskedEnv, setMaskedEnv] = useState<ReturnType<typeof getMaskedEnv> | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<{
    connected: boolean
    tablesExist: boolean
    error: string | null
    loading: boolean
  }>({
    connected: false,
    tablesExist: false,
    error: null,
    loading: true,
  })
  const { toast } = useToast()

  useEffect(() => {
    setMaskedEnv(getMaskedEnv())
    checkConnection()
  }, [])

  const checkConnection = async () => {
    setConnectionStatus((prev) => ({ ...prev, loading: true }))
    try {
      const status = await checkSupabaseConnection()
      setConnectionStatus({
        ...status,
        loading: false,
      })
    } catch (error: any) {
      setConnectionStatus({
        connected: false,
        tablesExist: false,
        error: error.message,
        loading: false,
      })
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: "The value has been copied to your clipboard.",
    })
  }

  if (!maskedEnv) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center h-40">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Environment Configuration</h1>

      <div className="grid gap-6 mb-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Supabase Connection Status
              </CardTitle>
              <Button variant="outline" size="sm" onClick={checkConnection} disabled={connectionStatus.loading}>
                {connectionStatus.loading ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Refresh
              </Button>
            </div>
            <CardDescription>Current status of your Supabase connection</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="flex items-center gap-2">
                <span className="font-medium">Connection:</span>
                {connectionStatus.loading ? (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <RefreshCw className="h-3 w-3 animate-spin" />
                    Checking...
                  </Badge>
                ) : connectionStatus.connected ? (
                  <Badge variant="success" className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Connected
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Disconnected
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="font-medium">Tables:</span>
                {connectionStatus.loading ? (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <RefreshCw className="h-3 w-3 animate-spin" />
                    Checking...
                  </Badge>
                ) : connectionStatus.tablesExist ? (
                  <Badge variant="success" className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Exist
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Missing
                  </Badge>
                )}
              </div>

              {connectionStatus.error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Connection Error</AlertTitle>
                  <AlertDescription>{connectionStatus.error}</AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="supabase">
        <TabsList className="mb-4">
          <TabsTrigger value="supabase" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            Supabase
          </TabsTrigger>
          <TabsTrigger value="postgres" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            PostgreSQL
          </TabsTrigger>
          <TabsTrigger value="app" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            App
          </TabsTrigger>
        </TabsList>

        <TabsContent value="supabase">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Supabase Configuration
              </CardTitle>
              <CardDescription>Your Supabase connection details (sensitive values are masked)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <div className="text-sm font-medium">URL</div>
                    <div className="flex items-center justify-between rounded-md border px-3 py-2">
                      <code className="text-xs">{maskedEnv.supabase.url}</code>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(maskedEnv.supabase.url)}>
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-sm font-medium">Anon Key</div>
                    <div className="flex items-center justify-between rounded-md border px-3 py-2">
                      <code className="text-xs">{maskedEnv.supabase.anonKey}</code>
                      <Button variant="ghost" size="sm" disabled>
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-sm font-medium">Service Role Key</div>
                    <div className="flex items-center justify-between rounded-md border px-3 py-2">
                      <code className="text-xs">{maskedEnv.supabase.serviceRoleKey}</code>
                      <Button variant="ghost" size="sm" disabled>
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="postgres">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                PostgreSQL Configuration
              </CardTitle>
              <CardDescription>Your PostgreSQL connection details (sensitive values are masked)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Host</div>
                    <div className="flex items-center justify-between rounded-md border px-3 py-2">
                      <code className="text-xs">{maskedEnv.postgres.host}</code>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(maskedEnv.postgres.host || "")}>
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-sm font-medium">Database</div>
                    <div className="flex items-center justify-between rounded-md border px-3 py-2">
                      <code className="text-xs">{maskedEnv.postgres.database}</code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(maskedEnv.postgres.database || "")}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="text-sm font-medium">User</div>
                    <div className="flex items-center justify-between rounded-md border px-3 py-2">
                      <code className="text-xs">{maskedEnv.postgres.user}</code>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(maskedEnv.postgres.user || "")}>
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-sm font-medium">Password</div>
                    <div className="flex items-center justify-between rounded-md border px-3 py-2">
                      <code className="text-xs">{maskedEnv.postgres.password}</code>
                      <Button variant="ghost" size="sm" disabled>
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-sm font-medium">Connection URL</div>
                  <div className="flex items-center justify-between rounded-md border px-3 py-2">
                    <code className="text-xs truncate">{maskedEnv.postgres.url}</code>
                    <Button variant="ghost" size="sm" disabled>
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="app">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                App Configuration
              </CardTitle>
              <CardDescription>General application environment settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Node Environment</div>
                    <div className="flex items-center justify-between rounded-md border px-3 py-2">
                      <code className="text-xs">{maskedEnv.app.nodeEnv}</code>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(maskedEnv.app.nodeEnv)}>
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-sm font-medium">Is Development</div>
                    <div className="flex items-center justify-between rounded-md border px-3 py-2">
                      <code className="text-xs">{maskedEnv.app.isDevelopment.toString()}</code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(maskedEnv.app.isDevelopment.toString())}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-sm font-medium">Is Production</div>
                    <div className="flex items-center justify-between rounded-md border px-3 py-2">
                      <code className="text-xs">{maskedEnv.app.isProduction.toString()}</code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(maskedEnv.app.isProduction.toString())}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Security Notice</AlertTitle>
          <AlertDescription>
            This page displays masked versions of sensitive environment variables. Full values are never exposed in the
            browser.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}
