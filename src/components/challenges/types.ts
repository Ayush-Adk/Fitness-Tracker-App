
export type CompetitionWithProgress = {
  id: string;
  title: string;
  description: string;
  competition_type: 'steps' | 'weightlifting' | 'running' | 'team';
  target_value: number;
  reward_points: number;
  rules: string;
  team_size: number;
  end_date: string;
  participants: { user_id: string }[];
  progress?: {
    current_value: number;
    last_updated: string;
  };
  milestones: {
    id: string;
    title: string;
    description: string;
    target_value: number;
    reward_points: number;
    completed?: boolean;
  }[];
};
