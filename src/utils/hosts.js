let devModeFrontEnd = false;
let devModeBackend = false;

export const frontendHost = devModeFrontEnd ? 'http://localhost:5173/' : 'https://frolicking-longma-9776b7.netlify.app/';
export const backendHost = devModeBackend ? 'http://localhost:8080/' : 'https://cookbookapi-production.up.railway.app/';