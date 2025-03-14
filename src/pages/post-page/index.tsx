"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { onLogout, onLogin } from "@/lib/features/authSlice";
import axios from "axios";
import { useRouter } from "next/navigation";
import { RootState } from "@/lib/store";
import { getCookie, deleteCookie } from "cookies-next";
import { FaHeart, FaRegHeart, FaCommentAlt } from "react-icons/fa";

interface IPost {
  id: number;
  author: string;
  content: string;
  createdAt: string;
  likes: number;
  likedBy: string[];
  comments: Comment[];
}

interface Comment {
  id: number;
  author: string;
  content: string;
  createdAt: string;
}

export default function PostsPage() {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [newPost, setNewPost] = useState("");
  const [activeCommentPostId, setactiveCommentPostId] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const userCookie = getCookie("user");
    if (userCookie && !user) {
      const parsedUser = JSON.parse(userCookie as string);
      dispatch(onLogin(parsedUser));
    } else if (!user) {
      router.push("/");
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

    const author = user.email.split("@")[0];

    const post = {
      author,
      content: newPost,
      createdAt: new Date().toISOString(),
      likes: 0,
      likedBy: [],
      comments: [],
    };

    const response = await axios.post("http://localhost:5001/posts", post);
    setPosts([response.data, ...posts]);
    setNewPost("");
  };

  const handleLike = async (postId: number) => {
    if (!user) {
      router.push("/");
      return;
    }

    const updatedPosts = posts.map((post) => {
      if (post.id === postId) {
        const isLiked = post.likedBy.includes((user?.email ?? "").split("@")[0]);
        const updatedPost = {
          ...post,
          likes: isLiked ? post.likes - 1 : post.likes + 1,
          likedBy: isLiked
            ? post.likedBy.filter(
                (username) => username !== (user?.email ?? "").split("@")[0]
              )
            : [...post.likedBy, (user?.email ?? "").split("@")[0]],
        };
        axios.put(`http://localhost:5001/posts/${postId}`, updatedPost);
        return updatedPost;
      }
      return post;
    });
    setPosts(updatedPosts);
  };

  const handleComment = (postId: number) => {
    if (activeCommentPostId === postId) {
      setactiveCommentPostId(null);
    } else {
      setactiveCommentPostId(postId);
      setComment("");
    }
  };

  const handleCommentSubmit = async (postId: number) => {
    if (!user) {
      router.push("/");
      return;
    }

    const author = user.email.split("@")[0];

    const newComment = {
      id: Date.now(),
      author,
      content: comment,
      createdAt: new Date().toISOString(),
    };

    const updatedPosts = posts.map((post) => {
      if (post.id === postId) {
        const updatedPost = {
          ...post,
          comments: [...post.comments, newComment],
        };
        axios.put(`http://localhost:5001/posts/${postId}`, updatedPost);
        return updatedPost;
      }
      return post;
    });
    setPosts(updatedPosts);
    setComment("");
    setactiveCommentPostId(null);
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
            <div className="flex items-center">
              <button onClick={() => handleLike(post.id)} className="mr-2">
                {post.likedBy.includes((user?.email ?? "").split("@")[0]) ? (
                  <FaHeart className="text-red-500" />
                ) : (
                  <FaRegHeart className="text-gray-500" />
                )}
              </button>
              <span>{post.likes} likes</span>
              <button onClick={() => handleComment(post.id)} className="ml-4">
                <FaCommentAlt className="text-gray-500" />
              </button>
            </div>
            {activeCommentPostId === post.id && (
              <div className="mt-2">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded mb-2"
                />
                <button
                  onClick={() => handleCommentSubmit(post.id)}
                  className="bg-green-500 text-white p-1 rounded"
                >
                  Comment
                </button>
              </div>
            )}
            {post.comments.map((comment) => (
              <div key={comment.id} className="mt-2">
                <p className="text-sm">
                  <strong>{comment.author}</strong>: {comment.content}
                </p>
                <p className="text-gray-500 text-xs">
                  {new Date(comment.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
