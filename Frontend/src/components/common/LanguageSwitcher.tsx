import { Languages } from 'lucide-react';
import { setLanguage } from '@/store/slices/uiSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { Button } from '@/components/ui';

export function LanguageSwitcher() {
  const dispatch = useAppDispatch();
  const language = useAppSelector((state) => state.ui.language);

  const nextLanguage = language === 'ar' ? 'en' : 'ar';
  // Show the label of the OTHER language (the one we'd switch to).
  const label = nextLanguage === 'ar' ? 'العربية' : 'English';

  return (
    <Button variant="ghost" size="sm" onClick={() => dispatch(setLanguage(nextLanguage))}>
      <Languages size={18} />
      <span>{label}</span>
    </Button>
  );
}
