import { Test } from '@nestjs/testing';
import { PostsModule } from './posts.module';
import { PostsController } from '../controller/posts.controller';
import { PostsService } from '../service/posts.service';

describe('PostsModule', () => {
  let postsModule: PostsModule;
  let postsController: PostsController;
  let postsService: PostsService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [PostsModule],
    }).compile();

    postsModule = module.get<PostsModule>(PostsModule);
    postsController = module.get<PostsController>(PostsController);
    postsService = module.get<PostsService>(PostsService);
  });

  it('should be defined', () => {
    expect(postsModule).toBeDefined();
  });

  it('should have postsController', () => {
    expect(postsController).toBeDefined();
  });

  it('should have postsService', () => {
    expect(postsService).toBeDefined();
  });
});
