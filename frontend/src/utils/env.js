export const isPreviewEnv = () => {
    // Check for VERCEL_ENV environment variable set during build
    if (import.meta.env.VITE_VERCEL_ENV === 'preview') {
        return true;
    }

    // Fallback: Check hostname for Vercel preview patterns
    // Preview URLs typically look like: project-name-git-branch-username.vercel.app
    // Production URLs are usually project-name.vercel.app or custom domains
    if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        return hostname.includes('-git-');
    }

    return false;
};

export const isVercelDomain = () => {
    if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        return hostname.includes('vercel.app');
    }
    return false;
};

export const getProductionUrl = () => {
    // Replace with your actual production URL
    return 'https://mu-menu.in';
};
