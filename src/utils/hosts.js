const SiteState = Object.freeze({
    DEV:   Symbol("dev"),
    PROD:  Symbol("prod"),
});

let frontendState = SiteState.PROD;
let backendState = SiteState.PROD;

export const frontendHost = frontendState === SiteState.DEV ? 'http://localhost:5173/' : 'https://digital-parsley.netlify.app/';
export const backendHost = backendState === SiteState.DEV ? 'http://localhost:8080/' : 'https://cookbookapi-production.up.railway.app/';