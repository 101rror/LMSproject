'use client';

import { useState } from 'react';
import type { Quiz } from '@/types/quiz';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CheckCircle2, XCircle, Award } from 'lucide-react';

interface QuizPlayerProps {
  quiz: Quiz;
  onSubmit: (answers: number[], score: number, totalQuestions: number) => Promise<void>;
}

export function QuizPlayer({ quiz, onSubmit }: QuizPlayerProps) {
  const questions = Array.isArray(quiz.quiz_questions) ? quiz.quiz_questions : [];
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [saving, setSaving] = useState(false);

  const handleAnswer = (questionId: number, optionIndex: number) => {
    if (submitted) return;
    setAnswers({ ...answers, [questionId]: optionIndex });
  };

  const handleSubmit = async () => {
    const totalQuestions = questions.length;
    let correct = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.correct_answer) correct++;
    });
    setScore(correct);
    setSubmitted(true);
    setSaving(true);
    try {
      const answerArray = questions.map((q) => answers[q.id] ?? -1);
      await onSubmit(answerArray, correct, totalQuestions);
    } catch {
      // result save failure is non-fatal for the UI
    } finally {
      setSaving(false);
    }
  };

  if (questions.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          This quiz has no questions yet.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {submitted && (
        <Card className="border-primary">
          <CardContent className="flex items-center gap-4 py-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <Award className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold">
                Your Score: {score} / {questions.length}
              </h3>
              <p className="text-sm text-muted-foreground">
                {Math.round((score / questions.length) * 100)}% correct
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {questions.map((q, qIndex) => {
        const userAnswer = answers[q.id];
        const isCorrect = submitted && userAnswer === q.correct_answer;
        return (
          <Card key={q.id}>
            <CardHeader>
              <div className="flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-semibold">
                  {qIndex + 1}
                </span>
                <CardTitle className="text-base">{q.question}</CardTitle>
                {submitted && (
                  isCorrect
                    ? <CheckCircle2 className="ml-auto h-5 w-5 text-green-600" />
                    : <XCircle className="ml-auto h-5 w-5 text-destructive" />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={String(userAnswer ?? '')}
                onValueChange={(v) => handleAnswer(q.id, Number(v))}
                className="space-y-2"
                disabled={submitted}
              >
                {q.options.map((opt: string, optIndex: number) => {
                  const isUserAnswer = userAnswer === optIndex;
                  const isCorrectAnswer = q.correct_answer === optIndex;
                  let className = '';
                  if (submitted) {
                    if (isCorrectAnswer) className = 'border-green-500 bg-green-50';
                    else if (isUserAnswer && !isCorrectAnswer) className = 'border-destructive bg-destructive/5';
                  }
                  return (
                    <div key={optIndex} className={`flex items-center gap-3 rounded-md border p-3 ${className}`}>
                      <RadioGroupItem value={String(optIndex)} id={`q-${q.id}-opt-${optIndex}`} />
                      <Label htmlFor={`q-${q.id}-opt-${optIndex}`} className="flex-1 cursor-pointer text-sm">
                        {opt}
                      </Label>
                    </div>
                  );
                })}
              </RadioGroup>
            </CardContent>
          </Card>
        );
      })}

      {!submitted ? (
        <Button onClick={handleSubmit} size="lg" disabled={saving || Object.keys(answers).length < questions.length}>
          Submit Quiz
        </Button>
      ) : (
        <p className="text-sm text-muted-foreground">
          Your result has been saved. You can view it in the Results page.
        </p>
      )}
    </div>
  );
}
