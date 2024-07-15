import { Router } from "express";
import organisationRouter from './organizations';
import departmentRouter from './departments';
import messagesRouter from './messages';
import tasksRouter from './tasks';
import projectRouter from './projects';

const router = Router();

router.use(organisationRouter);
router.use(departmentRouter);
router.use(messagesRouter);
router.use(tasksRouter);
router.use(projectRouter);

export default router;