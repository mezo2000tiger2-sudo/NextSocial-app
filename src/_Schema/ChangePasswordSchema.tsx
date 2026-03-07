
import * as zod from "zod"


 export const ChangePasswordSchema = zod.object({
          password: zod.string().nonempty('password is required')
          .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, 'password is invailid'),          
          newPassword: zod.string().nonempty('password is required')
          .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, 'password is invailid'),          
        })
