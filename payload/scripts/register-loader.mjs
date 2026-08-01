import { register } from "node:module";
import { pathToFileURL } from "node:url";

register("./scripts/extension-loader.mjs", pathToFileURL("./"));
