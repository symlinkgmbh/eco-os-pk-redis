/**
 * Copyright 2018-2020 Symlink GmbH
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * 
 */




import { PkRedis } from "@symlinkde/eco-os-pk-models";
import redis, { RedisClient } from "redis";
import { injectable, inject } from "inversify";
import { REDIS_TYPES } from "./RedisTypes";

@injectable()
export class RedisConnector implements PkRedis.IRedisConnector {
  private redisHost: string;
  private redisPort: number;

  constructor(@inject(REDIS_TYPES.REDIS_HOST) redisHost: string, @inject(REDIS_TYPES.REDIS_PORT) redisPort: number) {
    this.redisHost = redisHost;
    this.redisPort = redisPort;
  }
  public connect(): RedisClient {
    return redis.createClient(this.redisPort, this.redisHost);
  }
}
