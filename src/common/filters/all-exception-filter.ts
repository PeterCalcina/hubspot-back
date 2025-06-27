import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { StandardResponse } from '../dto/response.dto';
import { ExceptionResponse } from '../dto/exception-response.dto';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);
  private readonly isProduction = process.env.NODE_ENV === 'production';

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorDetails: string = 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        errorDetails = exceptionResponse;
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null
      ) {
        const responseObject = exceptionResponse as ExceptionResponse;
        errorDetails = responseObject.message as string;

        if (responseObject.message && Array.isArray(responseObject.message)) {
          errorDetails =
            'La validación falló. Por favor, verifique que los datos sean correctos.\n' +
            responseObject.message.join('\n');
          this.logger.error(
            `Validation Error: ${JSON.stringify(responseObject.message)}`,
            null,
            request.url,
          );
        }
      }
    } else if (exception instanceof Error) {
      errorDetails = exception.message;
      this.logger.error(
        `Unhandled Error: ${exception.message}`,
        exception.stack,
        request.url,
      );
    } else {
      errorDetails = 'Ocurrió un error inesperado.';
      this.logger.error(
        `Unknown Exception Type: ${JSON.stringify(exception)}`,
        null,
        request.url,
      );
    }

    const finalResponse: StandardResponse<null> = {
      status: status,
      message: errorDetails,
    };

    this.logger.error(`${errorDetails}`, null, request.url);
    response.status(status).json(finalResponse);
  }
}
