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
      profiles: {
        Row: {
          id: string;
          role: "student" | "admin";
          product: "cna" | "ccma" | "rda";
          full_name: string;
          email: string;
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
          product?: "cna" | "ccma" | "rda";
          full_name: string;
          email: string;
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
          product?: "cna" | "ccma" | "rda";
          full_name?: string;
          email?: string;
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
      rda_profiles: {
        Row: {
          id: string;
          user_id: string;
          product: string;
          full_name: string | null;
          language_preference: string | null;
          school_or_program: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product?: string;
          full_name?: string | null;
          language_preference?: string | null;
          school_or_program?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          product?: string;
          full_name?: string | null;
          language_preference?: string | null;
          school_or_program?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      rda_pretest_results: {
        Row: {
          id: string;
          user_id: string;
          overall_score: number;
          domain_scores: Json;
          weak_areas: Json | null;
          strengths: Json | null;
          readiness_score: number | null;
          readiness_label: string | null;
          confidence_estimate: number | null;
          answers: Json | null;
          completed_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          overall_score: number;
          domain_scores: Json;
          weak_areas?: Json | null;
          strengths?: Json | null;
          readiness_score?: number | null;
          readiness_label?: string | null;
          confidence_estimate?: number | null;
          answers?: Json | null;
          completed_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          overall_score?: number;
          domain_scores?: Json;
          weak_areas?: Json | null;
          strengths?: Json | null;
          readiness_score?: number | null;
          readiness_label?: string | null;
          confidence_estimate?: number | null;
          answers?: Json | null;
          completed_at?: string;
        };
        Relationships: [];
      };
      rda_lesson_progress: {
        Row: {
          id: string;
          user_id: string;
          lesson_id: string;
          domain_id: string;
          status: string;
          mastery_score: number | null;
          current_step: number | null;
          attempts_count: number | null;
          last_feedback: string | null;
          completed_at: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          lesson_id: string;
          domain_id: string;
          status?: string;
          mastery_score?: number | null;
          current_step?: number | null;
          attempts_count?: number | null;
          last_feedback?: string | null;
          completed_at?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          lesson_id?: string;
          domain_id?: string;
          status?: string;
          mastery_score?: number | null;
          current_step?: number | null;
          attempts_count?: number | null;
          last_feedback?: string | null;
          completed_at?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      rda_quiz_attempts: {
        Row: {
          id: string;
          user_id: string;
          quiz_id: string;
          domain_id: string;
          score: number;
          passed: boolean;
          answers: Json | null;
          weak_areas: Json | null;
          completed_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          quiz_id: string;
          domain_id: string;
          score: number;
          passed?: boolean;
          answers?: Json | null;
          weak_areas?: Json | null;
          completed_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          quiz_id?: string;
          domain_id?: string;
          score?: number;
          passed?: boolean;
          answers?: Json | null;
          weak_areas?: Json | null;
          completed_at?: string;
        };
        Relationships: [];
      };
      rda_mock_exam_attempts: {
        Row: {
          id: string;
          user_id: string;
          exam_version: string | null;
          score: number;
          timed: boolean;
          duration_seconds: number | null;
          domain_scores: Json;
          weak_areas: Json | null;
          action_plan: Json | null;
          answers: Json | null;
          completed_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          exam_version?: string | null;
          score: number;
          timed?: boolean;
          duration_seconds?: number | null;
          domain_scores: Json;
          weak_areas?: Json | null;
          action_plan?: Json | null;
          answers?: Json | null;
          completed_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          exam_version?: string | null;
          score?: number;
          timed?: boolean;
          duration_seconds?: number | null;
          domain_scores?: Json;
          weak_areas?: Json | null;
          action_plan?: Json | null;
          answers?: Json | null;
          completed_at?: string;
        };
        Relationships: [];
      };
      rda_readiness_snapshots: {
        Row: {
          id: string;
          user_id: string;
          score: number;
          label: string;
          weak_areas: Json | null;
          strengths: Json | null;
          next_best_action: string | null;
          checklist: Json | null;
          recovery_signals: Json | null;
          confidence_trend: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          score: number;
          label: string;
          weak_areas?: Json | null;
          strengths?: Json | null;
          next_best_action?: string | null;
          checklist?: Json | null;
          recovery_signals?: Json | null;
          confidence_trend?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          score?: number;
          label?: string;
          weak_areas?: Json | null;
          strengths?: Json | null;
          next_best_action?: string | null;
          checklist?: Json | null;
          recovery_signals?: Json | null;
          confidence_trend?: number | null;
          created_at?: string;
        };
        Relationships: [];
      };
      rda_study_sessions: {
        Row: {
          id: string;
          user_id: string;
          lesson_id: string | null;
          domain_id: string | null;
          session_type: "lesson" | "quiz" | "mock_exam" | "pretest" | "review" | "tutor";
          duration_seconds: number;
          completed: boolean;
          score: number | null;
          metadata: Json;
          started_at: string;
          ended_at: string | null;
          active_seconds: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          lesson_id?: string | null;
          domain_id?: string | null;
          session_type: "lesson" | "quiz" | "mock_exam" | "pretest" | "review" | "tutor";
          duration_seconds?: number;
          completed?: boolean;
          score?: number | null;
          metadata?: Json;
          started_at?: string;
          ended_at?: string | null;
          active_seconds?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          lesson_id?: string | null;
          domain_id?: string | null;
          session_type?: "lesson" | "quiz" | "mock_exam" | "pretest" | "review" | "tutor";
          duration_seconds?: number;
          completed?: boolean;
          score?: number | null;
          metadata?: Json;
          started_at?: string;
          ended_at?: string | null;
          active_seconds?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      rda_tutor_sessions: {
        Row: {
          id: string;
          user_id: string;
          lesson_id: string;
          mode: string;
          status: string;
          session_state_json: Json;
          started_at: string;
          ended_at: string | null;
          last_activity_at: string;
          total_seconds: number;
          active_seconds: number;
          idle_seconds: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          lesson_id: string;
          mode: string;
          status?: string;
          session_state_json?: Json;
          started_at?: string;
          ended_at?: string | null;
          last_activity_at?: string;
          total_seconds?: number;
          active_seconds?: number;
          idle_seconds?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          lesson_id?: string;
          mode?: string;
          status?: string;
          session_state_json?: Json;
          started_at?: string;
          ended_at?: string | null;
          last_activity_at?: string;
          total_seconds?: number;
          active_seconds?: number;
          idle_seconds?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      rda_tutor_turns: {
        Row: {
          id: string;
          session_id: string;
          actor: string;
          turn_type: string;
          content: string;
          correctness: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          actor: string;
          turn_type: string;
          content: string;
          correctness?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          session_id?: string;
          actor?: string;
          turn_type?: string;
          content?: string;
          correctness?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      rda_admin_notes: {
        Row: {
          id: string;
          user_id: string;
          admin_user_id: string;
          note: string;
          note_type: "general" | "check_in" | "risk" | "encouragement" | "academic";
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          admin_user_id: string;
          note: string;
          note_type?: "general" | "check_in" | "risk" | "encouragement" | "academic";
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          admin_user_id?: string;
          note?: string;
          note_type?: "general" | "check_in" | "risk" | "encouragement" | "academic";
          created_at?: string;
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
      tutor_turns: {
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




