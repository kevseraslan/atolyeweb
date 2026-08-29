export class ApiError extends Error {
  code: string;
  status: number;

  constructor(message: string, code: string = "API_ERROR", status: number = 500) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
  }
}
