"use client";
import { useState } from "react";
import { IoSearch } from "react-icons/io5";
import { useRouter } from "next/navigation";
import github from "../store/github";
import Alert from "./Alert"; // Alert 컴포넌트 임포트

const SearchBar = () => {
  const [userName, setUserName] = useState("");
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const setUser = github(state => state.setUser);
  const router = useRouter();

  const handleSearch = async () => {
    if (userName.trim()) {
      try {
        const response = await fetch(
          `https://api.github.com/users/${userName}`
        );
        if (!response.ok) throw new Error("User not found");

        const data = await response.json();
        setUser(data); // Zustand에 저장
        router.push("/search"); // 검색 결과 페이지로 이동
      } catch (error) {
        console.error("존재하지 않는 사용자입니다.", error);
        setAlertMessage("User not found. Please try again."); // 알림 메시지 설정
      }
    }
  };

  return (
    <div>
      {alertMessage && <Alert message={alertMessage} />} {/* Alert 표시 */}
      <div className="flex items-center bg-[#332957] rounded-3xl w-[700px] h-[64px]">
        <input
          type="text"
          value={userName}
          onChange={e => setUserName(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSearch()}
          placeholder="Enter a GitHub username..."
          className="w-full pl-8 bg-transparent text-white placeholder-[#807C8F] focus:outline-none text-lg"
        />
        <button onClick={handleSearch}>
          <IoSearch className="mx-6 text-white text-3xl transition-transform transform hover:scale-125 duration-300 cursor-pointer" />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
