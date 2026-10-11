"""Curated graph seed dataset for SkillRoute India.

Defines:
- Roles (with GCC India insights and requirement tiers)
- Skills (with granular categories, hours, and difficulty)
- Prerequisite dependencies (Skill DEPENDS_ON Skill)
- Learning resources (Resource TEACHES Skill, real curated links)
"""

ROLES = [
    {
        "id": "fullstack-swe",
        "title": "Full-Stack Web Engineer",
        "category": "Software Engineering",
        "summary": "Build high-throughput web applications across modern frontend architectures and high-performance backend microservices.",
        "marketDemand": "Very High",
        "typicalExperience": "0-3 Years (Junior to Mid)",
        "tier": "Tier-1 GCC & Product Scale",
        "hubFocus": "Bengaluru, Hyderabad, Pune, Gurugram",
        "targetCtcRange": "₹12L - ₹28L PA"
    },
    {
        "id": "aiml-platform",
        "title": "AI & ML Platform Engineer",
        "category": "Artificial Intelligence",
        "summary": "Develop production generative AI systems, RAG architectures, knowledge graphs, and scalable model serving pipelines.",
        "marketDemand": "Exponential",
        "typicalExperience": "1-4 Years",
        "tier": "Global AI Hubs & Enterprise Innovation",
        "hubFocus": "Bengaluru, Hyderabad, NCR",
        "targetCtcRange": "₹18L - ₹40L PA"
    },
    {
        "id": "cloud-devops",
        "title": "Cloud & DevOps Platform Engineer",
        "category": "Cloud & Infrastructure",
        "summary": "Architect resilient Kubernetes infrastructure, declarative IaC, and zero-downtime CI/CD automation across hybrid cloud.",
        "marketDemand": "Very High",
        "typicalExperience": "1-4 Years",
        "tier": "Enterprise GCCs & FinTech",
        "hubFocus": "Bengaluru, Pune, Chennai, Hyderabad",
        "targetCtcRange": "₹14L - ₹32L PA"
    },
    {
        "id": "dist-backend",
        "title": "Distributed Systems Backend Engineer",
        "category": "Core Engineering",
        "summary": "Engineer low-latency concurrent services, event streaming backbones, distributed caching, and ACID/graph datastores.",
        "marketDemand": "Critical Need",
        "typicalExperience": "2-5 Years",
        "tier": "High Frequency Tech & Core Platforms",
        "hubFocus": "Bengaluru, Hyderabad, Mumbai",
        "targetCtcRange": "₹16L - ₹36L PA"
    },
    {
        "id": "data-engineer",
        "title": "Data Platform & Analytics Engineer",
        "category": "Data Engineering",
        "summary": "Construct batch and real-time streaming data lakes, distributed Spark pipelines, and orchestrated metadata warehouses.",
        "marketDemand": "High",
        "typicalExperience": "1-4 Years",
        "tier": "Data-Driven GCCs & Retail Tech",
        "hubFocus": "Bengaluru, Hyderabad, Pune",
        "targetCtcRange": "₹13L - ₹30L PA"
    }
]

