import { useUIStore } from '@/store/uiStore';

export function useDirection(): 'rtl' | 'ltr' {
  return useUIStore((state) => state.direction);
}
