import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clears existing jobs 
  await prisma.job.deleteMany();

  const jobs = [
    {
      title: "Backend Engineering Intern",
      company: "Razorpay",
      location: "Bengaluru, India",
      salary: 40000,
      description: `We are looking for a Backend Engineering Intern to join our Payments Infrastructure team.
      
Responsibilities:
- Build and maintain RESTful APIs using Node.js and Express
- Work with PostgreSQL databases and write optimized queries
- Implement caching strategies using Redis
- Write unit and integration tests for backend services
- Collaborate with senior engineers on system design decisions

Requirements:
- Strong knowledge of JavaScript and Node.js
- Understanding of REST APIs and HTTP protocols
- Familiarity with SQL databases and basic query optimization
- Knowledge of Git and version control workflows
- Understanding of data structures and algorithms
- Bonus: Experience with Redis, Docker, or message queues`
    },
    {
      title: "Full Stack Developer Intern",
      company: "Zepto",
      location: "Mumbai, India",
      salary: 35000,
      description: `Join Zepto's fast-growing engineering team as a Full Stack Developer Intern.

Responsibilities:
- Develop features across the full stack using React and Node.js
- Build and integrate RESTful APIs with PostgreSQL backend
- Optimize frontend performance and improve user experience
- Participate in code reviews and agile sprint planning
- Debug and fix issues across frontend and backend systems

Requirements:
- Proficiency in JavaScript, React, and Node.js
- Experience with REST APIs and JSON
- Basic knowledge of SQL and database design
- Familiarity with Git workflows
- Strong problem solving and DSA fundamentals
- Bonus: Knowledge of TypeScript or Next.js`
    },
    {
      title: "Software Development Engineer Intern",
      company: "Flipkart",
      location: "Bengaluru, India",
      salary: 45000,
      description: `Flipkart is hiring SDE Interns to work on large-scale distributed systems powering India's largest e-commerce platform.

Responsibilities:
- Design and implement scalable backend services in Java or Node.js
- Work with distributed databases and caching systems like Redis
- Build APIs consumed by millions of users daily
- Write clean, testable, and well-documented code
- Participate in system design discussions with senior engineers

Requirements:
- Strong fundamentals in data structures and algorithms
- Knowledge of object-oriented programming
- Understanding of databases — SQL and NoSQL
- Familiarity with REST APIs
- Good problem solving skills — LeetCode medium level
- Bonus: Knowledge of system design, Kafka, or microservices`
    },
    {
      title: "AI/ML Engineering Intern",
      company: "Sarvam AI",
      location: "Remote, India",
      salary: 50000,
      description: `Sarvam AI is building India's own large language models. Join us as an AI/ML Engineering Intern.

Responsibilities:
- Assist in fine-tuning and evaluating large language models
- Build data pipelines for training and evaluation datasets
- Implement RAG pipelines using vector databases
- Integrate LLM APIs into production backend services
- Write scripts for prompt engineering and structured output extraction

Requirements:
- Strong Python programming skills
- Understanding of how LLMs work — tokens, embeddings, context window
- Familiarity with REST APIs and JSON
- Basic knowledge of vector databases like Pinecone or pgvector
- Knowledge of prompt engineering techniques
- Bonus: Experience with LangChain, LlamaIndex, or Groq API`
    },
    {
      title: "DevOps Intern",
      company: "HasuraHQ",
      location: "Bengaluru, India",
      salary: 30000,
      description: `HasuraHQ is looking for a DevOps Intern to support our infrastructure and deployment pipelines.

Responsibilities:
- Manage and monitor cloud infrastructure on AWS
- Build and maintain CI/CD pipelines using GitHub Actions
- Write Dockerfiles and manage containerized deployments
- Monitor system performance and set up alerting
- Automate repetitive infrastructure tasks using bash scripts

Requirements:
- Understanding of Linux systems and bash scripting
- Knowledge of Docker and containerization concepts
- Familiarity with cloud platforms — AWS or GCP basics
- Understanding of CI/CD concepts
- Basic networking knowledge — DNS, HTTP, TCP/IP
- Bonus: Experience with Kubernetes or Terraform`
    },
    {
      title: "Backend Developer Intern",
      company: "CRED",
      location: "Bengaluru, India",
      salary: 42000,
      description: `CRED is hiring Backend Developer Interns to work on our financial products and rewards platform.

Responsibilities:
- Build microservices using Node.js or Go
- Design and optimize PostgreSQL database schemas
- Implement JWT-based authentication and authorization systems
- Write rate limiting and API security middleware
- Build background job processors for async tasks

Requirements:
- Strong knowledge of Node.js and Express
- Understanding of JWT authentication and security best practices
- Proficiency in SQL and database design
- Knowledge of REST API design principles
- Familiarity with Git and code review workflows
- Bonus: Experience with Redis, message queues, or microservices architecture`
    },
    {
      title: "Frontend Engineering Intern",
      company: "Swiggy",
      location: "Bengaluru, India",
      salary: 35000,
      description: `Swiggy is looking for a Frontend Engineering Intern to work on our consumer-facing web applications.

Responsibilities:
- Build performant React components and pages
- Integrate frontend with backend REST APIs
- Optimize web performance — lazy loading, code splitting, caching
- Write unit tests for React components
- Collaborate with designers to implement pixel-perfect UIs

Requirements:
- Strong proficiency in React.js and JavaScript
- Understanding of HTML, CSS, and responsive design
- Experience consuming REST APIs using fetch or axios
- Familiarity with Git workflows
- Basic understanding of web performance optimization
- Bonus: Experience with Next.js, TypeScript, or Tailwind CSS`
    },
    {
      title: "Data Engineering Intern",
      company: "PhonePe",
      location: "Bengaluru, India",
      salary: 38000,
      description: `PhonePe is hiring Data Engineering Interns to work on our data infrastructure powering payments analytics.

Responsibilities:
- Build and maintain ETL pipelines for transaction data
- Write optimized SQL queries for large datasets
- Work with Apache Kafka for real-time data streaming
- Build dashboards and data visualizations for business teams
- Ensure data quality and write data validation scripts

Requirements:
- Strong SQL skills and understanding of database internals
- Python programming for data processing scripts
- Understanding of data pipeline concepts — ETL, batch vs stream
- Basic knowledge of distributed systems
- Familiarity with Git
- Bonus: Experience with Kafka, Spark, Airflow, or dbt`
    },
    {
      title: "Product Engineering Intern",
      company: "Notion",
      location: "Remote",
      salary: 80000,
      description: `Notion is hiring Product Engineering Interns globally to work on our core product features.

Responsibilities:
- Build new product features end to end — backend APIs and frontend UI
- Work with a distributed team across time zones
- Participate in product design discussions and user research
- Write scalable backend services in Node.js or TypeScript
- Ship features used by millions of knowledge workers worldwide

Requirements:
- Strong JavaScript and TypeScript skills
- Experience with React and Node.js
- Understanding of databases — SQL and NoSQL
- Good product thinking and user empathy
- Ability to work independently in a remote environment
- Bonus: Experience with collaborative tools, real-time sync, or CRDTs`
    },
    {
      title: "Cloud Infrastructure Intern",
      company: "Infosys",
      location: "Pune, India",
      salary: 25000,
      description: `Infosys is hiring Cloud Infrastructure Interns to work on enterprise cloud migration projects.

Responsibilities:
- Assist in migrating on-premise applications to AWS or Azure
- Write infrastructure as code using Terraform
- Monitor cloud costs and optimize resource usage
- Set up logging and monitoring using CloudWatch or Datadog
- Document infrastructure architecture and runbooks

Requirements:
- Basic understanding of cloud platforms — AWS or Azure
- Knowledge of Linux systems and command line
- Familiarity with networking concepts — VPC, subnets, load balancers
- Understanding of Docker and containerization
- Good written communication for documentation
- Bonus: AWS Cloud Practitioner certification or Terraform experience`
    }
  ];

  for (const job of jobs) {
    await prisma.job.create({ data: job });
  }

  console.log("✅ Seeded 10 internship jobs successfully");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });