import { useState } from "react";
import { useForm } from "react-hook-form";
import { Activity } from "@/types/fitness";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Label } from "@/components/ui/label";
import { ActivityTemplateForm } from "./forms/ActivityTemplateForm";
import { ActivityDetailsForm } from "./forms/ActivityDetailsForm";
import { TemplateSelector } from "./forms/TemplateSelector";

type FormValues = {
  type: string;
  description: string;
  duration: string;
  calories: string;
  distance: string;
  template_name: string;
  template_description: string;
  is_public: boolean;
};

export function AddActivityDialog() {
  const [open, setOpen] = useState(false);
  const [isTemplate, setIsTemplate] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    defaultValues: {
      type: "",
      description: "",
      duration: "",
      calories: "",
      distance: "",
      template_name: "",
      template_description: "",
      is_public: false,
    },
  });

  // Query to check if user exists in the users table
  const { data: userExists } = useQuery({
    queryKey: ["user-exists", user?.id],
    queryFn: async () => {
      if (!user) return false;
      const { data, error } = await supabase
        .from("users")
        .select("id")
        .eq("id", user.id)
        .single();
      
      if (error) {
        console.error("Error checking user existence:", error);
        return false;
      }
      return !!data;
    },
    enabled: !!user,
  });

  const { data: templates } = useQuery({
    queryKey: ["activity-templates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("activities")
        .select("*")
        .eq("is_template", true)
        .eq("is_public", true);

      if (error) throw error;
      return data as Activity[];
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      if (!user) {
        console.error("No user found in AddActivityDialog");
        throw new Error("You must be logged in to add an activity");
      }

      if (!userExists) {
        console.error("User record not found in users table");
        throw new Error("Please sign out and sign in again to create your user profile");
      }

      console.log("Creating activity with values:", values);
      console.log("User ID:", user.id);

      const activityData = {
        user_id: user.id,
        type: values.type,
        description: values.description,
        duration: parseInt(values.duration),
        calories: values.calories ? parseInt(values.calories) : null,
        distance: values.distance ? parseFloat(values.distance) : null,
        date: new Date().toISOString(),
        is_template: isTemplate,
        template_name: isTemplate ? values.template_name : null,
        template_description: isTemplate ? values.template_description : null,
        is_public: isTemplate ? values.is_public : false,
      };

      console.log("Sending activity data to Supabase:", activityData);

      const { data, error } = await supabase
        .from("activities")
        .insert(activityData)
        .select()
        .single();

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      console.log("Activity created successfully:", data);

      toast({
        title: "Success",
        description: isTemplate ? "Template created successfully!" : "Activity added successfully!",
      });
      setOpen(false);
      form.reset();
    } catch (error: any) {
      console.error("Error adding activity:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = templates?.find((t) => t.id === templateId);
    if (template) {
      form.setValue("type", template.type);
      form.setValue("description", template.description || "");
      form.setValue("duration", template.duration.toString());
      if (template.calories) form.setValue("calories", template.calories.toString());
      if (template.distance) form.setValue("distance", template.distance.toString());
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Activity</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Activity</DialogTitle>
          <DialogDescription>
            Log a new fitness activity or create a template.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                checked={isTemplate}
                onCheckedChange={setIsTemplate}
                id="template-mode"
              />
              <Label htmlFor="template-mode">Create as template</Label>
            </div>

            {!isTemplate && templates && templates.length > 0 && (
              <TemplateSelector
                form={form}
                templates={templates}
                onTemplateSelect={handleTemplateSelect}
              />
            )}

            {isTemplate && <ActivityTemplateForm form={form} />}
            <ActivityDetailsForm form={form} />
            
            <Button type="submit">
              {isTemplate ? "Create Template" : "Add Activity"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}