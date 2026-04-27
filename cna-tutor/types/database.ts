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
      activity_events: {
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
      daily_user_stats: {
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
      domain_mastery: {
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
      domains: {
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
      lessons: {
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
      mock_exam_attempts: {
        Row: {
          id: string;
          user_id: string;
          section: "written" | "skills";
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
          section?: "written" | "skills";
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
          section?: "written" | "skills";
          score?: number;
          percent?: number;
          passed?: boolean;
          started_at?: string;
          completed_at?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          role: "student" | "admin";
          product: "cna" | "ccma";
          full_name: string;
          email: string;
          username: string;
          cohort: string | null;
          preferred_language: string;
          study_goal_hours: number;
          last_login_at: string | null;
          last_activity_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          role?: "student" | "admin";
          product?: "cna" | "ccma";
          full_name: string;
          email: string;
          username?: string;
          cohort?: string | null;
          preferred_language?: string;
          study_goal_hours?: number;
          last_login_at?: string | null;
          last_activity_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          role?: "student" | "admin";
          product?: "cna" | "ccma";
          full_name?: string;
          email?: string;
          username?: string;
          cohort?: string | null;
          preferred_language?: string;
          study_goal_hours?: number;
          last_login_at?: string | null;
          last_activity_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      question_bank: {
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
      quiz_attempts: {
        Row: {
          id: string;
          user_id: string;
          lesson_id: string | null;
          domain_id: string | null;
          section: "written" | "skills";
          confidence_level: string | null;
          confidence_score: number | null;
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
          section?: "written" | "skills";
          confidence_level?: string | null;
          confidence_score?: number | null;
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
          section?: "written" | "skills";
          confidence_level?: string | null;
          confidence_score?: number | null;
          score?: number;
          total_questions?: number;
          started_at?: string;
          completed_at?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      tutor_sessions: {
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
          section: "written" | "skills";
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
          section?: "written" | "skills";
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
          section?: "written" | "skills";
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
      tutor_turns: {
        Row: {
          id: string;
          session_id: string;
          actor: "tutor" | "student" | "system";
          turn_type: string;
          content: string;
          correctness: string | null;
          bloom_level: number | null;
          segment_id: string | null;
          mastery_delta: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          actor: "tutor" | "student" | "system";
          turn_type: string;
          content: string;
          correctness?: string | null;
          bloom_level?: number | null;
          segment_id?: string | null;
          mastery_delta?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          session_id?: string;
          actor?: "tutor" | "student" | "system";
          turn_type?: string;
          content?: string;
          correctness?: string | null;
          bloom_level?: number | null;
          segment_id?: string | null;
          mastery_delta?: number | null;
          created_at?: string;
        };
        Relationships: [];
      };
      concept_mastery: {
        Row: {
          id: string;
          user_id: string;
          concept_id: string;
          lesson_id: string;
          interval: number;
          ease_factor: number;
          repetitions: number;
          next_review_at: string;
          mastery_score: number;
          last_score: number;
          bloom_level: number;
          last_seen_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          concept_id: string;
          lesson_id: string;
          interval?: number;
          ease_factor?: number;
          repetitions?: number;
          next_review_at?: string;
          mastery_score?: number;
          last_score?: number;
          bloom_level?: number;
          last_seen_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          concept_id?: string;
          lesson_id?: string;
          interval?: number;
          ease_factor?: number;
          repetitions?: number;
          next_review_at?: string;
          mastery_score?: number;
          last_score?: number;
          bloom_level?: number;
          last_seen_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      cna_skill_progress: {
        Row: {
          id: string;
          user_id: string;
          skill_slug: string;
          mastery_score: number;
          walkthrough_completions: number;
          timed_practice_completions: number;
          last_practiced_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          skill_slug: string;
          mastery_score?: number;
          walkthrough_completions?: number;
          timed_practice_completions?: number;
          last_practiced_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          skill_slug?: string;
          mastery_score?: number;
          walkthrough_completions?: number;
          timed_practice_completions?: number;
          last_practiced_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      study_streaks: {
        Row: {
          user_id: string;
          current_streak: number;
          longest_streak: number;
          last_study_date: string | null;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          current_streak?: number;
          longest_streak?: number;
          last_study_date?: string | null;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          current_streak?: number;
          longest_streak?: number;
          last_study_date?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      achievement_definitions: {
        Row: {
          id: string;
          slug: string;
          title: string;
          description: string;
          criteria_json: Record<string, unknown>;
          category: string;
          icon_slug: string;
          product: string | null;
          domain_slug: string | null;
          unlock_condition_text: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          description: string;
          criteria_json?: Record<string, unknown>;
          category?: string;
          icon_slug?: string;
          product?: string | null;
          domain_slug?: string | null;
          unlock_condition_text?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          description?: string;
          criteria_json?: Record<string, unknown>;
          category?: string;
          icon_slug?: string;
          product?: string | null;
          domain_slug?: string | null;
          unlock_condition_text?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      student_achievements: {
        Row: {
          user_id: string;
          achievement_id: string;
          earned_at: string;
        };
        Insert: {
          user_id: string;
          achievement_id: string;
          earned_at?: string;
        };
        Update: {
          user_id?: string;
          achievement_id?: string;
          earned_at?: string;
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




