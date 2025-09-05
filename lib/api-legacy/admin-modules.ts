import adminApiClient from "./admin-client";
import { createAuthenticatedRequest } from "./admin-client";
import { getSession } from "next-auth/react";

export interface Module {
  id: number;
  name: string;
  description: string;
  status: "enabled" | "disabled" | "uninstalled";
  canDisable: boolean;
  canUninstall: boolean;
  conflicts: string[] | null;
}

export interface ModuleResponse {
  data: Module[];
  total: number;
}

export const getModules = async (): Promise<ModuleResponse> => {
  const session = await getSession();
  const client = createAuthenticatedRequest(session?.user.accessToken || null);
  const response = await client.get("/api/v1/admin/modules");
  return response.data;
};

export const updateModuleStatus = async (
  id: number,
  status: "enabled" | "disabled"
): Promise<Module> => {
  const session = await getSession();
  const client = createAuthenticatedRequest(session?.user.accessToken || null);
  const response = await client.put(`/api/v1/admin/modules/${id}`, { status });
  // The response should be the updated module object
  return response.data.data || response.data;
};

export const uninstallModule = async (id: number): Promise<void> => {
  const session = await getSession();
  const client = createAuthenticatedRequest(session?.user.accessToken || null);
  await client.delete(`/api/v1/admin/modules/${id}`);
};
