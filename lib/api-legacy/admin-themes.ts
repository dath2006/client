import adminApiClient from "./admin-client";
import { createAuthenticatedRequest } from "./admin-client";
import { getSession } from "next-auth/react";

export interface Theme {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
}

export interface ThemeResponse {
  data: Theme[];
  total: number;
}

export const getThemes = async (): Promise<ThemeResponse> => {
  const session = await getSession();
  const client = createAuthenticatedRequest(session?.user.accessToken || null);
  const response = await client.get("/api/v1/admin/themes");
  return response.data;
};

export const activateTheme = async (id: number): Promise<Theme> => {
  const session = await getSession();
  const client = createAuthenticatedRequest(session?.user.accessToken || null);
  const response = await client.put(`/api/v1/admin/themes/${id}/activate`, {});
  // The response should be the updated theme object
  return response.data.data || response.data;
};
