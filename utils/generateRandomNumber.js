
export function generateRandomId(min, max) {
    const randomId = Math.random() * (max - min) + min;
    return parseInt(randomId);
}
