import { useState } from "react";
import "./UserAdminPage.css";
import { userTest } from "../../data/MockUpUser";

export interface Users {
  username: string;
  name: string;
  phone: string;
}

const UserAdminPage = () => {
  const [userData, setUserData] = useState<Users[]>(userTest);
  const [userDataRef] = useState(userData);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    const newValue = userDataRef.filter((item) => {
      const valueUsername = item.username.toLowerCase().includes(value);
      const valueName = item.name.toLowerCase().includes(value);
      const valuePhone = item.phone.toLowerCase().includes(value);
      return valueUsername || valueName || valuePhone;
    });
    setUserData(newValue);
  };

  return (
    <div className="container-userAdmin">
      <div className="header-userAdmin">
        <h1>Users</h1>
      </div>
      <div className="search-user">
        <input type="text" placeholder="Search..." onChange={handleSearch} />
      </div>
      <div className="wrap-container-userAdmin">
        {userData.map((item, index) => {
          return (
            <div key={index} className="grid-user">
              <div className="user-content">
                <div className="text-p">
                  <p>Username: {item.username}</p>
                  <i className="fa-solid fa-pen-to-square"></i>
                </div>
                <p>Name: {item.name}</p>
                <p>Phone: {item.phone}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserAdminPage;
