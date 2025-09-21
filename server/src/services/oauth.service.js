import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as LinkedInStrategy } from 'passport-linkedin-oauth2';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

// Configure Google OAuth Strategy (only if credentials are provided)
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:5000/api/auth/google/callback"
    }, async (accessToken, refreshToken, profile, done) => {
    try {
        // Check if user already exists
        let user = await prisma.user.findUnique({
            where: { email: profile.emails[0].value }
        });

        if (user) {
            // Update user with Google info if needed
            if (!user.googleId) {
                user = await prisma.user.update({
                    where: { id: user.id },
                    data: { googleId: profile.id }
                });
            }
        } else {
            // Create new user
            user = await prisma.user.create({
                data: {
                    email: profile.emails[0].value,
                    name: profile.displayName,
                    googleId: profile.id,
                    isVerified: true, // Google users are pre-verified
                    profilePicture: profile.photos[0]?.value,
                    passwordHash: null // OAuth users don't need a password
                }
            });
        }

        return done(null, user);
    } catch (error) {
        console.error('Google OAuth error:', error);
        return done(error, null);
    }
    }));
} else {
    console.log('Google OAuth not configured - skipping Google strategy');
}

// Configure LinkedIn OAuth Strategy (only if credentials are provided)
if (process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET) {
    passport.use(new LinkedInStrategy({
    clientID: process.env.LINKEDIN_CLIENT_ID,
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    callbackURL: process.env.LINKEDIN_CALLBACK_URL || "http://localhost:5000/api/auth/linkedin/callback",
    scope: ['openid', 'profile', 'email']
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Check if user already exists
        let user = await prisma.user.findUnique({
            where: { email: profile.emails[0].value }
        });

        if (user) {
            // Update user with LinkedIn info if needed
            if (!user.linkedinId) {
                user = await prisma.user.update({
                    where: { id: user.id },
                    data: { linkedinId: profile.id }
                });
            }
        } else {
            // Create new user
            user = await prisma.user.create({
                data: {
                    email: profile.emails[0].value,
                    name: profile.displayName,
                    linkedinId: profile.id,
                    isVerified: true, // LinkedIn users are pre-verified
                    profilePicture: profile.photos[0]?.value,
                    passwordHash: null // OAuth users don't need a password
                }
            });
        }

        return done(null, user);
    } catch (error) {
        console.error('LinkedIn OAuth error:', error);
        return done(error, null);
    }
    }));
} else {
    console.log('LinkedIn OAuth not configured - skipping LinkedIn strategy');
}

// Debug: Log registered strategies
console.log('Registered Passport strategies:', Object.keys(passport._strategies));

// Serialize user for session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id }
        });
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

// Generate JWT token for OAuth users
export const generateOAuthToken = (user) => {
    return jwt.sign(
        { 
            userId: user.id, 
            email: user.email,
            name: user.name 
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
};

export default passport;