SKILLS = [
    # Core Fundamentals
    {
        "id": "python-prog",
        "name": "Python Core & Concurrency",
        "category": "Fundamentals",
        "description": "Object-oriented patterns, type hinting, generators, AsyncIO, and package management.",
        "estimatedHours": 35,
        "difficulty": "Beginner"
    },
    {
        "id": "js-ts",
        "name": "JavaScript & TypeScript",
        "category": "Fundamentals",
        "description": "ESNext syntax, asynchronous promises, strict type system, generics, and interfaces.",
        "estimatedHours": 30,
        "difficulty": "Beginner"
    },
    {
        "id": "web-foundations",
        "name": "Web Foundations & Protocols",
        "category": "Fundamentals",
        "description": "Semantic HTML5, CSS layout engines (Flexbox/Grid), HTTP/2, REST semantics, and browser runtime.",
        "estimatedHours": 20,
        "difficulty": "Beginner"
    },
    {
        "id": "dsa",
        "name": "Data Structures & Algorithms",
        "category": "Fundamentals",
        "description": "Arrays, trees, graphs, sorting, searching, time/space complexity analysis (Big-O).",
        "estimatedHours": 60,
        "difficulty": "Intermediate"
    },
    {
        "id": "sql-db",
        "name": "Database Design & SQL Optimization",
        "category": "Data & Storage",
        "description": "Relational schema normalization, indexing strategies, ACID guarantees, and query plans.",
        "estimatedHours": 30,
        "difficulty": "Beginner"
    },
    {
        "id": "linux-shell",
        "name": "Linux OS & Shell Scripting",
        "category": "Infrastructure",
        "description": "POSIX file permissions, Bash scripting, process triage, network utilities, and systemd.",
        "estimatedHours": 25,
        "difficulty": "Beginner"
    },
    {
        "id": "git-vcs",
        "name": "Git & Collaborative Workflows",
        "category": "Fundamentals",
        "description": "Branching models, rebasing, resolving merge conflicts, and conventional commits.",
        "estimatedHours": 15,
        "difficulty": "Beginner"
    },
    {
        "id": "math-stats",
        "name": "Linear Algebra & Probability",
        "category": "AI Foundations",
        "description": "Matrix operations, eigenvalues, probability distributions, calculus gradients for ML.",
        "estimatedHours": 40,
        "difficulty": "Intermediate"
    },

    # Intermediate Skills
    {
        "id": "react-ecosystem",
        "name": "React 18 & State Architecture",
        "category": "Frontend",
        "description": "Functional components, custom hooks, virtual DOM reconciler, and client state orchestration.",
        "estimatedHours": 45,
        "difficulty": "Intermediate"
    },
    {
        "id": "fastapi-async",
        "name": "FastAPI & Async Microservices",
        "category": "Backend",
        "description": "High performance async REST APIs, Pydantic validation, dependency injection, and OpenAPI.",
        "estimatedHours": 35,
        "difficulty": "Intermediate"
    },
    {
        "id": "docker-containers",
        "name": "Docker & Containerization",
        "category": "DevOps",
        "description": "Multi-stage Dockerfiles, image optimization, rootless security, and Docker Compose environments.",
        "estimatedHours": 25,
        "difficulty": "Intermediate"
    },
    {
        "id": "neo4j-graph",
        "name": "Neo4j Graph Database & Cypher",
        "category": "Data & Storage",
        "description": "Property graph data modeling, Cypher declarative query optimization, indices, and graph traversals.",
        "estimatedHours": 30,
        "difficulty": "Intermediate"
    },
    {
        "id": "redis-caching",
        "name": "Redis In-Memory & Caching Patterns",
        "category": "Backend",
        "description": "In-memory key-value structures, cache-aside/write-through strategies, TTL, and pub/sub.",
        "estimatedHours": 20,
        "difficulty": "Intermediate"
    },
    {
        "id": "pytorch-foundations",
        "name": "PyTorch & Deep Learning",
        "category": "Artificial Intelligence",
        "description": "Tensors, autograd, feedforward and transformer backbones, loss functions, GPU acceleration.",
        "estimatedHours": 50,
        "difficulty": "Intermediate"
    },
    {
        "id": "vector-dbs",
        "name": "Vector Embeddings & Semantic Search",
        "category": "Artificial Intelligence",
        "description": "High-dimensional embeddings, similarity metrics (cosine/dot), HNSW indexing, and vector stores.",
        "estimatedHours": 25,
        "difficulty": "Intermediate"
    },
    {
        "id": "cloud-aws-gcp",
        "name": "Cloud Architecture (AWS / GCP)",
        "category": "Infrastructure",
        "description": "Compute instances (EC2/GCE), serverless functions, VPC networking, IAM security, and object storage.",
        "estimatedHours": 40,
        "difficulty": "Intermediate"
    },
    {
        "id": "ci-cd-pipelines",
        "name": "CI/CD & GitHub Actions Automation",
        "category": "DevOps",
        "description": "Automated linting, testing matrix workflows, artifact registries, and progressive delivery.",
        "estimatedHours": 20,
        "difficulty": "Intermediate"
    },
    {
        "id": "spark-data",
        "name": "Apache Spark & PySpark",
        "category": "Data Engineering",
        "description": "Resilient Distributed Datasets (RDDs), DataFrames, partition optimization, and Spark SQL.",
        "estimatedHours": 45,
        "difficulty": "Intermediate"
    },

    # Advanced Architectures
    {
        "id": "nextjs-fullstack",
        "name": "Next.js & Full-Stack SSR",
        "category": "Frontend",
        "description": "React Server Components, App Router, streaming SSR, edge middleware, and SEO optimization.",
        "estimatedHours": 35,
        "difficulty": "Advanced"
    },
    {
        "id": "kafka-streaming",
        "name": "Apache Kafka & Event Streaming",
        "category": "Distributed Systems",
        "description": "Partitions, consumer groups, exactly-once delivery semantics, and schema registries.",
        "estimatedHours": 40,
        "difficulty": "Advanced"
    },
    {
        "id": "kubernetes-k8s",
        "name": "Kubernetes Orchestration & Helm",
        "category": "DevOps",
        "description": "Pods, Deployments, Services, Ingress controllers, ConfigMaps, Secrets, and Helm charts.",
        "estimatedHours": 50,
        "difficulty": "Advanced"
    },
    {
        "id": "terraform-iac",
        "name": "Terraform & Declarative IaC",
        "category": "DevOps",
        "description": "State management, reusable modules, provider integrations, and drift detection.",
        "estimatedHours": 30,
        "difficulty": "Advanced"
    },
    {
        "id": "system-design",
        "name": "Distributed System Design",
        "category": "Core Engineering",
        "description": "Scalability, CAP theorem, consistent hashing, load balancing, rate limiting, and fault tolerance.",
        "estimatedHours": 55,
        "difficulty": "Advanced"
    },
    {
        "id": "llm-rag-agents",
        "name": "LLM Architectures, RAG & Agents",
        "category": "Artificial Intelligence",
        "description": "Retrieval-Augmented Generation, chunking, prompt engineering, agentic function calling, and evaluation.",
        "estimatedHours": 45,
        "difficulty": "Advanced"
    },
    {
        "id": "mlops-pipelines",
        "name": "MLOps & Model Lifecycle",
        "category": "Artificial Intelligence",
        "description": "MLflow tracking, model registries, containerized inference servers, and data drift monitoring.",
        "estimatedHours": 35,
        "difficulty": "Advanced"
    },
    {
        "id": "airflow-orchestration",
        "name": "Apache Airflow Orchestration",
        "category": "Data Engineering",
        "description": "Directed Acyclic Graphs (DAGs), task dependencies, sensors, custom operators, and backfilling.",
        "estimatedHours": 30,
        "difficulty": "Advanced"
    }
]

