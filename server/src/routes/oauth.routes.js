import { Router } from 'express';
import passport from '../services/oauth.service.js';
import { generateOAuthToken } from '../services/oauth.service.js';

const router = Router();

// Google OAuth routes (only if configured)
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    router.get('/google', passport.authenticate('google', {
        scope: ['profile', 'email']
    }));
}

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    router.get('/google/callback', 
        passport.authenticate('google', { failureRedirect: '/login' }),
        (req, res) => {
            try {
                const token = generateOAuthToken(req.user);
                // Redirect to frontend with token
                res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/callback?token=${token}&provider=google`);
            } catch (error) {
                console.error('Google OAuth callback error:', error);
                res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=oauth_failed`);
            }
        }
    );
}

// LinkedIn OAuth routes (only if configured)
if (process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET) {
    router.get('/linkedin', passport.authenticate('linkedin'));

    router.get('/linkedin/callback',
        passport.authenticate('linkedin', { failureRedirect: '/login' }),
        (req, res) => {
            try {
                const token = generateOAuthToken(req.user);
                // Redirect to frontend with token
                res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/callback?token=${token}&provider=linkedin`);
            } catch (error) {
                console.error('LinkedIn OAuth callback error:', error);
                res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=oauth_failed`);
            }
        }
    );
}

export default router;
