import { useState, useEffect } from 'react';

interface SessionData {
    username: string;
    roomId: string;
    expiresAt: number;
}

export const useSession = () => {
    const [sessionData, setSessionData] = useState<SessionData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const saveSession = (username: string, roomId: string) => {
        const session = {
            username,
            roomId,
            expiresAt: Date.now() + (60 * 60 * 1000) // 1 hour expiry
        };
        localStorage.setItem('chat_session', JSON.stringify(session));
        setSessionData(session);
    };

    const clearSession = () => {
        localStorage.removeItem('chat_session');
        setSessionData(null);
    };

    // Load session data from localStorage
    const loadSession = () => {
        const session = localStorage.getItem('chat_session');
        if (session) {
        try {
            const parsed = JSON.parse(session);
            if (parsed.expiresAt > Date.now()) {
                setSessionData(parsed);
                return parsed;
            } else {
                clearSession();
                return null;
            }
        } catch (error) {
            clearSession();
            return null;
        }
    }
    return null;
    };

    const checkSession = () => {
        const saved = localStorage.getItem('chat_session');
        if (saved) {
            try {
                const session = JSON.parse(saved);
                if (session.expiresAt > Date.now()) {
                    setSessionData(session);
                } else {
                    clearSession();
                }
            } catch (error) {
                clearSession();
            }
        }
        setIsLoading(false);
    };

    useEffect(() => {
        checkSession();
    }, []);

    return { sessionData, saveSession, clearSession, isLoading, checkSession, loadSession };
};