# Prerequisite Relationships: Skill DEPENDS_ON Skill
# (A, B) means: A DEPENDS_ON B (B must be learned before A)
DEPENDENCIES = [
    # Frontend chain
    ("react-ecosystem", "js-ts"),
    ("react-ecosystem", "web-foundations"),
    ("nextjs-fullstack", "react-ecosystem"),
    ("nextjs-fullstack", "fastapi-async"),

    # Backend & Microservices chain
    ("fastapi-async", "python-prog"),
    ("fastapi-async", "sql-db"),
    ("redis-caching", "dsa"),
    ("redis-caching", "sql-db"),
    ("neo4j-graph", "sql-db"),
    ("kafka-streaming", "redis-caching"),
    ("system-design", "fastapi-async"),
    ("system-design", "redis-caching"),
    ("system-design", "kafka-streaming"),

    # DevOps & Cloud chain
    ("docker-containers", "linux-shell"),
    ("cloud-aws-gcp", "linux-shell"),
    ("cloud-aws-gcp", "web-foundations"),
    ("ci-cd-pipelines", "docker-containers"),
    ("ci-cd-pipelines", "git-vcs"),
    ("kubernetes-k8s", "docker-containers"),
    ("kubernetes-k8s", "cloud-aws-gcp"),
    ("terraform-iac", "cloud-aws-gcp"),
    ("terraform-iac", "linux-shell"),

    # AI & ML chain
    ("pytorch-foundations", "python-prog"),
    ("pytorch-foundations", "math-stats"),
    ("vector-dbs", "python-prog"),
    ("llm-rag-agents", "pytorch-foundations"),
    ("llm-rag-agents", "vector-dbs"),
    ("llm-rag-agents", "neo4j-graph"),
    ("llm-rag-agents", "fastapi-async"),
    ("mlops-pipelines", "pytorch-foundations"),
    ("mlops-pipelines", "docker-containers"),
    ("mlops-pipelines", "ci-cd-pipelines"),

    # Data Engineering chain
    ("spark-data", "python-prog"),
    ("spark-data", "sql-db"),
    ("airflow-orchestration", "spark-data"),
    ("airflow-orchestration", "docker-containers")
]

