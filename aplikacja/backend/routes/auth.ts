import express, { Request, Response, NextFunction } from 'express';
const router = express.Router();

const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
};

interface Session {
    username: string;
    loginTime: Date;
    isAdmin: boolean;
}

const sessions = new Map<string, Session>();

function generateSessionToken(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

router.post('/login', (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                error: 'Validation Error',
                message: 'Username and password are required'
            });
        }

        if (username !== ADMIN_CREDENTIALS.username || password !== ADMIN_CREDENTIALS.password) {
            return res.status(401).json({
                error: 'Authentication Failed',
                message: 'Invalid username or password'
            });
        }

        const sessionToken = generateSessionToken();
        sessions.set(sessionToken, {
            username: username,
            loginTime: new Date(),
            isAdmin: true
        });

        res.json({
            success: true,
            message: 'Login successful',
            sessionToken: sessionToken,
            user: {
                username: username,
                isAdmin: true
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Login failed'
        });
    }
});

router.post('/logout', (req: Request, res: Response) => {
    try {
        const sessionToken = req.headers['authorization']?.replace('Bearer ', '');

        if (sessionToken && sessions.has(sessionToken)) {
            sessions.delete(sessionToken);
        }

        res.json({
            success: true,
            message: 'Logout successful'
        });

    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Logout failed'
        });
    }
});

router.get('/verify', (req: Request, res: Response) => {
    try {
        const sessionToken = req.headers['authorization']?.replace('Bearer ', '');

        if (!sessionToken) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'No session token provided'
            });
        }

        const session = sessions.get(sessionToken);

        if (!session) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'Invalid or expired session'
            });
        }

        res.json({
            valid: true,
            user: {
                username: session.username,
                isAdmin: session.isAdmin
            }
        });

    } catch (error) {
        console.error('Verify error:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Verification failed'
        });
    }
});

interface AuthenticatedRequest extends Request {
    session?: Session;
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
    const sessionToken = req.headers['authorization']?.replace('Bearer ', '');

    if (!sessionToken || !sessions.has(sessionToken)) {
        return res.status(401).json({
            error: 'Unauthorized',
            message: 'Authentication required'
        });
    }

    next();
}

export default router;
