'use client'
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import CreatePost from "./_components/CreatePost/CreatePost";
import PostCard from "./_components/PostCard/PostCard";
import { getPosts } from "./servieces/HomePage/getPosts";
import SkelatonPost from "./_components/SkelatonPost/SkelatonPost";
import { usePost } from "./context/pageContext";
import { getSuggestedFollowers } from "./servieces/HomePage/getSuggestedFollowers";
import { SuggestedFollowers } from "./_components/SuggestedFollowrs/SuggetedFollowers";
import { getProfile } from "./servieces/profile/getProfile";

export default function Home() {
  const {status , data} = useSession()
const [page, setPage] = useState('Community') 
const {data:pages , isLoading}=useQuery({
  queryKey:['get posts' , page],
  queryFn:()=> getPosts(page),
 refetchInterval: 10000
})
const { data:profile, isPending } = useQuery({
      queryKey: ['profile'],
      queryFn: getProfile,
    })
      const user = profile?.data?.user
const {data:suggestionData , isLoading:isSuggested}=useQuery({
  queryKey:['get suggested'],
  queryFn:getSuggestedFollowers,
  
})
const { Page, setpage } = usePost()
useEffect(() => { setpage(page) }, [page])
console.log('suggested',suggestionData);


  return (
    <>
    <div className="bg-gray-200 w-full min-h-screen">

      <div className="mx-auto max-w-7xl px-3 py-3.5 bg-gray-200">
        <div className="grid gap-y-4 md:gap-4 grid-cols-1 items-start  md:grid-cols-4">
          <aside className="  h-fit space-y-3  xl:sticky xl:xl:top-22">
            <div  className="rounded-2xl flex md:flex-col gap-2 text-center md:text-start   border border-slate-200 bg-white p-3 shadow-sm">
              <button onClick={()=> setPage('Community')} className={`${page == 'Community' ? 'flex w-1/2 md:w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-bold transition bg-[#e7f3ff] text-[#1877f2]':'mt-1 flex w-1/2 md:w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-bold transition text-slate-700 hover:bg-slate-100'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 0 1-1.161.886l-.143.048a1.107 1.107 0 0 0-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 0 1-1.652.928l-.679-.906a1.125 1.125 0 0 0-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 0 0-8.862 12.872M12.75 3.031a9 9 0 0 1 6.69 14.036m0 0-.177-.529A2.25 2.25 0 0 0 17.128 15H16.5l-.324-.324a1.453 1.453 0 0 0-2.328.377l-.036.073a1.586 1.586 0 0 1-.982.816l-.99.282c-.55.157-.894.702-.8 1.267l.073.438c.08.474.49.821.97.821.846 0 1.598.542 1.865 1.345l.215.643m5.276-3.67a9.012 9.012 0 0 1-5.276 3.67m0 0a9 9 0 0 1-10.275-4.835M15.75 9c0 .896-.393 1.7-1.016 2.25" />
              </svg>

              Community
              </button>
              <button onClick={()=> setPage('feed')} className={`${page == 'feed' ? 'flex w-1/2 md:w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-bold transition bg-[#e7f3ff] text-[#1877f2]':'mt-1 flex w-1/2 md:w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-bold transition text-slate-700 hover:bg-slate-100'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
              </svg>
              Feed
              </button>
            </div>
          </aside>
          <div className="flex col-span-2 flex-col gap-10">

          <CreatePost data={user} page={page}/>

          <PostCard pages={pages} page={page} user={data} isLoading={isLoading}/>
          </div>
        
          <div className="xl:sticky xl:xl:top-22 w-full md:w-fit">
            <aside className="space-y-3 sticky top-22">
                  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-blue-600">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                        </svg>
                        Suggested Friends
                      </h2>
                      <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-full">
                        {suggestionData?.data?.suggestions?.length || 0}
                      </span>
                    </div>
            
                    <div className="space-y-4">
                        {isLoading ? <div className="flex flex-col gap-2"><SkelatonPost/><SkelatonPost/></div> : suggestionData?.data?.suggestions?.map((user:any) => (
                        <SuggestedFollowers user={user}/>
                      ))}
                      
                    </div>
                  </div>
                </aside>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
