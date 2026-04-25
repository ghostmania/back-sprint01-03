import { NextFunction } from 'express';
import { HttpStatus } from '../../core/types/http-statuses';
import { createErrorMessages } from '../../core/utils/error.utils';
import { postInputDtoValidation } from '../validation/postInputDtoValidation';
import { Request, Response } from 'express';
import { blogsRepository } from '../../blogs/repositories/blogs.repository';

export const PostHasValidFIeldsMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors = postInputDtoValidation(req.body);

  if (errors.length > 0) {
    res.status(HttpStatus.BadRequest).send(createErrorMessages(errors));
    return;
  }

  // validate blog exists and get data
  const blog = await blogsRepository.findById(req.body.blogId);
  if (!blog) {
    res
      .status(HttpStatus.BadRequest)
      .send(
        createErrorMessages([
          { field: 'blogId', message: 'Blog for post does not exist' },
        ]),
      );
    return;
  }

  next(); // Успешная авторизация, продолжаем
};
