// Generates helpers (functions and hooks) for the API using templates in `templates`

import SwaggerParser from "@apidevtools/swagger-parser";
import type { AppRoute } from "@ts-rest/core";
import { isAppRouteMutation, isAppRouteNoBody } from "@ts-rest/core";
import fs from "fs";
import nunjucks from "nunjucks";
import { OpenAPIV3 as OpenAPI } from "openapi-types";
import { ZodObject } from "zod";
import { contract as apiContract } from "~/api/api_client.gen";

/**
 * The target location for the hooks
 */
const OUTPUT_HOOKS = "./src/api/api_hooks.gen.ts";
/**
 * The target location for the methods
 */
const OUTPUT_METHODS = "./src/api/api_methods.gen.ts";
/**
 * Location of the api-spec
 */
const API_SPEC = "../api/spec.yaml";

/**
 * The parsed API-Spec.
 * Assumes Version 3.
 */
const apiSpec = (await SwaggerParser.dereference(
  API_SPEC,
)) as OpenAPI.Document<{}>;

/**
 * Checks if the passed `operation` requires authentication
 *
 * Will throw an error if the operation could not be found.
 *
 * @param operation The operation-id to check
 * @returns whether authentication is required
 */
const requiresAuthentication = (operation: string): boolean => {
  const operationSpec = Object.values(apiSpec.paths)
    .filter((e) => !!e)
    .flatMap((e) => Object.values(OpenAPI.HttpMethods).map((m) => e?.[m]))
    .filter((e) => e?.operationId === operation)[0];
  if (!operationSpec)
    throw new Error(
      `Mismatch in API-spec: '${operation}' expected but not found.`,
    );
  return !!operationSpec.security && operationSpec.security.length > 0;
};

/**
 * Capitalizes the first character of a string.
 *
 * @param s The string to capitalize
 * @returns The passed string with the first char capitalized
 */
const capitalizeFirstChar = (s: string) =>
  s.length <= 0 ? "" : s[0].toUpperCase() + s.substring(1);

const mkDedup = () => {
  const cache: Record<string, number> = {};
  return (target: string[]) =>
    target.map((e) => {
      const num = cache[e] || 0;
      cache[e] = num + 1;
      return {
        original: e,
        deduplicated: num > 0 ? e + num : e,
      };
    });
};

/**
 * Extracts the keys from a `zod` {@link ZodObject | object}.
 * Will throw an error is not a {@link ZodObject} or `undefined.
 *
 * @param object The object to try to extract keys from.
 * @returns
 */
const objectKeys = (object: unknown) => {
  if (object === undefined) {
    return [];
  }
  if (object instanceof ZodObject) {
    return Object.keys(object.shape);
  }
  throw new Error("Tried to extract keys of non-object");
};

/**
 * The hook-definitions extracted from the API-contract and the API-spec.
 */
const apiDef = Object.entries(apiContract).map(([name, r]) => {
  const route = r as AppRoute;

  // Deduplication for hook-parameters
  const dedup = mkDedup();

  // Request body
  const hasBody = isAppRouteMutation(route) && !isAppRouteNoBody(route.body);
  if (hasBody)
    // reserve `body`-name
    dedup(["body"]);

  // Hook definition
  return {
    name: capitalizeFirstChar(name),
    function: name,
    params: dedup(
      // `ts-rest` extracts the parameters from the path _and_ the passed pathParams
      [
        ...new Set([
          ...(route.path.match(/:(\w*)/g) ?? []).map((p) => p.substring(1)),
          ...objectKeys(route.pathParams),
        ]),
      ],
    ),
    query: dedup(objectKeys(route.query)),
    body: hasBody,
    auth: requiresAuthentication(name),
  };
});

// Render the template
nunjucks.configure("templates", { autoescape: false });
const renderedHooks = nunjucks.render("api_hooks.ts.njk", { apiDef: apiDef });
const renderedMethods = nunjucks.render("api_methods.ts.njk", {
  apiDef: apiDef,
});

// Write the template to a the target
await fs.promises.writeFile(OUTPUT_HOOKS, renderedHooks);
await fs.promises.writeFile(OUTPUT_METHODS, renderedMethods);
