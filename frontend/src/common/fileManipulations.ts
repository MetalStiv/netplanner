export const getBase64 = (file: File): Promise<string> => {
    return new Promise(resolve => {
        let baseURL: string | ArrayBuffer | null = "";

        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            baseURL = reader.result;
            typeof baseURL === "string" ? resolve(baseURL) : resolve("")
        };
    });
};