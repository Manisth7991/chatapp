import { format, isToday, isYesterday, isThisWeek, differenceInMinutes } from 'date-fns';

export const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);

    if (isToday(date)) {
        return format(date, 'HH:mm');
    } else if (isYesterday(date)) {
        return 'Yesterday';
    } else if (isThisWeek(date)) {
        return format(date, 'EEEE');
    } else {
        return format(date, 'dd/MM/yyyy');
    }
};

export const formatFullDate = (timestamp) => {
    return format(new Date(timestamp), 'MMMM d, yyyy');
};

export const shouldShowTimestamp = (currentMessage, previousMessage) => {
    if (!previousMessage) return true;

    const timeDifference = differenceInMinutes(
        new Date(currentMessage.timestamp),
        new Date(previousMessage.timestamp)
    );

    return timeDifference > 5; // Show timestamp if messages are more than 5 minutes apart
};

export const generateMessageId = () => {
    return `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const truncateText = (text, maxLength = 50) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

export const getInitials = (name) => {
    if (!name) return 'U';
    return name
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .substring(0, 2);
};

export const formatPhoneNumber = (phoneNumber) => {
    // Simple phone number formatting
    if (!phoneNumber) return '';

    const cleaned = phoneNumber.replace(/\D/g, '');

    if (cleaned.length >= 10) {
        return `+${cleaned}`;
    }

    return phoneNumber;
};
