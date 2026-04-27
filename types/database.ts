export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      ccma_activity_events: {
        Row: {
          id: string;
          user_id: string;
          session_id: string | null;
          event_type: string;
          metadata_json: Json;
          occurred_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          session_id?: string | null;
          event_type: string;
          metadata_json?: Json;
          occurred_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          session_id?: string | null;
          event_type?: string;
          metadata_json?: Json;
          occurred_at?: string;
        };
        Relationships: [];
      };
      ccma_daily_user_stats: {
        Row: {
          user_id: string;
          date: string;
          total_seconds: number;
          active_seconds: number;
          idle_seconds: number;
          lessons_completed: number;
          quizzes_completed: number;
          mock_exams_completed: number;
          average_score: number;
          last_activity_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          date: string;
          total_seconds?: number;
          active_seconds?: number;
          idle_seconds?: number;
          lessons_completed?: number;
          quizzes_completed?: number;
          mock_exams_completed?: number;
          average_score?: number;
          last_activity_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          date?: string;
          total_seconds?: number;
          active_seconds?: number;
          idle_seconds?: number;
          lessons_completed?: number;
          quizzes_completed?: number;
          mock_exams_completed?: number;
          average_score?: number;
          last_activity_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      ccma_domain_mastery: {
        Row: {
          id: string;
          user_id: string;
          domain_id: string;
          mastery_score: number;
          weak_streak: number;
          last_seen_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          domain_id: string;
          mastery_score?: number;
          weak_streak?: number;
          last_seen_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          domain_id?: string;
          mastery_score?: number;
          weak_streak?: number;
          last_seen_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      ccma_domains: {
        Row: {
          id: string;
          slug: string;
          title: string;
          description: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          description?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          description?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      ccma_lessons: {
        Row: {
          id: string;
          domain_id: string;
          title: string;
          mode:
            | "learn"
            | "quiz"
            | "mock_exam"
            | "weak_area_review"
            | "study_plan"
            | "rapid_review";
          difficulty: number;
          estimated_minutes: number;
          content_json: Json;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          domain_id: string;
          title: string;
          mode?:
            | "learn"
            | "quiz"
            | "mock_exam"
            | "weak_area_review"
            | "study_plan"
            | "rapid_review";
          difficulty?: number;
          estimated_minutes?: number;
          content_json?: Json;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          domain_id?: string;
          title?: string;
          mode?:
            | "learn"
            | "quiz"
            | "mock_exam"
            | "weak_area_review"
            | "study_plan"
            | "rapid_review";
          difficulty?: number;
          estimated_minutes?: number;
          content_json?: Json;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      ccma_mock_exam_attempts: {
        Row: {
          id: string;
          user_id: string;
          score: number;
          percent: number;
          passed: boolean;
          started_at: string;
          completed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          score?: number;
          percent?: number;
          passed?: boolean;
          started_at?: string;
          completed_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          score?: number;
          percent?: number;
          passed?: boolean;
          started_at?: string;
          completed_at?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      ccma_profiles: {
        Row: {
          id: string;
          role: "student" | "admin";
          full_name: string;
          email: string;
          username: string;
          cohort: string | null;
          study_goal_hours: number;
          last_login_at: string | null;
          last_activity_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          role?: "student" | "admin";
          full_name: string;
          email: string;
          username?: string;
          cohort?: string | null;
          study_goal_hours?: number;
          last_login_at?: string | null;
          last_activity_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          role?: "student" | "admin";
          full_name?: string;
          email?: string;
          username?: string;
          cohort?: string | null;
          study_goal_hours?: number;
          last_login_at?: string | null;
          last_activity_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      ccma_question_bank: {
        Row: {
          id: string;
          domain_id: string;
          lesson_id: string | null;
          type: string;
          prompt: string;
          choices_json: Json | null;
          answer_json: Json;
          rationale: string;
          memory_tip: string | null;
          difficulty: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          domain_id: string;
          lesson_id?: string | null;
          type: string;
          prompt: string;
          choices_json?: Json | null;
          answer_json: Json;
          rationale: string;
          memory_tip?: string | null;
          difficulty?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          domain_id?: string;
          lesson_id?: string | null;
          type?: string;
          prompt?: string;
          choices_json?: Json | null;
          answer_json?: Json;
          rationale?: string;
          memory_tip?: string | null;
          difficulty?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      ccma_quiz_attempts: {
        Row: {
          id: string;
          user_id: string;
          lesson_id: string | null;
          domain_id: string | null;
          score: number;
          total_questions: number;
          started_at: string;
          completed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          lesson_id?: string | null;
          domain_id?: string | null;
          score?: number;
          total_questions?: number;
          started_at?: string;
          completed_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          lesson_id?: string | null;
          domain_id?: string | null;
          score?: number;
          total_questions?: number;
          started_at?: string;
          completed_at?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      ccma_tutor_sessions: {
        Row: {
          id: string;
          user_id: string;
          mode:
            | "learn"
            | "quiz"
            | "mock_exam"
            | "weak_area_review"
            | "study_plan"
            | "rapid_review";
          domain_id: string | null;
          lesson_id: string | null;
          status: "active" | "paused" | "completed" | "abandoned";
          started_at: string;
          ended_at: string | null;
          last_activity_at: string;
          total_seconds: number;
          active_seconds: number;
          idle_seconds: number;
          session_state_json: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          mode:
            | "learn"
            | "quiz"
            | "mock_exam"
            | "weak_area_review"
            | "study_plan"
            | "rapid_review";
          domain_id?: string | null;
          lesson_id?: string | null;
          status?: "active" | "paused" | "completed" | "abandoned";
          started_at?: string;
          ended_at?: string | null;
          last_activity_at?: string;
          total_seconds?: number;
          active_seconds?: number;
          idle_seconds?: number;
          session_state_json?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          mode?:
            | "learn"
            | "quiz"
            | "mock_exam"
            | "weak_area_review"
            | "study_plan"
            | "rapid_review";
          domain_id?: string | null;
          lesson_id?: string | null;
          status?: "active" | "paused" | "completed" | "abandoned";
          started_at?: string;
          ended_at?: string | null;
          last_activity_at?: string;
          total_seconds?: number;
          active_seconds?: number;
          idle_seconds?: number;
          session_state_json?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      ccma_tutor_turns: {
        Row: {
          id: string;
          session_id: string;
          actor: "tutor" | "student" | "system";
          turn_type: string;
          content: string;
          correctness: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          actor: "tutor" | "student" | "system";
          turn_type: string;
          content: string;
          correctness?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          session_id?: string;
          actor?: "tutor" | "student" | "system";
          turn_type?: string;
          content?: string;
          correctness?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
};
