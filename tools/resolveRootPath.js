import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __root = resolve(dirname(__filename), "..");


export function resolveRootPath(relativePath) {
    return resolve(__root, relativePath);
}
