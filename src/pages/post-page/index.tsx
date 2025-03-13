"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { onLogout, onLogin } from "@/lib/features/authSlice";
import axios from "axios";
import { useRouter } from "next/navigation";
import { RootState } from "@/lib/store";
import { getCookie, deleteCookie } from "cookies-next";

interface IPost {
  id: number;
  author: string;
  content: string;
  createdAt: string;
}

export default function PostsPage() {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [newPost, setNewPost] = useState("");
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      const userCookie = getCookie("user");
      if (userCookie) {
        dispatch(onLogin(JSON.parse(userCookie as string)));
      } else {
        router.push("/");
      }
    }
  }, [user, dispatch, router]);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await axios.get("http://localhost:5001/posts");
      setPosts(
        response.data.sort(
          (a: IPost, b: IPost) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      );
    };

    fetchPosts();
  }, []);

  const handlePostSubmit = async () => {
    if (!user) {
      router.push("/");
      return;
    }

    console.log("user:", user);

    const post = {
      id: posts.length ? posts[0].id + 1 : 1,
      author: user.email,
      content: newPost,
      createdAt: new Date().toISOString(),
    };

    await axios.post("http://localhost:5001/posts", post);
    setPosts([post, ...posts]);
    setNewPost("");
  };

  const handleLogout = () => {
    dispatch(onLogout());
    deleteCookie("user");
    router.push("/");
  };

  return (
    <div>
      <nav className="flex justify-between items-center p-4 bg-gray-800 text-white">
        <h1 className="text-lg">Chick-X</h1>
        <button onClick={handleLogout} className="bg-red-500 p-2 rounded">
          Logout
        </button>
      </nav>
      <div className="p-4">
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        <button
          onClick={handlePostSubmit}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Post
        </button>
      </div>
      <div className="p-4">
        {posts.map((post) => (
          <div key={post.id} className="border-b border-gray-300 mb-4 pb-4">
            <h2 className="text-x1">{post.author}</h2>
            <p>{post.content}</p>
            <p className="text-gray-500 text-sm">
              {new Date(post.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
