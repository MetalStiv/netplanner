export default function titleUniqueization(title: string, elems: any[], renamingItemID?: string) {
    let copyIndex = 0;
    while (true) {
        if (elems.find(item => item.id !== renamingItemID && item.title === (title + (copyIndex === 0 ? '' : `_${copyIndex}`)))) {
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