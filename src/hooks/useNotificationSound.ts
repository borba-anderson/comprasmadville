import { useCallback, useRef } from 'react';

// Base64 encoded short notification sound (a simple ding)
const NOTIFICATION_SOUND_BASE64 = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbsGkoGiGGsNfn1FkrDSVtq+by2VMjDz+Ou+Pc0lMjEEOUxeHX0lglEkSYyOHW0FknE0WayuLYzlYnFEicyuPazVQnFUqdyOTbzVMnFkqeyuXazFInF0ueyufbzFEnGEufyubazVInGEufyubazVInGEufyubazVInGEufyubazVInGEufyubazVInGEufyubazVInGEufyubazVInGEufyubazVInGEufyubazVInGEufyubazVInGEufyubazVInGEufyubazVInGEufyubazVInGEufyubazVInGEufyubazVInGEufyubazVInGEufyubazVInGEufyubazVInGEufyubazVInGEufyubazVInGEufyubazVInGEufyubazVInGEufyubazVInGEufyubazVInGEufyubazVInGEufyubazVInGEufyubazVInGEufyubazVInGEufyubazVInGEufyubazVInGEufyubazVInGEufyubazVInGEufyubazVInGEufyubazVInGEufyubazVImF0qeyeXaylEmF0qeyeXaylEmF0qeyeXaylEmF0qeyeXaylEmF0qeyeXaylEmF0qeyeXaylEmF0qeyeXaylEmFkmeyOTaylAmFUmdx+PZxk8lE0ibxuLXxEwjEUaYw9/UwkkhD0OUv9zRvkUeDkCPutjOuUEbCzuKtdTKtD0YCC+ErdDGrjkTBCp+p8zCqTQPACV4ocjAmzILARxxm8S+mC0HABprlsC8lCkEABZmkcG4kScDABRjj726jyQBABJhi7y3jSIAABFfib25jCEAABBehr25iyAAABBehr25iyAAABBehr25iyAAABBehr25iyAAABBehr25iyAAABBehr25iyAAABBehr25iyAAABBehr25iyAAABBehr25iyAAABBehr25iyAAABBehr25iyAAABBehr25iyAAABBehr25iyAAABBehr25iyAAABBehr25iyAAABBehr25iyAAABBehr25iyAAABBehr25iyAAABBehr25iyAAABBehr25iyAAABBehr25iyAAABBehr25iyAAABBehr25iyAAABBehr25iyAAABBehr25iyAAABBehr25iyAAABBehr25iyAAABBehr25iyAAABBehr25iyAAABBehr25iyAAABBehr25iyAAABBehr25iyAAABBehr25iyAAABBehr25iyAAABBehr25iyAAABBehr25iyAAABBehr25iyAAABBehr25iyAAABBehr25iyAAABBehr25iyAAABBehr25iyAAABBehr25iyAAABBehr25iyAAABBehr25iyAAABBehr25iyAAABBehr25iyAAABBehr25iyAAABBehr25iyAAABBehr25iyAAABBehr25iyAAABBehr25iyAAABBehr25iyAAABBehr25iyAAABBehr25iyAAABBehr25iyAAABBehr25iyAAABBehr25iyAAABBehr25iyAAABBehr25iyAAABBehr25iyAAABBehr25iyAAABBehr25iyAAABBehr25iyAAABBehr25iyAAABBehr25iyAAABBehr25iyAAABBehr25iyAAABBehr25iyAAABBehr25iyAAABBehr25iyAAABBehr25iyAAABBehr25iyAAABBehr25iyAA';

export function useNotificationSound() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastPlayedRef = useRef<number>(0);

  const playNotificationSound = useCallback(() => {
    // Debounce: prevent playing multiple times within 1 second
    const now = Date.now();
    if (now - lastPlayedRef.current < 1000) {
      return;
    }
    lastPlayedRef.current = now;

    try {
      // Create audio element if not exists
      if (!audioRef.current) {
        audioRef.current = new Audio(NOTIFICATION_SOUND_BASE64);
        audioRef.current.volume = 0.5;
      }
      
      // Reset and play
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((err) => {
        // Ignore autoplay errors (user needs to interact with page first)
        console.log('[NotificationSound] Could not play sound:', err.message);
      });
    } catch (error) {
      console.error('[NotificationSound] Error playing sound:', error);
    }
  }, []);

  return { playNotificationSound };
}
