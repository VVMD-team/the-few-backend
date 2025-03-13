import { Request, Response, NextFunction } from 'express';
import { envVars } from '@/config/env';
import { webflowApiUrl, webflowApiToken } from '@/config/webflow';

import { schemaGetItemByIdAndPassword } from '@/schemas/webflow';

import { ValidationError } from 'yup';
import { formatYupError } from '@/utils/helpers';

export default async function getProjectFiles(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { password, slug } = req.body;

    await schemaGetItemByIdAndPassword.validate({ password, slug });

    const projectsUrl = `${webflowApiUrl}/collections/${envVars.WEBFLOW_PROJECTS_COLLECTION_ID}/items/live`;

    const response = await fetch(projectsUrl, {
      method: 'GET',
      headers: {
        Authorization: webflowApiToken,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error fetching projects collection: ${response.statusText}`,
      );
    }

    const { items } = await response.json();

    const project = items.find(
      (project: any) => project.fieldData.slug === slug,
    );

    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    const projectPassword = project.fieldData.password;

    if (projectPassword && projectPassword !== password) {
      res.status(403).json({ message: 'Invalid password' });
      return;
    }

    const fileIds = project.fieldData.files || null;

    if (!fileIds || fileIds.length === 0) {
      res.status(404).json({ message: 'No files found for this project' });
      return;
    }

    const files = await Promise.all(
      fileIds.map(async (fileItemId: string) => {
        const fileItemUrl = `${webflowApiUrl}/collections/${envVars.WEBFLOW_FILES_COLLECTION_ID}/items/${fileItemId}`;

        const fileResponse = await fetch(fileItemUrl, {
          method: 'GET',
          headers: {
            Authorization: webflowApiToken,
            'Content-Type': 'application/json',
          },
        });

        if (!fileResponse.ok) {
          throw new Error(`Error fetching file: ${fileResponse.statusText}`);
        }

        const file = await fileResponse.json();

        return file;
      }),
    );

    res.status(200).json({ files });
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(400).json(formatYupError(error));
      return;
    }

    next(error);
  }
}
