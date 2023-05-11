export default function titleUniqueization(title: string, elems: any[], renamingItemID?: string) {
    let copyIndex = 0;
    while (true) {
        if (elems.find(item => item.getID() !== renamingItemID && item.getTitle() === (title + (copyIndex === 0 ? '' : `_${copyIndex}`)))) {
            copyIndex++;
        }
        else {
            break;
        }
    }
    if (copyIndex > 0) {
        title += `_${copyIndex}`;
    }
    return title;
}