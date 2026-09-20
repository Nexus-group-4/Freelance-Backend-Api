import bcrypt from 'bcrypt';

export function hashPassword(password: string): Promise<string>{
    return bcrypt.hash(password, 12);
};

export async function verifyPassword(password: string, hash: string): Promise<boolean>{
    try {
        return await bcrypt.compare(password, hash);
    } catch (error) {
        return false
    }
};