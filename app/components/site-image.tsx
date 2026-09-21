import NextImage, { type ImageProps } from "next/image";
import { assetPath } from "../../lib/asset-path";
import { imageRegistry } from "../assets/registry";

/**
 * Every image on the site goes through here.
 *
 * Images live in app/assets and are imported as modules, so Next emits them
 * with a content hash in the filename. That is what keeps a replaced picture
 * from being served stale: change the file, the URL changes with it.
 *
 * Callers still pass the familiar "/assets/..." string — this resolves it
 * through the registry. Anything not registered (the HLS poster, files that
 * have to stay in public/) falls back to the plain public path.
 */
export default function SiteImage({ src, ...props }: ImageProps) {
  if (typeof src !== "string") return <NextImage {...props} src={src} />;

  const imported = imageRegistry[src];
  if (imported) return <NextImage {...props} src={imported} />;

  return <NextImage {...props} src={assetPath(src)} />;
}
