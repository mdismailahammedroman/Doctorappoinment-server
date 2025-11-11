import express from 'express';
import { UserRouter } from '../app/module/user/user.router';
import { authRoute } from '../app/module/auth/auth.route';
import { ScheduleRoutes } from '../app/module/schedule/shedule.route';
const router=express.Router()
const moduleRouter=[
    {
        path:"/user",
        route:UserRouter
    },
    {
        path:"/auth",
        route:authRoute
    },
    {
        path:"/shedule",
        route:ScheduleRoutes
    },
]

moduleRouter.forEach(route=>router.use(route.path,route.route))


export default router;