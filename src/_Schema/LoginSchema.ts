
import * as zod from "zod"


 export const Loginschema = zod.object({
          email: zod.string().nonempty('email is required')
          .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ , 'invalid email'),
          password: zod.string().nonempty('password is required')
          .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, 'password is invailid'),
        })
