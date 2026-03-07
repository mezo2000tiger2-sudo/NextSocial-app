
import { Post, PostInterface } from "@/types/postInterface";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import logo from '../../../../public/default-profile.png'

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from "next/image";
import SkelatonPost from "../SkelatonPost/SkelatonPost";
import { PostItem } from "../PostItem/PostItem";


export default function PostCard({pages, user , isLoading , page}:{pages:PostInterface , user:any , isLoading:boolean , page:string} ) {
  
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(3);

  function handleLike() {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
  }
  console.log('pages2',user?.user._id);
  if(isLoading){
  return <><div className="flex flex-col"><SkelatonPost/> <SkelatonPost/></div></>
}
  

  return (
    <>

    
    {pages?.data.posts?.map((post:Post)=>{return <PostItem key={post._id} post={post} user={user} page={page}/>
  })}
    
    </>
  );
}