# Role Requirements: Role REQUIRES Skill
ROLE_REQUIREMENTS = [
    # Full-Stack Web Engineer
    ("fullstack-swe", "web-foundations", "Core", "Proficient"),
    ("fullstack-swe", "js-ts", "Core", "Proficient"),
    ("fullstack-swe", "react-ecosystem", "Core", "Proficient"),
    ("fullstack-swe", "python-prog", "Core", "Proficient"),
    ("fullstack-swe", "sql-db", "Core", "Proficient"),
    ("fullstack-swe", "fastapi-async", "Core", "Proficient"),
    ("fullstack-swe", "git-vcs", "Core", "Foundational"),
    ("fullstack-swe", "docker-containers", "Recommended", "Proficient"),
    ("fullstack-swe", "nextjs-fullstack", "Recommended", "Proficient"),
    ("fullstack-swe", "redis-caching", "Recommended", "Foundational"),
    ("fullstack-swe", "system-design", "Elective", "Foundational"),

    # AI & ML Platform Engineer
    ("aiml-platform", "python-prog", "Core", "Advanced"),
    ("aiml-platform", "math-stats", "Core", "Proficient"),
    ("aiml-platform", "pytorch-foundations", "Core", "Advanced"),
    ("aiml-platform", "vector-dbs", "Core", "Proficient"),
    ("aiml-platform", "neo4j-graph", "Core", "Proficient"),
    ("aiml-platform", "llm-rag-agents", "Core", "Advanced"),
    ("aiml-platform", "fastapi-async", "Core", "Proficient"),
    ("aiml-platform", "docker-containers", "Core", "Proficient"),
    ("aiml-platform", "mlops-pipelines", "Recommended", "Proficient"),
    ("aiml-platform", "git-vcs", "Core", "Foundational"),

    # Cloud & DevOps Engineer
    ("cloud-devops", "linux-shell", "Core", "Advanced"),
    ("cloud-devops", "git-vcs", "Core", "Proficient"),
    ("cloud-devops", "docker-containers", "Core", "Advanced"),
    ("cloud-devops", "cloud-aws-gcp", "Core", "Advanced"),
    ("cloud-devops", "kubernetes-k8s", "Core", "Advanced"),
    ("cloud-devops", "terraform-iac", "Core", "Advanced"),
    ("cloud-devops", "ci-cd-pipelines", "Core", "Advanced"),
    ("cloud-devops", "python-prog", "Recommended", "Foundational"),
    ("cloud-devops", "system-design", "Recommended", "Proficient"),

    # Distributed Systems Backend Engineer
    ("dist-backend", "dsa", "Core", "Advanced"),
    ("dist-backend", "python-prog", "Core", "Advanced"),
    ("dist-backend", "sql-db", "Core", "Advanced"),
    ("dist-backend", "redis-caching", "Core", "Advanced"),
    ("dist-backend", "fastapi-async", "Core", "Advanced"),
    ("dist-backend", "kafka-streaming", "Core", "Advanced"),
    ("dist-backend", "system-design", "Core", "Advanced"),
    ("dist-backend", "neo4j-graph", "Recommended", "Proficient"),
    ("dist-backend", "docker-containers", "Core", "Proficient"),
    ("dist-backend", "git-vcs", "Core", "Foundational"),

    # Data Platform & Analytics Engineer
    ("data-engineer", "python-prog", "Core", "Advanced"),
    ("data-engineer", "sql-db", "Core", "Advanced"),
    ("data-engineer", "spark-data", "Core", "Advanced"),
    ("data-engineer", "airflow-orchestration", "Core", "Advanced"),
    ("data-engineer", "kafka-streaming", "Core", "Proficient"),
    ("data-engineer", "cloud-aws-gcp", "Core", "Proficient"),
    ("data-engineer", "docker-containers", "Recommended", "Proficient"),
    ("data-engineer", "git-vcs", "Core", "Foundational")
]

