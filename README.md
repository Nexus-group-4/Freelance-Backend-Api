AI-Powered Backend Development - Cohort 1 - Group 4

PROJECT NAME : Freelance Backend Api

DESCRIPTION: 

- This project is built to help connect clients who have tasks that they need to be completed with freelancers who have the skills and expertise to complete these tasks.

- The platform allows users to post jobs, discover available jobs, submit applications, accept suitable applicants, and manage projects.

- The system will also provide administrative functionality for managing users, jobs, applications, and other activities on the platform.

- The main goals of the project include post jobs and finding people to complete them; apply for available jobs; hire suitable freelancers; review completed work.


CORE FEATURES:

A. Users(Clients):
-        Register and create a profile then be able to login and logout.
-        Create, edit, and delete jobs, applications and projects.
-        View their own job and jobs posted by other people.
-        View the profiles and skills of the freelancers that have applied for the jobs they have posted.
-        Accept/Reject applications.
-        View reviews given to their jobs.
B. Users(Freelancer):
-        Register and create a profile then be able to login and logout.
-        Create, edit, and delete skills, applications and projects.
-        View other people's profiles, posted jobs and skills of other freelancers.
-        Apply for jobs posted by clients.
-        View, accept and decline the jobs that they have been hired for.
-        Give reviews on jobs they have worked on.
C.  Admin:
-        View, update and delete users, jobs, applications, projects and reviews.
-        Get customized and special features such as total application, total users, etc…
-        Grants admin privileges to a user.
-        Logout all users


API SCOPE:

- Authentication: 
  - POST     /api/auth/register
  - POST     /api/auth/login
  - POST     /api/auth/refresh
  - POST     /api/auth/logout
  - POST     /api/auth/logout-all
  - GET      /api/users/me
  - GET      /api/users/:id
  - PUT      /api/users/me
  - DELETE   /api/users/me

- Skills:
  - GET      /api/skills   
  - POST     /api/skills
  - PUT      /api/skills/:id
  - DELETE   /api/skills/:id

- Jobs:
  - GET      /api/jobs
  - GET      /api/jobs/:id
  - GET      /api/categories
  - POST     /api/jobs
  - PUT      /api/jobs/:id
  - DELETE   /api/jobs/:id

- Applications:
  - GET      /api/jobs/:jobId/applications
  - GET      /api/applications/me
  - POST     /api/jobs/:jobId/applications
  - PUT      /api/applications/:id
  - PATCH    /api/applications/:id/status
  - DELETE   /api/applications/:id

- Contracts:
  - GET      /api/contracts 
  - PATCH    /contracts/:id/respond
  - PATCH    /api/contracts/:id/status

- Reviews: 
  - GET      /api/users/:userId/reviews
  - POST     /api/contracts/:contractId/reviews

- Admin: 
  - GET      /api/admin/analytics
  - GET      /api/admin/users
  - PUT      /api/admin/users/:id
  - PATCH    /api/admin/users/:id/role
  - PATCH    /api/admin/applications/:id
  - DELETE   /api/admin/users/:id
  - DELETE   /api/admin/jobs/:id
  - DELETE   /api/admin/applications/:id 

TECHNOLOGY STACK:

- Typescript: The lanuage used to help with code correction .
- Node.js: Backend runtime environment for the compiled JavaScript.
- Express.js: JavaScript Framework to ease the api building. 
- PostgreSQL: For the structured database management .
- prisma ORM: For database communication with our api.
- Zod: Runtime request validation, query coercion, and TypeScript type inference.
- Bcrypt: For password hashing and protection.
- JWT:  User Authentication and Autherization.


DATABASE:

- npm init -y
- npm install express
- npm install @prisma/client @prisma/adapter-pg pg dotenv
- npm install -D prisma@7.10.0 typescript tsx @types/node @types/pg @types/express
- npx prisma init --datasource-provider postgresql
- npx tsc --init