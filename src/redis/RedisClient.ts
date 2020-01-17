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




import { injectable, inject } from "inversify";
import { PkRedis } from "@symlinkde/eco-os-pk-models";
import { REDIS_TYPES } from "./RedisTypes";
import { RedisClient } from "redis";

@injectable()
export class CustomRedisClient implements PkRedis.IRedisClient {
  private redisClient: RedisClient;

  constructor(@inject(REDIS_TYPES.IRedisConnector) redisConnector: PkRedis.IRedisConnector) {
    this.redisClient = redisConnector.connect();
  }

  public async set(key: string, value: object, expire?: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (!expire) {
        this.redisClient.set(key, JSON.stringify(value), (error, result) => {
          if (error) {
            reject(error);
          }
          resolve(result === "OK");
        });
      } else {
        this.redisClient.set(key, JSON.stringify(value), "EX", expire, (error, result) => {
          if (error) {
            reject(error);
          }
          resolve(result === "OK");
        });
      }
    });
  }

  public async get<T>(key: string): Promise<T> {
    return new Promise((resolve, reject) => {
      this.redisClient.get(key, (error, value) => {
        if (error) {
          reject();
        }
        resolve(<T>JSON.parse(value));
      });
    });
  }

  public async delete(key: string): Promise<boolean> {
    return await this.redisClient.del(key);
  }

  public async getAll<T>(query?: string): Promise<Array<T>> {
    return new Promise((resolve, reject) => {
      this.redisClient.KEYS(query === undefined || null ? "*" : query, (error, keys) => {
        if (error) {
          reject();
        }
        resolve(this.buildArray(keys));
      });
    });
  }

  private async buildArray<T>(keys: Array<string>): Promise<Array<T>> {
    const entries: Array<T> = [];

    for (const index in keys) {
      if (index) {
        await this.get<T>(keys[index]).then((result) => {
          entries.push(result);
        });
      }
    }

    return entries;
  }
}
