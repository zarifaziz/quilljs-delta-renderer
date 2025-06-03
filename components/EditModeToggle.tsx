'use client';

import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface EditModeToggleProps {
  isEditable: boolean;
  onToggle: () => void;
  className?: string;
}

export function EditModeToggle({ isEditable, onToggle, className = '' }: EditModeToggleProps) {
  return (
    <TooltipProvider>
      <div className={`flex items-center space-x-2 ${className}`}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-mode"
                checked={isEditable}
                onCheckedChange={onToggle}
              />
              <Label htmlFor="edit-mode" className="text-sm font-medium cursor-pointer">
                {isEditable ? 'Edit Mode' : 'Read-Only Mode'}
              </Label>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              {isEditable 
                ? 'Switch to read-only mode to view rendered content (Ctrl+E)' 
                : 'Switch to edit mode to modify Delta JSON (Ctrl+E)'
              }
            </p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
} 