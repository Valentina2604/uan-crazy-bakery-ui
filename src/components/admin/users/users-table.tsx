'use client';

import { useState } from 'react';
import { User } from '@/lib/types/user';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getDictionary } from '@/lib/get-dictionary';
import { DeleteUserDialog } from './delete-user-dialog';
import { useToast } from '@/components/ui/use-toast';
import { deleteUser } from '@/lib/api';
import { EditUserDialog } from './edit-user-dialog';

interface UsersTableProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  itemsPerPage?: number;
  dictionary: Awaited<ReturnType<typeof getDictionary>>["adminUsersPage"]["usersTable"];
  lang: string;
}

export function UsersTable({
  users,
  setUsers,
  itemsPerPage = 10,
  dictionary,
  lang,
}: UsersTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  const totalPages = Math.ceil(users.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser(userId);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      toast({
        title: dictionary.toast.success.title,
        description: dictionary.toast.success.description,
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        variant: 'destructive',
        title: dictionary.toast.error.title,
        description: dictionary.toast.error.description,
      });
    }
  };

  const handleUserUpdated = (updatedUser: User) => {
    setUsers((prevUsers) => prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user)));
    // Also update the user in the main list if it exists there
  };

  const paginatedUsers = users.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{dictionary.headers.name}</TableHead>
              <TableHead>{dictionary.headers.email}</TableHead>
              <TableHead>{dictionary.headers.role}</TableHead>
              <TableHead className="text-right">{dictionary.headers.actions}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUsers.length > 0 ? (
              paginatedUsers.map((user) => (
                <TableRow key={user.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">
                    {user.nombre} {user.apellido}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{user.tipo}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <EditUserDialog
                      user={user}
                      dictionary={dictionary.editUser}
                      onUserUpdated={handleUserUpdated}
                    />
                    <DeleteUserDialog
                      userName={`${user.nombre} ${user.apellido}`}
                      dictionary={dictionary.deleteUserDialog}
                      onDelete={() => handleDeleteUser(user.id)}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {totalPages > 1 && (
        <div className="flex justify-end items-center mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            {dictionary.pagination.previous}
          </Button>
          <span className="mx-2 text-sm">
            {dictionary.pagination.page
              .replace("{currentPage}", currentPage.toString())
              .replace("{totalPages}", totalPages.toString())}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            {dictionary.pagination.next}
          </Button>
        </div>
      )}
    </div>
  );
}
