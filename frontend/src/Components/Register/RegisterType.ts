interface RegisterType {
    type: string,
    name: string,
    id: string,
    placeholder: string, 
}

export const RegisterInputs : RegisterType[] = [
    {
        type: "text",
        name: "email",
        id: "email",
        placeholder : "Enter your email"
    },
    {
        type: "text",
        name: "password",
        id: "password",
        placeholder : "Enter your password"
    },
    {
        type: "text",
        name: "confirmpassword",
        id: "confirmpassword",
        placeholder : "Enter your confirmpassword"
    }

]

