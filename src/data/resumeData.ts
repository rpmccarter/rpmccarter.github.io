export type Position = {
    company: string
    title: string
    location: string
    start: PositionDate
    end?: PositionDate
    bullets: string[]
    technologies?: typeof technologies[number][]
}

const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
] as const

type PositionDate = {
    month: typeof months[number]
    year: string
}

export const technologies = [
    'TypeScript',
    'Sequelize',
    'Express',
    'Python',
    'React',
    'Redux',
    'Swift',
    'Jest',
    'SQL',
    'AWS',
] as const

export const positions: Position[] = [
    {
        company: 'Retool',
        title: 'software engineer, full stack',
        location: 'san francisco, CA',
        start: {
            month: 'July',
            year: '2022'
        },
        end: {
            month: 'March',
            year: '2023'
        },
        bullets: [
            'expanded in-house feature flagging framework to enable targeting specific customers by plan in staged rollout',
            'implemented passwordless login across all mobile devices and reduced friction in SSO account creation flows',
            'drove product adoption by curating a first experience for new Retool Mobile users',
            'developed user-facing sample Retool apps leveraged by go-to-market team in product launches',
        ],
        technologies: [
            'React',
            'TypeScript',
            'Redux',
            'SQL',
            'Jest',
            'Express',
        ],
    },
    {
        company: 'Amazon',
        title: 'software development engineer intern',
        location: 'boston, MA',
        start: {
            month: 'May',
            year: '2021',
        },
        end: {
            month: 'August',
            year: '2021',
        },
        bullets: [
            'automated UI testing of 40 user experiences across 14 Alexa-enabled devices, saving the team at least 4 engineer-hours per week and drastically decreasing human error', 
            'architected and deployed a scalable serverless UI testing solution using AWS’s infrastructure-as-code', 
            'optimized performance for long-term high-volume storage and bursts of computation-intensive traffic', 
        ],
        technologies: [
            'TypeScript',
            'AWS',
            'Jest',
        ]
    },
    {
        company: 'Stelo E-Commerce Startup',
        title: 'lead engineer, full stack',
        location: 'notre dame, IN',
        start: {
            month: 'July',
            year: '2020',
        },
        end: {
            month: 'May',
            year: '2022',
        },
        bullets: [
            'designed/implemented MVP, consisting of iOS app and Python backend, for e-commerce apparel platform',
            'directed product roadmap and feature prioritization by communicating realistic milestones to founders', 
        ],
        technologies: [
            'Swift',
            'Python',
            'Express',
        ]
    },
    {
        company: 'Complex Networks (CoNe) Lab, University of Notre Dame',
        title: 'undergraduate researcher',
        location: 'notre dame, IN',
        start: {
            month: 'May',
            year: '2020',
        },
        end: {
            month: 'July',
            year: '2020',
        },
        bullets: [
            'evaluated network alignment algorithms in the tasks of classification and protein function prediction',
            'tested/validated algorithms for their generalizability to diverse networks and robustness to noise',
            'parallelized independent subsampling tasks and automated algorithm-specific workflows', 
        ],
        technologies: [
            'Python',
        ]
    },
    {
        company: 'CSE 40883 Introduction to Droid Building',
        title: 'teaching assistant',
        location: 'notre dame, IN',
        start: {
            month: 'January',
            year: '2020',
        },
        end: {
            month: 'November',
            year: '2020',
        },
        bullets: [
            'helped students understand the paradigms of embedded systems, e.g. black-box programming, event-driven programming, and working with imperfect data (specifically, data from imperfect physical systems/sensors)',
        ]
    }
]