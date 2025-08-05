import { exec, execFileSync } from "child_process";
import { promisify } from "util";
import { getPulumiBin } from "~/server/utils/pulumi-state";

export default defineEventHandler(async (event) => {
  const { projectName, stackName, encodedResourceUrn } = getRouterParams(event);
  const resourceUrn = decodeURIComponent(encodedResourceUrn!);
  const body = await readBody(event);
  const { newName } = body;

  if (!newName || typeof newName !== "string") {
    throw createError({
      statusCode: 400,
      statusMessage: "newName is required and must be a string",
    });
  }

  const fullStackName = `organization/${projectName}/${stackName}`;

  try {
    const stdout = execFileSync(`${getPulumiBin()}`, [
      `state`,
      `rename`,
      `--stack`,
      fullStackName,
      resourceUrn,
      newName,
    ]).toString();
    return {
      success: true,
      message: `Resource '${resourceUrn}' renamed to '${newName}'`,
      stdout: stdout.trim(),
    };
  } catch (error: any) {
    console.error("Error renaming resource:", error);
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to rename resource: ${error.message}`,
    });
  }
});
