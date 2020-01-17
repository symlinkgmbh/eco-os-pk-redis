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




import "reflect-metadata";
import { Container, interfaces } from "inversify";
import { PkRedis } from "@symlinkde/eco-os-pk-models";
import { REDIS_TYPES } from "./RedisTypes";
import { CustomRedisClient } from "./RedisClient";
import { RedisConnector } from "./RedisConnector";

const redisContainer = new Container();
redisContainer
  .bind<PkRedis.IRedisConnector>(REDIS_TYPES.IRedisConnector)
  .toDynamicValue((context: interfaces.Context) => {
    return new RedisConnector(
      context.container.get(REDIS_TYPES.REDIS_HOST),
      context.container.get(REDIS_TYPES.REDIS_PORT),
    );
  })
  .inSingletonScope();
redisContainer.bind<PkRedis.IRedisClient>(REDIS_TYPES.IRedisClient).to(CustomRedisClient);
export { redisContainer };
