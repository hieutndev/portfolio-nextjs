export function emailMasking(email: string): string {
    if (!email.includes('@')) {
        throw new Error('Invalid email');
    }

    const [localPart, ...domainParts] = email.split('@', 2);
    const domain = domainParts.join('@');

    let maskedLocal;
    if (localPart.length > 2) {
        maskedLocal = localPart.substring(0, 2) + '**';
    } else {
        maskedLocal = localPart; // Keep original if too short
    }

    return maskedLocal + '@' + domain;
}

// String utilities
export function generateUniqueString(size: number = 32): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < size; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}