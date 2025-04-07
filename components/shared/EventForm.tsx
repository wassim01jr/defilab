"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { eventFormSchema } from "@/lib/validator"
import * as z from 'zod'
import { eventDefaultValues } from "@/constants"
import Dropdown from "./DropDown"
import { Textarea } from "@/components/ui/textarea"
import { FileUploader } from "./FileUploader"
import { useState } from "react"
import Image from "next/image"
import DatePicker from "react-datepicker";
import { useUploadThing } from '@/lib/uploadthing'

import "react-datepicker/dist/react-datepicker.css";
import { useRouter} from "next/navigation"
import { createEvent, updateEvent } from "@/lib/actions/event.actions"
import { IEvent } from "@/lib/database/models/event.model"

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  categoryId: z.string().min(1, { message: "Category is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  imageUrl: z.string().min(1, { message: "Image is required" }),
  location: z.string().min(1, { message: "Location is required" }),
  startDateTime: z.date({ required_error: "Start date is required" }),
  endDateTime: z.date({ required_error: "End date is required" }),
  url: z.string().url({ message: "Enter a valid URL" }).optional(),
})
   
type EventFormProps = {
    userId: string
    Type: "Create" | "Update"
    event?: IEvent,
    eventId?: string
    }
const EventForm = ({userId, Type,event,eventId} : EventFormProps) => {
    const [files, setFiles] = useState<File[]>([])
    const [startDate, setStartDate] = useState(new Date());
    const initialValues=eventDefaultValues;
    const Router = useRouter();
    const { startUpload } = useUploadThing('imageUploader')

    const form = useForm<z.infer<typeof eventFormSchema>>({
        resolver: zodResolver(eventFormSchema),
        defaultValues: initialValues,
      })
     
      // 2. Define a submit handler.
      async function onSubmit(values: z.infer<typeof eventFormSchema>) {
        let uploadedImageUrl = values.imageUrl;
    
        if(files.length > 0) {
          const uploadedImages = await startUpload(files)
    
          if(!uploadedImages) {
            return
          }
    
          uploadedImageUrl = uploadedImages[0].url
        }
    
        if(Type === 'Create') {
          try {
            const newEvent = await createEvent({
              event: { ...values, imageUrl: uploadedImageUrl },
              userId,
              path: '/profile'
            })
    
            if(newEvent) {
              form.reset();
              Router.push(`/events/${newEvent._id}`)
            }
          } catch (error) {
            console.log(error);
          }
        }
    
        if(Type === 'Update') {
          if(!eventId) {
            Router.back()
            return;
          }
    
          try {
            const updatedEvent = await updateEvent({
              userId,
              event: { ...values, imageUrl: uploadedImageUrl, _id: eventId },
              path: `/events/${eventId}`
            })
    
            if(updatedEvent) {
              form.reset();
              Router.push(`/events/${updatedEvent._id}`)
            }
          } catch (error) {
            console.log(error);
          }
        }
      }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 ">
        <div className="flex flex-col gap-5 md:flex-row">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input placeholder="Event Title" {...field} className="input-field" />
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Dropdown onChangeHandler={field.onChange} value={field.value} />
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />


        </div>
        <div className="flex flex-col gap-5 md:flex-row">
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl className="h-72">
                <Textarea placeholder="Description" {...field} className="textarea rounded-2xl" />
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl className="h-72">
                <FileUploader onFieldChange={field.onChange} 
                imageUrl={field.value}
                setFiles={setFiles}/>
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />
        </div>
        <div className="flex flex-col gap-5 md:flex-row"> 
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">

                    <Image
                    src="/assets/icons/location-grey.svg"
                    alt="calendar"
                    width={24}  
                    height={24} />
                    <Input placeholder="Event Location or Online" {...field} className="input-field" />
                </div>
                
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />

        </div>
        <div className="flex flex-col gap-5 md:flex-row"> 
        <FormField
          control={form.control}
          name="startDateTime"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
                
                    <Image
                    src="/assets/icons/calendar.svg"
                    alt="calendar"
                    width={24}  
                    height={24} 
                    className="filter-grey"/>
                    <p className="ml-3 whitespace-nowrap text-gray-600">Start Date </p>
                    <DatePicker
                      selected={field.value}
                      onChange={(date: Date |null) => field.onChange(date)}
                      showTimeSelect
                      timeInputLabel="Time:"
                        dateFormat="MMMM d, yyyy h:mm aa"
                        wrapperClassName="datePicker"
                    />
                </div>
                
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />

        
        <FormField
          control={form.control}
          name="endDateTime"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
                
                    <Image
                    src="/assets/icons/calendar.svg"
                    alt="calendar"
                    width={24}  
                    height={24} 
                    className="filter-grey"/>
                    <p className="ml-3 whitespace-nowrap text-gray-600">End Date </p>
                    <DatePicker
                      selected={field.value}
                      onChange={(date: Date |null) => field.onChange(date)}
                      showTimeSelect
                      timeInputLabel="Time:"
                        dateFormat="MMMM d, yyyy h:mm aa"
                        wrapperClassName="datePicker"
                    />
                </div>
                
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />


        </div>
        <div>
        <div className="flex flex-col gap-5 md:flex-row"> 
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">

                    <Image
                    src="/assets/icons/link.svg"
                    alt="URL"
                    width={24}  
                    height={24} />
                    <Input placeholder="URL" {...field} className="input-field" />
                </div>
                
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />
        </div>
        </div>
        <Button type="submit"
          size="lg"
          disabled={form.formState.isSubmitting}
          className="button col-span-2 w-full bg-purple-900"
        >
          {form.formState.isSubmitting ? (
            'Creating Event...'
          ): `${Type} Event `}</Button>
        </form>
      </Form>
      )
}

export default EventForm
