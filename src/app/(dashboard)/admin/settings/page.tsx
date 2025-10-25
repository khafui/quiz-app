import { UserProfile } from '@clerk/nextjs'

const Page = () => {
    return (
        <div>
            <UserProfile
                appearance={{
                    elements: {
                        rootBox: "w-full",
                        card: "shadow-none border-none",
                    },
                }}
            />
        </div>
    )
}
export default Page
