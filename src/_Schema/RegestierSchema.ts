
import * as zod from "zod"


 export const Regestierschema = zod.object({
          name: zod.string().nonempty('name is required').min(3 , 'name is at least 3 characters')
          .max(7 , 'name is at most 7 characters'),
        username: zod.string().nonempty('user name is required')
          .regex(/^[a-zA-Z0-9._%+-]+$/ , 'invalid user name').max(10,'max characters is 10').min(5, 'min characters is 5'),
          email: zod.string().nonempty('email is required')
          .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ , 'invalid email'),
          

          password: zod.string().nonempty('password is required')
          .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, 'password is invailid'),
          dateOfBirth: zod.coerce.date('date of birth is required').refine((value)=>{
            const userDate = value.getFullYear()
            const currentYear = new Date().getFullYear()
            const userAge = currentYear - userDate ;
            return userAge >= 20 ;
          } , 'you must be at least 20 years old'),

          gender:zod.string().nonempty('gender is required'),

          
          rePassword: zod.string().nonempty('repassword is required')
        }).refine((data)=> data.password === data.rePassword ,{path:['rePassword'] , message:'repassword incorrect'}) ;
