export const isPreviewEnv = () => {
    // Check for VERCEL_ENV environment variable set during build
    if (typeof process !== 'undefined' && process.env && process.env.VERCEL_ENV === 'preview') {
        return true;
    }

    // Fallback: Check hostname for Vercel preview patterns
    // Preview URLs typically look like: project-name-git-branch-username.vercel.app
    // Production URLs are usually project-name.vercel.app or custom domains
    if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        return hostname.includes('-git-') || (hostname.includes('.vercel.app') && !hostname.includes('menu-production')); // Adjust 'menu-production' if known
    }

    return false;
};

export const getProductionUrl = () => {
    // Replace with your actual production URL
    return 'https://menu-app.vercel.app';
};
