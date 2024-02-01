interface RegisterType {
    type: string,
    name: string,
    id: string,
    placeholder: string, 
}

export const RegisterInputs : RegisterType[] = [
    {
        type: "text",
        name: "firstname",
        id: "firstname",
        placeholder : "Enter your first name"
    },
    {
        type: "text",
        name: "lastname",
        id: "lastname",
        placeholder : "Enter your last name"
    },
    {
        type: "text",
        name: "username",
        id: "username",
        placeholder : "Enter your username"
    },
    {
        type: "email",
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

