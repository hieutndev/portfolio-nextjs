import { TApp } from "@/types/application";
import { TCertification } from "@/types/certification";
import { TEducation } from "@/types/education";
import { TEmployment } from "@/types/employment";
import { TProject, TProjectGroup } from "@/types/project";
import { TUser } from "@/types/user";

const API_ROUTE = {
  PROJECT: {
    GET_ALL: "/projects",
    GET_ONE: (projectId: TProject["id"]) => `/projects/${projectId}`,
    NEW: "/projects",
    GET_ALL_GROUP: "/projects/groups",
    NEW_GROUP: "/projects/groups",
    UPDATE_GROUP: (groupId: TProjectGroup['group_id']) => `/projects/groups/${groupId}`,
    SOFT_DELETE_GROUP: (groupId: TProjectGroup['group_id']) => `/projects/groups/${groupId}/delete`,
    RECOVER_GROUP: (groupId: TProjectGroup['group_id']) => `/projects/groups/${groupId}/recover`,
    DELETE_GROUP: (groupId: TProjectGroup['group_id']) => `/projects/groups/${groupId}`,
    UPDATE_PROJECT: (projectId: TProjectGroup['group_id']) => `/projects/${projectId}`,
    DELETE_PROJECT: (projectId: TProjectGroup['group_id']) => `/projects/${projectId}`,
  },
  EDUCATION: {
    GET_ALL: "/education",
    GET_ONE: (educationId: TEducation['id']) => `/education/${educationId}`,
    NEW: "/education",
    UPDATE: (educationId: TEducation['id']) => `/education/${educationId}`,
    SOFT_DELETE: (educationId: TEducation['id']) => `/education/${educationId}/delete`,
    RECOVER: (educationId: TEducation['id']) => `/education/${educationId}/recover`,
    DELETE: (educationId: TEducation['id']) => `/education/${educationId}`,
  },
  CERTIFICATION: {
    GET_ALL: "/certification",
    GET_ONE: (certId: TCertification['id']) => `/certification/${certId}`,
    NEW: "/certification",
    UPDATE: (certId: TCertification['id']) => `/certification/${certId}`,
    SOFT_DELETE: (certId: TCertification['id']) => `/certification/${certId}/delete`,
    RECOVER: (certId: TCertification['id']) => `/certification/${certId}/recover`,
    DELETE: (certId: TCertification['id']) => `/certification/${certId}`,
  },
  EMPLOYMENT: {
    GET_ALL: "/employment",
    GET_ONE: (employmentId: TEmployment['id']) => `/employment/${employmentId}`,
    NEW: "/employment",
    UPDATE: (employmentId: TEmployment['id']) => `/employment/${employmentId}`,
    SOFT_DELETE: (employmentId: TEmployment['id']) => `/employment/${employmentId}/delete`,
    RECOVER: (employmentId: TEmployment['id']) => `/employment/${employmentId}/recover`,
    DELETE: (employmentId: TEmployment['id']) => `/employment/${employmentId}`,
  },
  ACCOUNT: {
    GET_ALL: "/accounts",
    GET_ONE: (accountId: TUser['user_id']) => `/accounts/${accountId}`,
    SIGN_UP: "/accounts/sign-up",
    SIGN_IN: "/accounts/sign-in",
    RFTK: "/accounts/rftk",
    CHECK_SESSION: "/accounts/check-session",
    ACTIVE_STATUS: (accountId: TUser['user_id']) => `/accounts/${accountId}/active`,
  },
  APP: {
    GET_ALL: "/apps",
    GET_ONE: (appId: TApp['app_id']) => `/apps/${appId}`,
    NEW: "/apps",
    UPDATE_INFO: (appId: TApp['app_id']) => `/apps/${appId}`,
    UPDATE_DISPLAY: `/apps/display-status`,
    DELETE: (appId: TApp['app_id']) => `/apps/${appId}`,
  },
  S3: {
    UPLOAD_IMAGE: "/s3",
    GET_IMAGE: (key: string)=> `/s3?key=${key}`
  }
};

export default API_ROUTE;
