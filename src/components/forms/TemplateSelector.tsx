import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { Activity } from "@/types/fitness";

interface TemplateSelectorProps {
  form: UseFormReturn<any>;
  templates: Activity[];
  onTemplateSelect: (templateId: string) => void;
}

export function TemplateSelector({ form, templates, onTemplateSelect }: TemplateSelectorProps) {
  return (
    <FormField
      control={form.control}
      name="type"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Use Template</FormLabel>
          <Select
            onValueChange={onTemplateSelect}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a template" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {templates.map((template) => (
                <SelectItem key={template.id} value={template.id}>
                  {template.template_name || template.description || template.type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}