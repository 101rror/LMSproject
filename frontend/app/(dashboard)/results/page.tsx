'use client';

import { useAuth } from '@/hooks/useAuth';
import { useResults } from '@/hooks/useResults';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award } from 'lucide-react';

export default function ResultsPage() {
  const { user } = useAuth();
  const { results, loading, error } = useResults(user?.id ?? null);

  return (
    <DashboardLayout allowedRoles={['student']}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">My Results</h1>
          <p className="text-muted-foreground">Your quiz results and scores</p>
        </div>

        {loading ? (
          <div className="h-64 animate-pulse rounded-lg bg-muted" />
        ) : error ? (
          <Card><CardContent className="py-4 text-destructive">{error}</CardContent></Card>
        ) : results.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center py-12 text-center">
              <Award className="mb-3 h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">You haven&apos;t taken any quizzes yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Quiz</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Percentage</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((r) => {
                  const pct = r.total_questions > 0 ? Math.round((r.score / r.total_questions) * 100) : 0;
                  return (
                    <TableRow key={r.documentId || r.id}>
                      <TableCell className="font-medium">{r.quiz?.title || 'Unknown Quiz'}</TableCell>
                      <TableCell className="text-muted-foreground">{r.quiz?.course?.title || '-'}</TableCell>
                      <TableCell>
                        <span className="font-semibold">{r.score}</span> / {r.total_questions}
                      </TableCell>
                      <TableCell>
                        <Badge variant={pct >= 70 ? 'default' : pct >= 40 ? 'secondary' : 'destructive'}>
                          {pct}%
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '-'}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
