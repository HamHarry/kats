export enum EmployeePositions {
  CEO = 0, // หัวหน้า
  AMIN = 1, // ผู้ดูแลระบบ
  WASHTECNICIAN = 2, // ช่างล้างรถ
  SPRAYER = 3, // ช่างพ่นสี
}

export interface Employees {
  _id?: string;
  name: string;
  tel: string;
  position: EmployeePositions;
  image: string;
}
