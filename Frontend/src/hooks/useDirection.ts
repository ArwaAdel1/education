import { useAppSelector } from '@/store/hooks';

export function useDirection() {
  return useAppSelector((state) => state.ui.direction);
}
