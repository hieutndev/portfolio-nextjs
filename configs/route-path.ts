const ROUTE_PATH = {
    ADMIN: {
        DASHBOARD: {
            INDEX: "/admin/dashboard",
        },
        ACCOUNT: {
            INDEX: "/admin/accounts",
        },
        EDUCATION: {
            INDEX: "/admin/education",
            NEW: "/admin/education/new",
            DETAILS: (educationId: string | number) => `/admin/education/${educationId}`,
            UPDATE: (educationId: string | number) => `/admin/education/${educationId}/update`,
        },
        CERTIFICATION: {
            INDEX: "/admin/certification",
            NEW: "/admin/certification/new",
            DETAILS: (certId: string | number) => `/admin/certification/${certId}`,
        },
        EMPLOYMENT: {
            INDEX: "/admin/employment",
            NEW: "/admin/employment/new",
            DETAILS: (employmentId: string | number) => `/admin/employment/${employmentId}`,
        },
        PROJECT: {
            INDEX: "/admin/projects",
            NEW: "/admin/projects/new",
            NEW_GROUP: "/admin/projects/new-group",
            DETAILS: (projectId: string | number) => `/admin/projects/${projectId}`,
            EDIT: (projectId: string | number) => `/admin/projects/${projectId}/edit`,
        },
        APP: {
            INDEX: "/admin/apps",
        },
    },
    CLIENT: {
        INDEX: "/",
        MY_APPS: "/my-apps",
        PROJECT: {
            INDEX: "/projects",
            DETAILS: (projectId: string | number) => `/projects/${projectId}`,
        },
    },
    AUTH: {
        LOGIN: "/sign-in",
        SIGN_UP: "/sign-up",
        SIGN_OUT: "/sign-out",
        RESET_PASSWORD: "/reset-password",
        CHANGE_PASSWORD: "/change-password",
        VERIFY_EMAIL: "/verify-email",
    },
};

export default ROUTE_PATH;
