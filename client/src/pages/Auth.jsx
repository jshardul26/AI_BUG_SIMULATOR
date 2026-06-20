import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center relative overflow-hidden">

      {/* Glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[400px] bg-violet-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-purple-600/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-md px-6">

        {/* Logo */}
        <div className="text-center mb-8">
          <h1
            className="text-3xl font-bold text-violet-400 cursor-pointer"
            onClick={() => navigate("/")}
          >
            BugForge.ai
          </h1>
          <p className="text-zinc-400 text-sm mt-2">
            {isLogin ? "Welcome back! Login to continue." : "Create your account to get started."}
          </p>
        </div>

        {/* Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">

          {/* Toggle */}
          <div className="flex bg-zinc-800 rounded-lg p-1 mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                isLogin ? "bg-violet-600 text-white" : "text-zinc-400 hover:text-white"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                !isLogin ? "bg-violet-600 text-white" : "text-zinc-400 hover:text-white"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Fields */}
          <div className="space-y-4">
            {!isLogin && (
              <div>
                <label className="text-zinc-400 text-sm mb-1.5 block">Full Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full bg-zinc-800 border border-zinc-700 focus:border-violet-500/50 rounded-lg px-4 py-3 text-white placeholder-zinc-500 outline-none text-sm transition-colors"
                />
              </div>
            )}

            <div>
              <label className="text-zinc-400 text-sm mb-1.5 block">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full bg-zinc-800 border border-zinc-700 focus:border-violet-500/50 rounded-lg px-4 py-3 text-white placeholder-zinc-500 outline-none text-sm transition-colors"
              />
            </div>

            <div>
              <label className="text-zinc-400 text-sm mb-1.5 block">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-zinc-800 border border-zinc-700 focus:border-violet-500/50 rounded-lg px-4 py-3 text-white placeholder-zinc-500 outline-none text-sm transition-colors"
              />
            </div>

            {!isLogin && (
              <div>
                <label className="text-zinc-400 text-sm mb-1.5 block">Confirm Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-zinc-800 border border-zinc-700 focus:border-violet-500/50 rounded-lg px-4 py-3 text-white placeholder-zinc-500 outline-none text-sm transition-colors"
                />
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white py-3 rounded-lg text-sm font-semibold mt-6 transition-all duration-200 shadow-lg shadow-violet-500/20"
          >
            {isLogin ? "Login to BugForge →" : "Create Account →"}
          </button>

          {/* Switch */}
          <p className="text-center text-zinc-500 text-sm mt-4">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-violet-400 hover:text-violet-300 transition-colors"
            >
              {isLogin ? "Sign Up" : "Login"}
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}