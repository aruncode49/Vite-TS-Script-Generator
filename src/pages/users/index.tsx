import { useUsers } from "./index.hooks";
import { usersStringConstant } from "./stringConstants";
import styles from "./index.module.css";

const Users = () => {
  const { vars } = useUsers();
  return (
    <div className={styles.container}>
      <h3>{usersStringConstant.pageTitle}</h3>
      <div className={styles.users_container}>
        {vars.data?.map((user) => (
          <div className={styles.users_data} key={user.id}>
            <h4>{user.name}</h4>
            <h4>{user.phone}</h4>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Users;
