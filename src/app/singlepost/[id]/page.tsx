'use client'
import { Post, PostInterface } from "@/types/postInterface";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";
import logo from '../../../../public/default-profile.png'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from "next/image";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { likeOrUnlickApi } from "@/app/servieces/Posts/likeOrUnlikeApi";
import { saveOrUnsaveApi } from "@/app/servieces/Posts/saveOrUnsaveApi";
import { Badge } from "@/components/ui/badge";
import { BookmarkIcon, ImageIcon, Send, Smile } from "lucide-react";
import { deletPost } from "@/app/servieces/Posts/deletePost";
import UpdatePost from "@/app/_components/UpdatePost/UpdatePost";
import { useParams } from "next/navigation";
import { getSinglePost } from "@/app/servieces/Posts/getSinglePost";
import { useSession } from "next-auth/react";
import SkelatonPost from "@/app/_components/SkelatonPost/SkelatonPost";
import Link from "next/link";
import { getpostComments } from "@/app/servieces/comments/getPostComments";
import { Button } from "@/components/ui/button";
import PostComment from "@/app/_components/PostComment/PostComment";
import UpdateComment from "@/app/_components/updateComment/UpdateComment";
import { deletComment } from "@/app/servieces/comments/deleteComment";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { SharePost } from "@/app/servieces/Posts/sharePost";

