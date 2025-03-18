import { EmployeeRole, Employees } from "../model/employee.type";

export const employeeTest: Employees[] = [
  {
    name: "Saowapak Noibua",
    tel: "089-270-7558",
    staffRole: EmployeeRole.CEO,
    image: "/public/assets/profile/profileham.jpg",
  },
  {
    name: "Ingkarat Rechai",
    staffRole: EmployeeRole.AMIN,
    tel: "094-314-9467",
    image: "/public/assets/profile/profilemild.jpg",
  },
];
