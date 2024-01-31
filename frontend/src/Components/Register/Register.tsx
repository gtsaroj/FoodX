import React, { ChangeEvent, FormEvent, useState } from "react";
import { RegisterInputs } from "./RegisterType";

interface ValidationType {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
  confirmpassword: string;
}

const Register: React.FC = () => {
  const [RegisterValue, setRegisterValue] = useState<ValidationType>({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
    confirmpassword: "",
  });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    inputField: string
  ) => {
    setRegisterValue({ ...RegisterValue, [inputField]: e.target.value });
  };

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (RegisterValue.password !== RegisterValue.confirmpassword)
        return new Error("Password did not match");

      const { firstname, lastname, username, email, password } = RegisterValue;
      const ValidateData = {
        firstname,
        lastname,
        username,
        email,
        password,
      };

      console.log(ValidateData);
    } catch (error) {
      console.error(`Failed while sending form : ${error}`);
    }
  };
  return (
    <div>
      <div></div>
      <div>
        <form action="" onSubmit={handleFormSubmit}>
          {RegisterInputs?.map((input, index) => (
            <div key={index}>
              <label htmlFor={input.name}></label>
              <input
                type={input.type}
                placeholder={input.placeholder}
                id={input.id}
                value={RegisterValue[input.name as keyof ValidationType]}
                onChange={(e) =>
                  handleInputChange(e, input.name as keyof ValidationType)
                }
              />
            </div>
          ))}
          <button type="submit"> submit</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
