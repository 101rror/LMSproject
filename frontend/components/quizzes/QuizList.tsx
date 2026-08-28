'use client';

import type { Quiz } from '@/types/quiz';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, HelpCircle, Play } from 'lucide-react';
import Link from 'next/link';

interface QuizListProps {
  quizzes: Quiz[];
  emptyMessage?: string;
  onEdit?: (quiz: Quiz) => void;
  onDelete?: (quiz: Quiz) => void;
  playHref?: (quiz: Quiz) => string;
  manageQuestionsHref?: (quiz: Quiz) => string;
}

export function QuizList({
  quizzes, emptyMessage = 'No quizzes found',
  onEdit, onDelete, playHref, manageQuestionsHref
}: QuizListProps) {
  if (quizzes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
        <HelpCircle className="mb-2 h-8 w-8 text-muted-foreground" />
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {quizzes.map((quiz) => {
        const questionCount = Array.isArray(quiz.quiz_questions) ? quiz.quiz_questions.length : 0;
        return (
          <Card key={quiz.documentId || quiz.id}>
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle className="text-base">{quiz.title}</CardTitle>
                  {quiz.course && (
                    <p className="text-xs text-muted-foreground">{quiz.course.title}</p>
                  )}
                </div>
                <Badge variant="secondary" className="gap-1">
                  <HelpCircle className="h-3 w-3" />
                  {questionCount} questions
                </Badge>
              </div>
            </CardHeader>
            {quiz.description && (
              <CardContent>
                <p className="text-sm text-muted-foreground">{quiz.description}</p>
              </CardContent>
            )}
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {playHref && (
                  <Button size="sm" asChild>
                    <Link href={playHref(quiz)}>
                      <Play className="mr-1 h-3 w-3" />
                      Take Quiz
                    </Link>
                  </Button>
                )}
                {manageQuestionsHref && (
                  <Button size="sm" variant="outline" asChild>
                    <Link href={manageQuestionsHref(quiz)}>
                      Manage Questions
                    </Link>
                  </Button>
                )}
                {onEdit && (
                  <Button size="sm" variant="outline" onClick={() => onEdit(quiz)}>
                    <Edit className="mr-1 h-3 w-3" />
                    Edit
                  </Button>
                )}
                {onDelete && (
                  <Button size="sm" variant="destructive" onClick={() => onDelete(quiz)}>
                    <Trash2 className="mr-1 h-3 w-3" />
                    Delete
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
