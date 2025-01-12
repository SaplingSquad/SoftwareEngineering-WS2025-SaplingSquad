import type { JSXOutput, PropsOf, QRL, ResourceReturn } from "@builder.io/qwik";
import { $, component$, Resource } from "@builder.io/qwik";
import type {
  ErrorHttpStatusCode,
  HTTPStatusCode,
  SuccessfulHttpStatusCode,
} from "@ts-rest/core";
import { FromQrl } from "./from_qrl";
import { HiExclamationCircleOutline } from "@qwikest/icons/heroicons";

/**
 * Headers of a request
 */
type Headers = Record<string, string>;

/**
 * The response of a request
 */
type RequestResponse<status extends HTTPStatusCode, Body> = {
  status: status;
  headers: Headers;
  body: Body;
};

/**
 * A generic request response filled with any status code and any body
 */
type GenericRequestResponse = RequestResponse<HTTPStatusCode, any>;

/**
 * Gets the body of a `Response` by the specified `status`
 */
type BodyOfStatus<
  status extends HTTPStatusCode,
  Response extends GenericRequestResponse,
> = Response extends RequestResponse<status, infer Body> ? Body : never;

/**
 * Gets all status codes that can be returned from the passed `Response`
 */
type StatusCodes<Response extends GenericRequestResponse> = {
  [status in HTTPStatusCode]: BodyOfStatus<status, Response> extends never
    ? never
    : status;
}[HTTPStatusCode];

/**
 * Gets the handlers
 * ({@link QRL}s taking the `body` and the {@link Headers} and returning some {@link JSXOutput})
 * for the passed `Response`,
 * optionally limited to the passed `LimitCodes` of status codes.
 */
type StatusHandlers<
  Response extends GenericRequestResponse,
  LimitCodes extends HTTPStatusCode = HTTPStatusCode,
> = {
  [A in StatusCodes<Response> & LimitCodes as `on${A}$`]: BodyOfStatus<
    A,
    Response
  > extends never
    ? never
    : QRL<(body: BodyOfStatus<A, Response>, headers: Headers) => JSXOutput>;
};

/**
 * Gets the handlers for the {@link ApiResponse}:
 *
 * All possible success responses must be handled.
 * For error responses,
 * either all must be handled,
 * or a default handler must be provided.
 */
type ApiResponseHandlers<Response extends GenericRequestResponse> =
  | (StatusHandlers<Response, SuccessfulHttpStatusCode> &
      Partial<StatusHandlers<Response, ErrorHttpStatusCode>> & {
        defaultError$: QRL<(status: ErrorHttpStatusCode) => JSXOutput>;
      })
  | (StatusHandlers<Response, SuccessfulHttpStatusCode> &
      StatusHandlers<Response, ErrorHttpStatusCode>);

/**
 * Renders a component based on the `response`'s status-code.
 *
 * Provide the response in `response`,
 * {@link QRL}s for the handlers in `on<code>$`,
 * and a default-error-handler in `defaultError$`
 * if not all error-status-codes are to be handled individually.
 */
export const ApiResponse = component$(
  <Response extends GenericRequestResponse>(
    props: ApiResponseHandlers<Response> & {
      response: Response;
    },
  ) => {
    const { status, body, headers } = props.response;
    // Need to cast to `any` as the types only become meaningful with a fixed response
    const handler = (props as any)[`on${status}$`];
    const defaultErrorHandler = (props as any).defaultError$;

    // Well-typed props will always have at least one of these defined (assuming response-validation in the api)
    return handler !== undefined
      ? handler(body, headers)
      : defaultErrorHandler(status);
  },
);

/**
 * A component that performs an API-Request.
 * Can be used to conditionally perform API-requests in other components.
 *
 * Can be used like {@link ApiResponse},
 * though a `hook$` and `args` are passed instead of a `response`.
 */
export const ApiRequest = component$(
  <Args extends any[], Response extends GenericRequestResponse>(
    props: {
      /**
       * The API-hook to execute
       */
      hook$: QRL<(...args: Args) => ResourceReturn<Response>>;
      /**
       * The arguments to pass to the hook
       */
      args: Args;
      /**
       * Error to render when the request failed
       */
      onRejected$?: QRL<NonNullable<PropsOf<typeof Resource>["onRejected"]>>;
      /**
       * Loading-screen to render while waiting for a response
       */
      onPending$?: QRL<NonNullable<PropsOf<typeof Resource>["onPending"]>>;
    } & ApiResponseHandlers<Response>,
  ) => {
    const {
      hook$: useHook,
      args,
      onRejected$ = $((e) => <ApiUnreachable error={e} />),
      onPending$,
    } = props;
    const response = useHook(...args).then((x) => x.value);
    const responseProps = {
      ...props,
      hook: undefined,
      args: undefined,
      onRejected$: undefined,
      onPending$: undefined,
    };
    return (
      <Resource
        value={response}
        onResolved={(response: GenericRequestResponse) => (
          <ApiResponse {...responseProps} response={response} />
        )}
        onRejected={(e) => <FromQrl fn$={onRejected$} args={[e]} />}
        onPending={onPending$ && (() => <FromQrl fn$={onPending$} args={[]} />)}
      />
    );
  },
);

/**
 * A component to display a default error-message for when the backend is unreachable.
 *
 * Will log the error, but not render it in the HTML.
 * This prevents accidental information leakage by exposing errors originating from the server
 * (and the user can't fix any connectivity-issues on the server anyway).
 */
const ApiUnreachable = component$(({ error }: { error: Error }) => {
  console.error("Failed to reach API", error);
  return (
    <div role="alert" class="alert alert-error h-max w-max">
      <HiExclamationCircleOutline class="h-10 w-10" />
      <span>
        <h5 class="text-lg font-semibold">
          Daten konnten nicht geladen werden.
        </h5>
        <p class="mb-2">
          Bitte stelle sicher, dass du mit dem Internet verbunden bist.
        </p>
        <p>
          Wenn du andere Webseiten noch erreichen kannst, könnte Sprout gerade
          eine Störung haben. Versuche es in diesem Fall bitte zu einem späterem
          Zeitpunkt erneut.
        </p>
      </span>
    </div>
  );
});
