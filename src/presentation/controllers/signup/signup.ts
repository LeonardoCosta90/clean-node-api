import {
  HttpResponse,
  HttpRequest,
  Controller,
  EmailValidator,
  AddAccount,
} from "./signup-protocols";
import { MissingParamError, InvalidParamError } from "../../errors";
import { badRequest, serverError, ok } from "../../helpers/http-helper";
import { Validation } from "../../helpers/validators/validation";

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator;
  private readonly addAccount: AddAccount;
  private readonly validation: Validation;

  constructor(
    emailValidator: EmailValidator,
    addAccount: AddAccount,
    validation: Validation
  ) {
    this.emailValidator = emailValidator;
    this.addAccount = addAccount;
    this.validation = validation;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body);
      const { name, email, password, passwordConfirmation } = httpRequest.body;
      const isValid = this.emailValidator.isValid(email);
      const account = await this.addAccount.add({
        name,
        email,
        password,
      });

      if (error) {
        return badRequest(error);
      }

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError("passwordConfirmation"));
      }

      if (!isValid) {
        return badRequest(new InvalidParamError("email"));
      }
      return ok(account);
    } catch (error) {
      return serverError(error);
    }
  }
}
