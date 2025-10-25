export interface IUser {
    id: string;
    clerkId: string;
    email?: string | null;
    name?: string | null;
    role: 'USER' | 'ADMIN' | string;
    createdAt: Date;
    updatedAt: Date;
    questions: IQuestion[];
    quizResults: IQuizResult[];
    courseStats: ICourseStat[];
}

export interface ICourse {
    id: string;
    name: string;
    description?: string | null;
    image?: string | null;
    quizzes: IQuiz[];
    courseStats: ICourseStat[];
    createdAt: Date;
    updatedAt: Date;
}

export interface IQuiz {
    id: string;
    title: string;
    description?: string | null;
    image?: string | null;
    courseId: string;
    course: ICourse;
    questions: IQuestion[];
    quizResults: IQuizResult[];
    createdAt: Date;
    updatedAt: Date;
}

export interface IQuestion {
    id: string;
    text: string;
    isMultiple: boolean;
    correctIds: string[];
    options: IOption[];
    quizId: string;
    quiz: IQuiz;
    createdBy?: string | null;
    user?: IUser | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface IOption {
    id: string;
    text: string;
    questionId: string;
    question: IQuestion;
}

export interface IQuizResult {
    id: string;
    userId: string;
    user: IUser;
    quizId: string;
    quiz: IQuiz;
    total: number;
    correct: number;
    score: number;
    createdAt: Date;
}

export interface ICourseStat {
    id: string;
    userId: string;
    user: IUser;
    courseId: string;
    course: ICourse;
    attempts: number;
    completed: number;
    averageScore?: number | null;
    lastAttempt?: Date | null;
}

export interface CardProps {
    title: string;
    description: string;
    image?: string;
}


export type DashboardData = {
    role: 'ADMIN' | 'USER';
    totalCourses: number;
    totalQuizzes: number;
    totalUsers?: number;
    averageScore: number;
    attempts: number;
    topCourses: { name: string; avgScore: number }[];
    recentResults: { quiz: string; score: number; user?: string; date: string }[];
};