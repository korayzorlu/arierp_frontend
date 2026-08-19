import React, { useCallback, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setIdleWarningDialog } from 'store/slices/notificationSlice';

const IDLE_TIMEOUT = 5 * 60 * 1000;   // 5 dk - dialog açılana kadar
const WARNING_TIMEOUT = 2 * 60 * 1000; // 2 dk - dialog açıldıktan sonra logout'a kadar

const ACTIVITY_EVENTS = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart'];

function useIdleTimer({onIdle, onLogout}) {
    const {idleWarningDialog} = useSelector((store) => store.notification);

    const dispatch = useDispatch();

    

    const idleTimerRef = useRef(null);
    const logoutTimerRef = useRef(null);

    const clearTimers = () => {
        clearTimeout(idleTimerRef.current);
        clearTimeout(logoutTimerRef.current);
    };

    const startIdleTimer = useCallback(() => {
        idleTimerRef.current = setTimeout(() => {
            dispatch(setIdleWarningDialog(true));
            onIdle(); // dialog'u aç

            logoutTimerRef.current = setTimeout(() => {
                onLogout(); // 2 dk daha geçti, oturumu kapat
            }, WARNING_TIMEOUT);
        }, IDLE_TIMEOUT);
    }, [onIdle, onLogout]);

    const resetTimer = useCallback(() => {
        // Dialog açıkken sıradan mouse/scroll hareketleri sayılmasın,
        // sadece kullanıcı dialog'u kapatınca (explicit reset) resetlensin
        if (idleWarningDialog) return;

        clearTimers();
        startIdleTimer();
    }, [startIdleTimer]);

    // Dialog kapatıldığında dışarıdan çağrılacak "tam reset"
    const forceReset = useCallback(() => {
        dispatch(setIdleWarningDialog(false));
        clearTimers();
        startIdleTimer();
    }, [startIdleTimer]);

    useEffect(() => {
        ACTIVITY_EVENTS.forEach(evt => window.addEventListener(evt, resetTimer));
        startIdleTimer();

        return () => {
            ACTIVITY_EVENTS.forEach(evt => window.removeEventListener(evt, resetTimer));
            clearTimers();
        };
    }, [resetTimer, startIdleTimer]);

    return { forceReset };
}

export default useIdleTimer
