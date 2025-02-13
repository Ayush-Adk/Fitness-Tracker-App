import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Activity } from "@/types/fitness";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Comment {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  user: {
    full_name: string;
  };
}

interface ActivityCommentsProps {
  activity: Activity;
}

export function ActivityComments({ activity }: ActivityCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchComments();
    subscribeToComments();
  }, [activity.id]);

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from("activity_comments")
      .select(`
        *,
        user:users(full_name)
      `)
      .eq("activity_id", activity.id)
      .order("created_at", { ascending: true });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch comments",
      });
      return;
    }

    setComments(data);
  };

  const subscribeToComments = () => {
    const channel = supabase
      .channel("activity_comments")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "activity_comments",
          filter: `activity_id=eq.${activity.id}`,
        },
        (payload) => {
          fetchComments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const { error } = await supabase.from("activity_comments").insert({
        activity_id: activity.id,
        user_id: user?.id,
        content: newComment.trim(),
      });

      if (error) throw error;

      setNewComment("");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Comments</h3>
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-muted p-3 rounded-lg">
            <div className="flex justify-between items-start">
              <span className="font-medium">{comment.user.full_name}</span>
              <span className="text-sm text-muted-foreground">
                {format(new Date(comment.created_at), "MMM d, yyyy HH:mm")}
              </span>
            </div>
            <p className="mt-1 text-sm">{comment.content}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmitComment} className="flex gap-2">
        <Input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
        />
        <Button type="submit">Post</Button>
      </form>
    </div>
  );
}