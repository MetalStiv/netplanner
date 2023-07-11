import { Collection, ObjectId } from "mongodb";

interface IParams {
    title: string, 
    collection: Collection<any>, 
    renamingItemID?: string, 
    parentField?: string, 
    parentId?: string
}

export const titleUniqueization = async ({title, collection, renamingItemID = '', 
    parentField = "", parentId = ""}: IParams) => {
    // const getTitleQueueCount = async function (copyIndex: number = 0) {
    //     let document = await collection.findOne({ _id: { $ne: renamingItemID }, name: (title + (copyIndex === 0 ? '' : `_${copyIndex}`)), 
    //         [parentField]: parentId});
    //     return document ? await getTitleQueueCount(copyIndex + 1) : copyIndex;
    // }

    // const copyIndex = await getTitleQueueCount();

    const count = (await collection.find({[parentField]: new ObjectId(parentId)}).toArray()).length;

    if (count > 0) {
        title += `_${count+1}`;
    }
    return title;
}