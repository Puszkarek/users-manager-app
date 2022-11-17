export enum REQUEST_STATUS {
  // * 2xx Success
  created = 201,
  ok = 200,
  accepted = 202,
  // * 4xx Client Errors
  bad = 400,
  unauthorized = 401,
  not_found = 404,
  // * 5xx Server Errors
  not_implemented = 501,
}

export type ExceptionError = {
  readonly statusCode: REQUEST_STATUS;
  readonly message: string;
};
