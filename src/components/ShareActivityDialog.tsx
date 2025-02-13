import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Activity } from "@/types/fitness";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Share } from "lucide-react";

interface ShareActivityDialogProps {
  activity: Activity;
}

export function ShareActivityDialog({ activity }: ShareActivityDialogProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleShare = async () => {
    try {
      if (email) {
        // Get user by email
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("id")
          .eq("email", email)
          .single();

        if (userError || !userData) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "User not found",
          });
          return;
        }

        // Share with specific user
        const { error: shareError } = await supabase.from("activity_shares").insert({
          activity_id: activity.id,
          shared_by: user?.id,
          shared_with: userData.id,
          public: false,
        });

        if (shareError) throw shareError;
      } else if (isPublic) {
        // Share publicly
        const { error: shareError } = await supabase.from("activity_shares").insert({
          activity_id: activity.id,
          shared_by: user?.id,
          public: true,
        });

        if (shareError) throw shareError;
      }

      toast({
        title: "Success",
        description: "Activity shared successfully!",
      });
      setOpen(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Share className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Activity</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Share with user (email)</Label>
            <Input
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="public"
              checked={isPublic}
              onCheckedChange={setIsPublic}
            />
            <Label htmlFor="public">Make public</Label>
          </div>
          <Button onClick={handleShare}>Share</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}