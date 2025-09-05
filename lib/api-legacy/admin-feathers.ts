import adminApiClient from "./admin-client";
import { createAuthenticatedRequest } from "./admin-client";
import { getSession } from "next-auth/react";

export interface Feather {
  id: number;
  name: string;
  description: string;
  status: "enabled" | "disabled";
  canDisable: boolean;
}

export interface FeatherResponse {
  data: Feather[];
  total: number;
}

export const getFeathers = async (): Promise<FeatherResponse> => {
  const session = await getSession();
  const client = createAuthenticatedRequest(session?.user.accessToken || null);
  const response = await client.get("/api/v1/admin/feathers");
  return response.data;
};

export const updateFeatherStatus = async (
  id: number,
  status: "enabled" | "disabled"
): Promise<Feather> => {
  const session = await getSession();
  const client = createAuthenticatedRequest(session?.user.accessToken || null);
  const response = await client.put(`/api/v1/admin/feathers/${id}`, {
    status,
  });
  // The response should be the updated feather object
  return response.data.data || response.data;
};
