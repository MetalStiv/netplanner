import React, { useRef, useState } from "react";
import '../../styles/home/settings/index.scss';
import avatarOverlay from "../../assets/images/avatar-overlay.png";
import { observer } from "mobx-react-lite";
import { useRootStore } from "../../providers/rootProvider";
import { TUserStore } from "../../stores/userStore";
import { userMicroservice } from "../../common/axiosMicroservices";
import IUser from "../../model/IUser";
import { getBase64 } from "../../common/fileManipulations";
import { timeZones } from "../../common/timezones";
import { LanguageData, useLanguageContext } from "../../providers/languageProvider";

const SettingsTab: React.FC = observer(() => {
    const userStore: TUserStore = useRootStore()!.getUserStore();
    const lang: LanguageData | null = useLanguageContext();
    
    const [isEdittingName, setIsEdittingName] = useState<boolean>(false);
    const [tempName, setTempName] = useState<string>(userStore.getData()!.name);
    const [currentFile, setCurrentFile] = useState<File>();
    const inputFile = useRef<HTMLInputElement>(null);

    const changeName = (el: HTMLInputElement) => {
        setTempName(el.value)
    }

    const saveAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = event.target;
        const selectedFile = (files as FileList)[0];
        if (!selectedFile) return;

        const newAvatarBase64: string = await getBase64(selectedFile);
        if (newAvatarBase64 === "") return;

        const res = await userMicroservice.post("changeAvatar", {
            avatarBase64: newAvatarBase64
        });
        if (res.status === 200){
            const currentUser: IUser = {...userStore.getData()!, "avatarBase64": newAvatarBase64};
            userStore.setData(currentUser)
        }
    };
      
    const saveNameHandler = async () => {
        const res = await userMicroservice.post("changeName", {
            name: tempName
        });
        if (res.status === 200){
            const currentUser: IUser = {...userStore.getData()!, "name": tempName};
            userStore.setData(currentUser)
            setIsEdittingName(false);
        } 
    }

    const changeTimeZone = async (id: number) => {
        const res = await userMicroservice.post("changeTimeZone", {
            timeZoneId: id
        });
        if (res.status === 200){
            const currentUser: IUser = {...userStore.getData()!, "timeZoneId": id};
            userStore.setData(currentUser)
        } 
    }

    return (
        <div id="settingsTab">
            <div className="main">
                <div className="first-row">
                    <div className="user-info-panel panel">
                        <input type='file' id='file' ref={inputFile} onChange={saveAvatar} 
                            accept=".png, .jpeg, .bmp" style={{display: 'none'}}/>
                        <div className="avatar-container" onClick={() => inputFile.current?.click()}>
                            <img src={userStore.getData()?.avatarBase64} className="avatar" />
                            <div className="avatar-overlay-text">{lang!.langText.userPage.settingsTab.userInfo.changePhoto}</div>
                            <img src={avatarOverlay} className="avatar-overlay" />
                        </div>
                        <div className="panel-data-container">
                            <div className="title">{lang!.langText.userPage.settingsTab.userInfo.title}</div>
                            {
                                isEdittingName ? <div className="name-container">
                                        <input
                                            className='change-name-input'
                                            autoFocus={true}
                                            type="text"
                                            onBlur={saveNameHandler}
                                            value={tempName}
                                            onChange={e => changeName(e.target)}
                                            onKeyDown={e => {
                                                if (e.keyCode === 13) {
                                                    saveNameHandler();
                                                }
                                                if (e.keyCode === 27) {
                                                    setIsEdittingName(false);
                                                    setTempName(userStore.getData()!.name);
                                                }
                                            }}
                                        />
                                    </div>
                                    : <div className="name-container">
                                        <div className="user-name">{userStore.getData()?.name}</div>
                                        <span className="pencil-icon">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" 
                                                xmlns="http://www.w3.org/2000/svg"
                                                onClick={() => setIsEdittingName(true)}>
                                                <path d="M4 20.0001H3C3 20.2653 3.10536 20.5197 3.2929 20.7072C3.48043 
                                                    20.8948 3.73479 21.0001 4.00001 21.0001L4 20.0001ZM4 16.0001L3.29289 
                                                    15.293C3.10536 15.4805 3 15.7349 3 16.0001H4ZM14.8686 5.13146L14.1615 
                                                    4.42435L14.1615 4.42436L14.8686 5.13146ZM17.1313 5.13146L16.4242 
                                                    5.83857V5.83857L17.1313 5.13146ZM18.8686 6.86872L19.5757 6.16162V6.16162L18.8686 
                                                    6.86872ZM18.8686 9.13146L18.1615 8.42436V8.42436L18.8686 9.13146ZM8 
                                                    20.0001L8.00001 21.0001C8.26522 21.0001 8.51957 20.8947 8.70711 
                                                    20.7072L8 20.0001ZM19.5369 7.69112L20.4879 7.3821L19.5369 7.69112ZM19.5369 
                                                    8.30908L18.5858 8.00006L19.5369 8.30908ZM15.691 4.46325L15.382 
                                                    3.51219V3.51219L15.691 4.46325ZM16.3091 4.46325L16.6181 3.51219V3.51219L16.3091 
                                                    4.46325ZM12.7071 7.29301C12.3166 6.90248 11.6834 6.90248 11.2929 
                                                    7.29301C10.9024 7.68353 10.9024 8.3167 11.2929 8.70722L12.7071 
                                                    7.29301ZM15.2929 12.7072C15.6834 13.0977 16.3166 13.0977 16.7071 
                                                    12.7072C17.0976 12.3167 17.0976 11.6835 16.7071 11.293L15.2929 12.7072ZM5 
                                                    20.0001V16.0001H3V20.0001H5ZM4.70711 16.7072L15.5757 5.83857L14.1615 
                                                    4.42436L3.29289 15.293L4.70711 16.7072ZM16.4242 5.83857L18.1615 7.57583L19.5757 
                                                    6.16162L17.8385 4.42436L16.4242 5.83857ZM18.1615 8.42436L7.29289 19.293L8.70711 
                                                    20.7072L19.5757 9.83857L18.1615 8.42436ZM7.99999 19.0001L3.99999 19.0001L4.00001 
                                                    21.0001L8.00001 21.0001L7.99999 19.0001ZM18.1615 7.57583C18.3712 7.7855 18.4854 
                                                    7.9008 18.5611 7.98999C18.6292 8.07026 18.6058 8.06155 18.5858 8.00014L20.4879 
                                                    7.3821C20.3938 7.09237 20.2342 6.87046 20.0858 6.69562C19.9449 6.5297 19.7621 
                                                    6.34796 19.5757 6.16162L18.1615 7.57583ZM19.5757 9.83857C19.7621 9.65222 19.9449 
                                                    9.47049 20.0858 9.30456C20.2342 9.12971 20.3938 8.90781 20.4879 8.61809L18.5858 
                                                    8.00006C18.6058 7.93867 18.6292 7.92995 18.5611 8.01021C18.4854 8.09939 18.3712 
                                                    8.21469 18.1615 8.42436L19.5757 9.83857ZM18.5858 8.00014L18.5858 8.00006L20.4879 
                                                    8.61809C20.6184 8.2164 20.6184 7.78379 20.4879 7.3821L18.5858 8.00014ZM15.5757 
                                                    5.83857C15.7854 5.62891 15.9007 5.51472 15.9899 5.43903C16.0701 5.3709 16.0614 
                                                    5.39436 16 5.41431L15.382 3.51219C15.0923 3.60632 14.8704 3.76588 14.6955 
                                                    3.91432C14.5296 4.05517 14.3479 4.238 14.1615 4.42435L15.5757 5.83857ZM17.8385 
                                                    4.42436C17.6522 4.23806 17.4704 4.05522 17.3046 3.91439C17.1298 3.76596 16.9079 
                                                    3.60634 16.6181 3.51219L16.0001 5.41431C15.9386 5.39434 15.9299 5.37083 16.0101 
                                                    5.43896C16.0993 5.51468 16.2145 5.62885 16.4242 5.83857L17.8385 4.42436ZM16 
                                                    5.41431H16.0001L16.6181 3.51219C16.2164 3.38168 15.7837 3.38168 15.382 3.51219L16 
                                                    5.41431ZM11.2929 8.70722L15.2929 12.7072L16.7071 11.293L12.7071 7.29301L11.2929 
                                                    8.70722Z" fill="#176DEA"/>
                                            </svg>
                                        </span>
                                    </div>     
                            }
                            <div className="email-container">
                                <div className="field-name">Email:</div>
                                <div className="field-value">{userStore.getData()?.email}</div>
                                <span className="pencil-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" 
                                        xmlns="http://www.w3.org/2000/svg"
                                        onClick={() => alert(1)}>
                                        <path d="M4 20.0001H3C3 20.2653 3.10536 20.5197 3.2929 20.7072C3.48043 
                                            20.8948 3.73479 21.0001 4.00001 21.0001L4 20.0001ZM4 16.0001L3.29289 
                                            15.293C3.10536 15.4805 3 15.7349 3 16.0001H4ZM14.8686 5.13146L14.1615 
                                            4.42435L14.1615 4.42436L14.8686 5.13146ZM17.1313 5.13146L16.4242 
                                            5.83857V5.83857L17.1313 5.13146ZM18.8686 6.86872L19.5757 6.16162V6.16162L18.8686 
                                            6.86872ZM18.8686 9.13146L18.1615 8.42436V8.42436L18.8686 9.13146ZM8 
                                            20.0001L8.00001 21.0001C8.26522 21.0001 8.51957 20.8947 8.70711 
                                            20.7072L8 20.0001ZM19.5369 7.69112L20.4879 7.3821L19.5369 7.69112ZM19.5369 
                                            8.30908L18.5858 8.00006L19.5369 8.30908ZM15.691 4.46325L15.382 
                                            3.51219V3.51219L15.691 4.46325ZM16.3091 4.46325L16.6181 3.51219V3.51219L16.3091 
                                            4.46325ZM12.7071 7.29301C12.3166 6.90248 11.6834 6.90248 11.2929 
                                            7.29301C10.9024 7.68353 10.9024 8.3167 11.2929 8.70722L12.7071 
                                            7.29301ZM15.2929 12.7072C15.6834 13.0977 16.3166 13.0977 16.7071 
                                            12.7072C17.0976 12.3167 17.0976 11.6835 16.7071 11.293L15.2929 12.7072ZM5 
                                            20.0001V16.0001H3V20.0001H5ZM4.70711 16.7072L15.5757 5.83857L14.1615 
                                            4.42436L3.29289 15.293L4.70711 16.7072ZM16.4242 5.83857L18.1615 7.57583L19.5757 
                                            6.16162L17.8385 4.42436L16.4242 5.83857ZM18.1615 8.42436L7.29289 19.293L8.70711 
                                            20.7072L19.5757 9.83857L18.1615 8.42436ZM7.99999 19.0001L3.99999 19.0001L4.00001 
                                            21.0001L8.00001 21.0001L7.99999 19.0001ZM18.1615 7.57583C18.3712 7.7855 18.4854 
                                            7.9008 18.5611 7.98999C18.6292 8.07026 18.6058 8.06155 18.5858 8.00014L20.4879 
                                            7.3821C20.3938 7.09237 20.2342 6.87046 20.0858 6.69562C19.9449 6.5297 19.7621 
                                            6.34796 19.5757 6.16162L18.1615 7.57583ZM19.5757 9.83857C19.7621 9.65222 19.9449 
                                            9.47049 20.0858 9.30456C20.2342 9.12971 20.3938 8.90781 20.4879 8.61809L18.5858 
                                            8.00006C18.6058 7.93867 18.6292 7.92995 18.5611 8.01021C18.4854 8.09939 18.3712 
                                            8.21469 18.1615 8.42436L19.5757 9.83857ZM18.5858 8.00014L18.5858 8.00006L20.4879 
                                            8.61809C20.6184 8.2164 20.6184 7.78379 20.4879 7.3821L18.5858 8.00014ZM15.5757 
                                            5.83857C15.7854 5.62891 15.9007 5.51472 15.9899 5.43903C16.0701 5.3709 16.0614 
                                            5.39436 16 5.41431L15.382 3.51219C15.0923 3.60632 14.8704 3.76588 14.6955 
                                            3.91432C14.5296 4.05517 14.3479 4.238 14.1615 4.42435L15.5757 5.83857ZM17.8385 
                                            4.42436C17.6522 4.23806 17.4704 4.05522 17.3046 3.91439C17.1298 3.76596 16.9079 
                                            3.60634 16.6181 3.51219L16.0001 5.41431C15.9386 5.39434 15.9299 5.37083 16.0101 
                                            5.43896C16.0993 5.51468 16.2145 5.62885 16.4242 5.83857L17.8385 4.42436ZM16 
                                            5.41431H16.0001L16.6181 3.51219C16.2164 3.38168 15.7837 3.38168 15.382 3.51219L16 
                                            5.41431ZM11.2929 8.70722L15.2929 12.7072L16.7071 11.293L12.7071 7.29301L11.2929 
                                            8.70722Z" fill="#176DEA"/>
                                    </svg>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="user-balance-panel panel">
                        <div className="panel-data-container">
                            <div className="title">{lang!.langText.userPage.settingsTab.balance.title}</div>
                            <div className="balance-field">
                                <div>{0}</div>
                                <div>₽</div>
                            </div>
                            <div className="payment-history">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d={"M2.78217 6.93844L2.8995 7.67921H2.8995L2.78217 6.93844ZM6.93844 2.78217L7.67921 "+
                                        " 2.8995V2.8995L6.93844 2.78217ZM16.9389 18.0451L16.4981 17.4383L16.9389 18.0451ZM18.0451 "+
                                        " 16.9389L17.4383 16.4981L18.0451 16.9389ZM1.95491 16.9389L2.56168 16.4981L1.95491 "+
                                        " 16.9389ZM3.06107 18.0451L3.50191 17.4383L3.06107 18.0451ZM3.06107 1.95491L2.62024 "+
                                        " 1.34815L3.06107 1.95491ZM1.95491 3.06107L1.34815 2.62023L1.95491 3.06107ZM16.9389 "+
                                        " 1.95491L16.4981 2.56168L16.9389 1.95491ZM18.0451 3.06107L17.4383 3.50191L18.0451 "+
                                        " 3.06107ZM7 1.02893L6.97432 0.279368L7 1.02893ZM1.02893 7L0.279369 6.97432L1.02893 "+
                                        " 7ZM6 11.25C5.58579 11.25 5.25 11.5858 5.25 12C5.25 12.4142 5.58579 12.75 6 "+
                                        " 12.75V11.25ZM14 12.75C14.4142 12.75 14.75 12.4142 14.75 12C14.75 11.5858 14.4142 "+
                                        " 11.25 14 11.25V12.75ZM11 7.25C10.5858 7.25 10.25 7.58579 10.25 8C10.25 8.41421 "+
                                        " 10.5858 8.75 11 8.75V7.25ZM14 8.75C14.4142 8.75 14.75 8.41421 14.75 8C14.75 7.58579 "+
                                        " 14.4142 7.25 14 7.25V8.75ZM2.8995 7.67921C5.35988 7.28952 7.28952 5.35988 7.67921 "+
                                        " 2.8995L6.19768 2.66485C5.90965 4.48339 4.48339 5.90965 2.66485 6.19768L2.8995 "+
                                        " 7.67921ZM10 19.75C11.8582 19.75 13.312 19.751 14.4635 19.6263C15.6291 19.5 16.5734 "+
                                        " 19.2377 17.3798 18.6518L16.4981 17.4383C15.9901 17.8074 15.3399 18.0225 14.302 "+
                                        " 18.135C13.25 18.249 11.8916 18.25 10 18.25V19.75ZM18.25 10C18.25 11.8916 18.249 "+
                                        " 13.25 18.135 14.302C18.0225 15.3399 17.8074 15.9901 17.4383 16.4981L18.6518 "+
                                        " 17.3798C19.2377 16.5734 19.5 15.6291 19.6263 14.4635C19.751 13.312 19.75 11.8582 "+
                                        " 19.75 10H18.25ZM17.3798 18.6518C17.8679 18.2972 18.2972 17.8679 18.6518 "+
                                        " 17.3798L17.4383 16.4981C17.1762 16.8589 16.8589 17.1762 16.4981 17.4383L17.3798 "+
                                        " 18.6518ZM0.25 10C0.25 11.8582 0.24897 13.312 0.373727 14.4635C0.500005 15.6291 "+
                                        " 0.762323 16.5734 1.34815 17.3798L2.56168 16.4981C2.19259 15.9901 1.97745 15.3399 "+
                                        " 1.865 14.302C1.75103 13.25 1.75 11.8916 1.75 10H0.25ZM10 18.25C8.10843 18.25 "+
                                        " 6.74999 18.249 5.69804 18.135C4.66013 18.0225 4.00992 17.8074 3.50191 "+
                                        " 17.4383L2.62024 18.6518C3.42656 19.2377 4.37094 19.5 5.53648 19.6263C6.68798 "+
                                        " 19.751 8.14184 19.75 10 19.75V18.25ZM1.34815 17.3798C1.70281 17.8679 2.13209 "+
                                        " 18.2972 2.62024 18.6518L3.50191 17.4383C3.14111 17.1762 2.82382 16.8589 2.56168 "+
                                        " 16.4981L1.34815 17.3798ZM2.62024 1.34815C2.13209 1.70281 1.70281 2.13209 "+
                                        " 1.34815 2.62023L2.56168 3.50191C2.82381 3.14111 3.14111 2.82382 3.50191 "+
                                        " 2.56168L2.62024 1.34815ZM10 1.75C11.8916 1.75 13.25 1.75103 14.302 1.865C15.3399 "+
                                        " 1.97745 15.9901 2.19259 16.4981 2.56168L17.3798 1.34815C16.5734 0.762324 15.6291 "+
                                        " 0.500006 14.4635 0.373728C13.312 0.248971 11.8582 0.25 10 0.25V1.75ZM19.75 10C19.75 "+
                                        " 8.14184 19.751 6.68798 19.6263 5.53648C19.5 4.37094 19.2377 3.42656 18.6518 "+
                                        " 2.62023L17.4383 3.50191C17.8074 4.00992 18.0225 4.66013 18.135 5.69804C18.249 "+
                                        " 6.74999 18.25 8.10843 18.25 10H19.75ZM16.4981 2.56168C16.8589 2.82382 17.1762 "+
                                        " 3.14111 17.4383 3.50191L18.6518 2.62023C18.2972 2.13209 17.8679 1.70281 17.3798 "+
                                        " 1.34815L16.4981 2.56168ZM10 0.25C8.83522 0.25 7.83424 0.249906 6.97432 "+
                                        " 0.279368L7.02568 1.77849C7.85445 1.75009 8.82692 1.75 10 1.75V0.25ZM6.97432 "+
                                        " 0.279368C5.10087 0.343555 3.7239 0.546296 2.62024 1.34815L3.50191 2.56168C4.20746 "+
                                        " 2.04907 5.17075 1.84204 7.02568 1.77849L6.97432 0.279368ZM6.25 1.02892C6.24999 "+
                                        " 1.96617 6.24707 2.35298 6.19768 2.66485L7.67921 2.8995C7.75165 2.44215 7.74999 "+
                                        " 1.91121 7.75 1.02893L6.25 1.02892ZM1.75 10C1.75 8.82692 1.75009 7.85445 1.77849 "+
                                        " 7.02568L0.279369 6.97432C0.249906 7.83424 0.25 8.83522 0.25 10H1.75ZM1.77849 "+
                                        " 7.02568C1.84204 5.17075 2.04907 4.20746 2.56168 3.50191L1.34815 2.62023C0.546295 "+
                                        " 3.7239 0.343555 5.10087 0.279369 6.97432L1.77849 7.02568ZM1.02893 7.75C1.91121 "+
                                        " 7.74999 2.44215 7.75165 2.8995 7.67921L2.66485 6.19768C2.35298 6.24707 1.96618 "+
                                        " 6.24999 1.02892 6.25L1.02893 7.75ZM6 12.75H14V11.25H6V12.75ZM11 8.75H14V7.25H11V8.75Z"} 
                                        fill="#176DEA"/>
                                </svg>
                                <div className="field-name">{lang!.langText.userPage.settingsTab.balance.history}</div>
                            </div>
                        </div>
                    </div>
                    <div className="user-general-settings-panel panel">
                        <div className="panel-data-container">
                            <div className="title">{lang!.langText.userPage.settingsTab.generalSettings.title}</div>
                            <div className="subtitle">{lang!.langText.userPage.settingsTab.generalSettings.subtitle}</div>
                            <div className="panel-row">
                                <div className="field-name">{lang!.langText.userPage.settingsTab.generalSettings.language+":"}</div>
                                <select value={lang!.language}>
                                {
                                    lang!.languages.map(l => <option onClick={e => lang!.switchLanguage(l)}>
                                        {l}
                                    </option>)
                                }
                                </select>
                                <div className="field-name">{lang!.langText.userPage.settingsTab.generalSettings.timezone+":"}</div>
                                <select value={userStore.getData()?.timeZoneId}>
                                {
                                    timeZones.map(tz => <option value={tz.id} onClick={e => changeTimeZone(tz.id)}>
                                        {tz.text}
                                    </option>)
                                }
                                </select>
                            </div>
                            <div className="panel-row">
                                <div className="field-name">{lang!.langText.userPage.settingsTab.generalSettings.password}</div>
                                <div className="change-link">{lang!.langText.userPage.settingsTab.generalSettings.change}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="second-row">
                    <div className="user-personal-rate-panel panel">
                        <div className="panel-data-container">
                            <div className="title">{lang!.langText.userPage.settingsTab.personalRate.title}</div>
                        </div>
                    </div>
                    <div className="sub-column">
                        <div className="user-organization-panel panel">
                            <div className="panel-data-container">
                                <div className="title">{lang!.langText.userPage.settingsTab.organization.title}</div>
                                <div className="subtitle">{lang!.langText.userPage.settingsTab.organization.subtitle}</div>
                            </div>
                        </div>
                        <div className="user-metrics-panel panel">
                            <div className="panel-data-container">
                                <div className="title">{lang!.langText.userPage.settingsTab.metrics.title}</div>
                                <div className="subtitle">{lang!.langText.userPage.settingsTab.metrics.subtitle}</div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>

    );
})
export default SettingsTab;