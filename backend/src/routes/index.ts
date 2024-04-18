import { Router } from "express";
import organisationRouter from './organizations';
import departmentRouter from './departments';
import messagesRouter from './messages';
import tasksRouter from './tasks';

const router = Router();

router.use(organisationRouter);
router.use(departmentRouter);
router.use(messagesRouter);
router.use(tasksRouter);

export default router;