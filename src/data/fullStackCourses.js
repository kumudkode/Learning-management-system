export const fullStackCourses = [
    {
      id: 'course-fs-1',
      title: 'Full Stack JavaScript Bootcamp',
      description: 'Comprehensive training in modern JavaScript development covering frontend and backend technologies. Build real-world projects with React, Node.js, Express, and MongoDB.',
      shortDescription: 'Complete JavaScript stack from frontend to backend',
      category: 'programming',
      coverImage: '/images/courses/full-stack-js.jpg',
      instructor: {
        id: 'instr-1',
        name: 'Sarah Johnson',
        avatar: '/images/instructors/sarah.jpg',
        title: 'Senior Software Engineer',
        company: 'Tech Innovators'
      },
      price: 89.99,
      isFree: false,
      duration: '12 weeks',
      level: 'intermediate',
      isPublished: true,
      isFeatured: true,
      enrollmentCount: 1458,
      lessonsCount: 75,
      averageRating: 4.8,
      ratingCount: 312,
      isNew: false,
      tags: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Express'],
      highlights: [
        '75+ hours of video content',
        '5 real-world projects',
        'Certificate of completion',
        'Job placement assistance',
        'Lifetime access to materials'
      ]
    },
    {
      id: 'course-fs-2',
      title: 'MERN Stack Project: Build an E-Commerce Platform',
      description: 'Learn by building a fully functional e-commerce platform using MongoDB, Express, React and Node.js. Implement user authentication, product management, shopping cart, payment processing, and more.',
      shortDescription: 'Build a complete online store with the MERN stack',
      category: 'programming',
      coverImage: '/images/courses/mern-ecommerce.jpg',
      instructor: {
        id: 'instr-2',
        name: 'Michael Chen',
        avatar: '/images/instructors/michael.jpg',
        title: 'Full Stack Developer',
        company: 'WebScale Solutions'
      },
      price: 69.99,
      isFree: false,
      duration: '8 weeks',
      level: 'advanced',
      isPublished: true,
      isFeatured: false,
      enrollmentCount: 843,
      lessonsCount: 48,
      averageRating: 4.6,
      ratingCount: 156,
      isNew: false,
      tags: ['MERN', 'E-Commerce', 'React', 'Node.js', 'MongoDB', 'Stripe'],
      highlights: [
        'Learn by building a complete project',
        'Deploy to cloud platforms',
        'Implement Stripe payment processing',
        'SEO optimization techniques',
        'Responsive design principles'
      ]
    },
    {
      id: 'course-fs-3',
      title: 'Next.js & TypeScript: Full Stack Development',
      description: 'Master modern full stack development using Next.js and TypeScript. Build server-side rendered applications with static site generation, API routes, and seamless database integration.',
      shortDescription: 'Modern web development with Next.js and TypeScript',
      category: 'programming',
      coverImage: '/images/courses/nextjs-typescript.jpg',
      instructor: {
        id: 'instr-3',
        name: 'Emma Rodriguez',
        avatar: '/images/instructors/emma.jpg',
        title: 'Frontend Architect',
        company: 'NextLevel Technologies'
      },
      price: 79.99,
      isFree: false,
      duration: '10 weeks',
      level: 'intermediate',
      isPublished: true,
      isFeatured: true,
      enrollmentCount: 1052,
      lessonsCount: 62,
      averageRating: 4.9,
      ratingCount: 278,
      isNew: true,
      tags: ['Next.js', 'TypeScript', 'React', 'Vercel', 'Prisma', 'TailwindCSS'],
      highlights: [
        'Server-side rendering techniques',
        'Type-safe development',
        'Database integration with Prisma',
        'Authentication strategies',
        'Automated testing with Jest and Cypress'
      ]
    },
    {
      id: 'course-fs-4',
      title: 'Django & React: Full Stack Web Development',
      description: 'Build powerful web applications by combining Django\'s backend capabilities with React\'s frontend features. Learn REST API development, authentication, deployment, and more.',
      shortDescription: 'Combine Python and JavaScript for modern web apps',
      category: 'programming',
      coverImage: '/images/courses/django-react.jpg',
      instructor: {
        id: 'instr-4',
        name: 'David Miller',
        avatar: '/images/instructors/david.jpg',
        title: 'Python Developer',
        company: 'CodeCraft Labs'
      },
      price: 74.99,
      isFree: false,
      duration: '9 weeks',
      level: 'intermediate',
      isPublished: true,
      isFeatured: false,
      enrollmentCount: 726,
      lessonsCount: 53,
      averageRating: 4.7,
      ratingCount: 185,
      isNew: false,
      tags: ['Django', 'React', 'Python', 'RESTful API', 'PostgreSQL'],
      highlights: [
        'Django REST framework mastery',
        'JWT authentication implementation',
        'Database design best practices',
        'Deployment to AWS',
        'Performance optimization techniques'
      ]
    },
    {
      id: 'course-fs-5',
      title: 'Full Stack Web Development with Laravel and Vue.js',
      description: 'Master the powerful combination of Laravel and Vue.js to build modern, scalable web applications. Learn advanced PHP concepts, RESTful APIs, authentication, and single page applications.',
      shortDescription: 'Build elegant applications with Laravel and Vue.js',
      category: 'programming',
      coverImage: '/images/courses/laravel-vue.jpg',
      instructor: {
        id: 'instr-5',
        name: 'Jessica Wong',
        avatar: '/images/instructors/jessica.jpg',
        title: 'Senior Web Developer',
        company: 'Artisan Web Studios'
      },
      price: 69.99,
      isFree: false,
      duration: '8 weeks',
      level: 'intermediate',
      isPublished: true,
      isFeatured: false,
      enrollmentCount: 593,
      lessonsCount: 47,
      averageRating: 4.6,
      ratingCount: 137,
      isNew: false,
      tags: ['Laravel', 'Vue.js', 'PHP', 'MySQL', 'REST API'],
      highlights: [
        'Laravel ecosystem mastery',
        'Vue.js component architecture',
        'Authentication and authorization',
        'Database management with Eloquent ORM',
        'Real-time features with Laravel Echo'
      ]
    }
  ];
  
  export const freeCourses = [
    {
      id: 'course-free-1',
      title: 'Introduction to Web Development',
      description: 'Learn the fundamentals of web development including HTML, CSS, and basic JavaScript. Perfect for absolute beginners looking to start their coding journey.',
      shortDescription: 'Start your coding journey with web fundamentals',
      category: 'programming',
      coverImage: '/images/courses/intro-webdev.jpg',
      instructor: {
        id: 'instr-6',
        name: 'Alex Turner',
        avatar: '/images/instructors/alex.jpg',
        title: 'Web Development Instructor',
        company: 'CodeStart Academy'
      },
      price: 0,
      isFree: true,
      duration: '4 weeks',
      level: 'beginner',
      isPublished: true,
      isFeatured: false,
      enrollmentCount: 5832,
      lessonsCount: 28,
      averageRating: 4.5,
      ratingCount: 1247,
      isNew: false
    },
    {
      id: 'course-free-2',
      title: 'Git & GitHub Crash Course',
      description: 'Learn essential version control skills with Git and GitHub. Master branching, merging, pull requests, and collaboration workflows - crucial knowledge for every developer.',
      shortDescription: 'Essential version control for developers',
      category: 'programming',
      coverImage: '/images/courses/git-github.jpg',
      instructor: {
        id: 'instr-7',
        name: 'Priya Patel',
        avatar: '/images/instructors/priya.jpg',
        title: 'DevOps Engineer',
        company: 'CloudScale Systems'
      },
      price: 0,
      isFree: true,
      duration: '2 weeks',
      level: 'beginner',
      isPublished: true,
      isFeatured: false,
      enrollmentCount: 4217,
      lessonsCount: 15,
      averageRating: 4.7,
      ratingCount: 895,
      isNew: false
    }
  ];