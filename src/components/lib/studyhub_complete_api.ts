// src/api/api.ts
import { createClient } from "@supabase/supabase-js";

// ✅ Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ✅ Perplexity key
const perplexityKey = import.meta.env.VITE_PERPLEXITY_API_KEY as string;

// -----------------------------
// Types
// -----------------------------
export interface Exam {
  id: string;
  title: string;
  category: string;
  difficulty_level: "beginner" | "intermediate" | "advanced";
  total_questions: number;
  provider: string;
  description?: string;
  icon_url?: string;
}

export interface Question {
  id: string;
  exam_id: string;
  question_text: string;
  options: string[];
  correct_answer: string;
  difficulty: "easy" | "medium" | "hard";
}

export interface Flashcard {
  id: string;
  exam_id: string;
  front: string;
  back: string;
}

export interface TestSession {
  id: string;
  exam_id: string;
  user_id: string;
  started_at: string;
  completed_at?: string;
  score?: number;
}

// -----------------------------
// APIs
// -----------------------------

// 🔹 Auth
export const AuthAPI = {
  async signIn(email: string, password: string) {
    return supabase.auth.signInWithPassword({ email, password });
  },
  async signUp(email: string, password: string) {
    return supabase.auth.signUp({ email, password });
  },
  async signOut() {
    return supabase.auth.signOut();
  },
  async getUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  },
};

// 🔹 Exams
export const ExamAPI = {
  async getAllExams(): Promise<Exam[]> {
    const { data, error } = await supabase.from("exams").select("*");
    if (error) throw error;
    return data as Exam[];
  },
  async getExamById(id: string): Promise<Exam | null> {
    const { data, error } = await supabase.from("exams").select("*").eq("id", id).single();
    if (error) throw error;
    return data as Exam;
  },
};

// 🔹 Questions
export const QuestionAPI = {
  async getQuestionsByExam(examId: string): Promise<Question[]> {
    const { data, error } = await supabase.from("questions").select("*").eq("exam_id", examId);
    if (error) throw error;
    return data as Question[];
  },
};

// 🔹 Test Sessions
export const TestSessionAPI = {
  async startTest(userId: string, examId: string): Promise<TestSession> {
    const { data, error } = await supabase
      .from("test_sessions")
      .insert([{ user_id: userId, exam_id: examId }])
      .select()
      .single();
    if (error) throw error;
    return data as TestSession;
  },
  async completeTest(sessionId: string, score: number) {
    const { data, error } = await supabase
      .from("test_sessions")
      .update({ completed_at: new Date().toISOString(), score })
      .eq("id", sessionId)
      .select()
      .single();
    if (error) throw error;
    return data as TestSession;
  },
};

// 🔹 Flashcards
export const FlashcardAPI = {
  async getFlashcards(examId: string): Promise<Flashcard[]> {
    const { data, error } = await supabase.from("flashcards").select("*").eq("exam_id", examId);
    if (error) throw error;
    return data as Flashcard[];
  },
};

// 🔹 AI Helper (Perplexity)
export const AIHelperAPI = {
  async ask(question: string): Promise<string> {
    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${perplexityKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "sonar-medium-chat", // sonar-small-chat or sonar-large-chat available too
        messages: [
          { role: "system", content: "You are a helpful study assistant." },
          { role: "user", content: question },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Perplexity API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "I couldn’t generate an answer.";
  },
};
