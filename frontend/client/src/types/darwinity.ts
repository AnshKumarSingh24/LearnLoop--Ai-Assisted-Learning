export type Space = {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  pageIds: string[];
  sourceIds: string[];
  courseIds: string[];
  archived: boolean;
  createdAt: string;
  updatedAt: string;
};

export type BlockNode = {
  id: string;
  pageId: string;
  parentId: string | null;
  type: "paragraph" | "heading" | "bullet" | "todo" | "callout" | "divider" | "canvas" | "embed";
  content: any;
  order: number;
};

export type EntityAttribute = {
  id: string;
  name: string;
  type: "text" | "select" | "date" | "number" | "boolean";
  options?: string[]; // for select
};

export type EntityValue = {
  id: string;
  pageId: string;
  attributeId: string;
  value: any;
};

export type Page = {
  id: string;
  spaceId: string;
  parentId?: string;
  templateId?: string;
  title: string;
  icon: string;
  favorite: boolean;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CourseStatus = "draft" | "generating" | "needs-review" | "ready" | "published" | "active" | "completed" | "processing";

export type LessonBlock = {
  id: string;
  type:
    | "explanation"
    | "example"
    | "callout"
    | "source"
    | "image"
    | "flashcard"
    | "multiple-choice"
    | "short-answer"
    | "reflection";
  content?: string;
  title?: string;
  front?: string;
  back?: string;
  question?: string;
  options?: string[];
  correctIndex?: number;
  explanation?: string;
  sourceIds?: string[];
  metadata?: Record<string, any>;
};

export type CourseLesson = {
  id: string;
  title: string;
  objective: string;
  estimatedMinutes: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  status: "draft" | "ready" | "needs-review" | "complete";
  blocks: LessonBlock[];
  sourceIds: string[];
  hasAssessment: boolean;
};

export type CourseModule = {
  id: string;
  title: string;
  description: string;
  lessonIds: string[];
};

export type Course = {
  id: string;
  spaceId?: string;
  title: string;
  description: string;
  icon: string;
  accent: string;
  status: CourseStatus;
  modules: CourseModule[];
  lessons: CourseLesson[];
  sourceIds: string[];
  learningGoal: string;
  mastery?: {
    completedLessonIds: string[];
    completedLessons: number;
    progress?: number;
    score?: number;
    xp?: number;
  };
  estimatedMinutes: number;
  readiness: number;
  progress: number;
  currentLessonId: string;
  totalLessons: number;
  completedLessons: number;
  nextAction: string;
  updatedAt: string;
};

export type DarwinityState = {
  spaces: Space[];
  pages: Page[];
  courses: Course[];
  blocks: BlockNode[];
  attributes: EntityAttribute[];
  values: EntityValue[];
  activeSpaceId: string | null;
  activePageId: string | null;
  activeCourseId: string | null;
};
