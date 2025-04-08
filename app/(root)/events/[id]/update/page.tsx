import EventForm from "@/components/shared/EventForm"
import { getEventById } from "@/lib/actions/event.actions"
import { auth } from "@clerk/nextjs/server"
type Params=Promise<{
  id: string  
}>


const UpdateEvent = async ({ params}: {params:Params}) => {
  const { id } = await params;
  const { sessionClaims } = await auth();

  const userId = sessionClaims?.userId as string;
  const event = await getEventById(id)

  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <h3 className="wrapper h3-bold text-center sm:text-left">Update Event</h3>
      </section>

      <div className="wrapper my-8">
        <EventForm 
          Type="Update" 
          userId={userId} 
        />
      </div>
    </>
  )
}

export default UpdateEvent