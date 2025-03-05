import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"
import {Button} from "@/components/ui/button"
import NavItems from "./NavItems"
import MobileNav from "./MobileNav"


const header = () => {
  return (
<header>
    <div className="wrapper flex items-center justify-between">
        <Link href="/" className="w-36" >
        <Image src="/assets/images/logo1.png" width={250} height={70}alt="logo" />

        
        </Link>
        <SignedIn>
          <nav className="md:flex-between  w-full max-w-xs ">
         <NavItems/>
         </nav >
            
            </SignedIn>
        <div className="flex w-32 justify-end gap-3">
          <SignedIn>
         
            <UserButton afterSignOutUrl="/"></UserButton>
            <MobileNav/>
            </SignedIn>
            <SignedOut >
                <Button asChild className="rounded-full bg-purple-900" size="lg">
                   <Link href="/sign-in"> Sign In
                   </Link>
                </Button>
                <Button asChild className="rounded-full bg-purple-900 " size="lg">
                   <Link href="/sign-up"> Sign Up
                   </Link>
                </Button>
            </SignedOut>
        </div>
    </div>
</header>
  )
}

export default header
