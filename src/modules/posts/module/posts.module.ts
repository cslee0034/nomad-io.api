import { Module } from '@nestjs/common';
import { PostsController } from '../controller/posts.controller';
import { PostsService } from '../service/posts.service';

@Module({
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
