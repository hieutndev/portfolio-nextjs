const ROUTE_PATH = {
    ADMIN: {
        DASHBOARD: {
            INDEX: "/admin/dashboard",
        },
        ACCOUNT: {
            INDEX: "/admin/accounts",
        },
        EDUCATION: {
            INDEX: "/admin/educations",
            NEW: "/admin/educations/create",
            DETAILS: (educationId: string | number) => `/admin/educations/${educationId}`,
            UPDATE: (educationId: string | number) => `/admin/educations/${educationId}/edit`,
        },
        CERTIFICATION: {
            INDEX: "/admin/certification",
            NEW: "/admin/certification/new",
            DETAILS: (certId: string | number) => `/admin/certification/${certId}`,
        },
        EMPLOYMENT: {
            INDEX: "/admin/employments",
            NEW: "/admin/employments/new",
            DETAILS: (employmentId: string | number) => `/admin/employments/${employmentId}`,
        },
        PROJECT: {
            INDEX: "/admin/projects",
            NEW: "/admin/projects/new",
            NEW_GROUP: "/admin/projects/new-group",
            DETAILS: (projectId: string | number) => `/admin/projects/${projectId}`,
            EDIT: (projectId: string | number) => `/admin/projects/${projectId}/update`,
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
        SIGN_IN: "/sign-in",
        SIGN_UP: "/sign-up",
        SIGN_OUT: "/sign-out",
        RESET_PASSWORD: "/reset-password",
        CHANGE_PASSWORD: "/change-password",
        VERIFY_EMAIL: "/verify-email",
    },
};

export default ROUTE_PATH;
