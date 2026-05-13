import * as Yup from "yup";
//Talent schemas
export const talentLoginSchema = Yup.object().shape({
  talentEmail: Yup.string()
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Invalid email address"
    )
    .required("This field is required"),
  password: Yup.string().required("Password is required"),
});
//Admin
export const adminLoginSchema = Yup.object().shape({
  email: Yup.string()
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Invalid email address"
    )
    .required("This field is required"),
  password: Yup.string().required("Password is required"),
});
export const talentProfileUpdateSchema = Yup.object().shape({
  talentId: Yup.string().required("This field is required"),

  portfolio: Yup.object().shape({
    mainService: Yup.string().required("This field is required"),
    skills: Yup.array()
      .of(Yup.string())
      .min(1, "Please select at least one skill"),
    levelOfExpertise: Yup.string().required("This field is required"),
    yearsOfExperience: Yup.number().required("This field is required"),
    location: Yup.string().required("This field is required"),
    description: Yup.string()
      .required("This field is required")
      .max(500, "Must be 500 characters or less"),
    linkedInUrl: Yup.string().required("This field is required"),
    // githubUrl: Yup.string().required("This field is required"),
    // websiteUrl: Yup.string().required("This field is required"),
  }),
  //   resourceDetails: Yup.object().shape({
  //     currentEmploymentStatus: Yup.string().required("This field is required"),
  //     nameOfCompany: Yup.string().required("This field is required"),
  //     companyIndustry: Yup.string().required("This field is required"),
  //     jobTitle: Yup.string().required("This field is required"),
  //     periodOfEmployment: Yup.array()
  //       .of(Yup.string())
  //       .required("This field is required"),
  //     jobRoleDescription: Yup.string().required("This field is required"),
  //     institutionAttended: Yup.string().required("This field is required"),
  //     areaOfStudy: Yup.string().required("This field is required"),
  //     degreeType: Yup.string().required("This field is required"),
  //     periodOfStudy: Yup.array()
  //       .of(Yup.string())
  //       .required("This field is required"),
  //       // socials: Yup.array()
  //       // .of(Yup.string())
  //       // .required("This field is required"),
  //       // websiteUrl: Yup.string().required("This field is required"),
  // }),

  profilePic: Yup.mixed().nullable(),
});
export const talentProfileEditSchema = Yup.object().shape({
  talentId: Yup.string().required("This field is required"),

  updateFields: Yup.object().shape({
    fullName: Yup.string().required("This field is required"),
    talentEmail: Yup.string()
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Invalid email address"
      )
      .required("This field is required"),
    talentPhoneNum: Yup.string()
      .matches(/^[0-9]{10,11}$/, "Phone Number must be either 10 digits or 11")
      .required("This field is required"),
    // mainService: Yup.string().required("This field is required"),
    // skills: Yup.array()
    //   .of(Yup.string())
    //   .min(1, "Please select at least one skill"),
    // levelOfExpertise: Yup.string().required("This field is required"),
    // yearsOfExperience: Yup.number().required("This field is required"),
    // location: Yup.string().required("This field is required"),
    description: Yup.string().required("This field is required"),
    // currentEmploymentStatus: Yup.string().required("This field is required"),
    // nameOfCompany: Yup.string().required("This field is required"),
    // companyIndustry: Yup.string().required("This field is required"),
    // jobTitle: Yup.string().required("This field is required"),
    // periodOfEmployment: Yup.array()
    //   .of(Yup.string())
    //   .required("This field is required"),
    // jobRoleDescription: Yup.string().required("This field is required"),
    // institutionAttended: Yup.string().required("This field is required"),
    // areaOfStudy: Yup.string().required("This field is required"),
    // degreeType: Yup.string().required("This field is required"),
    // periodOfStudy: Yup.array()
    //   .of(Yup.string())
    //   .required("This field is required"),
    // socials: Yup.array()
    // .of(Yup.string())
    // .required("This field is required"),
    // websiteUrl: Yup.string().required("This field is required"),
  }),
  profilePic: Yup.mixed().nullable(),
});
export const talentPortfolioEditSchema = Yup.object().shape({
  talentId: Yup.string().required("This field is required"),

  updateFields: Yup.object().shape({
    mainService: Yup.string().required("This field is required"),
    skills: Yup.array()
      .of(Yup.string())
      .min(1, "Please select at least one skill"),
    levelOfExpertise: Yup.string().required("This field is required"),
    // otherProfileUrl: Yup.string().required("This field is required"),
    linkedInUrl: Yup.string().required("This field is required"),
    githubUrl: Yup.string().required("This field is required"),
  }),
});
const employmentHistoryObject = Yup.object().shape({
  role: Yup.string().required("This field is required"),
  company: Yup.string().required("This field is required"),
  industry: Yup.string().required("This field is required"),
  jobType: Yup.string().required("This field is required"),
  startDate: Yup.date()
    .required("Start date is required")
    .typeError("Start date must be a valid date"),
  endDate: Yup.date()
    .required("End date is required")
    .typeError("End date must be a valid date")
    .min(Yup.ref("startDate"), "End date cannot be before start date"),
  jobDescription: Yup.string().required("This field is required"),
});

