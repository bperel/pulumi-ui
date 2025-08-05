import { defineStore } from "pinia";
import type { GetStackResponse, Project, SimpleStack } from "~/types";

export interface PulumiResource {
  urn: string;
  type: string;
  name: string;
  parent?: string;
  dependencies?: string[];
  properties?: Record<string, any>;
}

export interface PulumiStack {
  name: string;
  project: string;
  resources: PulumiResource[];
  lastUpdate?: string;
}

export const usePulumiStore = defineStore("pulumi", () => {
  const projects = ref<Project[]>([]);
  const currentProject = ref<Project>();

  const stacks = ref<SimpleStack[]>([]);
  const currentStack = ref<SimpleStack>();

  const currentStackDetails = ref<GetStackResponse>();
  const loading = ref(false);
  const error = ref<string | null>(null);

  const getStackByName = (name: string) =>
    stacks.value.find((stack) => stack.name === name);

  const getResourcesByType = (type: string) => {
    if (!currentStackDetails.value) return [];
    return (
      currentStackDetails.value?.resources.filter(
        (resource) => resource.type === type
      ) || []
    );
  };

  const fetchProjects = async () => {
    try {
      const data = await $fetch("/api/projects");
      projects.value = data;
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const fetchStacks = async () => {
    try {
      console.log("Fetching stacks:", currentProject.value!.name);
      const data = await $fetch(`/api/projects/${currentProject.value!.name}`);
      console.log("Stack data received:", data);
      stacks.value = data;
    } catch (error) {
      console.error("Error fetching stack:", error);
    }
  };

  const fetchStackResources = async () => {
    loading.value = true;
    error.value = null;

    try {
      const response = await $fetch(
        `/api/projects/${currentProject.value!.name}/stacks/${
          currentStack.value!.name
        }`
      );
      currentStackDetails.value = response;
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Failed to fetch stack resources";
    } finally {
      loading.value = false;
    }
  };

  const clearCurrentStack = () => {
    currentStack.value = undefined;
  };

  const clearError = () => {
    error.value = null;
  };

  return {
    fetchProjects,
    projects: readonly(projects),
    currentProject,

    fetchStacks,
    stacks: readonly(stacks),
    currentStack,

    loading: readonly(loading),
    error: readonly(error),

    getStackByName,
    getResourcesByType,

    fetchStackResources,
    clearCurrentStack,
    clearError,
  };
});
