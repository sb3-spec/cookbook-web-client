export function grabItemNumber(id) {
    
    if (typeof id !== "string") {
        return
    }

    return Number(id.split("-").slice(-1))
}