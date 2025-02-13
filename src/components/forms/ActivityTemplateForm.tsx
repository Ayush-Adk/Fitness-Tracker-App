import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { Label } from "@/components/ui/label";

interface ActivityTemplateFormProps {
  form: UseFormReturn<any>;
}

export function ActivityTemplateForm({ form }: ActivityTemplateFormProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="template_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Template Name</FormLabel>
            <FormControl>
              <Input placeholder="Template name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="template_description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Template Description</FormLabel>
            <FormControl>
              <Input placeholder="Template description" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="is_public"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center space-x-2">
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel>Make template public</FormLabel>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}