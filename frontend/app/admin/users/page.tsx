'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { UserTable } from '@/components/admin/UserTable';
import { Card, CardContent } from '@/components/ui/card';
import { fetchUsers, fetchRoles, updateUserRole } from '@/lib/api/users';
import { useToast } from '@/hooks/use-toast';
import type { StrapiUser } from '@/types/user';

export default function AdminUsersPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<StrapiUser[]>([]);
  const [roles, setRoles] = useState<{ id: number; name: string; type: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [usersData, rolesData] = await Promise.all([fetchUsers(), fetchRoles()]);
      setUsers(usersData);
      setRoles(rolesData);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleRoleChange = async (userId: number, roleId: number) => {
    try {
      await updateUserRole(userId, roleId);
      toast({ title: 'Role updated successfully' });
      await load();
    } catch (e) {
      toast({
        title: 'Failed to update role',
        description: e instanceof Error ? e.message : 'Unknown error',
        variant: 'destructive',
      });
    }
  };

  return (
    <DashboardLayout allowedRoles={['admin']}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-muted-foreground">View all users and manage their roles</p>
        </div>

        {loading ? (
          <div className="h-64 animate-pulse rounded-lg bg-muted" />
        ) : error ? (
          <Card><CardContent className="py-4 text-destructive">{error}</CardContent></Card>
        ) : (
          <UserTable
            users={users}
            roles={roles}
            onRoleChange={handleRoleChange}
            currentUserId={user?.id}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
