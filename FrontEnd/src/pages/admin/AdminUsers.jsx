import { useState } from "react";
import "./AdminUsers.css";
import { useEffect } from "react";
import { getUsers } from "../../services/adminService";
import UsersTable from "../../components/admin/adminUsers/UsersTable";
import Pagination from "../../components/admin/adminUsers/Pagination";

function AdminUsers() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [debouncedSerach, setDebouncedSerach] = useState("");

  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true);
        const response = await getUsers(page, limit, debouncedSerach);

        setUsers(response.data.usersData);
        setPagination(response.data.pagination);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, [page, limit, debouncedSerach]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSerach(search);
    }, 400);

    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  return (
    <section className="admin-user-page">
      <div className="users-search">
        <input
          type="text"
          placeholder="Search Users..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      <UsersTable
       users={users} 
       
       />

      <Pagination 
      pagination={pagination}
       onPageChange={setPage}
        />
    </section>
  );
}

export default AdminUsers;
