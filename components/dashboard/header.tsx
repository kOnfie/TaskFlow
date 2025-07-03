'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Search, Bell, Plus, Filter } from 'lucide-react';

interface HeaderProps {
  title: string;
  showSearch?: boolean;
  showAddButton?: boolean;
  onAddClick?: () => void;
}

export function Header({ title, showSearch = true, showAddButton = true, onAddClick }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left side - Title and Search */}
        <div className="flex items-center gap-4 flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          
          {showSearch && (
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-96"
              />
            </div>
          )}
        </div>

        {/* Right side - Actions and Profile */}
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" className="relative">
            <Filter className="h-4 w-4" />
          </Button>

          {showAddButton && (
            <Button onClick={onAddClick} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Task
            </Button>
          )}

          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-4 w-4" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
              3
            </Badge>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">John Doe</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    john.doe@example.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}