export default function SinglePost() {
  const [shareValue, setshareValue] = useState('')
  const [shareOpen, setShareOpen] = useState(false)
  const { status, data: user } = useSession();
  const [editcommentOpen, setEditcommentOpen] = useState(false)
  const params = useParams();
  const postId = params.id as string;
  const page = 1;
  const [iscomment, setIscomment] = useState(false)

  const { data, isLoading } = useQuery<any>({
    queryKey: ['single post', postId],
    queryFn: () => getSinglePost(postId),
  });
  const { data: comments, isLoading: commentsLoading } = useQuery<any>({
    queryKey: ['single post comments', postId],
    queryFn: () => getpostComments(postId),
  });
  console.log('comments', comments);


  const post = data?.data?.post ?? data?.post ?? data;
  const [liked, setLiked] = useState<boolean>(() => post?.likes?.includes(user?.user?._id) ?? false);
  const [saved, setsaved] = useState<boolean>(() => post?.bookmarked == true);
  const [editOpen, setEditOpen] = useState(false)
  const { data: commentDataDelet, mutate: commentDelete } = useMutation({
    mutationKey: ['single post comments delete', postId],
    mutationFn: deletComment,
    onSuccess: () => {
      querClient.invalidateQueries({ queryKey: ['single post', postId] })
      querClient.invalidateQueries({ queryKey: ['single post comments', postId] })

      console.log('del comment', commentDataDelet);

    },
    onError: () => {
      console.log('del comment', commentDataDelet);

    }

  });
  const { mutate: share, data: shareData, isPending } = useMutation({
    mutationKey: ['share post', post?._id],
    mutationFn: SharePost,
    onSuccess: () => {
      setShareOpen(false)
      setshareValue('')
      querClient.invalidateQueries({ queryKey: ['get posts', page], refetchType: 'all' })

    }

  })
  const [likes, setLikes] = useState<number>(post?.likesCount ?? 0);

  useEffect(() => {
    if (!post) return;
    setsaved(post.bookmarked === true);
  }, [post?.bookmarked, post]);

  useEffect(() => {
    if (!post) return;
    setLiked(post?.likes?.includes(user?.user?._id) ?? false);
    setLikes(post?.likesCount ?? 0);
  }, [post?.likes, post?.likesCount, user?.user?._id]);
  const querClient = useQueryClient()

  const { mutate, data: likeData, isPending: isLiking } = useMutation({
    mutationKey: ['like', postId],
    mutationFn: () => likeOrUnlickApi(postId),
    onSuccess: () => {
      querClient.invalidateQueries({
        queryKey: ['get posts', page],
        refetchType: 'all'
      })
      console.log('like single', likeData);

    },
    onError: () => {
      setLiked(prev => !prev);
      setLikes(prev => liked ? prev + 1 : prev - 1);
    }
  });
  const { data: deleteResp, mutate: postDelete } = useMutation({
    mutationKey: ['delete', postId],
    mutationFn: () => deletPost(postId),
    onSuccess: () => {
      querClient.invalidateQueries({
        queryKey: ['get posts', page],
        refetchType: 'all'
      })
    },
    onError: () => {
      setLiked(prev => !prev);
      setLikes(prev => liked ? prev + 1 : prev - 1);
    }
  });
  const { mutate: saveUnsave } = useMutation({
    mutationKey: ['save', postId],
    mutationFn: () => saveOrUnsaveApi(postId),
    onSuccess: () => {
      querClient.invalidateQueries({
        queryKey: ['get posts', page],
        refetchType: 'all'
      })
    },
    onError: () => {

    }
  });

  function handleLike() {
    if (!post) return;
    setLiked(prev => !prev);
    setLikes(prev => liked ? prev - 1 : prev + 1);
    mutate();
  }

  if (isLoading || !post) {
    return (
      <div className=" w-full p-10 min-h-screen  md:w-2xl mx-auto overflow-hidden ">

        <SkelatonPost />
      </div>
    );
  }


  return (
    <div className="bg-gray-200 flex justify-center items-center flex-col min-h-screen p-3">
      <div className="flex md:w-fit flex-col justify-center items-start w-full ">
        <Link className=" bg-gray-50 flex justify-center items-center gap-1.5 rounded-lg p-3 mb-2" href={'/'}> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
          Back</Link>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 w-full md:w-2xl mx-auto overflow-hidden ">
          <UpdatePost
            page={page}
            data={user}
            postId={post._id}
            open={editOpen}
            onOpenChange={setEditOpen}
          />
          {/* Header */}
          <div className="flex items-center justify-between px-4 pt-4 pb-3">
            <div className="flex items-start gap-3">
              <img
                className="h-11 w-11 rounded-full object-cover"
                src={post.user?.photo || (logo as unknown as string)}
                alt={post.user?.name || "user avatar"}
              />
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-bold text-slate-900 text-sm">{post.user?.name ?? "Unknown user"}</p>
                  <p className="text-xs text-gray-400">{post.body == 'updated profile picture.' ? 'updated profile picture.' : ''}</p>
                </div>
                <div className="flex items-center gap-1 text-slate-500 text-xs">
                  {post.body == 'updated profile picture.' ? '' : (
                    <>
                      <span>@{post.user?.username ?? "user"}</span>
                      <span>·</span>
                    </>
                  )}
                  {(() => {
                    const createdAtValue = post.createdAt;
                    const createdAtDate =
                      createdAtValue instanceof Date
                        ? createdAtValue
                        : createdAtValue
                          ? new Date(createdAtValue)
                          : null;

                    if (!createdAtDate || isNaN(createdAtDate.getTime())) {
                      return <span>Just now</span>;
                    }

                    return (
                      <span>
                        {formatDistanceToNow(createdAtDate, { addSuffix: true })}
                      </span>
                    );
                  })()}
                </div>
                {saved && <Badge variant="default" className="mt-2 bg-blue-50 text-blue-600">
                  Bookmark
                  <BookmarkIcon data-icon="inline-end" />
                </Badge>}

              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="border-0 ring-0 cursor-pointer focus-visible:outline-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <circle cx="5" cy="12" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="19" cy="12" r="1.5" />
                  </svg>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => { saveUnsave(); setsaved(!saved) }} className="pr-25">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4"><path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" /></svg>
                    {saved ? 'Unsave' : 'Save'}
                  </DropdownMenuItem>
                  {user?.user?._id === post.user?._id && <>
                    <DropdownMenuItem onSelect={(e) => { e.preventDefault(); setEditOpen(true) }}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                      </svg>
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} onClick={() => postDelete()} className="text-red-600 hover:bg-red-100 focus:bg-red-100 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 text-red-600"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                      Delete
                    </DropdownMenuItem>
                  </>}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Post text */}
          <p className="px-4 pb-3 text-slate-800 text-sm">
            {post.body == 'updated profile picture.' ? '' : post.body}
          </p>

          {/* Post image */}
          <div className="w-full bg-gradient-to-br from-teal-400 via-slate-500 to-purple-400 flex items-center justify-center overflow-hidden">
            <img src={post.image} className="w-full max-h-120 object-cover" alt="" />
          </div>

          {/* Likes / shares / comments count */}
          <div className="flex items-center justify-between px-4 py-2 text-slate-500 text-sm border-b border-slate-100">
            <div className="flex items-center gap-1">
              <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7.493 18.75c-.425 0-.82-.236-.975-.632A7.48 7.48 0 0 1 6 15.375c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V3a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23h-.777ZM2.331 10.977a11.969 11.969 0 0 0-.831 4.398 12 12 0 0 0 .52 3.507c.26.85 1.084 1.368 1.973 1.368H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 0 1-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.919 1.227Z" />
                </svg>
              </div>
              <span>{likes} likes</span>
            </div>
            <div className="flex items-center gap-3">
              <span>{post.sharesCount} shares</span>
              <span>{post.commentsCount} comments</span>
              <button className="text-blue-500 font-semibold hover:underline">View details</button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center border-b border-slate-100">
            <button
              onClick={handleLike}
              disabled={isLiking}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition hover:bg-slate-50 ${liked ? "text-blue-500" : "text-slate-600"} ${isLiking ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill='none' viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V3a.75.75 0 0 1 .75-.75A2.25 2.25 0 0 1 16.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
              </svg>
              {isLiking ? (liked ? "Liking..." : "Unliking...") : (liked ? "Unlike" : "Like")}
            </button>
            <button onClick={() => setIscomment(!iscomment)} className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
              </svg>
              Comment
            </button>
            <Dialog open={shareOpen} onOpenChange={setShareOpen}>
              <DialogTrigger asChild>
                <button onClick={() => setShareOpen(true)} className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
                  </svg>
                  Share
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                  <DialogTitle>Share post</DialogTitle>
                </DialogHeader>
                <FieldGroup>
                  <Field>
                    <Input id="name-1" name="shareValue" value={shareValue} onChange={(e) => { setshareValue(e.target.value) }} placeholder="say somthing obout this" />
                  </Field>
                  <div className="bg-gray-200 rounded-lg overflow-hidden pt-2 2-full px-0.5">
                    <div className="flex items-start gap-3">
                      <img
                        className="h-11 w-11 rounded-full object-cover"
                        src={post.user?.photo || (logo as unknown as string)}
                        alt={post.user?.name ?? "user avatar"}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-slate-900 text-sm">{post.user?.name}</p>
                          <p className="text-xs text-gray-400">{post.body == 'updated profile picture.' ? 'updated profile picture.' : ''}</p>
                        </div>
                        <div className="flex items-center gap-1 text-slate-500 text-xs">
                          {post.body == 'updated profile picture.' ? '' : <><span>@{post.user?.username}</span><span>·</span></>}
                          {(() => {
                            const createdAtValue = post?.createdAt;
                            const createdAtDate =
                              createdAtValue instanceof Date
                                ? createdAtValue
                                : createdAtValue
                                ? new Date(createdAtValue)
                                : null;

                            if (!createdAtDate || isNaN(createdAtDate.getTime())) {
                              return <span>Just now</span>;
                            }

                            return (
                              <span>
                                {formatDistanceToNow(createdAtDate, { addSuffix: true })}
                              </span>
                            );
                          })()}
                        </div>
                        {saved && <Badge variant="default" className="mt-2 bg-blue-50 text-blue-600">
                          Bookmark
                          <BookmarkIcon data-icon="inline-end" />
                        </Badge>}

                      </div>
                    </div>
                    <p className="px-4 pb-3 text-slate-800 text-sm my-2">
                      {post.body == 'updated profile picture.' ? '' : post.body}
                    </p>

                    {/* Post image */}
                    <div className="w-full bg-gradient-to-br from-teal-400 via-slate-500 to-purple-400 flex items-center justify-center overflow-hidden">
                      <img src={post.image} className="w-full max-h-120 object-cover" alt="" />
                    </div>
                  </div>
                </FieldGroup>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button disabled={isPending} onClick={() => { share({ body: shareValue, postId: post._id }) }}>Share</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Top Comment */}
          {(post.topComment != null || iscomment) && (
            <div className="mx-4 my-3 bg-slate-50 rounded-xl p-3">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Comments</p>
              {commentsLoading ? <div className="w-full flex justify-center items-center p-5 bg-white rounded-lg">
                <h2 className="text-gray-600 text-xl">Loading comments</h2>

              </div> : comments?.data?.comments?.map((comment: any) => (
                <>
                  <UpdateComment
                    page={page}
                    data={user}
                    postId={postId}
                    open={editcommentOpen}
                    onOpenChange={setEditcommentOpen}
                    singlePost={true}
                    commentId={comment._id}
                  />
                  <div className="flex items-center justify-between px-1 md:px-4 pt-4 pb-3">
                    <div key={comment._id} className="flex items-start gap-3 mt-2 w-full">
                      <Image
                        src={comment.commentCreator?.photo || logo}
                        alt="commentcreator"
                        width={36}
                        height={36}
                        className="w-9 h-9 rounded-full"
                      />
                      <div className="bg-white rounded-lg p-3  w-2/3">
                        <p className="font-bold text-slate-900 text-sm">{comment.commentCreator?.name ?? "Unknown"}</p>
                        <p className="text-slate-600 text-sm mt-0.5">{comment.content}</p>
                        {comment.image && (
                          <img src={comment.image} alt="" className="w-full h-50 rounded-lg object-cover" />
                        )}

                      </div>
                    </div>
                    {user?.user?._id === comment.commentCreator?._id && <>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="border-0 ring-0 cursor-pointer focus-visible:outline-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <circle cx="5" cy="12" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="19" cy="12" r="1.5" />
                            </svg>
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuGroup>
                            <DropdownMenuItem onSelect={(e) => { e.preventDefault(); setEditcommentOpen(true) }}>
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                              </svg>
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()} onClick={() => commentDelete({ postId: post._id, commentId: comment._id })} className="text-red-600 hover:bg-red-100 focus:bg-red-100 transition-colors">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 text-red-600"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                              Delete
                            </DropdownMenuItem>

                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>

                    </>
                    }
                  </div>

                </>
              ))}
              <PostComment iscomment={iscomment} user={user} post={post} postId={postId} />
            </div>

          )}

        </div>

      </div>

    </div>
  );
}

