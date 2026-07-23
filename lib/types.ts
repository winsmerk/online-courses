export type Lesson = {
  id: string;
  title: string;
  slug: string;
  description: string;
  durationMinutes: number;
  videoPath?: string | null;
  isPreview?: boolean;
  completed?: boolean;
  attachments?: Array<{
    id: string;
    filename: string;
    storagePath: string;
  }>;
};

export type Chapter = {
  id: string;
  title: string;
  sortOrder: number;
  lessons: Lesson[];
};

export type Course = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  coverUrl: string;
  introImages: string[];
  instructor: string;
  category: string;
  level: string;
  durationMinutes: number;
  status: "draft" | "published";
  chapters: Chapter[];
};

export type EnrollmentCourse = Course & {
  progress: number;
  learningStatus: "待学习" | "学习中" | "已完成";
};

export type Viewer = {
  id: string;
  name: string;
  email: string;
  role: "student" | "admin";
  demo?: boolean;
};
