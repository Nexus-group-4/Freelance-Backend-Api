# AI-Powered Backend Development - Cohort 1 - Group 4

## PROJECT NAME : Freelance Backend Api

## DESCRIPTION

- This project is built to help connect clients who have tasks that they need to be completed with freelancers who have the skills and expertise to complete these tasks.
- The platform allows users to post jobs, discover available jobs, submit applications, accept suitable applicants, and manage projects.
- The system will also provide administrative functionality for managing users, jobs, applications, and other activities on the platform.
- The main goals of the project include post jobs and finding people to complete them; apply for available jobs; hire suitable freelancers; review completed work.

## CORE FEATURES

### A. Users (Clients)

- Register and create a profile then be able to login and logout.
- Create, edit, and delete jobs, applications and projects.
- View their own job and jobs posted by other people.
- View the profiles and skills of the freelancers that have applied for the jobs they have posted.
- Accept/Reject applications.
- View reviews given to their jobs.

### B. Users (Freelancer)

- Register and create a profile then be able to login and logout.
- Create, edit, and delete skills, applications and projects.
- View other people's profiles, posted jobs and skills of other freelancers.
- Apply for jobs posted by clients.
- View, accept and decline the jobs that they have been hired for.
- Give reviews on jobs they have worked on.

### C. Admin

- View, update and delete users, jobs, applications, projects and reviews.
- Get customized and special features such as total application, total users, etc…
- Grants admin privileges to a user.
- Logout all users

## API Scope

### Authentication & Users

- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/refresh
- POST /api/auth/logout
- POST /api/auth/logout-all
- GET /api/users/me
- GET /api/users/:id
- PUT /api/users/me
- DELETE /api/users/me

### Skills

- GET /api/skills
- POST /api/skills
- PUT /api/skills/:id
- DELETE /api/skills/:id

### Jobs

- GET /api/jobs
- GET /api/jobs/:id
- GET /api/categories
- POST /api/jobs
- PUT /api/jobs/:id
- DELETE /api/jobs/:id

### Applications

- GET /api/jobs/:jobId/applications
- GET /api/applications/me
- POST /api/jobs/:jobId/applications
- PUT /api/applications/:id
- PATCH /api/applications/:id/status
- DELETE /api/applications/:id

### Contracts

- GET /api/contracts
- PATCH /contracts/:id/respond
- PATCH /api/contracts/:id/status

### Reviews

- GET /api/users/:userId/reviews
- POST /api/contracts/:contractId/reviews

### Admin

- GET /api/admin/analytics
- GET /api/admin/users
- PUT /api/admin/users/:id
- PATCH /api/admin/users/:id/role
- PATCH /api/admin/applications/:id
- DELETE /api/admin/users/:id
- DELETE /api/admin/jobs/:id
- DELETE /api/admin/applications/:id

## Technology Stack

- TypeScript: The language used to help with code correction.
- Node.js: Backend runtime environment for the compiled JavaScript.
- Express.js: JavaScript Framework to ease the API building.
- PostgreSQL: For the structured database management.
- Prisma ORM: For database communication with our API.
- Zod: Runtime request validation, query coercion, and TypeScript type inference.
- Bcrypt: For password hashing and protection.
- JWT: User Authentication and Authorization.

## DATABASE

This project uses PostgreSQL as the database, accessed through Prisma ORM.

### Database Models

- User: Stores user accounts. Has a role (USER or ADMIN), authentication fields (passwordHash, tokenVersion), and profile data (bio, skills). Can act as both client and freelancer.
- Skill: Stores skill tag belonging to a user.
- Category: Stores job categories for jobs.
- Job - Stores jobs posted by clients, including the title, description, budget, category and status.
- Application - Stores freelancer applications and proposals for jobs, including the proposed rate and application status.
- Contract - Stores agreements between clients and freelancers after an application is accepted, including the agreed rate and contract status.
- Review - Stores ratings and reviews given by users after completing a contract.

### Status Descriptions

#### Application Status

- PENDING: Application has been submitted and is awaiting a response.
- ACCEPTED: Client has accepted the freelancer's application.
- REJECTED: Client has rejected the application.
- WITHDRAWN: Freelancer has withdrawn the application before receiving a response.

#### Contract Status

- OFFERED: Client has offered the job to the freelancer after accepting their application.
- DECLINED: Freelancer has declined the contract offer.
- IN_PROGRESS: Freelancer has accepted the offer and the job is in progress.
- COMPLETED: Freelancer has completed the job.
- CANCELLED: The contract was terminated by either the client or freelancer before it was completed.

#### Job Status

- OPEN: Job is accepting applications.
- CLOSED: Job is no longer accepting applications.

### Relationships

- One-to-one
  - Application - Contract: An application can result in only one contract, and each contract belongs to one application.
- One-to-many
  - User - Skills : A user can have multiple skills.
  - User - Jobs : A user can post multiple jobs.
  - User - Applications : A user can submit multiple applications to different jobs.
  - User - Contracts : A user can have multiple contracts as either a client or freelancer.
  - User - Reviews : A user can give and receive multiple reviews.
  - Category - Jobs : A category can contain multiple jobs.
  - Job - Applications : A job can receive multiple applications.
  - Job - Contracts : A job can have multiple contracts.
  - Contract - Reviews : A contract can have multiple reviews.

### Database Setup

- Initialize the project:

```bash
npm init -y
```

- Install Dependencies
  
```bash
npm install express
npm install @prisma/client @prisma/adapter-pg pg dotenv
npm install -D prisma@7.10.0 typescript tsx @types/node @types/pg @types/express
```

- Initialize Prisma and typescript

```bash
npx prisma init --datasource-provider postgresql
npx tsc --init
```

- Run migrations and generate prisma client

```bash
npx prisma migrate dev --name init
npx prisma generate
```
