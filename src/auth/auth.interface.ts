export interface JwtSign {
  access_token: string;
  refresh_token: string;
}

export interface jwtSignPublisher {
  access_token: string;
}

export interface JwtPayload {
  sub: string;
  username: string;
  roles: string[];
}

export interface Payload {
  userId: string;
  username: string;
  roles: string[];
}

export interface PayloadPublisher {
  userId: string;
  username: string;
}

export interface JwtPublisherPayload {
  sub: string;
  username: string;
}