export default [
    {
        path: '/job-postings',
        name: 'jobPostingList',
        component: () => import('./JobPostingList.vue'),
    },
    {
        path: '/job-postings/create',
        name: 'jobPostingCreate',
        component: () => import('./JobPostingCreate.vue'),
    },
    {
        path: '/job-postings/:id',
        name: 'jobPostingDetail',
        component: () => import('./JobPostingDetail.vue'),
        props: true,
    },
];