import { useState, useEffect, useRef } from 'react';

export const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

export const useAutoResize = (textareaRef, maxHeight = 150) => {
    useEffect(() => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const adjustHeight = () => {
            textarea.style.height = 'auto';
            const newHeight = Math.min(textarea.scrollHeight, maxHeight);
            textarea.style.height = `${newHeight}px`;
        };

        textarea.addEventListener('input', adjustHeight);

        // Initial adjustment
        adjustHeight();

        return () => {
            textarea.removeEventListener('input', adjustHeight);
        };
    }, [textareaRef, maxHeight]);
};

export const useTypingIndicator = (onTypingChange, delay = 1000) => {
    const [isTyping, setIsTyping] = useState(false);
    const timeoutRef = useRef(null);

    const handleTyping = () => {
        if (!isTyping) {
            setIsTyping(true);
            onTypingChange(true);
        }

        // Clear existing timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Set new timeout
        timeoutRef.current = setTimeout(() => {
            setIsTyping(false);
            onTypingChange(false);
        }, delay);
    };

    const stopTyping = () => {
        setIsTyping(false);
        onTypingChange(false);
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    };

    return { isTyping, handleTyping, stopTyping };
};

export const useLocalStorage = (key, initialValue) => {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    });

    const setValue = (value) => {
        try {
            setStoredValue(value);
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(`Error setting localStorage key "${key}":`, error);
        }
    };

    return [storedValue, setValue];
};
