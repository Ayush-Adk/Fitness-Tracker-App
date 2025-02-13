import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Moon, Sun, Globe, Moon as SleepIcon, Leaf, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Create default settings if they don't exist
  const createDefaultSettings = async () => {
    const { data, error } = await supabase
      .from('settings')
      .insert([
        {
          user_id: user?.id,
          language: 'en',
          theme: 'light',
          notifications_enabled: true,
          sleep_tracking_enabled: true,
          nutrition_tracking_enabled: true,
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error) throw error;
      
      // If no settings exist, create default ones
      if (!data) {
        return createDefaultSettings();
      }

      return data;
    },
  });

  const updateSettings = useMutation({
    mutationFn: async (newSettings: any) => {
      const { data, error } = await supabase
        .from('settings')
        .upsert({
          user_id: user?.id,
          ...newSettings,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      toast({
        title: "Settings updated",
        description: "Your settings have been saved successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      });
      console.error("Settings update error:", error);
    },
  });

  if (!mounted || isLoading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="mr-4">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize how the app looks and feels</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Theme</Label>
              <div className="text-sm text-muted-foreground">
                Choose between light and dark mode
              </div>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Language</Label>
              <div className="text-sm text-muted-foreground">
                Select your preferred language
              </div>
            </div>
            <Select
              value={settings?.language || "en"}
              onValueChange={(value) => updateSettings.mutate({ language: value })}
            >
              <SelectTrigger className="w-[180px]">
                <Globe className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="de">Deutsch</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Features</CardTitle>
          <CardDescription>Enable or disable app features</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="flex items-center">
                <SleepIcon className="mr-2 h-4 w-4" />
                Sleep Tracking
              </Label>
              <div className="text-sm text-muted-foreground">
                Track your sleep patterns
              </div>
            </div>
            <Switch
              checked={settings?.sleep_tracking_enabled}
              onCheckedChange={(checked) =>
                updateSettings.mutate({ sleep_tracking_enabled: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="flex items-center">
                <Leaf className="mr-2 h-4 w-4" />
                Nutrition Tracking
              </Label>
              <div className="text-sm text-muted-foreground">
                Monitor your diet and nutrition
              </div>
            </div>
            <Switch
              checked={settings?.nutrition_tracking_enabled}
              onCheckedChange={(checked) =>
                updateSettings.mutate({ nutrition_tracking_enabled: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="flex items-center">
                <Trophy className="mr-2 h-4 w-4" />
                Competitions
              </Label>
              <div className="text-sm text-muted-foreground">
                Participate in fitness competitions
              </div>
            </div>
            <Switch
              checked={settings?.competitions_enabled}
              onCheckedChange={(checked) =>
                updateSettings.mutate({ competitions_enabled: checked })
              }
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;