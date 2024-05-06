import { Resolver, Query, Args } from '@nestjs/graphql';
import { LoginResponse } from '../models';
import { AuthService } from 'src/auth';
import { LoginInput } from '../dto';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => LoginResponse)
  async login(@Args('loginInput') loginInput: LoginInput): Promise<LoginResponse | null> {
    const publisher = await this.authService.validatePublisher(loginInput.username, loginInput.password);

    if (!publisher) {
      throw new Error('Invalid username or password');
    }

    return this.authService.jwtSignPublisher({ sub: publisher.id, username: publisher.name});
  }

}
