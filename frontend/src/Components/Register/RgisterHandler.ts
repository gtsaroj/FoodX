export const validateEmail = (email: string) => {
  //TODO: Change this according to college/school.
  const collegeEmail = "texascollege.edu.np";

  const emailAddress = email.toLowerCase().trim();
  const validateCollegeEmail = emailAddress.split("@")[1];
  if (!emailAddress || validateCollegeEmail !== collegeEmail)
    throw new Error("Email is Invalid. Try again.");
  return emailAddress;
};

export const validatePasswordOnChange = (password: string) => {
  const passkey = password.trim();
  if (!passkey) throw new Error("Invalid Password.");

  //Regular Expression
  const lowerCase = new RegExp("(?=.*[a-z])");
  const upperCase = new RegExp("(?=.*[A-Z])");
  const digit = new RegExp("(?=.*\\d)");
  const special = new RegExp("(?=.*[!@#$%^&*])");

  if (!lowerCase.test(passkey))
    throw new Error("Must contain a lowercase character.");
  if (!upperCase.test(passkey))
    throw new Error("Must contain an uppercase character.");
  if (!digit.test(passkey)) throw new Error("Must contain a digit.");
  if (!special.test(passkey))
    throw new Error("Must contain a special character [! @ # $ % ^ & *].");

  return passkey;
};
