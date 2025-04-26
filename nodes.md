## Procedure
1. Basic setup for express file
2. npm i prisma -> npm i @prisma/client -> npx prisma init->gives schema.prisma

3. import {prisma client} -> not available in db.js unless you do the following 
    - create a model in schema.prisma
    - npx prisma generate
    - import {PrismaClient} from '../generated/prisma/index.js' --> in db.js
    - best practice of prisma in db (look for global this)

4. npx prisma migrate dev

**npx prisma studio** -> show the data base

