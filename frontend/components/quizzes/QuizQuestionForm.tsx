'use client';

import { useState } from 'react';
import type { QuizQuestion, QuizQuestionFormData } from '@/types/quiz-question';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Plus, Trash2, X } from 'lucide-react';

interface QuizQuestionFormProps {
  quizId: number;
  initialData?: QuizQuestion;
  onSubmit: (data: QuizQuestionFormData) => Promise<void>;
  submitLabel?: string;
  onCancel?: () => void;
}

export function QuizQuestionForm({ quizId, initialData, onSubmit, submitLabel = 'Save Question', onCancel }: QuizQuestionFormProps) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [question, setQuestion] = useState(initialData?.question || '');
  const [options, setOptions] = useState<string[]>(initialData?.options?.length ? initialData.options : ['', '']);
  const [correctAnswer, setCorrectAnswer] = useState(initialData?.correct_answer ?? 0);

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleRemoveOption = (index: number) => {
    if (options.length <= 2) return;
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
    if (correctAnswer >= newOptions.length) {
      setCorrectAnswer(newOptions.length - 1);
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) {
      setError('Question text is required');
      return;
    }
    if (options.some((o) => !o.trim())) {
      setError('All options must have text');
      return;
    }
    if (options.length < 2) {
      setError('At least 2 options are required');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onSubmit({
        question: question.trim(),
        options: options.map((o) => o.trim()),
        correct_answer: correctAnswer,
        quiz: quizId,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save question');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="question">Question *</Label>
        <Input
          id="question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Enter the question"
          required
        />
      </div>
      <div className="space-y-2">
        <Label>Options (select the correct answer)</Label>
        <RadioGroup
          value={String(correctAnswer)}
          onValueChange={(v) => setCorrectAnswer(Number(v))}
          className="space-y-2"
        >
          {options.map((opt, index) => (
            <div key={index} className="flex items-center gap-2">
              <RadioGroupItem value={String(index)} id={`opt-${index}`} />
              <Input
                value={opt}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                className="flex-1"
              />
              {options.length > 2 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveOption(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </RadioGroup>
        <Button type="button" variant="outline" size="sm" onClick={handleAddOption}>
          <Plus className="mr-1 h-3 w-3" />
          Add Option
        </Button>
      </div>
      <div className="flex gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? 'Saving...' : submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
