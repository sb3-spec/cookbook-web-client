let devModeFrontEnd = true;
let devModeBackend = false;

export const frontendHost = devModeFrontEnd ? 'http://localhost:5173/' : 'http://localhost:5173/';
export const backendHost = devModeBackend ? 'http://localhost:8080/' : 'https://cookbookapi-production.up.railway.app/';