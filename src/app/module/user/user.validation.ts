import z from "zod";

const createValidationSchema=z.object({
    password:z.string,
    patient:{
        name:z.string({
            error:"Name is Requierd"
        }),
        email:z.string({
            error:"email is Requierd"
        })
    }
})
