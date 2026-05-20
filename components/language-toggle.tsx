'use client';

import { LANGUAGES } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';

export function LanguageToggle() {
  const handleLanguageChange = (lang: string) => {
    // In a full implementation, this would update the locale
    console.log('Language changed to:', lang);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Globe className="h-4 w-4" />
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleLanguageChange('en')}>
          English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleLanguageChange('am')}>
          አማርኛ
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleLanguageChange('om')}>
          Afan Oromo
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
