/*
 * Copyright 2021 Spotify AB
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
 */

import { TestDatabases } from './TestDatabases';

describe('TestDatabases', () => {
  const dbs = TestDatabases.create();

  it.each([
    ['POSTGRES_13'],
    ['POSTGRES_9'],
    ['MYSQL_8'],
    ['SQLITE_3'],
  ] as const)(
    'creates distinct %p databases',
    async databaseId => {
      const db1 = await dbs.init(databaseId);
      const db2 = await dbs.init(databaseId);
      await db1.schema.createTable('a', table => table.string('x').primary());
      await db2.schema.createTable('a', table => table.string('y').primary());
      await expect(db1.select({ a: db1.raw('1') })).resolves.toEqual([
        { a: 1 },
      ]);
    },
    60_000,
  );
});
