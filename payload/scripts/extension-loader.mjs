import { access, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";

async function exists(url) {
  try {
    await access(fileURLToPath(url));
    return true;
  } catch {
    return false;
  }
}

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith(".") && !/\.[a-z]+$/i.test(specifier)) {
    const baseUrl = new URL(specifier, context.parentURL);

    if (await exists(baseUrl)) {
      const information = await stat(fileURLToPath(baseUrl));

      if (information.isDirectory()) {
        const indexUrl = new URL(
          `${specifier.replace(/\/$/, "")}/index.js`,
          context.parentURL,
        );

        if (await exists(indexUrl)) {
          return nextResolve(indexUrl.href, context);
        }
      }
    }

    for (const extension of [".js", ".jsx"]) {
      const candidateUrl = new URL(`${specifier}${extension}`, context.parentURL);

      if (await exists(candidateUrl)) {
        return nextResolve(candidateUrl.href, context);
      }
    }
  }

  return nextResolve(specifier, context);
}
