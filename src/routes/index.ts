import { Router } from 'express';
import webflowRouter from '@/routes/webflow.routes';

const router = Router();

router.use('/webflow', webflowRouter);

export default router;
