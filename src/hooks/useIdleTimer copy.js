import { useEffect, useRef, useState, useCallback } from "react";

const WARNING_AFTER_MS = 5 * 60 * 1000;        // 5 dk hareketsizlik -> uyarı göster
const LOGOUT_AFTER_WARNING_MS = 2 * 60 * 1000;  // uyarıdan 2 dk sonra -> logout
const ACTIVITY_EVENTS = ["mousemove", "keydown", "click", "scroll", "touchstart"];
const LAST_ACTIVITY_KEY = "arierp_last_activity";

export function useIdleTimer(onLogout) {
  const [showWarning, setShowWarning] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const warnTimerRef = useRef(null);
  const logoutTimerRef = useRef(null);
  const countdownIntervalRef = useRef(null);
  const extendSessionRef = useRef(() => {});

  useEffect(() => {
    function clearTimers() {
      clearTimeout(warnTimerRef.current);
      clearTimeout(logoutTimerRef.current);
      clearInterval(countdownIntervalRef.current);
    }

    function startLogoutCountdown() {
      setShowWarning(true);
      setRemainingSeconds(LOGOUT_AFTER_WARNING_MS / 1000);

      // Uyarı gösterildikten sonra pasif hareketler artık saymasın,
      // sadece "devam et" butonu (extendSession) sayar.
      ACTIVITY_EVENTS.forEach((ev) => window.removeEventListener(ev, resetTimer));

      countdownIntervalRef.current = setInterval(() => {
        setRemainingSeconds((s) => Math.max(s - 1, 0));
      }, 1000);

      logoutTimerRef.current = setTimeout(onLogout, LOGOUT_AFTER_WARNING_MS);
    }

    function resetTimer() {
      localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
      clearTimers();
      setShowWarning(false);
      warnTimerRef.current = setTimeout(startLogoutCountdown, WARNING_AFTER_MS);
    }

    function attachActivityListeners() {
      ACTIVITY_EVENTS.forEach((ev) => window.addEventListener(ev, resetTimer, { passive: true }));
    }

    function handleStorage(e) {
      if (e.key === LAST_ACTIVITY_KEY) resetTimer();
    }

    attachActivityListeners();
    window.addEventListener("storage", handleStorage);
    resetTimer();

    // Modal'daki "Oturumu Devam Ettir" butonu bunu çağırır
    extendSessionRef.current = () => {
      attachActivityListeners();
      resetTimer();
    };

    return () => {
      ACTIVITY_EVENTS.forEach((ev) => window.removeEventListener(ev, resetTimer));
      window.removeEventListener("storage", handleStorage);
      clearTimers();
    };
  }, [onLogout]);

  const extendSession = useCallback(() => extendSessionRef.current(), []);

  return { showWarning, remainingSeconds, extendSession };
}

export default useIdleTimer;