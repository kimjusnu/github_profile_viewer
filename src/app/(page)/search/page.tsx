"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import github from "@/app/store/github";
import RepositoryCard from "@/app/components/RepositoiryCard";
import { IoReturnDownBack, IoLogoGithub } from "react-icons/io5";

const Profile = () => {
  const user = github(state => state.user);
  const repositories = github(state => state.repositories);
  const setRepositories = github(state => state.setRepositories);
  const clearRepositories = github(state => state.clearRepositories);
  const router = useRouter();

  // 디버깅용 로그
  console.log("User:", user);
  console.log("Repositories:", repositories);

  // 상태가 없는 경우 홈으로 리디렉션
  useEffect(() => {
    if (!user) {
      alert("No user data found. Redirecting to home...");
      router.push("/");
    }
  }, [user, router]);

  // 컴포넌트 언마운트 시 상태 초기화
  useEffect(() => {
    return () => {
      console.log("Cleaning up repositories...");
      clearRepositories(); // 컴포넌트 언마운트 시 호출
    };
  }, [clearRepositories]);

  // 레포지토리 데이터 가져오기
  useEffect(() => {
    if (user && repositories.length === 0) {
      fetch(`https://api.github.com/users/${user.login}/repos`)
        .then(response => response.json())
        .then(data => {
          console.log("Fetched Repositories:", data);
          setRepositories(data);
        })
        .catch(error => console.error("Error fetching repositories:", error));
    }
  }, [user, repositories, setRepositories]);

  if (!user) return null;

  return (
    <div className="w-full bg-test2-bg min-h-screen bg-cover bg-fixed bg-center flex gap-8 p-8">
      {/* 왼쪽상단: 유저 프로필 카드 */}
      <div className="w-1/3 space-y-8">
        <div className="bg-[#0F0731] border-[#F5EFFB] border-2 rounded-2xl shadow-lg p-6 flex items-center space-x-6">
          <img
            src={user.avatar_url}
            alt={user.login}
            className="w-28 h-28 rounded-full"
          />
          <div>
            <h1 className="text-3xl font-bold text-[#F5EFFB]">
              {user.name || user.login}
            </h1>
            <p className="mt-2 text-sm text-[#9D95B9]">
              <a
                href={user.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline flex items-center"
              >
                <IoLogoGithub className="mr-1" />
                {user.html_url}
              </a>
            </p>
          </div>
        </div>

        {/* 유저 정보 컴포넌트 */}
        <div className="bg-[#0F0731] border-[#F5EFFB] border-2 rounded-2xl shadow-lg p-8">
          <div className="grid grid-cols-2 gap-y-6 text-[#D9D9D9]">
            <div className="font-semibold text-[#9D95B9]">Bio:</div>
            <div>{user.bio || "N/A"}</div>

            <div className="font-semibold text-[#9D95B9]">Blog:</div>
            <div className="overflow-hidden text-ellipsis whitespace-nowrap hover:underline">
              <a href={user.blog} target="_blank" rel="noopener noreferrer">
                {user.blog || "N/A"}
              </a>
            </div>

            <div className="font-semibold text-[#9D95B9]">Location:</div>
            <div>{user.location || "N/A"}</div>

            <div className="font-semibold text-[#9D95B9]">Company:</div>
            <div>{user.company || "N/A"}</div>

            <div className="font-semibold text-[#9D95B9]">Followers:</div>
            <div>{user.followers}</div>

            <div className="font-semibold text-[#9D95B9]">Following:</div>
            <div>{user.following}</div>

            <div className="font-semibold text-[#9D95B9]">Repositories:</div>
            <div>{user.public_repos}</div>

            <div className="font-semibold text-[#9D95B9]">
              GitHub Member Since:
            </div>
            <div>{new Date(user.created_at).getFullYear()}</div>
          </div>
        </div>

        {/* 메인 페이지로 돌아가기 버튼 */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => router.push("/")}
            className="bg-[#332957] flex items-center text-[#F5EFFB] hover:bg-[#4a3b77] px-6 py-2 rounded-lg transition duration-300"
          >
            <IoReturnDownBack className="text-3xl mr-2" />
            GitHub Profile Viewer
          </button>
        </div>
      </div>

      {/* 오른쪽: 레포지토리 컴포넌트 */}
      <div className="w-2/3">
        <div className="bg-[#0F0731] border-[#F5EFFB] border-2 rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl mt-4 mb-14 text-center font-semibold text-[#F5EFFB]">
            Repositories List
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 justify-items-center gap-6">
            {repositories.length > 0 ? (
              repositories.map(repo => (
                <RepositoryCard
                  key={repo.id}
                  name={repo.name}
                  description={repo.description}
                  stars={repo.stargazers_count}
                  forks={repo.forks_count}
                  issues={repo.open_issues_count}
                  url={repo.html_url}
                />
              ))
            ) : (
              <p className="text-[#F5EFFB]">No repositories found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
