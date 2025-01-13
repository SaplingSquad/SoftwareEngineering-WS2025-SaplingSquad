import fs from "fs";
import { generateContract } from "@openapi-ts-rest/core";

// Paths (relative to project root)
const API_SPEC = "../api/spec.yaml";
const API_CLIENT_TARGET = "./src/api/api_client.gen.ts";

await generateContract({ openApi: API_SPEC })
  // Don't have additional properties of type `unknown`.
  // `openapi-ts-rest` allows disabling this by setting `strict`-mode, though this is not exposed here.
  .then((api) => api.replaceAll(".passthrough()", ""))
  .then((api) => fs.promises.writeFile(API_CLIENT_TARGET, api));
