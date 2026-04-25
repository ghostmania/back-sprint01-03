import { HttpStatus } from '../../../core/types/http-statuses';
import { createErrorMessages } from '../../../core/utils/error.utils';
import { Request, Response } from 'express';
import { postsRepository } from '../../repositories/posts.repository';
import { blogsRepository } from '../../../blogs/repositories/blogs.repository';

export async function updatePostHandler(req: Request, res: Response) {
  const id = req.params.id + '';
  // const index = db.posts.findIndex((v) => v.id === id);

  // const post = db.posts[index];
  // const post = await postsRepository.findById(id);

  // const blog = blogsDb.blogs.find((item) => item.id === req.body.blogId);
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

  await postsRepository.update(id, {
    title: req.body.title,
    shortDescription: req.body.shortDescription,
    content: req.body.content,
    blogId: req.body.blogId,
    blogName: blog.name,
  });

  res.sendStatus(HttpStatus.NoContent);
}