export const employmentEditSchema = Yup.object().shape({
  talentId: Yup.string().required("This field is required"),
  updateFields: Yup.object().shape({
    employmentHistory: Yup.array(employmentHistoryObject),
  }),
});

export const talentRegisterSchema = Yup.object().shape({
  fullName: Yup.string().required("This field is required"),
  talentEmail: Yup.string()
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Invalid email address"
    )
    .required("This field is required"),
  talentPhoneNum: Yup.string()
    .matches(/^[0-9]{10,11}$/, "Phone Number must be either 10 digits or 11")
    .required("This field is required"),
  password: Yup.string()
    .required("This  is a required")
    .min(8, "Password must be at least 8 characters long")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
      "Password must contain at least one special character"
    ),
  confirmpassword: Yup.string()
    .required("Confirm password is required")
    .oneOf([Yup.ref("password")], "Passwords do not match"),
});

export const talentforgotSchema = Yup.object().shape({
  talentEmail: Yup.string()
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Invalid email address"
    )
    .required("This field is required"),
});
export const talentforgotResetSchema = Yup.object().shape({
  newPassword: Yup.string()
    .required("This  is a required")
    .min(8, "Password must be at least 8 characters long")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
      "Password must contain at least one special character"
    ),
  confirmNewPassword: Yup.string()
    .required("Confirm password is required")
    .oneOf([Yup.ref("newPassword")], "Passwords do not match"),
});

// company schema validation

export const companyLoginSchema = Yup.object().shape({
  companyEmail: Yup.string()
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Invalid email address"
    )
    .required("This field is required"),
  password: Yup.string().required("Password is required"),
});

export const companyRegisterSchema = Yup.object().shape({
  fullName: Yup.string().required("This field is required"),
  companyName: Yup.string().required("This field is required"),
  companySize: Yup.string().required("This field is required"),
  companyState: Yup.string().required("This field is required"),
  companyCountry: Yup.string().required("This field is required"),
  companyAddress: Yup.string().required("This field is required"),
  companyIndustry: Yup.string().required("This field is required"),
  companyEmail: Yup.string()
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Invalid email address"
    )
    .required("This field is required"),
  companyPhoneNum: Yup.number().required("This field is required"),
  password: Yup.string()
    .required("This  is a required")
    .min(8, "Password must be at least 8 characters long")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
      "Password must contain at least one special character"
    ),
  confirmpassword: Yup.string()
    .required("Confirm password is required")
    .oneOf([Yup.ref("password")], "Passwords do not match"),
});

export const companyforgotSchema = Yup.object().shape({
  companyEmail: Yup.string()
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Invalid email address"
    )
    .required("This field is required"),
});
export const companyforgotResetSchema = Yup.object().shape({
  newPassword: Yup.string()
    .required("This  is a required")
    .min(8, "Password must be at least 8 characters long")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
      "Password must contain at least one special character"
    ),
  confirmNewPassword: Yup.string()
    .required("Confirm password is required")
    .oneOf([Yup.ref("newPassword")], "Passwords do not match"),
});

export const create_request_Schema = Yup.object().shape({
  role: Yup.string().required("This field is required"),
  skills: Yup.array()
    .of(Yup.string())
    .min(1, "Please select at least one skill"),
  jobType: Yup.string().required("This field is required"),
  talentLocation: Yup.string().required("This field is required"),
  numberOfResources: Yup.number().required("This field is required"),
  levelOfExpertise: Yup.string().required("This field is required"),
  yearsOfExperience: Yup.number().required("This field is required"),
  additionalTalentService: Yup.string().required("This field is required"),
});
export const edit_request_Schema = Yup.object().shape({
  role: Yup.string().required("This field is required"),
  skills: Yup.array()
    .of(Yup.string())
    .min(1, "Please select at least one skill"),
  jobType: Yup.string().required("This field is required"),
  talentLocation: Yup.string().required("This field is required"),
  numberOfResources: Yup.number().required("This field is required"),
  levelOfExpertise: Yup.string().required("This field is required"),
  yearsOfExperience: Yup.number().required("This field is required"),
  additionalTalentService: Yup.string().required("This field is required"),
});
