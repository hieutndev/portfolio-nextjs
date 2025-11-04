import { TApp } from "@/types/application";
import { TBlog, TBlogCategory } from "@/types/blog";
import { TCertification } from "@/types/certification";
import { TEducation } from "@/types/education";
import { TEmployment } from "@/types/employment";
import { TProject, TProjectGroup } from "@/types/project";
import { TUser } from "@/types/user";

const API_ROUTE = {
  PROJECT: {
    GET_ALL: "/projects",
    GET_TOP_VIEWED: "/projects/top-viewed",
    GET_ONE: (projectId: TProject["id"] | string) => `/projects/${projectId}`,
    NEW: "/projects",
    GET_ALL_GROUP: "/projects/groups",
    NEW_GROUP: "/projects/groups",
    UPDATE_GROUP: (groupId: TProjectGroup["group_id"]) =>
      `/projects/groups/${groupId}`,
    SOFT_DELETE_GROUP: (groupId: TProjectGroup["group_id"]) =>
      `/projects/groups/${groupId}/delete`,
    RECOVER_GROUP: (groupId: TProjectGroup["group_id"]) =>
      `/projects/groups/${groupId}/recover`,
    DELETE_GROUP: (groupId: TProjectGroup["group_id"]) =>
      `/projects/groups/${groupId}`,
    UPDATE_PROJECT: (projectId: TProject["id"] | string) =>
      `/projects/${projectId}`,
    DELETE_PROJECT: (projectId: TProject["id"] | string) =>
      `/projects/${projectId}`,
  },
  EDUCATION: {
    GET_ALL: "/education",
    GET_ONE: (educationId: TEducation["id"]) => `/education/${educationId}`,
    NEW: "/education",
    UPDATE: (educationId: TEducation["id"]) => `/education/${educationId}`,
    SOFT_DELETE: (educationId: TEducation["id"]) =>
      `/education/${educationId}/delete`,
    RECOVER: (educationId: TEducation["id"]) =>
      `/education/${educationId}/recover`,
    DELETE: (educationId: TEducation["id"]) => `/education/${educationId}`,
  },
  CERTIFICATION: {
    GET_ALL: "/certification",
    GET_ONE: (certId: TCertification["id"]) => `/certification/${certId}`,
    NEW: "/certification",
    UPDATE: (certId: TCertification["id"]) => `/certification/${certId}`,
    SOFT_DELETE: (certId: TCertification["id"]) =>
      `/certification/${certId}/delete`,
    RECOVER: (certId: TCertification["id"]) =>
      `/certification/${certId}/recover`,
    DELETE: (certId: TCertification["id"]) => `/certification/${certId}`,
  },
  EMPLOYMENT: {
    GET_ALL: "/employment",
    GET_ONE: (employmentId: TEmployment["id"]) => `/employment/${employmentId}`,
    NEW: "/employment",
    UPDATE: (employmentId: TEmployment["id"]) => `/employment/${employmentId}`,
    SOFT_DELETE: (employmentId: TEmployment["id"]) =>
      `/employment/${employmentId}/delete`,
    RECOVER: (employmentId: TEmployment["id"]) =>
      `/employment/${employmentId}/recover`,
    DELETE: (employmentId: TEmployment["id"]) => `/employment/${employmentId}`,
  },
  ACCOUNT: {
    GET_ALL: "/accounts",
    GET_ONE: (accountId: TUser["user_id"]) => `/accounts/${accountId}`,
    SIGN_UP: "/accounts/sign-up",
    SIGN_IN: "/accounts/sign-in",
    RFTK: "/accounts/rftk",
    CHECK_SESSION: "/accounts/check-session",
    ACTIVE_STATUS: (accountId: TUser["user_id"]) =>
      `/accounts/${accountId}/active`,
    SET_PASSWORD: (accountId: TUser["user_id"]) =>
      `/accounts/${accountId}/set-password`,
  },
  APP: {
    GET_ALL: "/apps",
    GET_ONE: (appId: TApp["app_id"]) => `/apps/${appId}`,
    NEW: "/apps",
    UPDATE_INFO: (appId: TApp["app_id"]) => `/apps/${appId}`,
    UPDATE_DISPLAY: `/apps/display-status`,
    DELETE: (appId: TApp["app_id"]) => `/apps/${appId}`,
  },
  S3: {
    UPLOAD_IMAGE: "/s3",
    GET_IMAGE: (key: string) => `/s3?key=${key}`,
  },
  ANALYTICS: {
    GET_DASHBOARD: "/analytics/dashboard",
    GET_TRAFFIC: "/analytics/traffic",
    GET_REVIEW_INSIGHTS: "/analytics/review-insights",
    GET_TOP_PAGES: "/analytics/top-pages",
    GET_TOP_QUERIES: "/analytics/top-queries",
  },
  SETTINGS: {
    GET_SETTINGS : "/settings",
    UPDATE_SETTINGS : "/settings",
  },
  BLOG: {
    GET_ALL: "/blogs",
    GET_TOP_VIEWED: "/blogs/top-viewed",
    GET_ONE: (blogId: TBlog["id"] | string, isPreview: boolean = false) => `/blogs/${blogId}${isPreview ? '?preview=true' : ''}`,
    NEW: "/blogs",
    UPDATE_BLOG: (blogId: TBlog["id"] | string) => `/blogs/${blogId}`,
    DELETE_BLOG: (blogId: TBlog["id"] | string) => `/blogs/${blogId}`,
    SOFT_DELETE_BLOG: (blogId: TBlog["id"] | string) => `/blogs/${blogId}/delete`,
    RECOVER_BLOG: (blogId: TBlog["id"] | string) => `/blogs/${blogId}/recover`,
    GET_ALL_CATEGORIES: "/blogs/categories",
    NEW_CATEGORY: "/blogs/categories",
    UPDATE_CATEGORY: (categoryId: TBlogCategory["category_id"]) => `/blogs/categories/${categoryId}`,
    DELETE_CATEGORY: (categoryId: TBlogCategory["category_id"]) => `/blogs/categories/${categoryId}`,
    SOFT_DELETE_CATEGORY: (categoryId: TBlogCategory["category_id"]) => `/blogs/categories/${categoryId}/delete`,
    RECOVER_CATEGORY: (categoryId: TBlogCategory["category_id"]) => `/blogs/categories/${categoryId}/recover`,
  }
};

export default API_ROUTE;
