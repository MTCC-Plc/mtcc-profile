import { assetPath } from "../../lib/asset-path";
import { imageRegistry } from "./registry";

/**
 * Resolve an "/assets/..." path to its built URL.
 *
 * SiteImage handles this for everything rendered through next/image. This is
 * for the few places that need a plain string instead — a raw <img>, or a
 * <video poster> — so they get the same content-hashed URL rather than a
 * public path that no longer exists.
 */
export function imageUrl(path: string) {
  return imageRegistry[path]?.src ?? assetPath(path);
}
