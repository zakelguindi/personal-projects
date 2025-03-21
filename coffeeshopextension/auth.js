import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

// Auth state
let currentUser = null;

// Auth Functions
export async function signInWithGoogle() {
    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: chrome.runtime.getURL('popup.html')
            }
        });

        if (error) throw error;

        // The user will be redirected to Google's OAuth page
        // After successful authentication, they'll be redirected back to popup.html
        return { success: true, data };
    } catch (error) {
        console.error('Google sign in error:', error);
        return { success: false, error: error.message };
    }
}

export async function handleAuthCallback() {
    try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (session?.user) {
            // Check if user exists in users table
            const { data: existingUser, error: fetchError } = await supabase
                .from('users')
                .select('*')
                .eq('uuid', session.user.id)
                .single();

            if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

            if (!existingUser) {
                // Insert new user
                const { error: insertError } = await supabase
                    .from('users')
                    .insert([
                        {
                            uuid: session.user.id,
                            email: session.user.email,
                            project_id: process.env.PROJECT_ID
                        }
                    ]);

                if (insertError) throw insertError;
            }

            currentUser = session.user;
            return { success: true, user: session.user };
        }

        return { success: false, error: 'No session found' };
    } catch (error) {
        console.error('Auth callback error:', error);
        return { success: false, error: error.message };
    }
}

export async function signOut() {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        currentUser = null;
        return { success: true };
    } catch (error) {
        console.error('Sign out error:', error);
        return { success: false, error: error.message };
    }
}

export async function getCurrentUser() {
    try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        currentUser = user;
        return user;
    } catch (error) {
        console.error('Get current user error:', error);
        return null;
    }
}

// Database Functions
export async function saveLikedShop(placeId) {
    if (!currentUser) {
        console.error('No user logged in');
        return { success: false, error: 'User not authenticated' };
    }

    try {
        const { error } = await supabase
            .from('p2_responses')
            .insert([
                {
                    user_id: currentUser.id,
                    restaurant: `https://maps.googleapis.com/maps/place/?q=place_id:${placeId}`,
                    project_id: process.env.PROJECT_ID
                }
            ]);

        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('Save liked shop error:', error);
        return { success: false, error: error.message };
    }
}

// Background Task
export async function syncLikedShops(likedShops) {
    if (!currentUser) return;

    const promises = likedShops.map(shop => saveLikedShop(shop.place_id));
    
    try {
        await Promise.all(promises);
        console.log('Successfully synced liked shops');
    } catch (error) {
        console.error('Error syncing liked shops:', error);
    }
}

// Initialize auth state
export async function initializeAuth() {
    const user = await getCurrentUser();
    if (user) {
        currentUser = user;
    }
} 