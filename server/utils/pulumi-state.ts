import { execFileSync, execSync } from "child_process";
import type { GetStackResponse, Project, Resource, SimpleStack } from "~/types";

export interface StateData {
  deployment: {
    resources: Resource[];
  };
}

export const getPulumiBin = () => execSync(`which pulumi`).toString().trim();

export const listStacks = async (projectName: string) =>
  JSON.parse(
    execFileSync(`${getPulumiBin()}`, [
      "stack",
      "ls",
      "--project",
      projectName,
      "--json",
    ]).toString()
    ) as SimpleStack[];

export const listProjects = async () =>
  JSON.parse(
    execFileSync(`${getPulumiBin()}`, ["project", "ls", "--json"]).toString()
  ) as Project[];

export const getStack = async (
  stackName: string
) => {
  try {
    const stackResources = JSON.parse(
      execFileSync(`${getPulumiBin()}`, [
        `stack`,
        `export`,
        `--stack`,
        stackName,
      ]).toString()
    ) as StateData;
    const stackOutputs = JSON.parse(
      execFileSync(`${getPulumiBin()}`, [
        `stack`,
        `output`,
        `--json`,
      ]).toString()
    ) as Record<string, string>;

    return {
      resources: stackResources.deployment.resources,
      outputs: stackOutputs,
    } as GetStackResponse;

  } catch (error) {
    console.error("Error getting stack:", error);
    throw error;
  }
};
