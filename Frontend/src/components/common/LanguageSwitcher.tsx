import { Languages } from 'lucide-react';
import { useUIStore } from '@/store/uiStore';
import { Button } from '@/components/ui';

export function LanguageSwitcher() {
  const language = useUIStore((state) => state.language);
  const setLanguage = useUIStore((state) => state.setLanguage);

  const nextLanguage = language === 'ar' ? 'en' : 'ar';
  // Show the label of the OTHER language (the one we'd switch to).
  const label = nextLanguage === 'ar' ? 'العربية' : 'English';

  return (
    <Button variant="ghost" size="sm" onClick={() => setLanguage(nextLanguage)}>
      <Languages size={18} />
      <span>{label}</span>
    </Button>
  );
}
