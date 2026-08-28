'use client';

import type { StrapiUser } from '@/types/user';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { getUserRoleName } from '@/lib/api/users';

interface UserTableProps {
  users: StrapiUser[];
  roles: { id: number; name: string; type: string }[];
  onRoleChange: (userId: number, roleId: number) => void;
  currentUserId?: number;
}

export function UserTable({ users, roles, onRoleChange, currentUserId }: UserTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Username</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Current Role</TableHead>
            <TableHead>Change Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => {
            const currentRoleId = Array.isArray(user.role) ? user.role[0]?.id : user.role?.id;
            const isSelf = user.id === currentUserId;
            return (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  {user.username}
                  {isSelf && <Badge variant="secondary" className="ml-2">You</Badge>}
                </TableCell>
                <TableCell className="text-muted-foreground">{user.email}</TableCell>
                <TableCell>
                  <Badge variant="outline">{getUserRoleName(user)}</Badge>
                </TableCell>
                <TableCell>
                  <Select
                    value={String(currentRoleId ?? '')}
                    onValueChange={(v) => onRoleChange(user.id, Number(v))}
                    disabled={isSelf}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((r) => (
                        <SelectItem key={r.id} value={String(r.id)}>
                          {r.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
