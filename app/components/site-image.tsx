import NextImage, { type ImageProps } from "next/image";
import { assetPath } from "../../lib/asset-path";

export default function SiteImage({ src, ...props }: ImageProps) {
  return <NextImage {...props} src={typeof src === "string" ? assetPath(src) : src} />;
}
