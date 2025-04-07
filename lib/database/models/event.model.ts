import { Document, model, models, Schema } from "mongoose";
export interface IEvent extends Document {
    title: string;
    description?: string;
    location?: string;
    createdAt: Date;
    imageUrl: string;
    startDateTime: Date;
    endDateTime: Date;
    url?: string;
    category: {_id:string,name:string};
    organizer: {_id:string,firstName:string,lastName:string};
}
const EventSchema = new Schema({
    title : {type:String,required:true},
    description:{type:String},
    location:{type:String},
    createdAt:{type:Date,default:Date.now},
    imageUrl:{ type:String,required:true},
    startDateTime:{type:Date,default:Date.now},
    endDateTime:{type:Date,default:Date.now},
    url:{type:String},
    category:{type:Schema.Types.ObjectId,ref:'category'},
    organizer:{type:Schema.Types.ObjectId,ref:'user'},



})
const Event = models.Event || model('Event', EventSchema);
export default Event;