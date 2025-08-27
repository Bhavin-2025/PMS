import logo from "../assets/sarvadhi.svg";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { ROLES } from "../config";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault(); // stop the form from reloading the page

    try {
      // ask backend: “do you have a user with this email?”
      const { data } = await api.get(
        `/employees?email=${encodeURIComponent(email)}`
      );
      const user = data?.[0]; // JSON Server returns an array

      // compare passwords (mock: plaintext in db.json)
      if (!user || user.password !== password) {
        alert("Invalid email or password");
        return;
      }

      // make a pretend token and save everything in context
      const token = Math.random().toString(36).slice(2);
      login(user, token);

      // ensure axios immediately sends token on next calls (optional, but handy)
      api.defaults.headers.common.Authorization = `Bearer ${token}`;

      // go to the right dashboard
      const to = user.role === ROLES.ADMIN ? "/admin" : "/employee/project";
      navigate(to, { replace: true });
    } catch (err) {
      console.error(err);
      alert("Network error. Is JSON Server running on port 5000?");
    }
  };

  return (
    <div>
      <header className="py-3 px-10 border-b-1 border-gray-200 ">
        <div>
          <img src={logo} alt="sarvadhi" />
        </div>
      </header>
      <main>
        <div className="container">
          <div className="flex flex-col items-center justify-center gap-[76px]">
            <div className="mt-15">
              <h2 className="font-bold text-3xl">Welcome back</h2>
              <p className="text-[#61758A] text-sm p-1">
                Admin and Employee login
              </p>
            </div>
            <form className="w-[480px]" onSubmit={handleLogin}>
              <div className="flex flex-col">
                <label className="text-[16px] mb-2 font-medium">Email</label>
                <input
                  className="p-3.5 mb-3 rounded-lg border border-gray-200 w-full "
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="flex flex-col ">
                <label className="text-[16px] mb-2 font-medium">Password</label>
                <input
                  className="p-3.5 rounded-lg border border-gray-200 w-full"
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="mt-6">
                <button
                  type="submit"
                  className="bg-[#0D80F2] rounded-lg w-full p-2 text-sm font-bold text-white cursor-pointer hover:bg-blue-600 "
                >
                  Log in
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
