/** Public assets need the repository prefix on GitHub Pages. */
export function assetPath(path: string): string {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return path.startsWith("/") && !path.startsWith("//") && !path.startsWith(`${basePath}/`) ? `${basePath}${path}` : path;
}