# Real Curated Learning Resources: Resource TEACHES Skill
# Only genuine, real, high-quality links (official docs, free courses, renowned platforms)
RESOURCES = [
    # Python
    {
        "id": "res-py-official",
        "skillId": "python-prog",
        "title": "Official Python Documentation & Async Tutorial",
        "url": "https://docs.python.org/3/tutorial/",
        "provider": "Python Software Foundation",
        "type": "Documentation",
        "is_free": True,
        "duration": "15 Hours",
        "level": "Beginner"
    },
    {
        "id": "res-py-fcc",
        "skillId": "python-prog",
        "title": "Scientific Computing with Python Certification",
        "url": "https://www.freecodecamp.org/learn/scientific-computing-with-python/",
        "provider": "freeCodeCamp",
        "type": "Interactive Course",
        "is_free": True,
        "duration": "30 Hours",
        "level": "Beginner"
    },

    # React
    {
        "id": "res-react-docs",
        "skillId": "react-ecosystem",
        "title": "React Official Documentation: Describing the UI & State",
        "url": "https://react.dev/learn",
        "provider": "React Team",
        "type": "Interactive Documentation",
        "is_free": True,
        "duration": "25 Hours",
        "level": "Intermediate"
    },
    {
        "id": "res-fullstackopen",
        "skillId": "react-ecosystem",
        "title": "Full Stack Open: Deep Dive into Modern Web Development",
        "url": "https://fullstackopen.com/en/",
        "provider": "University of Helsinki",
        "type": "Comprehensive Course",
        "is_free": True,
        "duration": "50 Hours",
        "level": "Intermediate"
    },

    # FastAPI
    {
        "id": "res-fastapi-official",
        "skillId": "fastapi-async",
        "title": "FastAPI Comprehensive User Guide & Tutorial",
        "url": "https://fastapi.tiangolo.com/tutorial/",
        "provider": "FastAPI Official",
        "type": "Documentation",
        "is_free": True,
        "duration": "18 Hours",
        "level": "Intermediate"
    },

    # Neo4j & Graph
    {
        "id": "res-neo4j-academy-cypher",
        "skillId": "neo4j-graph",
        "title": "Cypher Fundamentals & Graph Data Modeling",
        "url": "https://graphacademy.neo4j.com/courses/cypher-fundamentals/",
        "provider": "Neo4j GraphAcademy",
        "type": "Hands-on Certification",
        "is_free": True,
        "duration": "8 Hours",
        "level": "Beginner"
    },
    {
        "id": "res-neo4j-python",
        "skillId": "neo4j-graph",
        "title": "Building Neo4j Applications with Python",
        "url": "https://graphacademy.neo4j.com/courses/app-python/",
        "provider": "Neo4j GraphAcademy",
        "type": "Hands-on Certification",
        "is_free": True,
        "duration": "10 Hours",
        "level": "Intermediate"
    },

    # Docker
    {
        "id": "res-docker-docs",
        "skillId": "docker-containers",
        "title": "Docker Getting Started Guide & Multi-Stage Builds",
        "url": "https://docs.docker.com/get-started/",
        "provider": "Docker Docs",
        "type": "Official Guide",
        "is_free": True,
        "duration": "12 Hours",
        "level": "Beginner"
    },

    # Kubernetes
    {
        "id": "res-k8s-basics",
        "skillId": "kubernetes-k8s",
        "title": "Kubernetes Official Interactive Tutorials",
        "url": "https://kubernetes.io/docs/tutorials/kubernetes-basics/",
        "provider": "CNCF Kubernetes",
        "type": "Interactive Labs",
        "is_free": True,
        "duration": "20 Hours",
        "level": "Advanced"
    },

    # LLM & RAG
    {
        "id": "res-deeplearning-rag",
        "skillId": "llm-rag-agents",
        "title": "Building Systems with ChatGPT API & Advanced RAG",
        "url": "https://www.deeplearning.ai/short-courses/building-systems-with-chatgpt/",
        "provider": "DeepLearning.AI",
        "type": "Video Course",
        "is_free": True,
        "duration": "6 Hours",
        "level": "Advanced"
    },
    {
        "id": "res-neo4j-genai",
        "skillId": "llm-rag-agents",
        "title": "Neo4j Knowledge Graph RAG for LLMs",
        "url": "https://graphacademy.neo4j.com/courses/llm-fundamentals/",
        "provider": "Neo4j GraphAcademy",
        "type": "Hands-on Certification",
        "is_free": True,
        "duration": "8 Hours",
        "level": "Advanced"
    },

    # PyTorch
    {
        "id": "res-pytorch-tutorials",
        "skillId": "pytorch-foundations",
        "title": "Deep Learning with PyTorch: A 60 Minute Blitz",
        "url": "https://pytorch.org/tutorials/beginner/deep_learning_60min_blitz.html",
        "provider": "PyTorch Official",
        "type": "Hands-on Tutorial",
        "is_free": True,
        "duration": "10 Hours",
        "level": "Intermediate"
    },
    {
        "id": "res-fastai",
        "skillId": "pytorch-foundations",
        "title": "Practical Deep Learning for Coders",
        "url": "https://course.fast.ai/",
        "provider": "fast.ai",
        "type": "Full Course",
        "is_free": True,
        "duration": "40 Hours",
        "level": "Intermediate"
    },

    # DSA & System Design
    {
        "id": "res-neetcode",
        "skillId": "dsa",
        "title": "NeetCode Roadmap & Algorithms Visualizer",
        "url": "https://neetcode.io/roadmap",
        "provider": "NeetCode",
        "type": "Visual Practice Platform",
        "is_free": True,
        "duration": "50 Hours",
        "level": "Intermediate"
    },
    {
        "id": "res-system-design-primer",
        "skillId": "system-design",
        "title": "The System Design Primer (Scalability & Microservices)",
        "url": "https://github.com/donnemartin/system-design-primer",
        "provider": "Open Source Community",
        "type": "Repository & Diagrams",
        "is_free": True,
        "duration": "35 Hours",
        "level": "Advanced"
    },

    # Kafka
    {
        "id": "res-kafka-confluent",
        "skillId": "kafka-streaming",
        "title": "Apache Kafka 101 & Event-Driven Architecture",
        "url": "https://developer.confluent.io/courses/apache-kafka/overview/",
        "provider": "Confluent Developer",
        "type": "Course & Labs",
        "is_free": True,
        "duration": "14 Hours",
        "level": "Advanced"
    },

    # Terraform
    {
        "id": "res-terraform-learn",
        "skillId": "terraform-iac",
        "title": "HashiCorp Terraform Associate Certification Track",
        "url": "https://developer.hashicorp.com/terraform/tutorials",
        "provider": "HashiCorp",
        "type": "Tutorials & Labs",
        "is_free": True,
        "duration": "16 Hours",
        "level": "Advanced"
    },

    # Next.js
    {
        "id": "res-nextjs-learn",
        "skillId": "nextjs-fullstack",
        "title": "Learn Next.js App Router by Building a Dashboard",
        "url": "https://nextjs.org/learn",
        "provider": "Vercel",
        "type": "Interactive Course",
        "is_free": True,
        "duration": "14 Hours",
        "level": "Advanced"
    },

    # Spark
    {
        "id": "res-spark-docs",
        "skillId": "spark-data",
        "title": "Apache Spark Quick Start & PySpark Programming Guide",
        "url": "https://spark.apache.org/docs/latest/quick-start.html",
        "provider": "Apache Software Foundation",
        "type": "Official Guide",
        "is_free": True,
        "duration": "18 Hours",
        "level": "Intermediate"
    },

    # Airflow
    {
        "id": "res-airflow-docs",
        "skillId": "airflow-orchestration",
        "title": "Apache Airflow Core Concepts & Tutorial",
        "url": "https://airflow.apache.org/docs/apache-airflow/stable/tutorial/index.html",
        "provider": "Apache Software Foundation",
        "type": "Official Tutorial",
        "is_free": True,
        "duration": "15 Hours",
        "level": "Advanced"
    }
]
