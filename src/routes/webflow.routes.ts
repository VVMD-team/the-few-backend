import { Router } from 'express';
import * as WebflowController from '@/controllers/webflow-controller';

const webflowRouter = Router();

webflowRouter.post('/project-files', WebflowController.getProjectFiles);

export default webflowRouter;
