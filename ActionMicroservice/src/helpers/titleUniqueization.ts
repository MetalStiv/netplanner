import { Collection } from "mongodb";

export default async function titleUniqueization(title: string, collection: Collection<any>, renamingItemID: string = '') {
    const getTitleQueueCount = async function (copyIndex: number = 0) {
        let document = await collection.findOne({ _id: { $ne: renamingItemID }, name: (title + (copyIndex === 0 ? '' : `_${copyIndex}`)) });
        return document ? await getTitleQueueCount(copyIndex + 1) : copyIndex;
    }

    const copyIndex = await getTitleQueueCount();
    if (copyIndex > 0) {
        title += `_${copyIndex}`;
    }
    return title;
}