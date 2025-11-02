import express from 'express';
import { UserRouter } from '../app/module/user/user.router';
const router=express.Router()
const moduleRouter=[
    {
        path:"/user",
        route:UserRouter
    }
]

moduleRouter.forEach(route=>router.use(route.path,route.route))