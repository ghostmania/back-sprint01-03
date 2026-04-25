import { ObjectId, WithId } from 'mongodb';
import { blogsCollection } from '../../db/mongo.db';
import { BlogInputDto } from '../dto/blog.input-dto';
import { Blog } from '../types/blog';

export const blogsRepository = {
  async findAll(): Promise<WithId<Omit<Blog, 'id'>>[]> {
    return blogsCollection.find().toArray();
  },

  async findById(id: string): Promise<WithId<Omit<Blog, 'id'>> | null> {
    return blogsCollection.findOne({ _id: new ObjectId(id) });
  },

  async create(newBlog: Omit<Blog, 'id'>): Promise<WithId<Omit<Blog, 'id'>>> {
    const insertResult = await blogsCollection.insertOne(newBlog);
    return { ...newBlog, _id: insertResult.insertedId };
  },

  async update(id: string, dto: BlogInputDto): Promise<void> {
    const updateResult = await blogsCollection.updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          name: dto.name,
          description: dto.description,
          websiteUrl: dto.websiteUrl,
        },
      },
    );

    if (updateResult.matchedCount < 1) {
      throw new Error('Blog not exist');
    }
  },

  async delete(id: string): Promise<void> {
    const deleteResult = await blogsCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (deleteResult.deletedCount < 1) {
      throw new Error('Blog not exist');
    }
  },
};
